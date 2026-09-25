import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import TopBar from '../../components/layout/Topbar';
import {
  Rocket,
  Calendar,
  CircleDot,
  CreditCard,
  BarChart3,
  Settings,
  Headphones,
  FileText,
  ExternalLink,
  Mail,
  Phone,
  ChevronRight,
  Clock,
  HelpCircle,
  Search,
  MessageSquare,
  Ticket,
  LifeBuoy
} from 'lucide-react';

function SupportPage({ activeTab, setActiveTab }) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      title: 'Getting Started',
      desc: 'Learn the basics of setup and venue config',
      icon: Rocket,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      title: 'Managing Bookings',
      desc: 'Create, edit, cancel and hold player slots',
      icon: Calendar,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      title: 'Courts & Rates',
      desc: 'Set peak pricing, duration and court rules',
      icon: CircleDot,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      title: 'eSewa & Bank Pay',
      desc: 'Digital wallets, QR scanners & cash logs',
      icon: CreditCard,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      title: 'Reports & Revenue',
      desc: 'Export daily counter ledgers & GST reports',
      icon: BarChart3,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
    {
      title: 'SMS & Security',
      desc: 'Sparrow SMS API, PINs and staff access',
      icon: Settings,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    },
  ];

  const popularArticles = [
    {
      title: 'How to configure peak hour pricing vs standard rate',
      desc: 'Set custom rates for evening floodlight slots.',
      icon: FileText,
    },
    {
      title: 'Setting up eSewa QR code for counter desk',
      desc: 'Display instant digital payment QR to customers.',
      icon: FileText,
    },
    {
      title: 'Understanding 4-digit staff quick override PIN',
      desc: 'How counter staff authorize manual discounts.',
      icon: FileText,
    },
    {
      title: 'Integrating Sparrow SMS for instant booking alerts',
      desc: 'Send automated confirmation SMS to players.',
      icon: FileText,
    },
    {
      title: 'Exporting daily counter closing ledger report',
      desc: 'Download CSV and PDF reports for audit.',
      icon: Settings,
    },
  ];

  const supportTickets = [
    {
      id: '#TK-2026-0012',
      subject: 'eSewa payment callback delay on weekend peak',
      status: 'Open',
      statusBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      lastUpdated: '12 Jun 2026',
    },
    {
      id: '#TK-2026-0011',
      subject: 'Request for secondary landline receipt print header',
      status: 'In Progress',
      statusBg: 'bg-blue-50 text-blue-700 border border-blue-200',
      lastUpdated: '10 Jun 2026',
    },
    {
      id: '#TK-2026-0010',
      subject: 'Court 2 floodlight schedule not auto-locking',
      status: 'Resolved',
      statusBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      lastUpdated: '08 Jun 2026',
    },
    {
      id: '#TK-2026-0009',
      subject: 'Invoice PDF download logo alignment issue',
      status: 'Closed',
      statusBg: 'bg-slate-100 text-slate-600 border border-slate-200',
      lastUpdated: '05 Jun 2026',
    },
  ];

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f3f5fc] text-slate-900 font-sans antialiased overflow-hidden select-none relative">
      {/* Top Header Bar across full window width */}
      <TopBar />

      {/* Main Body Section: Left Sidebar + Right Content Area */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Soft Ambient Background Orbs */}
        <div className="absolute top-[45%] right-[35%] w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[160px] pointer-events-none" />

        {/* Floating Left Glass Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Floating Right Main Glass Container */}
        <div className="flex-1 flex flex-col min-w-0 backdrop-blur-md overflow-hidden relative z-10">
          {/* Scrollable Main Area */}
          <main className="flex-1 overflow-y-auto space-y-5 scrollbar-thin p-4">
            {/* Header Action Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
                  <span>Help Center & Customer Support</span>
                  <HelpCircle size={22} className="text-emerald-600" />
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                  Search guides, explore venue tutorials, or open a direct priority ticket with Turfio support.
                </p>
              </div>

              {/* Quick Search Input */}
              <div className="relative min-w-[280px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search articles & guides..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-slate-200 text-slate-900 text-xs md:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-2xs"
                />
              </div>
            </div>

            {/* Top Row Grid: Help Categories & Popular Articles */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Card: Categories Matrix */}
              <div className="lg:col-span-7 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 md:p-6 space-y-4 shadow-xs">
                <div>
                  <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <LifeBuoy size={20} className="text-emerald-600" />
                    <span>How can we help your venue today?</span>
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
                    Select a topic category to view step-by-step documentation.
                  </p>
                </div>

                {/* 6 Category Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.title}
                        className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/80 bg-white/80 hover:bg-emerald-50/50 hover:border-emerald-300 transition-all text-left group shadow-2xs"
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cat.iconBg}`}>
                            <Icon size={18} />
                          </div>
                          <ChevronRight size={16} className="text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-600 transition-all" />
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-extrabold text-slate-900 leading-tight">{cat.title}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-snug mt-1">{cat.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Banner: Still need help? */}
                <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Headphones size={20} />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block text-xs md:text-sm">Still need custom setup support?</span>
                      <span className="text-slate-600 font-medium text-xs">Our Kathmandu technical team responds within 15 minutes.</span>
                    </div>
                  </div>
                  <button className="px-4 py-2.5 rounded-full bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition-colors shrink-0 shadow-md shadow-emerald-600/20 text-xs">
                    Contact Support
                  </button>
                </div>
              </div>

              {/* Right Card: Popular Articles */}
              <div className="lg:col-span-5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 md:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100/80 pb-3">
                  <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Popular Guides</h2>
                  <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
                </div>

                <div className="space-y-3.5 divide-y divide-slate-100/80">
                  {popularArticles.map((art, idx) => {
                    const Icon = art.icon;
                    return (
                      <div key={art.title} className={`${idx === 0 ? '' : 'pt-3.5'} flex items-start gap-3.5 text-xs md:text-sm`}>
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs md:text-sm text-slate-900 leading-tight hover:text-emerald-600 cursor-pointer transition-colors">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-500 font-medium mt-1 leading-snug">{art.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-100/80 text-xs">
                  <a href="#" className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:underline">
                    <span>Browse all documentation articles</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>

            {/* Middle Row Grid: Contact Channels & Support Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Card: Contact Support Channels */}
              <div className="lg:col-span-6 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 md:p-6 space-y-4 shadow-xs">
                <div>
                  <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Direct Support Channels</h3>
                  <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Get immediate assistance for counter hardware or billing.</p>
                </div>

                <div className="space-y-3">
                  {/* Channel 1: Live Chat */}
                  <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-xs md:text-sm">Counter Desk Live Chat</h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" /> Online
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Average reply time: 2 mins</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shrink-0 shadow-xs">
                      Start Chat
                    </button>
                  </div>

                  {/* Channel 2: Email Support */}
                  <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Mail size={20} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs md:text-sm">Email Support</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">support@turfio.app</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-600 hover:text-white transition-colors shrink-0">
                      Send Email
                    </button>
                  </div>

                  {/* Channel 3: Phone Support */}
                  <div className="p-4 rounded-xl bg-white/80 border border-slate-200/80 flex items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                        <Phone size={20} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs md:text-sm">Hotline Support</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">Emergency arena assistance</p>
                      </div>
                    </div>
                    <span className="px-3.5 py-2 rounded-xl bg-amber-50 text-amber-800 font-black text-xs md:text-sm border border-amber-200/80">
                      +977 1-4422333
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium pt-1">
                  <Clock size={14} className="text-slate-400" />
                  <span> Kathmandu Office Hours: Sun – Fri (08:00 AM – 08:00 PM NPT)</span>
                </div>
              </div>

              {/* Right Card: Support Ticket Status Directory */}
              <div className="lg:col-span-6 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 p-5 md:p-6 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100/80 pb-3">
                  <div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <Ticket size={20} className="text-emerald-600" />
                      <span>Recent Support Tickets</span>
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">Track active venue requests and resolutions.</p>
                  </div>
                  <button className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
                </div>

                {/* Tickets Table */}
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left border-collapse text-xs md:text-sm min-w-[500px]">
                    <thead>
                      <tr className="text-xs font-extrabold text-slate-500 border-b border-slate-200/80 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-2.5 px-3">Ticket ID</th>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/80">
                      {supportTickets.map((t) => (
                        <tr key={t.id} className="hover:bg-white/80 transition-colors group cursor-pointer">
                          <td className="py-3 px-3 font-extrabold text-slate-900 whitespace-nowrap">{t.id}</td>
                          <td className="py-3 px-3 font-semibold text-slate-700 leading-tight">{t.subject}</td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${t.statusBg}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-slate-500 font-medium whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <span>{t.lastUpdated}</span>
                              <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
    </>
  );
}

export default SupportPage;
