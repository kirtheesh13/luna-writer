import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Feather,
  Flame,
  Layout,
  LogIn,
  LogOut,
  Mail,
  Menu,
  Moon,
  Palette,
  Scroll,
  Trophy,
  User,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout, openAuthModal } = useAuth();
  const { setIsCustomizerOpen } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stories', path: '/stories', icon: BookOpen },
    { name: 'Articles', path: '/articles', icon: Scroll },
    { name: 'Letters', path: '/letters', icon: Feather },
    { name: 'Emails', path: '/emails', icon: Mail },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md transition-transform group-hover:scale-105">
            <Moon className="h-5 w-5 fill-current" />
          </div>
          <div>
            <span className="font-serif text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Luna Writer
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Masterclass
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  active
                    ? 'bg-secondary text-primary shadow-xs font-semibold'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Appearance / Theme Customizer Button */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Appearance & Theme Presets"
            aria-label="Customize layout and colors"
          >
            <Palette className="h-4 w-4" />
          </button>

          {/* Writing Studio CTA Button */}
          <Link
            to="/studio"
            className="btn-tactile-3d hidden items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-primary-foreground sm:inline-flex"
          >
            <Feather className="h-3.5 w-3.5" />
            <span>Write</span>
          </Link>

          {/* User Sign-In or Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary ${
                  isActive('/dashboard') ? 'bg-secondary text-primary font-semibold' : 'text-foreground'
                }`}
              >
                <User className="h-4 w-4 text-primary" />
                <span className="hidden sm:inline max-w-[100px] truncate">{user.full_name}</span>
                {user.reading_streak > 0 && (
                  <span className="flex items-center text-xs font-bold text-amber-500" title={`${user.reading_streak} day reading streak!`}>
                    <Flame className="h-3.5 w-3.5 fill-current" />
                    {user.reading_streak}
                  </span>
                )}
              </Link>
              <button
                onClick={logout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <LogIn className="h-4 w-4 text-muted-foreground" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${
                    active ? 'bg-secondary text-primary font-semibold' : 'text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/studio"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground"
            >
              <Feather className="h-4 w-4" />
              <span>Writing Studio</span>
            </Link>
            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground hover:bg-secondary"
              >
                <Layout className="h-4 w-4 text-primary" />
                <span>My Vault & Drafts</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
