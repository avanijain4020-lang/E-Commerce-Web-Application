import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { Mail, Lock, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';

export default function Login({ onNavigate, params = {}, showToast }) {
  const { redirect } = params;
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!email.trim() || !password) {
      setValidationError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      showToast('Logged in successfully', 'success');
      
      if (redirect === 'checkout') {
        onNavigate('checkout');
      } else {
        onNavigate('home');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Login Utility
  const triggerQuickLogin = async (quickEmail, quickPassword, role) => {
    try {
      setLoading(true);
      setEmail(quickEmail);
      setPassword(quickPassword);
      await login(quickEmail, quickPassword);
      showToast(`Quick Logged in as ${role}`, 'success');
      
      if (redirect === 'checkout') {
        onNavigate('checkout');
      } else if (role === 'Admin') {
        onNavigate('admin');
      } else {
        onNavigate('home');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-6 py-16 flex flex-col gap-6">
      <GlassCard hoverLift={false} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Sign In</h1>
          <p className="text-xs text-text-mutedLight dark:text-text-mutedDark">
            Access your orders, cart preferences, and profile.
          </p>
        </div>

        {validationError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold text-center">
            {validationError}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-text-mutedLight">Email Address</label>
            <div className="relative flex items-center">
              <input
                required
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
              <Mail className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-text-mutedLight">Password</label>
            <div className="relative flex items-center">
              <input
                required
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-semibold glow-btn shadow-premium flex items-center justify-center gap-2 transition-all mt-2 disabled:opacity-75"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-mutedLight dark:text-text-mutedDark">
          Don't have an account?{' '}
          <button 
            onClick={() => onNavigate('register', { redirect })}
            className="text-primary font-bold hover:underline"
          >
            Sign Up
          </button>
        </div>
      </GlassCard>

      {/* Dev / Quick Test Accounts panel */}
      <GlassCard hoverLift={false} className="p-4 flex flex-col gap-3 bg-slate-50/50 dark:bg-slate-900/30">
        <span className="text-[10px] font-bold uppercase tracking-wider text-text-mutedLight dark:text-text-mutedDark text-center block">
          Development Quick Auth Tools
        </span>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => triggerQuickLogin('user@example.com', 'password123', 'Customer')}
            className="w-full py-2.5 px-4 rounded-xl border border-primary/20 hover:border-primary/45 bg-primary/5 hover:bg-primary/10 text-primary dark:text-primary-light text-xs font-semibold flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4" />
              <span>Login as Customer</span>
            </span>
            <span className="text-[10px] opacity-75">user@example.com</span>
          </button>
          
          <button
            onClick={() => triggerQuickLogin('admin@example.com', 'admin123', 'Admin')}
            className="w-full py-2.5 px-4 rounded-xl border border-secondary/20 hover:border-secondary/45 bg-secondary/5 hover:bg-secondary/10 text-secondary dark:text-secondary-light text-xs font-semibold flex items-center justify-between transition-all"
          >
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4" />
              <span>Login as Administrator</span>
            </span>
            <span className="text-[10px] opacity-75">admin@example.com</span>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
