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

export const AchievementsPage: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.getAchievements(),
  });

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500 shadow-xs">
            <Trophy className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Achievements & Reading Habits
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-2xl">
              Cultivating the habit of daily reading is the foundation of becoming a true writer. Track your daily reads, weekly averages, and milestones.
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Key Stat Cards Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Today's Reads (Resets at 12 AM) */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Today's Reads
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-foreground">
                  {stats.today_count}
                </span>
                <span className="text-xs text-muted-foreground">pieces read today</span>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground/80 flex items-center gap-1">
                <span>🔄</span>
                <span>Automatically resets at 12:00 AM midnight</span>
              </p>
            </div>

            {/* Card 2: Weekly Average */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Weekly Average
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-foreground">
                  {stats.weekly_average}
                </span>
                <span className="text-xs text-muted-foreground">per day (7 days)</span>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                {stats.weekly_total} total pieces completed this week
              </p>
            </div>

            {/* Card 3: Reading Streak */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Active Streak
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <Flame className="h-4 w-4 fill-current" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-foreground">
                  {stats.streak_days}
                </span>
                <span className="text-xs text-muted-foreground">consecutive day{stats.streak_days === 1 ? '' : 's'}</span>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Read once daily to keep your streak glowing!
              </p>
            </div>

            {/* Card 4: All-Time Completed */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total Completed
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-extrabold text-foreground">
                  {stats.total_completed}
                </span>
                <span className="text-xs text-muted-foreground">writings finished</span>
              </div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Knowledge and vocabulary gained forever
              </p>
            </div>
          </div>

          {/* Milestone Badges Section */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                Milestone Badges
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Earn badges as you read across diverse categories and build reading momentum.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.badges.map((b) => (
                <div
                  key={b.id}
                  className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                    b.unlocked
                      ? 'border-primary/40 bg-secondary/40 shadow-xs'
                      : 'border-border/60 bg-secondary/10 opacity-60'
                  }`}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-card border border-border text-2xl shadow-xs">
                    {b.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-foreground">{b.name}</h4>
                      {b.unlocked && (
                        <span className="rounded-md bg-emerald-500/15 text-emerald-500 px-1.5 py-0.5 text-[10px] font-bold">
                          Unlocked ✓
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{b.description}</p>
                    {b.progress && (
                      <span className="mt-2 block text-[10px] font-semibold text-primary">
                        Progress: {b.progress}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reading History Log */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
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
              <div className="divide-y divide-border/60 rounded-xl border border-border overflow-hidden">
                {stats.recent_history.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-background/50 hover:bg-secondary/30 transition-colors gap-3"
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
                        className="rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-secondary/70 transition-colors"
                      >
                        Read Again
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border p-10 text-center">
                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/50" />
                <h4 className="mt-3 font-serif font-bold text-base text-foreground">
                  No readings completed yet
                </h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Open any story, article, letter, or email and click "✅ Finished Reading" at the bottom to log your first achievement!
                </p>
                <Link
                  to="/stories"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
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
