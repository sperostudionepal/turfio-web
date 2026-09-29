import { useState } from 'react';
import { usePlayerAuth, useOwnerAuth } from '../../store/useAuthStore';
import OnboardingPage from '../../../player/pages/auth/OnboardingPage';
import { useToast } from '../common/toastContext';

export default function OnboardingGate({ isOwner = false }) {
  const playerAuth = usePlayerAuth();
  const ownerAuth = useOwnerAuth();
  const { showToast } = useToast();

  const auth = isOwner ? ownerAuth : playerAuth;
  const user = auth.user;
  const isInitializing = auth.isInitializing;

  const [dismissed, setDismissed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isInitializing || !user || user.isProfileCompleted || dismissed) {
    return null;
  }

  const handleComplete = async (profileData) => {
    try {
      setIsSubmitting(true);
      const travelDistNum = parseInt(profileData.travelDistance || profileData.travelPreference, 10) || 5;
      const payload = {
        ...profileData,
        dateOfBirth: profileData.dateOfBirth || profileData.dob,
        primaryPosition: profileData.primaryPosition || profileData.position,
        preferredMatchType: profileData.preferredMatchType || profileData.matchType,
        travelPreference: travelDistNum,
        gameVibe: Array.isArray(profileData.gameVibe)
          ? profileData.gameVibe
          : [profileData.gameVibe].filter(Boolean),
        fitnessLevel: Number(profileData.fitnessLevel) || 3,
        isProfileCompleted: true,
      };

      const res = await auth.updateProfile(payload);
      if (res && res.success === false) {
        showToast(res.error || 'Failed to complete profile setup. Please try again.', 'error');
      } else {
        showToast('Profile setup complete! Welcome to Turfio.', 'success');
        setDismissed(true);
      }
    } catch (err) {
      showToast(err.message || 'Failed to complete profile setup. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDismissed(true);
  };

  return (
    <OnboardingPage
      userData={user}
      onComplete={handleComplete}
      onClose={handleClose}
      isSubmitting={isSubmitting}
    />
  );
}
