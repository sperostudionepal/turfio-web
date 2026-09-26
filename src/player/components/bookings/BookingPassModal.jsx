import { X, Download, Calendar, MapPin, Users, Clock, CheckCircle2, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRef, useState } from 'react';
import domtoimage from 'dom-to-image-more';
import jsPDF from 'jspdf';
import { formatNepalDateTime } from '../../../shared/utils/dateTime';

const money = (value) => `NRs. ${Number(value || 0).toLocaleString('en-NP')}`;

function BookingPassModal({ booking, qrToken, onClose }) {
  const passRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!booking || !qrToken) return null;

  // Generate shareable URL that will work when deployed
  const bookingPassUrl = `${window.location.origin}/booking-pass/${booking.bookingId || booking.shortCode}?token=${qrToken}`;

  // QR code will contain the URL so scanning redirects to the booking pass page
  const qrData = bookingPassUrl;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!passRef.current) return;

    setIsGenerating(true);
    try {
      console.log('Starting PDF generation with dom-to-image...');
      
      const element = passRef.current;
      
      // Store original styles
      const originalTransform = element.style.transform;
      const originalWidth = element.style.width;
      
      // Set fixed width for consistent rendering
      element.style.transform = 'none';
      element.style.width = '750px'; // Fixed width for PDF
      
      // Wait for layout to settle
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Generate PNG blob from the element (handles modern CSS including oklch)
      const blob = await domtoimage.toBlob(element, {
        quality: 0.98,
        width: element.offsetWidth,
        height: element.offsetHeight,
        style: {
          transform: 'none',
          margin: '0',
          padding: '24px',
        },
        cacheBust: true,
      });
      
      console.log('Image blob generated');
      
      // Restore original styles
      element.style.transform = originalTransform;
      element.style.width = originalWidth;
      
      // Convert blob to base64 for jsPDF
      const reader = new FileReader();
      const imgDataUrl = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
      
      // Create an image to get dimensions
      const img = new Image();
      await new Promise((resolve) => {
        img.onload = resolve;
        img.src = imgDataUrl;
      });
      
      console.log('Image loaded:', img.width, 'x', img.height);
      
      // PDF dimensions (A4: 210mm x 297mm)
      const pdfWidth = 210;
      const pdfHeight = 297;
      const margin = 15; // Increased margin
      
      // Calculate dimensions to fit page
      const maxWidth = pdfWidth - (2 * margin);
      const maxHeight = pdfHeight - (2 * margin);
      
      // Convert px to mm (at 96 DPI: 1mm = 3.7795px)
      const imgWidthMM = img.width / 3.7795;
      const imgHeightMM = img.height / 3.7795;
      
      // Calculate scale to fit within page
      let finalWidth = imgWidthMM;
      let finalHeight = imgHeightMM;
      
      if (imgWidthMM > maxWidth || imgHeightMM > maxHeight) {
        const scaleWidth = maxWidth / imgWidthMM;
        const scaleHeight = maxHeight / imgHeightMM;
        const scale = Math.min(scaleWidth, scaleHeight);
        
        finalWidth = imgWidthMM * scale;
        finalHeight = imgHeightMM * scale;
      }
      
      // Center on page
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      console.log('PDF layout:', finalWidth.toFixed(2), 'x', finalHeight.toFixed(2), 'mm at', xOffset.toFixed(2), yOffset.toFixed(2));
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // Add image to PDF
      pdf.addImage(imgDataUrl, 'PNG', xOffset, yOffset, finalWidth, finalHeight, undefined, 'FAST');
      
      // Download
      const fileName = `Turfio-Booking-${booking.bookingId || booking.shortCode}-${booking.dateStr || 'pass'}.pdf`;
      console.log('Saving PDF:', fileName);
      pdf.save(fileName);
      
      console.log('✅ PDF generated successfully!');

    } catch (error) {
      console.error('❌ PDF generation error:', error);
      console.error('Error details:', error.message);
      alert(`Failed to generate PDF.\n\nError: ${error.message}\n\nPlease use the Print button which works perfectly!`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <style>{`
        @media print {
          /* Hide everything except the pass */
          body * {
            visibility: hidden;
          }
          #booking-pass-content, #booking-pass-content * {
            visibility: visible;
          }
          #booking-pass-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            page-break-after: avoid;
          }
          .print\\:hidden {
            display: none !important;
          }
          
          /* Ensure single page printing */
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          /* Fit content to one page for print */
          #booking-pass-content > div {
            transform: scale(0.9);
            transform-origin: top center;
            max-width: 100%;
          }
        }
      `}</style>
      <div
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl print:shadow-none print:max-w-full print:max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 print:hidden">
          <div>
            <h2 className="text-xl font-black text-slate-900">Booking Pass</h2>
            <p className="text-sm text-slate-500 mt-0.5">Present this pass at the venue</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed print:hidden"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-900 font-bold transition-all print:hidden"
            >
              <Printer size={16} />
              Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors print:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Booking Pass Content */}
        <div className="p-6 print:p-0" id="booking-pass-content">
          <div ref={passRef} className="bg-white p-6 rounded-2xl border-4 border-lime-400 print:border-2 print:p-4">
            {/* Header Section */}
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <img src="/logo.png" alt="Turfio" className="h-10 w-auto" />
                <h1 className="text-2xl font-black text-slate-900">TURFIO</h1>
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Booking Confirmation Pass</p>
            </div>

            {/* QR Code Section */}
            <div className="flex justify-center mb-4">
              <div className="bg-white p-3 rounded-xl border-2 border-slate-200 shadow-lg">
                <QRCodeSVG
                  value={qrData}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>

            {/* Booking ID and Date/Time */}
            <div className="text-center mb-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Booking ID</p>
              <p className="text-xl font-black text-slate-900 font-mono tracking-wider mb-2">
                {booking.bookingId || booking.shortCode}
              </p>
              <p className="text-xs font-bold text-slate-600">
                {booking.dateStr} · {booking.timeSlot}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Booked on {formatNepalDateTime(booking.createdAt)}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
                <CheckCircle2 size={14} />
                {booking.status}
              </span>
            </div>

            {/* Booking Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <MapPin size={14} />
                  <span className="text-[10px] font-bold uppercase">Venue</span>
                </div>
                <p className="font-black text-slate-900 text-sm">{booking.turf?.name}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  {booking.turf?.location?.city || booking.turf?.location?.area}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase">Date</span>
                </div>
                <p className="font-black text-slate-900 text-sm">{booking.dateStr}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{booking.timeSlot}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <Users size={14} />
                  <span className="text-[10px] font-bold uppercase">Court</span>
                </div>
                <p className="font-black text-slate-900 text-sm">{booking.court?.name || 'Court 1'}</p>
                <p className="text-[10px] text-slate-600 mt-0.5">{booking.teamSize} players · {booking.matchType}</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-slate-500 mb-1.5">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase">Booked On</span>
                </div>
                <p className="font-bold text-slate-900 text-xs">{formatNepalDateTime(booking.createdAt)}</p>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-lime-50 border-2 border-lime-200 p-3 rounded-xl mb-4">
              <h3 className="font-bold text-slate-700 text-xs mb-2 uppercase">Payment Summary</h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex-shrink-0">Total Amount</span>
                  <span className="font-bold text-slate-900 text-right">{money(booking.totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex-shrink-0">Amount Paid</span>
                  <span className="font-bold text-emerald-600 text-right">{money(booking.totalPaidAmount)}</span>
                </div>
                {booking.paymentType === 'venue' && booking.depositAmount > 0 && (
                  <>
                    <div className="border-t border-lime-300 my-1.5"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 font-bold flex-shrink-0 pr-2">Deposit Paid (20%)</span>
                      <span className="font-bold text-emerald-600 text-right">{money(booking.depositAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-amber-700 font-bold flex-shrink-0 pr-2">Pay at Venue</span>
                      <span className="font-black text-amber-700 text-right">{money(booking.remainingBalance)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Player Details */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4">
              <h3 className="font-bold text-slate-700 text-xs mb-1.5 uppercase">Player Details</h3>
              <p className="font-black text-slate-900 text-sm">{booking.user?.firstName} {booking.user?.lastName}</p>
              <p className="text-xs text-slate-600">{booking.user?.email}</p>
              <p className="text-xs text-slate-600">{booking.user?.phone}</p>
            </div>

            {/* Footer Instructions */}
            <div className="border-t-2 border-dashed border-slate-200 pt-3 text-center">
              <p className="text-[10px] text-slate-500 leading-relaxed">
                Scan this QR code at the venue entrance for check-in.<br />
                Keep this pass accessible on your device or printed.
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5">
                For support: support@turfio.com | +977-9800000000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default BookingPassModal;
