import { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { getAccentClasses } from '../utils/theme';
import { ResumeModal } from './ResumeModal';

export function Navbar() {
  const { currentPath, navigate, data } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const accent = getAccentClasses(data.settings.accentColor);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Works', path: '/works' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navigation-header"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#070709]/85 backdrop-blur-md border-b border-white/[0.06] py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="nav-brand-logo"
          onClick={() => handleNavClick('/')}
          className="group flex items-center gap-2.5 text-left cursor-pointer focus:outline-none"
        >
          <div className={`w-2 h-2 rounded-full ${accent.dotBg} transition-transform duration-300 group-hover:scale-150`} />
          <span className="font-display text-lg font-bold tracking-wider text-white group-hover:text-neutral-200 transition-colors">
            FADIYEL
          </span>
          <span className="text-[10px] font-mono tracking-widest text-neutral-300 px-1.5 py-0.5 rounded border border-white/5 bg-white/[0.02]">
            STUDIO
          </span>
        </button>

        {/* Desktop Navigation Links (NOTE: Admin button is intentionally NOT included here) */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`relative py-1 font-medium transition-colors cursor-pointer tracking-wide ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[1.5px] ${accent.bg} rounded-full transition-all`}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Status indicator & Direct CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            id="nav-resume-btn"
            onClick={() => setIsResumeOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300 hover:text-white hover:border-white/30 transition-all cursor-pointer"
            title="Pratinjau Resume / CV"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>CV</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg} animate-pulse`} />
            <span>{data.profile.statusText || 'Available for Projects'}</span>
          </div>

          <button
            onClick={() => handleNavClick('/contact')}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] text-xs font-medium text-white hover:border-white/30 hover:bg-white/[0.08] transition-all cursor-pointer`}
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <button
          id="mobile-nav-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg border border-white/10 text-neutral-300 hover:text-white hover:border-white/20 transition-colors"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-[#0a0a0e]/95 backdrop-blur-xl px-6 py-6 transition-all">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link.path)}
                  className={`flex items-center justify-between text-left py-2 font-display text-base transition-colors ${
                    isActive ? accent.text + ' font-semibold' : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />}
                </button>
              );
            })}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsResumeOpen(true);
                }}
                className="w-full py-2.5 rounded-full text-center text-xs font-mono tracking-wide border border-white/15 bg-white/[0.04] text-neutral-200 flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Unduh CV / Resume PDF</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <span className={`w-1.5 h-1.5 rounded-full ${accent.dotBg}`} />
                <span>{data.profile.statusText}</span>
              </div>
              <button
                onClick={() => handleNavClick('/contact')}
                className={`w-full py-2.5 rounded-full text-center text-xs font-medium tracking-wide border ${accent.border} ${accent.bgMuted} text-white`}
              >
                Let's Collaborate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
        data={data}
      />
    </header>
  );
}
