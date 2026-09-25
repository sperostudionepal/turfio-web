// Every lazy page in one place, so the router and the idle prefetch below load the exact same chunks.
export const pageLoaders = {
  turfListing: () => import('../../player/pages/turfs/TurfListingPage'),
  turfDetails: () => import('../../player/pages/turfs/TurfDetailsPageWrapper'),
  checkout: () => import('../../player/pages/bookings/BookingCheckoutPageWrapper'),
  turfRoute: () => import('../../player/pages/turfs/TurfRoutePageWrapper'),
  listTurf: () => import('../../player/pages/listTurf/ListTurfPage'),
  applicationStatus: () => import('../../admin/pages/owner/ApplicationStatusPage'),
  profile: () => import('../../player/pages/profile/ProfilePage'),
  bookingPass: () => import('../../shared/pages/BookingPassPublicPage'),
  confirmation: () => import('../../player/pages/bookings/BookingConfirmationPageWrapper'),
  paymentSuccess: () => import('../../shared/pages/PaymentSuccess'),
  paymentFailure: () => import('../../shared/pages/PaymentFailure'),
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
