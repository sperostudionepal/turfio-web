// Every lazy page in one place, so the router and the idle prefetch below load the exact same chunks.
export const pageLoaders = {
  turfListing: () => import('../pages/turfs/TurfListingPage'),
  turfDetails: () => import('../pages/turfs/TurfDetailsPageWrapper'),
  checkout: () => import('../pages/bookings/BookingCheckoutPageWrapper'),
  turfRoute: () => import('../pages/turfs/TurfRoutePageWrapper'),
  listTurf: () => import('../pages/listTurf/ListTurfPage'),
  applicationStatus: () => import('../pages/owner/ApplicationStatusPage'),
  profile: () => import('../pages/profile/ProfilePage'),
  bookingPass: () => import('../pages/BookingPassPublicPage'),
  confirmation: () => import('../pages/bookings/BookingConfirmationPageWrapper'),
  paymentSuccess: () => import('../pages/PaymentSuccess'),
  paymentFailure: () => import('../pages/PaymentFailure'),
  dashboards: () => import('./DashboardRoutes'),
};

// Warm the pages a visitor is most likely to open next (browse -> venue -> booking) once the
// browser is idle after first paint, so those clicks don't wait on a chunk download.
export function prefetchLikelyPages() {
  const warm = () => {
    [pageLoaders.turfListing, pageLoaders.turfDetails, pageLoaders.checkout].forEach((load) => {
      load().catch(() => {});
    });
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(warm, { timeout: 4000 });
  } else {
    setTimeout(warm, 2000);
  }
}
