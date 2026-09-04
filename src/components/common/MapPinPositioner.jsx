import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Check, Building2, Target, Search, Loader2, Move, ArrowLeft, Plus, Minus } from 'lucide-react';

export default function MapPinPositioner({
  initialPosition = { lat: 27.648385, lng: 85.338022 },
  turfName = 'Hattiban Futsal Arena',
  onLocationConfirmed,
  onCancel,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [currentCenter, setCurrentCenter] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [placeName, setPlaceName] = useState('Fetching address...');
  
  const searchTimeoutRef = useRef(null);
  const reverseGeoTimeoutRef = useRef(null);

  // Reverse geocode to get a human-readable place name from coordinates
  const reverseGeocode = (lat, lng) => {
    if (reverseGeoTimeoutRef.current) {
      clearTimeout(reverseGeoTimeoutRef.current);
    }
    reverseGeoTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        if (data && data.display_name) {
          // Show a short readable address (first 2-3 parts)
          const parts = data.display_name.split(',').slice(0, 3).join(',');
          setPlaceName(parts);
        } else {
          setPlaceName('Unknown location');
        }
      } catch {
        setPlaceName('Address unavailable');
      }
    }, 600);
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [initialPosition.lat, initialPosition.lng],
      zoom: 16,
      zoomControl: false,
    });

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    map.on('movestart', () => setIsDragging(true));

    map.on('move', () => {
      const center = map.getCenter();
      setCurrentCenter({ lat: center.lat, lng: center.lng });
    });

    map.on('moveend', () => {
      setIsDragging(false);
      const center = map.getCenter();
      setCurrentCenter({ lat: center.lat, lng: center.lng });
      reverseGeocode(center.lat, center.lng);
    });

    const timer = setTimeout(() => map.invalidateSize(), 250);

    // Initial reverse geocode
    reverseGeocode(initialPosition.lat, initialPosition.lng);

    return () => {
      clearTimeout(timer);
      if (reverseGeoTimeoutRef.current) clearTimeout(reverseGeoTimeoutRef.current);
      map.remove();
    };
  }, [initialPosition]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setShowSuggestions(true);
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=5&countrycodes=np`
        );
        const data = await response.json();
        setSuggestions(data || []);
      } catch (err) {
        console.error('Nominatim autocomplete error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleSelectSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    setSearchQuery(item.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], 17, { animate: true, duration: 1.5 });
    }
  };

  const handleGPSFetch = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 17, { animate: true, duration: 1.5 });
        }
      },
      (error) => {
        setGpsLoading(false);
        alert(`Failed to fetch location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleConfirm = () => {
    if (onLocationConfirmed) onLocationConfirmed({ ...currentCenter, placeName });
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white w-full h-full font-sans flex flex-col overflow-hidden">
      
      {/* ── Full-width Top Navigation Bar ── */}
      <div className="w-full bg-white border-b border-slate-100 px-6 md:px-14 lg:px-20 py-4 z-10 shrink-0 relative shadow-sm">
        <div className="flex items-center justify-between gap-6">
          
          {/* Left: Back Button + Header with Subtitle */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Back Button Icon Box */}
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100/80 text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            
            {/* Header with Subtitle */}
            <div className="flex flex-col">
              <h2 className="text-base font-extrabold text-slate-900">Set Location</h2>
              <p className="text-xs font-medium text-slate-500">Drag the pin to confirm</p>
            </div>
          </div>

          {/* Center: Branding */}
          <a href="#" className="flex items-center gap-2.5 absolute left-1/2 -translate-x-1/2">
            <img
              src="/logo.png"
              alt="Turfio Logo"
              className="h-9 w-auto object-contain"
            />
            <span className="leading-tight hidden sm:block">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                TURFIO
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                Futsal, your way
              </span>
            </span>
          </a>

          {/* Right: Search Bar */}
          <div className="relative w-72 hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-5 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search location (e.g. Hattiban, Lalitpur)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchQuery && setShowSuggestions(true)}
                className="w-full pl-12 pr-10 py-3 rounded-full bg-slate-100 text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
              />
              {isSearching && (
                <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto divide-y divide-slate-50 overflow-hidden z-[1100]">
                {suggestions.map((item) => (
                  <button
                    key={item.place_id}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-5 py-3.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-start gap-2.5 cursor-pointer"
                  >
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="w-full md:hidden bg-white border-b border-slate-100 px-6 py-3 z-10 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-5 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search location (e.g. Hattiban, Lalitpur)"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchQuery && setShowSuggestions(true)}
            className="w-full pl-12 pr-10 py-3 rounded-full bg-slate-100 text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
          />
          {isSearching && (
            <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 animate-spin" />
          )}
        </div>

        {/* Autocomplete Dropdown Mobile */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto divide-y divide-slate-50 overflow-hidden z-[1100]">
            {suggestions.map((item) => (
              <button
                key={item.place_id}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full px-5 py-3.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-start gap-2.5 cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="truncate">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Map Workspace ── */}
      <div className="relative flex-1 bg-slate-100 min-h-0 z-0">
        <div ref={mapContainerRef} className="absolute inset-0" />

        {/* Center-fixed pin overlay with pin drop animation */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-[500]">
          <div 
            className="flex flex-col items-center select-none transition-all duration-200" 
            style={{ 
              transform: isDragging ? 'translateY(-34px) scale(1.05)' : 'translateY(-20px) scale(1)',
              transitionTimingFunction: isDragging ? 'cubic-bezier(0.1, 0.8, 0.25, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* Tooltip with drag icon */}
            <div className={`bg-slate-900 text-white px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 text-[11px] font-bold whitespace-nowrap mb-2.5 transition-opacity duration-200 border border-slate-700 ${isDragging ? 'opacity-0' : 'opacity-100'}`}>
              <Move className="h-3.5 w-3.5 text-lime-500" />
              <span className="tracking-wide">Drag to set pin</span>
            </div>

            {/* Pin */}
            <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(132,204,22,0.3)] border-3 border-white">
              <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center">
                <Building2 className="h-4 w-4 text-lime-500" />
              </div>
            </div>
            <div className="w-2.5 h-2.5 bg-lime-400 rotate-45 -mt-1.5 border-r-3 border-b-3 border-white"></div>
          </div>

          {/* Pin Shadow */}
          <div 
            className="w-5 h-1.5 bg-slate-950/25 rounded-full blur-[1px] transition-all duration-200"
            style={{
              transform: 'translateY(-12px)',
              scale: isDragging ? '0.6' : '1',
              opacity: isDragging ? '0.4' : '1',
              transitionTimingFunction: isDragging ? 'cubic-bezier(0.1, 0.8, 0.25, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          />
        </div>

        {/* Map Controls: Custom Zoom + GPS Button Group */}
        <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-0 bg-white rounded-full overflow-hidden shadow-xl border border-slate-100">
          {/* Zoom In Button */}
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2.5 text-slate-800 hover:bg-slate-50 transition-all cursor-pointer active:scale-95 flex items-center justify-center border-b border-slate-100"
            title="Zoom in"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
          </button>

          {/* Zoom Out Button */}
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2.5 text-slate-800 hover:bg-slate-50 transition-all cursor-pointer active:scale-95 flex items-center justify-center border-b border-slate-100"
            title="Zoom out"
          >
            <Minus className="h-4 w-4 stroke-[3]" />
          </button>

          {/* Current Location Button */}
          <button
            type="button"
            onClick={handleGPSFetch}
            disabled={gpsLoading}
            className="p-2.5 text-slate-800 hover:bg-slate-50 transition-all cursor-pointer active:scale-95 disabled:bg-slate-50 flex items-center justify-center"
            title="Use current location"
          >
            {gpsLoading ? (
              <Loader2 className="h-4 w-4 text-slate-600 animate-spin" />
            ) : (
              <Target className="h-4 w-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </div>

      {/* ── Bottom Navigation / Action Bar ── */}
      <div className="w-full bg-white border-t border-slate-100 px-6 md:px-14 lg:px-20 py-5 shadow-[0_-10px_35px_rgba(15,23,42,0.03)] z-10 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center shrink-0">
              <MapPin className="h-6 w-6 text-lime-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-base font-extrabold text-slate-900 truncate">
                {turfName || 'Your Futsal Arena'}
              </h4>
              <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate max-w-sm">
                {placeName}
              </p>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5 font-mono">
                {currentCenter.lat.toFixed(6)}, {currentCenter.lng.toFixed(6)}
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-end w-full md:w-auto">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3.5 rounded-full border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer min-w-[120px] text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-10 py-3.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(163,230,53,0.2)] min-w-[180px]"
            >
              <Check className="h-4 w-4 stroke-[3]" />
              <span>Confirm entrance location</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
