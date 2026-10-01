import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Printer, 
  Download, 
  ExternalLink, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  CheckCircle2, 
  FileText,
  Sparkles
} from 'lucide-react';
import { PortfolioData } from '../types';
import { getAccentClasses } from '../utils/theme';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
}

export function ResumeModal({ isOpen, onClose, data }: ResumeModalProps) {
  if (!isOpen) return null;

  const accent = getAccentClasses(data.settings.accentColor);
  const customResumeUrl = data.profile.resumeUrl?.trim();
  const avatarUrl = data.profile.avatarUrl;

  // Print or trigger browser Save as PDF
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md resume-modal-backdrop print:p-0 print:m-0 print:static print:overflow-visible print:bg-white">
        {/* Backdrop (hidden on print) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 print:hidden"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative z-10 w-full max-w-4xl max-h-[94vh] flex flex-col rounded-2xl bg-[#090a0f] border border-white/10 shadow-2xl overflow-hidden print:max-w-none print:max-h-none print:border-none print:bg-white print:text-black print:rounded-none print:shadow-none print:overflow-visible"
        >
          {/* Top Bar for Screen Preview (Hidden on Print) */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3.5 border-b border-white/10 bg-[#0c0d12] shrink-0 print:hidden">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-lg border ${accent.border} ${accent.bgMuted}`}>
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-display font-bold text-white flex items-center gap-2">
                  <span>Curriculum Vitae / Resume A4</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04] text-neutral-300">
                    A4 ATS-Ready
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Format kertas A4 standar yang siap disimpan sebagai PDF atau dicetak.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* External file link if provided in admin */}
              {customResumeUrl && (
                <a
                  href={customResumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-mono text-neutral-200 hover:text-white hover:bg-white/[0.08] transition-all"
                  title="Unduh dokumen asli"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">Buka File Asli</span>
                </a>
              )}

              {/* Print / Save PDF button */}
              <button
                type="button"
                onClick={handlePrint}
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl ${accent.bg} text-black font-semibold text-xs font-mono transition-all hover:opacity-90 shadow-md cursor-pointer`}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Simpan / Cetak PDF</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-all cursor-pointer"
                title="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Workbench Canvas Background */}
          <div className="overflow-y-auto p-3 sm:p-8 bg-[#13141c] flex justify-center print:p-0 print:bg-white print:overflow-visible">
            {/* The Authentic Physical A4 Paper Sheet */}
            <div className="resume-a4-sheet w-full max-w-[794px] bg-white text-neutral-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-neutral-300/80 p-6 sm:p-10 md:p-12 space-y-7 rounded-sm print:shadow-none print:border-none print:p-0 print:max-w-none font-sans">
              
              {/* 1. Resume Header with Optional Professional Photo */}
              <div className="border-b-2 border-neutral-900 pb-6 print-avoid-break">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                  {/* Text details */}
                  <div className="space-y-2.5 flex-1">
                    <div className="space-y-1">
                      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900">
                        {data.profile.name.toUpperCase()}
                      </h1>
                      <div className="text-xs sm:text-sm font-bold tracking-wider text-neutral-700 uppercase font-mono">
                        {data.profile.profession}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal max-w-xl">
                      {data.profile.headline}
                    </p>

                    {/* Contact Strip */}
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-neutral-700 pt-2 font-mono">
                      {data.profile.email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>{data.profile.email}</span>
                        </span>
                      )}
                      {data.profile.whatsapp && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>{data.profile.whatsapp}</span>
                        </span>
                      )}
                      {data.profile.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>{data.profile.location}</span>
                        </span>
                      )}
                      {data.profile.github && (
                        <span className="flex items-center gap-1.5">
                          <Github className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                          <span>github.com/{data.profile.github}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Professional Portrait Photo */}
                  {avatarUrl && (
                    <div className="shrink-0 self-center sm:self-start">
                      <div className="w-24 h-32 sm:w-28 sm:h-36 rounded-sm border-2 border-neutral-900 overflow-hidden shadow-sm bg-neutral-100">
                        <img
                          src={avatarUrl}
                          alt={data.profile.name}
                          className="w-full h-full object-cover grayscale contrast-125"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="block text-[9px] font-mono text-center text-neutral-500 pt-1 uppercase tracking-wider">
                        Official Portrait
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Professional Summary */}
              <div className="space-y-2 print-avoid-break">
                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900 border-b border-neutral-300 pb-1">
                  Professional Summary
                </h2>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed text-justify">
                  {data.profile.bio}
                </p>
              </div>

              {/* 3. Core Competencies & Skills */}
              <div className="space-y-3 print-avoid-break">
                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900 border-b border-neutral-300 pb-1">
                  Core Skills & Technical Arsenal
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="font-bold text-neutral-900 block mb-1 font-mono">
                      // Core Frontend & Web
                    </span>
                    <ul className="space-y-1 text-neutral-700">
                      {data.skills
                        .filter((s) => s.category === 'Core Web')
                        .map((s) => (
                          <li key={s.id} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                            <span>{s.name}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-900 block mb-1 font-mono">
                      // Design & Visuals
                    </span>
                    <ul className="space-y-1 text-neutral-700">
                      {data.skills
                        .filter((s) => s.category === 'Design & Visual')
                        .map((s) => (
                          <li key={s.id} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                            <span>{s.name}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-neutral-900 block mb-1 font-mono">
                      // Tools & Workflow
                    </span>
                    <ul className="space-y-1 text-neutral-700">
                      {data.skills
                        .filter((s) => s.category === 'Tools & Workflow')
                        .map((s) => (
                          <li key={s.id} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 shrink-0" />
                            <span>{s.name}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 4. Featured Works & Projects */}
              <div className="space-y-4 print-avoid-break">
                <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900 border-b border-neutral-300 pb-1 flex items-center justify-between">
                  <span>Selected Featured Projects</span>
                  <span className="text-[10px] text-neutral-500 font-normal font-mono">
                    {data.projects.length} Total Projects Cataloged
                  </span>
                </h2>

                <div className="space-y-3.5">
                  {data.projects
                    .filter((p) => p.active)
                    .slice(0, 4)
                    .map((proj) => (
                      <div key={proj.id} className="space-y-1 border-b border-neutral-100 pb-3 last:border-b-0 print-avoid-break">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <span className="text-sm font-bold text-neutral-900">
                            {proj.title}
                          </span>
                          <span className="text-[11px] font-mono text-neutral-600">
                            {proj.category} • {proj.year}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-700 leading-relaxed">
                          {proj.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-neutral-600 pt-0.5">
                          <span>
                            <strong>Stack:</strong> {proj.techStack.join(', ')}
                          </span>
                          {proj.liveDemoUrl && (
                            <span className="text-neutral-900 underline truncate max-w-xs">
                              Live: {proj.liveDemoUrl}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 5. Continuous Learning Commitments */}
              {data.about?.milestones && data.about.milestones.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-neutral-200 print-avoid-break">
                  <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-neutral-900">
                    Continuous Growth & Focus Areas
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-neutral-700">
                    {data.about.milestones.map((m, idx) => (
                      <div key={idx} className="border-l-2 border-neutral-900 pl-2 space-y-0.5">
                        <span className="font-bold text-neutral-900 block font-mono text-[11px]">
                          {m.title}
                        </span>
                        <p className="text-[11px] text-neutral-600 leading-tight">
                          {m.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Footnote */}
              <div className="text-[10px] font-mono text-neutral-400 pt-4 border-t border-neutral-200 flex justify-between items-center print-avoid-break">
                <span>Verified Studio Portfolio Sheet — {data.profile.name}</span>
                <span>Document Format: A4 Standard • ATS Friendly</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
