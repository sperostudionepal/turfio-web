import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Navigation,
  Compass,
  Layers,
  MapPin,
} from 'lucide-react';
import {
  MAPTILER_KEY,
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  getTurfioLightStyle,
  getSatelliteStyleUrl,
  FALLBACK_OSM_STYLE,
  FALLBACK_SATELLITE_STYLE,
} from '../../config/mapConfig';

export default function TurfMap({
  turfs = [],
  selectedTurf = null,
  hoveredTurfId = null,
  hoveredFromListId = null,
  resetViewKey = 0,
  onSelectTurf,
  onHoverTurf,
  onBoundsChange,
  onNavigateRoute,
  searchLocation = '',
  activeLocationQuery = 'Kathmandu, Nepal',
  className = '',
}) {
  const mapContainerRef = useRef(null);
  const wrapperRef = useRef(null);
  const mapRef = useRef(null);
  const boundsDebounceTimerRef = useRef(null);

  const onSelectTurfRef = useRef(onSelectTurf);
  onSelectTurfRef.current = onSelectTurf;
  const onHoverTurfRef = useRef(onHoverTurf);
  onHoverTurfRef.current = onHoverTurf;

  const [mapStyleMode, setMapStyleMode] = useState('vector'); // 'vector' | 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

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

  // Helper to emit debounced bounds
  const emitBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map || !onBoundsChange) return;

    if (boundsDebounceTimerRef.current) {
      clearTimeout(boundsDebounceTimerRef.current);
    }

    boundsDebounceTimerRef.current = setTimeout(() => {
      try {
        const bounds = map.getBounds();
        if (bounds) {
          onBoundsChange({
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          });
        }
      } catch (err) {
        // Handle unmounted or transitioning state safely
      }
    }, 150);
  }, [onBoundsChange]);

  // Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: getActiveStyle('vector'),
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_MAP_ZOOM,
        attributionControl: false,
      });
    } catch (e) {
      console.warn('MapLibre init error, falling back to OSM:', e);
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: FALLBACK_OSM_STYLE,
        center: DEFAULT_MAP_CENTER,
        zoom: DEFAULT_MAP_ZOOM,
        attributionControl: false,
      });
    }

    mapRef.current = map;

    // Create Google-style POI teardrop pin icons with official Mapbox Maki SVG icons
    const registerCustomIcons = (targetMap) => {
      // 1. School / College / Education Pin (Official Maki 'college' / 'school' icon in Slate Blue)
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
            <!-- Maki 'college' graduation cap glyph (15px centered) -->
            <g transform="translate(16.5, 13.5)">
              <path d="M7.5 1.5L0.5 5.25L7.5 9L13.5 5.75V10.5H15V5.25L7.5 1.5ZM3 8.35V11.25C3 12.75 5 13.5 7.5 13.5C10 13.5 12 12.75 12 11.25V8.35L7.5 10.75L3 8.35Z" fill="#FFFFFF"/>
            </g>
          </svg>
        `;
        const img = new Image();
        img.onload = () => {
          if (!targetMap.hasImage('school_pin')) {
            targetMap.addImage('school_pin', img, { pixelRatio: 1.3 });
          }
        };
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(schoolSvg);
      }

      // 2. Cafe / Coffee Pin (Official Maki 'cafe' icon in Vibrant Orange)
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
            <!-- Maki 'cafe' coffee cup & saucer glyph (15px centered) -->
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

      // 3. Restaurant & Bar Pin (Official Maki 'restaurant' fork & knife icon in Vibrant Orange)
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
            <!-- Maki 'restaurant' fork & knife glyph (15px centered) -->
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

      // 4. Pharmacy & Chemist Pin (Official Maki 'pharmacy' mortar & pestle icon in Coral Red)
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
            <!-- Maki 'pharmacy' mortar and pestle glyph (15px centered) -->
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

      // 5. Parking Pin (Official Maki 'parking' badge icon)
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
            <!-- Maki 'parking' glyph (15px centered) -->
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

      // 6. Store & Shopping Pin (Official Maki 'shop' shopping bag icon in Vibrant Azure)
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
            <!-- Maki 'shop' shopping bag glyph (15px centered) -->
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

      // 7. Fuel / Petrol Pump Pin (Official Maki 'fuel' gas pump icon in Royal Blue)
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
            <!-- Maki 'fuel' gas pump glyph (15px centered) -->
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

      // 8. Hospital & Medical Pin (Official Maki 'hospital' / medical cross in Coral Red)
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
            <!-- Maki 'hospital' medical cross glyph (15px centered) -->
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

      // 9. Bank & ATM Pin (Official Maki 'bank' pillar icon in Teal / Emerald)
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
            <!-- Maki 'bank' columns glyph (15px centered) -->
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

      // 10. Place of Worship / Temple / Mosque Pin (Official Maki 'place-of-worship' in Warm Amber)
      if (!targetMap.hasImage('worship_pin')) {
        const worshipSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
            <defs>
              <filter id="shadow-worship" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
              </filter>
            </defs>
            <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-worship)"/>
            <circle cx="24" cy="21" r="15" fill="#D97706"/>
            <!-- Maki 'place-of-worship' / temple dome glyph (15px centered) -->
            <g transform="translate(16.5, 13.5)">
              <path d="M7.5 1C6 3 4 5 4 8C4 8.6 4.1 9.1 4.3 9.6L1 11V14H14V11L10.7 9.6C10.9 9.1 11 8.6 11 8C11 5 9 3 7.5 1ZM6 11H9V13H6V11Z" fill="#FFFFFF"/>
            </g>
          </svg>
        `;
        const worshipImg = new Image();
        worshipImg.onload = () => {
          if (!targetMap.hasImage('worship_pin')) {
            targetMap.addImage('worship_pin', worshipImg, { pixelRatio: 1.3 });
          }
        };
        worshipImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(worshipSvg);
      }

      // 11. Lodging & Hotel Pin (Official Maki 'lodging' bed icon in Magenta / Purple)
      if (!targetMap.hasImage('lodging_pin')) {
        const lodgingSvg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
            <defs>
              <filter id="shadow-lodge" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.25"/>
              </filter>
            </defs>
            <path d="M24 2 C13.5 2 5 10.5 5 21 C5 31.5 17 45.5 24 53 C31 45.5 43 31.5 43 21 C43 10.5 34.5 2 24 2 Z" fill="#FFFFFF" filter="url(#shadow-lodge)"/>
            <circle cx="24" cy="21" r="15" fill="#8B5CF6"/>
            <!-- Maki 'lodging' bed glyph (15px centered) -->
            <g transform="translate(16.5, 13.5)">
              <path d="M1 2V13H2.5V11H12.5V13H14V6.5C14 4.8 12.7 3.5 11 3.5H6.5C5.8 3.5 5.2 3.8 4.7 4.3C4.2 3.8 3.5 3.5 2.8 3.5H2.5V2H1ZM4 5C4.8 5 5.5 5.7 5.5 6.5C5.5 7.3 4.8 8 4 8C3.2 8 2.5 7.3 2.5 6.5C2.5 5.7 3.2 5 4 5ZM6.5 5.5H11C11.6 5.5 12 5.9 12 6.5V9H6.5V5.5Z" fill="#FFFFFF"/>
            </g>
          </svg>
        `;
        const lodgeImg = new Image();
        lodgeImg.onload = () => {
          if (!targetMap.hasImage('lodging_pin')) {
            targetMap.addImage('lodging_pin', lodgeImg, { pixelRatio: 1.3 });
          }
        };
        lodgeImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(lodgingSvg);
      }
    };

    // Listen to map movements to emit viewport bounds
    map.on('load', () => {
      registerCustomIcons(map);
      emitBounds();
    });
    map.on('styledata', () => {
      registerCustomIcons(map);
    });
    map.on('moveend', emitBounds);
    map.on('zoomend', emitBounds);

    // Graceful fallback for unauthorized/offline key errors or missing vector source errors
    map.on('error', (e) => {
      const errStatus = e?.error?.status || e?.status;
      if (errStatus === 401 || errStatus === 403 || errStatus === 404 || e?.error?.message?.includes('403') || e?.error?.message?.includes('401')) {
        console.warn('Map style restricted or unavailable, switching to OSM fallback:', e);
        map.setStyle(mapStyleMode === 'satellite' ? FALLBACK_SATELLITE_STYLE : FALLBACK_OSM_STYLE);
      }
    });

    // Resize observer to handle split view animation / responsive resizes
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
      emitBounds();
    });
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    return () => {
      if (boundsDebounceTimerRef.current) {
        clearTimeout(boundsDebounceTimerRef.current);
      }
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map style when style mode changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setStyle(getActiveStyle(mapStyleMode));
  }, [mapStyleMode, getActiveStyle]);

  const markersRef = useRef(new Map());
  const clusterMarkersRef = useRef([]);

  // Marker & Clustering Rendering Engine
  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous individual and cluster markers
    markersRef.current.forEach(({ marker }) => marker.remove());
    markersRef.current.clear();
    clusterMarkersRef.current.forEach((m) => m.remove());
    clusterMarkersRef.current = [];

    const validTurfs = (turfs || []).filter((t) => t && t.lat && t.lng);
    if (validTurfs.length === 0) return;

    const zoom = map.getZoom();
    const bounds = new maplibregl.LngLatBounds();

    // Simple grid-based clustering when zoomed out (< 11.5)
    const CLUSTER_ZOOM_THRESHOLD = 11.5;
    const isClusteringActive = zoom < CLUSTER_ZOOM_THRESHOLD;

    if (isClusteringActive) {
      // Group nearby turfs into clusters
      const clusters = [];
      const visited = new Set();
      const clusterDistanceDeg = 0.045; // ~4km cluster grouping distance

      validTurfs.forEach((turf, i) => {
        if (visited.has(turf.id)) return;
        const group = [turf];
        visited.add(turf.id);

        for (let j = i + 1; j < validTurfs.length; j++) {
          const other = validTurfs[j];
          if (visited.has(other.id)) continue;
          const dist = Math.hypot(turf.lat - other.lat, turf.lng - other.lng);
          if (dist < clusterDistanceDeg) {
            group.push(other);
            visited.add(other.id);
          }
        }

        clusters.push(group);
      });

      clusters.forEach((group) => {
        if (group.length === 1) {
          createSingleTurfMarker(group[0], map);
          bounds.extend([group[0].lng, group[0].lat]);
        } else {
          // Calculate center of cluster
          const avgLng = group.reduce((sum, t) => sum + Number(t.lng), 0) / group.length;
          const avgLat = group.reduce((sum, t) => sum + Number(t.lat), 0) / group.length;

          const clusterEl = document.createElement('div');
          clusterEl.className = 'group cursor-pointer transition-transform duration-200 hover:scale-110 select-none';
          clusterEl.innerHTML = `
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-[#84cc16] text-[#0f172a] font-extrabold text-xs shadow-[0_2px_8px_rgba(132,204,22,0.35)] border-2 border-white ring-1 ring-[#84cc16]/40">
              ${group.length}
            </div>
          `;

          clusterEl.addEventListener('click', () => {
            map.flyTo({
              center: [avgLng, avgLat],
              zoom: Math.min(14, zoom + 2.5),
              duration: 800,
              essential: true,
            });
          });

          const clusterMarker = new maplibregl.Marker({ element: clusterEl, anchor: 'center' })
            .setLngLat([avgLng, avgLat])
            .addTo(map);

          clusterMarkersRef.current.push(clusterMarker);
          bounds.extend([avgLng, avgLat]);
        }
      });
    } else {
      // Zoomed in: Render all individual Turfio branded markers
      validTurfs.forEach((turf) => {
        createSingleTurfMarker(turf, map);
        bounds.extend([turf.lng, turf.lat]);
      });
    }

    function createSingleTurfMarker(turf, mapInstance) {
      const el = document.createElement('div');
      el.className = 'relative turf-custom-marker group/marker cursor-pointer select-none';
      el.style.transformOrigin = 'center bottom';
      
      const priceText = turf.price ? turf.price.replace('/hr', '') : 'Book';

      el.innerHTML = `
        <!-- Unified Pill + Arrow Pin Container -->
        <div class="turf-pin-wrapper relative flex flex-col items-center select-none cursor-pointer filter drop-shadow-[0_2px_5px_rgba(15,23,42,0.12)] transition-all duration-300 ease-out group-hover/marker:scale-110 group-hover/marker:drop-shadow-[0_6px_14px_rgba(15,23,42,0.18)]">
          <div class="turf-price-badge relative flex items-center justify-center px-2.5 py-1.5 rounded-full bg-white text-[#172033] font-sans font-extrabold text-[11.5px] tracking-tight border border-[#E7EBE5] transition-colors duration-200 group-hover/marker:border-slate-300 leading-none">
            ${priceText}
            <!-- Seamless Triangular Arrow Pointer -->
            <div class="turf-price-pointer absolute -bottom-[4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-[#E7EBE5] transition-colors duration-200 group-hover/marker:border-slate-300"></div>
          </div>
        </div>
      `;

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([turf.lng, turf.lat])
        .addTo(mapInstance);

      el.addEventListener('mouseenter', () => onHoverTurfRef.current?.(turf.id));
      el.addEventListener('mouseleave', () => onHoverTurfRef.current?.(null));
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectTurfRef.current?.(turf);
      });

      markersRef.current.set(turf.id, { marker, el, turf });
    }
  }, [turfs]);

  // Sync markers whenever turfs or map style changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (map.isStyleLoaded()) {
      updateMarkers();
    } else {
      map.once('style.load', updateMarkers);
    }

    map.on('zoomend', updateMarkers);
    return () => {
      map.off('zoomend', updateMarkers);
    };
  }, [turfs, mapStyleMode, updateMarkers]);

  // Highlight active pin smoothly and blink when hovered from list
  useEffect(() => {
    markersRef.current.forEach(({ el, turf }) => {
      const active = hoveredTurfId === turf.id || selectedTurf?.id === turf.id;
      const isHoveredFromList = hoveredFromListId === turf.id;
      const pinWrapper = el.querySelector('.turf-pin-wrapper');
      const priceBadge = el.querySelector('.turf-price-badge');
      const pricePointer = el.querySelector('.turf-price-pointer');

      if (pinWrapper && priceBadge) {
        if (active) {
          pinWrapper.style.transform = 'scale(1.10)';
          pinWrapper.style.filter = 'drop-shadow(0 6px 14px rgba(15,23,42,0.20))';
          priceBadge.style.borderColor = '#94a3b8';
          priceBadge.style.color = '#0f172a';
          if (pricePointer) {
            pricePointer.style.borderColor = '#94a3b8';
          }
          if (isHoveredFromList) {
            pinWrapper.classList.add('animate-pin-blink');
          } else {
            pinWrapper.classList.remove('animate-pin-blink');
          }
          el.style.zIndex = '100';
        } else {
          pinWrapper.style.transform = '';
          pinWrapper.style.filter = '';
          pinWrapper.classList.remove('animate-pin-blink');
          priceBadge.style.borderColor = '#E7EBE5';
          priceBadge.style.color = '#172033';
          if (pricePointer) {
            pricePointer.style.borderColor = '#E7EBE5';
          }
          el.style.zIndex = '10';
        }
      }
    });
  }, [hoveredTurfId, hoveredFromListId, selectedTurf]);

  // Fit bounds when search results list changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const validTurfs = turfs.filter((t) => t.lat && t.lng);
    if (validTurfs.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    validTurfs.forEach((t) => bounds.extend([t.lng, t.lat]));

    map.fitBounds(bounds, {
      padding: 55,
      maxZoom: 14.5,
      duration: 900,
    });
  }, [turfs]);

  // Reset map view when requested externally via resetViewKey
  useEffect(() => {
    if (!resetViewKey) return;
    const map = mapRef.current;
    if (!map) return;
    const validTurfs = turfs.filter((t) => t.lat && t.lng);
    if (validTurfs.length === 0) {
      map.flyTo({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM, duration: 900 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds();
    validTurfs.forEach((t) => bounds.extend([t.lng, t.lat]));
    map.fitBounds(bounds, { padding: 55, maxZoom: 14.5, duration: 900 });
  }, [resetViewKey, turfs]);

  // Standard Controls Actions
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();

  const handleFitAll = () => {
    const map = mapRef.current;
    if (!map) return;
    const validTurfs = turfs.filter((t) => t.lat && t.lng);
    if (validTurfs.length === 0) {
      map.flyTo({ center: DEFAULT_MAP_CENTER, zoom: DEFAULT_MAP_ZOOM, duration: 800 });
      return;
    }
    const bounds = new maplibregl.LngLatBounds();
    validTurfs.forEach((t) => bounds.extend([t.lng, t.lat]));
    map.fitBounds(bounds, { padding: 55, maxZoom: 14.5, duration: 900 });
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        mapRef.current?.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 14,
          duration: 900,
          essential: true,
        });
      },
      () => {
        setIsLocating(false);
      }
    );
  };

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
      {/* Native MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

      {/* ── Top-Left Info Card ── */}
      {(() => {
        const displayTitle = selectedTurf
          ? selectedTurf.title
          : searchLocation
          ? searchLocation
          : 'Kathmandu Valley';

        const displaySubtitle = selectedTurf
          ? selectedTurf.location || (selectedTurf.address ? selectedTurf.address : 'Nepal')
          : searchLocation
          ? `${searchLocation}, Nepal`
          : 'Bagmati Province, Nepal';

        const activeQuery = selectedTurf
          ? `${selectedTurf.title}, ${selectedTurf.location || selectedTurf.address || 'Kathmandu'}`
          : activeLocationQuery || 'Kathmandu, Nepal';

        return (
          <div className="absolute top-3.5 left-3.5 z-20 flex items-center justify-between gap-3 rounded-2xl bg-white/98 backdrop-blur-md px-3.5 py-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-[#E7EBE5] max-w-[280px] sm:max-w-[320px]">
            <div className="min-w-0 pr-1">
              <h4 className="text-sm font-bold text-[#0f172a] leading-tight truncate">
                {displayTitle}
              </h4>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5 leading-tight">
                {displaySubtitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* View Larger Map */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  activeQuery
                )}`}
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
                  onClick={() => {
                    const target = selectedTurf || (turfs.length > 0 ? turfs[0] : { title: displayTitle, location: displaySubtitle });
                    onNavigateRoute(target);
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-[#84cc16] hover:bg-[#65a30d] text-[#0f172a] shadow-xs transition-all active:scale-95 cursor-pointer"
                  title="Get Directions"
                >
                  <svg className="h-3.5 w-3.5 fill-[#0f172a]" viewBox="0 0 24 24">
                    <path d="M21.71 11.29l-9-9a.996.996 0 00-1.41 0l-9 9a.996.996 0 000 1.41l9 9c.39.39 1.02.39 1.41 0l9-9a.996.996 0 000-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" />
                  </svg>
                </button>
              ) : (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                    activeQuery
                  )}`}
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
        );
      })()}

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
