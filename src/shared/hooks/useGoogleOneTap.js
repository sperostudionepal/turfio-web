import { useEffect, useCallback } from 'react';
import { usePlayerAuth } from '../store/useAuthStore';
import { useToast } from '../components/common/toastContext';
import {
  loadGsiScript,
  initializeGsi,
  showOneTapPrompt,
  cancelOneTap,
} from '../services/gsiService';

export function useGoogleOneTap() {
  const playerAuth = usePlayerAuth();
  const { user, isInitializing, googleLogin } = playerAuth;
  const { showToast } = useToast();

  const handleGoogleLoginSuccess = useCallback(
    async (credential) => {
      const result = await googleLogin(credential);

      if (result.success) {
        cancelOneTap();
        const loggedInUser = result.user;
        const displayName =
          loggedInUser?.firstName ||
          loggedInUser?.username ||
          'Player';
        showToast(
          `Welcome back, ${displayName}!`,
          'success'
        );
      } else {
        showToast(
          result.error || 'Google Sign-In failed',
          'error'
        );
      }
    },
    [googleLogin, showToast]
  );

  // Handle Google OAuth redirect token (#id_token=...)
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

  // Automatic Google One Tap
  useEffect(() => {
    const pathname = window.location.pathname;
    const isStaffRoute =
      pathname.startsWith('/owner') ||
      pathname.startsWith('/superadmin') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard');

    if (isStaffRoute) {
      cancelOneTap();
      return;
    }

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (isInitializing || user || !googleClientId) {
      if (user) cancelOneTap();
      return;
    }

    if (googleClientId.includes('your_google_client_id')) {
      console.warn('[GoogleOneTap] Google Client ID is still a placeholder.');
      return;
    }

    let cancelled = false;

    const startGoogleOneTap = async () => {
      try {
        await loadGsiScript();

        if (cancelled) return;

        initializeGsi(
          googleClientId,
          handleGoogleLoginSuccess
        );

        showOneTapPrompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log(
              '[GoogleOneTap] One Tap not displayed reason:',
              notification.getNotDisplayedReason()
            );
          } else if (notification.isSkippedMoment()) {
            console.log(
              '[GoogleOneTap] One Tap skipped reason:',
              notification.getSkippedReason()
            );
          } else if (notification.isDismissedMoment()) {
            console.log(
              '[GoogleOneTap] One Tap dismissed reason:',
              notification.getDismissedReason()
            );
          }
        });
      } catch (error) {
        console.error(
          '[GoogleOneTap] Failed to initialize One Tap:',
          error
        );
      }
    };

    startGoogleOneTap();

    return () => {
      cancelled = true;
    };
  }, [isInitializing, user, handleGoogleLoginSuccess]);
}
