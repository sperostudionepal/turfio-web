import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTurfRoutePath, getTurfDetailsPath } from '../../../shared/utils/turfPaths';
import BookingCheckoutPage from './BookingCheckoutPage';
import turfService from '../../../shared/services/turfService';
import useAuthStore from '../../../shared/store/useAuthStore';

export default function BookingConfirmationPageWrapper() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const backTargetRef = useRef('/');

  useEffect(() => {
    // eSewa adds cross-origin POST/redirect entries that Turfio cannot delete from
    // browser history. Keep a same-document sentinel behind confirmation instead.
    // Back lands on this Turfio-owned entry first and is synchronously replaced by
    // the booked turf details page, so the completed payment chain is never re-entered.
    const currentUrl = window.location.href;
    const state = window.history.state || {};
    if (!state.turfioConfirmationSentinel) {
      window.history.replaceState({ ...state, turfioConfirmationBase: true }, '', currentUrl);
      window.history.pushState({ turfioConfirmationSentinel: true }, '', currentUrl);
    }

    const onPopState = () => {
      window.location.replace(backTargetRef.current || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    let cancelled = false;
    turfService.getBookingById(bookingId)
      .then((data) => { if (!cancelled) setBooking(data); })
      .catch((err) => { if (!cancelled) setError(err.message || 'Unable to load booking confirmation.'); });
    return () => { cancelled = true; };
  }, [bookingId]);

  // Keep the confirmation Back destination tied to the booking that was actually
  // loaded, not to transient checkout/payment state. A ref must not be written
  // during render, so this runs as a side effect once the booking is available.
  useEffect(() => {
    if (booking?.turf) {
      backTargetRef.current = getTurfDetailsPath(booking.turf);
    }
  }, [booking]);

  if (!booking && !error) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" /></div>;
  }
  if (error || !booking) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6"><h1 className="text-2xl font-bold mb-2">Unable to load booking</h1><p className="text-slate-600 mb-6">{error}</p><button className="px-6 py-3 rounded-full bg-slate-900 text-white font-semibold" onClick={() => navigate('/profile')}>My Bookings</button></div>;
  }

  const turfDoc = booking.turf || {};
  const bookedCourtId = booking.court?.id || booking.court?._id;
  const liveCourt = Array.isArray(turfDoc.courts)
    ? turfDoc.courts.find((court) => String(court?._id || court?.id) === String(bookedCourtId || ''))
    : null;
  // The booking's court id is authoritative. Resolve its full venue court details so
  // confirmation never falls back to Court 1/default dimensions for another court.
  const confirmedCourt = liveCourt
    ? { ...booking.court, ...liveCourt, id: liveCourt._id || liveCourt.id }
    : booking.court;
  const duration = booking.startMinutes != null && booking.endMinutes != null ? (booking.endMinutes - booking.startMinutes) / 60 : 1;
  const turf = {
    ...turfDoc,
    id: turfDoc._id || turfDoc.id,
    title: turfDoc.name,
    image: turfDoc.images?.[0],
    bookingId: booking.bookingId,
    selectedDate: booking.dateStr || booking.date,
    selectedTime: booking.timeSlot?.split(' - ')?.[0],
    duration,
    court: confirmedCourt,
    selectedCourt: confirmedCourt,
    courtName: confirmedCourt?.name,
    courtDimension: confirmedCourt?.dimension,
    courtSurface: confirmedCourt?.surface,
    totalAmount: booking.totalAmount,
  };

  return <BookingCheckoutPage user={user} turf={turf} initialBooking={booking} initialStep={4} onBack={() => navigate('/profile')} onViewTurfDetails={(turfOrId) => navigate(getTurfDetailsPath(turfOrId))} onNavigateRoute={(turfOrId) => navigate(getTurfRoutePath(turfOrId))} onHome={() => navigate('/')} />;
}
