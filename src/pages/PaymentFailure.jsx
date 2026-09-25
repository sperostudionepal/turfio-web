import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/common/toastContext';
import turfService from '../services/turfService';

export default function PaymentFailure() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    let pending = null;
    try { pending = JSON.parse(sessionStorage.getItem('turfio_esewa_in_progress') || 'null'); } catch { /* ignore */ }
    const finish = async () => {
      if (pending?.holdToken) {
        try { await turfService.cancelEsewaAttempt(pending.holdToken); } catch (err) { console.error(err); }
      }
      sessionStorage.removeItem('turfio_esewa_in_progress');
      sessionStorage.removeItem('turfio_pending_booking');
      showToast('eSewa payment was cancelled or failed. Please try again.', 'error');
      navigate('/turfs', { replace: true });
    };
    finish();
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
