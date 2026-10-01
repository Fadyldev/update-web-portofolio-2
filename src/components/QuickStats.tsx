import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Code2, 
  Layers, 
  ShieldCheck, 
  Terminal,
  FolderKanban,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  Sparkles
} from 'lucide-react';
import { PortfolioData } from '../types';
import { getAccentClasses } from '../utils/theme';

interface QuickStatsProps {
  data: PortfolioData;
  onExploreProjects?: () => void;
}

// Preset color palette for tech stack bars (GitHub style)
const TECH_PALETTE: { [key: string]: { bg: string; text: string; glow: string } } = {
  react: { bg: '#38bdf8', text: 'text-sky-400', glow: 'rgba(56, 189, 248, 0.4)' },
  tailwind: { bg: '#2dd4bf', text: 'text-teal-400', glow: 'rgba(45, 212, 191, 0.4)' },
  'tailwind css': { bg: '#2dd4bf', text: 'text-teal-400', glow: 'rgba(45, 212, 191, 0.4)' },
  javascript: { bg: '#facc15', text: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.4)' },
  html: { bg: '#f97316', text: 'text-orange-400', glow: 'rgba(249, 115, 22, 0.4)' },
  css: { bg: '#60a5fa', text: 'text-blue-400', glow: 'rgba(96, 165, 250, 0.4)' },
  inkscape: { bg: '#fbbf24', text: 'text-amber-400', glow: 'rgba(251, 191, 36, 0.4)' },
  'visual design': { bg: '#f43f5e', text: 'text-rose-400', glow: 'rgba(244, 63, 94, 0.4)' },
  'ui design': { bg: '#c084fc', text: 'text-purple-400', glow: 'rgba(192, 132, 252, 0.4)' },
  motion: { bg: '#ec4899', text: 'text-pink-400', glow: 'rgba(236, 72, 153, 0.4)' },
  'web development': { bg: '#34d399', text: 'text-emerald-400', glow: 'rgba(52, 211, 153, 0.4)' },
  typescript: { bg: '#3b82f6', text: 'text-blue-500', glow: 'rgba(59, 130, 246, 0.4)' },
  figma: { bg: '#a855f7', text: 'text-purple-500', glow: 'rgba(168, 85, 247, 0.4)' },
  git: { bg: '#f43f5e', text: 'text-rose-500', glow: 'rgba(244, 63, 94, 0.4)' },
};

const DEFAULT_COLOR = { bg: '#a3a3a3', text: 'text-neutral-400', glow: 'rgba(163, 163, 163, 0.3)' };

function getTechColor(name: string) {
  const key = name.trim().toLowerCase();
  return TECH_PALETTE[key] || DEFAULT_COLOR;
}

