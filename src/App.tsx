import { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CursorGlow } from './components/CursorGlow';
import { CinematicOpening } from './components/CinematicOpening';
import { ToastContainer } from './components/ToastContainer';
import { Home } from './pages/Home';
import { Works } from './pages/Works';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { ProjectDetail } from './pages/ProjectDetail';
import { NotFound } from './pages/NotFound';

function PortfolioApp() {
  const { currentPath, data, hasSeenOpening, setHasSeenOpening } = usePortfolio();

  // Show opening screen on initial home visit if enabled in settings
  const shouldShowOpening =
    data.settings.openingScreenEnabled && !hasSeenOpening && currentPath === '/';

  // Normalize path without trailing slashes
  const normalizedPath = currentPath.length > 1 && currentPath.endsWith('/')
    ? currentPath.slice(0, -1)
    : currentPath;

  const renderCurrentView = () => {
    // Dynamic project detail route
    if (normalizedPath.startsWith('/project/')) {
      const projectId = normalizedPath.replace('/project/', '');
      return <ProjectDetail projectId={projectId} />;
    }

    switch (normalizedPath) {
      case '/works':
        return <Works />;
      case '/about':
        return <About />;
      case '/contact':
        return <Contact />;
      case '/admin':
        return <Admin />;
      case '':
      case '/':
        return <Home />;
      default:
        return <NotFound />;
    }
  };

  const isAdminPage = normalizedPath === '/admin';

  const fontThemeClass = `font-theme-${data.settings.fontTheme || 'aerospace-rajdhani'}`;

  return (
    <div className={`relative min-h-screen bg-[#070709] text-neutral-100 selection:bg-amber-400/20 selection:text-amber-200 ${fontThemeClass}`}>
      {/* Ambient cursor glow effect */}
      <CursorGlow />

      {/* Global toast notification stack */}
      <ToastContainer />

      {/* Cinematic Opening Overlay */}
      {shouldShowOpening && (
        <CinematicOpening onEnter={() => setHasSeenOpening(true)} />
      )}

      {/* Main Studio Navigation (Admin page has its own top header) */}
      {!isAdminPage && <Navbar />}

      {/* Main Content View with seamless transitions */}
      <main className="w-full">
        {renderCurrentView()}
      </main>

      {/* Footer on public pages */}
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
