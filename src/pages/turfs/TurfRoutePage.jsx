import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Bike,
  Footprints,
  Navigation,
  MapPin,
  Clock,
  Compass,
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  Calendar,
  Star,
  Menu,
  Bookmark,
  History,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Share2,
  Info,
  CornerUpRight,
  CornerUpLeft,
  ArrowUp,
  RotateCw,
  Locate,
  AlertCircle,
  Shield,
  Loader2,
  X,
  MapPinOff,
} from 'lucide-react';
import {
  MAPTILER_KEY,
  DEFAULT_MAP_CENTER,
  getTurfioLightStyle,
  getSatelliteStyleUrl,
  FALLBACK_OSM_STYLE,
  FALLBACK_SATELLITE_STYLE,
} from '../../config/mapConfig';
import {
  getRoute,
  getCurrentLocation,
  checkLocationPermission,
  KATHMANDU_PRESET_LOCATIONS,
  TRANSPORT_MODES,
  formatDistance,
  formatDuration,
  formatArrivalTime,
} from '../../services/routeService';
import turfService from '../../services/turfService';

// Maneuver icon helper based on instruction text or type
function getManeuverIcon(step) {
  const text = (step.instruction || '').toLowerCase();
  if (text.includes('right') || step.maneuverType === 2) {
    return CornerUpRight;
  }
  if (text.includes('left') || step.maneuverType === 3) {
    return CornerUpLeft;
  }
  if (text.includes('roundabout') || text.includes('u-turn')) {
    return RotateCw;
  }
  if (text.includes('arrived') || text.includes('destination') || step.maneuverType === 4) {
    return CheckCircle2;
  }
  return ArrowUp;
}

