import React from 'react';
import { Check, Compass, Eye, Sliders, Sparkles, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { FontSize, FontType, ReadingWidthType, ThemeType } from '@/types';

export const AppearanceDrawer: React.FC = () => {
  const {
    theme,
    setTheme,
    font,
    setFont,
    readingWidth,
    setReadingWidth,
    fontSize,
    setFontSize,
    isCustomizerOpen,
    setIsCustomizerOpen,
  } = useTheme();

  if (!isCustomizerOpen) return null;

  const themes: {
    id: ThemeType;
    name: string;
    desc: string;
    previewBg: string;
    accentHex: string;
    badge: string;
    mood: string;
  }[] = [
    {
      id: 'midnight',
      name: 'Modern Midnight',
      desc: 'Deep cosmic obsidian with moonlit violet glow & starlight',
      previewBg: 'from-[#050811] to-[#0a1020]',
      accentHex: '#8b5cf6',
      badge: 'Signature Celestial',
      mood: '🌌 Immersive & Focused',
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Holo-Writer',
      desc: 'High-tech neon cyan laser, pulsing magenta & dark matrix grid',
      previewBg: 'from-[#040714] to-[#090e24]',
      accentHex: '#00f0ff',
      badge: '3D Futuristic',
      mood: '⚡ High Energy & Modern',
    },
    {
      id: 'oxford',
      name: 'Oxford Vintage Study',
      desc: 'Antique ivory parchment, burnished leather & gold leaf script',
      previewBg: 'from-[#f9f5ed] to-[#efe7d6]',
      accentHex: '#994714',
      badge: 'Classic Scholarly',
      mood: '☕ Warm & Scholarly',
    },
    {
      id: 'emerald',
      name: 'Emerald Sanctuary',
      desc: 'Deep jade moss, radiant botanical sunlight & calming forest glass',
      previewBg: 'from-[#03140e] to-[#082218]',
      accentHex: '#1cd579',
      badge: 'Zen Nature',
      mood: '🍃 Calming & Serene',
    },
    {
      id: 'sunset',
      name: 'Synthwave Sunset',
      desc: 'Twilight plum horizons, vibrant neon coral & warm evening peach',
      previewBg: 'from-[#120516] to-[#1f0b27]',
      accentHex: '#fa2d7e',
      badge: 'Twilight Glow',
      mood: '🌅 Inspiring & Vibrant',
    },
    {
      id: 'minimal',
      name: 'Porcelain Luxury',
      desc: 'Pure architectural white, frosted glass & deep sapphire blue',
      previewBg: 'from-[#ffffff] to-[#f8fafc]',
      accentHex: '#1d68f5',
      badge: 'Clean Editorial',
      mood: '🕊️ Laser Readability',
    },
    {
      id: 'solar',
      name: 'Solar Sovereign',
      desc: 'Imperial midnight bronze, celestial gold leaf & royal radiance',
      previewBg: 'from-[#100b04] to-[#1b1308]',
      accentHex: '#f5be18',
      badge: 'Royal Masterclass',
      mood: '👑 Prestigious & Rich',
    },
  ];

  const fonts: { id: FontType; name: string; sample: string; desc: string }[] = [
    { id: 'serif', name: 'Merriweather Book Serif', sample: 'The Art of Writing', desc: 'Classic novel and story typeface' },
    { id: 'sans', name: 'Inter Modern Sans', sample: 'Clear Digital Prose', desc: 'Sharp, ultra-legible modern layout' },
    { id: 'mono', name: 'JetBrains Code Mono', sample: 'Focused Monospace', desc: 'Distraction-free typewriter rhythm' },
  ];

  const widths: { id: ReadingWidthType; name: string; desc: string; pixel: string }[] = [
    { id: 'compact', name: 'Compact Focus', desc: 'Cozy column for high-speed reading', pixel: '680px' },
    { id: 'comfortable', name: 'Comfortable Balanced', desc: 'Standard book ratio for relaxed reading', pixel: '840px' },
    { id: 'wide', name: 'Wide Panorama', desc: 'Spacious editorial spread for big screens', pixel: '1080px' },
  ];

  const fontSizes: { id: FontSize; name: string; scale: string }[] = [
    { id: 'normal', name: 'Regular', scale: '100%' },
    { id: 'large', name: 'Large', scale: '115%' },
    { id: 'xlarge', name: 'Extra Large', scale: '130%' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md transition-opacity animate-fade-in">
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={() => setIsCustomizerOpen(false)} />

      {/* Drawer Container with 3D Depth */}
      <div className="h-full w-full max-w-lg overflow-y-auto border-l border-border bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-3d-sm">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                3D Appearance & Visual Atmospheres
              </h2>
              <span className="text-xs text-muted-foreground">
                Live interactive presets & reader layout
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-8">
          
          {/* 1. Theme Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Visual Atmosphere ({themes.length} Presets)</span>
              </label>
              <span className="text-[11px] font-semibold text-muted-foreground">Instant Live Switch</span>
            </div>

            <div className="space-y-3">
              {themes.map((t) => {
                const selected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`group relative flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-all duration-200 ${
                      selected
                        ? 'border-primary bg-secondary/80 shadow-3d-glow ring-2 ring-primary/30 scale-[1.01]'
                        : 'border-border/80 bg-secondary/20 hover:border-primary/50 hover:bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* 3D Orb / Swatch */}
                      <div
                        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-gradient-to-br ${t.previewBg} shadow-3d-sm`}
                      >
                        <div
                          className="h-3.5 w-3.5 rounded-full shadow-md"
                          style={{ backgroundColor: t.accentHex }}
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-foreground">{t.name}</span>
                          <span
                            className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                            style={{
                              backgroundColor: `${t.accentHex}20`,
                              color: t.accentHex,
                            }}
                          >
                            {t.badge}
                          </span>
                        </div>
                        <span className="mt-0.5 block text-xs text-muted-foreground leading-relaxed">
                          {t.desc}
                        </span>
                      </div>
                    </div>

                    {selected && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xs">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Reading Typography */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
              Reading Typography
            </label>
            <div className="space-y-2">
              {fonts.map((f) => {
                const selected = font === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFont(f.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                      selected
                        ? 'border-primary bg-secondary/70 shadow-xs ring-1 ring-primary/30 font-medium'
                        : 'border-border bg-secondary/20 hover:bg-secondary/40'
                    }`}
                  >
                    <div>
                      <span className="block text-xs font-semibold text-primary">{f.name}</span>
                      <span
                        className={`block text-base text-foreground mt-0.5 ${
                          f.id === 'serif' ? 'font-serif' : f.id === 'mono' ? 'font-mono' : 'font-sans'
                        }`}
                      >
                        {f.sample}
                      </span>
                    </div>
                    {selected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Text Sizing */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
              Reading Text Scale
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {fontSizes.map((s) => {
                const selected = fontSize === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setFontSize(s.id)}
                    className={`rounded-xl border py-2.5 text-center text-xs font-bold transition-all ${
                      selected
                        ? 'border-primary bg-primary text-primary-foreground shadow-3d-sm'
                        : 'border-border bg-secondary/30 text-foreground hover:bg-secondary'
                    }`}
                  >
                    {s.name} ({s.scale})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Reading Column Width */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
              Reading Column Width
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {widths.map((w) => {
                const selected = readingWidth === w.id;
                return (
                  <button
                    key={w.id}
                    onClick={() => setReadingWidth(w.id)}
                    className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                      selected
                        ? 'border-primary bg-secondary/80 shadow-xs ring-1 ring-primary/30'
                        : 'border-border bg-secondary/20 hover:bg-secondary/40'
                    }`}
                  >
                    <span className="text-xs font-bold text-foreground">{w.name}</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">{w.pixel}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Apply */}
        <div className="mt-8 border-t border-border pt-5">
          <button
            onClick={() => setIsCustomizerOpen(false)}
            className="btn-3d-primary w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-lg transition-all"
          >
            Done & Enjoy Reading
          </button>
        </div>
      </div>
    </div>
  );
};
