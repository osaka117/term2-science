import React from 'react';

interface RetroHeaderProps {
  currentView: 'home' | 'practice_config' | 'practice_active' | 'mock_config' | 'mock_active' | 'mock_results';
  onNavigateHome: () => void;
  onSwitchToPractice: () => void;
  onSwitchToMock: () => void;
  onOpenFormula: () => void;
  onOpenDeploy: () => void;
  theme: 'dark' | 'green' | 'amber' | 'paper';
  onToggleTheme: (t: 'dark' | 'green' | 'amber' | 'paper') => void;
  scanlines: boolean;
  onToggleScanlines: () => void;
}

export const RetroHeader: React.FC<RetroHeaderProps> = ({
  currentView,
  onNavigateHome,
  onSwitchToPractice,
  onSwitchToMock,
  onOpenFormula,
  onOpenDeploy,
  theme,
  onToggleTheme,
  scanlines,
  onToggleScanlines,
}) => {
  const isPracticeActive = currentView.startsWith('practice');
  const isMockActive = currentView.startsWith('mock');

  return (
    <header className="border-b-2 border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-2 select-none">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        {/* Brand / Logo */}
        <div
          onClick={onNavigateHome}
          className="flex items-center space-x-2 cursor-pointer group"
          title="Return to Home Menu"
        >
          <div className="w-5 h-5 bg-[var(--accent)] border border-[var(--border-color)] flex items-center justify-center text-white text-[11px] font-bold">
            π
          </div>
          <span className="font-pixel text-lg sm:text-xl font-bold tracking-wider text-[var(--text-primary)] group-hover:underline">
            PHYSICS REVIEWER // PROJECTILE MOTION
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center space-x-1.5 border-2 border-[var(--border-color)] p-0.5 bg-[var(--bg-color)]">
          <button
            onClick={onSwitchToPractice}
            className={`px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors ${
              isPracticeActive
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            PRACTICE MODE
          </button>
          <button
            onClick={onSwitchToMock}
            className={`px-2.5 py-1 text-xs font-bold cursor-pointer transition-colors ${
              isMockActive
                ? 'bg-[var(--accent)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            MOCK TEST
          </button>
        </div>

        {/* Controls and Utilities */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
          {/* Formula sheet */}
          <button
            onClick={onOpenFormula}
            className="retro-btn px-2 py-1 text-[11px] font-bold"
            title="Open Formula Reference Sheet"
          >
            [FORMULAS]
          </button>

          {/* Deploy guide */}
          <button
            onClick={onOpenDeploy}
            className="retro-btn px-2 py-1 text-[11px] font-bold"
            title="GitHub Pages Guide"
          >
            [GH-PAGES]
          </button>

          {/* Theme selector */}
          <div className="flex border border-[var(--border-color)] bg-[var(--card-bg)] p-0.5 text-[10px]">
            <button
              onClick={() => onToggleTheme('dark')}
              className={`px-1.5 py-0.5 cursor-pointer ${theme === 'dark' ? 'bg-[var(--accent)] text-black font-bold' : ''}`}
              title="Dark Retro Terminal Theme (Default)"
            >
              DARK
            </button>
            <button
              onClick={() => onToggleTheme('green')}
              className={`px-1.5 py-0.5 cursor-pointer ${theme === 'green' ? 'bg-[var(--accent)] text-black font-bold' : ''}`}
              title="CRT Phosphor Green Theme"
            >
              GREEN
            </button>
            <button
              onClick={() => onToggleTheme('amber')}
              className={`px-1.5 py-0.5 cursor-pointer ${theme === 'amber' ? 'bg-[var(--accent)] text-black font-bold' : ''}`}
              title="CRT Amber Phosphor Theme"
            >
              AMBER
            </button>
            <button
              onClick={() => onToggleTheme('paper')}
              className={`px-1.5 py-0.5 cursor-pointer ${theme === 'paper' ? 'bg-[var(--accent)] text-white font-bold' : ''}`}
              title="Classic Paper Light Theme"
            >
              PAPER
            </button>
          </div>

          {/* Scanlines toggle */}
          <button
            onClick={onToggleScanlines}
            className={`retro-btn px-1.5 py-1 text-[10px] ${scanlines ? 'bg-[var(--accent-light)] font-bold' : 'opacity-70'}`}
            title="Toggle CRT Scanline Overlay"
          >
            CRT: {scanlines ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </header>
  );
};
