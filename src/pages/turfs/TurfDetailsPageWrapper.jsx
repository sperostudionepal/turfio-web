import { useTurf } from '../../hooks/useTurf';
import TurfDetailsPage from './TurfDetailsPage';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';

export default function TurfDetailsPageWrapper() {
  const { turf, loading, error } = useTurf();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading turf details...</p>
        </div>
      </div>
    );
  }

  if (error || !turf) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Turf Not Found</h2>
        <p className="text-slate-600 mb-6">{error || 'Unable to load the requested venue.'}</p>
        <button
          onClick={() => navigate('/turfs')}
          className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors"
        >
          Back to Turfs
        </button>
      </div>
    );
  }

  const handleBookNow = (turfData, bookingState) => {
    const turfId = turfData.slug || turfData.id || turfData._id;
    // TurfDetailsPage passes the complete held checkout payload as its first argument.
    // Older callers may still provide bookingState separately, so support both without
    // ever dropping the server-issued hold token/expiry from the checkout URL.
    const checkoutState = bookingState || turfData;
    if (checkoutState?.holdToken) {
      localStorage.setItem(`turfio_checkout_state_${turfId}`, JSON.stringify(checkoutState));
    }
    const search = checkoutState?.holdToken
      ? `?step=1&holdToken=${encodeURIComponent(checkoutState.holdToken)}`
      : '?step=1';
    navigate(`/turfs/${turfId}/book${search}`);
  };

  const handleNavigateRoute = (turfId) => {
    navigate(`/route?turfId=${turfId}`);
  };

  const handleViewTurfDetails = (turfId) => {
    navigate(`/turfs/${turfId}`);
  };

  return (
    <TurfDetailsPage
      turf={turf}
      user={user}
      onBookNow={handleBookNow}
      onNavigateRoute={handleNavigateRoute}
      onViewTurfDetails={handleViewTurfDetails}
    />
  );
}
