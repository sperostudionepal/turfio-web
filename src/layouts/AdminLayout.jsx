import { Outlet } from 'react-router-dom';
import OnboardingGate from '../components/auth/OnboardingGate';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Outlet />
      <OnboardingGate isOwner />
    </div>
  );
}
