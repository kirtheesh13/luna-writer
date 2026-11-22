import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Feather,
  Filter,
  Mail,
  RefreshCw,
  Scroll,
  Search,
  Sparkles,
  Star,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CategoryType, CefrLevel } from '@/types';
import { Interactive3DCard } from '@/components/Interactive3DCard';

interface CategoryPageProps {
  category: CategoryType;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category }) => {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<CefrLevel | 'All'>('All');

  const metaMap: Record<
    CategoryType,
    {
      title: string;
      subtitle: string;
      icon: any;
      singTitle: string;
      portalGradient: string;
      accentBadge: string;
    }
  > = {
    stories: {
      title: 'Short Stories & Fiction',
      subtitle: 'Immerse yourself in vivid narratives, character journeys, and evocative literary prose.',
      icon: BookOpen,
      singTitle: 'Story',
      portalGradient: 'from-purple-900/30 via-indigo-900/15 to-card/90',
      accentBadge: 'Narrative Sanctuary',
    },
    articles: {
      title: 'Articles & Essays',
      subtitle: 'Explore informative non-fiction, analytical reasoning, and structured formal discourse.',
      icon: Scroll,
      singTitle: 'Article',
      portalGradient: 'from-blue-900/30 via-cyan-900/15 to-card/90',
      accentBadge: 'Logical Clarity',
    },
    letters: {
      title: 'Letters & Notes',
      subtitle: 'Study formal requests, persuasive correspondence, and heartfelt personal letters.',
      icon: Feather,
      singTitle: 'Letter',
      portalGradient: 'from-amber-900/30 via-orange-900/15 to-card/90',
      accentBadge: 'Tone & Heart',
    },
    emails: {
      title: 'Practical Emails',
      subtitle: 'Master modern workplace correspondence, polite follow-ups, and concise communications.',
      icon: Mail,
      singTitle: 'Email',
      portalGradient: 'from-emerald-900/30 via-teal-900/15 to-card/90',
      accentBadge: 'Everyday Mastery',
    },
  };

  const meta = metaMap[category];
  const Icon = meta.icon;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['writings', category, search, selectedLevel],
    queryFn: () =>
      api.getWritings({
        category,
        search: search.trim() || undefined,
        level: selectedLevel === 'All' ? undefined : selectedLevel,
      }),
    retry: 2,
    staleTime: 1000 * 30,
  });

  const levels: (CefrLevel | 'All')[] = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* =================================================================== */}
      {/* 3D CATEGORY PORTAL HEADER                                           */}
      {/* =================================================================== */}
      <div
        className={`perspective-1000 relative overflow-hidden rounded-4xl border border-border/80 bg-gradient-to-br ${meta.portalGradient} p-8 sm:p-12 shadow-2xl glass-panel-3d`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* 3D Dimensional Portal Icon */}
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-card text-primary shadow-xl">
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {meta.accentBadge}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {data?.total ?? (data?.items?.length || 0)} pieces in library
                </span>
              </div>

              <h1 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
                {meta.title}
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {meta.subtitle}
              </p>
            </div>
          </div>

          {/* 3D Tactile Write Button */}
          <Link
            to={`/studio?category=${category}`}
            className="btn-tactile-3d inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-bold text-primary-foreground shrink-0 self-start sm:self-auto"
          >
            <Feather className="h-4 w-4" />
            <span>Write a {meta.singTitle}</span>
          </Link>
        </div>

        {/* 3D Filter & Search Toolbar */}
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${category} by title, description, or topic...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-input bg-background/80 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20 shadow-inner"
            />
          </div>

          {/* CEFR Level Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-muted-foreground mr-1 hidden sm:inline">
              CEFR Filter:
            </span>
            {levels.map((lvl) => {
              const active = selectedLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all shrink-0 ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-md scale-105'
                      : 'border border-border/70 bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* =================================================================== */}
      {/* WRITINGS GRID (Interactive 3D Mouse-Tilt Cards)                     */}
      {/* =================================================================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-56 rounded-3xl border border-border bg-card p-6 shadow-md animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center space-y-3">
          <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
          <h3 className="font-serif text-lg font-bold text-foreground">
            Connection Connecting...
          </h3>
          <p className="text-xs text-muted-foreground">
            The server was just started. Click below to refresh your reading room.
          </p>
          <button
            onClick={() => refetch()}
            className="btn-tactile-3d inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-primary-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reload {meta.title}</span>
          </button>
        </div>
      ) : data?.items && data.items.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((writing) => (
            <Interactive3DCard
              key={writing.id}
              maxTilt={8}
              glareOpacity={0.18}
              scaleOnHover={1.025}
              className="h-full rounded-3xl"
            >
              <Link
                to={`/reader/${writing.id}`}
                className="group flex flex-col justify-between h-full rounded-3xl border border-border/80 bg-card p-6 shadow-md transition-colors duration-300 hover:border-primary/50 preserve-3d"
              >
                <div className="preserve-3d">
                  <div className="flex items-center justify-between translate-z-sm">
                    <span className="rounded-lg bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-[11px] font-bold">
                      CEFR Level {writing.level}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {writing.reading_time_minutes} min read
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug translate-z-sm">
                    {writing.title}
                  </h3>
                  
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed translate-z-xs">
                    {writing.description || writing.content}
                  </p>

                  {writing.tags && writing.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5 translate-z-xs">
                      {writing.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border/60 bg-secondary/40 px-2 py-0.5 text-[10px] text-muted-foreground font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-xs translate-z-xs">
                  <span className="text-muted-foreground truncate max-w-[140px] font-medium">
                    By {writing.author_name}
                  </span>
                  <span className="font-bold text-primary group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1">
                    Read & Learn →
                  </span>
                </div>
              </Link>
            </Interactive3DCard>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-3">
          <Icon className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <h3 className="font-serif text-xl font-bold text-foreground">
            No {category} found
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            {search || selectedLevel !== 'All'
              ? 'Try clearing your search term or level filter to explore all available pieces.'
              : `Be the very first writer to publish an inspiring ${meta.singTitle} to this room!`}
          </p>
          <div className="pt-2">
            <Link
              to={`/studio?category=${category}`}
              className="btn-tactile-3d inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-primary-foreground"
            >
              <Feather className="h-4 w-4" />
              <span>Write a {meta.singTitle} Now</span>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
};
