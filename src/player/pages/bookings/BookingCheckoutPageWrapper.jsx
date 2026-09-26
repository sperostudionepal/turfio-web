import { useEffect, useMemo, useState } from 'react';
import { useTurf } from '../../../shared/hooks/useTurf';
import BookingCheckoutPage from './BookingCheckoutPage';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getTurfRoutePath, getTurfDetailsPath } from '../../../shared/utils/turfPaths';
import turfService from '../../../shared/services/turfService';
import useAuthStore from '../../../shared/store/useAuthStore';

export default function BookingCheckoutPageWrapper() {
  const { turf, loading, error } = useTurf();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [checkoutContext, setCheckoutContext] = useState(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [contextError, setContextError] = useState(null);

  const holdToken = searchParams.get('holdToken');
  const bookingId = searchParams.get('bookingId');
  const requestedStep = Number(searchParams.get('step') || 1);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      if (!turf) return;
      setContextLoading(true);
      setContextError(null);
      try {
        // A resumed checkout must be reconstructed from server state. Never restart a
        // five-minute timer from navigation/local state.
        if (holdToken) {
          const result = await turfService.getResumableBooking(holdToken);
          const item = result?.data || result?.item || result;
          if (!item || item.type !== 'hold' || item.holdToken !== holdToken) {
            throw new Error('This slot hold has expired or is no longer valid. Please select the slot again.');
          }
          const expiryMs = new Date(item.expiresAt).getTime();
          if (!Number.isFinite(expiryMs) || expiryMs <= Date.now()) {
            throw new Error('This slot hold has expired. Please select the slot again.');
          }
          if (!cancelled) {
            setCheckoutContext({
              ...turf,
              selectedDate: item.dateStr || item.date,
              selectedTime: item.startTime,
              duration: item.duration,
              holdId: item.id,
              holdToken: item.holdToken,
              holdExpiresAt: item.expiresAt,
              courtName: item.courtName,
              selectedCourt: item.courtId ? { _id: item.courtId, id: item.courtId, name: item.courtName } : turf.selectedCourt,
            });
          }
          return;
        }

        // Step 4 is a persisted booking, not a checkout hold. Load the authoritative
        // booking so refresh/back navigation cannot lose its ID or QR generation input.
        if (bookingId) {
          const booking = await turfService.getBookingById(bookingId);
          if (!cancelled) {
            setCheckoutContext({
              ...turf,
              bookingId: booking?.bookingId || bookingId,
              confirmedBooking: booking,
              selectedDate: booking?.dateStr || booking?.date,
              selectedTime: booking?.timeSlot?.split(' - ')?.[0],
              duration: booking?.startMinutes != null && booking?.endMinutes != null
                ? (booking.endMinutes - booking.startMinutes) / 60
                : turf.duration,
              court: booking?.court || turf.court,
              courtName: booking?.court?.name || turf.courtName,
              totalAmount: booking?.totalAmount ?? turf.totalAmount,
            });
          }
          return;
        }

        // A naked step=4 URL is invalid. Recover the booking ID saved by PaymentSuccess
        // for this turf, otherwise return to a real checkout state rather than rendering
        // a fake confirmation with "Generating…" forever.
        if (requestedStep === 4) {
          const turfKey = turf?.slug || turf?.id || turf?._id;
          let saved = null;
          try {
            saved = JSON.parse(sessionStorage.getItem(`turfio_booking_${turfKey}`) || 'null');
          } catch { /* ignore corrupt browser state */ }
          if (saved?.bookingId) {
            navigate(`/bookings/${encodeURIComponent(saved.bookingId)}/confirmation`, { replace: true });
            return;
          }
          throw new Error('Booking confirmation could not be restored. Open My Bookings to view your confirmed booking.');
        }

        // Steps 1-2 are only valid with a server-issued hold token. Rendering them
        // without one previously produced a misleading 00:00 timer and a checkout
        // that the server would later reject.
        if (requestedStep >= 1 && requestedStep <= 2) {
          throw new Error('No active slot hold was found. Please select your slot again.');
        }

        if (!cancelled) setCheckoutContext(turf);
      } catch (err) {
        if (!cancelled) setContextError(err.message || 'Unable to restore this booking session.');
      } finally {
        if (!cancelled) setContextLoading(false);
      }
    };

    if (turf) hydrate();
    return () => { cancelled = true; };
  }, [turf, holdToken, bookingId, requestedStep, navigate]);

  const hydratedTurf = useMemo(() => checkoutContext || turf, [checkoutContext, turf]);

  if (loading || contextLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-center"><div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p className="text-slate-600 font-medium">Loading checkout details...</p></div></div>;
  }

  if (error || !turf || contextError) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4"><h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Session Unavailable</h2><p className="text-slate-600 mb-6 text-center max-w-lg">{contextError || error || 'Unable to load checkout for this venue.'}</p><button onClick={() => navigate(`/turfs/${turf?.slug || turf?.id || ''}`)} className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 transition-colors">Select a Slot</button></div>;
  }

  return <BookingCheckoutPage user={user} turf={hydratedTurf} initialBooking={hydratedTurf?.confirmedBooking} initialStep={requestedStep} onBack={() => navigate(getTurfDetailsPath(turf))} onHoldReplaced={(hold) => setCheckoutContext((prev) => ({ ...(prev || turf), holdToken: hold.holdToken, holdId: hold.holdId, holdExpiresAt: hold.expiresAt, selectedDate: hold.selectedDate, selectedTime: hold.selectedTime }))} onViewTurfDetails={(turfOrId) => navigate(getTurfDetailsPath(turfOrId))} onNavigateRoute={(turfOrId) => navigate(getTurfRoutePath(turfOrId))} onHome={() => navigate('/')} onBookingConfirmed={(id) => navigate(`/bookings/${encodeURIComponent(id)}/confirmation`, { replace: true })} />;
}
