import { useState, useEffect, useRef, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
} from 'lucide-react';
import {
  MAPTILER_KEY,
  getTurfioLightStyle,
  getSatelliteStyleUrl,
  FALLBACK_OSM_STYLE,
  FALLBACK_SATELLITE_STYLE,
} from '../../../shared/config/mapConfig';

export default function TurfSingleLocationMap({
  turf,
  onNavigateRoute,
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const mapRef = useRef(null);
  const pinMarkerRef = useRef(null);

  const [mapStyleMode, setMapStyleMode] = useState('vector'); // 'vector' | 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Extract exact coordinates from all potential turf data shapes:
  // 1. Direct lat / lng
  // 2. GeoJSON location.coordinates: [lng, lat]
  // 3. coordinates array: [lng, lat]
  const coordinates = turf?.location?.coordinates || turf?.coordinates;
  const rawLng = turf?.lng ?? turf?.lon ?? (Array.isArray(coordinates) ? coordinates[0] : null);
  const rawLat = turf?.lat ?? (Array.isArray(coordinates) ? coordinates[1] : null);

  const lat = Number(rawLat) || 27.71585;
  const lng = Number(rawLng) || 85.36209;
  const title = turf?.title || turf?.name || 'Futsal Venue';
  const address = turf?.address?.area
    ? `${turf.address.area}, ${turf.address.city || 'Kathmandu'}`
    : typeof turf?.location === 'string'
    ? turf.location
    : turf?.address || 'Kathmandu, Nepal';
  const activeQuery = `${title}, ${address}`;

  // Helper to get active style spec / URL
  const getActiveStyle = useCallback(
    (mode) => {
      if (mode === 'satellite') {
        return getSatelliteStyleUrl(MAPTILER_KEY);
      }
      return getTurfioLightStyle(MAPTILER_KEY);
    },
    []
  );

  // Initialize MapLibre GL map instance centered on this single turf
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: getActiveStyle('vector'),
        center: [lng, lat],
        zoom: 15.5,
        attributionControl: false,
      });
    } catch (e) {
      console.warn('MapLibre init error, falling back to OSM:', e);
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: FALLBACK_OSM_STYLE,
        center: [lng, lat],
        zoom: 15.5,
        attributionControl: false,
      });
    }

    mapRef.current = map;

    // Register official Maki POI icons for high fidelity vector map
    const registerCustomIcons = (targetMap) => {
      if (!targetMap.hasImage('school_pin')) {
        const schoolSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
            <defs>
              <filter id="shadow-school" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
              </filter>
            </defs>
            <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-school)"/>
            <circle cx="24" cy="21" r="15" fill="#6A8D9D"/>
            <g transform="translate(16.5, 13.5)">
              <path d="M7.5 1.5L0.5 5.25L7.5 9L13.5 5.75V10.5H15V5.25L7.5 1.5ZM3 8.35V11.25C3 12.75 5 13.5 7.5 13.5C10 13.5 12 12.75 12 11.25V8.35L7.5 10.75L3 8.35Z" fill="#FFFFFF"/>
            </g>
          </svg>
        `;
        const img = new Image();
        img.onload = () => {
          if (!targetMap.hasImage('school_pin')) targetMap.addImage('school_pin', img, { pixelRatio: 1.3 });
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(schoolSvg);
      }

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
          if (!targetMap.hasImage('cafe_pin')) targetMap.addImage('cafe_pin', cafeImg, { pixelRatio: 1.7 });
        };
        cafeImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(cafeSvg);
      }

      if (!targetMap.hasImage('restaurant_pin')) {
        const restSvg = `
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
          if (!targetMap.hasImage('restaurant_pin')) targetMap.addImage('restaurant_pin', restImg, { pixelRatio: 1.7 });
        };
        restImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(restSvg);
      }

      if (!targetMap.hasImage('pharmacy_pin')) {
        const pharmSvg = `
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
          if (!targetMap.hasImage('pharmacy_pin')) targetMap.addImage('pharmacy_pin', pharmImg, { pixelRatio: 1.7 });
        };
        pharmImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(pharmSvg);
      }
    };

    map.on('load', () => registerCustomIcons(map));
    map.on('styledata', () => registerCustomIcons(map));
    map.on('styleimagemissing', () => registerCustomIcons(map));

    // Error fallback
    map.on('error', (e) => {
      const errStatus = e?.error?.status || e?.status;
      if (errStatus === 401 || errStatus === 403 || errStatus === 404 || e?.error?.message?.includes('403') || e?.error?.message?.includes('401')) {
        if (map.isStyleLoaded()) {
          map.setStyle(mapStyleMode === 'satellite' ? FALLBACK_SATELLITE_STYLE : FALLBACK_OSM_STYLE);
        }
      }
    });

    // Add clean single destination pin matching the exact white teardrop with lime venue icon
    const pinEl = document.createElement('div');
    pinEl.className = 'relative select-none cursor-pointer group flex items-center justify-center';
    pinEl.style.width = '46px';
    pinEl.style.height = '56px';

    pinEl.innerHTML = `
      <div class="relative w-[46px] h-[56px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
        <svg width="46" height="56" viewBox="0 0 46 56" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full block">
          <!-- Clean White outer teardrop casing -->
          <path
            d="M23 2C12.5066 2 4 10.5066 4 21C4 32.5 18 47 23 53.5C28 47 42 32.5 42 21C42 10.5066 33.4934 2 23 2Z"
            fill="white"
            stroke="#E2E8F0"
            stroke-width="1.5"
          />
          <!-- Vibrant Neon Lime Inner Badge -->
          <circle cx="23" cy="21" r="14.5" fill="#84CC16" />
        </svg>
        <!-- Center White Arena Glyph -->
        <div class="absolute top-[13px] left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-none text-white">
          <svg class="h-4 w-4 stroke-[2.6] stroke-white fill-none" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
            <path d="M6 12H4a2 2 0 0 0-2 2v8h4"/>
            <path d="M18 9h2a2 2 0 0 1 2 2v11h-4"/>
            <path d="M10 6h4"/>
            <path d="M10 10h4"/>
            <path d="M10 14h4"/>
            <path d="M10 18h4"/>
          </svg>
        </div>
      </div>
    `;

    // Marker anchored precisely to the bottom tip of the teardrop path
    const marker = new maplibregl.Marker({ element: pinEl, anchor: 'bottom', offset: [0, 2.5] })
      .setLngLat([lng, lat])
      .addTo(map);

    pinMarkerRef.current = marker;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      if (pinMarkerRef.current) pinMarkerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map coordinates when turf changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [lng, lat],
      zoom: 15.5,
      duration: 1000,
      essential: true,
    });
    if (pinMarkerRef.current) {
      pinMarkerRef.current.setLngLat([lng, lat]);
    }
  }, [lat, lng]);

  const activeStyleModeRef = useRef(mapStyleMode);
  // Style update
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (activeStyleModeRef.current === mapStyleMode) return;
    activeStyleModeRef.current = mapStyleMode;

    const targetStyle = getActiveStyle(mapStyleMode);
    if (!map.isStyleLoaded()) {
      map.once('styledata', () => {
        map.setStyle(targetStyle);
      });
    } else {
      map.setStyle(targetStyle);
    }
  }, [mapStyleMode, getActiveStyle]);

  // Controls
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => mapRef.current?.resize(), 100);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`relative w-full h-full bg-slate-100 rounded-3xl overflow-hidden select-none ${className}`}
    >
      {/* MapLibre Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ── Top-Left Venue Floating Info Card (Identical to TurfListingPage) ── */}
      <div className="absolute top-3.5 left-3.5 z-20 flex items-center justify-between gap-3 rounded-2xl bg-white/98 backdrop-blur-md px-3.5 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E7EBE5] max-w-[280px] sm:max-w-[320px]">
        <div className="min-w-0 pr-1">
          <h4 className="text-sm font-bold text-[#0f172a] leading-tight truncate">
            {title}
          </h4>
          <p className="text-xs text-slate-500 font-medium truncate mt-0.5 leading-tight">
            {address}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Larger Map */}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6F7C8F] hover:text-[#172033] hover:bg-slate-50 transition-colors border border-transparent hover:border-[#E7EBE5]"
            title="View larger map"
          >
            <ExternalLink className="h-3.5 w-3.5 stroke-[2.2]" />
          </a>
          {/* Directions - Neon Lime Button */}
          {onNavigateRoute ? (
            <button
              type="button"
              onClick={() => onNavigateRoute(turf)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Get Turn-by-Turn Directions"
            >
              <svg className="h-3.5 w-3.5 fill-[#0f172a]" viewBox="0 0 24 24">
                <path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
              </svg>
            </button>
          ) : (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeQuery)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] shadow-xs transition-all active:scale-95 cursor-pointer"
              title="Directions"
            >
              <svg className="h-3.5 w-3.5 fill-[#0f172a]" viewBox="0 0 24 24">
                <path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
              </svg>
            </a>
          )}
        </div>
      </div>

      {/* ── Top-Right Standard Navigation & Zoom Controls ── */}
      <div className="absolute top-3.5 right-3.5 z-20 flex flex-col bg-white/98 backdrop-blur-md rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E7EBE5] overflow-hidden divide-y divide-[#E7EBE5]">
        <button
          type="button"
          onClick={handleZoomIn}
          className="p-2.5 text-[#172033] hover:bg-slate-50 hover:text-[#0f172a] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Plus className="h-4 w-4 stroke-[2.4]" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="p-2.5 text-[#172033] hover:bg-slate-50 hover:text-[#0f172a] transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="h-4 w-4 stroke-[2.4]" />
        </button>
      </div>

      {/* ── Bottom-Left Satellite / Vector Style Switcher ── */}
      <div className="absolute bottom-4 left-4 z-20">
        <button
          type="button"
          onClick={() =>
            setMapStyleMode((prev) => (prev === 'vector' ? 'satellite' : 'vector'))
          }
          className="group relative h-11 w-11 rounded-xl overflow-hidden border border-[#E7EBE5] shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:scale-105 transition-all cursor-pointer bg-slate-900"
          title={mapStyleMode === 'vector' ? 'Switch to Satellite view' : 'Switch to Clean Map view'}
        >
          <img
            src={
              mapStyleMode === 'vector'
                ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/13/3592/5801'
                : 'https://a.tile.openstreetmap.org/13/5801/3592.png'
            }
            alt="Layer switch"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <span className="absolute bottom-0 inset-x-0 text-[7.5px] font-extrabold text-white text-center drop-shadow-sm bg-black/60 py-0.5">
            {mapStyleMode === 'vector' ? 'Satellite' : 'Map'}
          </span>
        </button>
      </div>

      {/* ── Bottom-Right Fullscreen Control ── */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white/98 backdrop-blur-md text-[#172033] shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E7EBE5] hover:bg-slate-50 transition-colors cursor-pointer"
          title={isFullscreen ? 'Exit full screen' : 'Toggle full screen view'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 stroke-[2.2]" />
          ) : (
            <Maximize2 className="h-4 w-4 stroke-[2.2]" />
          )}
        </button>
      </div>

      {/* ── Bottom-Right Subtle Attribution ── */}
      <div className="absolute bottom-1 right-15 z-10 hidden sm:flex items-center gap-2 text-[10px] text-slate-500 bg-white/80 backdrop-blur-xs px-2.5 py-0.5 rounded-md pointer-events-none">
        <span>© MapTiler</span>
        <span>•</span>
        <span>© OpenStreetMap</span>
      </div>
    </div>
  );
}
