import { useEffect, useState, useCallback, useRef } from 'react';

import { usePlayerAuth, useOwnerAuth } from './store/useAuthStore';

import {
  loadGsiScript,
  initializeGsi,
  showOneTapPrompt,
  cancelOneTap,
} from './services/gsiService';

import LoginPage from './pages/auth/LoginPage';
import SuperadminLoginPage from './pages/auth/SuperadminLoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import HeroSection from './components/HeroSection';
import HeroStats from './components/HeroStats';
import TurfSection from './components/TurfSection';
import HowItWorksAndDownloadSection from './components/HowItWorksAndDownloadSection';
import PricingSection from './components/PricingSection';
import ReviewsSection from './components/ReviewsSection';
import AboutUsSection from './components/AboutUsSection';
import CtaBannerSection from './components/CtaBannerSection';
import Footer from './components/Footer';
import ListTurfPage from './pages/listTurf/ListTurfPage';
import Dashboard from './pages/dashboard/Dashboard';
import SuperadminDashboard from './pages/superadmin/SuperadminDashboard';
import TurfListingPage from './pages/turfs/TurfListingPage';
import BookingCheckoutPage from './pages/bookings/BookingCheckoutPage';
import TurfDetailsPage from './pages/turfs/TurfDetailsPage';
import TurfRoutePage from './pages/turfs/TurfRoutePage';
import BookingPassPublicPage from './pages/BookingPassPublicPage';
import turfService from './services/turfService';
import { useToast } from './components/common/toastContext';
import ApplicationStatusPage from './pages/owner/ApplicationStatusPage';
import SetupDashboardPage from './pages/owner/SetupDashboardPage';
import ApplicationSubmittedPage from './pages/owner/ApplicationSubmittedPage';
import ProfilePage from './pages/profile/ProfilePage';
import AccessibilityModal from './components/common/AccessibilityModal';
import AccessibilityTrigger from './components/common/AccessibilityTrigger';
import ContinueBookingBanner from './components/common/ContinueBookingBanner';
import ChatWidget from './components/chat/ChatWidget';
import useAccessibilityStore from './store/useAccessibilityStore';
import useWishlistStore from './store/useWishlistStore';


const USER_PORT = import.meta.env.VITE_USER_PORT || '5173';
const ADMIN_PORT = import.meta.env.VITE_ADMIN_PORT || '5174';

const getIsAdminPort = () => {
  return window.location.port === String(ADMIN_PORT);
};

const checkIsAdminRoute = (pathname, searchParams) => {
  const page = searchParams ? searchParams.get('page') : null;
  return (
    pathname.includes('/admin') ||
    pathname.includes('/owner/login') ||
    pathname.includes('/superadmin') ||
    pathname.includes('/setup-dashboard') ||
    pathname === '/dashboard' ||
    page === 'admin-login' ||
    page === 'superadmin-login' ||
    page === 'setup-dashboard' ||
    page === 'dashboard'
  );
};

const redirectToPort = (targetPort, path = window.location.pathname, search = window.location.search, hash = window.location.hash) => {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  window.location.href = `${protocol}//${hostname}:${targetPort}${path}${search}${hash}`;
};


