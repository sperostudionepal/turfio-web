import apiClient from './apiClient';

/**
 * Preset Kathmandu hubs / landmarks for quick routing selection
 */
export const KATHMANDU_PRESET_LOCATIONS = [
  { id: 'gps', name: 'My Current Location', lat: null, lon: null, isCurrentLocation: true },
  { id: 'thamel', name: 'Thamel (Kathmandu Center)', lat: 27.7154, lon: 85.3123 },
  { id: 'baneshwor', name: 'New Baneshwor (Chowk)', lat: 27.6915, lon: 85.3420 },
  { id: 'pulchowk', name: 'Pulchowk (Lalitpur Hub)', lat: 27.6782, lon: 85.3168 },
  { id: 'kalanki', name: 'Kalanki Chowk', lat: 27.6938, lon: 85.2818 },
  { id: 'boudha', name: 'Boudha Stupa Roundabout', lat: 27.7215, lon: 85.3620 },
  { id: 'koteshwor', name: 'Koteshwor (Ring Road Junction)', lat: 27.6788, lon: 85.3490 },
  { id: 'maharajgunj', name: 'Maharajgunj (Narayan Gopal Chowk)', lat: 27.7360, lon: 85.3308 },
  { id: 'patan', name: 'Patan Durbar Square', lat: 27.6727, lon: 85.3253 },
  { id: 'bhaktapur', name: 'Bhaktapur Durbar Square', lat: 27.6710, lon: 85.4298 },
];

/**
 * Supported transport modes for Valhalla costing
 */
export const TRANSPORT_MODES = [
  { id: 'auto', label: 'Drive', icon: 'Car', description: 'Car & Taxi routes' },
  { id: 'motorcycle', label: 'Ride', icon: 'Bike', description: 'Motorcycle & Scooter' },
  { id: 'bicycle', label: 'Bicycle', icon: 'Footprints', description: 'Cycling paths' },
  { id: 'pedestrian', label: 'Walk', icon: 'Navigation', description: 'Pedestrian walkways' },
];

/**
 * Check location permission status ('granted' | 'prompt' | 'denied' | 'unknown')
 */
export async function checkLocationPermission() {
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'unknown';
  }
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    return 'unknown';
  }
}

/**
 * Request real-time GPS location from browser navigator
 */
export function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        let msg = 'Unable to retrieve location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied in your browser settings.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable on your device.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        const err = new Error(msg);
        err.code = error.code;
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}

/**
 * Request calculated route from Backend Valhalla service
 * @param {Object} origin - { lat, lon } or { lat, lng }
 * @param {Object} destination - { lat, lon } or { lat, lng }
 * @param {string} costing - 'auto' | 'motorcycle' | 'bicycle' | 'pedestrian'
 */
export async function getRoute(origin, destination, costing = 'auto') {
  const originCoord = {
    lat: origin.lat !== undefined ? origin.lat : origin.latitude,
    lon: origin.lon !== undefined ? origin.lon : (origin.lng || origin.longitude),
  };

  const destCoord = {
    lat: destination.lat !== undefined ? destination.lat : destination.latitude,
    lon: destination.lon !== undefined ? destination.lon : (destination.lng || destination.longitude),
  };

  if (!originCoord.lat || !originCoord.lon || !destCoord.lat || !destCoord.lon) {
    throw new Error('Valid origin and destination coordinates are required.');
  }

  let valhallaCosting = costing;
  if (costing === 'motorcycle') {
    valhallaCosting = 'motorcycle';
  }

  try {
    const response = await apiClient.post('/routes', {
      origin: originCoord,
      destination: destCoord,
      costing: valhallaCosting,
    });

    const routeObj = response?.data?.primaryRoute || response?.primaryRoute;

    if (routeObj) {
      return routeObj;
    }

    throw new Error(response?.message || 'Invalid route response structure from backend.');
  } catch (backendError) {
    console.error('[RouteService Error] Backend Valhalla route calculation failed:', backendError.message);
    // If backend endpoint is unreachable (network failure / server down), return offline fallback route
    if (backendError.code === 'ERR_NETWORK' || backendError.message?.includes('Network Error')) {
      console.warn('[RouteService Warning] Server unreachable. Rendering offline fallback route.');
      return generateFallbackRoute(originCoord, destCoord, costing);
    }
    throw backendError;
  }
}

