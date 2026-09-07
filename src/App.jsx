import { useEffect, useState, useCallback } from 'react';

import useAuthStore from './store/useAuthStore';

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
import ListTurfPage from './pages/listTurf/ListTurfPage';
import Dashboard from './pages/dashboard/Dashboard';
import SuperadminDashboard from './pages/superadmin/SuperadminDashboard';
import TurfListingPage from './pages/turfs/TurfListingPage';
import BookingCheckoutPage from './pages/bookings/BookingCheckoutPage';
import TurfDetailsPage from './pages/turfs/TurfDetailsPage';
import TurfRoutePage from './pages/turfs/TurfRoutePage';
import turfService from './services/turfService';
import ApplicationStatusPage from './pages/owner/ApplicationStatusPage';
import SetupDashboardPage from './pages/owner/SetupDashboardPage';
import ApplicationSubmittedPage from './pages/owner/ApplicationSubmittedPage';

function App() {
  const {
    user,
    initialize,
    login,
    loginAdmin,
    loginSuperadmin,
    signup,
    googleLogin,
    registerOwner,
    deleteAccount,
    updateProfile,
    logout,
    isInitializing,
  } = useAuthStore();

  const [authMode, setAuthMode] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [routeTurf, setRouteTurf] = useState(null);
  const [selectedTurfForBooking, setSelectedTurfForBooking] = useState(null);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  /**
   * ---------------------------------------------------------
   * Initialize application authentication state & URL routes
   * ---------------------------------------------------------
   */
  useEffect(() => {
    initialize();

    // Check URL path or query params for direct links
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    // Check for turf details route (e.g. /turfs/:id or /turf-details?id=...)
    const turfDetailMatch = pathname.match(/^\/turfs?\/([a-zA-Z0-9_-]+)/);
    const routeMatch = pathname.match(/^\/(route|directions)/) || searchParams.get('page') === 'route' || searchParams.get('page') === 'directions';
    const turfIdParam = searchParams.get('id') || searchParams.get('turfId');
    const targetTurfId = turfDetailMatch ? turfDetailMatch[1] : (turfIdParam || null);

    if (routeMatch) {
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
        })
        .catch(() => {
          setCurrentPage('turfListing');
        });
    } else if (pathname.includes('/admin/login') || pathname.includes('/owner/login') || searchParams.get('page') === 'admin-login') {
      setCurrentPage('adminLogin');
    } else if (pathname.includes('/superadmin/login') || searchParams.get('page') === 'superadmin-login') {
      setCurrentPage('superadminLogin');
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
    } else if (pathname === '/' || pathname === '') {
      setCurrentPage('home');
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      const detailMatch = path.match(/^\/turfs?\/([a-zA-Z0-9_-]+)/);
      const popRouteMatch = path.match(/^\/(route|directions)/) || params.get('page') === 'route' || params.get('page') === 'directions';
      const idParam = params.get('id') || params.get('turfId');
      const popTurfId = detailMatch ? detailMatch[1] : (idParam || null);

      if (popRouteMatch) {
        if (popTurfId) {
          turfService.getTurfById(popTurfId)
            .then((turf) => setRouteTurf(turf))
            .catch(() => setRouteTurf(null));
        }
        setSelectedTurf(null);
        setCurrentPage('route');
      } else if (popTurfId) {
        turfService.getTurfById(popTurfId)
          .then((turf) => {
            setSelectedTurf(turf);
            setCurrentPage('turfDetails');
          })
          .catch(() => {
            setCurrentPage('turfListing');
          });
      } else if (path.includes('/turfs') || path.includes('/find-turfs') || params.get('page') === 'turfs') {
        setSelectedTurf(null);
        setCurrentPage('turfListing');
      } else if (path.includes('/list-turf') || params.get('page') === 'list-turf') {
        setSelectedTurf(null);
        setCurrentPage('listTurf');
      } else if (path.includes('/application-status') || params.get('page') === 'application-status') {
        setSelectedTurf(null);
        setCurrentPage('applicationStatus');
      } else if (path === '/' || path === '') {
        setSelectedTurf(null);
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [initialize]);

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
    const result = await login(credentials);

    if (result.success) {
      setAuthMode(null);

      // Stop One Tap after successful login
      cancelOneTap();

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
      // Create a temporary toast element or use alert if useToast is not accessible here
      // But since we don't have useToast in App.jsx scope directly (it's inside ToastProvider),
      // we can use standard alert for now, or dispatch a custom event if there's a global toast.
      alert(`Profile update failed: ${result.error}`);
    }
  };

  /**
   * ---------------------------------------------------------
   * Logout
   * ---------------------------------------------------------
   */
  const handleLogout = () => {
    logout();

    setAuthMode(null);
    setShowOnboardingModal(false);
    setCurrentPage('home');

    /**
     * Important:
     *
     * After logout, the user becomes unauthenticated.
     *
     * The `user` dependency above changes from:
     *
     *     user → null
     *
     * which causes the One Tap effect to run again.
     *
     * Therefore Google One Tap can automatically appear
     * again after logout.
     */
  };

  /**
   * ---------------------------------------------------------
   * Open login screen & update URL
   * ---------------------------------------------------------
   */
  const handleOpenLogin = () => {
    window.history.pushState({}, '', '/login');
    setAuthMode('login');
  };

  /**
   * ---------------------------------------------------------
   * Open signup screen & update URL
   * ---------------------------------------------------------
   */
  const handleOpenSignUp = () => {
    window.history.pushState({}, '', '/signup');
    setAuthMode('signup');
  };

  const handleCloseAuth = () => {
    window.history.pushState({}, '', '/');
    setAuthMode(null);
  };

  const handleNavigateRoute = (turf) => {
    const target = turf || selectedTurf;
    setRouteTurf(target);
    setSelectedTurf(null);
    window.history.pushState({}, '', `/route${target ? `?turfId=${target.id}` : ''}`);
    setCurrentPage('route');
  };

  /**
   * ---------------------------------------------------------
   * Login screen
   * ---------------------------------------------------------
   */
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
      />
    );
  }

  /**
   * ---------------------------------------------------------
   * Signup screen
   * ---------------------------------------------------------
   */
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
      />
    );
  }

  /**
   * ---------------------------------------------------------
   * Main application
   * ---------------------------------------------------------
   */
  
  // Unified Admin / Superadmin Login Page (/admin/login, /owner/login, /superadmin/login)
  if ((currentPage === 'adminLogin' || currentPage === 'superadminLogin') && !user) {
    return (
      <SuperadminLoginPage
        onLogin={async (credentials) => {
          const res = await loginAdmin(credentials);
          if (res.success && res.user?.role !== 'superadmin') {
            setCurrentPage('dashboard');
          }
          return res;
        }}
        onHome={() => setCurrentPage('home')}
      />
    );
  }

  // Platform staff — the super admin console (turf verification queue, etc.)
  if (user && user.role === 'superadmin') {
    return (
      <>
        <div
          id="gsi_prompt_container"
          className="fixed top-16 right-6 z-[9999]"
        />

        <SuperadminDashboard onLogout={handleLogout} />
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
        onHome={() => setCurrentPage('home')}
        onFindTurfs={() => setCurrentPage('turfListing')}
        onListTurf={() => setCurrentPage('listTurf')}
      />
    );
  }

  // Dashboard Setup Page (Accessible by approved owner with setup token)
  if (currentPage === 'setupDashboard') {
    return (
      <SetupDashboardPage
        onHome={() => setCurrentPage('home')}
        onSetupSuccess={(data) => {
          // Initialize auth state to hydrate the newly created user session
          initialize().then(() => {
            setCurrentPage('dashboard');
          });
        }}
      />
    );
  }

  // Approved venue operator, or a user who explicitly opened the dashboard.
  if (user && (user.role === 'owner' || user.role === 'admin' || currentPage === 'dashboard')) {
    return (
      <>
        <div
          id="gsi_prompt_container"
          className="fixed top-16 right-6 z-[9999]"
        />

        <Dashboard onLogout={handleLogout} />

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
          onAuthReady={initialize}
          onLogout={handleLogout}
          onHome={() => {
            window.history.pushState({}, '', '/');
            setCurrentPage('home');
          }}
          onFindTurfs={() => {
            window.history.pushState({}, '', '/turfs');
            setCurrentPage('turfListing');
          }}
          onSubmitted={(data) => {
            setSubmittedApplication(data);
            setCurrentPage('applicationSubmitted');
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
            window.history.pushState({}, '', `/turfs/${turf.id}`);
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
          onSelectTurf={(turf) => {
            setSelectedTurf(turf);
            window.history.pushState({}, '', `/turfs/${turf.id}`);
            setCurrentPage('turfDetails');
          }}
          onNavigateRoute={handleNavigateRoute}
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
          onHome={() => {
            setSelectedTurfForBooking(null);
            window.history.pushState({}, '', '/');
            setCurrentPage('home');
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
          onBookNow={() => {
            setSelectedTurfForBooking(selectedTurf);
            setSelectedTurf(null);
          }}
          onBack={() => {
            setSelectedTurf(null);
            window.history.pushState({}, '', '/turfs');
            setCurrentPage('turfListing');
          }}
          onNavigateRoute={handleNavigateRoute}
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
        onHome={() => {
          window.history.pushState({}, '', '/');
          setCurrentPage('home');
        }}
        onViewTurfDetails={(turf) => {
          setSelectedTurf(turf);
          window.history.pushState({}, '', `/turfs/${turf.id}`);
          setCurrentPage('turfDetails');
        }}
        onFindTurfs={() => {
          window.history.pushState({}, '', '/turfs');
          setCurrentPage('turfListing');
        }}
        onDashboard={() => setCurrentPage('dashboard')}
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

export default App;