export default function TurfRoutePage({
  initialTurf = null,
  allTurfs: propTurfs = null,
  onBack,
  onBookTurf,
  onViewTurfDetails,
}) {
  const [fetchedTurfs, setFetchedTurfs] = useState([]);

  useEffect(() => {
    if (!propTurfs || propTurfs.length === 0) {
      turfService.getTurfs().then((data) => {
        if (data && data.length > 0) {
          setFetchedTurfs(data);
        }
      }).catch((err) => {
        console.warn('Failed to load turfs for route page:', err);
      });
    }
  }, [propTurfs]);

  const allTurfs = propTurfs && propTurfs.length > 0 ? propTurfs : fetchedTurfs;

  // Destination selection (defaults to initialTurf or first turf)
  const [selectedTurf, setSelectedTurf] = useState(() => {
    if (initialTurf) return initialTurf;
    return allTurfs[0] || null;
  });

  useEffect(() => {
    if (initialTurf) {
      setSelectedTurf(initialTurf);
    } else if (!selectedTurf && allTurfs.length > 0) {
      setSelectedTurf(allTurfs[0]);
    }
  }, [initialTurf, allTurfs]);

  // Origin selection: default to Thamel (or GPS if triggered)
  const [originLocation, setOriginLocation] = useState({
    name: 'Thamel (Kathmandu Center)',
    lat: 27.7154,
    lon: 85.3123,
    isGps: false,
  });

  // Live user GPS coordinate (separate from selected origin if user picks a custom origin)
  const [userGpsCoord, setUserGpsCoord] = useState(null);

  // Permission state: 'granted' | 'prompt' | 'denied' | 'unknown'
  const [permissionState, setPermissionState] = useState('unknown');
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [permissionDeniedBanner, setPermissionDeniedBanner] = useState(false);

  // Costing / Transport mode: 'auto' | 'motorcycle' | 'bicycle' | 'pedestrian'
  const [costing, setCosting] = useState('auto');

  // Source POI Search & Picker state
  const [isOriginPickerOpen, setIsOriginPickerOpen] = useState(false);
  const [originSearchQuery, setOriginSearchQuery] = useState('');
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [originSearchError, setOriginSearchError] = useState(null);
  const originSearchTimeoutRef = useRef(null);

  // Route calculation state
  const [routeData, setRouteData] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [routeError, setRouteError] = useState(null);
  const [hoveredStepIndex, setHoveredStepIndex] = useState(null);
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);

  // Map state & markers refs
  const mapContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const mapRef = useRef(null);
  const originMarkerRef = useRef(null);
  const destMarkerRef = useRef(null);
  const userGpsMarkerRef = useRef(null);
  const midpointBadgeMarkerRef = useRef(null);
  const stepHoverMarkerRef = useRef(null);

  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [mapStyleMode, setMapStyleMode] = useState('vector'); // 'vector' | 'satellite'

  // Destination coordinates helper (Destination is locked to selectedTurf)
  const destinationCoords = useMemo(() => {
    if (!selectedTurf) return { lat: 27.71585, lon: 85.36209 };
    return {
      lat: selectedTurf.lat,
      lon: selectedTurf.lng || selectedTurf.lon,
    };
  }, [selectedTurf]);

  // Debounced search handler for source POI / location search (reusing Nominatim API)
  const handleOriginSearchChange = (val) => {
    setOriginSearchQuery(val);
    setOriginSearchError(null);
    if (originSearchTimeoutRef.current) {
      clearTimeout(originSearchTimeoutRef.current);
    }
    if (!val.trim()) {
      setOriginSuggestions([]);
      return;
    }
    originSearchTimeoutRef.current = setTimeout(async () => {
      setIsSearchingOrigin(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&limit=6&countrycodes=np`
        );
        if (!response.ok) {
          throw new Error('Geocoding request failed');
        }
        const data = await response.json();
        setOriginSuggestions(data || []);
      } catch (err) {
        console.error('[RoutePage] Origin search error:', err);
        setOriginSearchError('Unable to load search results.');
        setOriginSuggestions([]);
      } finally {
        setIsSearchingOrigin(false);
      }
    }, 400);
  };

  const handleSelectOriginSuggestion = (item) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    const parts = (item.display_name || '').split(',');
    const name = parts.slice(0, 2).join(',').trim() || item.display_name;

    setOriginLocation({
      name,
      lat,
      lon,
      isGps: false,
    });
    setIsOriginPickerOpen(false);
    setOriginSearchQuery('');
    setOriginSuggestions([]);
  };

  // Check initial permission status on mount
  useEffect(() => {
    async function checkPerm() {
      const state = await checkLocationPermission();
      setPermissionState(state);

      const hasAsked = localStorage.getItem('turfio_location_prompted');

      if (state === 'granted') {
        try {
          const pos = await getCurrentLocation();
          setUserGpsCoord({ lat: pos.lat, lon: pos.lon });
          setOriginLocation({
            name: 'My Current Location (GPS)',
            lat: pos.lat,
            lon: pos.lon,
            isGps: true,
          });
        } catch (e) {
          console.warn('[RoutePage] Auto-GPS fetch failed:', e.message);
        }
      } else if (state === 'denied') {
        setPermissionDeniedBanner(true);
      } else if (state === 'prompt' && !hasAsked) {
        setShowPermissionModal(true);
      }
    }
    checkPerm();
  }, []);

  // Request user's live GPS
  const handleUseCurrentLocation = async () => {
    setIsLocatingUser(true);
    setRouteError(null);
    setPermissionDeniedBanner(false);
    setShowPermissionModal(false);
    localStorage.setItem('turfio_location_prompted', 'true');

    try {
      const pos = await getCurrentLocation();
      setUserGpsCoord({ lat: pos.lat, lon: pos.lon });
      setOriginLocation({
        name: 'My Current Location (GPS)',
        lat: pos.lat,
        lon: pos.lon,
        isGps: true,
      });
      setPermissionState('granted');
      setIsOriginPickerOpen(false);
    } catch (err) {
      console.error('GPS error:', err.message);
      setPermissionState('denied');
      setPermissionDeniedBanner(true);
      setRouteError(err.message || 'Could not fetch current GPS location.');
    } finally {
      setIsLocatingUser(false);
    }
  };

  // Dismiss permission modal and pick preset
  const handleDismissPermissionModal = (presetLoc = null) => {
    setShowPermissionModal(false);
    localStorage.setItem('turfio_location_prompted', 'true');
    if (presetLoc) {
      setOriginLocation({
        name: presetLoc.name,
        lat: presetLoc.lat,
        lon: presetLoc.lon,
        isGps: false,
      });
    }
  };


  // Fetch Route whenever Origin, Destination, or Costing changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchDirections() {
      if (!originLocation.lat || !originLocation.lon || !destinationCoords.lat || !destinationCoords.lon) {
        return;
      }

      setIsLoadingRoute(true);
      setRouteError(null);

      try {
        const route = await getRoute(
          { lat: originLocation.lat, lon: originLocation.lon },
          { lat: destinationCoords.lat, lon: destinationCoords.lon },
          costing
        );

        if (!isCancelled) {
          setRouteData(route);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Route calculation error:', err);
          setRouteError(err.message || 'Could not calculate route between selected points.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingRoute(false);
        }
      }
    }

    fetchDirections();

    return () => {
      isCancelled = true;
    };
  }, [originLocation, destinationCoords, costing]);

  // ──────────────────────────────────────────
  // MAP INITIALIZATION & ROUTE RENDERING
  // ──────────────────────────────────────────

  const routeDataRef = useRef(routeData);
  routeDataRef.current = routeData;

  // Helper to ensure GeoJSON source and polyline layers exist on the map
  const ensureRouteLayers = useCallback((map, geometry) => {
    if (!map || !map.isStyleLoaded()) return;

    const coords = geometry && geometry.length > 0 ? geometry : [];

    if (!map.getSource('route-source')) {
      map.addSource('route-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords,
          },
        },
      });

      // Layer 1: Outer soft glow
      if (!map.getLayer('route-glow')) {
        map.addLayer({
          id: 'route-glow',
          type: 'line',
          source: 'route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#2563eb',
            'line-width': 12,
            'line-opacity': 0.25,
            'line-blur': 3,
          },
        });
      }

      // Layer 2: Clean dark casing
      if (!map.getLayer('route-casing')) {
        map.addLayer({
          id: 'route-casing',
          type: 'line',
          source: 'route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#1e3a8a',
            'line-width': 7.5,
            'line-opacity': 0.9,
          },
        });
      }

      // Layer 3: Vibrant core route line (Google Maps Royal Blue)
      if (!map.getLayer('route-line')) {
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-source',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#3b82f6',
            'line-width': 5,
            'line-opacity': 1,
          },
        });
      }
    } else {
      const source = map.getSource('route-source');
      if (source && coords.length > 0) {
        source.setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coords,
          },
        });
      }
    }
  }, []);

  // Helper to create and attach all map markers reliably
  const updateMapMarkers = useCallback((map) => {
    if (!map) return;

    // Remove existing markers first
    if (originMarkerRef.current) {
      originMarkerRef.current.remove();
      originMarkerRef.current = null;
    }
    if (destMarkerRef.current) {
      destMarkerRef.current.remove();
      destMarkerRef.current = null;
    }
    if (userGpsMarkerRef.current) {
      userGpsMarkerRef.current.remove();
      userGpsMarkerRef.current = null;
    }
    if (midpointBadgeMarkerRef.current) {
      midpointBadgeMarkerRef.current.remove();
      midpointBadgeMarkerRef.current = null;
    }

    // ── 1. SOURCE / ORIGIN PIN (Clean Google Maps Blue Pin) ──
    if (originLocation.lat && originLocation.lon) {
      const startCoord = (routeDataRef.current?.geometry && routeDataRef.current.geometry.length > 0)
        ? routeDataRef.current.geometry[0]
        : [originLocation.lon, originLocation.lat];

      const el = document.createElement('div');
      el.className = 'origin-pin-node';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.cursor = 'pointer';
      el.style.userSelect = 'none';
      el.style.zIndex = '35';

      el.innerHTML = `
        <div style="width: 22px; height: 22px; border-radius: 50%; background: #ffffff; box-shadow: 0 3px 10px rgba(37, 99, 235, 0.35); border: 2.5px solid #2563eb; display: flex; align-items: center; justify-content: center;">
          <div style="width: 8px; height: 8px; border-radius: 50%; background: #2563eb;"></div>
        </div>
      `;

      originMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(startCoord)
        .addTo(map);
    }

    // ── 2. DESTINATION PIN (Exact Custom White Teardrop with Neon Lime Badge) ──
    if (destinationCoords.lat && destinationCoords.lon) {
      const destCoord = (routeDataRef.current?.geometry && routeDataRef.current.geometry.length > 0)
        ? routeDataRef.current.geometry[routeDataRef.current.geometry.length - 1]
        : [destinationCoords.lon, destinationCoords.lat];

      const el = document.createElement('div');
      el.className = 'dest-pin-node relative select-none cursor-pointer group flex items-center justify-center';
      el.style.width = '46px';
      el.style.height = '56px';
      el.style.zIndex = '40';

      el.innerHTML = `
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

      destMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom', offset: [0, 2.5] })
        .setLngLat(destCoord)
        .addTo(map);
    }

    // ── 3. USER REAL-TIME GPS POSITION (If different from start) ──
    if (userGpsCoord?.lat && userGpsCoord?.lon && !originLocation.isGps) {
      const el = document.createElement('div');
      el.className = 'user-gps-node';
      el.style.width = '24px';
      el.style.height = '24px';
      el.style.position = 'relative';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.pointerEvents = 'none';
      el.style.zIndex = '30';

      el.innerHTML = `
        <div style="position: absolute; inset: -6px; background: rgba(37, 99, 235, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 14px; height: 14px; border-radius: 50%; background: #2563eb; border: 2.5px solid #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>
      `;

      userGpsMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([userGpsCoord.lon, userGpsCoord.lat])
        .addTo(map);
    }

    // ── 4. FLOATING MIDPOINT DURATION BADGE ON ROUTE ──
    const activeRoute = routeDataRef.current;
    if (activeRoute?.geometry && activeRoute.geometry.length > 2) {
      const midIndex = Math.floor(activeRoute.geometry.length / 2);
      const midCoord = activeRoute.geometry[midIndex];

      let modeIconSvg = `<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9C2.1 11 2 11.5 2 12v4c0 .6.4 1 1 1h2m10 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m-14 0a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0"/></svg>`;
      if (costing === 'motorcycle') {
        modeIconSvg = `<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;
      } else if (costing === 'pedestrian') {
        modeIconSvg = `<svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>`;
      }

      const el = document.createElement('div');
      el.className = 'midpoint-badge-node';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.alignItems = 'center';
      el.style.cursor = 'pointer';
      el.style.userSelect = 'none';
      el.style.zIndex = '32';

      el.innerHTML = `
        <div style="padding: 4px 10px; border-radius: 9999px; background: #ffffff; color: #0f172a; font-weight: 800; font-size: 11.5px; box-shadow: 0 4px 14px rgba(0,0,0,0.18); border: 1.5px solid #e2e8f0; display: flex; align-items: center; gap: 5px; white-space: nowrap;">
          <span style="color: #2563eb; display: flex; align-items: center;">${modeIconSvg}</span>
          <span>${formatDuration(activeRoute.durationSeconds)}</span>
          <span style="color: #64748b; font-weight: 600; font-size: 10.5px;">(${formatDistance(activeRoute.distanceMeters)})</span>
        </div>
        <div style="width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #ffffff; margin-top: -1px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));"></div>
      `;

      midpointBadgeMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(midCoord)
        .addTo(map);
    }
  }, [originLocation, destinationCoords, selectedTurf, userGpsCoord, costing]);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialStyle =
      mapStyleMode === 'satellite'
        ? getSatelliteStyleUrl(MAPTILER_KEY)
        : getTurfioLightStyle(MAPTILER_KEY);

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: [destinationCoords.lon, destinationCoords.lat] || DEFAULT_MAP_CENTER,
      zoom: 13,
      pitch: 20,
      bearing: 0,
      attributionControl: false,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

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

    map.on('load', () => {
      registerCustomIcons(map);
      ensureRouteLayers(map, routeDataRef.current?.geometry);
      updateMapMarkers(map);

      if (routeDataRef.current?.geometry && routeDataRef.current.geometry.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        routeDataRef.current.geometry.forEach((coord) => bounds.extend(coord));
        map.fitBounds(bounds, {
          padding: { top: 90, bottom: 90, left: 440, right: 90 },
          maxZoom: 16,
          duration: 1200,
        });
      }
    });

    map.on('styledata', () => {
      registerCustomIcons(map);
    });
    map.on('styleimagemissing', () => {
      registerCustomIcons(map);
    });

    map.on('error', (e) => {
      console.warn('[MapLibre] Style fallback triggered:', e.error?.message);
      if (map.isStyleLoaded()) {
        if (mapStyleMode === 'satellite') {
          map.setStyle(FALLBACK_SATELLITE_STYLE);
        } else {
          map.setStyle(FALLBACK_OSM_STYLE);
        }
      }
    });

    return () => {
      if (originMarkerRef.current) originMarkerRef.current.remove();
      if (destMarkerRef.current) destMarkerRef.current.remove();
      if (userGpsMarkerRef.current) userGpsMarkerRef.current.remove();
      if (midpointBadgeMarkerRef.current) midpointBadgeMarkerRef.current.remove();
      if (stepHoverMarkerRef.current) stepHoverMarkerRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const activeStyleModeRef = useRef(mapStyleMode);
  // Switch map style mode
  useEffect(() => {
    if (!mapRef.current) return;
    if (activeStyleModeRef.current === mapStyleMode) return;
    activeStyleModeRef.current = mapStyleMode;

    const styleSpec =
      mapStyleMode === 'satellite'
        ? getSatelliteStyleUrl(MAPTILER_KEY)
        : getTurfioLightStyle(MAPTILER_KEY);

    const applyStyle = () => {
      const map = mapRef.current;
      if (!map) return;
      map.setStyle(styleSpec);

      const handleStyleLoad = () => {
        const m = mapRef.current;
        if (!m) return;
        ensureRouteLayers(m, routeDataRef.current?.geometry);
        updateMapMarkers(m);
      };

      map.once('style.load', handleStyleLoad);
    };

    if (!mapRef.current.isStyleLoaded()) {
      mapRef.current.once('styledata', applyStyle);
    } else {
      applyStyle();
    }
  }, [mapStyleMode, ensureRouteLayers, updateMapMarkers]);

  // Smooth ResizeObserver to update MapLibre GL viewport frame-by-frame during CSS sidebar transition
  useEffect(() => {
    if (!mapContainerRef.current) return;
    let animFrameId = null;

    const resizeObserver = new ResizeObserver(() => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  // Update Route Polyline & Markers on Map whenever data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update all markers
    updateMapMarkers(map);

    // Update GeoJSON Route Line
    if (routeData?.geometry && routeData.geometry.length > 0) {
      ensureRouteLayers(map, routeData.geometry);

      const bounds = new maplibregl.LngLatBounds();
      routeData.geometry.forEach((coord) => bounds.extend(coord));
      bounds.extend([originLocation.lon, originLocation.lat]);
      bounds.extend([destinationCoords.lon, destinationCoords.lat]);

      map.fitBounds(bounds, {
        padding: { top: 90, bottom: 140, left: 140, right: 120 },
        maxZoom: 16,
        duration: 1200,
      });
    }
  }, [routeData, originLocation, destinationCoords, selectedTurf, userGpsCoord, costing, ensureRouteLayers, updateMapMarkers]);

  // Recenter map on route bounds
  const handleRecenterRoute = useCallback(() => {
    const map = mapRef.current;
    if (!map || !routeData?.geometry || routeData.geometry.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    routeData.geometry.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds, {
      padding: { top: 90, bottom: 140, left: 140, right: 120 },
      maxZoom: 16,
      duration: 1000,
    });
  }, [routeData]);

  // Handle collapsible sidebar toggle - map remains completely still
  const handleToggleCollapse = useCallback(() => {
    setIsPanelCollapsed((prev) => !prev);
  }, []);

  // Step hover pin highlighting
  const handleStepHover = (step, index) => {
    setHoveredStepIndex(index);
    const map = mapRef.current;
    if (!map || !routeData?.geometry) return;

    let coord = null;
    if (step.beginShapeIndex !== null && routeData.geometry[step.beginShapeIndex]) {
      coord = routeData.geometry[step.beginShapeIndex];
    } else {
      const fractionIndex = Math.min(
        Math.floor((index / Math.max(routeData.steps.length - 1, 1)) * (routeData.geometry.length - 1)),
        routeData.geometry.length - 1
      );
      coord = routeData.geometry[fractionIndex];
    }

    if (coord) {
      if (!stepHoverMarkerRef.current) {
        const el = document.createElement('div');
        el.className = 'step-pin flex items-center justify-center h-4 w-4 rounded-full bg-blue-500 ring-4 ring-slate-900/40 shadow-md';
        stepHoverMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
          .setLngLat(coord)
          .addTo(map);
      } else {
        stepHoverMarkerRef.current.setLngLat(coord);
      }
    }
  };

  const handleStepLeave = () => {
    setHoveredStepIndex(null);
    if (stepHoverMarkerRef.current) {
      stepHoverMarkerRef.current.remove();
      stepHoverMarkerRef.current = null;
    }
  };

  return (
    <div ref={wrapperRef} className="relative h-screen w-full overflow-hidden bg-slate-50 font-sans flex flex-col">
      {/* ─── MAIN CONTENT CONTAINER (MAP CANVAS UNDERLAY + OVERLAY SIDEBAR) ─── */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* ══════════════════════════════════════
            RIGHT INTERACTIVE MAP CANVAS (FULL BACKGROUND UNDERLAY)
           ══════════════════════════════════════ */}
        <main className="absolute inset-0 h-full w-full bg-slate-100 overflow-hidden z-0">
          <div ref={mapContainerRef} className="h-full w-full" />

          {/* ── Top-Right Standard Navigation & Zoom Controls ── */}
          <div className="absolute top-4 right-4 z-30 flex flex-col bg-white/98 backdrop-blur-md rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E7EBE5] overflow-hidden divide-y divide-[#E7EBE5]">
            <button
              type="button"
              onClick={() => mapRef.current?.zoomIn()}
              className="p-2.5 text-[#172033] hover:bg-slate-50 hover:text-[#0f172a] transition-colors cursor-pointer"
              title="Zoom In"
            >
              <Plus className="h-4 w-4 stroke-[2.4]" />
            </button>
            <button
              type="button"
              onClick={() => mapRef.current?.zoomOut()}
              className="p-2.5 text-[#172033] hover:bg-slate-50 hover:text-[#0f172a] transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="h-4 w-4 stroke-[2.4]" />
            </button>
            <button
              type="button"
              onClick={handleRecenterRoute}
              className="p-2.5 text-[#172033] hover:bg-slate-50 hover:text-[#0f172a] transition-colors cursor-pointer"
              title="Recenter Route"
            >
              <Compass className="h-4 w-4 stroke-[2.2]" />
            </button>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocatingUser}
              className="p-2.5 text-[#172033] hover:bg-slate-50 hover:text-[#0f172a] transition-colors cursor-pointer disabled:opacity-50"
              title="Locate Me (GPS)"
            >
              {isLocatingUser ? (
                <Loader2 className="h-4 w-4 animate-spin text-lime-600" />
              ) : (
                <Locate className="h-4 w-4 stroke-[2.2]" />
              )}
            </button>
          </div>

          {/* ── Bottom-Left Satellite / Vector Style Switcher ── */}
          <div
            className={`absolute bottom-4 z-30 transition-[left] duration-300 ease-in-out ${
              isPanelCollapsed ? 'left-[88px]' : 'left-4 lg:left-[366px]'
            }`}
          >
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

          {/* Bottom Right Venue Card Pill on Map with high z-index */}
          {selectedTurf && (
            <div className="absolute bottom-4 right-4 z-50 pointer-events-auto hidden sm:flex items-center gap-3.5 rounded-2xl bg-white/98 p-3 pr-4 shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#E7EBE5] max-w-sm backdrop-blur-md">
              <img
                src={selectedTurf.image}
                alt={selectedTurf.title}
                className="h-12 w-12 rounded-2xl object-cover shrink-0 shadow-xs"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/image.png';
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-900">{selectedTurf.rating || 4.8}</span>
                  <span className="text-[11px] text-slate-400 font-medium">({selectedTurf.reviews || 120})</span>
                </div>
                <h4 className="text-xs font-black text-slate-900 truncate">{selectedTurf.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{selectedTurf.location}</p>
              </div>
              <button
                type="button"
                onClick={() => onBookTurf?.(selectedTurf)}
                className="rounded-full bg-lime-400 px-4 py-2 text-xs font-black text-slate-950 hover:bg-lime-500 transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
              >
                Book
              </button>
            </div>
          )}
        </main>

        {/* ══════════════════════════════════════
            LEFT FLOATING SIDEBAR (OVERLAY ON MAP)
           ══════════════════════════════════════ */}
        <aside
          className={`absolute top-0 bottom-0 left-0 z-20 shrink-0 bg-white/98 backdrop-blur-md border-r border-slate-200/90 flex flex-col shadow-2xl max-h-[48vh] lg:max-h-full overflow-hidden transition-[width] duration-300 ease-in-out ${
            isPanelCollapsed
              ? 'w-[72px] lg:w-[72px]'
              : 'w-full lg:w-[350px]'
          }`}
        >
          <div className="relative w-full h-full overflow-hidden">
            {/* ─── SLIM COLLAPSED ICON RAIL (GOOGLE MAPS STYLE) ─── */}
            <div
              className={`absolute inset-0 w-[72px] flex flex-col items-center justify-between py-4 px-1.5 overflow-y-auto select-none transition-opacity duration-200 ${
                isPanelCollapsed ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* Top Action Items */}
              <div className="flex flex-col items-center gap-3.5 w-full">
                {/* Hamburger Menu Toggle -> Expand Panel */}
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                  title="Expand Directions Panel"
                >
                  <Menu className="h-5 w-5 stroke-[2.3]" />
                </button>

                {/* Saved Turfs Button */}
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="flex flex-col items-center gap-1 w-full py-1 text-slate-600 hover:text-slate-900 group cursor-pointer"
                  title="Saved Venues"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl group-hover:bg-slate-100 transition-colors">
                    <Bookmark className="h-4.5 w-4.5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold tracking-tight">Saved</span>
                </button>

                {/* Recents Button */}
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="flex flex-col items-center gap-1 w-full py-1 text-slate-600 hover:text-slate-900 group cursor-pointer"
                  title="Recent Searches"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl group-hover:bg-slate-100 transition-colors">
                    <History className="h-4.5 w-4.5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-bold tracking-tight">Recents</span>
                </button>

                {/* Subtle Divider */}
                <div className="w-8 border-t border-slate-200 my-1" />

                {/* Current Active Trip Capsule */}
                {selectedTurf && (
                  <button
                    type="button"
                    onClick={handleToggleCollapse}
                    className="flex flex-col items-center gap-1 w-full py-1 group cursor-pointer"
                    title={`${selectedTurf.title} (${routeData ? formatDuration(routeData.durationSeconds) : 'Calculating...'})`}
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 group-hover:scale-105 transition-all shadow-xs">
                      {costing === 'motorcycle' ? (
                        <Bike className="h-4.5 w-4.5" />
                      ) : costing === 'pedestrian' ? (
                        <Navigation className="h-4.5 w-4.5" />
                      ) : (
                        <Car className="h-4.5 w-4.5 stroke-[2.2]" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 truncate max-w-[62px] text-center leading-tight">
                      {selectedTurf.title?.split(' ')[0] || 'Venue'}...
                    </span>
                    <span className="text-[9.5px] font-semibold text-slate-500">
                      {routeData ? formatDuration(routeData.durationSeconds) : 'Route'}
                    </span>
                  </button>
                )}
              </div>

              {/* Bottom "Get app" Action */}
              <div className="w-full flex flex-col items-center pt-2">
                <div className="w-8 border-t border-slate-200 mb-2" />
                <button
                  type="button"
                  onClick={handleToggleCollapse}
                  className="flex flex-col items-center gap-1 w-full py-1 text-slate-600 hover:text-slate-900 group cursor-pointer"
                  title="Get Turfio Mobile App"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl group-hover:bg-slate-100 transition-colors">
                    <Smartphone className="h-4.5 w-4.5 stroke-[2]" />
                  </div>
                  <span className="text-[9.5px] font-bold text-slate-600 group-hover:text-slate-900">Get app</span>
                </button>
              </div>
            </div>

            {/* ─── FULL EXPANDED DIRECTIONS PANEL ─── */}
            <div
              className={`absolute inset-0 w-[350px] flex flex-col transition-opacity duration-200 ${
                isPanelCollapsed ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 pointer-events-auto z-10'
              }`}
            >
              {/* Top Brand Header with Collapse Button */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b border-slate-100/80 w-[350px] shrink-0">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onBack?.();
                  }}
                  className="flex items-center gap-2.5 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  <img
                    src="/logo.png"
                    alt="Turfio Logo"
                    className="h-9 w-auto object-contain"
                  />
                  <span className="leading-tight">
                    <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                      TURFIO
                    </span>
                    <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                      Futsal, your way
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleToggleCollapse}
                    className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title="Collapse to Sidebar Rail"
                  >
                    <ChevronLeft className="h-4.5 w-4.5 stroke-[2.2]" />
                  </button>
                </div>
              </div>

              {/* Scrollable controls container */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-200 w-[350px]">
                {/* 0. LOCATION OFF / PERMISSION DENIED WARNING BANNER */}
                {permissionDeniedBanner && (
                  <div className="rounded-2xl bg-amber-50/90 p-3.5 border border-amber-200/80 text-xs font-medium text-amber-900 flex items-start gap-2.5">
                    <MapPinOff className="h-4 w-4 shrink-0 text-amber-700 mt-0.5" />
                    <div className="flex-1">
                      <span className="font-bold text-amber-950 block">GPS Location Access is Off</span>
                      <span className="text-[11px] text-amber-800">
                        Location permission is off. Using your selected landmark as starting point.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      className="text-[11px] font-bold text-lime-800 underline decoration-lime-600 shrink-0 cursor-pointer"
                    >
                      Retry GPS
                    </button>
                  </div>
                )}

                {/* 1. TRANSPORT MODE TABS (AIRBNB/TURFIO PILL SWITCHER) */}
                <div className="flex items-center rounded-full bg-slate-100 p-1">
                  {TRANSPORT_MODES.map((mode) => {
                    const isActive = costing === mode.id;
                    let Icon = Car;
                    if (mode.id === 'motorcycle') Icon = Bike;
                    if (mode.id === 'bicycle') Icon = Footprints;
                    if (mode.id === 'pedestrian') Icon = Navigation;

                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setCosting(mode.id)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-lime-700' : 'text-slate-500'}`} />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 2. ORIGIN & DESTINATION INPUT CARD */}
                <div className="rounded-3xl bg-white p-2 shadow-[0_2px_18px_rgba(0,0,0,0.06)] space-y-1.5">
                  {/* Origin Input (Starting Point) */}
                  <div className="relative">
                    <div className="group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-left transition-colors hover:bg-slate-50 focus-within:bg-slate-50 cursor-pointer">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition-colors group-focus-within:bg-lime-100 group-focus-within:text-lime-700">
                        <div className="h-3 w-3 rounded-full border-2 border-slate-900 bg-white" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
                          Starting Point
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsOriginPickerOpen(!isOriginPickerOpen)}
                          className="mt-0.5 block w-full text-left text-[14px] font-bold text-slate-900 truncate outline-none cursor-pointer"
                        >
                          {originLocation.name}
                        </button>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseCurrentLocation();
                          }}
                          disabled={isLocatingUser}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-slate-200/80 text-slate-600 transition-colors cursor-pointer"
                          title="Use My Real-time GPS Location"
                        >
                          {isLocatingUser ? (
                            <Loader2 className="h-4 w-4 animate-spin text-lime-700" />
                          ) : (
                            <Locate className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsOriginPickerOpen(!isOriginPickerOpen)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOriginPickerOpen ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Origin POI Search & Suggestions Dropdown */}
                    {isOriginPickerOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 z-40 rounded-2xl bg-white p-2.5 shadow-2xl animate-fadeIn space-y-2 max-h-80 overflow-y-auto border border-slate-100">
                        {/* Free-text POI Search Bar */}
                        <div className="relative flex items-center">
                          <Search className="absolute left-3.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={originSearchQuery}
                            onChange={(e) => handleOriginSearchChange(e.target.value)}
                            placeholder="Search any place, address, landmark..."
                            className="w-full rounded-xl bg-slate-50 pl-9 pr-8 py-2 text-xs font-semibold text-slate-900 outline-none border border-slate-200 focus:bg-white focus:ring-2 focus:ring-lime-400 transition-all placeholder:text-slate-400"
                            autoFocus
                          />
                          {originSearchQuery && (
                            <button
                              type="button"
                              onClick={() => {
                                setOriginSearchQuery('');
                                setOriginSuggestions([]);
                              }}
                              className="absolute right-2.5 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Fast GPS Action */}
                        <button
                          type="button"
                          onClick={handleUseCurrentLocation}
                          disabled={isLocatingUser}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-black text-lime-900 bg-lime-50/70 hover:bg-lime-100 transition-colors cursor-pointer"
                        >
                          {isLocatingUser ? (
                            <Loader2 className="h-4 w-4 animate-spin text-lime-700" />
                          ) : (
                            <Locate className="h-4 w-4 text-lime-700" />
                          )}
                          <span>My Current Location (GPS)</span>
                        </button>

                        <div className="border-t border-slate-100 my-1" />

                        {/* Search Status & Results */}
                        {isSearchingOrigin && (
                          <div className="flex items-center justify-center gap-2 py-4 text-xs font-bold text-slate-500">
                            <Loader2 className="h-4 w-4 animate-spin text-lime-600" />
                            <span>Searching locations...</span>
                          </div>
                        )}

                        {originSearchError && (
                          <div className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-medium">
                            {originSearchError}
                          </div>
                        )}

                        {!isSearchingOrigin && originSuggestions.length > 0 && (
                          <div className="space-y-1">
                            <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              Search Results
                            </div>
                            {originSuggestions.map((item) => (
                              <button
                                key={item.place_id || item.osm_id}
                                type="button"
                                onClick={() => handleSelectOriginSuggestion(item)}
                                className="w-full flex items-start gap-2.5 p-2 rounded-xl text-left hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-xs font-bold text-slate-900 truncate">
                                    {(item.display_name || '').split(',')[0]}
                                  </h4>
                                  <p className="text-[10px] text-slate-500 truncate">
                                    {item.display_name}
                                  </p>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}

                        {!isSearchingOrigin && originSearchQuery.trim() && originSuggestions.length === 0 && !originSearchError && (
                          <div className="px-3 py-4 text-center text-xs font-semibold text-slate-500">
                            No locations found for &ldquo;{originSearchQuery}&rdquo;
                          </div>
                        )}

                        {!originSearchQuery.trim() && originSuggestions.length === 0 && (
                          <div className="space-y-1">
                            <div className="px-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              Popular Landmarks
                            </div>
                            {KATHMANDU_PRESET_LOCATIONS.filter((l) => !l.isCurrentLocation).map((loc) => (
                              <button
                                key={loc.id}
                                type="button"
                                onClick={() => {
                                  setOriginLocation({
                                    name: loc.name,
                                    lat: loc.lat,
                                    lon: loc.lon,
                                    isGps: false,
                                  });
                                  setIsOriginPickerOpen(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                              >
                                <span>{loc.name}</span>
                                <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Visual Divider (No Swap Button) */}
                  <div className="px-4 py-0.5">
                    <div className="w-full border-t border-slate-100" />
                  </div>

                  {/* Destination Field (Read-Only Display - Locked to selectedTurf) */}
                  <div className="relative rounded-2xl bg-slate-50/80 border border-slate-100 p-3 flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime-100 text-lime-800">
                      <MapPin className="h-4 w-4 stroke-[2.2]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 leading-tight">
                          Destination Arena
                        </span>
                        <span className="text-[9.5px] font-extrabold uppercase tracking-wide px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-600">
                          Locked
                        </span>
                      </div>
                      <span className="mt-0.5 block w-full text-left text-[14px] font-extrabold text-slate-900 truncate">
                        {selectedTurf?.title || 'Destination Arena'}
                      </span>
                      {selectedTurf?.location && (
                        <span className="block text-[11px] font-medium text-slate-500 truncate mt-0.5">
                          {selectedTurf.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Route Error Notification (If any) */}
                {routeError && (
                  <div className="rounded-3xl bg-rose-50/80 p-4 flex items-start gap-3 text-rose-800 text-xs font-medium shadow-[0_2px_18px_rgba(0,0,0,0.04)]">
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-900">Routing Issue</h4>
                      <p className="mt-0.5 text-rose-700">{routeError}</p>
                    </div>
                  </div>
                )}

                {/* 4. TURN-BY-TURN DIRECTIONS LIST (CLEAN AIRBNB/TURFIO WHITE LIST) */}
                {routeData?.steps && routeData.steps.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Turn-by-Turn Guidance ({routeData.steps.length})
                      </h3>
                      <span className="text-[11px] font-medium text-slate-400">Hover to preview</span>
                    </div>

                    <div className="divide-y divide-slate-100 rounded-2xl bg-white overflow-hidden shadow-[0_2px_18px_rgba(0,0,0,0.06)]">
                      {routeData.steps.map((step, idx) => {
                        const StepIcon = getManeuverIcon(step);
                        const isHovered = hoveredStepIndex === idx;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => handleStepHover(step, idx)}
                            onMouseLeave={handleStepLeave}
                            className={`flex items-start gap-3 px-3.5 py-3 transition-colors cursor-pointer ${
                              isHovered ? 'bg-lime-50/70' : 'hover:bg-slate-50'
                            }`}
                          >
                            <div
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold mt-0.5 transition-colors ${
                                isHovered
                                  ? 'bg-lime-400 text-slate-950'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <StepIcon className="h-3.5 w-3.5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-semibold text-slate-800 leading-snug">
                                {step.instruction}
                              </p>
                              {step.streetName && (
                                <p className="text-[11.5px] font-normal text-slate-400 mt-0.5">
                                  {step.streetName}
                                </p>
                              )}
                            </div>
                            {step.distanceMeters > 0 && (
                              <span className="text-[12px] font-semibold text-slate-500 shrink-0 pt-0.5 whitespace-nowrap">
                                {formatDistance(step.distanceMeters)}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>


      </div>

      {/* ─── FIRST TIME LOCATION PERMISSION PROMPT MODAL ─── */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-100">
            <button
              type="button"
              onClick={() => handleDismissPermissionModal()}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-100 text-lime-800">
              <Locate className="h-6 w-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                Enable Location Access
              </h3>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                Allow Turfio to find your current location so we can calculate exact driving directions, traffic-optimized ETAs, and find the closest futsal venues to you.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isLocatingUser}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 py-3.5 text-sm font-black text-slate-950 transition-all shadow-xs active:scale-98 cursor-pointer"
              >
                {isLocatingUser ? (
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                ) : (
                  <Locate className="h-4 w-4 stroke-[2.2]" />
                )}
                <span>Allow Location Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleDismissPermissionModal(KATHMANDU_PRESET_LOCATIONS[1])}
                className="w-full rounded-full border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Choose a Landmark Instead (e.g. Thamel)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
