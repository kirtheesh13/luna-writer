import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Feather,
  Flame,
  Globe,
  Layers,
  Mail,
  Moon,
  Scroll,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Zap,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export const HomePage: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const { setIsCustomizerOpen } = useTheme();

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['featured_writings'],
    queryFn: () => api.getWritings(),
    retry: 2,
  });

  const { data: achievements } = useQuery({
    queryKey: ['home_achievements'],
    queryFn: () => api.getAchievements(),
    retry: 1,
  });

  const categories = [
    {
      id: 'stories',
      title: 'Short Stories',
      desc: 'Imaginative narratives, rich sensory descriptions, and gripping character journeys.',
      icon: BookOpen,
      path: '/stories',
      gradient: 'from-purple-600/20 via-indigo-600/10 to-transparent',
      borderColor: 'group-hover:border-purple-500/60',
      badge: 'Narrative Craft',
      count: '10 Available',
      badgeColor: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    },
    {
      id: 'articles',
      title: 'Articles & Essays',
      desc: 'Insightful non-fiction, analytical reasoning, and structured educational discourse.',
      icon: Scroll,
      path: '/articles',
      gradient: 'from-blue-600/20 via-cyan-600/10 to-transparent',
      borderColor: 'group-hover:border-blue-500/60',
      badge: 'Logical Flow',
      count: '8 Available',
      badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    },
    {
      id: 'letters',
      title: 'Letters & Notes',
      desc: 'Formal inquiries, heartfelt personal letters, and persuasive correspondence.',
      icon: Feather,
      path: '/letters',
      gradient: 'from-amber-600/20 via-orange-600/10 to-transparent',
      borderColor: 'group-hover:border-amber-500/60',
      badge: 'Tone & Empathy',
      count: '8 Available',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    },
    {
      id: 'emails',
      title: 'Modern Emails',
      desc: 'Professional workplace communication, project updates, and polished polite messages.',
      icon: Mail,
      path: '/emails',
      gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
      borderColor: 'group-hover:border-emerald-500/60',
      badge: 'Concise Clarity',
      count: '8 Available',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* =================================================================== */}
      {/* 3D HERO SECTION: Breathtaking 3D Depth, Floating Celestial Badges   */}
      {/* =================================================================== */}
      <section className="perspective-1000 relative overflow-hidden rounded-4xl border border-border/80 glass-panel-3d p-8 sm:p-14 lg:p-16 shadow-2xl">
        
        {/* Dynamic Background Glow Orbs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-[120px] animate-pulse-glow" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-3d-sm backdrop-blur-md">
              <Sparkles className="h-4 w-4 animate-spin-slow" />
              <span>Transform from an ordinary reader into a true writer</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
              Evolve Your Language. <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Master the Art
              </span> of True Writing.
            </h1>

            <p className="text-sm sm:text-base leading-relaxed text-muted-foreground max-w-xl">
              Immerse yourself in four dedicated reading rooms, uncover vocabulary gems on every line, and practice in a private auto-saving studio. When you're ready, let AI verify your work and unlock your publication to the community showcase.
            </p>

            {/* 3D Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/stories"
                className="btn-3d-primary inline-flex items-center gap-2.5 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-3d-glow"
              >
                <BookOpen className="h-4 w-4" />
                <span>Explore Stories Library</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/studio"
                className="inline-flex items-center gap-2 rounded-2xl border border-border bg-secondary/80 px-6 py-3.5 text-sm font-bold text-foreground shadow-3d-sm transition-all hover:bg-secondary hover:scale-[1.02]"
              >
                <Feather className="h-4 w-4 text-primary" />
                <span>Open Writing Studio</span>
              </Link>

              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors py-2 px-1"
              >
                <span>🎨 7 Themes & 3D Presets</span>
              </button>
            </div>

            {/* Daily Reading Habit Tracker Bar */}
            <div className="mt-6 rounded-2xl border border-border/80 bg-secondary/40 p-4 shadow-3d-sm flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 shadow-3d-sm">
                  <Flame className="h-6 w-6 fill-current animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Today's Reading Momentum
                    </span>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/50">
                      Resets 12:00 AM Midnight
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-foreground mt-0.5">
                    {achievements?.today_count ?? 0} piece{(achievements?.today_count ?? 0) === 1 ? '' : 's'} read today • {achievements?.streak_days ?? 0} day streak
                  </p>
                </div>
              </div>

              <Link
                to="/achievements"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>Achievements Log →</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Column: 3D Celestial Floating Composition */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[320px]">
            
            {/* 3D Orbital Rings */}
            <div className="absolute h-72 w-72 sm:h-80 sm:w-80 rounded-full border border-primary/20 animate-orbit-3d" />
            <div className="absolute h-96 w-96 rounded-full border border-accent/20 animate-orbit-3d" style={{ animationDirection: 'reverse', animationDuration: '28s' }} />

            {/* Central 3D Celestial Orb */}
            <div className="relative flex h-40 w-40 sm:h-48 sm:w-48 items-center justify-center rounded-full sphere-3d-glow shadow-2xl animate-float-slow">
              <Moon className="h-16 w-16 sm:h-20 sm:w-20 text-white fill-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]" />
            </div>

            {/* Floating 3D Badge 1: CEFR Benchmark */}
            <div className="absolute -top-4 left-0 sm:left-4 rounded-2xl border border-white/20 bg-card/90 px-4 py-2.5 shadow-3d-md backdrop-blur-xl animate-float-reverse">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 shadow-sm" />
                <span className="text-xs font-bold text-foreground">CEFR A1 to C2 Standard</span>
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">International Rubric Engine</span>
            </div>

            {/* Floating 3D Badge 2: AI Gemini Power */}
            <div className="absolute -bottom-4 right-0 sm:right-4 rounded-2xl border border-white/20 bg-card/90 px-4 py-2.5 shadow-3d-md backdrop-blur-xl animate-float-slow">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-foreground">Gemini 2.5 AI Mentor</span>
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Structure & Vocabulary Check</span>
            </div>

            {/* Floating 3D Badge 3: 100% Autosave */}
            <div className="hidden sm:block absolute top-1/2 -right-8 -translate-y-1/2 rounded-2xl border border-white/20 bg-card/90 px-3.5 py-2 shadow-3d-md backdrop-blur-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Auto-Save Protected</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 4 DEDICATED READING ROOM PORTALS (3D Card Tilt on Hover)             */}
      {/* =================================================================== */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Curated Masterclass Libraries
            </span>
            <h2 className="mt-1 font-serif text-2xl sm:text-4xl font-extrabold text-foreground">
              Explore the 4 Reading Rooms
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Every room contains realistic write-ups, interactive vocabulary tools, and deep AI guides.
            </p>
          </div>
          <span className="text-xs font-semibold text-muted-foreground">
            34 Complete Write-Ups Ready
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.path}
                className={`group card-3d-interactive relative flex flex-col justify-between rounded-3xl border border-border/80 bg-gradient-to-b ${cat.gradient} p-7 shadow-3d-sm transition-all duration-300 ${cat.borderColor}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    {/* 3D Elevated Icon */}
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card shadow-3d-sm text-primary transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`rounded-xl border px-2.5 py-1 text-[11px] font-bold ${cat.badgeColor}`}>
                      {cat.count}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs font-bold text-primary">
                  <span>Enter Room</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-transform group-hover:translate-x-1.5">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3-STEP MASTERCLASS JOURNEY                                         */}
      {/* =================================================================== */}
      <section className="rounded-4xl border border-border glass-panel-3d p-8 sm:p-12 shadow-xl">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">How You Evolve</span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-extrabold text-foreground">
            The 3-Step Path to Becoming a True Writer
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
            A practical, empowering methodology built into every interaction on this platform.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Step 1 */}
          <div className="rounded-3xl border border-border/80 bg-card/60 p-6 shadow-3d-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 font-serif font-black text-lg shadow-xs">
                01
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-foreground">
                Read, Absorb & Save Words
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Click any word while reading to hear pronunciation, reveal rich definitions, and save directly to your Vocabulary Vault for daily mastery.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-primary">
              Builds effortless vocabulary
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-3xl border border-border/80 bg-card/60 p-6 shadow-3d-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 font-serif font-black text-lg shadow-xs">
                02
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-foreground">
                Write with Auto-Save Peace
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Choose Story, Article, Letter, or Email. Auto-save ensures not a single phrase is lost, or upload existing Word documents (.docx) seamlessly.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-primary">
              Distraction-free focus
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-3xl border border-border/80 bg-card/60 p-6 shadow-3d-sm flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 font-serif font-black text-lg shadow-xs">
                03
              </div>
              <h3 className="mt-5 font-serif text-lg font-bold text-foreground">
                The A1+ Publishing Milestone
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Gemini AI reviews your draft. If it reaches the A1 CEFR standard, public publishing unlocks! If not, a polite alert lets you save privately to keep practicing.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-border/50 text-[11px] font-semibold text-primary">
              Real quality validation
            </div>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* FEATURED WRITINGS SHOWCASE (Always populated)                      */}
      {/* =================================================================== */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-foreground">
              Featured Community Pieces
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Sample the stories, letters, and articles crafted by our community.
            </p>
          </div>
          <Link
            to="/stories"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Stories</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredData?.items?.slice(0, 6).map((writing) => (
            <Link
              key={writing.id}
              to={`/reader/${writing.id}`}
              className="card-3d-interactive group flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-6 shadow-3d-sm transition-all hover:border-primary/50"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-lg border border-border/80 bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    {writing.category}
                  </span>
                  <span className="rounded-lg bg-primary/10 text-primary px-2.5 py-1 text-[10px] font-bold">
                    CEFR Level {writing.level}
                  </span>
                </div>

                <h3 className="mt-4 font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {writing.title}
                </h3>
                
                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {writing.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{writing.author_name}</span>
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  {writing.reading_time_minutes} min read
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
};
