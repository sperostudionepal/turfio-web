// Browser geolocation + reverse geocoding, shared by the "Nearby" option in LocationAutocomplete
// and the landing page's "Explore near me". Resolves to { lat, lon, display_name }; rejects if the
// browser has no geolocation or the user denies it. A failed reverse lookup still resolves, with a
// generic name, so the coordinates are never lost.
export function getNearbyLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let displayName = 'Your Location';

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          displayName = data.address?.city || data.address?.town || data.address?.county || displayName;
        } catch (err) {
          console.error('Reverse geocoding error:', err);
        }

        resolve({ lat: latitude, lon: longitude, display_name: displayName });
      },
      (error) => reject(error)
    );
  });
}