function App() {
  const initializeAccessibility = useAccessibilityStore((s) => s.initialize);
  const playerAuth = usePlayerAuth();
  const ownerAuth = useOwnerAuth();

  const user = playerAuth.user;
  const ownerUser = ownerAuth.user;
  const isInitializing = playerAuth.isInitializing;

  const {
    login,
    googleLogin,
    signup,
    updateProfile,
  } = playerAuth;

  const {
    loginAdmin,
    registerOwner,
  } = ownerAuth;

  const { showToast } = useToast();
  const [authMode, setAuthMode] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [, setIsPlayerMode] = useState(false);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [routeTurf, setRouteTurf] = useState(null);
  const [selectedTurfForBooking, setSelectedTurfForBooking] = useState(null);
  const [turfSearch, setTurfSearch] = useState(null);
  const [submittedApplication, setSubmittedApplication] = useState(null);
  const pendingSectionRef = useRef(null);

  /**
   * ---------------------------------------------------------
   * Initialize application authentication state & URL routes
   * ---------------------------------------------------------
   */
  useEffect(() => {
    usePlayerAuth.getState().initialize();
    useOwnerAuth.getState().initialize();
    initializeAccessibility();

    // Check URL path or query params for direct links
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const isAdminPort = getIsAdminPort();
    const isAdminPath = checkIsAdminRoute(pathname, searchParams);

    // Set page title based on port
    document.title = isAdminPort ? 'Turfio - Admin Portal' : 'Turfio - Futsal Booking';

    // Port Guard: enforce port separation
    if (!isAdminPort && isAdminPath) {
      window.history.replaceState({}, '', '/');
      setCurrentPage('home');
      return;
    }

    if (isAdminPort && !isAdminPath && pathname !== '/' && pathname !== '') {
      window.history.replaceState({}, '', '/');
    }

    // Check for booking route (e.g. /turfs/:id/book or ?page=book)
    const bookingMatch = pathname.match(/^\/turfs?\/([a-zA-Z0-9_-]+)\/book/);
    // Check for turf details route (e.g. /turfs/:id or /turf-details?id=...)
    const turfDetailMatch = pathname.match(/^\/turfs?\/([a-zA-Z0-9_-]+)/);
    const routeMatch = pathname.match(/^\/(route|directions)/) || searchParams.get('page') === 'route' || searchParams.get('page') === 'directions';
    const turfIdParam = searchParams.get('id') || searchParams.get('turfId');
    const targetBookingTurfId = bookingMatch ? bookingMatch[1] : (searchParams.get('booking') === 'true' || searchParams.get('page') === 'book' ? (turfIdParam || (turfDetailMatch ? turfDetailMatch[1] : null)) : null);
    const targetTurfId = turfDetailMatch ? turfDetailMatch[1] : (turfIdParam || null);

    // Check for eSewa payment callbacks
    const isPaymentSuccess = pathname.includes('/payment-success');
    const isPaymentFailure = pathname.includes('/payment-failure');
    const esewaDataParam = searchParams.get('data');

    if (isPaymentSuccess) {
      if (esewaDataParam) {
        let pending = {};
        try {
          const raw = sessionStorage.getItem('turfio_pending_booking');
          if (raw) pending = JSON.parse(raw);
        } catch (e) {
          console.error(e);
        }

        turfService.verifyEsewaPayment(esewaDataParam, pending?.bookingPayload)
          .then((res) => {
            console.log('[App] Payment verification response:', res);
            const verifiedBooking = res?.booking;

            const turfData = verifiedBooking?.turf || pending?.turf || selectedTurf || {
              id: 'venue',
              title: 'Turf Venue',
              name: 'Turf Venue',
            };

            const turfId = turfData?.slug || turfData?.id || turfData?._id || 'venue';

            const merged = {
              ...turfData,
              id: turfId,
              selectedDate: verifiedBooking?.date || pending?.turf?.selectedDate,
              selectedTime: verifiedBooking?.timeSlot ? verifiedBooking.timeSlot.split(' - ')[0] : pending?.selectedTimeStr,
              totalAmount: verifiedBooking?.totalAmount || pending?.totalAmount,
              bookingId: verifiedBooking?.bookingId,
            };

            // Also persist in session storage for the checkout page to read step 4
            try {
              sessionStorage.setItem(`turfio_booking_${turfId}`, JSON.stringify(merged));
              sessionStorage.setItem(
                `turfio_checkout_state_${turfId}`,
                JSON.stringify({
                  currentStep: 4,
                  formData: {
                    ...(pending?.formData || {}),
                    bookingId: verifiedBooking?.bookingId,
                  },
                })
              );
            } catch (e) {
              console.error(e);
            }

            setSelectedTurfForBooking(merged);
            setSelectedTurf(null);
            window.history.pushState({}, '', `/turfs/${turfId}/book?step=4`);
            window.dispatchEvent(new PopStateEvent('popstate'));
          })
          .catch((err) => {
            console.error('Payment verification failed:', err);
            sessionStorage.removeItem('turfio_pending_booking');
            setCurrentPage('home');
          });
      } else {
        // A success page without eSewa callback data is not a verified payment.
        sessionStorage.removeItem('turfio_pending_booking');
        setCurrentPage('home');
      }
    } else if (isPaymentFailure) {
      showToast('eSewa payment was cancelled or failed. Please try again.', 'error');
      setCurrentPage('turfListing');
    } else if (targetBookingTurfId) {
      // Restore booking checkout page on reload or direct link
      turfService.getTurfById(targetBookingTurfId)
        .then((turfData) => {
          let cachedBooking = {};
          try {
            const raw = sessionStorage.getItem(`turfio_booking_${targetBookingTurfId}`);
            if (raw) cachedBooking = JSON.parse(raw);
          } catch (e) {
            console.error(e);
          }
          const holdTokenFromUrl = searchParams.get('holdToken');
          const merged = {
            ...turfData,
            ...cachedBooking,
            ...(holdTokenFromUrl ? { holdToken: holdTokenFromUrl } : {}),
          };
          setSelectedTurfForBooking(merged);
          setSelectedTurf(null);

          if (turfData?.slug && !pathname.includes(`/turfs/${turfData.slug}`)) {
            window.history.replaceState({}, '', `/turfs/${turfData.slug}/book${window.location.search}`);
          }
        })
        .catch(() => {
          setCurrentPage('turfListing');
        });
    } else if (routeMatch) {
      if (targetTurfId) {
        turfService.getTurfById(targetTurfId)
          .then((turf) => setRouteTurf(turf))
          .catch(() => setRouteTurf(null));
      }
      setSelectedTurf(null);
      setCurrentPage('route');
    } else if (targetTurfId) {
      turfService.getTurfById(targetTurfId)
        .then((turf) => {
          setSelectedTurf(turf);
          setCurrentPage('turfDetails');
          if (turf?.slug && pathname !== `/turfs/${turf.slug}`) {
            window.history.replaceState({}, '', `/turfs/${turf.slug}`);
          }
        })
        .catch(() => {
          setCurrentPage('turfListing');
        });
    } else if (pathname.includes('/admin/login') || pathname.includes('/owner/login') || searchParams.get('page') === 'admin-login') {
      setCurrentPage('adminLogin');
    } else if (pathname.includes('/superadmin/login') || searchParams.get('page') === 'superadmin-login') {
      setCurrentPage('superadminLogin');
    } else if (pathname.includes('/booking-pass/')) {
      setCurrentPage('bookingPass');
    } else if (pathname === '/login' || searchParams.get('page') === 'login') {
      setAuthMode('login');
    } else if (pathname === '/signup' || pathname === '/register' || searchParams.get('page') === 'signup') {
      setAuthMode('signup');
    } else if (pathname.includes('/turfs') || pathname.includes('/find-turfs') || searchParams.get('page') === 'turfs' || searchParams.get('page') === 'turfListing') {
      setCurrentPage('turfListing');
    } else if (pathname.includes('/list-turf') || searchParams.get('page') === 'list-turf' || searchParams.get('page') === 'listTurf') {
      setCurrentPage('listTurf');
    } else if (pathname.includes('/application-status') || searchParams.get('page') === 'application-status' || (searchParams.has('token') && !pathname.includes('/setup-dashboard') && !searchParams.get('page'))) {
      setCurrentPage('applicationStatus');
    } else if (pathname.includes('/setup-dashboard') || searchParams.get('page') === 'setup-dashboard') {
      setCurrentPage('setupDashboard');
    } else if (pathname === '/profile' || searchParams.get('page') === 'profile') {
      setCurrentPage('profile');
    } else if (pathname.includes('/dashboard') || searchParams.get('page') === 'dashboard') {
      setCurrentPage('dashboard');
    } else if (pathname === '/' || pathname === '') {
      if (isAdminPort) {
        const currentOwner = useOwnerAuth.getState().user;
        if (currentOwner) {
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('adminLogin');
        }
      } else {
        setCurrentPage('home');
      }
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const isAdPort = getIsAdminPort();
      const isAdPath = checkIsAdminRoute(path, params);

      if (!isAdPort && isAdPath) {
        window.history.replaceState({}, '', '/');
        setCurrentPage('home');
        return;
      }
      if (isAdPort && !isAdPath && path !== '/' && path !== '') {
        window.history.replaceState({}, '', '/');
      }

      const popBookingMatch = path.match(/^\/turfs?\/([a-zA-Z0-9_-]+)\/book/);
      const detailMatch = path.match(/^\/turfs?\/([a-zA-Z0-9_-]+)/);
      const popRouteMatch = path.match(/^\/(route|directions)/) || params.get('page') === 'route' || params.get('page') === 'directions';
      const idParam = params.get('id') || params.get('turfId');
      const popBookingTurfId = popBookingMatch ? popBookingMatch[1] : (params.get('booking') === 'true' || params.get('page') === 'book' ? (idParam || (detailMatch ? detailMatch[1] : null)) : null);
      const popTurfId = detailMatch ? detailMatch[1] : (idParam || null);

      if (popBookingTurfId) {
        turfService.getTurfById(popBookingTurfId)
          .then((turfData) => {
            let cached = {};
            try {
              const raw = sessionStorage.getItem(`turfio_booking_${popBookingTurfId}`);
              if (raw) cached = JSON.parse(raw);
            } catch (e) {
              console.error(e);
            }
            setSelectedTurfForBooking({ ...turfData, ...cached });
            setSelectedTurf(null);
            setCurrentPage('booking');
          })
          .catch(() => {
            setCurrentPage('turfListing');
          });

      } else if (popRouteMatch) {
        if (popTurfId) {
          turfService.getTurfById(popTurfId)
            .then((turf) => setRouteTurf(turf))
            .catch(() => setRouteTurf(null));
        }
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        setCurrentPage('route');
      } else if (popTurfId) {
        turfService.getTurfById(popTurfId)
          .then((turf) => {
            setSelectedTurf(turf);
            setSelectedTurfForBooking(null);
            setCurrentPage('turfDetails');
          })
          .catch(() => {
            setCurrentPage('turfListing');
          });
      } else if (path.includes('/turfs') || path.includes('/find-turfs') || params.get('page') === 'turfs') {
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        setCurrentPage('turfListing');
      } else if (path.includes('/list-turf') || params.get('page') === 'list-turf') {
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        setCurrentPage('listTurf');
      } else if (path.includes('/application-status') || params.get('page') === 'application-status') {
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        setCurrentPage('applicationStatus');
      } else if (path.includes('/booking-pass/')) {
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        setCurrentPage('bookingPass');
      } else if (path === '/profile' || params.get('page') === 'profile') {
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        setCurrentPage('profile');
      } else if (path.includes('/dashboard') || params.get('page') === 'dashboard') {
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        setCurrentPage('dashboard');
      } else if (path === '/' || path === '') {
        setSelectedTurf(null);
        setSelectedTurfForBooking(null);
        if (isAdPort) {
          const currentOwner = useOwnerAuth.getState().user;
          if (currentOwner) {
            setCurrentPage('dashboard');
          } else {
            setCurrentPage('adminLogin');
          }
        } else {
          setCurrentPage('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  /**
   * ---------------------------------------------------------
   * Sync Admin Portal URL with auth state on port 5174
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!getIsAdminPort()) return;

    if (ownerUser) {
      if (window.location.pathname.includes('/login') || window.location.pathname === '/') {
        window.history.replaceState({}, '', '/dashboard');
        setCurrentPage('dashboard');
      }
    } else {
      if (window.location.pathname.includes('/dashboard')) {
        window.history.replaceState({}, '', '/admin/login');
        setCurrentPage('adminLogin');
      }
    }
  }, [ownerUser]);

  /**
   * ---------------------------------------------------------
   * Automatically show onboarding if profile is incomplete
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (user && !user.isProfileCompleted && !isInitializing) {
      setShowOnboardingModal(true);
    }
  }, [user, isInitializing]);

  /**
   * ---------------------------------------------------------
   * Fire any pending section scroll after landing page renders
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (currentPage !== 'home' || selectedTurf || selectedTurfForBooking) {
      return;
    }

    let targetId = pendingSectionRef.current;
    if (!targetId) {
      try {
        targetId = sessionStorage.getItem('turfio_scroll_section');
      } catch { /* sessionStorage unavailable */ }
    }
    if (!targetId && window.location.hash) {
      targetId = window.location.hash.replace(/^#/, '');
    }

    if (!targetId) return;

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 30; // 30 * 50ms = 1.5s window for elements to mount

    const scrollTimer = setInterval(() => {
      if (cancelled) {
        clearInterval(scrollTimer);
        return;
      }

      attempts += 1;
      const el = document.getElementById(targetId);

      if (el) {
        clearInterval(scrollTimer);
        pendingSectionRef.current = null;
        try {
          sessionStorage.removeItem('turfio_scroll_section');
        } catch { /* sessionStorage unavailable */ }

        // Scroll to section smoothly
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts >= maxAttempts) {
        clearInterval(scrollTimer);
        pendingSectionRef.current = null;
        try {
          sessionStorage.removeItem('turfio_scroll_section');
        } catch { /* sessionStorage unavailable */ }
      }
    }, 50);

    return () => {
      cancelled = true;
      clearInterval(scrollTimer);
    };
  }, [currentPage, selectedTurf, selectedTurfForBooking]);

  /**
   * ---------------------------------------------------------
   * Google authentication
   * ---------------------------------------------------------
   */
  const handleGoogleLoginSuccess = useCallback(
    async (idToken) => {
      if (!idToken) {
        return {
          success: false,
          error: 'Google did not return an ID token.',
        };
      }

      const result = await googleLogin(idToken);

      if (result.success) {
        // Close login/signup screens
        setAuthMode(null);

        // Stop any active One Tap prompt
        cancelOneTap();

        // Show onboarding if necessary
        if (result.user && !result.user.isProfileCompleted) {
          setShowOnboardingModal(true);
        }

        return {
          success: true,
          user: result.user,
        };
      }

      return {
        success: false,
        error: result.error,
      };
    },
    [googleLogin]
  );

  /**
   * ---------------------------------------------------------
   * Normal email/password login
   * ---------------------------------------------------------
   */
  const handleLoginSuccess = async (credentials) => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectToParam = searchParams.get('redirectTo');
    const result = await login({
      ...credentials,
      redirectTo: credentials?.redirectTo || redirectToParam || undefined,
    });

    if (result.success) {
      setAuthMode(null);

      // Stop One Tap after successful login
      cancelOneTap();

      if (result.user && !result.user.isProfileCompleted) {
        setShowOnboardingModal(true);
      }

      if (result.redirectTo === '/dashboard' || redirectToParam === '/dashboard') {
        window.history.pushState({}, '', '/dashboard');
        setCurrentPage('dashboard');
      }

      return {
        success: true,
        user: result.user,
        redirectTo: result.redirectTo || redirectToParam,
      };
    }

    return {
      success: false,
      error: result.error,
    };
  };

  /**
   * ---------------------------------------------------------
   * Sign up
   * ---------------------------------------------------------
   */
  const handleStartOnboarding = async (credentials) => {
    const result = await signup(credentials);

    if (result.success) {
      setAuthMode(null);

      // Stop One Tap after successful signup
      cancelOneTap();

      setShowOnboardingModal(true);

      return {
        success: true,
        user: result.user,
      };
    }

    return {
      success: false,
      error: result.error,
    };
  };

  /**
   * ---------------------------------------------------------
   * Handle Google OAuth redirect token
   *
   * If Google redirects back with:
   *
   * #id_token=...
   *
   * process it once and immediately clean the URL.
   * ---------------------------------------------------------
   */
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash || !hash.includes('id_token=')) {
      return;
    }

    const cleanHash = hash.startsWith('#')
      ? hash.substring(1)
      : hash;

    const hashParams = new URLSearchParams(cleanHash);

    const idToken = hashParams.get('id_token');

    if (!idToken) {
      return;
    }

    // Remove token from browser URL immediately
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );

    // Process authentication after current render
    Promise.resolve().then(() => {
      handleGoogleLoginSuccess(idToken);
    });
  }, [handleGoogleLoginSuccess]);

  /**
   * ---------------------------------------------------------
   * Automatic Google One Tap
   *
   * Only starts when:
   *
   * - User is not logged in
   * - Auth initialization is complete
   * - Google Client ID exists
   *
   * ---------------------------------------------------------
   */
  useEffect(() => {
    // Never show One Tap on Admin port (5174)
    if (getIsAdminPort()) {
      cancelOneTap();
      return;
    }

    const googleClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID;

    // Don't initialize One Tap while auth state is unknown.
    if (isInitializing) {
      return;
    }

    // User is already authenticated.
    if (user) {
      cancelOneTap();
      return;
    }

    // Google Client ID is missing.
    if (!googleClientId) {
      console.warn(
        '[App] VITE_GOOGLE_CLIENT_ID is missing.'
      );
      return;
    }

    // Prevent placeholder configuration from being used.
    if (
      googleClientId.includes(
        'your_google_client_id'
      )
    ) {
      console.warn(
        '[App] Google Client ID is still a placeholder.'
      );
      return;
    }

    let cancelled = false;

    const startGoogleOneTap = async () => {
      try {
        // Load GSI
        await loadGsiScript();

        if (cancelled) {
          return;
        }

        // Initialize GSI
        const initialized = initializeGsi(
          googleClientId,
          (credential) => {
            if (cancelled) {
              return;
            }

            handleGoogleLoginSuccess(credential);
          }
        );

        if (!initialized) {
          console.warn(
            '[App] Google Identity Services initialization failed.'
          );
          return;
        }

        if (cancelled) {
          return;
        }

        // Automatically show One Tap
        showOneTapPrompt((notification) => {
          if (cancelled) {
            return;
          }

          if (notification?.moment === 'display') {
            console.log(
              '[App] Google One Tap displayed.'
            );
          }

          if (
            notification?.moment === 'not_displayed'
          ) {
            console.log(
              '[App] Google One Tap was not displayed:',
              notification.reason
            );
          }

          if (
            notification?.moment === 'skipped'
          ) {
            console.log(
              '[App] Google One Tap was skipped:',
              notification.reason
            );
          }

          if (
            notification?.moment === 'dismissed'
          ) {
            console.log(
              '[App] Google One Tap was dismissed:',
              notification.reason
            );
          }
        });
      } catch (error) {
        if (!cancelled) {
          console.warn(
            '[App] Failed to initialize Google One Tap:',
            error
          );
        }
      }
    };

    startGoogleOneTap();

    /**
     * Cleanup when:
     *
     * - component unmounts
     * - user becomes authenticated
     * - authentication initialization changes
     */
    return () => {
      cancelled = true;
      cancelOneTap();
    };
  }, [
    user,
    isInitializing,
    handleGoogleLoginSuccess,
  ]);

  /**
   * ---------------------------------------------------------
   * Onboarding
   * ---------------------------------------------------------
   */
  const handleOnboardingComplete = async (
    onboardingDetails
  ) => {
    const result = await updateProfile(
      onboardingDetails
    );

    if (result.success) {
      setShowOnboardingModal(false);
    } else {
      showToast(`Profile update failed: ${result.error}`, 'error');
    }
  };

  /**
   * ---------------------------------------------------------
   * Logout
   * ---------------------------------------------------------
   */
  const handleLogout = (targetContext = 'player') => {
    if (targetContext === 'owner') {
      ownerAuth.logout();
      if (!getIsAdminPort()) {
        redirectToPort(ADMIN_PORT, '/admin/login');
        return;
      }
      window.history.pushState({}, '', '/admin/login');
      setAuthMode(null);
      setCurrentPage('adminLogin');
    } else {
      playerAuth.logout();
      useWishlistStore.getState().reset();
      if (getIsAdminPort()) {
        redirectToPort(USER_PORT, '/login');
        return;
      }
      window.history.pushState({}, '', '/login');
      setAuthMode('login');
      setCurrentPage('login');
    }
    setShowOnboardingModal(false);
  };

  /**
   * ---------------------------------------------------------
   * Open login screen & update URL
   * ---------------------------------------------------------
   */
  const handleOpenLogin = () => {
    if (getIsAdminPort()) {
      redirectToPort(USER_PORT, '/login');
      return;
    }
    window.history.pushState({}, '', '/login');
    setAuthMode('login');
  };

  /**
   * ---------------------------------------------------------
   * Open signup screen & update URL
   * ---------------------------------------------------------
   */
  const handleOpenSignUp = () => {
    if (getIsAdminPort()) {
      redirectToPort(USER_PORT, '/signup');
      return;
    }
    window.history.pushState({}, '', '/signup');
    setAuthMode('signup');
  };

  const handleCloseAuth = () => {
    if (getIsAdminPort()) {
      redirectToPort(USER_PORT, '/');
      return;
    }
    window.history.pushState({}, '', '/');
    setAuthMode(null);
  };

  const handleNavigateHome = () => {
    if (getIsAdminPort()) {
      redirectToPort(USER_PORT, '/');
      return;
    }
    window.history.pushState({}, '', '/');
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Navigate to a specific section on the landing page.
   * If already on home, scrolls immediately.
   * If on another page, navigates home and sets a pending scroll.
   */
  const handleNavigateToSection = (sectionId) => {
    if (getIsAdminPort()) {
      redirectToPort(USER_PORT, `/#${sectionId}`);
      return;
    }

    try {
      sessionStorage.setItem('turfio_scroll_section', sectionId);
    } catch { /* sessionStorage unavailable */ }
    pendingSectionRef.current = sectionId;
    window.history.pushState({}, '', `/#${sectionId}`);

    const scrollToEl = (id) => {
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        try {
          sessionStorage.removeItem('turfio_scroll_section');
        } catch { /* sessionStorage unavailable */ }
        return true;
      }
      return false;
    };

    if (currentPage === 'home' && !selectedTurf && !selectedTurfForBooking) {
      scrollToEl(sectionId);
    } else {
      setSelectedTurf(null);
      setSelectedTurfForBooking(null);
      setCurrentPage('home');
    }
  };

  const handleNavigateRoute = (turf) => {
    if (getIsAdminPort()) {
      const targetId = turf ? (turf.slug || turf.id || turf._id) : '';
      redirectToPort(USER_PORT, '/route', targetId ? `?turfId=${targetId}` : '');
      return;
    }
    const target = turf || selectedTurf;
    setRouteTurf(target);
    setSelectedTurf(null);
    const targetId = target ? (target.slug || target.id || target._id) : '';
    window.history.pushState({}, '', `/route${targetId ? `?turfId=${targetId}` : ''}`);
    setCurrentPage('route');
  };

  const handleOpenDashboard = () => {
    if (!getIsAdminPort()) {
      redirectToPort(ADMIN_PORT, '/dashboard');
      return;
    }
    setIsPlayerMode(false);
    window.history.pushState({}, '', '/dashboard');
    setCurrentPage('dashboard');
  };

  /**
   * ---------------------------------------------------------
   * Main application view resolution
   * ---------------------------------------------------------
   */
  const renderCurrentView = () => {
    if (getIsAdminPort()) {
      if (ownerUser && ownerUser.role === 'superadmin') {
        return <SuperadminDashboard onLogout={() => handleLogout('owner')} />;
      }

      if (ownerUser && (ownerUser.role === 'owner' || ownerUser.role === 'admin' || ownerUser.isTurfAdmin)) {
        return (
          <>
            <Dashboard user={ownerUser} onLogout={() => handleLogout('owner')} />
            {showOnboardingModal && (
              <OnboardingPage
                userData={ownerUser || {}}
                onComplete={handleOnboardingComplete}
                onClose={() => setShowOnboardingModal(false)}
              />
            )}
          </>
        );
      }

      if (currentPage === 'setupDashboard') {
        return (
          <SetupDashboardPage
            onHome={() => {
              window.history.pushState({}, '', '/');
              setCurrentPage('adminLogin');
            }}
            onSetupSuccess={(data) => {
              if (data?.token && data?.user) {
                ownerAuth.setOwnerSession(data.token, data.user);
              }
              window.history.pushState({}, '', '/dashboard');
              setCurrentPage('dashboard');
            }}
          />
        );
      }

      return (
        <SuperadminLoginPage
          onLogin={async (credentials) => {
            const res = await loginAdmin(credentials);
            if (res.success && res.user?.role !== 'superadmin') {
              window.history.pushState({}, '', '/dashboard');
              setCurrentPage('dashboard');
            }
            return res;
          }}
          onHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentPage('adminLogin');
          }}
        />
      );
    }

    // Login screen
    if (authMode === 'login') {
      return (
        <LoginPage
          onLogin={async (credentials) => {
            const res = await handleLoginSuccess(credentials);
            if (res.success) {
              window.history.pushState({}, '', '/');
            }
            return res;
          }}
          onGoogleLogin={handleGoogleLoginSuccess}
          onSwitchToSignUp={() => {
            window.history.pushState({}, '', '/signup');
            setAuthMode('signup');
          }}
          onClose={handleCloseAuth}
          onHome={() => {
            handleCloseAuth();
            setCurrentPage('home');
          }}
          onListTurf={() => {
            handleCloseAuth();
            setCurrentPage('listTurf');
          }}
          onFindTurfs={() => {
            handleCloseAuth();
            setCurrentPage('turfListing');
          }}
          onHowItWorks={() => handleNavigateToSection('how-it-works')}
          onPricing={() => handleNavigateToSection('pricing')}
          onAboutUs={() => handleNavigateToSection('about-us')}
        />
      );
    }

    // Signup screen
    if (authMode === 'signup') {
      return (
        <SignUpPage
          onSignUp={async (credentials) => {
            const res = await handleStartOnboarding(credentials);
            if (res.success) {
              window.history.pushState({}, '', '/');
            }
            return res;
          }}
          onGoogleLogin={handleGoogleLoginSuccess}
          onSwitchToLogin={() => {
            window.history.pushState({}, '', '/login');
            setAuthMode('login');
          }}
          onClose={handleCloseAuth}
          onHome={() => {
            handleCloseAuth();
            setCurrentPage('home');
          }}
          onListTurf={() => {
            handleCloseAuth();
            setCurrentPage('listTurf');
          }}
          onFindTurfs={() => {
            handleCloseAuth();
            setCurrentPage('turfListing');
          }}
          onHowItWorks={() => handleNavigateToSection('how-it-works')}
          onPricing={() => handleNavigateToSection('pricing')}
          onAboutUs={() => handleNavigateToSection('about-us')}
        />
      );
    }

    // Unified Admin / Superadmin Login Page (/admin/login, /owner/login, /superadmin/login)
    if ((currentPage === 'adminLogin' || currentPage === 'superadminLogin') && !ownerUser) {
      return (
        <SuperadminLoginPage
          onLogin={async (credentials) => {
            const res = await loginAdmin(credentials);
            if (res.success && res.user?.role !== 'superadmin') {
              window.history.pushState({}, '', '/dashboard');
              setCurrentPage('dashboard');
            }
            return res;
          }}
          onHome={handleNavigateHome}
        />
      );
    }

    // Platform staff — the super admin console (turf verification queue, etc.)
    if (ownerUser && ownerUser.role === 'superadmin') {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <SuperadminDashboard onLogout={() => handleLogout('owner')} />
        </>
      );
    }

    // Application Status Page (Accessible by public with tracking token)
    if (currentPage === 'applicationStatus') {
      return (
        <ApplicationStatusPage
          onLogin={handleOpenLogin}
          user={user}
          onLogout={handleLogout}
          onHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentPage('home');
          }}
          onFindTurfs={() => {
            window.history.pushState({}, '', '/turfs');
            setCurrentPage('turfListing');
          }}
          onListTurf={() => {
            window.history.pushState({}, '', '/list-turf');
            setCurrentPage('listTurf');
          }}
          onDashboard={handleOpenDashboard}
          onHowItWorks={() => handleNavigateToSection('how-it-works')}
          onPricing={() => handleNavigateToSection('pricing')}
          onAboutUs={() => handleNavigateToSection('about-us')}
        />
      );
    }

    // Booking Pass Public Page (Accessible via QR code scan)
    if (currentPage === 'bookingPass') {
      return <BookingPassPublicPage />;
    }

    if (currentPage === 'profile') {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <ProfilePage
            onHome={() => {
              window.history.pushState({}, '', '/');
              setCurrentPage('home');
            }}
            onFindTurfs={() => {
              window.history.pushState({}, '', '/turfs');
              setCurrentPage('turfListing');
            }}
            onListTurf={() => {
              window.history.pushState({}, '', '/list-turf');
              setCurrentPage('listTurf');
            }}
            onLogin={handleOpenLogin}
            onLogout={handleLogout}
            onDashboard={handleOpenDashboard}
            onViewTurfDetails={(turf) => {
              setSelectedTurf(turf);
              const turfId = turf.slug || turf.id || turf._id;
              window.history.pushState({}, '', `/turfs/${turfId}`);
              setCurrentPage('turfDetails');
            }}
            onHowItWorks={() => handleNavigateToSection('how-it-works')}
              onPricing={() => handleNavigateToSection('pricing')}
            onAboutUs={() => handleNavigateToSection('about-us')}
          />

          {showOnboardingModal && (
            <OnboardingPage
              userData={user || {}}
              onComplete={handleOnboardingComplete}
              onClose={() =>
                setShowOnboardingModal(false)
              }
            />
          )}
        </>
      );
    }

    // Dashboard Setup Page (Accessible by approved owner with setup token)
    if (currentPage === 'setupDashboard') {
      return (
        <SetupDashboardPage
          onHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentPage('home');
          }}
          onSetupSuccess={(data) => {
            if (data?.token && data?.user) {
              ownerAuth.setOwnerSession(data.token, data.user);
            }
            window.history.pushState({}, '', '/dashboard');
            setCurrentPage('dashboard');
          }}
        />
      );
    }

    // Approved venue operator viewing their dashboard
    if (currentPage === 'dashboard' && ownerUser && (ownerUser.role === 'owner' || ownerUser.role === 'admin' || ownerUser.isTurfAdmin)) {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <Dashboard
            user={ownerUser}
            onLogout={() => handleLogout('owner')}
          />

          {showOnboardingModal && (
            <OnboardingPage
              userData={ownerUser || {}}
              onComplete={handleOnboardingComplete}
              onClose={() =>
                setShowOnboardingModal(false)
              }
            />
          )}
        </>
      );
    }

    if (currentPage === 'applicationSubmitted') {
      return (
        <ApplicationSubmittedPage
          data={submittedApplication}
          onHome={() => {
            setSubmittedApplication(null);
            setCurrentPage('home');
          }}
          onTrack={(token) => {
            window.history.pushState({}, '', `/application-status?token=${token}`);
            setCurrentPage('applicationStatus');
          }}
          onLogin={() => {
            setAuthMode('login');
            setCurrentPage('login');
          }}
          onSignUp={() => {
            setAuthMode('signup');
            setCurrentPage('signup');
          }}
          onListTurf={() => setCurrentPage('listTurf')}
          onFindTurfs={() => setCurrentPage('turfs')}
          onHowItWorks={() => handleNavigateToSection('how-it-works')}
          onPricing={() => handleNavigateToSection('pricing')}
          onAboutUs={() => handleNavigateToSection('about-us')}
        />
      );
    }

    if (currentPage === 'listTurf') {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <ListTurfPage
            onLogin={handleOpenLogin}
            user={user}
            onRegisterOwner={registerOwner}
            onAuthReady={() => {
              playerAuth.initialize();
              ownerAuth.initialize();
            }}
            onLogout={handleLogout}
            onHome={() => {
              window.history.pushState({}, '', '/');
              setCurrentPage('home');
            }}
            onFindTurfs={() => {
              window.history.pushState({}, '', '/turfs');
              setCurrentPage('turfListing');
            }}
            onDashboard={handleOpenDashboard}
            onSubmitted={(data) => {
              setSubmittedApplication(data);
              setCurrentPage('applicationSubmitted');
            }}
            onHowItWorks={() => handleNavigateToSection('how-it-works')}
              onPricing={() => handleNavigateToSection('pricing')}
            onAboutUs={() => handleNavigateToSection('about-us')}
          />

          {showOnboardingModal && (
            <OnboardingPage
              userData={user || {}}
              onComplete={handleOnboardingComplete}
              onClose={() =>
                setShowOnboardingModal(false)
              }
            />
          )}
        </>
      );
    }

    if (currentPage === 'route') {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <TurfRoutePage
            initialTurf={routeTurf}
            onBack={() => {
              window.history.pushState({}, '', '/turfs');
              setCurrentPage('turfListing');
            }}
            onBookTurf={(turf) => {
              setSelectedTurfForBooking(turf);
              setCurrentPage('home');
            }}
            onViewTurfDetails={(turf) => {
              setSelectedTurf(turf);
              const turfId = turf.slug || turf.id || turf._id;
              window.history.pushState({}, '', `/turfs/${turfId}`);
              setCurrentPage('turfDetails');
            }}
          />

          {showOnboardingModal && (
            <OnboardingPage
              userData={user || {}}
              onComplete={handleOnboardingComplete}
              onClose={() =>
                setShowOnboardingModal(false)
              }
            />
          )}
        </>
      );
    }

    if (currentPage === 'turfListing') {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <TurfListingPage
            user={user}
            initialSearch={turfSearch}
            onLogin={handleOpenLogin}
            onLogout={handleLogout}
            onListTurf={() => {
              window.history.pushState({}, '', '/list-turf');
              setCurrentPage('listTurf');
            }}
            onHome={() => {
              window.history.pushState({}, '', '/');
              setCurrentPage('home');
            }}
            onDashboard={handleOpenDashboard}
            onSelectTurf={(turf) => {
              const selected = {
                ...turf,
                selectedDate: turf.selectedDate || turfSearch?.date,
                selectedTime: turf.selectedTime || turfSearch?.time,
              };
              setSelectedTurf(selected);
              const turfId = selected.slug || selected.id || selected._id;
              window.history.pushState({}, '', `/turfs/${turfId}`);
              setCurrentPage('turfDetails');
            }}
            onNavigateRoute={handleNavigateRoute}
            onHowItWorks={() => handleNavigateToSection('how-it-works')}
              onPricing={() => handleNavigateToSection('pricing')}
            onAboutUs={() => handleNavigateToSection('about-us')}
          />

          {showOnboardingModal && (
            <OnboardingPage
              userData={user || {}}
              onComplete={handleOnboardingComplete}
              onClose={() =>
                setShowOnboardingModal(false)
              }
            />
          )}
        </>
      );
    }

    if (selectedTurfForBooking) {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <BookingCheckoutPage
            onLogin={handleOpenLogin}
            user={user}
            onLogout={handleLogout}
            turf={selectedTurfForBooking}
            onBack={() => {
              const target = selectedTurfForBooking;
              setSelectedTurf(target);
              setSelectedTurfForBooking(null);
              const targetId = target?.slug || target?.id || target?._id;
              if (targetId) {
                window.history.pushState({}, '', `/turfs/${targetId}`);
              }
            }}
            onHome={() => {
              setSelectedTurfForBooking(null);
              window.history.pushState({}, '', '/');
              setCurrentPage('home');
            }}
            onDashboard={handleOpenDashboard}
            onViewTurfDetails={(t) => {
              const target = t || selectedTurfForBooking;
              setSelectedTurf(target);
              setSelectedTurfForBooking(null);
              const targetId = target?.slug || target?.id || target?._id;
              if (targetId) {
                window.history.pushState({}, '', `/turfs/${targetId}`);
              }
            }}
            onNavigateRoute={handleNavigateRoute}
            onHowItWorks={() => handleNavigateToSection('how-it-works')}
              onPricing={() => handleNavigateToSection('pricing')}
            onAboutUs={() => handleNavigateToSection('about-us')}
          />

          {showOnboardingModal && (
            <OnboardingPage
              userData={user || {}}
              onComplete={handleOnboardingComplete}
              onClose={() =>
                setShowOnboardingModal(false)
              }
            />
          )}
        </>
      );
    }

    if (selectedTurf) {
      return (
        <>
          <div
            id="gsi_prompt_container"
            className="fixed top-16 right-6 z-[9999]"
          />

          <TurfDetailsPage
            turf={selectedTurf}
            user={user}
            onLogin={handleOpenLogin}
            onLogout={handleLogout}
            onListTurf={() => {
              window.history.pushState({}, '', '/list-turf');
              setCurrentPage('listTurf');
            }}
            onHome={() => {
              setSelectedTurf(null);
              window.history.pushState({}, '', '/');
              setCurrentPage('home');
            }}
            onFindTurfs={() => {
              setSelectedTurf(null);
              window.history.pushState({}, '', '/turfs');
              setCurrentPage('turfListing');
            }}
            onDashboard={handleOpenDashboard}
            onBookNow={(bookingDetails) => {
              const target = bookingDetails || selectedTurf;
              const targetId = target?.slug || target?.id || target?._id;
              try {
                sessionStorage.setItem(`turfio_booking_${target.id || target._id}`, JSON.stringify(target));
              } catch (e) {
                console.error(e);
              }
              window.history.pushState({}, '', `/turfs/${targetId}/book`);
              setSelectedTurfForBooking(target);
              setSelectedTurf(null);
            }}
            onBack={() => {
              setSelectedTurf(null);
              window.history.pushState({}, '', '/turfs');
              setCurrentPage('turfListing');
            }}
            onNavigateRoute={handleNavigateRoute}
            onHowItWorks={() => handleNavigateToSection('how-it-works')}
              onPricing={() => handleNavigateToSection('pricing')}
            onAboutUs={() => handleNavigateToSection('about-us')}
          />

          {showOnboardingModal && (
            <OnboardingPage
              userData={user || {}}
              onComplete={handleOnboardingComplete}
              onClose={() =>
                setShowOnboardingModal(false)
              }
            />
          )}
        </>
      );
    }

    return (
      <>
        {/* 
          Google One Tap container.

          Keep this element mounted while the main app
          is rendered.
        */}
        <div
          id="gsi_prompt_container"
          className="fixed top-16 right-6 z-[9999]"
        />

        <HeroSection
          onLogin={handleOpenLogin}
          onSignUp={handleOpenSignUp}
          user={user}
          isInitializing={isInitializing}
          onLogout={handleLogout}
          onListTurf={() => {
            window.history.pushState({}, '', '/list-turf');
            setCurrentPage('listTurf');
          }}
          onHome={handleNavigateHome}
          onViewTurfDetails={(turf) => {
            setSelectedTurf(turf);
            const turfId = turf.slug || turf.id || turf._id;
            window.history.pushState({}, '', `/turfs/${turfId}`);
            setCurrentPage('turfDetails');
          }}
          onFindTurfs={(search) => {
            setTurfSearch(search || null);
            window.history.pushState({}, '', '/turfs');
            setCurrentPage('turfListing');
          }}
          onDashboard={handleOpenDashboard}
          onProfile={() => {
            window.history.pushState({}, '', '/profile');
            setCurrentPage('profile');
          }}
          onHowItWorks={() => handleNavigateToSection('how-it-works')}
          onPricing={() => handleNavigateToSection('pricing')}
          onAboutUs={() => handleNavigateToSection('about-us')}
        />
        <HeroStats />
        <TurfSection
          onBookNow={handleOpenLogin}
          onViewDetails={(turf) => {
            setSelectedTurf(turf);
            const turfId = turf.slug || turf.id || turf._id;
            window.history.pushState({}, '', `/turfs/${turfId}`);
            setCurrentPage('turfDetails');
          }}
        />
        <HowItWorksAndDownloadSection />
        <PricingSection
          onExploreTurfs={(search) => {
            setTurfSearch(search || null);
            window.history.pushState({}, '', '/turfs');
            setCurrentPage('turfListing');
          }}
        />
        <ReviewsSection />
        <AboutUsSection />
        <CtaBannerSection
          onBookNow={
            user
              ? (search) => {
                  setTurfSearch(search || null);
                  window.history.pushState({}, '', '/turfs');
                  setCurrentPage('turfListing');
                }
              : handleOpenLogin
          }
        />
        <Footer />

        {showOnboardingModal && (
          <OnboardingPage
            userData={user || {}}
            onComplete={handleOnboardingComplete}
            onClose={() =>
              setShowOnboardingModal(false)
            }
          />
        )}
      </>
    );
  };

  return (
    <>
      {renderCurrentView()}
      <AccessibilityModal />
      <AccessibilityTrigger />
      <ContinueBookingBanner />
      <ChatWidget />
    </>
  );
}


export default App;