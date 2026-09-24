import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Loader2, Navigation } from 'lucide-react';

/**
 * LocationAutocomplete Component
 * 
 * Provides real-time location suggestions using Nominatim (OpenStreetMap) API.
 * Features:
 * - Debounced search (300ms)
 * - Nepal-focused results (countrycodes=np)
 * - Displays up to 5 suggestions
 * - "Nearby" option using geolocation (asks for permission on first use)
 * - Keyboard navigation support (TODO)
 * 
 * Props:
 * - value: Current input value
 * - onChange: Called when input changes
 * - onSelect: Called when user selects a suggestion { lat, lon, display_name }
 * - placeholder: Input placeholder text
 * - className: Additional CSS classes for the container
 */
export default function LocationAutocomplete({
  value = '',
  onChange,
  onSelect,
  placeholder = 'Search location',
  className = '',
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const searchTimeoutRef = useRef(null);
  const containerRef = useRef(null);
  const suggestionsRef = useRef(null);
  const geolocationPermissionAskedRef = useRef(localStorage.getItem('geolocation_permission_asked') === 'true');

  useEffect(() => {
    if (showSuggestions && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    }
  }, [showSuggestions]);

  // Debounced search function
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Replace with backend endpoint once available
      // For now, calling Nominatim directly (rate limiting handled server-side in future)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=np`
      );
      const data = await response.json();
      setSuggestions(data || []);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Location search error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get user's current location
  const handleNearby = useCallback(async () => {
    // Mark that permission has been asked
    if (!geolocationPermissionAskedRef.current) {
      localStorage.setItem('geolocation_permission_asked', 'true');
      geolocationPermissionAskedRef.current = true;
    }

    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          onSelect?.({
            lat: latitude,
            lon: longitude,
            display_name: data.address?.city || data.address?.town || data.address?.county || 'Your Location',
          });
          setSuggestions([]);
          setShowSuggestions(false);
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          // Still proceed with coordinates even if reverse geocoding fails
          onSelect?.({
            lat: latitude,
            lon: longitude,
            display_name: 'Your Location',
          });
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setIsGettingLocation(false);
      }
    );
  }, [onSelect]);

  // Handle input changes with debouncing
  const handleInputChange = (e) => {
    const query = e.target.value;
    onChange?.(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for debounced search
    if (query.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    onSelect?.({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon),
      display_name: suggestion.display_name,
    });
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        !suggestionsRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSuggestions]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative z-50 ${className}`} ref={containerRef}>
      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          // Show suggestions if there are any, or show empty state to prompt user
          setShowSuggestions(true);
        }}
        placeholder={placeholder}
        className="w-full border-0 bg-transparent p-0 text-[14px] font-medium text-slate-400 outline-none placeholder:text-slate-400"
        aria-autocomplete="list"
        aria-expanded={showSuggestions}
        aria-controls="location-suggestions"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && createPortal(
        <div
          ref={suggestionsRef}
          id="location-suggestions"
          className="fixed z-[100000] min-w-[300px] rounded-2xl bg-white border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          {/* "Nearby" Option (Always shown when focused) */}
          <button
            type="button"
            onClick={handleNearby}
            disabled={isGettingLocation}
            className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 group flex items-start gap-3 disabled:opacity-50"
          >
            <Navigation className="h-4 w-4 text-slate-400 shrink-0 mt-0.5 group-hover:text-lime-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">
                {isGettingLocation ? 'Getting your location...' : 'Nearby'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {isGettingLocation ? 'Please wait' : 'Show turfs near me'}
              </p>
            </div>
            {isGettingLocation && (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400 shrink-0" />
            )}
          </button>

          {/* Search Suggestions */}
          {suggestions.length > 0 && suggestions.map((suggestion, idx) => (
            <button
              key={`${suggestion.place_id}-${idx}`}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 group flex items-start gap-3"
            >
              <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5 group-hover:text-lime-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {suggestion.display_name.split(',')[0]}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {suggestion.display_name.split(',').slice(1, 3).join(',')}
                </p>
              </div>
            </button>
          ))}

          {/* Empty State with Nearby hint */}
          {!isLoading && suggestions.length === 0 && value.trim() && (
            <div className="px-4 py-4">
              <p className="text-sm text-slate-500 text-center">
                No locations found for "{value}"
              </p>
            </div>
          )}

          {/* No input state - show helpful text */}
          {!value.trim() && suggestions.length === 0 && (
            <div className="px-4 py-4">
              <p className="text-xs text-slate-400 text-center">
                Start typing to search or use Nearby
              </p>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
