import { ArrowLeft, Home as HomeIcon } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/theme';

export function NotFound() {
  const { data, navigate } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);

  return (
    <div id="not-found-page" className="min-h-screen bg-[#070709] text-neutral-100 flex flex-col items-center justify-center px-6 py-24 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

      <div className="relative z-10 max-w-md text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono tracking-widest text-neutral-400 uppercase">
          <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
          <span>404 // Route Not Found</span>
        </div>

        <h1 className="text-6xl sm:text-8xl font-display font-extrabold text-white tracking-tight">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-display font-bold text-neutral-200">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            Halaman yang Anda tuju tidak tersedia atau tautan telah dipindahkan.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('/')}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border ${accent.border} ${accent.bgMuted} text-xs font-medium text-white hover:border-white/50 transition-all cursor-pointer`}
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span>Ke Halaman Utama</span>
          </button>

          <button
            onClick={() => navigate('/works')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:border-white/25 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lihat Galeri Karya</span>
          </button>
        </div>
      </div>
    </div>
  );
}
