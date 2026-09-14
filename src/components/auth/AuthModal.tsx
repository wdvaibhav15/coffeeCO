import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, user, logout } = useApp();

  // Mode: 'login' | 'signup' | 'forgot' | 'verify'
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot' | 'verify'>('login');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!email || !password) {
      setAuthError('Please enter both email and password.');
      return;
    }

    login(email, 'customer');
    setIsAuthModalOpen(false);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!name || !email || !password) {
      setAuthError('Please fill out all required fields.');
      return;
    }
    // simulate email verification prompt
    setMode('verify');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, 'customer');
    setIsAuthModalOpen(false);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setAuthError('Please enter your account email.');
      return;
    }
    setResetEmailSent(true);
  };

  const handleSocialLogin = (provider: 'Google' | 'GitHub' | 'Facebook') => {
    login(`${provider.toLowerCase()}.coffee.lover@example.com`, 'customer');
    setIsAuthModalOpen(false);
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setIsAuthModalOpen(false)}
    >
      <div
        id="auth-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#130d0a] border border-amber-950/60 rounded-3xl shadow-2xl p-6 sm:p-8 text-stone-200 relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-600/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="btn-close-auth-modal"
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            <span>Velvet Roast Club</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-100">
            {mode === 'login' && 'Welcome Back, Barista'}
            {mode === 'signup' && 'Create Roastery Account'}
            {mode === 'forgot' && 'Reset Account Password'}
            {mode === 'verify' && 'Verify Your Email'}
          </h2>
          <p className="text-xs text-stone-400">
            {mode === 'login' && 'Sign in to access your bean subscriptions, points & order history'}
            {mode === 'signup' && 'Join our Coffee Club and earn 100 bonus bean reward points instantly'}
            {mode === 'forgot' && 'Enter your email address and we will dispatch a reset link'}
            {mode === 'verify' && `We sent a 6-digit verification code to ${email}`}
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs text-center">
            {authError}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-stone-300 block mb-1 font-semibold">Email Address</label>
              <div className="relative">
                <input
                  id="input-login-email"
                  type="email"
                  required
                  placeholder="barista@velvetroast.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-stone-300 font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-amber-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="input-login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-stone-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-stone-900 border-stone-800 text-amber-600 focus:ring-amber-500"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>JWT Secure</span>
              </span>
            </div>

            <button
              id="btn-auth-submit-login"
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/60 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Velvet Roast</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* SIGN UP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
            <div>
              <label className="text-stone-300 block mb-1 font-semibold">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Julian Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                />
                <User className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-stone-300 block mb-1 font-semibold">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="julian@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-stone-300 block mb-1 font-semibold">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-950/60 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Account & Get 100 Points</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <div className="space-y-4 text-xs">
            {resetEmailSent ? (
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-emerald-200">Reset instructions dispatched!</div>
                <p className="text-stone-300 text-[11px]">
                  Check your inbox for <strong>{email}</strong> to set a new password.
                </p>
                <button
                  onClick={() => setMode('login')}
                  className="text-amber-400 font-bold hover:underline block mx-auto pt-2"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="text-stone-300 block mb-1 font-semibold">Account Email</label>
                  <input
                    type="email"
                    required
                    placeholder="julian@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
                >
                  Send Password Reset Link
                </button>
              </form>
            )}
          </div>
        )}

        {/* EMAIL VERIFICATION SIMULATOR */}
        {mode === 'verify' && (
          <form onSubmit={handleVerificationSubmit} className="space-y-4 text-xs text-center">
            <div>
              <label className="text-stone-300 block mb-2 font-semibold">Enter 6-Digit PIN Code</label>
              <input
                type="text"
                maxLength={6}
                placeholder="748291"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-48 mx-auto tracking-widest text-center text-lg font-mono px-3 py-2 rounded-xl bg-stone-900 text-amber-300 border border-amber-500/60 focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold"
            >
              Verify & Enter Roastery
            </button>
          </form>
        )}

        {/* Social Logins Divider */}
        {mode !== 'verify' && (
          <div className="mt-6 pt-5 border-t border-stone-800 space-y-3">
            <div className="relative flex justify-center text-[10px] uppercase text-stone-500">
              <span className="bg-[#130d0a] px-2 font-bold tracking-wider">Or continue with</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] font-semibold text-stone-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('GitHub')}
                className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] font-semibold text-stone-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-[11px] font-semibold text-stone-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Facebook</span>
              </button>
            </div>

            {/* Toggle Mode Switcher */}
            <div className="text-center pt-2 text-xs text-stone-400">
              {mode === 'login' ? (
                <div>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signup');
                      setAuthError('');
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Join the Club
                  </button>
                </div>
              ) : (
                <div>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setAuthError('');
                    }}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
