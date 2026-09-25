import { Outlet } from 'react-router-dom';
import Navbar from '../../player/components/home/Navbar';
import Footer from '../../player/components/home/Footer';
import OnboardingGate from '../../shared/components/auth/OnboardingGate';
import { useGoogleOneTap } from '../../shared/hooks/useGoogleOneTap';

export default function PublicLayout() {
  useGoogleOneTap();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-lime-300 selection:text-slate-950">
      {/* Container for Google One Tap iframe */}
      <div id="gsi_prompt_container" className="fixed top-4 right-4 z-[9999]" />

      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      <OnboardingGate />
    </div>
  );
}
