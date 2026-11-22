import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  History,
  Sparkles,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Interactive3DCard } from '@/components/Interactive3DCard';

export const AchievementsPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.getAchievements(),
  });

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-4xl border border-border/80 glass-panel-3d p-6 sm:p-10 shadow-2xl">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-amber-500/15 text-amber-500 border border-amber-500/20 shadow-md">
            <Trophy className="h-7 w-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary mb-2">
              <Sparkles className="h-3 w-3" />
              <span>Habit & Mastery Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Achievements & Reading Habits
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Cultivating the habit of daily reading is the foundation of becoming a true writer. Track your daily reads, weekly averages, and milestones with automatic midnight resets.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-36 rounded-3xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Key Stat Cards Grid (Interactive 3D Tilt Cards) */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Today's Reads (Resets at 12 AM) */}
            <Interactive3DCard maxTilt={10} glareOpacity={0.2} className="rounded-3xl h-full">
              <div className="h-full rounded-3xl border border-primary/30 bg-card p-6 shadow-md flex flex-col justify-between preserve-3d">
                <div className="preserve-3d">
                  <div className="flex items-center justify-between translate-z-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Today's Reads
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary shadow-xs">
                      <BookOpen className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2 translate-z-md">
                    <span className="font-serif text-4xl font-extrabold text-foreground">
                      {stats.today_count}
                    </span>
                    <span className="text-xs text-muted-foreground">pieces read today</span>
                  </div>
                </div>
                <p className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground/90 flex items-center gap-1.5 translate-z-xs">
                  <span>🔄</span>
                  <span>Automatically resets at 12:00 AM midnight</span>
                </p>
              </div>
            </Interactive3DCard>

            {/* Card 2: Weekly Average */}
            <Interactive3DCard maxTilt={10} glareOpacity={0.2} className="rounded-3xl h-full">
              <div className="h-full rounded-3xl border border-blue-500/30 bg-card p-6 shadow-md flex flex-col justify-between preserve-3d">
                <div className="preserve-3d">
                  <div className="flex items-center justify-between translate-z-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Weekly Average
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-400 shadow-xs">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2 translate-z-md">
                    <span className="font-serif text-4xl font-extrabold text-foreground">
                      {stats.weekly_average}
                    </span>
                    <span className="text-xs text-muted-foreground">per day (7 days)</span>
                  </div>
                </div>
                <p className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground translate-z-xs">
                  {stats.weekly_total} total pieces completed this week
                </p>
              </div>
            </Interactive3DCard>

            {/* Card 3: Reading Streak */}
            <Interactive3DCard maxTilt={10} glareOpacity={0.2} className="rounded-3xl h-full">
              <div className="h-full rounded-3xl border border-amber-500/30 bg-card p-6 shadow-md flex flex-col justify-between preserve-3d">
                <div className="preserve-3d">
                  <div className="flex items-center justify-between translate-z-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Active Streak
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 shadow-xs">
                      <Flame className="h-4 w-4 fill-current animate-bounce" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2 translate-z-md">
                    <span className="font-serif text-4xl font-extrabold text-foreground">
                      {stats.streak_days}
                    </span>
                    <span className="text-xs text-muted-foreground">consecutive day{stats.streak_days === 1 ? '' : 's'}</span>
                  </div>
                </div>
                <p className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground translate-z-xs">
                  Read once daily to keep your streak glowing!
                </p>
              </div>
            </Interactive3DCard>

            {/* Card 4: All-Time Completed */}
            <Interactive3DCard maxTilt={10} glareOpacity={0.2} className="rounded-3xl h-full">
              <div className="h-full rounded-3xl border border-emerald-500/30 bg-card p-6 shadow-md flex flex-col justify-between preserve-3d">
                <div className="preserve-3d">
                  <div className="flex items-center justify-between translate-z-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Total Completed
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 shadow-xs">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2 translate-z-md">
                    <span className="font-serif text-4xl font-extrabold text-foreground">
                      {stats.total_completed}
                    </span>
                    <span className="text-xs text-muted-foreground">writings finished</span>
                  </div>
                </div>
                <p className="mt-4 pt-3 border-t border-border/50 text-[10px] text-muted-foreground translate-z-xs">
                  Knowledge and vocabulary gained forever
                </p>
              </div>
            </Interactive3DCard>
          </div>

          {/* Milestone Badges Section (Interactive 3D Holographic Badges) */}
          <div className="rounded-4xl border border-border/80 glass-panel-3d p-6 sm:p-10 space-y-6 shadow-xl">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-foreground">
                Milestone Badges
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Hover over badges to examine their 3D holographic sheen and unlock status.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats.badges.map((b) => (
                <Interactive3DCard
                  key={b.id}
                  maxTilt={12}
                  glareOpacity={b.unlocked ? 0.25 : 0.08}
                  scaleOnHover={1.03}
                  className="rounded-3xl"
                >
                  <div
                    className={`flex items-start gap-4 rounded-3xl border p-5 transition-all preserve-3d ${
                      b.unlocked
                        ? 'border-primary/40 bg-card shadow-lg'
                        : 'border-border/60 bg-secondary/20 opacity-60'
                    }`}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary border border-border/80 text-3xl shadow-md translate-z-md">
                      {b.icon}
                    </div>
                    <div className="flex-1 preserve-3d">
                      <div className="flex items-center justify-between translate-z-sm">
                        <h4 className="font-serif font-bold text-sm text-foreground">{b.name}</h4>
                        {b.unlocked && (
                          <span className="rounded-md bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[10px] font-bold border border-emerald-500/20">
                            Unlocked ✓
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed translate-z-xs">{b.description}</p>
                      {b.progress && (
                        <span className="mt-2.5 block text-[10px] font-semibold text-primary translate-z-xs">
                          Progress: {b.progress}
                        </span>
                      )}
                    </div>
                  </div>
                </Interactive3DCard>
              ))}
            </div>
          </div>

          {/* Reading History Log */}
          <div className="rounded-4xl border border-border/80 bg-card p-6 sm:p-10 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
                  <History className="h-5 w-5 text-primary" />
                  <span>Reading Activity History</span>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Every writing you finished reading, recorded securely in the database.
                </p>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {stats.recent_history.length} record{stats.recent_history.length === 1 ? '' : 's'}
              </span>
            </div>

            {stats.recent_history.length > 0 ? (
              <div className="divide-y divide-border/60 rounded-2xl border border-border overflow-hidden shadow-inner">
                {stats.recent_history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background/50 hover:bg-secondary/40 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div>
                        <Link
                          to={`/reader/${item.writing_id}`}
                          className="font-serif text-sm font-bold text-foreground hover:text-primary transition-colors"
                        >
                          {item.writing_title}
                        </Link>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="capitalize">{item.category}</span>
                          <span>•</span>
                          <span>{item.word_count} words</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground self-end sm:self-auto">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {item.read_date}
                      </span>
                      <Link
                        to={`/reader/${item.writing_id}`}
                        className="btn-tactile-secondary rounded-xl px-3 py-1.5 text-xs font-semibold text-foreground inline-flex items-center"
                      >
                        Read Again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-10 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <h4 className="mt-3 font-serif font-bold text-base text-foreground">
                  No readings completed yet
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Open any story, article, letter, or email and click "✅ Finished Reading" at the bottom to log your first achievement!
                </p>
                <Link
                  to="/stories"
                  className="btn-tactile-3d mt-4 inline-flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-xs font-bold text-primary-foreground"
                >
                  <span>Browse Stories</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>
        </>
      ) : null}

    </div>
  );
};
