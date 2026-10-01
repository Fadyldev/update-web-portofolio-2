import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowUpRight, 
  Github, 
  Filter, 
  SlidersHorizontal,
  X,
  LayoutGrid,
  ListFilter,
  Eye,
  CheckCircle2,
  Clock,
  Cpu,
  Lightbulb,
  Sparkles,
  Image as ImageIcon
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project, ProjectCategory, ProjectStatus } from '../types';
import { getAccentClasses } from '../utils/theme';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { ProjectCategoryFallback } from '../components/ProjectCategoryFallback';

// Categories required by user specification
const FILTER_CATEGORIES = [
  'All Projects',
  'Web Development',
  'Digital Invitation',
  'Web Design',
  'Branding',
  'Graphic Design',
] as const;

export function Works() {
  const { data } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);

  const [selectedCategory, setSelectedCategory] = useState<string>('All Projects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal detail state
  const [activeDetailProject, setActiveDetailProject] = useState<Project | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    return data.projects
      .filter((project) => project.active)
      .filter((project) => {
        // Category matching
        let matchesCategory = false;
        if (selectedCategory === 'All Projects') {
          matchesCategory = true;
        } else if (selectedCategory === 'Web Development') {
          matchesCategory = project.category === 'Web Development' || project.category === 'Website Development';
        } else {
          matchesCategory = project.category === selectedCategory;
        }

        // Search query matching
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (
          project.title.toLowerCase().includes(q) ||
          project.description.toLowerCase().includes(q) ||
          project.category.toLowerCase().includes(q) ||
          project.techStack.some((t) => t.toLowerCase().includes(q))
        );

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => a.order - b.order);
  }, [data.projects, selectedCategory, searchQuery]);

  const handleOpenDetail = (project: Project) => {
    setActiveDetailProject(project);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const getStatusBadge = (status?: ProjectStatus) => {
    const s: ProjectStatus = status || 'Completed';
    switch (s) {
      case 'Completed':
        return {
          label: 'Completed',
          className: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10',
          dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]',
          icon: CheckCircle2,
        };
      case 'In Progress':
        return {
          label: 'In Progress',
          className: 'border-amber-500/30 text-amber-300 bg-amber-500/10',
          dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]',
          icon: Clock,
        };
      case 'Prototype':
        return {
          label: 'Prototype',
          className: 'border-sky-500/30 text-sky-300 bg-sky-500/10',
          dot: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.6)]',
          icon: Cpu,
        };
      case 'Concept':
      default:
        return {
          label: 'Concept',
          className: 'border-purple-500/30 text-purple-300 bg-purple-500/10',
          dot: 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.6)]',
          icon: Lightbulb,
        };
    }
  };

  return (
    <div id="works-page" className="min-h-screen bg-[#070709] text-neutral-100 pt-32 pb-24 relative">
      {/* Ambient background textures */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* Detail Modal Component */}
      <ProjectDetailModal
        project={activeDetailProject}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-10">
        {/* Page Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-neutral-300 uppercase">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
            <span>{data.about?.worksBadge || 'Studio Directory & Gallery'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white">
            {data.about?.worksTitle || 'Selected Works'}
          </h1>

          <p className="text-base sm:text-lg text-neutral-400 font-light leading-relaxed">
            {data.about?.worksDescription || 'Kumpulan proyek pengembangan web, antarmuka modern, dan undangan digital terkurasi. Setiap karya dirancang dengan fokus pada ketelitian tata letak, kecepatan, dan estetika yang bermakna.'}
          </p>
        </div>

        {/* Filter, Search, & View Mode Controls */}
        <div className="p-5 sm:p-6 rounded-3xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="works-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berdasarkan judul, teknologi, atau konsep..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/10 bg-black/40 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                  title="Hapus pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* View Mode Toggle & Count */}
            <div className="flex items-center justify-between md:justify-end gap-4">
              <div className="text-xs font-mono text-neutral-400 flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>
                  <strong className="text-white">{filteredProjects.length}</strong> dari {data.projects.length} karya
                </span>
              </div>

              {/* View Switcher */}
              <div className="flex items-center p-1 rounded-xl border border-white/10 bg-black/30">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    viewMode === 'grid' 
                      ? `${accent.bg} text-black font-semibold shadow-sm` 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Tampilan Galeri Visual (Kartu)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    viewMode === 'list' 
                      ? `${accent.bg} text-black font-semibold shadow-sm` 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title="Tampilan Indeks Editorial (Tabel)"
                >
                  <ListFilter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Chips - Mobile Responsive Horizontal Scrolling */}
          <div className="pt-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-mono text-neutral-400 mr-2 shrink-0 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Kategori:</span>
              </span>

              {FILTER_CATEGORIES.map((catName) => {
                const isSelected = selectedCategory === catName;
                // Calculate item count
                const count = data.projects.filter((p) => {
                  if (!p.active) return false;
                  if (catName === 'All Projects') return true;
                  if (catName === 'Web Development') return p.category === 'Web Development' || p.category === 'Website Development';
                  return p.category === catName;
                }).length;

                return (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-mono whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? `${accent.bg} text-black font-semibold shadow-md`
                        : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/25'
                    }`}
                  >
                    {catName} <span className="opacity-75">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center rounded-3xl border border-dashed border-white/10 p-8 space-y-4">
            <p className="text-neutral-400 font-mono text-sm">
              Tidak ada proyek yang sesuai dengan kriteria filter atau pencarian Anda.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Projects');
                setSearchQuery('');
              }}
              className="text-xs font-mono text-white underline underline-offset-4 cursor-pointer"
            >
              Reset filter pencarian
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* =========================================================================
             VISUAL CARDS GRID (PRIMARY VIEW - FEATURES 1, 2, 3, 4)
             ========================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, index) => {
              const status = getStatusBadge(project.status);
              const StatusIcon = status.icon;
              const hasImage = Boolean(project.imageUrl && project.imageUrl.trim());
              const galleryCount = project.gallery?.length || 0;
              const isWebsite = 
                project.category === 'Web Development' || 
                project.category === 'Website Development' || 
                project.category === 'Digital Invitation' || 
                project.category === 'Web Design';
              const isVisual = 
                project.category === 'Graphic Design' || 
                project.category === 'Branding';
              const hasLiveDemo = Boolean(project.liveDemoUrl && project.liveDemoUrl.trim());
              const isLiveReady = hasLiveDemo && (project.status === 'Completed' || project.status === 'In Progress');

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
                  className="group relative rounded-3xl border border-white/[0.08] bg-[#0c0d12]/80 hover:border-white/20 hover:bg-[#10121a] transition-all duration-300 flex flex-col overflow-hidden shadow-xl"
                >
                  {/* Visual Header / Cover Image or Elegant Category Fallback */}
                  <div 
                    onClick={() => handleOpenDetail(project)}
                    className="relative aspect-[16/10] overflow-hidden bg-black/60 cursor-pointer border-b border-white/[0.06]"
                  >
                    {hasImage ? (
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          // Hide broken image smoothly
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      /* Elegant Category-Specific Visual Fallback (Aturan 7) */
                      <ProjectCategoryFallback
                        category={project.category}
                        title={project.title}
                        year={project.year}
                        accentColor={data.settings.accentColor}
                      />
                    )}

                    {/* Gradient Overlay & Status Badge */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border backdrop-blur-md ${status.className}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        <span>{status.label}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {isVisual && galleryCount > 0 && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono border border-purple-500/30 bg-purple-500/20 text-purple-200 backdrop-blur-md">
                            <ImageIcon className="w-3 h-3" />
                            <span>{galleryCount + (hasImage ? 1 : 0)} Foto</span>
                          </span>
                        )}

                        {project.featured && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border backdrop-blur-md ${accent.badge}`}>
                            Featured
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hover Peek Prompt */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all flex items-center justify-center gap-2.5 z-20 p-4">
                      {isLiveReady ? (
                        <>
                          <a
                            href={project.liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full ${accent.bg} text-black font-semibold text-xs font-mono shadow-lg hover:opacity-95 transition-all`}
                          >
                            <span>Buka Live Demo</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleOpenDetail(project)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/15 border border-white/20 text-xs font-mono text-white hover:bg-white/25 transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenDetail(project)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-xs font-mono text-white hover:bg-white/30 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isVisual ? (galleryCount > 0 ? `Lihat Galeri (${galleryCount + (hasImage ? 1 : 0)} Foto)` : 'Lihat Galeri Desain') : 'Buka Detail Proyek'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Content Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
                        <span>{project.category}</span>
                        <span>{project.year}</span>
                      </div>

                      <h3 
                        onClick={() => handleOpenDetail(project)}
                        className="text-lg sm:text-xl font-display font-bold text-white group-hover:text-neutral-200 transition-colors cursor-pointer"
                      >
                        {project.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-400 font-light line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="space-y-4 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-neutral-300"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 text-neutral-500">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Card Action Bar (Aturan 2, 8, 9 Prioritas Live Demo vs Visual) */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                        {isLiveReady ? (
                          /* Website with active demo: prioritize LIVE DEMO as primary button */
                          <>
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full ${accent.bg} text-black font-semibold text-xs font-mono shadow-sm hover:opacity-90 transition-all`}
                              title="Kunjungi Live Demo Website"
                            >
                              <span>Live Demo</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenDetail(project)}
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/[0.02] transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Detail</span>
                              </button>

                              {project.sourceCodeUrl && project.sourceCodeUrl.trim() && (
                                <a
                                  href={project.sourceCodeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] text-neutral-400 hover:text-white transition-all"
                                  title="Lihat Source Code GitHub"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </>
                        ) : isVisual ? (
                          /* Graphic Design / Branding: prioritize Gallery / Visual Detail */
                          <>
                            <button
                              onClick={() => handleOpenDetail(project)}
                              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${accent.border} ${accent.bgMuted} text-xs font-mono font-medium text-white hover:border-white/50 transition-all cursor-pointer`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{galleryCount > 0 ? `Galeri (${galleryCount + (hasImage ? 1 : 0)})` : 'Detail Karya'}</span>
                            </button>

                            <div className="flex items-center gap-2">
                              {hasLiveDemo && (
                                <a
                                  href={project.liveDemoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-white/10 hover:border-white/30 text-[11px] font-mono text-neutral-300 hover:text-white transition-all"
                                >
                                  <span>Demo</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </a>
                              )}

                              {project.sourceCodeUrl && project.sourceCodeUrl.trim() && (
                                <a
                                  href={project.sourceCodeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] text-neutral-400 hover:text-white transition-all"
                                  title="Lihat Source Code GitHub"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </>
                        ) : (
                          /* Concept / General project: Detail is primary, live demo if available */
                          <>
                            <button
                              onClick={() => handleOpenDetail(project)}
                              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.02] transition-colors cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-neutral-400" />
                              <span>Detail Proyek</span>
                            </button>

                            <div className="flex items-center gap-2">
                              {hasLiveDemo && (
                                <a
                                  href={project.liveDemoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border ${accent.border} ${accent.bgMuted} text-[11px] font-mono text-white hover:border-white/50 transition-all`}
                                >
                                  <span>Demo</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </a>
                              )}

                              {project.sourceCodeUrl && project.sourceCodeUrl.trim() && (
                                <a
                                  href={project.sourceCodeUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] text-neutral-400 hover:text-white transition-all"
                                  title="Lihat Source Code GitHub"
                                >
                                  <Github className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* =========================================================================
             EDITORIAL INDEX VIEW (TABLE/LIST FORMAT)
             ========================================================================= */
          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-12 gap-6 px-6 py-2 text-[11px] font-mono uppercase tracking-widest text-neutral-400 border-b border-white/[0.06]">
              <div className="col-span-1">No.</div>
              <div className="col-span-4">Judul & Konsep</div>
              <div className="col-span-2">Kategori & Status</div>
              <div className="col-span-3">Teknologi Digunakan</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>

            <div className="divide-y divide-white/[0.06]">
              {filteredProjects.map((project, index) => {
                const status = getStatusBadge(project.status);
                const hasLiveDemo = Boolean(project.liveDemoUrl && project.liveDemoUrl.trim());
                const isLiveReady = hasLiveDemo && (project.status === 'Completed' || project.status === 'In Progress');
                const isVisual = project.category === 'Graphic Design' || project.category === 'Branding';
                const galleryCount = project.gallery?.length || 0;
                const hasImage = Boolean(project.imageUrl && project.imageUrl.trim());

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                    className="group relative p-6 rounded-2xl transition-all duration-300 hover:bg-white/[0.025] border border-transparent hover:border-white/[0.08]"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Index Number */}
                      <div className="md:col-span-1 flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-mono font-light text-neutral-400 group-hover:text-white transition-colors">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="md:col-span-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => handleOpenDetail(project)}
                            className="text-lg sm:text-xl font-display font-bold text-white hover:underline transition-colors cursor-pointer"
                          >
                            {project.title}
                          </h3>
                          {project.featured && (
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${accent.badge}`}>
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                          {project.description}
                        </p>
                      </div>

                      {/* Category & Status */}
                      <div className="md:col-span-2 flex md:flex-col justify-between items-baseline gap-2 text-xs font-mono">
                        <span className="text-neutral-300 bg-white/[0.03] px-2.5 py-1 rounded-md border border-white/5 inline-block">
                          {project.category}
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${status.className}`}>
                          <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                          <span>{status.label}</span>
                        </span>
                        <span className="text-neutral-400 text-[11px]">{project.year}</span>
                      </div>

                      {/* Tech Stack */}
                      <div className="md:col-span-3">
                        <div className="flex flex-wrap gap-1.5">
                          {project.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[11px] font-mono px-2 py-0.5 rounded border border-white/10 bg-white/[0.02] text-neutral-300 group-hover:border-white/20 transition-colors"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions with Priority Logic (Aturan 2, 8, 9) */}
                      <div className="md:col-span-2 flex md:flex-col md:items-end gap-2 pt-2 md:pt-0">
                        {isLiveReady ? (
                          <>
                            <a
                              href={project.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3.5 py-1.5 rounded-full ${accent.bg} text-black hover:opacity-90 transition-all shadow-sm`}
                            >
                              <span>Live Demo</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>

                            <button
                              onClick={() => handleOpenDetail(project)}
                              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] cursor-pointer transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>
                          </>
                        ) : isVisual ? (
                          <>
                            <button
                              onClick={() => handleOpenDetail(project)}
                              className={`inline-flex items-center gap-1.5 text-xs font-mono px-3.5 py-1.5 rounded-full border ${accent.border} ${accent.bgMuted} text-white hover:border-white/50 cursor-pointer transition-all`}
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{galleryCount > 0 ? `Galeri (${galleryCount + (hasImage ? 1 : 0)})` : 'Karya'}</span>
                            </button>

                            {hasLiveDemo && (
                              <a
                                href={project.liveDemoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white px-3 py-1 rounded-full border border-white/10 hover:border-white/25 transition-all"
                              >
                                <span>Demo</span>
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenDetail(project)}
                              className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-300 hover:text-white px-3 py-1.5 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.02] cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Detail</span>
                            </button>

                            {hasLiveDemo && (
                              <a
                                href={project.liveDemoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className={`inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-full border ${accent.border} ${accent.bgMuted} text-white hover:border-white/50 transition-all`}
                              >
                                <span>Live Demo</span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                              </a>
                            )}
                          </>
                        )}

                        {project.sourceCodeUrl && project.sourceCodeUrl.trim() && (
                          <a
                            href={project.sourceCodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white px-2.5 py-1 rounded-full border border-white/10 hover:border-white/25 transition-all"
                          >
                            <Github className="w-3 h-3" />
                            <span>Source</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Left accent hairline hover highlight */}
                    <span className={`absolute left-0 top-3 bottom-3 w-[2px] ${accent.bg} scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center rounded-full`} />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
