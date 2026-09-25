import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import BookingPassModal from '../components/bookings/BookingPassModal';
import turfService from '../services/turfService';

/**
 * Public Booking Pass Page - Accessible via QR code scan
 * URL format: /booking-pass/:bookingId?token=xxx
 * 
 * This page allows anyone with the QR code to view the booking pass
 * without needing to log in. It verifies the QR token with the backend.
 */
function BookingPassPublicPage() {
  const { id: bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (!bookingId || !token) {
      setError('Invalid booking pass link');
      setLoading(false);
      return;
    }

    // Verify QR token and fetch booking details
    const fetchBookingPass = async () => {
      try {
        setLoading(true);
        
        // Call the verify QR endpoint which returns booking details
        const response = await turfService.verifyBookingQR(token);
        
        if (response.booking) {
          setBookingData({
            booking: response.booking,
            qrToken: token,
          });
        } else {
          setError('Booking not found or QR code expired');
        }
      } catch (err) {
        console.error('Error fetching booking pass:', err);
        setError(err.response?.data?.message || 'Failed to load booking pass. The QR code may be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingPass();
  }, [bookingId, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-lime-600 mx-auto mb-4" />
          <p className="text-slate-600 font-semibold">Loading booking pass...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border-2 border-rose-200 text-center">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h1>
          <p className="text-slate-600 mb-4">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold transition-all"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 to-emerald-50">
      {/* Show booking pass in full-screen mode */}
      <BookingPassModal
        booking={bookingData.booking}
        qrToken={bookingData.qrToken}
        onClose={() => window.history.back()}
      />
    </div>
  );
}

export default BookingPassPublicPage;
