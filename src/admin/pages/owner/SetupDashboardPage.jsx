import { useState, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import ownerApplicationService from '../../../shared/services/ownerApplicationService';
import { useToast } from '../../../shared/components/common/toastContext';

export default function SetupDashboardPage({ onSetupSuccess, onHome }) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [tokenDetails, setTokenDetails] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  // Validate signup token on page load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get('token');

    if (!urlToken) {
      setTokenError('No setup token found in this link. Please check the email sent to you.');
      setLoading(false);
      return;
    }

    setToken(urlToken);

    const verify = async () => {
      try {
        const res = await ownerApplicationService.verifySignupToken(urlToken);
        setTokenDetails(res.data);
      } catch (err) {
        setTokenError(err.message || 'Invalid or expired setup link.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  // Password Validation Rules
  const hasMinLength = password.length >= 12;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasMinLength) {
      showToast('Password must be at least 12 characters long.', 'error');
      return;
    }

    if (!passwordsMatch) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await ownerApplicationService.completeSignup({
        token,
        password,
        confirmPassword,
      });

      showToast('Dashboard configured successfully! Welcome to Turfio.', 'success');

      if (onSetupSuccess) {
        onSetupSuccess(res.data);
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      showToast(err.message || 'Account setup failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100/40 text-slate-900 flex flex-col justify-between font-sans antialiased">
      {/* Background Image Pattern */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.05]">
        <img
          src="/image.png"
          alt="Background Pattern"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-slate-100 bg-white shrink-0">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 md:px-14 lg:px-20">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Turfio Logo" className="h-9 w-auto object-contain" />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                TURFIO
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                Partner Dashboard Setup
              </span>
            </span>
          </div>

          {onHome && (
            <button
              type="button"
              onClick={onHome}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Home
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[500px] bg-white rounded-[28px] p-8 sm:p-10 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] border border-slate-100">
          {loading ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-lime-500" />
              <p className="text-sm font-bold text-slate-700">Verifying single-use setup link…</p>
            </div>
          ) : tokenError ? (
            <div className="text-center py-8 space-y-4">
              <XCircle className="h-12 w-12 text-rose-500 mx-auto" />
              <div>
                <h1 className="text-xl font-extrabold text-slate-900">Setup Link Invalid or Expired</h1>
                <p className="mt-2 text-xs font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
                  {tokenError}
                </p>
              </div>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={onHome || (() => (window.location.href = '/'))}
                  className="px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Return to Home
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1 text-[11px] font-black text-slate-900 mb-3">
                  <ShieldCheck className="h-3.5 w-3.5 text-lime-700" />
                  Approved Partner Setup
                </span>
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Set Up Your Dashboard
                </h1>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Create a secure password for <strong className="text-slate-900">{tokenDetails?.arenaName}</strong>.
                </p>
              </div>

              {/* Verified details card */}
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Venue:</span>
                  <span className="font-extrabold text-slate-900">{tokenDetails?.arenaName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Owner:</span>
                  <span className="font-extrabold text-slate-900">{tokenDetails?.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-500">Account Email:</span>
                  <span className="font-extrabold text-slate-900">{tokenDetails?.email}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Minimum 12 characters"
                      className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white"
                      required
                    />
                  </div>
                </div>

                {/* Password Requirements Checklist */}
                <div className="rounded-2xl bg-slate-50/80 p-3.5 space-y-2 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${hasMinLength ? 'text-lime-600' : 'text-slate-300'}`}>
                      {hasMinLength ? <CheckCircle2 size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                    </span>
                    <span className={hasMinLength ? 'font-bold text-slate-900' : 'text-slate-500'}>
                      At least 12 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${hasLetter && hasNumberOrSymbol ? 'text-lime-600' : 'text-slate-300'}`}>
                      {hasLetter && hasNumberOrSymbol ? <CheckCircle2 size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                    </span>
                    <span className={hasLetter && hasNumberOrSymbol ? 'font-bold text-slate-900' : 'text-slate-500'}>
                      Mix of letters and numbers/symbols
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-3.5 w-3.5 rounded-full flex items-center justify-center ${passwordsMatch ? 'text-lime-600' : 'text-slate-300'}`}>
                      {passwordsMatch ? <CheckCircle2 size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />}
                    </span>
                    <span className={passwordsMatch ? 'font-bold text-slate-900' : 'text-slate-500'}>
                      Passwords match
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting || !hasMinLength || !passwordsMatch}
                  className="w-full py-4 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Securing & Creating Account…</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup & Launch Dashboard</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-transparent py-6 text-center text-xs font-medium text-slate-400 shrink-0">
        © {new Date().getFullYear()} Turfio. All rights reserved.
      </footer>
    </div>
  );
}
