import { useEffect, useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export function CursorGlow() {
  const { data } = usePortfolio();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion or touch device
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (prefersReducedMotion || isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [visible]);

  if (!visible) return null;

  const glowColor = data.settings.accentColor === 'blue' 
    ? 'rgba(56, 189, 248, 0.08)' 
    : data.settings.accentColor === 'emerald'
    ? 'rgba(52, 211, 153, 0.08)'
    : 'rgba(245, 197, 66, 0.07)';

  return (
    <div
      id="cursor-ambient-glow"
      className="pointer-events-none fixed z-30 transition-opacity duration-500 ease-out hidden md:block"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: '450px',
        height: '450px',
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${glowColor} 0%, rgba(7, 7, 9, 0) 65%)`,
        opacity: visible ? 1 : 0,
      }}
    />
  );
}
