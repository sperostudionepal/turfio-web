import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useToast } from '../../../shared/components/common/toastContext';
import { useOwnerAuth, useSuperadminAuth } from '../../../shared/store/useAuthStore';
import { safeRedirectPath } from '../../../shared/utils/redirect';

export default function StaffLoginPage({ onLogin, onHome, portalTitle = 'ADMIN PORTAL', targetRole = 'admin' }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 2FA Login Gate state
  const [mfaRequired, setMfaRequired] = useState(false);
  const [tempToken, setTempToken] = useState(null);
  const [mfaCode, setMfaCode] = useState('');
  const { showToast } = useToast();

  const verifyAdminMfa = useOwnerAuth((s) => s.verifyMfaLogin);
  const verifySuperadminMfa = useSuperadminAuth((s) => s.verifyMfaLogin);
  const verifyMfaLogin = targetRole === 'superadmin' ? verifySuperadminMfa : verifyAdminMfa;

  // Add noindex meta tag dynamically for staff privacy
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) {
        meta.content = 'index, follow';
      }
    };
  }, []);

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    if (!mfaCode.trim()) {
      showToast('Please enter your 6-digit authenticator code.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyMfaLogin({ tempToken, code: mfaCode.trim() });
      if (res && res.success) {
        showToast('Welcome back! Logged in successfully.', 'success');
        const userRole = res.user?.role || targetRole;
        if (userRole === 'superadmin') {
          navigate('/superadmin/dashboard', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        showToast(res.error || 'Invalid 2FA code. Please try again.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Verification failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (onLogin) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectToParam = searchParams.get('redirectTo');
        const res = await onLogin({ email, password, redirectTo: redirectToParam || undefined });

        if (res && res.mfaRequired) {
          setMfaRequired(true);
          setTempToken(res.tempToken);
          showToast('Two-factor authentication required.', 'info');
        } else if (res && res.success === false) {
          showToast(res.error || 'Invalid credentials.', 'error');
        } else {
          showToast('Authentication verified. Welcome back!', 'success');
          const fallback = targetRole === 'superadmin' ? '/superadmin/dashboard' : '/dashboard';
          navigate(safeRedirectPath(res?.redirectTo, fallback), { replace: true });
        }
      }
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-white text-slate-900 font-sans antialiased flex flex-col lg:flex-row selection:bg-lime-300 selection:text-slate-900 relative">
      {/* Top Right Link: New to Turfio? Visit Website */}
      <a
        href="/"
        onClick={(e) => {
          if (onHome) {
            e.preventDefault();
            onHome();
          }
        }}
        className="absolute top-6 right-6 sm:top-8 sm:right-8 lg:right-12 z-30 flex items-center gap-1.5 text-xs sm:text-[13px] font-medium transition-colors group cursor-pointer"
      >
        <span className="text-slate-500">New to Turfio?</span>
        <span className="text-lime-600 group-hover:text-lime-700 font-semibold flex items-center gap-1">
          Visit Website
          <ExternalLink size={13} className="stroke-[2.5]" />
        </span>
      </a>

      {/* Left Column: Hero Background + Floating Dashboard Mockup (matches ListTurfPage hero) */}
      <div className="hidden lg:block lg:flex-1 min-h-screen relative isolate overflow-hidden bg-white">
        {/* Background Image — identical treatment to ListTurfPage hero section */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-[0.07]">
          <img
            src="/hero-image.png"
            alt="Hero Background"
            className="h-full w-full object-cover object-center grayscale"
          />
        </div>

        {/* Floating Dashboard Mockup — zoomed in, anchored bottom-right with top/left breathing room */}
        <div className="absolute inset-0 pt-16 pl-16 xl:pt-24 xl:pl-24">
          <img
            src="/tablet-mockup.png"
            alt="Turfio Arena Owner Dashboard Mockup"
            className="w-full h-full object-cover object-left-top drop-shadow-xl rounded-tl-2xl"
          />
        </div>
      </div>

      {/* Right Column: Exact Reference Form Layout */}
      <div className="flex-1 lg:flex-none lg:w-[530px] xl:w-[580px] bg-white min-h-screen flex flex-col justify-center items-center px-6 sm:px-10 lg:px-8 py-12">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Header Block */}
          <div className="space-y-2 text-left">
            <span className="text-[12px] font-extrabold uppercase tracking-widest text-slate-400 block">
              {portalTitle}
            </span>
            <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-slate-950 leading-tight">
              Welcome Back
            </h1>
            <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed pt-0.5">
              Sign in with your administrative credentials to access the TURFIO dashboard.
            </p>
          </div>

          {mfaRequired ? (
            /* 2FA Form */
            <form onSubmit={handleMfaSubmit} className="space-y-4 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-lime-100 flex items-center justify-center text-lime-700 mb-3">
                <ShieldCheck size={24} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  2FA Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono py-3.5 rounded-2xl bg-slate-50 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all placeholder:text-slate-400"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-full bg-lime-500 hover:bg-lime-600 active:scale-[0.99] text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span>{isLoading ? 'Verifying…' : 'Verify & Continue'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Main Login Form */
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="admin@turfio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-400 transition-all placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded accent-lime-600 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700">Keep me signed in</span>
                </label>
                <a
                  href="mailto:support@turfio.com?subject=Admin%20Password%20Reset%20Request"
                  className="text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline transition-colors"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 rounded-full bg-lime-500 hover:bg-lime-600 active:scale-[0.99] text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{isLoading ? 'Signing In…' : 'Sign In to Dashboard'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* Informational Security Callout Card */}
          <div className="rounded-2xl bg-slate-50/80 p-4 flex items-center gap-3.5">
            <div className="w-8 h-8 rounded-full bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
              <Lock size={14} className="stroke-[2.5]" />
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              This portal is for authorized turf owners and TURFIO administrators only.
            </p>
          </div>

          {/* Need Access Support Link */}
          <div className="pt-4 text-center space-y-1">
            <span className="text-xs font-bold text-slate-800 block">
              Need access?
            </span>
            <p className="text-xs font-medium text-slate-500">
              Contact TURFIO support to get your admin account.
            </p>
            <a
              href="mailto:support@turfio.com"
              className="text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline inline-block pt-0.5"
            >
              support@turfio.com
            </a>
            {targetRole === 'admin' && (
              <button
                type="button"
                onClick={() => navigate('/superadmin/login')}
                className="block mx-auto pt-2 text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline cursor-pointer"
              >
                Open Superadmin Portal
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}