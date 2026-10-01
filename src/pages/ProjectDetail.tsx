import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
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
  Sparkles 
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ProjectStatus } from '../types';
import { getAccentClasses } from '../utils/theme';
import { ProjectCategoryFallback } from '../components/ProjectCategoryFallback';

interface ProjectDetailProps {
  projectId: string;
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const { data, navigate } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);

  const project = data.projects.find((p) => p.id === projectId);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-32 space-y-6">
        <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
          Error 404 // Project Not Found
        </span>
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-white">
          Proyek Tidak Ditemukan
        </h1>
        <p className="text-neutral-400 max-w-md text-sm font-light leading-relaxed">
          Proyek yang Anda cari mungkin telah dihapus, diubah tautannya, atau tidak aktif.
        </p>
        <button
          onClick={() => navigate('/works')}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-white/10 hover:border-white/30 text-xs font-mono text-white transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Halaman Works</span>
        </button>
      </div>
    );
  }

  // Collect images
  const allImages: string[] = [];
  if (project.imageUrl && project.imageUrl.trim()) {
    allImages.push(project.imageUrl.trim());
  }
  if (project.gallery && Array.isArray(project.gallery)) {
    project.gallery.forEach((url) => {
      if (url && url.trim() && !allImages.includes(url.trim())) {
        allImages.push(url.trim());
      }
    });
  }

  const currentStatus: ProjectStatus = project.status || 'Completed';

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'Completed':
        return {
          label: 'Completed',
          className: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
        };
      case 'In Progress':
        return {
          label: 'In Progress',
          className: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
          dot: 'bg-amber-400',
          icon: Clock,
        };
      case 'Prototype':
        return {
          label: 'Prototype',
          className: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
          dot: 'bg-sky-400',
          icon: Cpu,
        };
      case 'Concept':
      default:
        return {
          label: 'Concept',
          className: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
          dot: 'bg-purple-400',
          icon: Lightbulb,
        };
    }
  };

  const statusConfig = getStatusBadge(currentStatus);
  const StatusIcon = statusConfig.icon;
  const activeImage = allImages[selectedImageIndex] || null;

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 pt-32 pb-24 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 space-y-10">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/works')}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Semua Proyek</span>
          </button>

          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${statusConfig.className}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              <span>{statusConfig.label}</span>
            </span>
            <span className="text-xs font-mono text-neutral-400 bg-white/[0.03] px-2.5 py-1 rounded border border-white/5">
              {project.category}
            </span>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            {project.featured && (
              <span className={`text-xs font-mono px-3 py-1 rounded-full border ${accent.badge}`}>
                Featured Work
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
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

        {/* Visual Media Section */}
        {allImages.length > 0 ? (
          <div className="space-y-4">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/60 aspect-[16/10] sm:aspect-video group">
              <img
                src={activeImage || ''}
                alt={`${project.title} - Visual Preview`}
                className="w-full h-full object-cover sm:object-contain bg-black/90 transition-all duration-300"
                referrerPolicy="no-referrer"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white backdrop-blur-sm transition-all"
                    title="Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/15 text-white backdrop-blur-sm transition-all"
                    title="Selanjutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-xs font-mono text-neutral-300">
                {selectedImageIndex + 1} / {allImages.length}
              </div>
            </div>

            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative rounded-xl overflow-hidden border-2 shrink-0 w-24 h-16 transition-all cursor-pointer ${
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
          <div className="relative rounded-3xl overflow-hidden border border-white/10 aspect-[16/8] sm:aspect-[16/7]">
            <ProjectCategoryFallback
              category={project.category}
              title={project.title}
              year={project.year}
              accentColor={data.settings.accentColor}
            />
          </div>
        )}

        {/* Project Description & Key Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="lg:col-span-8 space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                Deskripsi & Konsep
              </h3>
              <p className="text-base sm:text-lg text-neutral-200 font-light leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Key Features (Only if available) */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fitur & Sorotan Utama</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.features.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-4 rounded-2xl border border-white/[0.06] bg-white/[0.015] flex items-center gap-3 text-sm text-neutral-200"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg} shrink-0`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Tech Stack */}
            <div className="p-6 rounded-3xl border border-white/[0.08] bg-white/[0.02] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-neutral-400" />
                <span>Teknologi</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-mono px-3 py-1 rounded-lg border border-white/10 bg-white/[0.02] text-neutral-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* External Links */}
            {(Boolean(project.liveDemoUrl?.trim()) || Boolean(project.sourceCodeUrl?.trim())) && (
              <div className="p-6 rounded-3xl border border-white/[0.08] bg-white/[0.02] space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-neutral-400">
                  Tautan Langsung
                </h3>
                {project.liveDemoUrl && project.liveDemoUrl.trim() && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      currentStatus === 'Completed' || currentStatus === 'In Progress'
                        ? `w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full ${accent.bg} text-black font-semibold text-xs font-mono shadow-lg hover:opacity-95 transition-all`
                        : `w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border ${accent.border} ${accent.bgMuted} text-xs font-medium text-white hover:border-white/50 transition-all`
                    }
                  >
                    <span>Kunjungi Website Live Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
                {project.sourceCodeUrl && project.sourceCodeUrl.trim() && (
                  <a
                    href={project.sourceCodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/10 hover:border-white/30 text-xs font-mono text-neutral-300 hover:text-white transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span>Source Code (GitHub)</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
