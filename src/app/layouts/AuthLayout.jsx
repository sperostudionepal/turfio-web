import { Outlet } from 'react-router-dom';
import Navbar from '../../player/components/home/Navbar';
import Footer from '../../player/components/home/Footer';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar hideTopbar />

      <main className="flex-grow flex items-center justify-center p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
