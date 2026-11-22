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
import { Interactive3DCard } from '@/components/Interactive3DCard';
import { Celestial3DScene } from '@/components/Celestial3DScene';

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
      gradient: 'from-purple-600/25 via-indigo-600/10 to-transparent',
      borderColor: 'border-purple-500/30 hover:border-purple-400/70',
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
      gradient: 'from-blue-600/25 via-cyan-600/10 to-transparent',
      borderColor: 'border-blue-500/30 hover:border-blue-400/70',
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
      gradient: 'from-amber-600/25 via-orange-600/10 to-transparent',
      borderColor: 'border-amber-500/30 hover:border-amber-400/70',
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
      gradient: 'from-emerald-600/25 via-teal-600/10 to-transparent',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/70',
      badge: 'Concise Clarity',
      count: '8 Available',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    },
  ];

  return (
    <div className="space-y-20 pb-16">
      
      {/* =================================================================== */}
      {/* 3D HERO SECTION: Interactive 3D WebGL Armillary Sphere & Dynamic Depth */}
      {/* =================================================================== */}
      <section className="perspective-1000 relative overflow-hidden rounded-4xl border border-border/80 glass-panel-3d p-8 sm:p-14 lg:p-16 shadow-2xl">
        
        {/* Dynamic Background Glow Orbs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px] animate-pulse-glow" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-accent/20 blur-[120px] animate-pulse-glow" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary shadow-sm backdrop-blur-md">
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

            {/* 3D Tactile Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/stories"
                className="btn-tactile-3d inline-flex items-center gap-2.5 rounded-2xl px-7 py-3.5 text-sm font-bold text-primary-foreground"
              >
                <BookOpen className="h-4 w-4" />
                <span>Explore Stories Library</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/studio"
                className="btn-tactile-secondary inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-foreground"
              >
                <Feather className="h-4 w-4 text-primary" />
                <span>Open Writing Studio</span>
              </Link>

              <button
                onClick={() => setIsCustomizerOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors py-2 px-1"
              >
                <span>🎨 7 Themes & Typography</span>
              </button>
            </div>

            {/* Daily Reading Habit Tracker Bar */}
            <div className="mt-6 rounded-2xl border border-border/80 bg-secondary/40 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-500 shadow-sm">
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

          {/* Right Hero Column: Interactive Three.js 3D Celestial Canvas with Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[360px] sm:min-h-[420px] preserve-3d">
            
            {/* The Interactive 3D Canvas */}
            <Celestial3DScene className="w-full h-full" />

            {/* Floating 3D Badge 1: CEFR International Standard */}
            <div className="absolute top-4 left-0 sm:-left-4 rounded-2xl border border-white/20 bg-card/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl translate-z-lg animate-float-3d">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-emerald-400 shadow-sm" />
                <span className="text-xs font-bold text-foreground">CEFR A1 to C2 Standard</span>
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">International Rubric Engine</span>
            </div>

            {/* Floating 3D Badge 2: AI Gemini Power */}
            <div className="absolute bottom-4 right-0 sm:-right-4 rounded-2xl border border-white/20 bg-card/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl translate-z-lg animate-float-3d" style={{ animationDelay: '1.5s' }}>
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-foreground">Gemini 2.5 AI Mentor</span>
              </div>
              <span className="text-[10px] text-muted-foreground block mt-0.5">Structure & Vocabulary Check</span>
            </div>

            {/* Floating 3D Badge 3: 100% Autosave Vault */}
            <div className="hidden sm:block absolute top-1/2 -right-6 -translate-y-1/2 rounded-2xl border border-white/20 bg-card/90 px-3.5 py-2 shadow-2xl backdrop-blur-xl translate-z-md">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Auto-Save Protected</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 4 DEDICATED READING ROOM PORTALS (Interactive 3D Mouse Tilt Cards)   */}
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
              Move your cursor over each portal to inspect the room with real-time 3D tilt and specular lighting.
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
              <Interactive3DCard
                key={cat.id}
                maxTilt={10}
                glareOpacity={0.22}
                scaleOnHover={1.03}
                className="h-full rounded-3xl"
              >
                <Link
                  to={cat.path}
                  className={`group relative flex flex-col justify-between h-full rounded-3xl border ${cat.borderColor} bg-gradient-to-b ${cat.gradient} p-7 shadow-lg transition-colors duration-300 preserve-3d`}
                >
                  <div className="preserve-3d">
                    <div className="flex items-center justify-between">
                      {/* 3D Elevated Floating Icon in Z-Space */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-card shadow-md text-primary transition-transform duration-300 group-hover:scale-110 translate-z-md">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${cat.badgeColor} translate-z-sm`}>
                        {cat.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors translate-z-sm">
                      {cat.title}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed translate-z-xs">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-border/50 pt-4 text-xs font-semibold text-foreground/80 translate-z-sm">
                    <span className="text-muted-foreground">{cat.count}</span>
                    <span className="inline-flex items-center gap-1 text-primary group-hover:translate-x-1 transition-transform">
                      <span>Enter Room</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Interactive3DCard>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 3-STEP MASTERCLASS SYSTEM: Interactive 3D Depth Steps               */}
      {/* =================================================================== */}
      <section className="rounded-4xl border border-border/80 glass-panel-3d p-8 sm:p-12 shadow-2xl">
        <div className="max-w-2xl">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
            How Luna Writer Works
          </span>
          <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-extrabold text-foreground">
            The 3-Step Reading & Writing Masterclass
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Move seamlessly from absorbing masterclass prose to drafting your own work, with guaranteed AI evaluation and real publication milestones.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          
          {/* Step 1 */}
          <Interactive3DCard maxTilt={8} glareOpacity={0.2} className="rounded-3xl">
            <div className="h-full rounded-3xl border border-border/80 bg-card/70 p-6 shadow-md flex flex-col justify-between preserve-3d">
              <div className="preserve-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-400 font-serif font-black text-lg shadow-sm translate-z-md">
                  01
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-foreground translate-z-sm">
                  Read, Absorb & Save Words
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed translate-z-xs">
                  Click any word while reading to hear pronunciation, reveal rich definitions, and save directly to your Vocabulary Vault for daily mastery.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/50 text-[11px] font-semibold text-primary translate-z-xs">
                Builds effortless vocabulary
              </div>
            </div>
          </Interactive3DCard>

          {/* Step 2 */}
          <Interactive3DCard maxTilt={8} glareOpacity={0.2} className="rounded-3xl">
            <div className="h-full rounded-3xl border border-border/80 bg-card/70 p-6 shadow-md flex flex-col justify-between preserve-3d">
              <div className="preserve-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-400 font-serif font-black text-lg shadow-sm translate-z-md">
                  02
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-foreground translate-z-sm">
                  Write with Auto-Save Peace
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed translate-z-xs">
                  Choose Story, Article, Letter, or Email. Auto-save ensures not a single phrase is lost, or upload existing Word documents (.docx) seamlessly.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/50 text-[11px] font-semibold text-primary translate-z-xs">
                Distraction-free focus
              </div>
            </div>
          </Interactive3DCard>

          {/* Step 3 */}
          <Interactive3DCard maxTilt={8} glareOpacity={0.2} className="rounded-3xl">
            <div className="h-full rounded-3xl border border-border/80 bg-card/70 p-6 shadow-md flex flex-col justify-between preserve-3d">
              <div className="preserve-3d">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 font-serif font-black text-lg shadow-sm translate-z-md">
                  03
                </div>
                <h3 className="mt-5 font-serif text-lg font-bold text-foreground translate-z-sm">
                  The A1+ Publishing Milestone
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed translate-z-xs">
                  Gemini AI reviews your draft. If it reaches the A1 CEFR standard, public publishing unlocks! If not, a polite alert lets you save privately to keep practicing.
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-border/50 text-[11px] font-semibold text-primary translate-z-xs">
                Real quality validation
              </div>
            </div>
          </Interactive3DCard>

        </div>
      </section>

      {/* =================================================================== */}
      {/* FEATURED WRITINGS SHOWCASE: Responsive 3D Tilt Cards                */}
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
            <Interactive3DCard
              key={writing.id}
              maxTilt={8}
              glareOpacity={0.16}
              scaleOnHover={1.02}
              className="rounded-3xl h-full"
            >
              <Link
                to={`/reader/${writing.id}`}
                className="group flex flex-col justify-between h-full rounded-3xl border border-border/80 bg-card p-6 shadow-md transition-colors hover:border-primary/50 preserve-3d"
              >
                <div className="preserve-3d">
                  <div className="flex items-center justify-between translate-z-sm">
                    <span className="rounded-lg border border-border/80 bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {writing.category}
                    </span>
                    <span className="rounded-lg bg-primary/10 text-primary px-2.5 py-1 text-[10px] font-bold">
                      CEFR Level {writing.level}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors translate-z-sm">
                    {writing.title}
                  </h3>
                  
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed translate-z-xs">
                    {writing.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground translate-z-xs">
                  <span className="font-medium text-foreground">{writing.author_name}</span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Clock className="h-3.5 w-3.5" />
                    {writing.reading_time_minutes} min read
                  </span>
                </div>
              </Link>
            </Interactive3DCard>
          ))}
        </div>
      </section>

    </div>
  );
};
