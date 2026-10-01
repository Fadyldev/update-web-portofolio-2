import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowUpRight, 
  Github, 
  Layers, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { Project, ProjectStatus } from '../types';
import { getAccentClasses } from '../utils/theme';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectCategoryFallback } from './ProjectCategoryFallback';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const { data } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);

  // Gallery active index state
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [imageZoomOpen, setImageZoomOpen] = useState<boolean>(false);

  // Collect all available images: main image first, then gallery items
  const allImages: string[] = [];
  if (project?.imageUrl && project.imageUrl.trim()) {
    allImages.push(project.imageUrl.trim());
  }
  if (project?.gallery && Array.isArray(project.gallery)) {
    project.gallery.forEach((url) => {
      if (url && url.trim() && !allImages.includes(url.trim())) {
        allImages.push(url.trim());
      }
    });
  }

  // Reset image index when modal opens or project changes
  useEffect(() => {
    setSelectedImageIndex(0);
    setImageZoomOpen(false);
  }, [project?.id, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (imageZoomOpen) {
          setImageZoomOpen(false);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, imageZoomOpen, onClose]);

  if (!isOpen || !project) return null;

  const currentStatus: ProjectStatus = project.status || 'Completed';

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return {
          label: 'Completed',
          className: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
          dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
          icon: CheckCircle2,
        };
      case 'In Progress':
        return {
          label: 'In Progress',
          className: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
          dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
          icon: Clock,
        };
      case 'Prototype':
        return {
          label: 'Prototype',
          className: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
          dot: 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]',
          icon: Cpu,
        };
      case 'Concept':
      default:
        return {
          label: 'Concept',
          className: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
          dot: 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.5)]',
          icon: Lightbulb,
        };
    }
  };

  const statusConfig = getStatusBadge(currentStatus);
  const StatusIcon = statusConfig.icon;

  const activeImage = allImages[selectedImageIndex] || undefined;

  return (
    <AnimatePresence>
      <div 
        id="project-detail-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0c0d12] shadow-2xl text-neutral-100 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Sticky Header */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0c0d12]/95 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${statusConfig.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                <span>{statusConfig.label}</span>
              </span>
              <span className="text-xs font-mono text-neutral-400 bg-white/[0.03] px-2.5 py-1 rounded border border-white/5">
                {project.category}
              </span>
              <span className="text-xs font-mono text-neutral-500 hidden sm:inline-block">
                • {project.year}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {project.liveDemoUrl && project.liveDemoUrl.trim() && (currentStatus === 'Completed' || currentStatus === 'In Progress') && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full ${accent.bg} text-black font-semibold text-xs font-mono shadow-sm hover:opacity-90 transition-all`}
                >
                  <span>Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                id="close-project-detail-btn"
                onClick={onClose}
                className="p-2 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 hover:bg-white/[0.05] transition-all cursor-pointer"
                title="Tutup (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Visual Media Section */}
            {allImages.length > 0 ? (
              <div className="space-y-4">
                {/* Main Active Image Display */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 aspect-[16/10] sm:aspect-video group">
                  <img
                    src={activeImage}
                    alt={`${project.title} - Visual ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover sm:object-contain bg-black/90 transition-all duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      // Graceful fallback if image link fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />

                  {/* Image Navigation overlay if multiple images */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white backdrop-blur-sm transition-all opacity-80 group-hover:opacity-100"
                        title="Gambar Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white backdrop-blur-sm transition-all opacity-80 group-hover:opacity-100"
                        title="Gambar Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  {/* Counter Badge */}
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-[11px] font-mono text-neutral-300">
                    {selectedImageIndex + 1} / {allImages.length}
                  </div>
                </div>

                {/* Thumbnails Strip (if > 1 image) */}
                {allImages.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative rounded-xl overflow-hidden border-2 shrink-0 w-20 h-14 sm:w-24 sm:h-16 transition-all cursor-pointer ${
                          selectedImageIndex === idx
                            ? `${accent.border} ring-2 ring-white/20`
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Elegant Category-Specific Visual Fallback (Aturan 7) */
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[16/8] sm:aspect-[16/7]">
                <ProjectCategoryFallback
                  category={project.category}
                  title={project.title}
                  year={project.year}
                  accentColor={data.settings.accentColor}
                />
              </div>
            )}

            {/* Project Title & Meta */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight">
                    {project.title}
                  </h2>
                  {project.featured && (
                    <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${accent.badge}`}>
                      Featured Work
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{project.category}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Tahun {project.year}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <StatusIcon className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Status: {currentStatus}</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-5 sm:p-6 rounded-2xl border border-white/[0.06] bg-white/[0.015]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
                  Tentang Proyek
                </h4>
                <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed whitespace-pre-line">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Key Features (ONLY displayed if data is available) */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fitur & Sorotan Utama</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {project.features.map((feature, fIdx) => (
                    <div 
                      key={fIdx}
                      className="p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.015] flex items-center gap-3 text-xs sm:text-sm text-neutral-200"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg} shrink-0`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Teknologi yang Digunakan</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.02] text-neutral-200"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Links (Live Demo & Source Code - ONLY if provided!) */}
            {(Boolean(project.liveDemoUrl?.trim()) || Boolean(project.sourceCodeUrl?.trim())) && (
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.08]">
                {project.liveDemoUrl && project.liveDemoUrl.trim() && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      currentStatus === 'Completed' || currentStatus === 'In Progress'
                        ? `inline-flex items-center gap-2 px-7 py-3 rounded-full ${accent.bg} text-black font-semibold text-xs font-mono shadow-lg hover:opacity-95 transition-all cursor-pointer`
                        : `inline-flex items-center gap-2 px-6 py-3 rounded-full border ${accent.border} ${accent.bgMuted} text-xs font-medium text-white hover:border-white/50 transition-all cursor-pointer`
                    }
                  >
                    <span>Kunjungi Website / Live Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                {project.sourceCodeUrl && project.sourceCodeUrl.trim() && (
                  <a
                    href={project.sourceCodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
                  >
                    <Github className="w-4 h-4" />
                    <span>Lihat Source Code di GitHub</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
