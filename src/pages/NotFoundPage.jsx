import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-20 h-20 bg-lime-100 text-lime-600 rounded-3xl flex items-center justify-center text-3xl font-black mb-6 shadow-sm">
        404
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-2">Page Not Found</h1>
      <p className="text-slate-600 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
      >
        Back to Home
      </button>
    </div>
  );
}
