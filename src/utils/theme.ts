import { AccentColor } from '../types';

export function getAccentClasses(color: AccentColor = 'gold') {
  switch (color) {
    case 'blue':
      return {
        text: 'text-sky-400',
        textMuted: 'text-sky-300/80',
        bg: 'bg-sky-400',
        bgMuted: 'bg-sky-500/10',
        border: 'border-sky-500/30',
        borderHover: 'hover:border-sky-400/60',
        borderActive: 'border-sky-400',
        glow: 'shadow-[0_0_24px_rgba(56,189,248,0.25)]',
        glowSubtle: 'shadow-[0_0_15px_rgba(56,189,248,0.12)]',
        gradientText: 'from-sky-200 via-sky-400 to-blue-500',
        dotBg: 'bg-sky-400',
        badge: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
      };
    case 'emerald':
      return {
        text: 'text-emerald-400',
        textMuted: 'text-emerald-300/80',
        bg: 'bg-emerald-400',
        bgMuted: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        borderHover: 'hover:border-emerald-400/60',
        borderActive: 'border-emerald-400',
        glow: 'shadow-[0_0_24px_rgba(52,211,153,0.25)]',
        glowSubtle: 'shadow-[0_0_15px_rgba(52,211,153,0.12)]',
        gradientText: 'from-emerald-200 via-emerald-400 to-teal-500',
        dotBg: 'bg-emerald-400',
        badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
      };
    case 'gold':
    default:
      return {
        text: 'text-amber-400',
        textMuted: 'text-amber-300/80',
        bg: 'bg-amber-400',
        bgMuted: 'bg-amber-400/10',
        border: 'border-amber-400/30',
        borderHover: 'hover:border-amber-400/60',
        borderActive: 'border-amber-400',
        glow: 'shadow-[0_0_24px_rgba(251,191,36,0.22)]',
        glowSubtle: 'shadow-[0_0_15px_rgba(251,191,36,0.1)]',
        gradientText: 'from-amber-100 via-amber-300 to-amber-500',
        dotBg: 'bg-amber-400',
        badge: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
      };
  }
}
