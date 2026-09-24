import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '../../components/common/toastContext';

function SignUpPage({ onSignUp, onSwitchToLogin }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Same strength requirements as the change-password form (SecuritySettings.jsx),
  // so registering and changing a password expect the same thing.
  const isPasswordMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasComplexity = hasUppercase || hasNumber;

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400' };
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (hasUppercase && hasNumber) score += 1;
    if (hasSpecial) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500', textColor: 'text-amber-600' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-lime-500', textColor: 'text-lime-600' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
      default:
        return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-600' };
    }
  };
  const strength = getPasswordStrength();

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

    if (!isPasswordMinLength) {
      showToast('Password must be at least 8 characters long.', 'error');
      return;
    }

    if (!hasComplexity) {
      showToast('Password must include a number or an uppercase letter.', 'error');
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
    <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-[448px] bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          
          {/* Headline */}
          <div className="space-y-1 text-left">
            <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-tight">
              Create account
            </h1>
            <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed">
              Join Turfio to book turfs, connect with players and play your way.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* First & Last Name Fields */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full pl-10 pr-3 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all placeholder:text-slate-400"
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full pl-10 pr-3 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all placeholder:text-slate-400"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 chars with number/uppercase"
                  className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all placeholder:text-slate-400"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password && (
                <div className="mt-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Password Strength</span>
                    <span className={`text-[11px] font-extrabold ${strength.textColor}`}>{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    <div className={`rounded-full transition-colors ${strength.score >= 1 ? strength.color : 'bg-slate-100'}`} />
                    <div className={`rounded-full transition-colors ${strength.score >= 2 ? strength.color : 'bg-slate-100'}`} />
                    <div className={`rounded-full transition-colors ${strength.score >= 3 ? strength.color : 'bg-slate-100'}`} />
                    <div className={`rounded-full transition-colors ${strength.score >= 4 ? strength.color : 'bg-slate-100'}`} />
                  </div>
                  <div className="flex flex-col gap-1 text-[11px] pt-1">
                    <span className={isPasswordMinLength ? 'text-lime-600 font-bold' : 'text-slate-400'}>
                      {isPasswordMinLength ? '✓' : '○'} At least 8 characters
                    </span>
                    <span className={hasComplexity ? 'text-lime-600 font-bold' : 'text-slate-400'}>
                      {hasComplexity ? '✓' : '○'} Includes number or uppercase letter
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 accent-lime-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">
                  I agree to the <a href="#" className="text-lime-600 hover:underline">Terms</a> & <a href="#" className="text-lime-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreeTerms}
              className="w-full py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60 mt-1"
            >
              <span>{isLoading ? 'Creating Account…' : 'Sign Up'}</span>
              <ArrowRight size={16} />
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-1.5">
              <div className="border-t border-slate-100 w-full" />
              <span className="bg-white px-3 text-[11px] font-medium text-slate-400 absolute">
                or continue with
              </span>
            </div>

            {/* Social Login: Google */}
            <div>
              <button
                type="button"
                onClick={handleGoogleClick}
                className="w-full py-3.5 px-6 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
              >
                <img src="/google.svg" alt="Google" className="h-5 w-5 object-contain" />
                <span>Continue with Google</span>
              </button>
            </div>
          </form>

          {/* Switch to Login Link */}
          <div className="pt-2 text-center">
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

        {/* Legal Disclaimer */}
        <p className="text-[11px] font-medium text-slate-400 mt-6 text-center">
          By continuing, you agree to our{' '}
          <a href="#" className="text-lime-600 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-lime-600 hover:underline">Privacy Policy</a>.
        </p>
    </div>
  );
}

export default SignUpPage;
