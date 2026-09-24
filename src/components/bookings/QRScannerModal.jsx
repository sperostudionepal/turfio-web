import { X, QrCode, CheckCircle2, XCircle, AlertCircle, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import turfService from '../../services/turfService';
import BookingPassModal from './BookingPassModal';

function QRScannerModal({ onClose, onScanSuccess }) {
  const scannerRef = useRef(null);
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showBookingPass, setShowBookingPass] = useState(false);
  const [scannedBooking, setScannedBooking] = useState(null);

  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode('qr-reader');
    setHtml5QrCode(qrCodeScanner);

    return () => {
      if (qrCodeScanner.isScanning) {
        qrCodeScanner.stop().catch(console.error);
      }
    };
  }, []);

  const startScanning = async () => {
    if (!html5QrCode) return;

    setIsScanning(true);
    setError('');
    setResult(null);

    try {
      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanning after successful read
          await html5QrCode.stop();
          setIsScanning(false);

          // Verify the QR code
          try {
            const qrData = JSON.parse(decodedText);
            
            if (qrData.type !== 'booking_verification') {
              setError('Invalid QR code. This is not a Turfio booking pass.');
              return;
            }

            // Verify with backend
            const response = await turfService.verifyBookingQR(qrData.token);
            setResult({
              success: true,
              booking: response.data.booking,
              message: response.data.message,
              alreadyCheckedIn: response.data.alreadyCheckedIn,
              qrToken: qrData.token,
            });
            
            setScannedBooking(response.data.booking);

            if (onScanSuccess) {
              onScanSuccess(response.data);
            }
          } catch (err) {
            setError(err.response?.data?.message || 'Failed to verify booking');
            setResult({
              success: false,
              message: err.response?.data?.message || 'Verification failed',
            });
          }
        },
        (errorMessage) => {
          // Ignore scanning errors (they happen continuously)
        }
      );
    } catch (err) {
      setIsScanning(false);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else {
        setError('Failed to start camera: ' + err.message);
      }
    }
  };

  const stopScanning = async () => {
    if (html5QrCode && isScanning) {
      try {
        await html5QrCode.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const resetScanner = () => {
    setResult(null);
    setError('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-lime-100 flex items-center justify-center">
              <QrCode size={20} className="text-lime-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">Scan Booking Pass</h2>
              <p className="text-xs text-slate-500">Scan customer's QR code to check-in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="p-6">
          {/* QR Scanner */}
          {!result && (
            <div className="mb-4">
              <div
                id="qr-reader"
                className="rounded-xl overflow-hidden border-2 border-slate-200"
                style={{ width: '100%' }}
              />
            </div>
          )}

          {/* Error Display */}
          {error && !result && (
            <div className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-rose-900 text-sm">Scan Failed</p>
                <p className="text-rose-700 text-xs mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className={`p-6 rounded-xl border-2 ${
              result.success ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                {result.success ? (
                  <CheckCircle2 size={32} className="text-emerald-600" />
                ) : (
                  <XCircle size={32} className="text-rose-600" />
                )}
                <div>
                  <p className={`font-black text-lg ${result.success ? 'text-emerald-900' : 'text-rose-900'}`}>
                    {result.success ? (result.alreadyCheckedIn ? 'Already Checked In' : 'Check-in Successful!') : 'Verification Failed'}
                  </p>
                  <p className={`text-sm ${result.success ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {result.message}
                  </p>
                </div>
              </div>

              {result.success && result.booking && (
                <div className="bg-white rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Booking ID:</span>
                    <span className="font-bold text-slate-900">{result.booking.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Player:</span>
                    <span className="font-bold text-slate-900">
                      {result.booking.user?.firstName} {result.booking.user?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Court:</span>
                    <span className="font-bold text-slate-900">{result.booking.court?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time Slot:</span>
                    <span className="font-bold text-slate-900">{result.booking.timeSlot}</span>
                  </div>
                  {result.booking.checkedInAt && (
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-600">Checked in:</span>
                      <span className="font-bold text-emerald-600">
                        {new Date(result.booking.checkedInAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            {!isScanning && !result && (
              <button
                onClick={startScanning}
                className="flex-1 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold transition-all"
              >
                Start Scanning
              </button>
            )}
            {isScanning && (
              <button
                onClick={stopScanning}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all"
              >
                Stop Scanning
              </button>
            )}
            {result && (
              <>
                <button
                  onClick={resetScanner}
                  className="flex-1 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold transition-all"
                >
                  Scan Another
                </button>
                {result.success && (
                  <button
                    onClick={() => setShowBookingPass(true)}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} />
                    View Pass
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
                >
                  Close
                </button>
              </>
            )}
            {!isScanning && !result && (
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Booking Pass Modal after scan */}
      {showBookingPass && scannedBooking && result?.qrToken && (
        <BookingPassModal
          booking={scannedBooking}
          qrToken={result.qrToken}
          onClose={() => setShowBookingPass(false)}
        />
      )}
    </div>
  );
}

export default QRScannerModal;
