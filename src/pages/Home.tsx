import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Sparkles, 
  FileText,
  MessageCircle,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/theme';
import { ResumeModal } from '../components/ResumeModal';
import { ProjectCategoryFallback } from '../components/ProjectCategoryFallback';
import { DEFAULT_ABOUT_CONTENT } from '../data/defaultData';

export function Home() {
  const { data, navigate } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const about = {
    ...DEFAULT_ABOUT_CONTENT,
    ...(data.about || {}),
  };

  // Take maximum 3 projects for Selected Works: prioritize featured projects first, then active
  const selectedWorks = [...data.projects]
    .filter((p) => p.active)
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    .slice(0, 3);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(data.profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const whatsappCleanNumber = (data.profile.whatsapp || '').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
    'Halo Fadiyel, saya melihat portofolio Anda dan tertarik untuk berdiskusi mengenai proyek web / desain.'
  )}`;

  return (
    <div id="home-page" className="min-h-screen bg-[#070709] text-neutral-100 relative">
      {/* Subtle ambient canvas background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      {/* =========================================================================
          1. HERO SECTION
          ========================================================================= */}
      <section 
        id="hero-section" 
        className="relative min-h-[92vh] flex flex-col justify-center max-w-6xl mx-auto px-6 pt-32 pb-20 overflow-hidden"
      >
        {/* Abstract futuristic moving geometric orb / wireframe element - Fully optimized & centered on Mobile & Desktop */}
        <div className="absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 max-sm:left-1/2 max-sm:right-auto max-sm:-translate-x-1/2 max-sm:top-[36%] max-sm:-translate-y-1/2 w-[270px] h-[270px] sm:w-[500px] sm:h-[500px] pointer-events-none opacity-90 sm:opacity-85 transform-gpu z-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full relative"
          >
            {/* Outer dotted/dashed ring with accent tone */}
            <div className={`absolute inset-0 rounded-full border-2 border-dashed ${accent.border} shadow-[0_0_25px_rgba(251,191,36,0.2)]`} />
            {/* Middle geometric ring with offset tilt */}
            <div className="absolute inset-5 sm:inset-8 rounded-full border border-white/35 sm:border-white/20 [transform:rotateX(60deg)]" />
            {/* Inner glowing core with offset tilt */}
            <div className="absolute inset-11 sm:inset-20 rounded-full border border-white/45 sm:border-white/25 [transform:rotateY(55deg)]" />
            {/* Glowing ambient radiance */}
            <div 
              className={`absolute inset-12 sm:inset-28 rounded-full blur-2xl ${
                data.settings.accentColor === 'blue'
                  ? 'bg-sky-500/25'
                  : data.settings.accentColor === 'emerald'
                  ? 'bg-emerald-500/25'
                  : 'bg-amber-400/25'
              }`} 
            />
          </motion.div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl space-y-8">
          {/* Top subtle identifier badge with active availability beacon */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accent.dotBg} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${accent.dotBg}`} />
            </span>
            <span className="text-[11px] font-mono tracking-widest text-neutral-300 uppercase">
              {data.profile.statusText || 'Available for New Projects & Collaboration'}
            </span>
          </motion.div>

          {/* Large Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-2"
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold tracking-tight text-white leading-none">
              {data.profile.name.toUpperCase()}
            </h1>
            <p className="text-lg sm:text-2xl font-display font-light text-neutral-400 tracking-wide">
              {data.profile.profession}
            </p>
          </motion.div>

          {/* Short Honest Bio Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-lg text-neutral-300 font-light leading-relaxed max-w-xl"
          >
            {data.profile.bio}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <button
              id="hero-explore-work-btn"
              onClick={() => {
                const elem = document.getElementById('selected-works-section');
                if (elem) {
                  elem.scrollIntoView({ behavior: 'smooth' });
                } else {
                  navigate('/works');
                }
              }}
              className={`group inline-flex items-center gap-3 px-8 py-3.5 rounded-full border ${accent.border} ${accent.bgMuted} text-white text-sm font-medium tracking-wide transition-all duration-300 hover:border-white/50 ${accent.glow} cursor-pointer`}
            >
              <span>{data.settings.heroCtaText || 'Explore My Work'}</span>
              <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:translate-x-1 group-hover:text-white transition-transform" />
            </button>

            <button
              id="hero-contact-btn"
              onClick={() => navigate('/contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 hover:border-white/30 bg-transparent text-sm text-neutral-300 hover:text-white transition-all cursor-pointer"
            >
              <span>Hubungi Fadiyel</span>
              <ArrowUpRight className="w-4 h-4 opacity-60" />
            </button>

            <button
              id="hero-resume-btn"
              onClick={() => setIsResumeOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.06] text-sm text-neutral-200 hover:text-white transition-all cursor-pointer"
              title="Pratinjau & Unduh Resume / CV"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Unduh CV / Resume</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          2. ABOUT PREVIEW SECTION
          ========================================================================= */}
      <section 
        id="about-preview-section" 
        className="py-24 border-t border-white/[0.08] relative"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
            <div className="md:col-span-5 lg:col-span-4 space-y-5">
              <div className="space-y-3">
                <span className="text-xs font-mono tracking-widest text-neutral-300 uppercase flex items-center gap-2">
                  <span className={`w-1 h-3 ${accent.bg}`} />
                  <span>{about.previewBadge || '01 // Profil Singkat'}</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  {about.previewTitle || 'Eksplorasi & Perkembangan'}
                </h2>
              </div>

              {/* Professional Creator Portrait Card */}
              {data.profile.avatarUrl && (
                <div className="relative group pt-1 max-w-[270px]">
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.03] aspect-[3/4] shadow-2xl">
                    <img
                      src={data.profile.avatarUrl}
                      alt={data.profile.name}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-white font-medium">{data.profile.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded border border-white/20 bg-black/60 text-amber-300">
                        STUDIO LEAD
                      </span>
                    </div>
                  </div>
                  {/* Subtle decorative futuristic corner notches */}
                  <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${accent.border}`} />
                  <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${accent.border}`} />
                </div>
              )}
            </div>

            <div className="md:col-span-7 lg:col-span-8 space-y-6 pt-2">
              <p className="text-lg sm:text-xl text-neutral-300 font-light leading-relaxed">
                "{data.profile.headline}"
              </p>

              <div className="space-y-4 text-sm sm:text-base text-neutral-400 leading-relaxed">
                <p>
                  {about.previewParagraph1 || 'Sebagai web developer dan visual designer yang sedang aktif membangun portofolio, saya tidak menggunakan klaim berlebihan mengenai ratusan klien fiktif. Fokus saya adalah kejujuran karya: membangun antarmuka web yang bersih, responsif, dan memiliki kedalaman estetika yang matang.'}
                </p>
                <p>
                  {about.previewParagraph2 || 'Dari perancangan vektor di Inkscape hingga perakitan komponen interaktif dengan React dan Tailwind CSS, setiap proyek adalah langkah nyata dalam mengasah keterampilan teknis dan kepekaan desain.'}
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="about-preview-more-btn"
                  onClick={() => navigate('/about')}
                  className="group inline-flex items-center gap-2 text-sm font-medium text-white hover:text-neutral-200 transition-colors cursor-pointer"
                >
                  <span className="border-b border-white/30 pb-0.5 group-hover:border-white transition-colors">
                    More About Me & Creative Process
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SELECTED WORKS SECTION (Max 3, Editorial List, NO large images)
          ========================================================================= */}
      <section 
        id="selected-works-section" 
        className="py-24 border-t border-white/[0.08] bg-[#050507]/60 relative overflow-hidden"
      >
        {/* Subtle futuristic kinetic blueprint watermark in Selected Works background */}
        <div className="absolute right-4 sm:right-16 top-10 sm:top-16 w-52 h-52 sm:w-80 sm:h-80 pointer-events-none opacity-20 sm:opacity-25 transform-gpu">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full relative"
          >
            <div className={`absolute inset-0 rounded-full border border-dashed ${accent.border}`} />
            <div className="absolute inset-8 sm:inset-12 rounded-full border border-white/20 [transform:rotateX(45deg)]" />
            <div className="absolute inset-16 sm:inset-24 rounded-full border border-white/30 [transform:rotateY(45deg)]" />
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/10" />
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10" />
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto px-6 space-y-12 relative z-10">
          {/* Header with dynamic editable badge, title & description */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono tracking-widest text-neutral-300 uppercase flex items-center gap-2">
                <span className={`w-1 h-3 ${accent.bg}`} />
                <span>{about.selectedWorksBadge || '02 // Selected Archive'}</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                {about.selectedWorksTitle || 'Karya Pilihan'}
              </h2>
              {about.selectedWorksDescription && (
                <p className="text-sm text-neutral-400 font-light leading-relaxed pt-1">
                  {about.selectedWorksDescription}
                </p>
              )}
            </div>

            <button
              id="view-all-works-btn"
              onClick={() => navigate('/works')}
              className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-neutral-400 hover:text-white uppercase transition-colors cursor-pointer shrink-0"
            >
              <span>{about.selectedWorksButtonText || `View All Works (${data.projects.length})`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Editorial List Layout with Scroll Reveal & Mobile Responsive Animation */}
          <div className="divide-y divide-white/[0.08]">
            {selectedWorks.map((project, idx) => {
              const isHovered = hoveredProject === project.id;
              const hasImage = Boolean(project.imageUrl && project.imageUrl.trim());

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: idx * 0.12, ease: 'easeOut' }}
                  whileTap={{ scale: 0.995 }}
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="group relative py-8 sm:py-10 transition-all duration-300 hover:bg-white/[0.02] px-4 -mx-4 rounded-xl"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Project Number & Meta */}
                    <div className="md:col-span-2 flex md:flex-col justify-between items-baseline gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-mono font-light text-neutral-300 group-hover:text-white transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {/* Mobile active beacon dot */}
                        <span className="sm:hidden relative flex h-2 w-2">
                          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${accent.dotBg} opacity-75`} />
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${accent.dotBg}`} />
                        </span>
                      </div>
                      <div className="flex flex-col text-xs font-mono text-neutral-300">
                        <span>{project.category}</span>
                        <span className="text-neutral-400">{project.year}</span>
                      </div>
                    </div>

                    {/* Thumbnail Preview (Visible on both mobile & desktop) */}
                    <div className="md:col-span-4 overflow-hidden rounded-xl border border-white/10 sm:border-white/10 max-sm:border-white/20 bg-white/[0.02] aspect-[16/10] relative group-hover:border-white/30 transition-all shadow-md">
                      {hasImage ? (
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <ProjectCategoryFallback
                          category={project.category}
                          title={project.title}
                          year={project.year}
                          accentColor={data.settings.accentColor}
                          compact
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity" />
                    </div>

                    {/* Title & Description & Tech */}
                    <div className="md:col-span-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 
                          onClick={() => navigate('/works')}
                          className="text-xl sm:text-2xl font-display font-semibold text-white group-hover:text-neutral-100 transition-colors cursor-pointer"
                        >
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${accent.border} ${accent.text}`}>
                            Featured
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-neutral-400 font-light leading-relaxed line-clamp-2">
                        {project.description}
                      </p>

                      {/* Tech Stack Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-mono px-2.5 py-0.5 rounded-full border border-white/10 bg-white/[0.02] text-neutral-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Live Demo & Detail Action */}
                    <div className="md:col-span-2 flex md:flex-col md:items-end justify-start gap-2 pt-2 md:pt-0">
                      {project.liveDemoUrl && (
                        <a
                          href={project.liveDemoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border ${accent.border} ${accent.bgMuted} text-xs font-medium text-white hover:border-white/40 transition-all`}
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
                        </a>
                      )}
                      <button
                        onClick={() => navigate('/works')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 text-xs font-mono text-neutral-400 hover:text-white transition-all cursor-pointer"
                        title="Lihat Detail Proyek"
                      >
                        <span>Detail</span>
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </button>
                    </div>
                  </div>

                  {/* Subtle expanding hairline underline: interactive sweep on desktop hover, radiant line on mobile */}
                  <span className={`absolute bottom-0 left-4 right-4 h-[1px] ${accent.bg} scale-x-100 opacity-40 sm:opacity-0 sm:scale-x-0 sm:group-hover:scale-x-100 sm:group-hover:opacity-100 transition-all duration-500 origin-left`} />
                </motion.div>
              );
            })}
          </div>

          {/* Bottom view all works prompt */}
          <div className="text-center pt-4">
            <button
              onClick={() => navigate('/works')}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] text-xs font-mono tracking-widest text-neutral-300 hover:text-white uppercase transition-all cursor-pointer"
            >
              <span>Explore All Studio Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA / Collaboration Section */}

      {/* =========================================================================
          5. COLLABORATION SECTION
          ========================================================================= */}
      {data.settings.showCollaborationSection && (
        <section 
          id="collaboration-section" 
          className="py-28 border-t border-white/[0.08] bg-gradient-to-b from-transparent via-white/[0.01] to-transparent relative overflow-hidden"
        >
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono tracking-widest text-neutral-300 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{about.collabBadge || "Let's Create Together"}</span>
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white tracking-tight leading-tight">
              {about.collabTitle || '“Open to learning, creative collaboration, and meaningful digital projects.”'}
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
              {about.collabDescription || 'Membuka ruang diskusi untuk pembuatan website portofolio, undangan pernikahan digital bertema artistik, antarmuka web responsif, atau proyek kreatif visual.'}
            </p>

            {/* Action CTAs: Form Inquiry + Direct WhatsApp + One-Click Email */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                id="collab-cta-btn"
                onClick={() => navigate('/contact')}
                className={`group inline-flex items-center gap-3 px-8 py-4 rounded-full border ${accent.border} ${accent.bgMuted} text-white text-sm font-semibold tracking-wide transition-all duration-300 hover:border-white/50 ${accent.glow} cursor-pointer`}
              >
                <span>{about.collabButtonText || 'Kirim Pesan / Brief Proyek'}</span>
                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:translate-x-1 group-hover:text-white transition-transform" />
              </button>

              {/* Direct WhatsApp Button */}
              {data.profile.whatsapp && (
                <a
                  id="collab-whatsapp-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-sm font-medium transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat WhatsApp</span>
                </a>
              )}

              {/* Quick Copy Email Button */}
              {data.profile.email && (
                <button
                  id="collab-copy-email-btn"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.03] text-sm text-neutral-300 hover:text-white transition-all cursor-pointer"
                  title="Salin alamat email"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-mono text-xs">Email Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 opacity-60" />
                      <span className="font-mono text-xs truncate max-w-[200px]">{data.profile.email}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Resume / CV Modal Component */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        data={data}
      />
    </div>
  );
}
