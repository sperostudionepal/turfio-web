import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
