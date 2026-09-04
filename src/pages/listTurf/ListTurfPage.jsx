import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Building2,
  MapPin,
  Phone,
  Mail,
  Upload,
  ChevronDown,
  Check,
  Clock,
  TrendingUp,
  CalendarCheck,
  ShieldCheck,
  BarChart3,
  Headphones,
  Users,
  Sparkles,
  CheckCircle2,
  Car,
  Wifi,
  Coffee,
  Bath,
  Wind,
  Shirt,
  HeartPulse,
  Dumbbell,
  Calculator,
  HelpCircle,
  ChevronUp,
  FileText,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import MapPinPositioner from '../../components/common/MapPinPositioner';
import TimePickerDropdown from '../../components/common/TimePickerDropdown';

export default function ListTurfPage({ onLogin, user, onLogout, onHome, onFindTurfs }) {
  const [formData, setFormData] = useState({
    arenaName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    latitude: null,
    longitude: null,
    placeName: '',
    courtsCount: '2',
    priceRange: '1000-1500',
    turfDescription: '',
    amenities: ['Parking', 'WiFi'],
    operatingHours: {
      monday: { open: '06:00', close: '23:00', isClosed: false },
      tuesday: { open: '06:00', close: '23:00', isClosed: false },
      wednesday: { open: '06:00', close: '23:00', isClosed: false },
      thursday: { open: '06:00', close: '23:00', isClosed: false },
      friday: { open: '06:00', close: '23:00', isClosed: false },
      saturday: { open: '06:00', close: '23:00', isClosed: false },
      sunday: { open: '06:00', close: '23:00', isClosed: false },
    },
    documents: [],
    agreeTerms: false,
  });

  const [strikethroughPositions, setStrikethroughPositions] = useState({});
  const openRefs = useRef({});
  const closeRefs = useRef({});

  useEffect(() => {
    const calculateStrikethroughs = () => {
      const newPositions = {};
      Object.keys(formData.operatingHours).forEach((day) => {
        const dayData = formData.operatingHours[day];
        if (dayData.isClosed) {
          const openEl = openRefs.current[day];
          const closeEl = closeRefs.current[day];
          
          if (openEl && closeEl) {
            const openRect = openEl.getBoundingClientRect();
            const closeRect = closeEl.getBoundingClientRect();
            const containerRect = openEl.parentElement.getBoundingClientRect();
            
            // Calculate positions relative to container
            // Left strikethrough: 6% before start to end + 6%
            const openStart = openRect.left - containerRect.left - (openRect.width * 0.06); // -6% (6% before)
            const openEnd = openRect.right - containerRect.left + (openRect.width * 0.06); // +6%
            
            // Right strikethrough: 6% before start to end + 6%
            const closeStart = closeRect.left - containerRect.left - (closeRect.width * 0.06); // -6% (6% before)
            const closeEnd = closeRect.right - containerRect.left + (closeRect.width * 0.06); // +6%
            
            newPositions[day] = {
              left: { start: openStart, width: openEnd - openStart },
              right: { start: closeStart, width: closeEnd - closeStart }
            };
          }
        }
      });
      setStrikethroughPositions(newPositions);
    };

    calculateStrikethroughs();
    window.addEventListener('resize', calculateStrikethroughs);
    return () => window.removeEventListener('resize', calculateStrikethroughs);
  }, [formData.operatingHours]);

  const [activeFaq, setActiveFaq] = useState(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const amenitiesList = [
    { name: 'Parking', icon: Car },
    { name: 'WiFi', icon: Wifi },
    { name: 'Canteen', icon: Coffee },
    { name: 'Washrooms', icon: Bath },
    { name: 'AC', icon: Wind },
    { name: 'Changing Rooms', icon: Shirt },
    { name: 'First Aid', icon: HeartPulse },
    { name: 'Sports Equipment', icon: Dumbbell },
  ];

  const faqs = [
    {
      q: 'How much does it cost to list my arena on Turfio?',
      a: 'Listing your arena on Turfio is 100% free! We only charge a small performance commission on successful online bookings generated through our platform.',
    },
    {
      q: 'How long does the verification process take?',
      a: 'Our partner verification team reviews your documents within 24 hours. Once verified, your arena goes live immediately.',
    },
    {
      q: 'Can I still accept manual over-the-counter bookings?',
      a: 'Absolutely! Turfio provides an intuitive owner dashboard allowing you to block offline slots instantly so your schedule stays perfectly synced.',
    },
    {
      q: 'When and how do I get paid for bookings?',
      a: 'Payments are settled directly to your registered bank, eSewa, or Khalti account automatically within 24 hours of booking completion.',
    },
  ];

  const scrollToTop = () => {
    const formSection = document.querySelector('[data-form-section]');
    if (formSection) {
      const offset = 158; // Scroll 55% above the form (additional 5% increase)
      const elementPosition = formSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenityName) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityName)
        ? prev.amenities.filter((a) => a !== amenityName)
        : [...prev.amenities, amenityName],
    }));
  };

  const handleDocumentUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newDocuments = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        preview: URL.createObjectURL(file),
      }));
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newDocuments],
      }));
    }
  };

  const handleRemoveDocument = (docId) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== docId),
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar onLogin={onLogin} user={user} onLogout={onLogout} onHome={onHome} onFindTurfs={onFindTurfs} />

      {/* 1. Hero Section */}
      <section className="relative isolate overflow-hidden bg-white pt-20 md:pt-32 lg:pt-40 pb-6 md:pb-12 lg:pb-16">
        {/* Background Image */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.05]">
          <img
            src="/hero-image.png"
            alt="Hero Background"
            className="h-full w-full object-cover object-center grayscale"
          />
        </div>

        <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 -mt-16 lg:-mt-24">
              <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-4 py-1.5 text-xs font-extrabold text-slate-800 mb-6">
                <Building2 className="h-4 w-4 text-lime-600" />
                Grow Your Futsal Business
              </span>

              <h1 className="font-bebas text-[3.5rem] sm:text-[4.2rem] lg:text-[4rem] xl:text-[4.5rem] font-black uppercase leading-[0.92] tracking-[-0.04em] text-slate-900">
                List Your Turf
              </h1>
              <h2 className="font-bebas text-[3.5rem] sm:text-[4.2rem] lg:text-[4rem] xl:text-[4.5rem] font-black uppercase leading-[0.92] tracking-[-0.04em] text-lime-500 mb-6">
                On Turfio Today
              </h2>

              <div className="flex items-center gap-3 mb-6">
                <span className="h-1.5 w-14 rounded-full bg-lime-400" />
                <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
              </div>

              <p className="mt-7 max-w-md text-[17px] leading-[1.5] text-slate-500">
                Join 500+ successful arena owners across Nepal.
                <span className="block">Fill empty slot hours, automate bookings & scale revenue.</span>
              </p>

              <div className="mt-10 grid w-full grid-cols-1 gap-10 sm:grid-cols-2 max-w-xl">
                {[
                  { icon: MapPin, title: 'Reach More Players', text: 'Connect with thousands' },
                  { icon: Clock, title: 'Increase Bookings', text: 'Boost your revenue' },
                  { icon: Building2, title: 'Easy Management', text: 'Simple dashboard' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className={`flex min-w-0 items-start gap-3 max-w-[200px] ${idx === 2 ? 'sm:col-span-2 sm:w-1/2' : 'pr-0'}`}>
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lime-500">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="whitespace-nowrap text-[14px] font-semibold text-slate-900">{item.title}</p>
                        <p className="whitespace-nowrap text-[13px] leading-tight text-slate-400">{item.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Tablet Mockup */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end h-full items-start pt-12">
              <div className="relative w-full h-full" style={{ transform: 'translateY(20px) translateX(0px)' }}>
                {/* Blob Gradient Background */}
                <div className="absolute -inset-20 -top-96 -left-96 bg-gradient-to-br from-lime-400/15 via-lime-300/10 to-transparent rounded-full blur-3xl -z-10" style={{ borderRadius: '63% 37% 54% 46% / 55% 48% 52% 45%' }}></div>
                
                <img
                  src="/tablet-mockup.png"
                  alt="Turfio Arena Owner Dashboard Mockup"
                  className="w-full h-full object-cover drop-shadow-xl lg:scale-175 rounded-lg"
                />
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* 3. Main Registration Form & How It Works Column */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-6 md:px-14 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} data-form-section className="space-y-6">
                {/* Step 1: Arena Details */}
                {formStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 mb-3">
                        <Building2 className="h-3.5 w-3.5 text-lime-600" />
                        Application Form
                      </span>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Arena Details
                      </h2>
                      <p className="text-slate-500 text-sm font-medium mt-1">
                        Fill out your arena information below to submit your partnership request.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      Arena Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Hattiban Futsal Arena"
                      value={formData.arenaName}
                      onChange={(e) => handleInputChange('arenaName', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Row 2: Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      Email Address *
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      Phone Number *
                    </label>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="tel"
                        placeholder="+977 98XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Row 3: Address & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      Full Address *
                    </label>
                    <div className="relative flex items-center">
                      <MapPin className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Street address, Landmark"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      City / Region *
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select your city</option>
                        <option value="Kathmandu">Kathmandu</option>
                        <option value="Lalitpur">Lalitpur</option>
                        <option value="Bhaktapur">Bhaktapur</option>
                        <option value="Pokhara">Pokhara</option>
                        <option value="Chitwan">Chitwan</option>
                        <option value="Butwal">Butwal</option>
                      </select>
                      <ChevronDown className="absolute right-4 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Map Pin Location Section */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                    Map Location *
                  </label>
                  <div className="bg-slate-50 rounded-2xl p-5">
                    {formData.latitude && formData.longitude ? (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {formData.placeName && (
                            <p className="text-sm font-extrabold text-slate-900 truncate">
                              {formData.placeName}
                            </p>
                          )}
                          <p className="text-xs text-slate-400 font-semibold mt-1.5 font-mono">
                            {Number(formData.latitude).toFixed(6)}, {Number(formData.longitude).toFixed(6)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsMapOpen(true)}
                          className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                        >
                          Change Pin Location
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-xs text-slate-500 font-medium mb-3">
                          Please pin the exact entrance location of your turf on the map.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsMapOpen(true)}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <MapPin className="h-4 w-4 text-lime-400" />
                          <span>Select Location on Map</span>
                        </button>
                      </div>
                    )}
                    {/* Native validation hidden fields */}
                    <input type="text" className="sr-only h-0 w-0 pointer-events-none" value={formData.latitude || ''} onChange={() => {}} required title="Please select a location on the map" />
                  </div>
                </div>

                {/* Row 4: Courts & Price Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      Number of Courts *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.courtsCount}
                      onChange={(e) => handleInputChange('courtsCount', e.target.value)}
                      className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold placeholder:text-slate-400 placeholder:font-medium focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 tracking-wide mb-2">
                      Price Range (per hour) *
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={formData.priceRange}
                        onChange={(e) => handleInputChange('priceRange', e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-lime-400 outline-none transition-all appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select price range</option>
                        <option value="0-500">Rs. 500 - 1,000</option>
                        <option value="1000-1500">Rs. 1,000 - 1,500</option>
                        <option value="1500-2000">Rs. 1,500 - 2,000</option>
                        <option value="2000+">Rs. 2,000+</option>
                      </select>
                      <ChevronDown className="absolute right-4 h-4 w-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Amenities Toggle Grid */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 tracking-wide mb-3">
                    Amenities Available
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {amenitiesList.map((item) => {
                      const Icon = item.icon;
                      const isSelected = formData.amenities.includes(item.name);
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => handleAmenityToggle(item.name)}
                          className={`px-3.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isSelected
                              ? 'bg-lime-400 text-slate-900 scale-[1.02]'
                              : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-4 w-4 shrink-0 stroke-[3]" />
                          ) : (
                            <Icon className="h-4 w-4 shrink-0 text-slate-400" />
                          )}
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFormStep(2);
                      scrollToTop();
                    }}
                    className="px-8 py-3.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                  </div>
                )}

                {/* Step 2: Operating Hours */}
                {formStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 mb-3">
                        <Clock className="h-3.5 w-3.5 text-lime-600" />
                        Step 2 of 3
                      </span>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Operating Hours
                      </h2>
                      <p className="text-slate-500 text-sm font-medium mt-1">
                        Set your operating hours for each day of the week.
                      </p>
                    </div>

                      {/* Operating Hours Grid */}
                      <div className="space-y-3">
                        {Object.keys(formData.operatingHours).map((day) => {
                          const dayData = formData.operatingHours[day];
                          const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
                          return (
                            <div key={day} className="flex items-center gap-6">
                              <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                  dayData.isClosed 
                                    ? 'bg-lime-400 border-lime-400 opacity-60' 
                                    : 'bg-lime-400 border-lime-400'
                                }`}>
                                  {dayData.isClosed ? (
                                    <div className="w-2 h-0.5 bg-slate-900"></div>
                                  ) : (
                                    <Check className="w-3 h-3 text-slate-900 stroke-[3]" />
                                  )}
                                </div>
                                <input
                                  type="checkbox"
                                  checked={dayData.isClosed}
                                  onChange={(e) =>
                                    handleOperatingHoursChange(day, 'isClosed', e.target.checked)
                                  }
                                  className="hidden"
                                />
                                <span className="text-xs font-semibold text-slate-600">{dayData.isClosed ? 'Closed' : 'Opened'}</span>
                              </label>

                              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between gap-3 flex-1">
                                <div className="min-w-0 flex-1">
                                  <label className="text-sm font-bold text-slate-900">
                                    {dayLabel}
                                  </label>
                                </div>
                                
                                <div className={`flex items-center gap-1.5 relative ${dayData.isClosed ? 'opacity-50' : ''}`}>
                                  <div ref={(el) => { openRefs.current[day] = el; }}>
                                    <TimePickerDropdown
                                      value={dayData.open}
                                      onChange={(time) =>
                                        handleOperatingHoursChange(day, 'open', time)
                                      }
                                      disabled={dayData.isClosed}
                                    />
                                  </div>
                                  
                                  <span className="text-xs font-semibold text-slate-400 px-2">to</span>
                                  
                                  <div ref={(el) => { closeRefs.current[day] = el; }}>
                                    <TimePickerDropdown
                                      value={dayData.close}
                                      onChange={(time) =>
                                        handleOperatingHoursChange(day, 'close', time)
                                      }
                                      disabled={dayData.isClosed}
                                    />
                                  </div>
                                  
                                  {dayData.isClosed && strikethroughPositions[day] && (
                                    <>
                                      {/* Left strikethrough: opening hours + 6% back */}
                                      <div 
                                        className="absolute top-1/2 h-0.5 pointer-events-none z-10" 
                                        style={{ 
                                          backgroundColor: '#000000',
                                          left: `${strikethroughPositions[day].left.start}px`,
                                          width: `${strikethroughPositions[day].left.width}px`,
                                          transform: 'translateY(-50%)' 
                                        }}
                                      ></div>
                                      {/* Right strikethrough: 6% before closing to end + 6% behind */}
                                      <div 
                                        className="absolute top-1/2 h-0.5 pointer-events-none z-10" 
                                        style={{ 
                                          backgroundColor: '#000000',
                                          left: `${strikethroughPositions[day].right.start}px`,
                                          width: `${strikethroughPositions[day].right.width}px`,
                                          transform: 'translateY(-50%)' 
                                        }}
                                      ></div>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setFormStep(1);
                          scrollToTop();
                        }}
                        className="px-8 py-3.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold transition-all cursor-pointer active:scale-[0.99]"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormStep(3);
                          scrollToTop();
                        }}
                        className="px-8 py-3.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Document Upload */}
                {formStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 mb-3">
                        <Upload className="h-3.5 w-3.5 text-lime-600" />
                        Step 3 of 3
                      </span>
                      <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        Government Documents
                      </h2>
                      <p className="text-slate-500 text-sm font-medium mt-1">
                        Upload your Company/Firm Registration Certificate (दर्ता प्रमाणपत्र) and PAN Certificate.
                      </p>
                    </div>

                      {/* Required Documents Info - Individual Cards */}
                      <div className="space-y-3 mb-6">
                        <div className="bg-blue-50 rounded-2xl p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 flex-none">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-900 mb-1">
                                Company/Firm Registration Certificate
                              </p>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                दर्ता प्रमाणपत्र - Issued by the Office of Company Registrar (OCR). Shows your legal registration number and company details.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 rounded-2xl p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 flex-none">
                              <Building2 className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-slate-900 mb-1">
                                PAN Certificate (Permanent Account Number)
                              </p>
                              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                Issued by the Inland Revenue Department (IRD). Confirms your tax registration status.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Document Upload Zone */}
                      <div className="space-y-3">
                        {/* Upload Input */}
                        <label className="rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 p-6 text-center hover:border-lime-400 hover:bg-lime-50/20 transition-all cursor-pointer group block">
                          <div className="w-10 h-10 rounded-full bg-white group-hover:bg-lime-100 text-slate-500 group-hover:text-lime-600 flex items-center justify-center mx-auto mb-2 transition-colors shadow-xs">
                            <Upload className="h-5 w-5" />
                          </div>
                          <p className="text-xs font-extrabold text-slate-900">Click to upload files</p>
                          <p className="text-[11px] text-slate-400 font-medium mt-0.5">or drag & drop (PDF, JPG, PNG)</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleDocumentUpload}
                            className="hidden"
                          />
                        </label>

                        {/* Uploaded Documents List */}
                        {formData.documents.length > 0 && (
                          <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                            {formData.documents.map((doc) => (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between bg-white rounded-xl p-3 border border-slate-100"
                              >
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                    {doc.type.includes('pdf') ? (
                                      <span className="text-xs font-bold text-red-600">PDF</span>
                                    ) : (
                                      <span className="text-xs font-bold text-blue-600">IMG</span>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-semibold text-slate-900 truncate">{doc.name}</p>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                      {(doc.size / 1024).toFixed(2)} KB
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDocument(doc.id)}
                                  className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-colors shrink-0"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start gap-3 pt-4">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={formData.agreeTerms}
                        onChange={(e) => handleInputChange('agreeTerms', e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-lime-500 cursor-pointer"
                        required
                      />
                      <label htmlFor="terms" className="text-xs font-medium text-slate-500 leading-relaxed cursor-pointer select-none">
                        I agree to Turfio's <a href="#" className="text-slate-900 font-bold hover:underline">Terms of Service</a> and acknowledge the <a href="#" className="text-slate-900 font-bold hover:underline">Privacy Policy</a>.
                      </label>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 justify-between pt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setFormStep(2);
                          scrollToTop();
                        }}
                        className="px-8 py-3.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-bold transition-all cursor-pointer active:scale-[0.99]"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-3.5 rounded-full bg-lime-400 hover:bg-lime-500 text-slate-900 text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                      >
                        <span>Submit Application</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: How Verification Works & Partner FAQs */}
            <div className="lg:col-span-5 space-y-10">
              
              {/* How Verification Works Steps */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 mb-3">
                  <CheckCircle2 className="h-3.5 w-3.5 text-lime-600" />
                  Simple 3-Step Process
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
                  How Onboarding Works
                </h3>

                <div className="space-y-3">
                  {[
                    {
                      step: '1',
                      title: 'Submit Application',
                      desc: 'Fill out the simple arena form with your court specifications and contact info.',
                    },
                    {
                      step: '2',
                      title: 'Fast 24h Verification',
                      desc: 'Our team verifies your venue details and sets up your arena owner dashboard.',
                    },
                    {
                      step: '3',
                      title: 'Go Live & Accept Bookings',
                      desc: 'Your arena becomes visible to 100k+ players. Receive instant automated bookings.',
                    },
                  ].map((st) => (
                    <div key={st.step} className="flex items-start gap-4 relative pb-8 last:pb-0">
                      {st.step !== '3' && (
                        <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-slate-100/80 -translate-x-1/2" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-sm shrink-0 shadow-xs relative z-10">
                        {st.step}
                      </div>
                      <div className="pt-2">
                        <h4 className="font-extrabold text-slate-900 text-sm">{st.title}</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{st.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Testimonial Card */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed italic mb-4">
                  "Since listing on Turfio, our off-peak afternoon slots are almost always filled. The automated payment system saves us hours of manual math every week."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-lime-400 text-slate-900 font-extrabold flex items-center justify-center text-xs">
                    HS
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">Hattiban Sports Arena</p>
                    <p className="text-[11px] text-slate-500 font-medium">Lalitpur, Nepal</p>
                  </div>
                </div>
              </div>

              {/* FAQs Accordion */}
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
                  Partner FAQs
                </h3>
                <div className="space-y-3">
                  {faqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden bg-white">
                        <button
                          type="button"
                          onClick={() => setActiveFaq(isOpen ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 cursor-pointer hover:bg-slate-50 transition-colors"
                        >
                          <span>{faq.q}</span>
                          {isOpen ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-2">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Map Pin Positioner Modal */}
      {isMapOpen && (
        <MapPinPositioner
          initialPosition={{
            lat: formData.latitude || 27.7172,
            lng: formData.longitude || 85.3240,
          }}
          turfName={formData.arenaName}
          onCancel={() => setIsMapOpen(false)}
          onLocationConfirmed={(coords) => {
            handleInputChange('latitude', coords.lat);
            handleInputChange('longitude', coords.lng);
            handleInputChange('placeName', coords.placeName);
            setIsMapOpen(false);
          }}
        />
      )}
    </div>
  );
}
