import {
  Clock,
  ArrowRight,
  Mail,
  Check,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ApplicationSubmittedPage({
  data,
  onHome,
  onTrack,
  onLogin,
  onSignUp,
  onListTurf,
  onFindTurfs,
}) {
  const trackingUrl =
    data?.trackingUrl ||
    `${window.location.origin}/application-status?token=${data?.trackingToken || ''}`;

  const steps = [
    {
      step: '1',
      title: 'Application Received',
      desc: 'Your facility information and registration documents are safely recorded.',
      status: 'completed',
    },
    {
      step: '2',
      title: 'Document & Facility Review',
      desc: 'Our onboarding team verifies court specifications, pricing, and operating schedule within 24 hours.',
      status: 'active',
    },
    {
      step: '3',
      title: 'Dashboard Access & Launch',
      desc: 'You will receive an invitation link via email to set your password and publish your arena.',
      status: 'upcoming',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col justify-between selection:bg-lime-300 selection:text-slate-900 relative">
      {/* Top Navbar */}
      <Navbar
        onLogin={onLogin}
        onSignUp={onSignUp}
        onHome={onHome}
        onListTurf={onListTurf}
        onFindTurfs={onFindTurfs}
        user={null}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
        
        {/* Top Header Badge & Title (Centered, matched with ListTurfPage typography) */}
        <div className="text-center max-w-xl mx-auto mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-lime-100 px-3.5 py-1.5 text-xs font-bold text-slate-800 mb-3">
            <CheckCircle2 className="h-4 w-4 text-lime-600" />
            Partner Application Received
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Application Submitted
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed">
            Thank you for registering{' '}
            <span className="font-extrabold text-slate-900">{data?.arenaName || 'your arena'}</span>.
            Our team is reviewing your details to prepare your facility for launch.
          </p>
        </div>

        {/* 2-Column Split Hub Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Status Details & Primary Actions (5 cols on lg for a slimmer card) */}
          <div className="lg:col-span-6 space-y-6 max-w-md">
            
            {/* Email Notification Alert Box */}
            <div className="flex flex-col items-center text-center space-y-3 py-2">
              <div className="w-12 h-12 rounded-full bg-lime-400 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Mail size={22} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">Confirmation Sent</h3>
                <p className="text-[13.5px] text-slate-600 font-medium leading-relaxed max-w-sm mx-auto">
                  A copy of your submission receipt along with tracking details has been sent to{' '}
                  <span className="font-bold text-slate-900">{data?.email || 'your email'}</span>.
                </p>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col gap-3 pt-2">
              {data?.trackingToken && (
                <button
                  type="button"
                  onClick={() => (onTrack ? onTrack(data.trackingToken) : (window.location.href = trackingUrl))}
                  className="w-full py-4 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Track Application Status</span>
                  <ArrowRight size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={onHome}
                className="w-full py-3.5 px-6 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-800 font-bold text-sm transition-all cursor-pointer text-center"
              >
                Return to Home
              </button>
            </div>

            <p className="text-[11.5px] font-medium text-slate-400 text-center leading-relaxed">
              Need to update your submitted information? Our partner support team is here to help.
            </p>
          </div>

          {/* Right Column: Next Steps Timeline & Help Center (6 cols) */}
          <div className="lg:col-span-6 space-y-8 lg:pl-4">
            
            {/* 3-Step Process */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
                What Happens Next?
              </h2>

              <div className="space-y-3">
                {steps.map((st, idx) => (
                  <div key={st.step} className="flex items-start gap-4 relative pb-7 last:pb-0">
                    {idx !== steps.length - 1 && (
                      <div className="absolute left-5 top-10 bottom-0 w-[2px] bg-slate-100 -translate-x-1/2" />
                    )}
                    <div
                      className={`w-10 h-10 rounded-full font-extrabold flex items-center justify-center text-sm shrink-0 relative z-10 ${
                        st.status === 'completed'
                          ? 'bg-lime-400 text-slate-900'
                          : st.status === 'active'
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {st.status === 'completed' ? <Check size={16} className="stroke-[3]" /> : st.step}
                    </div>
                    <div className="pt-1.5 min-w-0">
                      <h4
                        className={`text-sm font-extrabold leading-snug ${
                          st.status === 'upcoming' ? 'text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {st.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Floating Support Icon at Bottom Right */}
      <a
        href="https://wa.me/9779800000000?text=Hi%20Turfio%20Team%2C%20I%20have%20an%20inquiry%20regarding%20my%20turf%20listing%20application."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-13 h-13 rounded-full bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center shadow-xl shadow-slate-950/25 hover:scale-105 active:scale-95 transition-all group"
        title="Contact Support"
        aria-label="Contact Support"
      >
        <MessageSquare size={22} className="stroke-[2.2] text-white" />
      </a>

      {/* Footer */}
      <Footer />
    </div>
  );
}
