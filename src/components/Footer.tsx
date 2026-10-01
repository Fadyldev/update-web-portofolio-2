import { ArrowUp, Lock, Github, Instagram, Mail, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/theme';

export function Footer() {
  const { data, navigate } = usePortfolio();
  const accent = getAccentClasses(data.settings.accentColor);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="studio-footer" className="relative border-t border-white/[0.08] bg-[#050507] pt-16 pb-12 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-grid-pattern opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${accent.dotBg}`} />
              <span className="font-display text-xl font-bold tracking-wider text-white">
                FADIYEL
              </span>
            </div>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              {data.profile.headline || 'Membangun Pengalaman Digital yang Elegan, Sinematik, dan Bernyawa.'}
            </p>
            <p className="text-xs font-mono text-neutral-300">
              Web Developer • Designer • Digital Creator
            </p>
          </div>

          {/* Quick Page Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-neutral-300 uppercase">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Overview / Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/works')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Selected & All Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/about')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About & Creative Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact & Collaboration
                </button>
              </li>
            </ul>
          </div>

          {/* Social Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono tracking-widest text-neutral-300 uppercase">
              Direct Channels
            </h4>
            <div className="flex flex-col space-y-2 text-sm text-neutral-400">
              {data.profile.email && (
                <a
                  href={`mailto:${data.profile.email}`}
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="truncate">{data.profile.email}</span>
                </a>
              )}
              {data.profile.whatsapp && (
                <a
                  href={`https://wa.me/${data.profile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-neutral-300" />
                  <span>WhatsApp Chat</span>
                </a>
              )}
              {data.profile.instagram && (
                <a
                  href={`https://instagram.com/${data.profile.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5 text-neutral-300" />
                  <span>@{data.profile.instagram.replace('@', '')}</span>
                </a>
              )}
              {data.profile.github && (
                <a
                  href={`https://github.com/${data.profile.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Github className="w-3.5 h-3.5 text-neutral-300" />
                  <span>github.com/{data.profile.github}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-300">
          <div>
            &copy; {new Date().getFullYear()} FADIYEL STUDIO. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            {/* Discrete Studio Admin terminal entry point */}
            <button
              onClick={() => navigate('/admin')}
              title="Studio Portal (Admin)"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-300 transition-colors cursor-pointer"
            >
              <Lock className="w-3 h-3 opacity-60" />
              <span className="text-[10px]">Studio Terminal</span>
            </button>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
