/**
 * Turfio Light MapLibre Vector Style & Configuration
 * 
 * Specifically designed for Turfio sports booking marketplace:
 * - Ultra-clean, low-contrast, near-white basemap (#F8FAF7 / #F7F8F5 / #F5F7F3)
 * - Restrained soft greens for parks (#EDF5E5) & sports/recreation (#E6F3D8)
 * - Muted pale blue-teal water (#E8F2F1)
 * - Subtle road hierarchy with white fills and soft neutral casings (#E5E9E3 / #DDE3DC)
 * - Low-contrast cool gray buildings (#ECEFEA with #E4E8E2 outline)
 * - Navy/slate typography hierarchy (#172033, #6F7C8F, #98A3B3) with white halos
 * - Reduced POI noise; prioritizes municipalities, transit hubs, hospitals, and parks
 * - Progressive zoom disclosure (declutters zoomed out; reveals details at street level)
 */

export const MAPTILER_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_MAPTILER_API_KEY) ||
  '3XQZcNvQxsv8JKAmtB1a';

// Default Kathmandu Valley center coordinates [lng, lat]
export const DEFAULT_MAP_CENTER = [85.3331, 27.6915];
export const DEFAULT_MAP_ZOOM = 12.2;

/**
 * Generates the custom Turfio Light vector style JSON for MapLibre GL JS
 * @param {string} apiKey MapTiler API key
 * @returns {object} MapLibre style JSON specification
 */
