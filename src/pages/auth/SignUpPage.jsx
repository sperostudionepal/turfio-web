import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { useToast } from '../../components/common/Toast';

function SignUpPage({ onSignUp, onSwitchToLogin, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleGoogleClick = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId.includes('your_google_client_id')) {
      showToast('Please configure your VITE_GOOGLE_CLIENT_ID in the .env file.', 'error');
      return;
    }

    const redirectUri = window.location.origin;
    const nonce = Math.random().toString(36).substring(2);
    const targetUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=id_token&scope=openid%20email%20profile&nonce=${nonce}&prompt=select_account`;

    window.location.href = targetUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (onSignUp) {
        const res = await onSignUp({ firstName, lastName, email, password, confirmPassword: password });
        if (res && res.success === false) {
          showToast(res.error || 'Registration failed. Please check your information.', 'error');
        } else {
          showToast('Account created successfully!', 'success');
        }
      }
    } catch (err) {
      showToast(err.message || 'Registration failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-100/40 text-slate-900 flex flex-col justify-between font-sans antialiased">
      {/* Background Image Overlay with Visible Z-Index Layering */}
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
          {/* Brand Logo */}
          <a href="#" onClick={onClose} className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Turfio Logo"
              className="h-9 w-auto object-contain"
            />
            <span className="leading-tight">
              <span className="block text-lg font-extrabold tracking-tight text-slate-900">
                TURFIO
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-slate-400">
                Futsal, your way
              </span>
            </span>
          </a>

          {/* Back to Home Button (No border stroke) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-4.5 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200/70 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Form Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-2 sm:py-4 md:px-10 lg:px-14 overflow-hidden">
        <div className="w-full max-w-[480px] bg-white rounded-[28px] p-8 sm:p-10 md:p-12 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] border border-slate-100/90">
          <div className="w-full space-y-6">
            
            {/* Header Title */}
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Create an Account
              </h1>
              <p className="mt-1.5 text-sm font-medium text-slate-500">
                Join Turfio to book turfs and play.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* First Name & Last Name Side by Side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* First Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Saugat"
                      className="w-full pl-11 pr-3.5 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Last Name Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Shahi"
                      className="w-full pl-11 pr-3.5 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="saugat@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-11 py-3 rounded-2xl border border-slate-200 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-300 focus:border-lime-400 transition-all bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Agree Terms */}
              <div className="flex items-center pt-1.5 pb-1">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-lime-500 rounded border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    I agree to the <a href="#" className="text-lime-600 hover:underline">Terms</a> & <a href="#" className="text-lime-600 hover:underline">Privacy Policy</a>
                  </span>
                </label>
              </div>

              {/* Submit Create Account Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-95 text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 shadow-xs"
              >
                {isLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-1">
                <div className="border-t border-slate-100 w-full" />
                <span className="bg-white px-3 text-[11px] font-medium text-slate-400 absolute">or</span>
              </div>

              {/* Sign up with Google Button */}
              <button
                type="button"
                onClick={handleGoogleClick}
                className="w-full py-3.5 px-6 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <img src="/google.svg" alt="Google" className="h-5 w-5 object-contain" />
                <span>Sign up with Google</span>
              </button>
            </form>

            {/* Switch to Login Link */}
            <div className="pt-1 text-center">
              <p className="text-xs text-slate-500 font-medium">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="font-extrabold text-slate-900 hover:text-lime-600 transition-colors underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </div>

          </div>
        </div>
      </main>

      {/* Simple Clean Footer */}
      <footer className="relative z-10 w-full bg-transparent py-6 text-center text-xs font-medium text-slate-400 shrink-0">
        © {new Date().getFullYear()} Turfio. All rights reserved.
      </footer>
    </div>
  );
}

export default SignUpPage;
