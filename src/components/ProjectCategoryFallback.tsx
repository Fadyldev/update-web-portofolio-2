import { Globe, Heart, Monitor, Palette, Sparkles, Compass, Terminal, Code2, Layers } from 'lucide-react';
import { AccentColor } from '../types';
import { getAccentClasses } from '../utils/theme';

interface ProjectCategoryFallbackProps {
  category: string;
  title: string;
  year?: string;
  accentColor?: AccentColor;
  compact?: boolean;
}

export function ProjectCategoryFallback({
  category,
  title,
  year = '2025',
  accentColor = 'gold',
  compact = false,
}: ProjectCategoryFallbackProps) {
  const accent = getAccentClasses(accentColor);
  const cat = category.toLowerCase();

  // 1. Digital Invitation Fallback
  if (cat.includes('invitation') || cat.includes('undangan')) {
    return (
      <div className="w-full h-full bg-[#0a0a0f] flex flex-col justify-between p-6 relative overflow-hidden select-none">
        {/* Subtle decorative radial glow */}
        <div className="absolute inset-0 bg-radial-vignette opacity-40 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        {/* Double-line luxury border frame */}
        <div className="absolute inset-3 rounded-2xl border border-white/[0.07] pointer-events-none" />
        <div className="absolute inset-4 rounded-xl border border-white/[0.04] pointer-events-none" />

        {/* Corner Accents */}
        <div className="absolute top-4 left-4 text-[10px] font-serif text-amber-200/40">✦</div>
        <div className="absolute top-4 right-4 text-[10px] font-serif text-amber-200/40">✦</div>
        <div className="absolute bottom-4 left-4 text-[10px] font-serif text-amber-200/40">✦</div>
        <div className="absolute bottom-4 right-4 text-[10px] font-serif text-amber-200/40">✦</div>

        {/* Header */}
        <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-neutral-400 relative z-10">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <Heart className="w-3 h-3 text-rose-400/80 fill-rose-400/20" />
            <span>EDITORIAL INVITATION</span>
          </span>
          <span className="text-neutral-500">{year}</span>
        </div>

        {/* Centerpiece Content */}
        <div className="relative z-10 text-center my-auto py-3 space-y-1.5 px-4">
          <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-neutral-400 block">
            Digital Experience // Save The Date
          </span>
          <h4 className="text-base sm:text-lg font-serif italic text-neutral-100 line-clamp-2 drop-shadow-sm font-normal">
            {title}
          </h4>
          <div className="flex items-center justify-center gap-2 pt-1">
            <div className="h-[1px] w-6 bg-white/20" />
            <span className="text-[10px] font-mono text-neutral-400">RSVP & INTERACTIVE SUITE</span>
            <div className="h-[1px] w-6 bg-white/20" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 relative z-10 pt-2">
          <span className="flex items-center gap-1 text-neutral-400">
            <Sparkles className="w-3 h-3 text-amber-400/80" />
            <span>Responsive Web RSVP</span>
          </span>
          <span className="text-neutral-400 uppercase">Special Edition</span>
        </div>
      </div>
    );
  }

  // 2. Web Development / Website Development Fallback
  if (cat.includes('web dev') || cat.includes('website dev') || cat.includes('development')) {
    return (
      <div className="w-full h-full bg-[#08090e] flex flex-col justify-between p-5 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />

        {/* Top Browser Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
          {/* 3 traffic light dots */}
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70 border border-rose-400/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70 border border-amber-400/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 border border-emerald-400/30" />
          </div>
          {/* Mock URL search bar */}
          <div className="flex-1 max-w-[200px] sm:max-w-[240px] px-2.5 py-1 rounded-md bg-black/50 border border-white/10 text-[10px] font-mono text-neutral-400 flex items-center gap-1.5 truncate">
            <Globe className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
            <span className="truncate">https://localhost:3000/app</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">200 OK</span>
          </span>
        </div>

        {/* Wireframe Mockup UI inside Browser Canvas */}
        <div className="relative z-10 my-auto py-2 space-y-2.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
              <Terminal className="w-3 h-3 text-neutral-500" />
              <span>PRODUCTION BUILD</span>
              <span>// {year}</span>
            </div>
            <h4 className="text-base sm:text-lg font-display font-bold text-white line-clamp-2">
              {title}
            </h4>
          </div>

          {/* Wireframe UI blocks */}
          <div className="space-y-1.5 opacity-80 pt-1">
            <div className="h-2 w-full rounded bg-white/[0.08] flex items-center gap-1 px-1">
              <div className="h-1 w-6 rounded bg-white/20" />
              <div className="h-1 w-4 rounded bg-white/10" />
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <div className="h-6 rounded bg-white/[0.04] border border-white/5 flex items-center justify-center text-[8px] font-mono text-neutral-400">
                &lt;Hero /&gt;
              </div>
              <div className="h-6 rounded bg-white/[0.04] border border-white/5 flex items-center justify-center text-[8px] font-mono text-neutral-400">
                &lt;State /&gt;
              </div>
              <div className="h-6 rounded bg-white/[0.04] border border-white/5 flex items-center justify-center text-[8px] font-mono text-neutral-400">
                &lt;API /&gt;
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-white/[0.06]">
          <span className="flex items-center gap-1 text-neutral-400">
            <Code2 className="w-3 h-3 text-neutral-400" />
            <span>WEB APPLICATION</span>
          </span>
          <span className="text-neutral-400">CLIENT & SERVER READY</span>
        </div>
      </div>
    );
  }

  // 3. Web Design Fallback (UI/UX)
  if (cat.includes('web design') || cat.includes('ui') || cat.includes('ux')) {
    return (
      <div className="w-full h-full bg-[#090a10] flex flex-col justify-between p-5 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        {/* Artboard Header */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400 pb-2 border-b border-white/[0.06]">
          <span className="flex items-center gap-1 text-neutral-300">
            <Monitor className="w-3 h-3 text-sky-400" />
            <span>UI/UX ARTBOARD</span>
          </span>
          <span>1920 × 1080 PX</span>
        </div>

        {/* Responsive Grid Wireframe */}
        <div className="relative z-10 my-auto py-2 space-y-2">
          <div className="space-y-0.5">
            <span className="text-[9px] font-mono text-neutral-400 tracking-wider uppercase block">
              Design System & Prototype
            </span>
            <h4 className="text-base sm:text-lg font-display font-bold text-white line-clamp-2">
              {title}
            </h4>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-1">
            <div className="col-span-1 h-8 rounded border border-dashed border-white/15 bg-white/[0.02] flex items-center justify-center text-[8px] font-mono text-neutral-400">
              SIDEBAR
            </div>
            <div className="col-span-3 h-8 rounded border border-white/10 bg-white/[0.04] p-1 flex flex-col justify-between">
              <div className="h-1.5 w-12 rounded bg-sky-400/40" />
              <div className="flex gap-1">
                <div className="h-3 flex-1 rounded bg-white/10" />
                <div className="h-3 flex-1 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-white/[0.06]">
          <span>LAYOUT SPECS</span>
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
            <span>{year} • DESIGN ARCHIVE</span>
          </span>
        </div>
      </div>
    );
  }

  // 4. Graphic Design Fallback
  if (cat.includes('graphic') || cat.includes('grafis')) {
    return (
      <div className="w-full h-full bg-[#0a0810] flex flex-col justify-between p-5 relative overflow-hidden select-none">
        {/* Crop / registration marks */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/30" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-white/30" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-white/30" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/30" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400 pb-2">
          <span className="flex items-center gap-1 text-purple-300">
            <Palette className="w-3 h-3 text-purple-400" />
            <span>GRAPHIC DESIGN CANVAS</span>
          </span>
          <span>VECTOR / CMYK</span>
        </div>

        {/* Main visual */}
        <div className="relative z-10 my-auto py-2 space-y-2 text-center">
          <div className="inline-flex items-center justify-center gap-1.5 pb-1">
            <span className="w-3 h-3 rounded-full bg-cyan-500/60 shadow-sm" title="Cyan" />
            <span className="w-3 h-3 rounded-full bg-pink-500/60 shadow-sm" title="Magenta" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/60 shadow-sm" title="Yellow" />
            <span className="w-3 h-3 rounded-full bg-neutral-900 border border-white/30" title="Key/Black" />
          </div>

          <h4 className="text-base sm:text-lg font-display font-bold text-white line-clamp-2 px-3">
            {title}
          </h4>

          <span className="text-[10px] font-mono text-neutral-400 block tracking-widest uppercase">
            Visual Composition // Typography & Layout
          </span>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-white/[0.06]">
          <span>PRINT & DIGITAL SPEC</span>
          <span>RELEASE: {year}</span>
        </div>
      </div>
    );
  }

  // 5. Branding Fallback
  if (cat.includes('brand')) {
    return (
      <div className="w-full h-full bg-[#0a0c12] flex flex-col justify-between p-5 relative overflow-hidden select-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        {/* Grid lines alignment guides */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/[0.04] pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/[0.04] pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400 pb-2">
          <span className="flex items-center gap-1.5 text-neutral-300">
            <Compass className="w-3 h-3 text-amber-400" />
            <span>BRAND IDENTITY SYSTEM</span>
          </span>
          <span>GUIDELINES</span>
        </div>

        {/* Centerpiece logo construction mark */}
        <div className="relative z-10 my-auto py-2 text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-2xl border border-white/20 bg-white/[0.03] flex items-center justify-center shadow-lg">
            <Layers className="w-6 h-6 text-neutral-300" />
          </div>

          <h4 className="text-base sm:text-lg font-display font-bold text-white line-clamp-2 px-3">
            {title}
          </h4>

          <span className="text-[10px] font-mono text-neutral-400 block tracking-wider">
            Identity Grid • Color Harmony • Logo Craft
          </span>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-neutral-400 pt-2 border-t border-white/[0.06]">
          <span>STANDARDS // {year}</span>
          <span className="text-neutral-400">VECTOR LOGOMARK</span>
        </div>
      </div>
    );
  }

  // 6. Generic Archive Fallback
  return (
    <div className="w-full h-full bg-[#0a0b10] flex flex-col justify-between p-6 relative overflow-hidden select-none">
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 relative z-10">
        <span>FADIYEL STUDIO // ARCHIVE</span>
        <span className="text-neutral-300">{category}</span>
      </div>
      <div className="relative z-10 my-auto py-2">
        <h4 className="text-base sm:text-lg font-display font-bold text-neutral-200 line-clamp-2">
          {title}
        </h4>
      </div>
      <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 relative z-10 pt-2 border-t border-white/5">
        <span>YEAR: {year}</span>
        <span className="flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
          <span>DIGITAL ARTIFACT</span>
        </span>
      </div>
    </div>
  );
}
