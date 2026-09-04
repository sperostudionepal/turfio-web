import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  CreditCard,
  Calendar,
  Shield,
  Save,
  RotateCcw,
  QrCode,
  MapPin,
  Building2,
  CheckCircle2,
  Lock,
  Globe,
  Smartphone,
  Mail,
  Clock,
  Key,
  Database,
  Sliders,
  DollarSign
} from 'lucide-react';

function SettingsPage({ activeTab, setActiveTab }) {
  const [activeSection, setActiveSection] = useState('General');
  const [showToast, setShowToast] = useState(false);

  // 1. General & Venue Details State
  const [arenaName, setArenaName] = useState('Kathmandu Futsal Arena');
  const [arenaTagline, setArenaTagline] = useState('Premier 5v5 Synthetic Turf in Kathmandu');
  const [email, setEmail] = useState('contact@ktmfutsal.com.np');
  const [phone, setPhone] = useState('+977 9841-234567');
  const [altPhone, setAltPhone] = useState('+977 01-4234567');
  const [timezone, setTimezone] = useState('(GMT+05:45) Kathmandu, Nepal');
  const [currency, setCurrency] = useState('NPR (Nepalese Rupee - NRs.)');
  const [panNumber, setPanNumber] = useState('609823415');

  // Business Address State
  const [address, setAddress] = useState('Ring Road, Kalanki (Near Bhatbhateni Supermarket)');
  const [city, setCity] = useState('Kathmandu');
  const [stateProvince, setStateProvince] = useState('Bagmati Province');
  const [zipCode, setZipCode] = useState('44600');
  const [mapsUrl, setMapsUrl] = useState('https://maps.google.com/?q=Kathmandu+Futsal+Arena');

  // 2. Payments & eSewa State
  const [esewaId, setEsewaId] = useState('9841234567');
  const [esewaName, setEsewaName] = useState('Kathmandu Futsal Arena');
  const [khaltiId, setKhaltiId] = useState('9841234567');
  const [bankName, setBankName] = useState('Nabil Bank Ltd.');
  const [bankAccount, setBankAccount] = useState('01901017500123');
  const [accountHolder, setAccountHolder] = useState('Kathmandu Futsal Arena Pvt. Ltd.');
  const [advancePercent, setAdvancePercent] = useState('50%');

  // 3. Notifications & SMS Gateway State
  const [smsGateway, setSmsGateway] = useState('Sparrow SMS Nepal');
  const [smsToken, setSmsToken] = useState('sparrow_v2_live_token_889234');
  const [autoSmsBooking, setAutoSmsBooking] = useState(true);
  const [autoSmsReminder, setAutoSmsReminder] = useState(true);
  const [dailyReportEmail, setDailyReportEmail] = useState(true);
  const [reportRecipient, setReportRecipient] = useState('owner@ktmfutsal.com.np');

  // 4. Booking & Slot Rules State
  const [openTime, setOpenTime] = useState('06:00 AM');
  const [closeTime, setCloseTime] = useState('10:00 PM');
  const [slotDuration, setSlotDuration] = useState('60 Minutes');
  const [cancellationWindow, setCancellationWindow] = useState('4 Hours Prior');
  const [gracePeriod, setGracePeriod] = useState('10 Minutes');

  // 5. Security & Access Control State
  const [managerPin, setManagerPin] = useState('4412');
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30 Minutes');

  const navigationItems = [
    { id: 'General', label: 'Venue Profile', description: 'Turf details, PAN & location', icon: Building2 },
    { id: 'Payments', label: 'eSewa & Bank Pay', description: 'eSewa QR & counter accounts', icon: QrCode },
    { id: 'Notifications', label: 'SMS & Alerts', description: 'Sparrow SMS & email reports', icon: Bell },
    { id: 'Booking', label: 'Slot Rules', description: 'Operating hours & buffer rules', icon: Calendar },
    { id: 'Security', label: 'Security & PIN', description: 'Counter PIN & manager access', icon: Shield },
  ];

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <TopBar />

      {/* Save Success Toast */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl animate-in slide-in-from-top-4 duration-200 border border-slate-800 text-xs font-bold">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>Arena settings saved successfully!</span>
        </div>
      )}

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Soft Ambient Background Orbs */}
        <div className="absolute top-[45%] right-[35%] w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[160px] pointer-events-none" />

        {/* Floating Left Glass Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Floating Right Main Glass Container */}
        <div className="flex-1 flex flex-col min-w-0 backdrop-blur-md overflow-hidden relative z-10">
          {/* Scrollable Main Area */}
          <main className="flex-1 overflow-y-auto space-y-4 scrollbar-thin p-4">
            {/* Header Action Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Arena Venue Settings</span>
                  <SettingsIcon size={20} className="text-emerald-600" />
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                  Manage your futsal venue profile, eSewa digital wallet QR, SMS gateway, and counter security.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                >
                  <Save size={14} />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>

            {/* 2-Column Settings Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Navigation Sub-menu */}
              <div className="lg:col-span-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-3 space-y-2 shadow-xs">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-2xs'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`shrink-0 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold leading-tight">{item.label}</h4>
                        <p className={`text-xs font-medium leading-tight mt-0.5 ${
                          isActive ? 'text-emerald-700/80' : 'text-slate-400'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Main Settings Form Area */}
              <div className="lg:col-span-8 space-y-5">
                {/* 1. Venue Profile & Address Tab */}
                {activeSection === 'General' && (
                  <div className="space-y-5">
                    {/* Basic Info Card */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 space-y-5 shadow-xs">
                      <div className="border-b border-slate-100/80 pb-3.5">
                        <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          <Building2 size={20} className="text-emerald-600" />
                          <span>Venue Identity & Contact Information</span>
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                          Official arena details visible on customer receipts and booking apps.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Futsal Arena Name</label>
                          <input
                            type="text"
                            value={arenaName}
                            onChange={(e) => setArenaName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Arena Tagline</label>
                          <input
                            type="text"
                            value={arenaTagline}
                            onChange={(e) => setArenaTagline(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Primary Email Address</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">PAN / VAT Registration Number</label>
                          <input
                            type="text"
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Counter Front Desk Phone</label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Landline / Alternative Contact</label>
                          <input
                            type="text"
                            value={altPhone}
                            onChange={(e) => setAltPhone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Operating Timezone</label>
                          <select
                            value={timezone}
                            onChange={(e) => setTimezone(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          >
                            <option>(GMT+05:45) Kathmandu, Nepal</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Billing Currency</label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          >
                            <option>NPR (Nepalese Rupee - NRs.)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Location & Address Card */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 space-y-4 shadow-xs">
                      <div className="border-b border-slate-100/80 pb-3.5">
                        <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          <MapPin size={20} className="text-emerald-600" />
                          <span>Venue Physical Address & Navigation</span>
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                          Location information provided to players for directions and mapping.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                        <div className="md:col-span-2">
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Street Address & Landmark</label>
                          <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">City</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">State / Province</label>
                          <input
                            type="text"
                            value={stateProvince}
                            onChange={(e) => setStateProvince(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Google Maps Link</label>
                          <input
                            type="text"
                            value={mapsUrl}
                            onChange={(e) => setMapsUrl(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Payments & eSewa Tab */}
                {activeSection === 'Payments' && (
                  <div className="space-y-5">
                    {/* Digital Wallets Card */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 space-y-5 shadow-xs">
                      <div className="border-b border-slate-100/80 pb-3.5">
                        <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          <QrCode size={20} className="text-emerald-600" />
                          <span>Digital Wallet & QR Payment Merchant Accounts</span>
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                          Set up eSewa & Khalti QR codes for counter scanning and online advance deposits.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* eSewa Setup */}
                        <div className="bg-emerald-50/60 border border-emerald-100 p-4.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-emerald-900 text-sm md:text-base">eSewa Digital Pay</span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white">ACTIVE</span>
                          </div>
                          <div>
                            <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">eSewa Merchant Phone / ID</label>
                            <input
                              type="text"
                              value={esewaId}
                              onChange={(e) => setEsewaId(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Registered Merchant Name</label>
                            <input
                              type="text"
                              value={esewaName}
                              onChange={(e) => setEsewaName(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none"
                            />
                          </div>
                          <p className="text-xs text-slate-500 leading-tight">
                            Scanned QR payments automatically reflect in the counter booking ledger.
                          </p>
                        </div>

                        {/* Khalti Setup */}
                        <div className="bg-purple-50/60 border border-purple-100 p-4.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-purple-900 text-sm md:text-base">Khalti Pay</span>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-600 text-white">ACTIVE</span>
                          </div>
                          <div>
                            <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Khalti Merchant Phone / ID</label>
                            <input
                              type="text"
                              value={khaltiId}
                              onChange={(e) => setKhaltiId(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Required Advance Deposit %</label>
                            <select
                              value={advancePercent}
                              onChange={(e) => setAdvancePercent(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none"
                            >
                              <option>25% Advance</option>
                              <option>50% Advance</option>
                              <option>100% Full Payment</option>
                            </select>
                          </div>
                          <p className="text-xs text-slate-500 leading-tight">
                            Enforces advance deposit percentage before locking scheduled pitch slots.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bank Settlement Account Card */}
                    <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 space-y-4 shadow-xs">
                      <div className="border-b border-slate-100/80 pb-3.5">
                        <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                          <CreditCard size={20} className="text-emerald-600" />
                          <span>Direct Bank Settlement Account</span>
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                          Bank account used for daily settlement sweeps and corporate invoicing.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Bank Name</label>
                          <input
                            type="text"
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Account Number</label>
                          <input
                            type="text"
                            value={bankAccount}
                            onChange={(e) => setBankAccount(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-bold focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Account Holder Name</label>
                          <input
                            type="text"
                            value={accountHolder}
                            onChange={(e) => setAccountHolder(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Notifications & SMS Gateway Tab */}
                {activeSection === 'Notifications' && (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 space-y-5 shadow-xs">
                    <div className="border-b border-slate-100/80 pb-3.5">
                      <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Bell size={20} className="text-emerald-600" />
                        <span>SMS Gateway & Automated Notifications</span>
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                        Configure Nepal SMS provider integration and owner email reports.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">SMS Provider Service</label>
                        <select
                          value={smsGateway}
                          onChange={(e) => setSmsGateway(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none"
                        >
                          <option>Sparrow SMS Nepal</option>
                          <option>Aakash SMS Nepal</option>
                          <option>Twilio International</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">API Token Key</label>
                        <input
                          type="password"
                          value={smsToken}
                          onChange={(e) => setSmsToken(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3.5 pt-2">
                      <h3 className="font-extrabold text-slate-900 text-xs md:text-sm uppercase tracking-wider text-slate-400">Trigger Automations</h3>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/80 border border-slate-200">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Instant Booking Confirmation SMS</h4>
                          <p className="text-xs text-slate-500">Sends instant SMS with match code to player phone on booking.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoSmsBooking}
                          onChange={(e) => setAutoSmsBooking(e.target.checked)}
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/80 border border-slate-200">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Slot Match Reminder (1 Hour Prior)</h4>
                          <p className="text-xs text-slate-500">Sends reminder SMS to players 60 minutes before kickoff.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoSmsReminder}
                          onChange={(e) => setAutoSmsReminder(e.target.checked)}
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/80 border border-slate-200">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Daily Counter Closing Financial Report</h4>
                          <p className="text-xs text-slate-500">Emails daily total collection summary to arena owner at 10 PM.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={dailyReportEmail}
                          onChange={(e) => setDailyReportEmail(e.target.checked)}
                          className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                        />
                      </div>

                      {dailyReportEmail && (
                        <div className="pt-2">
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Report Email Recipient</label>
                          <input
                            type="email"
                            value={reportRecipient}
                            onChange={(e) => setReportRecipient(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-sm font-semibold focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4. Slot Rules & Booking Rules Tab */}
                {activeSection === 'Booking' && (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 space-y-5 shadow-xs">
                    <div className="border-b border-slate-100/80 pb-3.5">
                      <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Calendar size={20} className="text-emerald-600" />
                        <span>Operating Schedule & Slot Reservation Rules</span>
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                        Set daily open hours, standard match durations, and cancellation policies.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Daily Arena Opening Time</label>
                        <select
                          value={openTime}
                          onChange={(e) => setOpenTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-sm font-bold text-slate-900"
                        >
                          <option>05:00 AM</option>
                          <option>06:00 AM</option>
                          <option>07:00 AM</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Daily Arena Closing Time</label>
                        <select
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-sm font-bold text-slate-900"
                        >
                          <option>09:00 PM</option>
                          <option>10:00 PM</option>
                          <option>11:00 PM</option>
                          <option>12:00 AM (Midnight)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Standard Match Slot Duration</label>
                        <select
                          value={slotDuration}
                          onChange={(e) => setSlotDuration(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-sm font-bold text-slate-900"
                        >
                          <option>60 Minutes (1 Hour)</option>
                          <option>90 Minutes (1.5 Hours)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Advance Cancellation Buffer</label>
                        <select
                          value={cancellationWindow}
                          onChange={(e) => setCancellationWindow(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-sm font-bold text-slate-900"
                        >
                          <option>Up to 2 Hours Before Match</option>
                          <option>Up to 4 Hours Before Match</option>
                          <option>Up to 12 Hours Before Match</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">Unpaid Holding Grace Period</label>
                        <select
                          value={gracePeriod}
                          onChange={(e) => setGracePeriod(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-white/80 border border-slate-200 text-sm font-bold text-slate-900"
                        >
                          <option>10 Minutes</option>
                          <option>15 Minutes</option>
                          <option>30 Minutes</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Security & Access Control Tab */}
                {activeSection === 'Security' && (
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-6 space-y-5 shadow-xs">
                    <div className="border-b border-slate-100/80 pb-3.5">
                      <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                        <Shield size={20} className="text-emerald-600" />
                        <span>Security, Passwords & Counter Staff Access PIN</span>
                      </h2>
                      <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                        Manage owner credentials and quick passcode override for counter staff.
                      </p>
                    </div>

                    <div className="space-y-4 max-w-lg">
                      <div className="bg-amber-50/60 border border-amber-200/80 p-4.5 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-amber-900 text-xs md:text-sm uppercase tracking-wider">Counter Staff Override PIN</span>
                          <Lock size={16} className="text-amber-700" />
                        </div>
                        <div>
                          <label className="text-xs md:text-sm font-extrabold text-slate-700 block mb-1.5">4-Digit Counter Quick PIN</label>
                          <input
                            type="text"
                            value={managerPin}
                            onChange={(e) => setManagerPin(e.target.value)}
                            maxLength={4}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 font-black text-slate-900 tracking-widest text-center text-lg"
                          />
                        </div>
                        <p className="text-xs text-slate-600">
                          Used by staff at the counter to quickly override slot discounts or process cash cancellations.
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Current Owner Password</label>
                          <input
                            type="password"
                            defaultValue="••••••••••••"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">New Owner Password</label>
                          <input
                            type="password"
                            placeholder="Enter new strong password"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 font-medium text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-slate-700 block mb-1">Automatic Session Timeout</label>
                          <select
                            value={sessionTimeout}
                            onChange={(e) => setSessionTimeout(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/80 border border-slate-200 font-bold text-slate-900"
                          >
                            <option>15 Minutes</option>
                            <option>30 Minutes</option>
                            <option>1 Hour</option>
                            <option>Never (Counter Standalone Mode)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
    </>
  );
}

export default SettingsPage;
