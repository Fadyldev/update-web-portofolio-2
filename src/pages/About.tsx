import { motion } from 'motion/react';
import { 
  Compass, 
  Layers, 
  Terminal, 
  Sparkles, 
  Cpu, 
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Target
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { WORK_PROCESS_STEPS, CREATIVE_TOOLS, DEFAULT_ABOUT_CONTENT } from '../data/defaultData';
import { getAccentClasses } from '../utils/theme';

export function About() {
  const { data, navigate } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);
  const about = {
    ...DEFAULT_ABOUT_CONTENT,
    ...(data.about || {}),
  };

  return (
    <div id="about-page" className="min-h-screen bg-[#070709] text-neutral-100 pt-32 pb-24 relative">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-grid-pattern opacity-25 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-24">
        {/* =========================================================================
            1. PROFILE NARRATIVE WITH CREATOR PORTRAIT
            ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-neutral-300 uppercase">
              <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
              <span>{about.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-display font-extrabold tracking-tight text-white leading-tight">
              {about.title}
            </h1>

            <div className="space-y-6 text-base sm:text-lg text-neutral-300 font-light leading-relaxed">
              <p>
                {about.bioParagraph1}
              </p>

              <p className="text-neutral-400">
                {about.bioParagraph2}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate('/contact')}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${accent.border} ${accent.bgMuted} text-xs font-mono tracking-widest text-white uppercase hover:border-white/40 transition-all cursor-pointer`}
              >
                <span>Mulai Kolaborasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => navigate('/works')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono tracking-widest text-neutral-400 hover:text-white uppercase transition-all cursor-pointer"
              >
                <span>Buka Galeri Karya</span>
              </button>
            </div>
          </div>

          {/* Portrait Photo Column */}
          {data.profile.avatarUrl && (
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
              <div className="relative group w-full max-w-[320px]">
                <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-white/[0.02] aspect-[3/4] shadow-2xl">
                  <img
                    src={data.profile.avatarUrl}
                    alt={data.profile.name}
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                  
                  {/* Bottom portrait plaque */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                    <div>
                      <span className="text-white font-semibold block">{data.profile.name}</span>
                      <span className="text-[10px] text-neutral-400">{data.profile.profession}</span>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${accent.dotBg}`} />
                  </div>
                </div>

                {/* Subtle outer tech corner lines */}
                <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 ${accent.border}`} />
                <div className={`absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 ${accent.border}`} />
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            2. SKILLS DIRECTORY
            ========================================================================= */}
        <div className="space-y-10 border-t border-white/[0.08] pt-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-neutral-300 uppercase flex items-center gap-2">
              <span className={`w-1 h-3 ${accent.bg}`} />
              <span>01 // Technical Capabilities</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              {about.skillsTitle || "Keahlian & Penguasaan"}
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl">
              {about.skillsDescription || "Daftar keahlian teknis dan artistik yang terus dilatih dan diterapkan pada proyek-proyek riil."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded border border-white/10 text-neutral-300">
                    {skill.category}
                  </span>
                </div>

                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  {skill.description}
                </p>

                {skill.level && (
                  <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-neutral-300 border-t border-white/[0.05]">
                    <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
                    <span>{skill.level}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            3. CREATIVE WORK PROCESS TIMELINE (Concept -> Design -> Development -> Final Result)
            ========================================================================= */}
        <div className="space-y-12 border-t border-white/[0.08] pt-16">
          <div className="space-y-3">
            <span className="text-xs font-mono tracking-widest text-neutral-300 uppercase flex items-center gap-2">
              <span className={`w-1 h-3 ${accent.bg}`} />
              <span>02 // Methodology</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              Creative Process Timeline
            </h2>
            <p className="text-sm text-neutral-400 max-w-xl">
              Alur kerja terstruktur yang diterapkan dalam mengeksekusi setiap rancangan dari ide murni hingga produk siap rilis.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line on desktop */}
            <div className="hidden lg:block absolute top-12 left-8 right-8 h-[1px] bg-gradient-to-r from-white/10 via-white/20 to-white/10 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {(about.processSteps && about.processSteps.length > 0 ? about.processSteps : WORK_PROCESS_STEPS).map((step, idx) => (
                <motion.div
                  key={step.number || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-white/20 transition-all space-y-4"
                >
                  {/* Step Number capsule */}
                  <div className="flex items-center justify-between">
                    <span className={`w-10 h-10 rounded-full border ${accent.border} ${accent.bgMuted} flex items-center justify-center font-mono font-bold text-sm text-white ${accent.glowSubtle}`}>
                      {step.number || `0${idx + 1}`}
                    </span>
                    <span className="text-[10px] font-mono tracking-widest text-neutral-300 uppercase">
                      PHASE {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1 pt-2">
                    <h3 className="font-display font-bold text-xl text-white">
                      {step.title}
                    </h3>
                    <p className="text-xs font-mono text-neutral-400">
                      {step.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-400 font-light leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. GOALS & LEARNING MILESTONES
            ========================================================================= */}
        <div className="p-8 sm:p-12 rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.03] to-white/[0.005] space-y-6">
          <div className="flex items-center gap-3 text-xs font-mono tracking-widest text-neutral-300 uppercase">
            <span className={`w-1 h-3 ${accent.bg}`} />
            <Target className="w-4 h-4 text-amber-400" />
            <span>03 // Target Perkembangan & Rencana Belajar</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Komitmen Terhadap Perkembangan Berkelanjutan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-neutral-400 font-light pt-2">
            {(about.milestones && about.milestones.length > 0 ? about.milestones : DEFAULT_ABOUT_CONTENT.milestones).map((milestone, idx) => (
              <div key={idx} className="space-y-2 border-l border-white/10 pl-4">
                <span className="text-xs font-mono text-white block font-medium">{milestone.title}</span>
                <p className="text-xs leading-relaxed">
                  {milestone.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