export function QuickStats({ data, onExploreProjects }: QuickStatsProps) {
  const accent = getAccentClasses(data.settings.accentColor);
  const [activeTab, setActiveTab] = useState<'techstack' | 'skills' | 'breakdown'>('techstack');

  const activeProjects = data.projects.filter((p) => p.active);
  const totalActive = activeProjects.length || 1;
  const liveDemosCount = activeProjects.filter((p) => p.liveDemoUrl?.trim()).length;
  const liveDemoPercentage = Math.round((liveDemosCount / totalActive) * 100);

  // 100% REAL-TIME DYNAMIC TECH-STACK EXTRACTION FROM PROJECTS
  const techStats = useMemo(() => {
    const counts: { [tech: string]: number } = {};
    let totalOccurrences = 0;

    activeProjects.forEach((proj) => {
      if (Array.isArray(proj.techStack)) {
        proj.techStack.forEach((t) => {
          const cleanName = t.trim();
          if (cleanName) {
            counts[cleanName] = (counts[cleanName] || 0) + 1;
            totalOccurrences++;
          }
        });
      }
    });

    if (totalOccurrences === 0) {
      return [];
    }

    // Sort by most used tech
    const list = Object.entries(counts).map(([name, count]) => {
      const percentage = Math.round((count / totalOccurrences) * 100);
      const color = getTechColor(name);
      return {
        name,
        count,
        percentage,
        color,
      };
    });

    list.sort((a, b) => b.count - a.count);
    return list;
  }, [activeProjects]);

  // Calculations for Breakdown tab
  const webProjectsCount = activeProjects.filter((p) => 
    p.category === 'Digital Invitation' || 
    p.category === 'Web Development' || 
    p.category === 'Website Development' ||
    (p.techStack && p.techStack.some((t) => ['React', 'HTML', 'CSS', 'JavaScript', 'Tailwind CSS'].includes(t)))
  ).length;
  const webPercentage = Math.round((webProjectsCount / totalActive) * 100);

  const visualProjectsCount = activeProjects.filter((p) => 
    p.category === 'Web Design' || 
    p.category === 'Branding' || 
    p.category === 'Graphic Design' ||
    (p.techStack && p.techStack.some((t) => ['Visual Design', 'UI Design', 'Inkscape', 'Vector Art', 'Motion'].includes(t)))
  ).length;
  const visualPercentage = Math.round((visualProjectsCount / totalActive) * 100);

  const completedProjectsCount = activeProjects.filter((p) => p.status === 'Completed').length;
  const inProgressProjectsCount = activeProjects.filter((p) => p.status === 'In Progress').length;

  const totalSkills = data.skills.length;
  const coreWebSkills = data.skills.filter((s) => s.category === 'Core Web');
  const designSkills = data.skills.filter((s) => s.category === 'Design & Visual');
  const toolsSkills = data.skills.filter((s) => s.category === 'Tools & Workflow');

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${accent.border} ${accent.bgMuted}`}>
            <Activity className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
              <span>Studio Telemetry & Tech Analytics</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-emerald-400">
                ● LIVE DATABASE
              </span>
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              Statistik garis spektrum teknologi & distribusi karya nyata otomatis
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border border-white/10 bg-black/50 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('techstack')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'techstack'
                ? `${accent.bg} text-black font-semibold shadow-sm`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Spektrum Tech-Stack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'skills'
                ? `${accent.bg} text-black font-semibold shadow-sm`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Garis Bar Skill
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? `${accent.bg} text-black font-semibold shadow-sm`
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Distribusi Karya Nyata
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Container with Graph */}
      <div className="p-5 sm:p-6 rounded-2xl border border-white/[0.12] bg-[#0d0e14] shadow-2xl relative overflow-hidden">
        {/* Visual Line Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />

        {/* TAB 1: SPEKTRUM TEKNOLOGI GITHUB-STYLE (100% DINAMIS DARI TECH STACK DATABASE) */}
        {activeTab === 'techstack' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 relative z-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-neutral-400 block mb-1">
                  // SPEKTRUM PENGGUNAAN TEKNOLOGI & PERANGKAT ({activeProjects.length} PROYEK AKTIF)
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
                    {techStats.length} Ekosistem Stack Terdeteksi
                  </span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Sinkronisasi Otomatis</span>
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dihitung Real-time dari Tag Proyek</span>
              </div>
            </div>

            {/* GitHub-style Multi-segment Glowing Stack Bar */}
            <div className="space-y-2">
              <div className="w-full h-4 sm:h-5 rounded-full bg-black/60 p-0.5 border border-white/15 overflow-hidden flex shadow-inner">
                {techStats.map((item, idx) => (
                  <div
                    key={idx}
                    title={`${item.name}: ${item.percentage}% (${item.count} proyek)`}
                    style={{ 
                      width: `${item.percentage}%`, 
                      backgroundColor: item.color.bg,
                    }}
                    className="h-full transition-all duration-700 relative group cursor-pointer first:rounded-l-full last:rounded-r-full hover:opacity-90"
                  />
                ))}
              </div>

              <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 px-1">
                <span>0%</span>
                <span>Distribusi Rasio Frekuensi Teknologi</span>
                <span>100%</span>
              </div>
            </div>

            {/* Breakdown Cards Grid of Detected Technologies */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-1">
              {techStats.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.color.bg }}
                      />
                      <span className="text-xs font-mono font-bold text-white truncate">
                        {item.name}
                      </span>
                    </div>
                    <span className={`text-xs font-mono font-bold ${item.color.text}`}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color.bg,
                      }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400 flex justify-between">
                    <span>Dipakai di</span>
                    <span className="text-white font-semibold">{item.count} Proyek</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Teknologi dan stack dihitung secara proporsional sesuai frekuensi implementasi pada setiap proyek nyata.</span>
              </span>
              <span className="text-emerald-400 hidden sm:inline">
                Verified Production Stack
              </span>
            </div>
          </motion.div>
        )}

        {/* TAB 2: GARIS BAR LEVEL SKILL (HORIZONTAL PROGRESS BARS) */}
        {activeTab === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5 relative z-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-neutral-400 block mb-1">
                  // DISTRIBUSI KAPASITAS TEKNIS ({totalSkills} TOTAL INSTRUMEN)
                </span>
                <h4 className="text-lg font-display font-bold text-white">
                  Lini Garis Penguasaan Stack & Tools
                </h4>
              </div>
              <span className="text-xs font-mono text-neutral-400 hidden sm:inline-block">
                Evaluasi Proyek Nyata
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Core Web Bar */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Modern Web Frontend (React, HTML/CSS, Tailwind)</span>
                  </span>
                  <span className="text-cyan-400 font-bold">92%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-400" style={{ width: '92%' }} />
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-neutral-400">
                  {coreWebSkills.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vector & Inkscape Bar */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Visual Asset & Inkscape Vector Art</span>
                  </span>
                  <span className="text-amber-400 font-bold">88%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: '88%' }} />
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-neutral-400">
                  {designSkills.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Git & Workflow Bar */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Workflow, Git & Code Management</span>
                  </span>
                  <span className="text-emerald-400 font-bold">85%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-400" style={{ width: '85%' }} />
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-neutral-400">
                  {toolsSkills.map((s) => (
                    <span key={s.id} className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Responsive Bar */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
                    <span>Responsive Layout & Mobile First UX</span>
                  </span>
                  <span className="text-violet-400 font-bold">95%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-violet-400" style={{ width: '95%' }} />
                </div>
                <p className="text-[11px] text-neutral-400 font-mono">
                  Presisi pada layar ponsel, tablet, laptop, dan monitor desktop.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: DISTRIBUSI KARYA NYATA (100% REAL-TIME DARI DATA PROYEK ANDA) */}
        {activeTab === 'breakdown' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 relative z-10"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono text-neutral-400 block mb-1">
                  // DATA ASLI TERVERIFIKASI SISTEM (DATABASE PORTFOLIO)
                </span>
                <h4 className="text-lg font-display font-bold text-white">
                  Distribusi Komposisi Karya Nyata
                </h4>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Data Riil</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* Web Development & Interactive Invitations */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Web & Interactive</span>
                  </span>
                  <span className="font-bold text-cyan-400">{webPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-cyan-400 transition-all duration-700" 
                    style={{ width: `${webPercentage}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>{webProjectsCount} dari {totalActive} Proyek</span>
                  <span className="text-neutral-500">React & Frontend</span>
                </div>
              </div>

              {/* Visual Design & Inkscape Art */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Visual & Vector Inkscape</span>
                  </span>
                  <span className="font-bold text-amber-400">{visualPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-amber-400 transition-all duration-700" 
                    style={{ width: `${visualPercentage}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>{visualProjectsCount} dari {totalActive} Proyek</span>
                  <span className="text-neutral-500">Aset Vektor & UI</span>
                </div>
              </div>

              {/* Live Demo Availability */}
              <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Demo Terbuka</span>
                  </span>
                  <span className="font-bold text-emerald-400">{liveDemoPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-400 transition-all duration-700" 
                    style={{ width: `${liveDemoPercentage}%` }} 
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                  <span>{liveDemosCount} Proyek Siap Dicoba</span>
                  <span className="text-neutral-500">Akses Langsung</span>
                </div>
              </div>
            </div>

            {/* Status Info */}
            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.01] flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>
                Status Siklus: <strong className="text-white">{completedProjectsCount} Proyek Selesai</strong>, <strong className="text-amber-300">{inProgressProjectsCount} Dalam Pengembangan Aktif</strong>
              </span>
              <span className="text-emerald-400 hidden sm:inline">
                Sistem Terverifikasi
              </span>
            </div>
          </motion.div>
        )}

        {/* Footer info bar */}
        <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 text-neutral-400">
            <span>
              <strong className="text-white font-semibold">{liveDemosCount}</strong> Proyek Siap Dicoba
            </span>
            <span className="hidden sm:inline-block">•</span>
            <span className="hidden sm:inline-block">
              Arsitektur Komponen Modular React
            </span>
          </div>

          {onExploreProjects && (
            <button
              type="button"
              onClick={onExploreProjects}
              className="inline-flex items-center gap-1.5 text-white hover:text-neutral-300 transition-colors cursor-pointer group"
            >
              <span>Jelajahi Showcase Proyek</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
