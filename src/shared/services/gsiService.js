/**
 * Google Identity Services (GSI) Singleton Manager
 *
 * Responsibilities:
 * - Load Google Identity Services exactly once
 * - Initialize GSI exactly once
 * - Automatically show One Tap when requested by the app
 * - Handle credential responses
 * - Handle One Tap display/skipped/dismissed/not-displayed states
 * - Clean up active prompts
 *
 * IMPORTANT:
 * This service does NOT modify browser-native APIs such as
 * window.IdentityCredential.
 */

let scriptPromise = null;
let isInitialized = false;
let isPromptPending = false;

let currentCredentialCallback = null;
let currentReasonCallback = null;
const isDev = import.meta.env.DEV;
const devLog = (...args) => { if (isDev) console.log(...args); };
const devWarn = (...args) => { if (isDev) console.warn(...args); };
const devError = (...args) => { if (isDev) console.error(...args); };


/**
 * Load Google Identity Services.
 *
 * Safe to call multiple times. The same Promise is returned
 * while the script is loading.
 */
export const loadGsiScript = () => {
  // Already available
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  // Already loading
  if (scriptPromise) {
    return scriptPromise;
  }

  // Check if the script already exists in the DOM
  const existingScript = document.querySelector(
    'script[src="https://accounts.google.com/gsi/client"]'
  );

  if (existingScript) {
    scriptPromise = new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      existingScript.addEventListener(
        'load',
        () => {
          if (window.google?.accounts?.id) {
            resolve();
          } else {
            reject(
              new Error(
                'Google Identity Services loaded but API is unavailable.'
              )
            );
          }
        },
        { once: true }
      );

      existingScript.addEventListener(
        'error',
        reject,
        { once: true }
      );
    });

    return scriptPromise;
  }

  // Create the GSI script
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.accounts?.id) {
        resolve();
      } else {
        scriptPromise = null;

        reject(
          new Error(
            'Google Identity Services loaded but API is unavailable.'
          )
        );
      }
    };

    script.onerror = (error) => {
      scriptPromise = null;
      reject(error);
    };

    document.head.appendChild(script);
  });

  return scriptPromise;
};

/**
 * Handle credential response returned by Google.
 */
const handleCredentialResponse = (response) => {
  isPromptPending = false;

  if (!response?.credential) {
    devWarn('[GSI] Google returned no credential.');
    return;
  }

  if (!currentCredentialCallback) {
    devWarn('[GSI] No credential callback registered.');
    return;
  }

  currentCredentialCallback(response.credential);
};

/**
 * Initialize Google Identity Services.
 *
 * Can safely be called multiple times.
 */
export const initializeGsi = (clientId, callback) => {
  if (!clientId) {
    devError('[GSI] Google Client ID is missing.');
    return false;
  }

  if (!window.google?.accounts?.id) {
    devWarn(
      '[GSI] Google Identity Services has not been loaded.'
    );

    return false;
  }

  // Always keep the latest React callback.
  currentCredentialCallback = callback;

  // Already initialized.
  if (isInitialized) {
    return true;
  }

  try {
    window.google.accounts.id.initialize({
      client_id: clientId,

      callback: handleCredentialResponse,

      /*
       * Keep Google's normal browser behavior.
       *
       * Do not manually modify IdentityCredential.
       * Do not force FedCM on/off unless you have a specific
       * reason to do so.
       */

      itp_support: true,
    });

    isInitialized = true;

    devLog('[GSI] Google Identity Services initialized.');

    return true;
  } catch (error) {
    devError(
      '[GSI] Failed to initialize Google Identity Services:',
      error
    );

    return false;
  }
};

/**
 * Automatically show Google One Tap.
 *
 * This is intentionally called by App after authentication
 * initialization confirms that the user is logged out.
 */
export const showOneTapPrompt = (reasonCallback) => {
  if (!window.google?.accounts?.id) {
    devWarn('[GSI] GSI is not available.');
    return;
  }

  if (!isInitialized) {
    devWarn('[GSI] GSI has not been initialized.');
    return;
  }

  // Don't create duplicate prompts.
  if (isPromptPending) {
    return;
  }

  isPromptPending = true;

  currentReasonCallback = reasonCallback || null;

  try {
    window.google.accounts.id.prompt((notification) => {
      if (!notification) {
        isPromptPending = false;
        return;
      }

      /*
       * Prompt successfully displayed.
       */
      if (notification.isDisplayed?.()) {
        currentReasonCallback?.({
          moment: 'display',
          reason: null,
        });

        return;
      }

      /*
       * Prompt could not be displayed.
       */
      if (notification.isNotDisplayed?.()) {
        isPromptPending = false;

        const reason =
          notification.getNotDisplayedReason?.() || 'unknown';

        devWarn(
          `[GSI] One Tap not displayed: ${reason}`
        );

        currentReasonCallback?.({
          moment: 'not_displayed',
          reason,
        });

        return;
      }

      /*
       * Prompt was skipped.
       */
      if (notification.isSkippedMoment?.()) {
        isPromptPending = false;

        const reason =
          notification.getSkippedReason?.() || 'unknown';

        devWarn(
          `[GSI] One Tap skipped: ${reason}`
        );

        currentReasonCallback?.({
          moment: 'skipped',
          reason,
        });

        return;
      }

      /*
       * Prompt was dismissed.
       */
      if (notification.isDismissedMoment?.()) {
        isPromptPending = false;

        const reason =
          notification.getDismissedReason?.() || 'unknown';

        devWarn(
          `[GSI] One Tap dismissed: ${reason}`
        );

        currentReasonCallback?.({
          moment: 'dismissed',
          reason,
        });

        return;
      }
    });
  } catch (error) {
    isPromptPending = false;

    devWarn(
      '[GSI] Failed to show One Tap:',
      error
    );
  }
};

/**
 * Cancel the currently displayed One Tap prompt.
 */
export const cancelOneTap = () => {
  isPromptPending = false;

  if (!window.google?.accounts?.id) {
    return;
  }

  try {
    window.google.accounts.id.cancel();
  } catch (error) {
    devWarn(
      '[GSI] Failed to cancel One Tap:',
      error
    );
  }
};

/**
 * Disable Google automatic account selection.
 *
 * Useful after logout if you don't want Google to
 * automatically reuse the previous account.
 */
export const disableAutoSelect = () => {
  if (!window.google?.accounts?.id) {
    return;
  }

  try {
    window.google.accounts.id.disableAutoSelect();
  } catch (error) {
    devWarn(
      '[GSI] Failed to disable auto select:',
      error
    );
  }
};

/**
 * Reset the local GSI manager state.
 *
 * This does not unload the Google script.
 */
export const resetGsi = () => {
  cancelOneTap();

  currentCredentialCallback = null;
  currentReasonCallback = null;

  isInitialized = false;
};