import React, { useState } from 'react';
import { AlertCircle, Lock, Mail, Moon, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authMode, closeAuthModal, openAuthModal, login, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (authMode === 'login') {
        await login(email, password);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your name.');
        }
        await register(email, password, fullName);
      }
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Moon className="h-6 w-6 fill-current" />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold text-card-foreground">
            {authMode === 'login' ? 'Welcome Back, Writer' : 'Create Your Writer Account'}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            {authMode === 'login'
              ? 'Sign in to access your private drafts, word vault, and progress.'
              : 'Join to save your writings, build your vocabulary bank, and track growth.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="mt-6 flex rounded-xl border border-border bg-secondary/50 p-1">
          <button
            type="button"
            onClick={() => { setError(null); openAuthModal('login'); }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              authMode === 'login'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setError(null); openAuthModal('register'); }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              authMode === 'register'
                ? 'bg-card text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-card-foreground">Your Full Name</label>
              <div className="relative mt-1">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Austen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-card-foreground">Email Address</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-card-foreground">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary-hover disabled:opacity-50"
          >
            {isSubmitting
              ? 'Please wait...'
              : authMode === 'login'
              ? 'Sign In to Studio'
              : 'Create My Free Account'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Your writings are saved safely and kept private until you choose to publish them.
        </p>
      </div>
    </div>
  );
};
