import React, { useRef, useState, useCallback } from 'react';
import { Sparkles, ShieldCheck, BookOpen, Feather } from 'lucide-react';

interface LunaHero3DArtProps {
  className?: string;
}

export const LunaHero3DArt: React.FC<LunaHero3DArtProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Responsive 3D Tilt angles (max 14 degrees)
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 14;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransform(`perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.025, 1.025, 1.025)`);
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransform('perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center select-none preserve-3d cursor-pointer ${className}`}
      style={{ minHeight: '440px' }}
    >
      {/* 1. Ambient Moonlit Violet & Gold Glow Behind Frame */}
      <div
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-75 blur-3xl transition-opacity duration-500"
        style={{
          background: 'radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.45) 0%, rgba(56, 189, 248, 0.3) 40%, rgba(245, 158, 11, 0.25) 75%, transparent 100%)',
          transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        }}
      />

      {/* 2. Main 3D Tilted Art Canvas */}
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/20 shadow-2xl transition-transform duration-100 ease-out preserve-3d"
        style={{
          transform,
          boxShadow: isHovered
            ? '0 30px 60px -12px rgba(0, 0, 0, 0.7), 0 0 40px 6px rgba(168, 85, 247, 0.4)'
            : '0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 25px 2px rgba(168, 85, 247, 0.2)',
        }}
      >
        {/* The Masterpiece Artwork Image */}
        <img
          src="/assets/luna_hero_art.jpg"
          alt="Luna Writer Celestial Artwork"
          className="w-full h-auto object-cover rounded-3xl block transition-transform duration-500"
          style={{
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
          }}
        />

        {/* Dynamic Specular Holographic Glare Follower */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-3xl transition-opacity duration-300"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.45) 0%, rgba(168, 85, 247, 0.2) 35%, transparent 70%)`,
          }}
        />

        {/* Beveled Edge Highlight */}
        <div className="pointer-events-none absolute inset-0 z-10 rounded-3xl border border-white/30 shadow-inner" />
      </div>

      {/* 3. Floating 3D Frosted Glass Badges (Layered in Z-Space) */}
      
      {/* Badge 1: Top-Left CEFR Standard */}
      <div
        className="absolute -top-3 left-0 sm:-left-5 z-30 rounded-2xl border border-white/30 bg-card/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-transform duration-200"
        style={{
          transform: isHovered ? 'translateZ(50px) translateY(-4px)' : 'translateZ(30px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 rounded-full bg-emerald-400 shadow-sm animate-pulse" />
          <div>
            <span className="text-xs font-bold text-foreground block">CEFR A1 to C2 Standard</span>
            <span className="text-[10px] text-muted-foreground block">34 Masterclass Write-Ups</span>
          </div>
        </div>
      </div>

      {/* Badge 2: Bottom-Right AI Mentor */}
      <div
        className="absolute -bottom-3 right-0 sm:-right-5 z-30 rounded-2xl border border-white/30 bg-card/90 px-4 py-2.5 shadow-2xl backdrop-blur-xl transition-transform duration-200"
        style={{
          transform: isHovered ? 'translateZ(50px) translateY(4px)' : 'translateZ(30px)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <Sparkles className="h-4 w-4 text-purple-400 animate-spin-slow" />
          <div>
            <span className="text-xs font-bold text-foreground block">Gemini 2.5 AI Gate</span>
            <span className="text-[10px] text-muted-foreground block">A1+ Community Publishing</span>
          </div>
        </div>
      </div>

      {/* Badge 3: Top-Right Auto-Save Vault */}
      <div
        className="hidden sm:block absolute top-1/2 -right-8 -translate-y-1/2 z-30 rounded-2xl border border-white/30 bg-card/90 px-3.5 py-2 shadow-2xl backdrop-blur-xl transition-transform duration-200"
        style={{
          transform: isHovered ? 'translateZ(40px) translateX(6px)' : 'translateZ(25px)',
        }}
      >
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <div>
            <span>Auto-Save Protected</span>
            <span className="text-[9px] text-muted-foreground block font-normal">Private Cloud Vault</span>
          </div>
        </div>
      </div>
    </div>
  );
};
