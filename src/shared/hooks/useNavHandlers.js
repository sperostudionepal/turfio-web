import { useNavigate } from 'react-router-dom';
import { usePlayerAuth, useOwnerAuth } from '../store/useAuthStore';

export function useNavHandlers() {
  const navigate = useNavigate();
  const playerAuth = usePlayerAuth();
  const ownerAuth = useOwnerAuth();

  const user = playerAuth.user;

  const handleHome = () => {
    navigate('/');
  };

  const handleFindTurfs = () => {
    navigate('/turfs');
  };

  const handleListTurf = () => {
    navigate('/list-turf');
  };

  const handleLogin = (options = {}) => {
    const targetUrl = options.redirectTo ? `/login?redirectTo=${encodeURIComponent(options.redirectTo)}` : '/login';
    navigate(targetUrl);
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = async () => {
    if (ownerAuth.user) {
      await ownerAuth.logout();
    }
    if (playerAuth.user) {
      await playerAuth.logout();
    }
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    const action = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (window.location.pathname !== '/') {
      navigate(`/#${sectionId}`);
    } else {
      window.location.hash = `#${sectionId}`;
      action();
    }
  };

  return {
    user,
    onHome: handleHome,
    onFindTurfs: handleFindTurfs,
    onListTurf: handleListTurf,
    onLogin: handleLogin,
    onDashboard: handleDashboard,
    onLogout: handleLogout,
    onHowItWorks: () => scrollToSection('how-it-works'),
    onPricing: () => scrollToSection('pricing'),
    onAboutUs: () => scrollToSection('about-us'),
    navigate,
  };
}