export function getTurfioLightStyle(apiKey = MAPTILER_KEY) {
  return {
    version: 8,
    name: 'Turfio Light Minimal Production',
    metadata: {
      'maptiler:copyright': '© MapTiler © OpenStreetMap contributors',
    },
    sources: {
      openmaptiles: {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${apiKey}`,
      },
    },
    glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${apiKey}`,
    sprite: `https://api.maptiler.com/maps/streets-v2/sprite?key=${apiKey}`,
    layers: [
      // ─── 1. CANVAS / BASE BACKGROUND ───
      {
        id: 'background',
        type: 'background',
        paint: {
          'background-color': '#F4F6F0',
        },
      },

      // ─── 2. GENERAL LANDCOVER & LANDUSE ───
      {
        id: 'landcover_general',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landcover',
        paint: {
          'fill-color': '#EFF3EA',
          'fill-opacity': 0.9,
        },
      },
      {
        id: 'landuse_commercial',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['in', 'class', 'commercial', 'industrial', 'retail', 'facility'],
        paint: {
          'fill-color': '#E8EDE2',
          'fill-opacity': 0.85,
        },
      },

      // ─── 3. PARKS & SPORTS RECREATION (CLEAR, NATURAL GREENS) ───
      {
        id: 'park_and_greenery',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'park',
        paint: {
          'fill-color': '#D8EBC8',
          'fill-opacity': 0.9,
          'fill-outline-color': '#C5E0B0',
        },
      },
      {
        id: 'landcover_wood_grass',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landcover',
        filter: ['in', 'class', 'wood', 'grass', 'forest', 'scrub'],
        paint: {
          'fill-color': '#DCEDCD',
          'fill-opacity': 0.85,
        },
      },
      {
        id: 'landuse_pitch_sport',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'landuse',
        filter: ['in', 'class', 'pitch', 'stadium', 'track', 'sports_centre', 'recreation_ground'],
        paint: {
          'fill-color': '#D0E9BA',
          'fill-opacity': 0.95,
          'fill-outline-color': '#BDDF9E',
        },
      },

      // ─── 4. WATERWAYS & WATER BODIES (CLEAR BLUE/TEAL) ───
      {
        id: 'water_area',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'water',
        paint: {
          'fill-color': '#C8E4E7',
          'fill-opacity': 0.95,
          'fill-outline-color': '#B5DCE0',
        },
      },
      {
        id: 'water_line',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'waterway',
        paint: {
          'line-color': '#A8D4D8',
          'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1.2, 16, 3.5],
        },
      },

      // ─── 5. BUILDINGS (CLEAR ARCHITECTURAL FOOTPRINTS) ───
      {
        id: 'building',
        type: 'fill',
        source: 'openmaptiles',
        'source-layer': 'building',
        minzoom: 13,
        paint: {
          'fill-color': '#DCE2D8',
          'fill-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13,
            0.3,
            14.5,
            0.65,
            16.5,
            0.9,
          ],
          'fill-outline-color': '#CBD4C5',
        },
      },

      // ─── 6. ROAD CASINGS (GOOGLE MAPS STYLE PRECISE EDGES) ───
      // Minor / residential road casing
      {
        id: 'road_minor_casing',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'minor', 'service', 'path', 'track'],
        minzoom: 13,
        paint: {
          'line-color': '#BDC1C6',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13,
            1.2,
            15,
            2.4,
            18,
            6.5,
          ],
        },
      },
      // Secondary / Tertiary casing
      {
        id: 'road_secondary_casing',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'secondary', 'tertiary'],
        minzoom: 10,
        paint: {
          'line-color': '#B0B7C0',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            1.8,
            14,
            4.2,
            18,
            9.5,
          ],
        },
      },
      // Primary / Trunk casing
      {
        id: 'road_primary_casing',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'primary', 'trunk'],
        minzoom: 7,
        paint: {
          'line-color': '#9AA0A6',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            2.0,
            12,
            4.5,
            18,
            11,
          ],
        },
      },
      // Highway / Motorway casing (e.g. Ring Road / Highways)
      {
        id: 'road_motorway_casing',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'motorway'],
        minzoom: 5,
        paint: {
          'line-color': '#80868B',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2.2,
            11,
            5.0,
            18,
            13,
          ],
        },
      },

      // ─── 7. ROAD INNER FILLS (GOOGLE MAPS GRAY ROAD NETWORK) ───
      // Minor / local roads (Google Maps light gray)
      {
        id: 'road_minor_fill',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'minor', 'service', 'path', 'track'],
        minzoom: 13,
        paint: {
          'line-color': '#D2D6DC',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13,
            0.8,
            15,
            1.8,
            18,
            5,
          ],
        },
      },
      // Secondary / Tertiary roads (Google Maps medium gray)
      {
        id: 'road_secondary_fill',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'secondary', 'tertiary'],
        minzoom: 10,
        paint: {
          'line-color': '#C4C9D0',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10,
            1.2,
            14,
            3.2,
            18,
            8,
          ],
        },
      },
      // Primary / Trunk roads (distinct prominent gray)
      {
        id: 'road_primary_fill',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['in', 'class', 'primary', 'trunk'],
        minzoom: 7,
        paint: {
          'line-color': '#B5BCC4',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7,
            1.4,
            12,
            3.2,
            18,
            9.5,
          ],
        },
      },
      // Highways & Ring Road (darker slate gray)
      {
        id: 'road_motorway_fill',
        type: 'line',
        source: 'openmaptiles',
        'source-layer': 'transportation',
        filter: ['==', 'class', 'motorway'],
        minzoom: 5,
        paint: {
          'line-color': '#9AA0A6',
          'line-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            1.4,
            11,
            3.8,
            18,
            11,
          ],
        },
      },

      // ─── 8. ROAD LABELS (MAJOR ROADS, ARTERIALS & RING ROADS) ───
      {
        id: 'road_label',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'transportation_name',
        filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
        minzoom: 12,
        layout: {
          'symbol-placement': 'line',
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            12,
            9,
            16,
            11,
          ],
          'text-letter-spacing': 0.04,
        },
        paint: {
          'text-color': '#64748b',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 9. NEIGHBORHOODS & LOCALITIES (BALKUMARI, BANESHWOR, KOTESHWOR, ETC.) ───
      {
        id: 'place_suburb_neighbourhood',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        filter: ['in', 'class', 'suburb', 'neighbourhood', 'quarter', 'village'],
        minzoom: 11,
        layout: {
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11,
            9.5,
            14,
            11,
            16,
            12.5,
          ],
          'text-letter-spacing': 0.04,
          'text-max-width': 8,
        },
        paint: {
          'text-color': '#475569',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 10. PRIMARY CITIES & MUNICIPALITIES (KATHMANDU, LALITPUR, BHAKTAPUR, THIMI) ───
      {
        id: 'place_city_town',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'place',
        filter: ['in', 'class', 'city', 'town'],
        layout: {
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Bold', 'Open Sans Bold'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8,
            11.5,
            11,
            13,
            14,
            14.5,
            16,
            16,
          ],
          'text-letter-spacing': 0.06,
          'text-transform': 'none',
        },
        paint: {
          'text-color': '#1e293b',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2.2,
        },
      },

      // ─── 11. RESTAURANTS & DINING (FORK & KNIFE ORANGE PIN) ───
      {
        id: 'poi_restaurants',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 15.2,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'restaurant', 'food_court', 'fast_food']
        ],
        layout: {
          'icon-image': 'restaurant_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0.65,
            17,
            0.85,
            19,
            1.0,
          ],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 10,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            9,
            17,
            10.5,
          ],
          'text-offset': [0, 0.38],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 12. CAFES & BAKERIES (COFFEE CUP ORANGE PIN) ───
      {
        id: 'poi_cafes',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 15.0,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'cafe', 'coffee_shop', 'bakery', 'tea']
        ],
        layout: {
          'icon-image': 'cafe_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0.65,
            17,
            0.85,
            19,
            1.0,
          ],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 10,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            9,
            17,
            10.5,
          ],
          'text-offset': [0, 0.38],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 13. PHARMACIES & CHEMISTS (MORTAR & PESTLE CORAL RED PIN) ───
      {
        id: 'poi_pharmacies',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 15.5,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'pharmacy', 'chemist']
        ],
        layout: {
          'icon-image': 'pharmacy_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0.65,
            17,
            0.85,
            19,
            1.0,
          ],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 10,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            9,
            17,
            10.5,
          ],
          'text-offset': [0, 0.38],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 14. PARKING (CIRCULAR BLUE BADGE WITH 'P') ───
      {
        id: 'poi_parking',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 15.5,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'parking', 'parking_garage', 'parking_space']
        ],
        layout: {
          'icon-image': 'parking_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0.58,
            17,
            0.75,
            19,
            0.92,
          ],
          'icon-anchor': 'center',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 12,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            9,
            17,
            10.5,
          ],
          'text-offset': [0, 0.85],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 15. STORES, SHOPS & SUPERMARKETS (VIBRANT BLUE SHOPPING BAG PIN) ───
      {
        id: 'poi_stores',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 16.0,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'shop', 'supermarket', 'convenience', 'department_store', 'mall', 'clothing', 'hardware', 'grocery']
        ],
        layout: {
          'icon-image': 'store_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            16,
            0.65,
            18,
            0.88,
          ],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 12,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            16,
            9,
            18,
            10.5,
          ],
          'text-offset': [0, 0.38],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 16. PETROL PUMPS & FUEL STATIONS (ROYAL BLUE GAS PUMP PIN) ───
      {
        id: 'poi_fuel',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 14.0,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'fuel', 'gas_station', 'charging_station']
        ],
        layout: {
          'icon-image': 'fuel_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            14,
            0.62,
            16,
            0.80,
            18,
            1.0,
          ],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 10,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            14,
            9,
            16,
            10.5,
          ],
          'text-offset': [0, 0.38],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 17. HOSPITALS, CLINICS & HEALTHCARE (CORAL RED MEDICAL CROSS PIN) ───
      {
        id: 'poi_hospitals',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 13.5,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'hospital', 'clinic', 'doctors', 'dentist', 'health']
        ],
        layout: {
          'icon-image': 'hospital_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13.5,
            0.62,
            16,
            0.82,
            18,
            1.0,
          ],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 8,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            13.5,
            9,
            16,
            10.5,
          ],
          'text-offset': [0, 0.38],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },

      // ─── 18. BANKS & ATMS (TEAL PILLARS PIN) ───
      {
        id: 'poi_banks',
        type: 'symbol',
        source: 'openmaptiles',
        'source-layer': 'poi',
        minzoom: 15.5,
        filter: [
          'all',
          ['has', 'name'],
          ['in', 'class', 'bank', 'atm', 'bureau_de_change']
        ],
        layout: {
          'icon-image': 'bank_pin',
          'icon-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15.5,
            0.65,
            17,
            0.85,
            19,
            1.0,
          ],
          'icon-anchor': 'bottom',
          'icon-allow-overlap': false,
          'icon-ignore-placement': false,
          'icon-padding': 10,
          'text-field': '{name:latin}',
          'text-font': ['Noto Sans Regular', 'Open Sans Regular'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15.5,
            9,
            17,
            10.5,
          ],
          'text-offset': [0, 0.38],
          'text-anchor': 'top',
          'text-max-width': 8,
          'text-optional': true,
          'text-padding': 6,
        },
        paint: {
          'icon-opacity': 0.95,
          'text-color': '#475569',
          'text-opacity': 0.9,
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 1.8,
        },
      },
    ],
  };
}

/**
 * MapTiler Satellite Hybrid Style URL
 */
export function getSatelliteStyleUrl(apiKey = MAPTILER_KEY) {
  return `https://api.maptiler.com/maps/hybrid/style.json?key=${apiKey}`;
}

/**
 * Fallback OSM raster style for offline / restricted key resilience
 */
export const FALLBACK_OSM_STYLE = {
  version: 8,
  sources: {
    'osm-tiles': {
      type: 'raster',
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap Contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles-layer',
      type: 'raster',
      source: 'osm-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

/**
 * Fallback Esri World Imagery raster style for satellite offline resilience
 */
export const FALLBACK_SATELLITE_STYLE = {
  version: 8,
  sources: {
    'esri-tiles': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution: '&copy; Esri World Imagery',
    },
  },
  layers: [
    {
      id: 'esri-tiles-layer',
      type: 'raster',
      source: 'esri-tiles',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};
