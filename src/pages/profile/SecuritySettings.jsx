import { useState, useEffect } from 'react';
import { Shield, Lock, Smartphone, Laptop, LogOut, KeyRound, Loader2, Eye, EyeOff, QrCode, Copy } from 'lucide-react';
import { useToast } from '../../components/common/toastContext';
import authService from '../../services/authService';
import useAuthStore from '../../store/useAuthStore';

export default function SecuritySettings({ user, onChangePassword }) {
  const { showToast } = useToast();
  const initialize = useAuthStore((state) => state.initialize);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password visibility state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Active sessions state
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLogoutOtherModalOpen, setIsLogoutOtherModalOpen] = useState(false);
  const [isLoggingOutOthers, setIsLoggingOutOthers] = useState(false);

  // Real 2FA Modal states
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [totpSecret, setTotpSecret] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [setupStep, setSetupStep] = useState(1); // 1: QR setup, 2: Backup codes
  const [isGeneratingMfa, setIsGeneratingMfa] = useState(false);
  const [isVerifyingMfa, setIsVerifyingMfa] = useState(false);

  // Disable MFA state
  const [disablePassword, setDisablePassword] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [isDisablingMfa, setIsDisablingMfa] = useState(false);

  const fetchSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const res = await authService.getSessions();
      if (res.data?.sessions) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Fetch active sessions on mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Password validation & strength calculation
  const isGoogleOnly = user?.provider === 'google' && !user?.password;
  const isPasswordMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  const hasComplexity = hasUppercase || hasNumber;
  const passwordsMatch = newPassword === confirmPassword;
  const isPasswordFormValid =
    (isGoogleOnly || currentPassword.trim() !== '') &&
    isPasswordMinLength &&
    hasComplexity &&
    passwordsMatch;

  // Calculate strength score (0 to 4)
  const getPasswordStrength = () => {
    if (!newPassword) return { score: 0, label: '', color: 'bg-slate-200', textColors: 'text-slate-400' };
    let score = 0;
    if (newPassword.length >= 8) score += 1;
    if (newPassword.length >= 12) score += 1;
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

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!isPasswordFormValid || isChangingPassword) return;

    try {
      setIsChangingPassword(true);
      const res = await onChangePassword({ currentPassword, newPassword });
      if (res.success) {
        showToast('Password updated successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.error || 'Failed to change password.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error changing password.', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogoutOtherSessions = async () => {
    try {
      setIsLoggingOutOthers(true);
      const res = await authService.logoutOtherSessions();
      showToast(res.message || 'Logged out from all other sessions.', 'success');
      setIsLogoutOtherModalOpen(false);
      fetchSessions();
    } catch (err) {
      showToast(err.message || 'Failed to logout other sessions.', 'error');
    } finally {
      setIsLoggingOutOthers(false);
    }
  };

  // 2FA Setup Handler
  const handleOpenSetupMfa = async () => {
    try {
      setIsGeneratingMfa(true);
      const res = await authService.generateMfaSecret();
      if (res.data?.qrCodeUrl) {
        setQrCodeUrl(res.data.qrCodeUrl);
        setTotpSecret(res.data.secret);
        setTotpCode('');
        setSetupStep(1);
        setIsSetupModalOpen(true);
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate 2FA QR code', 'error');
    } finally {
      setIsGeneratingMfa(false);
    }
  };

  const handleVerifySetup = async (e) => {
    e.preventDefault();
    if (!totpCode || totpCode.length < 6 || isVerifyingMfa) return;

    try {
      setIsVerifyingMfa(true);
      const res = await authService.verifyMfaSetup(totpCode);
      if (res.data?.backupCodes) {
        setBackupCodes(res.data.backupCodes);
        setSetupStep(2);
        showToast('Two-factor authentication verified and enabled!', 'success');
        await initialize();
      }
    } catch (err) {
      showToast(err.message || 'Invalid code. Please try again.', 'error');
    } finally {
      setIsVerifyingMfa(false);
    }
  };

  const handleFinishSetup = async () => {
    setIsSetupModalOpen(false);
    await initialize();
  };

  // Disable 2FA Handler
  const handleDisableMfaSubmit = async (e) => {
    e.preventDefault();
    if (isDisablingMfa) return;

    try {
      setIsDisablingMfa(true);
      const res = await authService.disableMfa({ password: disablePassword, code: disableCode });
      if (res.data?.success) {
        showToast('Two-factor authentication disabled successfully.', 'success');
        setIsDisableModalOpen(false);
        setDisablePassword('');
        setDisableCode('');
        await initialize();
      }
    } catch (err) {
      showToast(err.message || 'Failed to disable 2FA. Check credentials.', 'error');
    } finally {
      setIsDisablingMfa(false);
    }
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
  };

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-8 shadow-[0_4px_25px_rgba(0,0,0,0.08)]">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2">
        <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-700 flex items-center justify-center font-bold shrink-0">
          <Shield className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Security & Authentication</h3>
          <p className="text-xs font-medium text-slate-500">Manage password, session security, and two-factor protection</p>
        </div>
      </div>

      {/* 1. Password Change / Create Form */}
      <div>
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Lock className="h-3.5 w-3.5 text-lime-600" />
          Change Password
        </h4>

        {isGoogleOnly && (
          <div className="mb-5 p-3.5 sm:p-4 rounded-2xl bg-lime-50/80 border-l-4 border-lime-500 text-[11px] sm:text-xs leading-relaxed">
            <p className="font-bold text-slate-900 text-xs sm:text-[13px] mb-0.5">Google Signed-In Account</p>
            <p className="text-slate-600 font-medium">
              You currently log in using Google OAuth and don't have a local password set. Create a password to enable traditional email & password sign-in alongside Google.
            </p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-xl">
          {/* Current Password */}
          {!isGoogleOnly && (
            <div>
              <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
                Current Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-2xl bg-slate-50 px-4 py-3 pr-11 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  tabIndex={-1}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 chars with number/uppercase"
                className="w-full rounded-2xl bg-slate-50 px-4 py-3 pr-11 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
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

          {/* Confirm Password */}
          <div>
            <label className="block text-xs sm:text-[13px] font-semibold text-slate-700 mb-1.5">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-2xl bg-slate-50 px-4 py-3 pr-11 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-[11px] font-semibold text-rose-500 mt-1">Passwords do not match.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isPasswordFormValid || isChangingPassword}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-xs sm:text-sm font-bold text-white hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2 shadow-xs"
          >
            {isChangingPassword ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-lime-400" />
                Updating Password...
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4 text-lime-400" />
                Update Password
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. Two-Factor Authentication (2FA) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Two-Factor Authentication (TOTP 2FA)</h4>
            <span
              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                user?.twoFactorEnabled
                  ? 'bg-lime-100 text-lime-700'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {user?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-0.5">
            Protect your account with Google Authenticator or Authy TOTP verification codes
          </p>
        </div>

        {user?.twoFactorEnabled ? (
          <button
            type="button"
            onClick={() => setIsDisableModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Disable 2FA
          </button>
        ) : (
          <button
            type="button"
            onClick={handleOpenSetupMfa}
            disabled={isGeneratingMfa}
            className="px-5 py-2.5 rounded-full bg-lime-400 text-slate-900 hover:bg-lime-500 text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
          >
            {isGeneratingMfa ? (
              <Loader2 className="h-4 w-4 animate-spin text-slate-900" />
            ) : (
              <>
                <QrCode className="h-4 w-4 text-slate-900" />
                Enable 2FA
              </>
            )}
          </button>
        )}
      </div>

      {/* 3. Active Sessions List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Laptop className="h-3.5 w-3.5 text-lime-600" />
            Active Sessions ({sessions.length})
          </h4>

          {sessions.length > 1 && (
            <button
              type="button"
              onClick={() => setIsLogoutOtherModalOpen(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
            >
              Log out other sessions
            </button>
          )}
        </div>

        {isLoadingSessions ? (
          <div className="p-4 text-center text-xs text-slate-400">Loading active sessions...</div>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white text-slate-700 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                    {sess.device.includes('Mobile') ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-900">{sess.device}</p>
                      {sess.isCurrent && (
                        <span className="text-[10px] font-bold text-lime-800 bg-lime-100 px-2.5 py-0.5 rounded-full">
                          Current Device
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      IP: {sess.ip} • {sess.location} • {sess.lastActive}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: Real TOTP 2FA Setup Modal */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-lime-100 text-lime-700 flex items-center justify-center font-bold">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {setupStep === 1 ? 'Set Up Two-Factor Authentication' : 'Save Backup Emergency Codes'}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    {setupStep === 1 ? 'Scan QR code with Google Authenticator or Authy' : 'Store these one-time backup codes in a safe place'}
                  </p>
                </div>
              </div>
            </div>

            {setupStep === 1 ? (
              <form onSubmit={handleVerifySetup} className="space-y-5">
                <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-36 h-36 rounded-xl bg-white p-2 border border-slate-200 shrink-0" />
                  ) : (
                    <div className="w-36 h-36 rounded-xl bg-slate-200 animate-pulse shrink-0" />
                  )}

                  <div className="space-y-2 text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-900">1. Scan QR Code</p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      Open your authenticator app (Google Authenticator, Authy, 1Password) and scan this QR code.
                    </p>
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Manual Secret Key</span>
                      <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-slate-800">
                        <span>{totpSecret}</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(totpSecret, 'Secret key')}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    2. Enter 6-Digit Verification Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="123456"
                    className="w-full text-center text-xl font-mono font-bold tracking-widest rounded-2xl bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all border border-slate-200"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSetupModalOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={totpCode.length < 6 || isVerifyingMfa}
                    className="px-6 py-2.5 rounded-full bg-lime-400 text-xs font-bold text-slate-900 hover:bg-lime-500 transition-colors disabled:opacity-50 cursor-pointer shadow-xs inline-flex items-center gap-2"
                  >
                    {isVerifyingMfa ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify & Enable 2FA'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-lime-50 border border-lime-200 text-xs text-slate-700 space-y-2">
                  <p className="font-bold text-lime-900">Important Emergency Backup Codes</p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    If you lose access to your phone or authenticator app, these one-time codes are the ONLY way to regain access to your account.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-900 text-white p-4 rounded-2xl font-mono text-xs font-bold text-center tracking-wider">
                  {backupCodes.map((code, idx) => (
                    <div key={idx} className="bg-slate-800/80 py-2 rounded-xl border border-slate-700/60">
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(backupCodes.join('\n'), 'Backup codes')}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:underline cursor-pointer"
                  >
                    <Copy className="h-4 w-4 text-slate-500" />
                    Copy Codes
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishSetup}
                    className="px-6 py-2.5 rounded-full bg-slate-900 text-xs font-bold text-white hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                  >
                    I Have Saved My Codes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Disable 2FA Re-authentication Modal */}
      {isDisableModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Disable Two-Factor Authentication?</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                For security, please enter your current password or a valid 6-digit 2FA code to confirm.
              </p>
            </div>

            <form onSubmit={handleDisableMfaSubmit} className="space-y-4">
              {!isGoogleOnly ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-2xl bg-slate-50 px-4 py-3 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all border border-slate-200"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">6-Digit 2FA Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center text-lg font-mono font-bold rounded-2xl bg-slate-50 px-4 py-3 text-slate-900 focus:outline-none focus:bg-slate-100/80 transition-all border border-slate-200"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsDisableModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDisablingMfa}
                  className="px-5 py-2.5 rounded-full bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs inline-flex items-center gap-2"
                >
                  {isDisablingMfa ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" />
                      Disabling...
                    </>
                  ) : (
                    'Confirm Disable'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Logging Out Other Sessions */}
      {isLogoutOtherModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 font-bold">
              <LogOut className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Log Out Other Sessions?</h3>
            <p className="text-xs font-medium text-slate-500 mt-1">
              This will immediately invalidate all active login sessions across your other browsers and mobile devices.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsLogoutOtherModalOpen(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogoutOtherSessions}
                disabled={isLoggingOutOthers}
                className="px-5 py-2.5 rounded-full bg-rose-600 text-xs font-bold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isLoggingOutOthers ? 'Logging out...' : 'Confirm Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
