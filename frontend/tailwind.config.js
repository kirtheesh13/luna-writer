/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="midnight"]'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: 'hsl(var(--primary-hover))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          hover: 'hsl(var(--card-hover))',
        },
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          border: 'hsl(var(--surface-border))',
        },
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        destructive: 'hsl(var(--destructive))',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        '3d-sm': '0 4px 14px -2px rgba(0,0,0,0.25), 0 2px 6px -1px rgba(0,0,0,0.15)',
        '3d-md': '0 10px 25px -4px rgba(0,0,0,0.35), 0 4px 10px -2px rgba(0,0,0,0.2), inset 0 1px 1px 0 rgba(255,255,255,0.1)',
        '3d-lg': '0 20px 45px -8px rgba(0,0,0,0.45), 0 8px 18px -4px rgba(0,0,0,0.25), inset 0 1px 2px 0 rgba(255,255,255,0.15)',
        '3d-glow': '0 0 35px -5px hsl(var(--primary) / 0.4), 0 12px 25px -8px rgba(0,0,0,0.5)',
        '3d-inner': 'inset 0 2px 4px 0 rgba(0,0,0,0.25)',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1.5deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(10px) rotate(-1.5deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'shimmer-beam': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'orbit-3d': {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.04)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        }
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'shimmer-beam': 'shimmer-beam 3s linear infinite',
        'orbit-3d': 'orbit-3d 20s linear infinite',
      },
    },
  },
  plugins: [],
}
