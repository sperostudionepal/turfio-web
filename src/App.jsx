import { useEffect, useState, useCallback } from 'react';

import useAuthStore from './store/useAuthStore';

import {
  loadGsiScript,
  initializeGsi,
  showOneTapPrompt,
  cancelOneTap,
} from './services/gsiService';

import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import HeroSection from './components/HeroSection';
import ListTurfPage from './pages/listTurf/ListTurfPage';
import Dashboard from './pages/dashboard/Dashboard';
import TurfListingPage from './pages/turfs/TurfListingPage';
import BookingCheckoutPage from './pages/bookings/BookingCheckoutPage';
import TurfDetailsPage from './pages/turfs/TurfDetailsPage';

function App() {
  const {
    user,
    initialize,
    login,
    signup,
    googleLogin,
    updateProfile,
    logout,
    isInitializing,
  } = useAuthStore();

  const [authMode, setAuthMode] = useState(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [selectedTurfForBooking, setSelectedTurfForBooking] = useState(null);

  /**
   * ---------------------------------------------------------
   * Initialize application authentication state
   * ---------------------------------------------------------
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

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
   * Login screen
   * ---------------------------------------------------------
   */
  if (authMode === 'login') {
    return (
      <LoginPage
        onLogin={handleLoginSuccess}
        onGoogleLogin={handleGoogleLoginSuccess}
        onSwitchToSignUp={() =>
          setAuthMode('signup')
        }
        onClose={() => setAuthMode(null)}
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
        onSignUp={handleStartOnboarding}
        onGoogleLogin={handleGoogleLoginSuccess}
        onSwitchToLogin={() =>
          setAuthMode('login')
        }
        onClose={() => setAuthMode(null)}
      />
    );
  }

  /**
   * ---------------------------------------------------------
   * Main application
   * ---------------------------------------------------------
   */
  
  // Show Dashboard if user is authenticated
  if (user) {
    return (
      <>
        <div
          id="gsi_prompt_container"
          className="fixed top-16 right-6 z-[9999]"
        />

        <Dashboard
          onLogout={handleLogout}
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

  if (currentPage === 'listTurf') {
    return (
      <>
        <div
          id="gsi_prompt_container"
          className="fixed top-16 right-6 z-[9999]"
        />

        <ListTurfPage
          onLogin={() => setAuthMode('login')}
          user={user}
          onLogout={handleLogout}
          onHome={() => setCurrentPage('home')}
          onFindTurfs={() => setCurrentPage('turfListing')}
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
          onLogin={() => setAuthMode('login')}
          onLogout={handleLogout}
          onListTurf={() => setCurrentPage('listTurf')}
          onHome={() => setCurrentPage('home')}
          onSelectTurf={(turf) => setSelectedTurf(turf)}
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
          onLogin={() => setAuthMode('login')}
          user={user}
          onLogout={handleLogout}
          onHome={() => {
            setSelectedTurfForBooking(null);
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
          onLogin={() => setAuthMode('login')}
          onLogout={handleLogout}
          onListTurf={() => setCurrentPage('listTurf')}
          onHome={() => {
            setSelectedTurf(null);
            setCurrentPage('home');
          }}
          onFindTurfs={() => {
            setSelectedTurf(null);
            setCurrentPage('turfListing');
          }}
          onBookNow={() => {
            setSelectedTurfForBooking(selectedTurf);
            setSelectedTurf(null);
          }}
          onBack={() => setSelectedTurf(null)}
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
        onLogin={() => setAuthMode('login')}
        user={user}
        onLogout={handleLogout}
        onListTurf={() => setCurrentPage('listTurf')}
        onHome={() => setCurrentPage('home')}
        onViewTurfDetails={(turf) => setSelectedTurf(turf)}
        onFindTurfs={() => setCurrentPage('turfListing')}
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