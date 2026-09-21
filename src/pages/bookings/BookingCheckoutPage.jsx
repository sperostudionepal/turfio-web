import { useState, useEffect, useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Clock,
  MapPin,
  Copy,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  User,
  Wallet,
  Banknote,
  Share2,
  Zap,
  FileText,
  Shield,
  Headphones,
  Calendar,
  Info,
  Lock,
  Sparkles,
  Check,
  ExternalLink,
  QrCode,
  Download,
  AlertCircle,
  ArrowRight,
  Compass,
  Phone,
  Mail,
  CreditCard,
  Building,
  CheckCheck,
  Star,
  RotateCcw,
  ShieldCheck,
  Loader2,
  Navigation,
  Car,
  Shirt,
  PhoneCall,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import turfService from '../../services/turfService';
import { getTodayNepalString } from '../../utils/dateTime';
import { useToast } from '../../components/common/Toast';

function WhatsAppIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      stroke="currentColor"
      strokeWidth="0"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function EsewaIcon({ className = 'h-5 w-5' }) {
  return (
    <svg
      viewBox="0 0 300 300"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="150" cy="150" r="148" fill="#60BB46" />
      {/* Right dash */}
      <rect x="240" y="135" width="58" height="28" fill="#FFFFFF" />
      {/* Authentic eSewa lowercase 'e' cursive letterform */}
      <path
        d="M205 125 C205 92 182 66 142 66 C95 66 66 102 66 156 C66 215 102 244 148 244 C184 244 207 222 216 195 C218 190 215 184 210 183 L190 178 C185 177 180 180 177 185 C171 198 159 214 142 214 C116 214 96 193 94 153 L203 138 C204.5 133 205 129 205 125 Z M96 127 C100 97 116 88 138 88 C160 88 174 98 175 124 L96 135 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

function FonepayIcon({ className = 'h-full w-full' }) {
  return (
    <svg
      viewBox="0 0 460 180"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="460" height="180" rx="36" fill="#D31D24" />
      <g fill="#FFFFFF">
        {/* f */}
        <path d="M68 45 C55 45 44 54 44 70 L44 80 L30 80 L30 102 L44 102 L44 144 L70 144 L70 102 L86 102 L90 80 L70 80 L70 70 C70 66 73 63 78 63 L90 63 L90 45 Z" />
        {/* o */}
        <path d="M136 78 C114 78 98 94 98 116 C98 138 114 154 136 154 C158 154 174 138 174 116 C174 94 158 78 136 78 Z M136 132 C125 132 120 125 120 116 C120 107 125 100 136 100 C147 100 152 107 152 116 C152 125 147 132 136 132 Z" />
        {/* n */}
        <path d="M182 80 L182 144 L204 144 L204 112 C204 103 209 98 217 98 C225 98 229 103 229 112 L229 144 L251 144 L251 106 C251 90 241 80 225 80 C214 80 206 85 201 93 L201 80 Z" />
        {/* e */}
        <path d="M294 78 C272 78 257 94 257 116 C257 138 273 154 296 154 C311 154 324 146 329 132 L308 126 C306 131 301 135 295 135 C286 135 279 129 278 119 L332 119 C332 117 333 113 333 110 C333 92 318 78 294 78 Z M279 104 C281 97 287 93 294 93 C302 93 308 97 310 104 Z" />
        {/* Wi-Fi Waves */}
        <path d="M362 55 C377 70 377 94 362 109 L374 121 C395 100 395 64 374 43 Z" />
        <path d="M344 73 C353 82 353 96 344 105 L356 117 C371 102 371 76 356 61 Z" />
        <circle cx="328" cy="98" r="10" />
      </g>
    </svg>
  );
}

export default function BookingCheckoutPage({
  onLogin,
  user,
  onLogout,
  onHome,
  onDashboard,
  turf,
  onBack,
  onViewTurfDetails,
  onNavigateRoute,
}) {
  // Persist and restore step and form data across reloads
  const storageKey = turf?.id ? `turfio_checkout_state_${turf.id}` : 'turfio_checkout_state';

  const [currentStep, setCurrentStep] = useState(() => {
    // Check URL search params first (e.g. ?step=3)
    const searchParams = new URLSearchParams(window.location.search);
    const stepParam = parseInt(searchParams.get('step'), 10);
    if (stepParam && stepParam >= 2 && stepParam <= 4) return stepParam;

    return 2;
  });

  const { showToast } = useToast();

  // Form State
  const [formData, setFormData] = useState(() => {
    const defaultData = {
      playingType: 'team',
      teamName: '',
      expectedPlayers: turf?.size?.includes('5') ? 10 : 14,
      paymentType: 'full', // 'full' | 'split' | 'venue'
      splitPlayersCount: 2,
      selectedPaymentMethod: 'esewa', // 'esewa' | 'fonepay' | 'venue'
      fullName:
        user?.name ||
        user?.fullName ||
        (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '') ||
        '',
      phone: user?.phone || user?.phoneNumber || '',
      email: user?.email || '',
      specialRequests: [],
      termsAgreed: true,
    };

    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.formData) {
          return { ...defaultData, ...parsed.formData };
        }
      }
    } catch (e) {
      console.error(e);
    }

    return defaultData;
  });

  // Save step and formData changes into sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          currentStep,
          formData,
        })
      );
    } catch (e) {
      console.error(e);
    }
  }, [currentStep, formData, storageKey]);

  // Sync hold step to backend when currentStep changes
  useEffect(() => {
    const holdToken = turf?.holdToken || new URLSearchParams(window.location.search).get('holdToken') || localStorage.getItem('turfio_guest_hold_token');
    const turfId = turf?.id || turf?._id;
    if (turfId && holdToken && currentStep >= 2 && currentStep <= 4) {
      turfService.updateHoldStep(turfId, holdToken, currentStep);
    }
  }, [currentStep, turf]);

  // Listen to popstate within the checkout flow to handle back/forward between steps
  useEffect(() => {
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const s = parseInt(params.get('step'), 10);
      if (s && s >= 2 && s <= 4) {
        setCurrentStep(s);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Sync step if URL param changes or turf has bookingId
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = parseInt(params.get('step'), 10);
    if (s && s >= 2 && s <= 4 && s !== currentStep) {
      setCurrentStep(s);
    } else if (turf?.bookingId && currentStep !== 4) {
      setCurrentStep(4);
    }
  }, [turf?.bookingId]);

  const [copiedLink, setCopiedLink] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isConvertingToSplit, setIsConvertingToSplit] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [idempotencyKey] = useState(() => {
    const slotId = turf?.id || turf?._id || 'slot';
    const dateVal = turf?.selectedDate || 'date';
    const timeVal = turf?.selectedTime || 'time';
    const storageKey = `turfio_idempotency_${slotId}_${dateVal}_${timeVal}`;
    const existing = sessionStorage.getItem(storageKey);
    if (existing) return existing;
    const newKey = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `IDEM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      sessionStorage.setItem(storageKey, newKey);
    } catch (e) {
      console.error(e);
    }
    return newKey;
  });

  const handleConvertToSplit = async () => {
    const targetBookingId = confirmedBooking?.bookingId || turf?.bookingId || confirmedBooking?._id || turf?._id;
    if (!targetBookingId) {
      triggerToast('Unable to convert: Booking reference not found');
      return;
    }

    try {
      setIsConvertingToSplit(true);
      const res = await turfService.convertToSplitPayment(targetBookingId, splitPayers || 2);
      if (res?.data?.booking || res?.booking) {
        const updated = res?.data?.booking || res?.booking;
        setConfirmedBooking(updated);
        setFormData((prev) => ({
          ...prev,
          paymentType: 'split',
          bookingId: updated.bookingId,
        }));
        triggerToast('🎉 Successfully converted to Split Payment! Squad link is live.');
      } else {
        throw new Error(res?.message || 'Failed to convert booking');
      }
    } catch (err) {
      console.error(err);
      triggerToast(err.message || 'Failed to convert to Split Payment');
    } finally {
      setIsConvertingToSplit(false);
    }
  };

  // Sync user info if loaded later (auto-populate for logged in user)
  useEffect(() => {
    if (user) {
      const derivedName =
        user.name ||
        user.fullName ||
        (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '');
      const derivedPhone = user.phone || user.phoneNumber || '';
      const derivedEmail = user.email || '';

      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || derivedName,
        phone: prev.phone || derivedPhone,
        email: prev.email || derivedEmail,
      }));
    }
  }, [user]);

  // Live Countdown Timer wired to real hold expiry timestamp
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    if (turf?.holdExpiresAt) {
      const diffSec = Math.floor((new Date(turf.holdExpiresAt).getTime() - Date.now()) / 1000);
      return Math.max(0, diffSec);
    }
    return 585; // 09:45 default fallback
  });

  useEffect(() => {
    if (turf?.holdExpiresAt) {
      const diffSec = Math.floor((new Date(turf.holdExpiresAt).getTime() - Date.now()) / 1000);
      setSecondsRemaining(Math.max(0, diffSec));
    }
  }, [turf?.holdExpiresAt]);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          triggerToast('Your slot hold has expired. Please select your slot again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsRemaining]);

  const formattedTimer = useMemo(() => {
    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [secondsRemaining]);

  // Toast Helper mapped to global ToastProvider
  const triggerToast = (msg, type) => {
    let toastType = type;
    if (!toastType) {
      if (msg.includes('🎉') || msg.includes('🔥') || msg.includes('confirmed') || msg.includes('copied') || msg.includes('applied') || msg.includes('downloaded')) {
        toastType = 'success';
      } else if (msg.includes('Please') || msg.includes('failed') || msg.includes('expired') || msg.includes('Unable') || msg.includes('Error')) {
        toastType = 'error';
      } else {
        toastType = 'info';
      }
    }
    showToast(msg, toastType);
  };

  // Safe location/address string formatter helper
  const formatLocationString = (loc, addr) => {
    if (typeof addr === 'string' && addr.trim()) return addr;
    if (addr && typeof addr === 'object') {
      const parts = [addr.area, addr.city].filter(Boolean);
      if (parts.length > 0) return parts.join(', ');
    }
    if (typeof loc === 'string' && loc.trim()) return loc;
    return 'Kathmandu, Nepal';
  };

  // Turf Details & Price Calculation
  const venueTitle = turf?.title || turf?.name || 'Great Himalayan Futsal';
  const venueLocation = formatLocationString(turf?.location, turf?.address);
  const venueType = turf?.type || 'Indoor';
  const venueSize = turf?.size || '7v7';
  const venueImage =
    turf?.image ||
    (turf?.gallery && turf.gallery[0]) ||
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80';

  const courtName = turf?.courtName || turf?.selectedCourt?.name || turf?.court?.name || 'Court 1';
  const courtDimension = turf?.courtDimension || turf?.selectedCourt?.dimension || turf?.court?.dimension || '25m x 15m (Standard 5v5)';
  const courtSurface = turf?.courtSurface || turf?.selectedCourt?.surface || turf?.court?.surface || 'FIFA Quality Synthetic Turf';
  const courtNumber = turf?.courtNumber || turf?.selectedCourt?.courtNumber || 1;

  const selectedDateStr = useMemo(() => {
    if (turf?.selectedDate) {
      try {
        const d = new Date(turf.selectedDate);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
        }
      } catch (e) {
        // ignore
      }
      return turf.selectedDate;
    }
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }, [turf?.selectedDate]);

  const selectedTimeStr = turf?.selectedTime || '07:00 PM';
  const duration = turf?.duration || 1;

  // Calculate End Time
  const endTimeStr = useMemo(() => {
    if (!selectedTimeStr) return '';
    const parts = selectedTimeStr.split(' ');
    if (parts.length < 2) return selectedTimeStr;
    const [time, period] = parts;
    let [hour, min] = time.split(':').map(Number);
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const totalMinutes = hour * 60 + (min || 0) + duration * 60;
    const endHour24 = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    const endPeriod = endHour24 >= 12 ? 'PM' : 'AM';
    let endHour12 = endHour24 % 12;
    if (endHour12 === 0) endHour12 = 12;

    return `${String(endHour12).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')} ${endPeriod}`;
  }, [selectedTimeStr, duration]);

  // Base Rate Calculation
  const baseRateNumeric = useMemo(() => {
    if (turf?.price) {
      const match = String(turf.price).match(/(\d+,?\d*)/);
      if (match) return parseInt(match[1].replace(/,/g, ''), 10);
    }
    if (turf?.totalAmount && duration > 0) {
      return Math.round(turf.totalAmount / duration);
    }
    return 1250;
  }, [turf, duration]);

  const subtotal = baseRateNumeric * duration;
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Split calculation
  const splitPayers = formData.splitPlayersCount || 2;
  const yourShare = Math.round(totalAmount / splitPayers);
  const remainingShare = totalAmount - yourShare;
  const perTeammateShare = Math.round(remainingShare / (splitPayers - 1));

  // Max players
  const maxPlayersAllowed = venueSize.includes('5') ? 10 : 14;

  const paymentMethods = [
    {
      id: 'full',
      label: 'Pay Full Amount',
      badge: 'Instant',
      description: 'Pay total NPR ' + totalAmount.toLocaleString() + ' now',
      icon: Wallet,
      available: true,
    },
    /*
    {
      id: 'split',
      label: 'Split Payment',
      badge: 'Squad Split',
      description: 'Split cost with teammates via link or WhatsApp',
      icon: Users,
      available: true,
    },
    */
    {
      id: 'venue',
      label: 'Pay at Venue',
      badge: 'On Arrival',
      description: 'Pay directly at counter before kickoff',
      icon: Banknote,
      available: true,
    },
  ];

  const paymentGateways = [
    {
      id: 'esewa',
      name: 'eSewa Mobile Wallet',
      tag: 'Fast & Instant',
      customIcon: EsewaIcon,
      color: 'bg-transparent',
      textColor: 'text-emerald-700',
      bgLight: 'bg-emerald-100',
      description: 'Pay directly with your registered eSewa ID',
    },
    {
      id: 'fonepay',
      name: 'Fonepay QR / Mobile Banking',
      tag: 'Scan & Pay',
      customIcon: FonepayIcon,
      color: 'bg-transparent',
      textColor: 'text-rose-700',
      bgLight: 'bg-rose-100',
      description: 'Scan QR with any mobile banking app',
    },
  ];

  const steps = [
    { id: 1, title: 'Select Time', subtitle: 'Choose your slot' },
    { id: 2, title: 'Add Details', subtitle: "Who's playing?" },
    { id: 3, title: 'Review & Pay', subtitle: 'Confirm & pay' },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'TURF10' || code === 'KICKOFF') {
      setAppliedDiscount(0.1);
      triggerToast('🎉 10% promo discount applied!');
    } else if (code === 'TURF20') {
      setAppliedDiscount(0.2);
      triggerToast('🔥 20% promo discount applied!');
    } else {
      setPromoError('Invalid coupon. Try TURF10 or TURF20');
    }
  };

  const activeBookingId = useMemo(() => {
    if (turf?.bookingId) return turf.bookingId;
    if (formData?.bookingId) return formData.bookingId;
    try {
      const pending = JSON.parse(sessionStorage.getItem('turfio_pending_booking') || '{}');
      if (pending?.bookingId) return pending.bookingId;
    } catch (e) {}
    return turf?.id ? `BKG-${turf.id}` : 'BKG-demo';
  }, [turf?.bookingId, turf?.id, formData?.bookingId]);

  const paymentShareUrl = `${window.location.origin}/pay/${activeBookingId}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(paymentShareUrl);
      setCopiedLink(true);
      triggerToast('Match payment link copied!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Hey guys! Let's play at ${venueTitle} on ${selectedDateStr} (${selectedTimeStr} - ${endTimeStr}). Pay your share of NPR ${perTeammateShare} here: ${paymentShareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const updateStep = (newStep, replace = false) => {
    setCurrentStep(newStep);
    const url = new URL(window.location.href);
    url.searchParams.set('step', newStep);
    if (replace) {
      window.history.replaceState({}, '', url.toString());
    } else {
      window.history.pushState({}, '', url.toString());
    }
    const holdToken = turf?.holdToken || new URLSearchParams(window.location.search).get('holdToken') || localStorage.getItem('turfio_guest_hold_token');
    const turfId = turf?.id || turf?._id;
    if (turfId && holdToken && newStep >= 2 && newStep <= 4) {
      turfService.updateHoldStep(turfId, holdToken, newStep);
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      if (!formData.fullName.trim()) {
        triggerToast('Please enter your full name');
        return;
      }
      if (!formData.phone.trim()) {
        triggerToast('Please enter your contact phone number');
        return;
      }
      updateStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3) {
      if (!formData.termsAgreed) {
        triggerToast('Please agree to terms and rules before proceeding');
        return;
      }

      // If eSewa is selected and online payment
      if (formData.paymentType !== 'venue' && formData.selectedPaymentMethod === 'esewa') {
        try {
          setIsProcessingPayment(true);
          triggerToast('Connecting to eSewa payment gateway...');

          const payAmount = formData.paymentType === 'split' ? yourShare : totalAmount;
          let matchType = '7v7';
          if (venueSize.includes('5')) matchType = '5v5';
          else if (venueSize.includes('11')) matchType = '11v11';

          let bookingDate = turf?.selectedDate;
          if (!bookingDate) {
            bookingDate = getTodayNepalString();
          }

          // Build booking payload with hold linkage and idempotency key
          const bookingPayload = {
            turf: turf?.id || turf?._id,
            user: user?._id || user?.id,
            userId: user?._id || user?.id,
            contactEmail: formData?.email || user?.email,
            contactPhone: formData?.phone || user?.phone || user?.phoneNumber,
            date: bookingDate,
            timeSlot: `${selectedTimeStr} - ${endTimeStr}`,
            matchType,
            teamSize: formData.expectedPlayers || 10,
            totalAmount: totalAmount, // Master total amount for venue booking
            totalPaidAmount: 0,
            paymentType: formData.paymentType || 'full',
            splitDetails: {
              totalShares: formData.paymentType === 'split' ? splitPayers : 1,
              perShareAmount: formData.paymentType === 'split' ? yourShare : totalAmount,
            },
            paymentMethod: 'eSewa',
            paymentStatus: 'Pending',
            holdToken: turf?.holdToken,
            holdId: turf?.holdId,
            idempotencyKey,
            court: {
              id: turf?.selectedCourt?._id || turf?.selectedCourt?.id || turf?.court?.id,
              name: courtName,
              courtNumber,
              dimension: courtDimension,
              surface: courtSurface,
              hourlyRate: Number(turf?.courtHourlyRate || turf?.pricePerHour) || 1200,
            },
          };

          // Save active booking details in session for confirmation screen return
          try {
            sessionStorage.setItem('turfio_pending_booking', JSON.stringify({
              turf,
              formData,
              bookingPayload,
              totalAmount: payAmount,
              selectedDateStr,
              selectedTimeStr,
              endTimeStr,
            }));
          } catch (e) {
            console.error(e);
          }

          // Initiate eSewa payment directly using active hold token/id or booking payload
          const effectiveHoldToken = turf?.holdToken || searchParams.get('holdToken') || localStorage.getItem('turfio_guest_hold_token');
          const effectiveBookingId = turf?.bookingId || turf?.id || searchParams.get('bookingId');
          const holdIdentifier = effectiveHoldToken || turf?.holdId || effectiveBookingId;

          const initRes = await turfService.initiateEsewaPayment(
            holdIdentifier,
            payAmount,
            {
              isHold: !!effectiveHoldToken || !!turf?.holdId,
              holdToken: effectiveHoldToken,
              bookingId: effectiveBookingId,
              bookingData: bookingPayload,
            }
          );

          const paymentFormData = initRes?.formData || initRes?.data?.formData;
          const paymentUrl = initRes?.paymentUrl || initRes?.data?.paymentUrl;
          if (paymentFormData && paymentUrl) {
            turfService.submitEsewaForm(paymentUrl, paymentFormData);
            return;
          } else {
            throw new Error(initRes?.message || 'Failed to retrieve payment form data from server');
          }
        } catch (err) {
          console.error('eSewa initiation error:', err);
          triggerToast(err.message || 'Payment initiation failed. Please try again.');
          setIsProcessingPayment(false);
          return;
        }
      }

      // For Pay at Venue or other offline methods
      setIsProcessingPayment(true);
      try {
        let matchType = '7v7';
        if (venueSize.includes('5')) matchType = '5v5';
        else if (venueSize.includes('11')) matchType = '11v11';

        const bookingPayload = {
          turf: turf?.id || turf?._id,
          date: turf?.selectedDate || getTodayNepalString(),
          timeSlot: `${selectedTimeStr} - ${endTimeStr}`,
          matchType,
          teamSize: formData.expectedPlayers || 10,
          totalAmount: totalAmount,
          totalPaidAmount: 0,
          paymentType: formData.paymentType || 'venue',
          splitDetails: {
            totalShares: formData.paymentType === 'split' ? splitPayers : 1,
            perShareAmount: formData.paymentType === 'split' ? yourShare : totalAmount,
          },
          paymentMethod: formData.paymentType === 'venue' ? 'Pay at Venue' : 'Fonepay',
          paymentStatus: 'Pending',
          holdToken: turf?.holdToken,
          holdId: turf?.holdId,
          idempotencyKey,
          court: {
            id: turf?.selectedCourt?._id || turf?.selectedCourt?.id || turf?.court?.id,
            name: courtName,
            courtNumber,
            dimension: courtDimension,
            surface: courtSurface,
            hourlyRate: Number(turf?.courtHourlyRate || turf?.pricePerHour) || 1200,
          },
        };

        const res = await turfService.createBooking(bookingPayload, { headers: { 'Idempotency-Key': idempotencyKey } });
        setConfirmedBooking(res?.data || res);

        updateStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        triggerToast('🎉 Reservation confirmed. Payment is due at the venue.');
      } finally {
        setIsProcessingPayment(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      if (onBack) {
        onBack();
      }
    } else if (currentStep > 2 && currentStep < 4) {
      updateStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const mockBookingId = useMemo(
    () => `TRF-${Math.floor(100000 + Math.random() * 900000)}`,
    []
  );

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900 selection:bg-lime-300 selection:text-slate-900 pb-28">
      {/* ── Navbar ── */}
      <Navbar
        onLogin={onLogin}
        user={user}
        onLogout={onLogout}
        onListTurf={onViewTurfDetails}
        onHome={onHome}
        onDashboard={onDashboard}
      />

      {/* ── Sticky Progress Stepper Header (Pure White Background) ── */}
      {currentStep < 4 && (
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md shadow-xs">
          <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20 py-6">
            <div className="flex items-center justify-between gap-2 max-w-3xl mx-auto">
              {steps.map((step, idx) => {
                const isDone = currentStep > step.id;
                const isActive = currentStep === step.id;
                return (
                  <div key={step.id} className="flex items-center flex-1 last:flex-none">
                    {/* Step Item */}
                    <div
                      onClick={() => {
                        if (step.id === 1) {
                          if (onBack) onBack();
                        } else if (step.id < currentStep) {
                          updateStep(step.id);
                        }
                      }}
                      className={`flex items-center gap-3 transition-all ${
                        step.id <= currentStep ? 'cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full font-black text-xs md:text-sm transition-all shadow-xs ${
                          isDone
                            ? 'bg-lime-400 text-slate-950 font-black'
                            : isActive
                            ? 'bg-lime-400 text-slate-950 font-black ring-4 ring-lime-100'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {isDone ? <Check className="h-4 w-4 stroke-[3]" /> : step.id}
                      </div>

                      <div className="hidden sm:block text-left">
                        <p
                          className={`text-xs md:text-sm font-bold leading-none ${
                            isActive
                              ? 'text-slate-900 font-extrabold'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Connector Line */}
                    {idx < steps.length - 1 && (
                      <div className="flex-1 mx-2 md:mx-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            currentStep > step.id ? 'bg-lime-400 w-full' : 'bg-transparent w-0'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Reservation Holding Timer Banner ── */}
          <div className="bg-lime-50/90 px-6 md:px-14 lg:px-20 py-2.5">
            <div className="mx-auto max-w-[1440px] flex items-center justify-between text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-500"></span>
                </span>
                <span className="font-semibold text-slate-800">
                  Your slot is reserved for{' '}
                  <span className="font-black text-slate-950 font-mono tracking-tight text-sm bg-white px-2.5 py-0.5 rounded-md shadow-2xs">
                    {formattedTimer}
                  </span>{' '}
                  minutes
                </span>
              </div>
              <span className="hidden md:inline font-medium text-slate-600">
                Guaranteed slot hold • Complete checkout to secure the pitch
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main Page Content ── */}
      {currentStep === 4 ? (
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-8 pt-12 md:pt-16 pb-12 md:pb-16 animate-fadeIn">
          {/* Top Header Badge & Title (Centered) */}
          <div className="text-center max-w-xl mx-auto mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 mb-3">
              <CheckCircle2 className="h-4 w-4 text-lime-600" />
              Reservation Confirmed
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Booking Confirmed!
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1.5 leading-relaxed">
              Thank you for booking <span className="font-extrabold text-slate-900">{venueTitle}</span>. A copy of your match pass along with SMS pass details has been sent to <span className="font-bold text-slate-900">+977 {formData.phone || '98XXXXXXXX'}</span>.
            </p>
          </div>

          {/* 2-Column Split Hub Grid (Matching ApplicationSubmittedPage) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start max-w-4xl mx-auto">
            
            {/* Left Column: Match Pass & Primary Actions */}
            <div className="lg:col-span-6 space-y-4 w-full">

              {/* Digital Match Pass / Ticket Receipt Card */}
              <div className="relative mx-auto w-full overflow-hidden rounded-2xl bg-white text-slate-900 p-6 text-left shadow-[0_0_25px_rgba(0,0,0,0.04)]">
                <div className="flex items-start justify-between pb-4 bg-white -mx-6 -mt-6 p-6 mb-4">
                  <div>
                    <p className="text-[11px] font-extrabold text-lime-700">Official Match Pass</p>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{venueTitle}</h3>
                    <p className="text-xs font-bold text-lime-700 mt-0.5">
                      {confirmedBooking?.court?.name || courtName} • {confirmedBooking?.court?.dimension || courtDimension}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-lime-600" />
                      {venueLocation}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-slate-500">Booking ID</p>
                    <p className="font-mono text-sm font-extrabold text-slate-900">
                      {confirmedBooking?.bookingId || turf?.bookingId || mockBookingId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 text-xs">
                  <div>
                    <p className="text-slate-500 font-medium">Match Date</p>
                    <p className="font-extrabold text-sm text-slate-900 mt-0.5">{selectedDateStr}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Time Window</p>
                    <p className="font-extrabold text-sm text-lime-700 mt-0.5">
                      {selectedTimeStr} – {endTimeStr}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Booked For</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {formData.teamName || formData.fullName || 'Futsal Squad'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Total Paid</p>
                    <p className="font-bold text-slate-900 mt-0.5">
                      NPR{' '}
                      {formData.paymentType === 'split'
                        ? yourShare.toLocaleString() + ' (Your share)'
                        : totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>



                {/* QR Code Entry Badge */}
                <div className="pt-4 flex items-center justify-between bg-white -mx-6 -mb-6 p-6 mt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="h-16 w-16 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 border border-slate-100 shadow-2xs">
                      <QRCodeSVG
                        value={confirmedBooking?.bookingId || turf?.bookingId || mockBookingId || 'TURFIO-PASS-2026'}
                        size={54}
                        level="M"
                        marginSize={0}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-slate-900">Scan for Pitch Entry</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Show this QR code at venue counter</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-lime-800 bg-lime-100 px-3 py-1 rounded-full shrink-0">
                    VALID PASS
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Location Directions & Match Day Arrival Guide */}
            <div className="lg:col-span-6 space-y-4 w-full">
              {/* Joined Directions & Arrival Tips Card */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_0_25px_rgba(0,0,0,0.04)] space-y-4">
                {/* Pitch Location / Directions */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl bg-slate-200">
                      <img
                        src={venueImage}
                        alt={venueTitle}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/image.png';
                        }}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <h3 className="text-base font-extrabold text-slate-900 truncate leading-snug">
                        {venueTitle}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{venueLocation}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const targetTurf = confirmedBooking?.turf || turf;
                      const targetTurfId = targetTurf?._id || targetTurf?.id;
                      if (onNavigateRoute) {
                        onNavigateRoute(targetTurf || { id: targetTurfId });
                      } else {
                        const path = `/route${targetTurfId ? `?turfId=${targetTurfId}` : ''}`;
                        window.history.pushState({}, '', path);
                        window.location.href = path;
                      }
                    }}
                    className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Navigation className="h-3.5 w-3.5 text-lime-700" />
                    <span>View on Map</span>
                  </button>
                </div>

                {/* Separator Line & Arrival Tips */}
                <div className="border-t border-slate-100 pt-4 space-y-2.5">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                    <span>Arrival Tips</span>
                    <Info className="h-4 w-4 text-slate-400" />
                  </h3>

                  <ul className="space-y-2 text-xs text-slate-600 font-medium leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                      <span>Arrive 10–15 minutes early</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                      <span>Show the QR code at the counter</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                      <span>Bring your team and be ready to play</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0 mt-1.5" />
                      <span>For any issues, contact the venue directly</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Separate Contact Venue Card */}
              <div className="rounded-2xl bg-white p-5 shadow-[0_0_25px_rgba(0,0,0,0.04)] flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">Need help with directions?</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Contact arena reception desk</p>
                </div>

                <a
                  href="tel:+9779800000000"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-lime-700" />
                  <span>Call Venue</span>
                </a>
              </div>
            </div>

            {/* Row 2: Full-Width Payment Information Bento Card */}
            <div className="lg:col-span-12 rounded-2xl bg-white p-5 sm:p-6 shadow-[0_0_25px_rgba(0,0,0,0.04)] space-y-4">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Wallet className="h-4.5 w-4.5 text-lime-600" />
                  <span>Payment Information</span>
                </h3>
                <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full ${
                  formData.paymentType === 'venue'
                    ? 'bg-amber-100 text-amber-800'
                    : formData.paymentType === 'split'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-lime-100 text-lime-800'
                }`}>
                  {formData.paymentType === 'venue'
                    ? 'PAY AT VENUE'
                    : formData.paymentType === 'split'
                    ? 'SPLIT PAYMENT'
                    : 'PAID ONLINE'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-medium">Payment Type</p>
                  <p className="font-extrabold text-sm text-slate-900 mt-0.5 capitalize">
                    {formData.paymentType === 'venue'
                      ? 'Pay at Arena Counter'
                      : formData.paymentType === 'split'
                      ? 'Split Payment'
                      : 'Online Payment (eSewa)'}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 font-medium">Total Pitch Fee</p>
                  <p className="font-extrabold text-sm text-slate-900 mt-0.5">
                    NPR {totalAmount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 font-medium">Amount Paid Now</p>
                  <p className="font-extrabold text-sm text-lime-700 mt-0.5">
                    NPR {formData.paymentType === 'split' ? yourShare.toLocaleString() : totalAmount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 font-medium">Payment Status</p>
                  <p className="font-extrabold text-sm text-slate-900 mt-0.5 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-lime-600 shrink-0" />
                    <span>{formData.paymentType === 'venue' ? 'Pending Arrival' : 'Verified'}</span>
                  </p>
                </div>
              </div>

              {/* Split Payment Progress & Share Section */}
              {formData.paymentType === 'split' && (
                <div className="mt-3 rounded-xl bg-lime-50/70 p-4 space-y-3 border border-lime-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-lime-700" />
                      Squad Payment Progress
                    </span>
                    <span className="font-extrabold text-lime-800 bg-lime-200/80 px-2.5 py-0.5 rounded-md">
                      1 of {splitPayers} Paid
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-lime-500 rounded-full transition-all"
                      style={{ width: `${Math.round((1 / splitPayers) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Captain Paid: NPR {yourShare.toLocaleString()}</span>
                    <span className="font-bold text-amber-700">
                      NPR {remainingShare.toLocaleString()} Remaining
                    </span>
                  </div>

                  <div className="pt-1">
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">
                      Share this payment link with teammates (NPR {perTeammateShare} each):
                    </p>
                    <div className="flex items-center gap-2 max-w-lg">
                      <input
                        type="text"
                        readOnly
                        value={paymentShareUrl}
                        className="flex-1 bg-white rounded-lg px-3 py-2 text-xs text-slate-700 border border-slate-200 select-all outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                      >
                        {copiedLink ? 'Copied!' : 'Copy Link'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Option to convert Pay at Venue booking to Split Payment */}
              {formData.paymentType === 'venue' && (
                <div className="mt-3 rounded-xl bg-slate-50 p-4 space-y-2 text-left border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-lime-600" /> Want to split payment with squad online?
                    </span>
                    <button
                      type="button"
                      disabled={isConvertingToSplit}
                      onClick={handleConvertToSplit}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isConvertingToSplit ? 'Converting...' : 'Switch to Split Payment'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Generate a live payment link for your squad without re-booking or losing your slot.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Centered Action Buttons below both cards */}
          <div className="mt-8 flex justify-center">
            <div className="flex gap-4 w-full max-w-md">
              <button
                type="button"
                onClick={() => triggerToast('Match pass downloaded as PDF!')}
                className="flex-1 py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="h-4 w-4" />
                <span>Download Pass</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const shareText = formData.paymentType === 'split'
                    ? `Hey guys! Let's play at ${venueTitle} on ${selectedDateStr} (${selectedTimeStr} - ${endTimeStr}). Pay your share of NPR ${perTeammateShare} here: ${paymentShareUrl}`
                    : `Hey! I just booked a slot at ${venueTitle} for ${selectedDateStr} from ${selectedTimeStr} to ${endTimeStr}. See you on the pitch!`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                }}
                className="flex-1 py-3.5 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <WhatsAppIcon className="h-4 w-4 fill-white text-white" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-[1440px] px-6 py-8 md:px-14 lg:px-20">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_440px] lg:gap-8 xl:gap-12">
            {/* ═════════════════════════════════════════════════
                LEFT COLUMN: STEP CONTENT (WHITE BG, BORDERLESS)
               ═════════════════════════════════════════════════ */}
            <div className="space-y-8">
              {/* ────────────────────────────────────────────────
                  STEP 2: ADD DETAILS (WHO'S PLAYING + PAYMENT TYPE)
                 ──────────────────────────────────────────────── */}
              {currentStep === 2 && (
                <>
                {/* ── Section 1: Contact Person (At the Top) ── */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      1. Contact Person
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      We will send your digital Match Pass, entry QR code, and SMS updates here.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Saugat Shahi"
                          value={formData.fullName}
                          onChange={(e) => handleInputChange('fullName', e.target.value)}
                          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100/80 transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex rounded-2xl bg-slate-50 overflow-hidden transition-all focus-within:bg-slate-100/80">
                        <span className="flex items-center gap-1 px-3 text-xs sm:text-[13px] font-bold text-slate-600 bg-slate-200/50 select-none shrink-0 whitespace-nowrap">
                          <span>🇳🇵</span>
                          <span>+977</span>
                        </span>
                        <input
                          type="tel"
                          required
                          placeholder="98XXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3.5 py-3.5 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none min-w-0"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                        Email Address{' '}
                        <span className="text-slate-400 font-normal text-xs sm:text-[13px]">(optional)</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          placeholder="saugat@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100/80 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-8" />

                {/* ── Section 2: Who's Playing ── */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      2. Who's Playing?
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      Choose whether you're booking for a full match squad or playing solo.
                    </p>
                  </div>

                  {/* Playing Type Toggle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {[
                      {
                        id: 'team',
                        icon: Users,
                        title: 'Team / Group',
                        desc: 'Book whole pitch for your squad or scrimmage',
                      },
                      {
                        id: 'individual',
                        icon: User,
                        title: 'Individual / Open Play',
                        desc: 'Single player or training session',
                      },
                    ].map((type) => {
                      const Icon = type.icon;
                      const isSelected = formData.playingType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => handleInputChange('playingType', type.id)}
                          className={`relative flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-lime-50 text-slate-950'
                              : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700'
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                              isSelected
                                ? 'bg-lime-400 text-slate-950 font-black'
                                : 'bg-white text-slate-600'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="flex-1 min-w-0 pr-5">
                            <p className="font-extrabold text-[15px] text-slate-900">{type.title}</p>
                            <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                              {type.desc}
                            </p>
                          </div>

                          <div
                            className={`absolute top-4 right-4 h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                              isSelected ? 'bg-lime-400 text-slate-950' : 'bg-slate-200/80 text-transparent'
                            }`}
                          >
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Inputs: Team Name & Expected Players */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    {formData.playingType === 'team' && (
                      <div className="space-y-1.5">
                        <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                          Team / Group Name{' '}
                          <span className="text-slate-400 font-normal text-xs sm:text-[13px]">(optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Lalitpur FC, Himalayan Tigers"
                          value={formData.teamName}
                          onChange={(e) => handleInputChange('teamName', e.target.value)}
                          className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-slate-100/80 transition-all"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                          Expected Players
                        </label>
                        <span className="text-[11px] font-semibold text-slate-400">
                          Max {maxPlayersAllowed} players
                        </span>
                      </div>

                      {/* Stepper Group */}
                      <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              'expectedPlayers',
                              Math.max(2, formData.expectedPlayers - 1)
                            )
                          }
                          className="flex h-9 w-10 items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold shadow-2xs transition-all active:scale-90 cursor-pointer"
                        >
                          −
                        </button>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="text-base font-bold text-slate-900 min-w-[28px] text-center">
                            {formData.expectedPlayers}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                            players
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange(
                              'expectedPlayers',
                              Math.min(maxPlayersAllowed, formData.expectedPlayers + 1)
                            )
                          }
                          className="flex h-9 w-10 items-center justify-center rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold shadow-2xs transition-all active:scale-90 cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Match Equipment Chips */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-slate-500 mb-2">
                      Included Match Equipment
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
                        <Check className="h-3 w-3 text-lime-600 stroke-[3]" /> FIFA Standard Ball
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
                        <Check className="h-3 w-3 text-lime-600 stroke-[3]" /> Team Bibs (2 Colors)
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
                        <Check className="h-3 w-3 text-lime-600 stroke-[3]" /> Cold Drinking Water
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-8" />

                {/* ── Section 3: Payment Type ── */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      3. Payment Type
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      Choose how you want to handle the match payment with your squad.
                    </p>
                  </div>

                  {/* Payment Type Selection Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isSelected = formData.paymentType === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => handleInputChange('paymentType', method.id)}
                          className={`relative flex flex-col justify-between p-5 rounded-2xl text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-lime-50 text-slate-950'
                              : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors shrink-0 ${
                                  isSelected
                                    ? 'bg-lime-400 text-slate-950 font-black'
                                    : 'bg-white text-slate-600'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-extrabold text-[15px] text-slate-900 leading-tight">{method.label}</p>
                                  <div
                                    className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                      isSelected
                                        ? 'bg-lime-400 text-slate-950'
                                        : 'bg-slate-200/80 text-transparent'
                                    }`}
                                  >
                                    <Check className="h-3 w-3 stroke-[3]" />
                                  </div>
                                </div>

                                <p className="text-xs text-slate-500 font-medium mt-1 leading-snug whitespace-nowrap">
                                  {method.description}
                                </p>
                              </div>
                            </div>

                            {method.badge && (
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                                  isSelected
                                    ? 'bg-lime-200/80 text-slate-900'
                                    : 'bg-white text-slate-600'
                                }`}
                              >
                                {method.badge}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Split Payment Drawer */}
                  {formData.paymentType === 'split' ? (
                    <div className="rounded-2xl bg-slate-50 p-5 space-y-4 animate-fadeIn">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-extrabold text-slate-900">
                              Split Payment Calculator
                            </h4>
                            <span className="bg-lime-200/80 text-lime-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              Smart Split
                            </span>
                          </div>
                          <p className="text-[13px] text-slate-500 font-medium mt-1">
                            Pay your share now to lock the slot. Send the link to teammates.
                          </p>
                        </div>

                        {/* Payer Count Selector */}
                        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200/60 rounded-xl p-1">
                          <span className="text-xs font-bold text-slate-600 px-2">Split by:</span>
                          {[2, 4, formData.expectedPlayers].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleInputChange('splitPlayersCount', num)}
                              className={`px-3 py-1 text-xs sm:text-[13px] font-bold rounded-lg transition-all cursor-pointer ${
                                splitPayers === num
                                  ? 'bg-lime-400 text-slate-950 font-black'
                                  : 'text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {num} players
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Split Breakdown Numbers */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="rounded-xl bg-white p-4 sm:p-5">
                          <p className="text-[13px] sm:text-sm font-semibold text-lime-700">
                            Your share (pay now)
                          </p>
                          <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-950">
                              NPR {yourShare.toLocaleString()}
                            </span>
                            <span className="text-xs font-bold text-lime-800 bg-lime-100 px-2.5 py-0.5 rounded-md">
                              {Math.round((yourShare / totalAmount) * 100)}% of total
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-1.5">
                            Slot is instantly confirmed once your share is paid.
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-4 sm:p-5">
                          <p className="text-[13px] sm:text-sm font-semibold text-slate-600">
                            Remaining squad share
                          </p>
                          <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-2xl font-black text-slate-900">
                              NPR {remainingShare.toLocaleString()}
                            </span>
                            <span className="text-xs sm:text-[13px] font-semibold text-slate-600">
                              NPR {perTeammateShare.toLocaleString()} / player
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500 mt-1.5">
                            Remaining {splitPayers - 1} players can pay directly via link.
                          </p>
                        </div>
                      </div>

                      {/* Shareable Link Box */}
                      <div className="space-y-2 pt-1">
                        <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                          Squad Payment Link
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                          <div className="flex-1 flex items-center bg-white rounded-xl px-4 py-3 overflow-hidden">
                            <span className="text-xs sm:text-[13px] font-mono font-medium text-slate-600 truncate flex-1 select-all">
                              {paymentShareUrl}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className={`inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all active:scale-95 cursor-pointer ${
                              copiedLink
                                ? 'bg-lime-400 text-slate-950 font-black'
                                : 'bg-white hover:bg-slate-100 text-slate-800'
                            }`}
                          >
                            {copiedLink ? (
                              <>
                                <CheckCheck className="h-4 w-4" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" /> Copy Link
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleShareWhatsApp}
                            className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all active:scale-95 cursor-pointer"
                          >
                            <WhatsAppIcon className="h-4 w-4 fill-white text-white" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : formData.paymentType === 'venue' ? (
                    <div className="rounded-2xl bg-amber-50 p-4 text-xs sm:text-sm font-medium text-amber-950 flex items-start gap-3">
                      <Info className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">Pay at Turf Policy</p>
                        <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                          Your reservation will be held. Please arrive at least 15 minutes before
                          kickoff to clear the payment at the arena counter via Cash or Fonepay QR.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

              </>
            )}

            {/* ────────────────────────────────────────────────
                STEP 3: REVIEW & PAY
               ──────────────────────────────────────────────── */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-fadeIn">
                {/* Review Overview Section */}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Review Match Details
                    </h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                      Double check your schedule and details before completing payment.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pitch & Arena Card */}
                    <div className="rounded-2xl bg-slate-50 p-5 space-y-3">
                      <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                        Pitch & Arena
                      </label>
                      <p className="text-base font-extrabold text-slate-900">{venueTitle}</p>
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        <span className="text-xs font-black text-lime-950 bg-lime-300 px-2.5 py-0.5 rounded-md">
                          {courtName}
                        </span>
                        {venueType && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md">
                            <Compass className="h-3.5 w-3.5 text-slate-400" />
                            <span>{venueType}</span>
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md">
                          {courtDimension}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] font-medium text-slate-600 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-lime-600 shrink-0" />
                        <span>{venueLocation}</span>
                      </p>
                    </div>

                    {/* Date & Slot Time Card */}
                    <div className="rounded-2xl bg-slate-50 p-5 space-y-3">
                      <label className="block text-[13px] sm:text-sm font-semibold text-slate-700">
                        Date & Slot Time
                      </label>
                      <p className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-lime-600 shrink-0" />
                        <span>{selectedDateStr}</span>
                      </p>
                      <p className="text-xs sm:text-[13px] font-medium text-slate-600 flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-lime-600 shrink-0" />
                        <span>{selectedTimeStr} → {endTimeStr} ({duration} hr)</span>
                      </p>
                      <div className="pt-0.5 text-xs sm:text-[13px] font-medium text-slate-600">
                        <span className="text-slate-500">Booked by: </span>
                        <span className="text-slate-900 font-bold">{formData.fullName}</span>{' '}
                        <span className="text-slate-500">({formData.phone})</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100 my-8" />

                {/* Payment Gateway Selection */}
                {formData.paymentType !== 'venue' ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                        Select Payment Method
                      </h2>
                      <p className="text-sm font-medium text-slate-500 mt-1">
                        Secure instant checkout powered by verified Nepali payment gateways.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {paymentGateways.map((gw) => {
                        const isSelected = formData.selectedPaymentMethod === gw.id;
                        return (
                          <button
                            key={gw.id}
                            type="button"
                            onClick={() => handleInputChange('selectedPaymentMethod', gw.id)}
                            className={`flex items-start gap-3.5 p-4 rounded-2xl text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-lime-50 text-slate-950'
                                : 'bg-slate-50 hover:bg-slate-100/80 text-slate-700'
                            }`}
                          >
                            <div
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black overflow-hidden ${gw.color}`}
                            >
                              {gw.customIcon ? (
                                <gw.customIcon className="h-full w-full object-contain" />
                              ) : (
                                <QrCode className="h-5 w-5 text-white" />
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-extrabold text-[15px] text-slate-900">{gw.name}</p>
                              <p className="text-xs text-slate-500 font-medium mt-0.5 leading-snug truncate">
                                {gw.description}
                              </p>
                              <span
                                className={`inline-block mt-2 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${gw.bgLight} ${gw.textColor}`}
                              >
                                {gw.tag}
                              </span>
                            </div>

                            <div
                              className={`h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-1 transition-all ${
                                isSelected ? 'bg-lime-400 text-slate-950' : 'bg-slate-200/80 text-transparent'
                              }`}
                            >
                              <Check className="h-3 w-3 stroke-[3]" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      Pay on Arrival
                    </h2>
                    <div className="rounded-2xl bg-slate-50 p-5 space-y-2">
                      <p className="font-extrabold text-base text-slate-900">
                        No online transaction needed right now!
                      </p>
                      <p className="text-xs sm:text-[13px] text-slate-500 font-medium leading-relaxed">
                        Your slot reservation will be confirmed upon clicking the button below. You
                        will receive a digital Match Pass on your phone which you will present at
                        the arena reception to pay via Cash or Mobile Banking.
                      </p>
                    </div>
                  </div>
                )}

                {/* Terms Agreement */}
                <div className="pt-1">

                  {/* Clean Checkbox without gray card */}
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.termsAgreed}
                      onChange={(e) => handleInputChange('termsAgreed', e.target.checked)}
                      className="h-4 w-4 rounded text-lime-600 focus:ring-lime-500 cursor-pointer accent-lime-500 shrink-0"
                    />
                    <label
                      htmlFor="terms"
                      className="text-[13px] sm:text-sm font-medium text-slate-600 cursor-pointer select-none leading-relaxed"
                    >
                      I agree to the{' '}
                      <span className="font-bold text-slate-900 underline decoration-slate-300">
                        Turf Rules & Guidelines
                      </span>{' '}
                      and the{' '}
                      <span className="font-bold text-slate-900 underline decoration-slate-300">
                        Cancellation Policy
                      </span>
                      .
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────
                STEP 4: CONFIRMATION SUCCESS RECEIPT
               ──────────────────────────────────────────────── */}
            {currentStep === 4 && (
              <div className="space-y-8 animate-fadeIn text-center py-4">
                {/* Celebratory Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-lime-100 text-lime-700 shadow-md">
                  <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
                </div>

                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3.5 py-1 text-xs font-extrabold text-lime-800">
                    <Sparkles className="h-3.5 w-3.5" /> RESERVATION CONFIRMED
                  </span>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900">
                    You're All Set to Play!
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-500 max-w-md mx-auto">
                    Your futsal slot at {venueTitle} has been successfully locked in. An SMS pass
                    has been dispatched to +977 {formData.phone || '98XXXXXXXX'}.
                  </p>
                </div>

                {/* Digital Match Pass / Ticket (Light Theme) */}
                <div className="relative mx-auto max-w-lg overflow-hidden rounded-3xl bg-slate-50 text-slate-900 p-6 sm:p-8 text-left shadow-lg shadow-slate-100">
                  <div className="flex items-start justify-between pb-4 bg-white -mx-6 -mt-6 p-6 mb-4 shadow-2xs">
                    <div>
                      <p className="text-[11px] font-extrabold text-lime-700">
                        Official Match Pass
                      </p>
                      <h3 className="text-xl font-extrabold text-slate-900 mt-1">{venueTitle}</h3>
                      <p className="text-xs font-bold text-lime-700 mt-0.5">
                        {confirmedBooking?.court?.name || courtName} • {confirmedBooking?.court?.dimension || courtDimension}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-lime-600" />
                        {venueLocation}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-slate-500">
                        Booking ID
                      </p>
                      <p className="font-mono text-sm font-extrabold text-slate-900">
                        {confirmedBooking?.bookingId || turf?.bookingId || mockBookingId}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                    <div>
                      <p className="text-slate-500 font-medium">Match Date</p>
                      <p className="font-extrabold text-sm text-slate-900 mt-0.5">{selectedDateStr}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Time Window</p>
                      <p className="font-extrabold text-sm text-lime-700 mt-0.5">
                        {selectedTimeStr} – {endTimeStr}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Booked For</p>
                      <p className="font-bold text-slate-900 mt-0.5">
                        {formData.teamName || formData.fullName || 'Futsal Squad'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium">Total Paid</p>
                      <p className="font-bold text-slate-900 mt-0.5">
                        NPR{' '}
                        {formData.paymentType === 'split'
                          ? yourShare.toLocaleString() + ' (Your share)'
                          : totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Split Payment Progress & Share Section */}
                  {formData.paymentType === 'split' && (
                    <div className="my-4 rounded-xl border border-lime-200/80 bg-lime-50/50 p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-lime-700" />
                          Split Match Status
                        </span>
                        <span className="font-extrabold text-lime-800 bg-lime-100 px-2 py-0.5 rounded-md">
                          1 of {splitPayers} Paid
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-lime-500 rounded-full transition-all"
                          style={{ width: `${Math.round((1 / splitPayers) * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-600">
                        <span>Captain Paid: NPR {yourShare.toLocaleString()}</span>
                        <span className="font-bold text-amber-700">
                          NPR {remainingShare.toLocaleString()} Remaining
                        </span>
                      </div>

                      {/* Shareable Link Box */}
                      <div className="pt-1">
                        <p className="text-[11px] font-semibold text-slate-700 mb-1.5">
                          Share this link with teammates to collect their share (NPR {perTeammateShare} each):
                        </p>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            readOnly
                            value={paymentShareUrl}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 select-all outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shrink-0"
                          >
                            {copiedLink ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option to convert Pay at Venue booking to Split Payment */}
                  {formData.paymentType === 'venue' && (
                    <div className="my-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 space-y-2 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="h-4 w-4 text-lime-600" /> Want to split payment with squad online?
                        </span>
                        <button
                          type="button"
                          disabled={isConvertingToSplit}
                          onClick={handleConvertToSplit}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isConvertingToSplit ? 'Converting...' : 'Switch to Split Payment'}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Generate a live payment link for your squad without re-booking or losing your slot.
                      </p>
                    </div>
                  )}

                  {/* QR Code Entry Badge */}
                  <div className="pt-4 flex items-center justify-between bg-white -mx-6 -mb-6 p-6 mt-4 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 rounded-xl bg-slate-50 p-1.5 flex items-center justify-center shrink-0">
                        <QrCode className="h-full w-full text-slate-900" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Scan for Pitch Entry</p>
                        <p className="text-[11px] text-slate-500">Show this QR code at venue counter</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-lime-800 bg-lime-100 px-3 py-1 rounded-full">
                      VALID PASS
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => triggerToast('Match pass downloaded as PDF!')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-slate-100 hover:bg-slate-200 px-6 py-3 text-xs font-bold text-slate-900 transition-all cursor-pointer"
                  >
                    <Download className="h-4 w-4" /> Download Pass
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const shareText = formData.paymentType === 'split'
                        ? `Hey guys! Let's play at ${venueTitle} on ${selectedDateStr} (${selectedTimeStr} - ${endTimeStr}). Pay your share of NPR ${perTeammateShare} here: ${paymentShareUrl}`
                        : `Hey! I just booked a slot at ${venueTitle} for ${selectedDateStr} from ${selectedTimeStr} to ${endTimeStr}. See you on the pitch!`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#20bd5a] px-6 py-3 text-xs font-bold text-white transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-white text-white" /> Share on WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={onHome}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 px-7 py-3 text-xs font-black text-slate-950 transition-all cursor-pointer shadow-xs"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ═════════════════════════════════════════════════
              RIGHT COLUMN: FLOATING BOOKING SUMMARY CARD
              (ELEVATED SHADOW, BORDERLESS, MATCHING TURF DETAILS)
             ═════════════════════════════════════════════════ */}
          <div>
            <div className="lg:sticky lg:top-28 space-y-5 w-full">
              {/* Elevated Floating Card (Exact rounded-2xl and shadow from TurfDetailsPage) */}
              <div className="w-full rounded-2xl bg-white p-6 sm:p-7 shadow-[0_0_25px_rgba(0,0,0,0.04)] space-y-5">
                {/* Compact Horizontal Venue Header (Vertically Centered to Image, Tags at End) */}
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-2xs">
                    <img
                      src={venueImage}
                      alt={venueTitle}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/image.png';
                      }}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900 truncate leading-snug">
                        {venueTitle}
                      </h3>

                      {onViewTurfDetails && (
                        <button
                          type="button"
                          onClick={() => onViewTurfDetails(turf)}
                          className="text-xs font-bold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:text-lime-700 transition-colors cursor-pointer shrink-0"
                        >
                          View Arena
                        </button>
                      )}
                    </div>

                    <p className="text-[13px] text-slate-600 font-medium truncate flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-lime-600 shrink-0" />
                      <span>{venueLocation}</span>
                    </p>

                    {/* Venue Type & Size Tags at the Last */}
                    <div className="flex items-center gap-1.5 pt-2">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-700">
                        <Compass className="h-3 w-3 text-slate-400" />
                        <span>{venueType}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-700">
                        <Users className="h-3 w-3 text-slate-400" />
                        <span>{venueSize}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                  {/* Schedule Details */}
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Match Date</p>
                          <p className="text-sm font-bold text-slate-900">{selectedDateStr}</p>
                        </div>
                      </div>

                      {onBack && currentStep === 2 && (
                        <button
                          type="button"
                          onClick={onBack}
                          className="text-xs font-bold text-lime-700 hover:text-lime-800 transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500">Time Slot</p>
                          <p className="text-sm font-bold text-slate-900">
                            {selectedTimeStr} – {endTimeStr}{' '}
                            <span className="text-xs text-slate-400 font-medium">
                              ({duration} {duration === 1 ? 'hr' : 'hrs'})
                            </span>
                          </p>
                        </div>
                      </div>

                      {onBack && currentStep === 2 && (
                        <button
                          type="button"
                          onClick={onBack}
                          className="text-xs font-bold text-lime-700 hover:text-lime-800 transition-colors cursor-pointer"
                        >
                          Change
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  {/* Itemized Price Breakdown */}
                  <div className="space-y-3 text-sm font-medium text-slate-600">
                    <div className="flex justify-between">
                      <span>
                        NPR {baseRateNumeric.toLocaleString()} × {duration}{' '}
                        {duration === 1 ? 'hr' : 'hrs'}
                      </span>
                      <span className="font-bold text-slate-900">
                        NPR {subtotal.toLocaleString()}
                      </span>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-lime-700 font-bold">
                        <span>Promo Discount ({appliedDiscount * 100}%)</span>
                        <span>- NPR {discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span>Platform Booking Fee</span>
                        <div className="relative group flex items-center">
                          <button
                            type="button"
                            aria-label="Platform fee info"
                            className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                          >
                            <Info className="h-3.5 w-3.5" />
                          </button>
                          <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-medium text-white opacity-0 shadow-xl transition-all group-hover:opacity-100 group-focus-within:opacity-100 z-50 text-center leading-snug">
                            Turfio charges NPR 0 booking fee for all players. Enjoy 100% free reservations!
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </div>
                      <span className="font-bold text-lime-700 bg-lime-100/80 px-2.5 py-0.5 rounded-full text-xs">
                        FREE
                      </span>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                      <div>
                        <p className="text-base font-black text-slate-900">Total Amount</p>
                        <p className="text-xs text-slate-400 font-normal">All local municipal taxes included</p>
                      </div>
                      <span className="text-xl font-black text-slate-900">
                        NPR {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Promo Code Section (Stays right here below Total Amount) */}
                  {currentStep < 4 && (
                    <div className="pt-1">
                      {appliedDiscount > 0 ? (
                        <div className="rounded-xl bg-lime-100/80 p-3 text-xs font-bold text-lime-900 flex items-center justify-between">
                          <span>Coupon applied ({appliedDiscount * 100}% off)</span>
                          <button
                            type="button"
                            onClick={() => {
                              setAppliedDiscount(0);
                              setPromoCode('');
                            }}
                            className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : showPromoInput ? (
                        <form onSubmit={handleApplyPromo} className="space-y-1.5">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                placeholder="Coupon (e.g. TURF10)"
                                className="w-full h-[44px] rounded-xl bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:bg-slate-100 transition-all"
                                autoFocus
                              />
                            </div>
                            <button
                              type="submit"
                              className="h-[44px] min-w-[100px] px-5 rounded-xl bg-lime-400 hover:bg-lime-500 text-sm font-extrabold text-slate-950 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center shadow-xs"
                            >
                              Apply
                            </button>
                          </div>
                          {promoError && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1.5">{promoError}</p>
                          )}
                        </form>
                      ) : (
                        <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-slate-600 py-1 text-center">
                          <span>Have a promo code?</span>
                          <button
                            type="button"
                            onClick={() => setShowPromoInput(true)}
                            className="font-bold text-lime-600 underline decoration-lime-500 underline-offset-4 hover:text-lime-700 transition-colors cursor-pointer ml-0.5"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
          </div>
        </div>
      </main>
      )}

      {/* ── Fixed Bottom Sticky Action Bar ── */}
      {currentStep < 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.06)] p-3.5 sm:p-4">
          <div className="mx-auto max-w-[1440px] px-4 md:px-14 lg:px-20 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-700 transition-all active:scale-95 cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back</span>
            </button>

            {/* Center Summary on desktop */}
            <div className="hidden sm:flex items-center gap-2.5">
              <span className="text-sm font-medium text-slate-600">
                {venueTitle} • {selectedDateStr}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-base font-extrabold text-slate-900">
                NPR{' '}
                {formData.paymentType === 'split'
                  ? yourShare.toLocaleString() + ' (Your share)'
                  : totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Primary CTA */}
            {currentStep === 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 px-7 py-3 text-xs sm:text-sm font-black text-slate-950 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                <span>Review & Continue to Payment</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!formData.termsAgreed || isProcessingPayment}
                className="inline-flex items-center gap-2 rounded-full bg-lime-400 hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 text-xs sm:text-sm font-black text-slate-950 transition-all active:scale-95 cursor-pointer shadow-xs"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Redirecting to eSewa...</span>
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>
                      {formData.paymentType === 'venue'
                        ? 'Confirm Booking & Pay at Venue'
                        : `Pay NPR ${(formData.paymentType === 'split' ? yourShare : totalAmount).toLocaleString()} & Confirm`}
                    </span>
                    <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

export function PublicSplitPaymentPage({ bookingId, onHome }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bookingId) return;
    setLoading(true);
    turfService
      .getSplitPaymentDetails(bookingId)
      .then((data) => {
        setBooking(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Match not found or expired.');
        setLoading(false);
      });
  }, [bookingId]);

  const handlePayShare = async (e) => {
    e.preventDefault();

    try {
      setIsProcessing(true);
      const res = await turfService.initiateSplitSharePayment(
        booking._id || booking.bookingId,
        booking.perShare
      );

      if (res?.formData && res?.paymentUrl) {
        turfService.submitEsewaForm(res.paymentUrl, res.formData);
      } else {
        throw new Error(res?.message || 'Failed to initiate eSewa payment');
      }
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Payment initiation failed. Please try again.', 'error');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="h-9 w-9 animate-spin text-lime-600 mb-3" />
        <p className="text-sm font-bold text-slate-700">Loading match payment details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-1">Match Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">{error || 'This payment link may be invalid or expired.'}</p>
        <button
          type="button"
          onClick={onHome}
          className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
        >
          Go to Turfio Home
        </button>
      </div>
    );
  }

  const isFullyPaid = booking.paymentStatus === 'Paid' || booking.remainingAmount <= 0;
  const venueTitle = booking.turf?.name || booking.turf?.title || 'Futsal Arena';
  const rawLoc = booking.turf?.location;
  const rawAddr = booking.turf?.address;
  const venueLocation = (typeof rawAddr === 'string' && rawAddr.trim())
    ? rawAddr
    : (rawAddr && typeof rawAddr === 'object' && (rawAddr.area || rawAddr.city))
    ? [rawAddr.area, rawAddr.city].filter(Boolean).join(', ')
    : (typeof rawLoc === 'string' && rawLoc.trim())
    ? rawLoc
    : 'Kathmandu, Nepal';
  const matchDate = new Date(booking.date).toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const progressPercent = Math.min(
    100,
    Math.round(((booking.totalPaidAmount || 0) / (booking.totalAmount || 1)) * 100)
  );

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans text-slate-900 selection:bg-lime-200">
      <Navbar onHome={onHome} />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 sm:py-12">
        <div className="bg-white rounded-3xl shadow-[0_4px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-lime-400 text-slate-950">
                <Users className="h-3.5 w-3.5" />
                SPLIT PAYMENT
              </span>
              <span className="text-xs text-slate-400 font-medium">Ref: {booking.bookingId}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{venueTitle}</h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-lime-400 shrink-0" />
              {venueLocation}
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
              <div>
                <p className="text-slate-400 text-[11px]">Match Date</p>
                <p className="font-extrabold text-white mt-0.5 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-lime-400" />
                  {matchDate}
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-[11px]">Time Slot</p>
                <p className="font-extrabold text-white mt-0.5 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-lime-400" />
                  {booking.timeSlot}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Progress Section */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-bold text-slate-800">Match Payment Progress</span>
                <span className="font-extrabold text-lime-700 bg-lime-100 px-2.5 py-0.5 rounded-full text-xs">
                  {booking.paidSharesCount} of {booking.totalShares} Shares Paid
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-lime-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <span>Paid: NPR {(booking.totalPaidAmount || 0).toLocaleString()}</span>
                <span className="font-bold text-amber-700">
                  Remaining: NPR {(booking.remainingAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>

            {isFullyPaid ? (
              /* If all shares paid */
              <div className="rounded-2xl bg-lime-50 border border-lime-200 p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-lime-500 text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900">All Shares Paid!</h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Every player has paid their share. The booking is fully settled. See you on the pitch!
                </p>
                <button
                  type="button"
                  onClick={onHome}
                  className="mt-2 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            ) : (
              /* Pay Share Form */
              <form onSubmit={handlePayShare} className="space-y-5">
                <div className="border-t border-slate-100 pt-2">
                  <div className="flex items-baseline justify-between mb-4">
                    <h2 className="text-base font-black text-slate-900">Pay Your Share</h2>
                    <span className="text-xl font-black text-lime-700">
                      NPR {booking.perShare?.toLocaleString()}
                    </span>
                  </div>

                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3.5 text-xs text-slate-600 space-y-1">
                    <p className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-lime-600 shrink-0" />
                      Instant Teammate Checkout
                    </p>
                    <p>No sign-up or contact details required. Proceed directly to eSewa to pay your share!</p>
                  </div>
                </div>

                {/* Gateway Selection */}
                <div className="rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/40 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#60BB46] flex items-center justify-center shrink-0 shadow-xs">
                      <EsewaIcon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">eSewa Mobile Wallet</p>
                      <p className="text-[11px] text-slate-500">Pay instant NPR {booking.perShare?.toLocaleString()}</p>
                    </div>
                  </div>
                  <span className="h-4 w-4 rounded-full border-4 border-emerald-600 bg-white" />
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full h-12 rounded-2xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-black text-sm transition-all active:scale-[0.99] cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Connecting to eSewa...</span>
                    </>
                  ) : (
                    <>
                      <Wallet className="h-4 w-4" />
                      <span>Pay NPR {booking.perShare?.toLocaleString()} with eSewa</span>
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-lime-600" />
                  Secured by eSewa Official Gateway & Turfio
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}