import { useState } from 'react';
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
  ParkingCircle,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function BookingCheckoutPage({ onLogin, user, onLogout, onHome }) {
  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState({
    playingType: 'team',
    teamName: '',
    expectedPlayers: 10,
    paymentType: 'full',
    fullName: '',
    phone: '',
    email: '',
  });

  const [copiedLink, setCopiedLink] = useState(false);
  const MAX_PLAYERS = 14;

  const bookingData = {
    turf: 'Great Himalayan Futsal',
    type: 'Indoor',
    size: '7v7',
    parking: 'Parking',
    location: 'Hattiban, Lalitpur',
    date: 'Thu, 15 May 2082',
    time: '09:00 AM - 10:00 AM',
    duration: '1 hr',
    price: 800,
    tax: 80,
    total: 880,
  };

  const paymentMethods = [
    {
      id: 'full',
      label: 'Pay Full Amount',
      description: 'Pay the total amount by yourself',
      icon: Wallet,
      available: true,
    },
    {
      id: 'split',
      label: 'Split Payment',
      description: 'Split the total amount with your teammates',
      icon: Users,
      available: true,
    },
    {
      id: 'venue',
      label: 'Pay at Turf',
      description: 'Pay at the venue before or after your game.',
      icon: Banknote,
      available: false,
    },
  ];

  const yourShare = bookingData.total / 2;
  const remaining = bookingData.total - yourShare;

  const steps = [
    { id: 1, title: 'Select Time', subtitle: 'Choose your slot' },
    { id: 2, title: 'Add Details', subtitle: "Who's playing?" },
    { id: 3, title: 'Review & Pay', subtitle: 'Confirm & pay' },
    { id: 4, title: 'Booking Confirmed', subtitle: "You're all set!" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopyLink = () => {
    const link = 'https://turfio.com/pay/abc123xyz';
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans pb-24">
      {/* Navbar */}
      <Navbar onLogin={onLogin} user={user} onLogout={onLogout} onHome={onHome} />

      {/* Progress Stepper Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between gap-3 mb-6">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 flex-1">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm transition-all shrink-0 ${
                    currentStep > step.id
                      ? 'bg-lime-500 text-white'
                      : currentStep === step.id
                      ? 'bg-lime-500 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle2 size={20} /> : step.id}
                </div>
                {step.id < 4 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all ${
                      currentStep > step.id ? 'bg-lime-500' : 'bg-slate-100'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="grid grid-cols-4 gap-3 text-center">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-xs font-bold ${currentStep >= step.id ? 'text-slate-900' : 'text-slate-400'}`}
              >
                <span className="block">{step.title}</span>
                <span className="text-[11px] text-slate-500">{step.subtitle}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time Slot Reservation Timer */}
        <div className="bg-lime-50 border-t border-lime-100 px-6 md:px-8 lg:px-10 py-3 flex items-center gap-3 text-sm">
          <div className="h-7 w-7 rounded-full bg-white flex items-center justify-center shrink-0">
            <Clock size={14} className="text-lime-600" />
          </div>
          <span className="text-lime-800 font-bold">Your slot is reserved for 09:45 minutes</span>
          <span className="ml-auto text-lime-700 font-semibold hidden sm:inline">
            Complete your booking to confirm your reservation.
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-2 space-y-6">
            {currentStep === 2 && (
              <>
                {/* Combined: Who's Playing + Payment Type */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">1. Who's Playing?</h2>

                  {/* Playing Type Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'team', icon: Users, label: 'Team / Group' },
                      { id: 'individual', icon: User, label: 'Individual' },
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleInputChange('playingType', type.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 transition-all ${
                            formData.playingType === type.id
                              ? 'border-lime-500 bg-lime-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <Icon
                            size={20}
                            className={formData.playingType === type.id ? 'text-lime-600' : 'text-slate-500'}
                          />
                          <span className="font-bold text-slate-900">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Team Name + Expected Players */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.playingType === 'team' && (
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                          Team / Group Name <span className="text-slate-400 font-medium">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="E.g. Lalitpur FC"
                          value={formData.teamName}
                          onChange={(e) => handleInputChange('teamName', e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Expected Players</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            handleInputChange('expectedPlayers', Math.max(1, formData.expectedPlayers - 1))
                          }
                          className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-900 transition-all"
                        >
                          −
                        </button>
                        <span className="text-xl font-black text-slate-900 min-w-[40px] text-center">
                          {formData.expectedPlayers}
                        </span>
                        <button
                          onClick={() =>
                            handleInputChange(
                              'expectedPlayers',
                              Math.min(MAX_PLAYERS, formData.expectedPlayers + 1)
                            )
                          }
                          className="h-11 w-11 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-900 transition-all"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-2">
                        Maximum {MAX_PLAYERS} players allowed
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100" />

                  {/* Payment Type */}
                  <h2 className="text-xl font-black text-slate-900">Payment Type</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const selected = formData.paymentType === method.id;
                      return (
                        <button
                          key={method.id}
                          disabled={!method.available}
                          onClick={() => method.available && handleInputChange('paymentType', method.id)}
                          className={`relative text-left p-4 rounded-2xl border-2 transition-all ${
                            !method.available
                              ? 'border-slate-100 bg-slate-50 opacity-70 cursor-not-allowed'
                              : selected
                              ? 'border-lime-500 bg-lime-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          {!method.available && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              Not available
                            </span>
                          )}
                          {method.available && selected && (
                            <CheckCircle2
                              size={18}
                              className="absolute top-3 right-3 text-lime-600 fill-lime-100"
                            />
                          )}
                          <Icon
                            size={20}
                            className={`mb-3 ${selected ? 'text-lime-600' : 'text-slate-500'}`}
                          />
                          <div className="font-bold text-slate-900 text-sm">{method.label}</div>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">
                            {method.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Payment Breakdown */}
                  {formData.paymentType === 'split' ? (
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-bold text-slate-900">Split Payment</div>
                          <p className="text-xs text-slate-500 font-medium">
                            You pay a part, others pay their share.
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-[11px] text-slate-500 font-semibold">Total Amount</div>
                          <div className="font-black text-lime-600">NPR {bookingData.total}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl border border-slate-100 p-3">
                          <p className="text-xs text-slate-500 font-semibold">Your Share</p>
                          <p className="text-[11px] text-slate-400 font-medium mb-1">
                            The amount you will pay now.
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900">NPR {yourShare}</span>
                            <span className="text-[11px] text-slate-400 font-semibold">50% of total</span>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-100 p-3">
                          <p className="text-xs text-slate-500 font-semibold">Remaining to Collect</p>
                          <p className="text-[11px] text-slate-400 font-medium mb-1">
                            Share link with your teammates to collect.
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900">NPR {remaining}</span>
                            <span className="text-[11px] text-slate-400 font-semibold">50% of total</span>
                          </div>
                        </div>
                      </div>

                      {/* Share Payment Link */}
                      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3">
                        <div>
                          <div className="text-sm font-bold text-slate-900">Share Payment Link</div>
                          <p className="text-xs text-slate-500 font-medium">
                            Share this link with your teammates to collect their payments.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch gap-2">
                          <div className="flex-1 flex items-center bg-white rounded-xl px-3 py-3 border border-blue-100">
                            <span className="text-sm font-mono text-slate-600 flex-1 truncate">
                              https://turfio.com/pay/abc123xyz
                            </span>
                          </div>
                          <button
                            onClick={handleCopyLink}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border font-bold text-sm transition-all ${
                              copiedLink
                                ? 'bg-lime-100 text-lime-700 border-lime-200'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <Copy size={16} />
                            {copiedLink ? 'Copied' : 'Copy Link'}
                          </button>
                          <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold text-sm transition-all">
                            <MessageCircle size={16} />
                            Share on WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-600">Amount to pay now</span>
                      <span className="font-black text-lime-600">NPR {bookingData.total}</span>
                    </div>
                  )}
                </div>

                {/* Contact Person */}
                <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">2. Contact Person</h2>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                      We'll use this to send your booking details and updates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number *</label>
                      <div className="flex items-center gap-2">
                        <select className="px-3 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-lime-400">
                          <option>🇳🇵 +977</option>
                        </select>
                        <input
                          type="tel"
                          placeholder="98XXXXXXXX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="flex-1 min-w-0 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Email <span className="text-slate-400 font-medium">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Step 1 / 3 / 4 placeholders — not part of this screen's design spec */}
            {currentStep === 1 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Select Time</h2>
                <p className="text-slate-500 text-sm font-medium">Slot selection happens here.</p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-8">
                <h2 className="text-2xl font-black text-slate-900 mb-2">Review & Pay</h2>
                <p className="text-slate-500 text-sm font-medium">Final review and payment happens here.</p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-lime-100 flex items-center justify-center">
                    <CheckCircle2 size={32} className="text-lime-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Your reservation has been successfully confirmed.
                  </p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-semibold">Booking ID</span>
                    <span className="text-sm font-bold text-slate-900">BK-#12345</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-semibold">Confirmation Code</span>
                    <span className="text-sm font-bold text-slate-900">ABC123XYZ</span>
                  </div>
                </div>
                <div className="flex gap-3 pt-6 border-t border-slate-100">
                  <button className="flex-1 px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-all">
                    Download Invoice
                  </button>
                  <button className="flex-1 px-6 py-3 rounded-full bg-lime-500 hover:bg-lime-600 text-white font-bold transition-all">
                    View Booking Details
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking Summary */}
          <div className="lg:col-span-1">
            <p className="text-sm font-black text-slate-900 mb-3">Booking Summary</p>
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden sticky top-40 shadow-lg">
              {/* Summary Header Image */}
              <div className="relative h-28 bg-slate-200">
                <img
                  src="/turf-sample.png"
                  alt={bookingData.turf}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Summary Content */}
              <div className="p-6 space-y-5">
                {/* Turf Info */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-lg text-slate-900">{bookingData.turf}</h3>
                    <button className="shrink-0 text-xs font-bold text-lime-600 border border-lime-200 rounded-full px-3 py-1.5 hover:bg-lime-50 transition-all">
                      View Details
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-1">
                    <span>{bookingData.type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {bookingData.size}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ParkingCircle size={12} /> {bookingData.parking}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mt-2">
                    <MapPin size={14} />
                    {bookingData.location}
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Date & Time */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar size={14} className="text-slate-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Date</p>
                      <p className="font-bold text-slate-900">{bookingData.date}</p>
                    </div>
                    <button className="ml-auto text-lime-600 hover:text-lime-700 text-xs font-bold shrink-0">
                      Change
                    </button>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={14} className="text-slate-400 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs text-slate-500 font-semibold">Time</p>
                      <p className="font-bold text-slate-900">
                        {bookingData.time} <span className="text-slate-400 font-medium">({bookingData.duration})</span>
                      </p>
                    </div>
                    <button className="ml-auto text-lime-600 hover:text-lime-700 text-xs font-bold shrink-0">
                      Change
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-100" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-semibold">Price ({bookingData.duration})</span>
                    <span className="font-bold text-slate-900">NPR {bookingData.price}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600 font-semibold flex items-center gap-1">
                      Taxes &amp; Fees <Info size={12} className="text-slate-400" />
                    </span>
                    <span className="font-bold text-slate-900">NPR {bookingData.tax}</span>
                  </div>
                  <div className="flex justify-between items-center text-base border-t border-slate-100 pt-2">
                    <span className="font-black text-slate-900">Total Amount</span>
                    <span className="font-black text-lime-600">NPR {bookingData.total}</span>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="bg-lime-50 rounded-2xl p-4 space-y-2.5">
                  {[
                    { icon: Zap, text: 'Free cancellation up to 2 hours before booking' },
                    { icon: CheckCircle2, text: 'Instant booking confirmation' },
                    { icon: FileText, text: 'No hidden charges' },
                    { icon: Shield, text: 'Secure payment' },
                    { icon: Headphones, text: '24/7 customer support' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Icon size={15} className="text-lime-600 mt-0.5 shrink-0" />
                        <span className="text-xs text-slate-600 font-semibold leading-tight">{item.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Section */}
                <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-semibold">Have a coupon code?</span>
                  <button className="ml-auto text-lime-600 hover:text-lime-700 text-xs font-bold">Apply</button>
                </div>

                {/* Not Charged Yet */}
                <p className="text-xs text-slate-500 font-medium text-center flex items-center justify-center gap-1.5">
                  <Lock size={12} />
                  You won't be charged yet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-4 flex items-center gap-3">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={18} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="ml-auto flex items-center gap-2 px-8 py-3.5 rounded-full bg-lime-500 hover:bg-lime-600 text-white font-bold transition-all"
          >
            {currentStep === 2 ? 'Review & Continue to Payment' : 'Continue'}
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}