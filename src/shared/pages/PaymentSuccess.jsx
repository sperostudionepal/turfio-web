import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import turfService from '../services/turfService';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const esewaDataParam = searchParams.get('data');

    if (!esewaDataParam) {
      sessionStorage.removeItem('turfio_pending_booking');
      navigate('/', { replace: true });
      return;
    }

    let pending = {};
    try {
      const raw = sessionStorage.getItem('turfio_pending_booking');
      if (raw) pending = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse pending booking', e);
    }

    turfService.verifyEsewaPayment(esewaDataParam, pending?.bookingPayload)
      .then((res) => {
        const verifiedBooking = res?.booking;

        const turfData = verifiedBooking?.turf || pending?.turf || {
          id: 'venue',
          title: 'Turf Venue',
          name: 'Turf Venue',
        };

        const turfId = turfData?.slug || turfData?.id || turfData?._id || 'venue';

        const merged = {
          ...turfData,
          id: turfId,
          selectedDate: verifiedBooking?.date || pending?.turf?.selectedDate,
          selectedTime: verifiedBooking?.timeSlot ? verifiedBooking.timeSlot.split(' - ')[0] : pending?.selectedTimeStr,
          totalAmount: verifiedBooking?.totalAmount || pending?.totalAmount,
          bookingId: verifiedBooking?.bookingId,
        };

        try {
          sessionStorage.setItem(`turfio_booking_${turfId}`, JSON.stringify(merged));
          sessionStorage.setItem(
            `turfio_checkout_state_${turfId}`,
            JSON.stringify({
              currentStep: 4,
              formData: {
                ...(pending?.formData || {}),
                bookingId: verifiedBooking?.bookingId,
              },
            })
          );
        } catch (e) {
          console.error('Failed to update session storage', e);
        }

        sessionStorage.removeItem('turfio_esewa_in_progress');
        sessionStorage.removeItem('turfio_pending_booking');
        navigate(`/bookings/${encodeURIComponent(verifiedBooking.bookingId)}/confirmation`, { replace: true });
      })
      .catch((err) => {
        console.error('Payment verification failed:', err);
        sessionStorage.removeItem('turfio_pending_booking');
        navigate('/', { replace: true });
      });
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-lime-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-1">Verifying Payment</h2>
        <p className="text-slate-600 text-sm">Please wait while we confirm your eSewa transaction...</p>
      </div>
    </div>
  );
}
