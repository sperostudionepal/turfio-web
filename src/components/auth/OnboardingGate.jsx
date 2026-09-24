import { useState } from 'react';
import { usePlayerAuth, useOwnerAuth } from '../../store/useAuthStore';
import OnboardingPage from '../../pages/auth/OnboardingPage';

export default function OnboardingGate({ isOwner = false }) {
  const playerAuth = usePlayerAuth();
  const ownerAuth = useOwnerAuth();

  const auth = isOwner ? ownerAuth : playerAuth;
  const user = auth.user;
  const isInitializing = auth.isInitializing;

  const [dismissed, setDismissed] = useState(false);

  if (isInitializing || !user || user.isProfileCompleted || dismissed) {
    return null;
  }

  const handleComplete = async (profileData) => {
    await auth.updateProfile(profileData);
  };

  const handleClose = () => {
    setDismissed(true);
  };

  return (
    <OnboardingPage
      userData={user}
      onComplete={handleComplete}
      onClose={handleClose}
    />
  );
}
