import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/theme';

export function CinematicOpening({ onEnter }: { onEnter: () => void }) {
  const { data } = usePortfolio();
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const accent = getAccentClasses(data.settings.accentColor);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        const step = Math.floor(Math.random() * 8) + 4;
        return Math.min(100, prev + step);
      });
    }, 45);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        id="cinematic-opening-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070709] text-neutral-100 overflow-hidden select-none"
      >
        {/* Subtle background ambiance */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        
        {/* Abstract subtle glowing orb behind title */}
        <div 
          className={`absolute w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-all duration-1000 ${
            data.settings.accentColor === 'blue'
              ? 'bg-sky-500/10'
              : data.settings.accentColor === 'emerald'
              ? 'bg-emerald-500/10'
              : 'bg-amber-400/10'
          }`}
        />

        {/* Studio coordinates header mark */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between text-xs font-mono tracking-widest text-neutral-300 uppercase">
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 opacity-60" />
            <span>FADIYEL // STUDIO_v1.0</span>
          </div>
          <div className="hidden sm:block text-neutral-300">
            SYS.STATUS : READY // 2025-2026
          </div>
        </div>

        {/* Centerpiece Container */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl px-6 text-center">
          {/* Subtle Studio Label */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-neutral-300 uppercase"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg} animate-pulse`} />
            <span>Creative Portfolio & Digital Space</span>
          </motion.div>

          {/* Main Title "FADIYEL" */}
          <motion.h1
            initial={{ opacity: 0, letterSpacing: '0.25em', y: 20 }}
            animate={{ opacity: 1, letterSpacing: '0.08em', y: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl sm:text-8xl md:text-9xl font-display font-extrabold tracking-tight text-white drop-shadow-2xl"
          >
            FADIYEL
          </motion.h1>

          {/* Subtitle "Building Digital Experiences" */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-4 text-base sm:text-xl font-light text-neutral-400 tracking-wider font-display uppercase"
          >
            Building Digital Experiences
          </motion.p>

          {/* Progress / Enter Interaction Area */}
          <div className="mt-12 w-full max-w-xs flex flex-col items-center">
            {!isReady ? (
              <div className="w-full space-y-3">
                <div className="flex justify-between text-[11px] font-mono text-neutral-300 tracking-wider">
                  <span>INITIALIZING CANVAS</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-[2px] bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${accent.bg}`}
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                </div>
              </div>
            ) : (
              <motion.button
                id="enter-experience-btn"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEnter}
                className={`group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full border ${accent.border} ${accent.bgMuted} text-white text-sm font-medium tracking-wide transition-all duration-300 hover:border-white/40 ${accent.glow}`}
              >
                <span>Enter Experience</span>
                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:translate-x-1 group-hover:text-white transition-transform duration-300" />
                <span className="absolute -inset-px rounded-full border border-white/10 pointer-events-none" />
              </motion.button>
            )}
          </div>

          {/* Skip option for quick access */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
            onClick={onEnter}
            className="mt-6 text-xs text-neutral-400 font-mono tracking-wider underline underline-offset-4 cursor-pointer"
          >
            Lewati intro &rarr;
          </motion.button>
        </div>

        {/* Footer coordinates watermark */}
        <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between text-[11px] font-mono text-neutral-300">
          <span>WEB DEV • UI DESIGN • VISUAL ART</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400/70" />
            <span>EST. 2025</span>
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
