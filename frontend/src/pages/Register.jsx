import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import GlassCard from '../components/GlassCard.jsx';
import { Mail, Lock, User, ArrowRight, ShieldAlert } from 'lucide-react';

export default function Register({ onNavigate, params = {}, showToast }) {
  const { redirect } = params;
  const { register } = useAuth();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // user, admin (only for easy testing)
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setValidationError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await register(name, email, password, role);
      showToast('Account registered successfully', 'success');
      
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

  return (
    <div className="w-full max-w-md mx-auto px-6 py-16 flex flex-col gap-6">
      <GlassCard hoverLift={false} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5 text-center">
          <h1 className="text-2xl font-extrabold tracking-tight">Create Account</h1>
          <p className="text-xs text-text-mutedLight dark:text-text-mutedDark">
            Sign up to build your studio workstation collection.
          </p>
        </div>

        {validationError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs font-semibold text-center">
            {validationError}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-text-mutedLight">Full Name</label>
            <div className="relative flex items-center">
              <input
                required
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
              <User className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-text-mutedLight">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                required
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
              />
              <Lock className="absolute left-3.5 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          {/* Developer Testing Role Option */}
          <div className="flex flex-col gap-1.5 border border-dashed border-slate-200 dark:border-slate-800 p-3 rounded-lg">
            <label className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
              Testing Privilege Mode
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                  className="accent-primary"
                />
                <span>Customer</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer text-secondary">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="accent-secondary"
                />
                <span>Administrator</span>
              </label>
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
                <span>Sign Up</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-text-mutedLight dark:text-text-mutedDark">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login', { redirect })}
            className="text-primary font-bold hover:underline"
          >
            Sign In
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
