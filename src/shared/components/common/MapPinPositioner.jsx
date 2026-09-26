import { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MapPin,
  Check,
  Building2,
  Target,
  Search,
  Loader2,
  Move,
  Plus,
  Minus,
} from 'lucide-react';
import {
  MAPTILER_KEY,
  getTurfioLightStyle,
  FALLBACK_OSM_STYLE,
} from '../../config/mapConfig';
import { useToast } from './toastContext';
import LocationAutocomplete from './LocationAutocomplete';

export default function MapPinPositioner({
  initialPosition = { lat: 27.648385, lng: 85.338022 },
  turfName = 'Hattiban Futsal Arena',
  onLocationConfirmed,
  onCancel,
}) {
  const { showToast } = useToast();
  const mapContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const mapRef = useRef(null);
  const [currentCenter, setCurrentCenter] = useState({
    lat: Number(initialPosition.lat) || 27.648385,
    lng: Number(initialPosition.lng) || 85.338022,
  });
  const [isDragging, setIsDragging] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [placeName, setPlaceName] = useState('Fetching address...');

  const reverseGeoTimeoutRef = useRef(null);

  // Reverse geocode to get a human-readable place name from coordinates
  const reverseGeocode = useCallback((lat, lng) => {
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
  }, []);

  // Helper to register standard Maki POI icons for MapLibre
  const registerCustomIcons = useCallback((targetMap) => {
    // 1. Cafe / Coffee Pin
    if (!targetMap.hasImage('cafe_pin')) {
      const cafeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <defs>
            <filter id="shadow-cafe" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-cafe)"/>
          <circle cx="24" cy="21" r="15" fill="#FF7010"/>
          <g transform="translate(16.5, 13.5)">
            <path d="M1 2V9C1 10.1 1.9 11 3 11H9C10.1 11 11 10.1 11 9V7H12C13.1 7 14 6.1 14 5V4C14 2.9 13.1 2 12 2H1ZM11 5V4H12.5V5H11ZM0 12V13H15V12H0Z" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
      const cafeImg = new Image();
      cafeImg.onload = () => {
        if (!targetMap.hasImage('cafe_pin')) {
          targetMap.addImage('cafe_pin', cafeImg, { pixelRatio: 1.7 });
        }
      };
      cafeImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cafeSvg);
    }

    // 2. Restaurant Pin
    if (!targetMap.hasImage('restaurant_pin')) {
      const restaurantSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <defs>
            <filter id="shadow-rest" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-rest)"/>
          <circle cx="24" cy="21" r="15" fill="#FF7010"/>
          <g transform="translate(16.5, 13.5)">
            <path d="M2 1C1.4 1 1 1.4 1 2V6C1 7.1 1.9 8 3 8V14H5V8C6.1 8 7 7.1 7 6V2C7 1.4 6.6 1 6 1H2ZM2.5 2.5H3.5V5.5H2.5V2.5ZM4.5 2.5H5.5V5.5H4.5V2.5ZM11 1C9.3 1 8 2.3 8 4V8C8 8.6 8.4 9 9 9V14H11V9C11.6 9 12 8.6 12 8V2C12 1.4 11.6 1 11 1ZM9.5 2.5C9.8 2.5 10 2.7 10 3V7.5H9.5V2.5Z" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
      const restImg = new Image();
      restImg.onload = () => {
        if (!targetMap.hasImage('restaurant_pin')) {
          targetMap.addImage('restaurant_pin', restImg, { pixelRatio: 1.7 });
        }
      };
      restImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(restaurantSvg);
    }

    // 3. Pharmacy Pin
    if (!targetMap.hasImage('pharmacy_pin')) {
      const pharmacySvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <defs>
            <filter id="shadow-pharm" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-pharm)"/>
          <circle cx="24" cy="21" r="15" fill="#EF4A5A"/>
          <g transform="translate(16.5, 13.5)">
            <path d="M10.5 1L9 1.5L10 4.5H1C0.4 4.5 0 4.9 0 5.5V6.5C0 9.5 2.2 12 5 12.4V13.5H3V14.5H12V13.5H10V12.4C12.8 12 15 9.5 15 6.5V5.5C15 4.9 14.6 4.5 14 4.5H11.5L10.5 1Z" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
      const pharmImg = new Image();
      pharmImg.onload = () => {
        if (!targetMap.hasImage('pharmacy_pin')) {
          targetMap.addImage('pharmacy_pin', pharmImg, { pixelRatio: 1.7 });
        }
      };
      pharmImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(pharmacySvg);
    }

    // 4. Parking Pin
    if (!targetMap.hasImage('parking_pin')) {
      const parkingSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <defs>
            <filter id="shadow-park" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.22"/>
            </filter>
          </defs>
          <circle cx="24" cy="24" r="21" fill="#FFFFFF" filter="url(#shadow-park)"/>
          <circle cx="24" cy="24" r="17.5" fill="#B4CBFE"/>
          <g transform="translate(16.5, 16.5)">
            <path d="M3 1H8.5C10.4 1 12 2.6 12 4.5C12 6.4 10.4 8 8.5 8H6V14H3V1ZM6 3.5V5.5H8.5C9 5.5 9.5 5 9.5 4.5C9.5 4 9 3.5 8.5 3.5H6Z" fill="#5243FA"/>
          </g>
        </svg>
      `;
      const parkImg = new Image();
      parkImg.onload = () => {
        if (!targetMap.hasImage('parking_pin')) {
          targetMap.addImage('parking_pin', parkImg, { pixelRatio: 1.7 });
        }
      };
      parkImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(parkingSvg);
    }

    // 5. Store Pin
    if (!targetMap.hasImage('store_pin')) {
      const storeSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <defs>
            <filter id="shadow-store" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-store)"/>
          <circle cx="24" cy="21" r="15" fill="#0088FF"/>
          <g transform="translate(16.5, 13.5)">
            <path d="M5 2C5 0.9 5.9 0 7 0H8C9.1 0 10 0.9 10 2V3H13C13.6 3 14 3.4 14 4L15 13C15 14.1 14.1 15 13 15H2C0.9 15 0 14.1 0 13L1 4C1 3.4 1.4 3 2 3H5V2ZM6.5 2V3H8.5V2H6.5ZM7.5 6C6.1 6 5 7.1 5 8.5C5 9.9 6.1 11 7.5 11C8.9 11 10 9.9 10 8.5C10 7.1 8.9 6 7.5 6Z" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
      const storeImg = new Image();
      storeImg.onload = () => {
        if (!targetMap.hasImage('store_pin')) {
          targetMap.addImage('store_pin', storeImg, { pixelRatio: 1.7 });
        }
      };
      storeImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(storeSvg);
    }

    // 6. Fuel Pin
    if (!targetMap.hasImage('fuel_pin')) {
      const fuelSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <defs>
            <filter id="shadow-fuel" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-fuel)"/>
          <circle cx="24" cy="21" r="15" fill="#1A73E8"/>
          <g transform="translate(16.5, 13.5)">
            <path d="M1 2C1 0.9 1.9 0 3 0H9C10.1 0 11 0.9 11 2V13C11 14.1 10.1 15 9 15H3C1.9 15 1 14.1 1 13V2ZM3 2V5H9V2H3ZM12 4C12 3.4 12.4 3 13 3C13.6 3 14 3.4 14 4V10.5C14 11.3 13.3 12 12.5 12H12V10.5H12.5C12.8 10.5 13 10.3 13 10V5.5C12.4 5.5 12 5.1 12 4.5V4Z" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
      const fuelImg = new Image();
      fuelImg.onload = () => {
        if (!targetMap.hasImage('fuel_pin')) {
          targetMap.addImage('fuel_pin', fuelImg, { pixelRatio: 1.7 });
        }
      };
      fuelImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(fuelSvg);
    }

    // 7. Hospital Pin
    if (!targetMap.hasImage('hospital_pin')) {
      const hospitalSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <defs>
            <filter id="shadow-hosp" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-hosp)"/>
          <circle cx="24" cy="21" r="15" fill="#EA4335"/>
          <g transform="translate(16.5, 13.5)">
            <path d="M5.5 1.5H9.5V5.5H13.5V9.5H9.5V13.5H5.5V9.5H1.5V5.5H5.5V1.5Z" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
      const hospImg = new Image();
      hospImg.onload = () => {
        if (!targetMap.hasImage('hospital_pin')) {
          targetMap.addImage('hospital_pin', hospImg, { pixelRatio: 1.7 });
        }
      };
      hospImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(hospitalSvg);
    }

    // 8. Bank Pin
    if (!targetMap.hasImage('bank_pin')) {
      const bankSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
          <defs>
            <filter id="shadow-bank" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
            </filter>
          </defs>
          <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-bank)"/>
          <circle cx="24" cy="21" r="15" fill="#0D9488"/>
          <g transform="translate(16.5, 13.5)">
            <path d="M7.5 1L1 4.5V6H14V4.5L7.5 1ZM2 7V12H3.5V7H2ZM5.75 7V12H7.25V7H5.75ZM9.5 7V12H11V7H9.5ZM13 7V12H14V7H13ZM1 13V14H14V13H1Z" fill="#FFFFFF"/>
          </g>
        </svg>
      `;
      const bankImg = new Image();
      bankImg.onload = () => {
        if (!targetMap.hasImage('bank_pin')) {
          targetMap.addImage('bank_pin', bankImg, { pixelRatio: 1.7 });
        }
      };
      bankImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(bankSvg);
    }
  }, []);

  const targetLng = Number(initialPosition.lng) || 85.338022;
  const targetLat = Number(initialPosition.lat) || 27.648385;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: getTurfioLightStyle(MAPTILER_KEY),
        center: [targetLng, targetLat],
        zoom: 16,
        attributionControl: false,
      });
    } catch (e) {
      console.warn('MapLibre init error, falling back to OSM:', e);
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: FALLBACK_OSM_STYLE,
        center: [targetLng, targetLat],
        zoom: 16,
        attributionControl: false,
      });
    }

    mapRef.current = map;

    map.on('load', () => {
      registerCustomIcons(map);
      map.resize();
    });
    map.on('styledata', () => {
      registerCustomIcons(map);
    });
    map.on('styleimagemissing', () => {
      registerCustomIcons(map);
    });

    map.on('dragstart', () => setIsDragging(true));
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

    map.on('error', (e) => {
      const errStatus = e?.error?.status || e?.status;
      if (
        errStatus === 401 ||
        errStatus === 403 ||
        errStatus === 404 ||
        e?.error?.message?.includes('403') ||
        e?.error?.message?.includes('401')
      ) {
        map.setStyle(FALLBACK_OSM_STYLE);
      }
    });

    // Explicitly trigger a resize on initial mount and after animation frame
    const timer = setTimeout(() => {
      map?.resize();
    }, 100);

    const resizeObserver = new ResizeObserver(() => {
      map?.resize();
    });
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    // Initial reverse geocode
    reverseGeocode(targetLat, targetLng);

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
      if (reverseGeoTimeoutRef.current) clearTimeout(reverseGeoTimeoutRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, [targetLat, targetLng, registerCustomIcons, reverseGeocode]);

  const handleSelectLocationFromAutocomplete = (location) => {
    const lat = location.lat;
    const lng = location.lon;
    setSearchQuery(location.display_name);
    setCurrentCenter({ lat, lng });
    // Fly to the selected location
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: 17,
        duration: 1500,
      });
    }
    reverseGeocode(lat, lng);
  };

  const handleGPSFetch = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'error');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;
        if (mapRef.current) {
          mapRef.current.flyTo({ center: [longitude, latitude], zoom: 17, duration: 1500, essential: true });
        }
      },
      (error) => {
        setGpsLoading(false);
        showToast(`Failed to fetch location: ${error.message}`, 'error');
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
          
          {/* Left: Branding */}
          <a href="#" className="flex items-center gap-2.5 shrink-0">
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

          {/* Center: Header + Subtitle */}
          <div className="flex flex-col items-center text-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <h2 className="text-base font-extrabold text-slate-900">Set Location</h2>
            <p className="text-xs font-medium text-slate-500">Drag the pin to confirm</p>
          </div>

          {/* Right: Search Bar */}
          <div className="relative w-72 hidden md:block">
            <div className="relative flex items-center">
              <Search className="absolute left-5 h-4 w-4 text-slate-400 pointer-events-none z-10" />
              <div className="w-full pl-12 pr-4">
                <LocationAutocomplete
                  value={searchQuery}
                  onChange={setSearchQuery}
                  onSelect={handleSelectLocationFromAutocomplete}
                  placeholder="Search location (e.g. Hattiban, Lalitpur)"
                  className="py-3 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="w-full md:hidden bg-white border-b border-slate-100 px-6 py-3 z-10 shrink-0">
        <div className="relative flex items-center">
          <Search className="absolute left-5 h-4 w-4 text-slate-400 pointer-events-none z-10" />
          <div className="w-full pl-12 pr-4">
            <LocationAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              onSelect={handleSelectLocationFromAutocomplete}
              placeholder="Search location (e.g. Hattiban, Lalitpur)"
              className="py-3 text-xs"
            />
          </div>
        </div>
      </div>

      {/* ── Map Workspace ── */}
      <div ref={wrapperRef} className="relative flex-1 bg-slate-100 min-h-0 z-0">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />

        {/* Center-fixed pin overlay with pin drop animation */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center z-[500]">
          <div 
            className="flex flex-col items-center select-none transition-all duration-200 origin-bottom" 
            style={{ 
              transform: isDragging ? 'translateY(-28px) scale(1.06)' : 'translateY(-18px) scale(1)',
              transitionTimingFunction: isDragging ? 'cubic-bezier(0.1, 0.8, 0.25, 1)' : 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            {/* Tooltip with drag icon */}
            <div className={`bg-white/95 backdrop-blur-sm text-slate-800 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-extrabold whitespace-nowrap mb-1.5 transition-all duration-200 border border-slate-200/80 ${isDragging ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'}`}>
              <Move className="h-3.5 w-3.5 text-lime-600" />
              <span className="tracking-wide">Drag to set pin</span>
            </div>

            {/* Google Maps style Turf Teardrop Pin */}
            <div className="relative flex items-center justify-center drop-shadow-[0_8px_16px_rgba(0,0,0,0.18)]">
              <svg width="46" height="56" viewBox="0 0 46 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Clean White outer teardrop casing */}
                <path
                  d="M23 2C12.5066 2 4 10.5066 4 21C4 32.5 18 47 23 53.5C28 47 42 32.5 42 21C42 10.5066 33.4934 2 23 2Z"
                  fill="white"
                  stroke="#E2E8F0"
                  strokeWidth="1.5"
                />
                {/* Vibrant Neon Lime Inner Badge */}
                <circle cx="23" cy="21" r="14.5" fill="#84CC16" />
              </svg>
              {/* Center White Arena Glyph */}
              <div className="absolute top-[13px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none text-white">
                <Building2 className="h-4 w-4 stroke-[2.6]" />
              </div>
            </div>
          </div>

          {/* Pin Ground Anchor Shadow */}
          <div 
            className="w-4 h-1.5 bg-slate-950/30 rounded-full blur-[1px] transition-all duration-200 -mt-1"
            style={{
              scale: isDragging ? '0.5' : '1',
              opacity: isDragging ? '0.3' : '0.9',
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
      <div className="w-full bg-white border-t border-slate-100 px-6 md:px-14 lg:px-20 py-4 shadow-sm z-10 shrink-0">
        <div className="flex items-center justify-between gap-6">
          
          {/* Left: Venue & Address Info */}
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 rounded-full bg-slate-100/80 flex items-center justify-center shrink-0">
              <MapPin className="h-4 w-4 text-slate-700" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-extrabold text-slate-900 truncate leading-tight">
                  {turfName || 'Your Futsal Arena'}
                </h4>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-mono font-medium text-slate-500 shrink-0">
                  {currentCenter.lat.toFixed(5)}, {currentCenter.lng.toFixed(5)}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5 max-w-md">
                {placeName}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 justify-end shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-full border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-3 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-[0_2px_8px_rgba(163,230,53,0.25)] hover:shadow-[0_4px_12px_rgba(163,230,53,0.35)]"
            >
              <Check className="h-3.5 w-3.5 stroke-[3] text-slate-950" />
              <span>Confirm Location</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
