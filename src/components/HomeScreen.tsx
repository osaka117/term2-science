import React from 'react';
import { TOPICS } from '../types/physics';
import { FormattedText } from './MathRenderer';

interface HomeScreenProps {
  onStartPractice: () => void;
  onStartMock: () => void;
  onOpenFormula: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartPractice,
  onStartMock,
  onOpenFormula,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8 select-none">
      {/* Hero Box */}
      <div className="bg-[var(--card-bg)] retro-border p-6 sm:p-8 text-center space-y-4">
        <div className="inline-block px-3 py-1 bg-[var(--accent-light)] text-[var(--accent)] text-xs font-mono font-bold retro-border-sm mb-2">
          [CLASSICAL MECHANICS ACADEMIC REVIEWER]
        </div>

        <h1 className="text-4xl sm:text-6xl font-pixel font-bold tracking-wider text-[var(--text-primary)]">
          PHYSICS REVIEWER
        </h1>

        <div className="text-lg sm:text-2xl font-tech tracking-widest text-[var(--accent)] font-bold">
          PROJECTILE MOTION
        </div>

        <FormattedText
          text="Master 2D kinematics, vector resolution, launch angles, apex dynamics, and asymmetric elevated trajectories. Pure ideal physics: zero air resistance, constant downward gravitational acceleration ($g = 9.8\text{ m/s}^2$)."
          className="max-w-2xl mx-auto text-xs sm:text-sm font-mono text-[var(--text-muted)] leading-relaxed"
        />

        {/* Two Large Buttons */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={onStartPractice}
            className="retro-btn-accent py-4 px-6 text-base sm:text-lg font-bold font-pixel tracking-wider text-center flex flex-col items-center justify-center space-y-1"
          >
            <span>&gt;&gt; PRACTICE MODE</span>
            <span className="text-[11px] font-mono opacity-90 normal-case">
              Select 1 topic or Random Topic, levels 1-5, immediate solutions
            </span>
          </button>

          <button
            onClick={onStartMock}
            className="retro-btn py-4 px-6 text-base sm:text-lg font-bold font-pixel tracking-wider text-center flex flex-col items-center justify-center space-y-1 hover:border-[var(--accent)]"
          >
            <span>&gt;&gt; MOCK TEST MODE</span>
            <span className="text-[11px] font-mono text-[var(--text-muted)] normal-case">
              Exam simulation, randomized difficulty 1-5, post-test review
            </span>
          </button>
        </div>

        <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)]">
          No timers. No competitive gamification. No accounts required.
        </div>
      </div>

      {/* Topics list */}
      <div className="bg-[var(--card-bg)] retro-border p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--border-color)] pb-2 gap-2">
          <div className="font-pixel text-lg font-bold text-[var(--text-primary)]">
            AVAILABLE CURRICULUM TOPICS [10 MODULES]
          </div>
          <button
            onClick={onOpenFormula}
            className="retro-btn px-2.5 py-1 text-xs font-mono font-bold"
          >
            [VIEW ALL FORMULAS]
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          {TOPICS.map((topic) => (
            <div
              key={topic.id}
              className="p-3 bg-[var(--bg-color)] border border-[var(--border-color)] flex space-x-3 items-start"
            >
              <span className="px-1.5 py-0.5 bg-[var(--card-bg)] border border-[var(--border-color)] font-bold text-[var(--accent)] shrink-0">
                {topic.id.toString().padStart(2, '0')}
              </span>
              <div>
                <div className="font-bold text-[var(--text-primary)]">{topic.title}</div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">{topic.shortDesc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key physical axioms footer box */}
      <div className="p-4 bg-[var(--card-bg)] retro-border-sm text-xs font-mono space-y-2 text-[var(--text-muted)]">
        <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
          <span>[SYSTEM NOTICE] STANDARD ASSUMPTIONS & COORDINATE CONVENTIONS</span>
        </div>
        <div className="space-y-1">
          <FormattedText text="• **Horizontal axis (+x):** Forward along launch direction; $a_x = 0$; horizontal velocity $v_x = v_{ix}$ remains constant." />
          <FormattedText text="• **Vertical axis (+y):** Directed upward; gravitational acceleration $a_y = -g$ acts continuously downward." />
          <FormattedText text="• **Sign Convention:** Heights above launch datum are positive ($+y$); drops below launch datum are negative ($\Delta y = -h$)." />
        </div>
      </div>
    </div>
  );
};
