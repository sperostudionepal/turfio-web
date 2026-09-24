import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/common/toastContext';

export default function PaymentFailure() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    showToast('eSewa payment was cancelled or failed. Please try again.', 'error');
    navigate('/turfs', { replace: true });
  }, [navigate, showToast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-1">Payment Failed</h2>
        <p className="text-slate-600 text-sm">Redirecting to turfs listing...</p>
      </div>
    </div>
  );
}