/**
 * Client-side fallback route generator if backend service is restarting or offline
 */
function generateFallbackRoute(origin, destination, costing) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (origin.lat * Math.PI) / 180;
  const φ2 = (destination.lat * Math.PI) / 180;
  const Δφ = ((destination.lat - origin.lat) * Math.PI) / 180;
  const Δλ = ((destination.lon - origin.lon) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const directDistance = R * c;

  const roadFactor = 1.35;
  const totalDistanceMeters = Math.round(directDistance * roadFactor);

  const speeds = {
    auto: 25,
    motorcycle: 30,
    bicycle: 15,
    pedestrian: 4.8,
  };
  const speedKmh = speeds[costing] || 25;
  const speedMs = (speedKmh * 1000) / 3600;
  const totalDurationSeconds = Math.round(totalDistanceMeters / speedMs);

  const numWaypoints = 14;
  const geometry = [];

  for (let i = 0; i <= numWaypoints; i++) {
    const fraction = i / numWaypoints;
    let lat = origin.lat + (destination.lat - origin.lat) * fraction;
    let lon = origin.lon + (destination.lon - origin.lon) * fraction;

    if (i > 0 && i < numWaypoints) {
      const curveAmount = Math.sin(fraction * Math.PI) * 0.0018;
      lat += (destination.lon - origin.lon) * curveAmount;
      lon -= (destination.lat - origin.lat) * curveAmount;
    }

    geometry.push([lon, lat]);
  }

  const steps = [
    {
      instruction: `Head towards destination arena along primary route`,
      distanceMeters: Math.round(totalDistanceMeters * 0.2),
      durationSeconds: Math.round(totalDurationSeconds * 0.2),
      maneuverType: 1,
      streetName: 'Starting Point',
    },
    {
      instruction: 'Turn right onto connecting arterial road',
      distanceMeters: Math.round(totalDistanceMeters * 0.35),
      durationSeconds: Math.round(totalDurationSeconds * 0.35),
      maneuverType: 2,
      streetName: 'Arterial Road',
    },
    {
      instruction: 'Continue straight through the upcoming junction',
      distanceMeters: Math.round(totalDistanceMeters * 0.3),
      durationSeconds: Math.round(totalDurationSeconds * 0.3),
      maneuverType: 0,
      streetName: 'Main Ring Route',
    },
    {
      instruction: 'Turn left toward the arena grounds entrance',
      distanceMeters: Math.round(totalDistanceMeters * 0.15),
      durationSeconds: Math.round(totalDurationSeconds * 0.15),
      maneuverType: 3,
      streetName: 'Access Road',
    },
    {
      instruction: 'You have arrived at the futsal arena',
      distanceMeters: 0,
      durationSeconds: 0,
      maneuverType: 4,
      streetName: 'Arena Gate',
    },
  ];

  return {
    distanceMeters: totalDistanceMeters,
    durationSeconds: totalDurationSeconds,
    geometry,
    steps,
  };
}

/**
 * Format meters into human-readable km or meters
 */
export function formatDistance(meters) {
  if (!meters && meters !== 0) return '0 m';
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

/**
 * Format duration in seconds into human-readable duration (e.g. "18 mins" or "1 hr 12 mins")
 */
export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '0 min';
  const mins = Math.round(seconds / 60);
  if (mins < 60) {
    return `${mins} min${mins === 1 ? '' : 's'}`;
  }
  const hrs = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (remainingMins === 0) {
    return `${hrs} hr${hrs === 1 ? '' : 's'}`;
  }
  return `${hrs} hr ${remainingMins} min${remainingMins === 1 ? '' : 's'}`;
}

/**
 * Format estimated arrival time (e.g. "6:45 PM")
 */
export function formatArrivalTime(durationSeconds) {
  const arrivalDate = new Date(Date.now() + (durationSeconds || 0) * 1000);
  return arrivalDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
