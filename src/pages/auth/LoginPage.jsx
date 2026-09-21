import { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useToast } from '../../components/common/Toast';
import Navbar from '../../components/Navbar';

function LoginPage({ onLogin, onGoogleLogin, onSwitchToSignUp, onClose, onHome, onListTurf, onFindTurfs }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
    if (!email || !password) {
      showToast('Please enter both email and password.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (onLogin) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo = searchParams.get('redirectTo') || undefined;
        const res = await onLogin({ email, password, redirectTo });
        if (res && res.success === false) {
          showToast(res.error || 'Login failed. Please check your credentials.', 'error');
        } else {
          showToast('Welcome back! Logged in successfully.', 'success');
        }
      }
    } catch (err) {
      showToast(err.message || 'Login failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50/60 text-slate-900 font-sans antialiased flex flex-col justify-between selection:bg-lime-300 selection:text-slate-900">
      
      {/* Top Navbar */}
      <Navbar
        onLogin={() => {}}
        onSignUp={onSwitchToSignUp}
        onHome={onHome || onClose}
        onListTurf={onListTurf}
        onFindTurfs={onFindTurfs}
        user={null}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-[430px] bg-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
          
          {/* Headline */}
          <div className="space-y-1 text-left">
            <h1 className="text-[26px] font-black tracking-tight text-slate-900 leading-tight">
              Welcome back!
            </h1>
            <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed">
              Log in to continue booking turfs, finding matches and playing your way.
            </p>
          </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                
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
                      placeholder="Password"
                      className="w-full pl-11 pr-11 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all placeholder:text-slate-400"
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
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 accent-lime-500 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-700">Remember me</span>
                  </label>
                  <a href="#" className="text-xs font-bold text-lime-600 hover:text-lime-700 hover:underline">
                    Forgot password?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-6 rounded-full bg-lime-400 hover:bg-lime-500 active:scale-[0.99] text-slate-900 font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60 mt-1"
                >
                  <span>{isLoading ? 'Signing In…' : 'Log In'}</span>
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

              {/* Switch to Sign Up Link */}
              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToSignUp}
                    className="font-extrabold text-slate-900 hover:text-lime-600 transition-colors underline cursor-pointer"
                  >
                    Sign Up
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
      </main>

    </div>
  );
}

export default LoginPage;
