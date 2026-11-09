import React, { useState } from 'react';
import { DifficultyLevel, PracticeConfig, TOPICS } from '../types/physics';

interface PracticeConfigViewProps {
  initialConfig: PracticeConfig;
  onStart: (config: PracticeConfig) => void;
  onBack: () => void;
}

export const PracticeConfigView: React.FC<PracticeConfigViewProps> = ({
  initialConfig,
  onStart,
  onBack,
}) => {
  const [topicSelection, setTopicSelection] = useState<number | 'random'>(
    initialConfig.topicSelection
  );
  const [selectedDifficulties, setSelectedDifficulties] = useState<DifficultyLevel[]>(
    initialConfig.selectedDifficulties
  );
  const [randomDifficulty, setRandomDifficulty] = useState<boolean>(initialConfig.randomDifficulty);

  const toggleDifficulty = (lvl: DifficultyLevel) => {
    setSelectedDifficulties((prev) =>
      prev.includes(lvl) ? prev.filter((l) => l !== lvl) : [...prev, lvl]
    );
  };

  const selectAllDifficulties = () => {
    setSelectedDifficulties([1, 2, 3, 4, 5]);
    setRandomDifficulty(true);
  };

  const isValid = selectedDifficulties.length > 0;

  const handleStart = () => {
    if (!isValid) return;
    onStart({
      topicSelection,
      selectedDifficulties,
      randomDifficulty,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 select-none font-mono text-xs sm:text-sm">
      {/* Header card */}
      <div className="bg-[var(--card-bg)] retro-border p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="retro-btn px-2.5 py-1 text-xs font-bold mb-2 inline-block cursor-pointer"
          >
            &lt; RETURN TO MAIN MENU
          </button>
          <h2 className="text-2xl sm:text-3xl font-pixel font-bold text-[var(--text-primary)]">
            CONFIG: PRACTICE SESSION
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Choose 1 active topic (or Random Topic mode) and difficulty settings. Gravity is constant at g = 9.8 m/s².
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={!isValid}
          className="retro-btn-accent px-6 py-3 font-pixel text-base font-bold tracking-wider"
        >
          START PRACTICE &gt;&gt;
        </button>
      </div>

      {/* Topic Selection - Only 1 topic at a time unless Random */}
      <div className="bg-[var(--card-bg)] retro-border p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--border-color)] pb-2 gap-2">
          <div>
            <span className="font-pixel text-lg font-bold text-[var(--text-primary)]">
              1. TOPIC SELECTION
            </span>
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              (Choose 1 topic at a time, or select Random Topic)
            </span>
          </div>

          <button
            onClick={() => setTopicSelection('random')}
            className={`px-3 py-1 text-xs font-bold cursor-pointer transition-colors ${
              topicSelection === 'random'
                ? 'retro-btn-accent font-pixel text-sm'
                : 'retro-btn'
            }`}
          >
            🎲 RANDOM TOPIC (ALL TOPICS)
          </button>
        </div>

        {/* Random Topic Banner */}
        <div
          onClick={() => setTopicSelection('random')}
          className={`p-3 border-2 cursor-pointer transition-all flex items-center justify-between ${
            topicSelection === 'random'
              ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-primary)] font-bold retro-border-sm'
              : 'border-[var(--border-color)] bg-[var(--bg-color)] opacity-80 hover:opacity-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name="topicSelection"
              checked={topicSelection === 'random'}
              onChange={() => setTopicSelection('random')}
              className="accent-[var(--accent)] cursor-pointer"
            />
            <div>
              <div className="font-bold text-sm text-[var(--accent)]">
                🎲 RANDOM TOPIC MODE (ALL TOPICS)
              </div>
              <div className="text-[11px] font-normal text-[var(--text-muted)]">
                Randomly draws questions across all 10 projectile motion topics for diverse problem-solving.
              </div>
            </div>
          </div>
          <span className="text-xs font-pixel font-bold px-2 py-0.5 bg-[var(--card-bg)] border border-[var(--border-color)]">
            {topicSelection === 'random' ? '[ACTIVE]' : 'SELECT'}
          </span>
        </div>

        {/* Individual Topics Grid (Single Selection) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
          {TOPICS.map((topic) => {
            const isSelected = topicSelection === topic.id;
            return (
              <label
                key={topic.id}
                onClick={() => setTopicSelection(topic.id)}
                className={`p-2.5 border-2 flex items-start space-x-2.5 cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-primary)] font-bold retro-border-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-color)] opacity-75 hover:opacity-100'
                }`}
              >
                <input
                  type="radio"
                  name="topicSelection"
                  checked={isSelected}
                  onChange={() => setTopicSelection(topic.id)}
                  className="mt-1 accent-[var(--accent)]"
                />
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    {topic.id}. {topic.title}
                  </div>
                  <div className="text-[11px] font-normal text-[var(--text-muted)] mt-0.5">
                    {topic.shortDesc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Difficulty Selection */}
      <div className="bg-[var(--card-bg)] retro-border p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--border-color)] pb-2 gap-2">
          <div>
            <span className="font-pixel text-lg font-bold text-[var(--text-primary)]">
              2. DIFFICULTY SELECTION
            </span>
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              (Choose one or multiple levels)
            </span>
          </div>
          <button
            onClick={selectAllDifficulties}
            className="retro-btn px-2 py-0.5 text-xs font-bold"
          >
            [SELECT ALL LEVELS]
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((lvl) => {
            const isSelected = selectedDifficulties.includes(lvl);
            const levelTitles: Record<DifficultyLevel, { name: string; desc: string }> = {
              1: { name: 'LVL 1: Very Basic', desc: 'Direct 1-equation substitutions & basic concepts' },
              2: { name: 'LVL 2: Basic', desc: 'Trigonometric components & 1-2 step problems' },
              3: { name: 'LVL 3: Moderate', desc: 'Combining 2 kinematics equations & cliff launches' },
              4: { name: 'LVL 4: Challenging', desc: 'Elevated launch quadratics & multi-step vectors' },
              5: { name: 'LVL 5: Very Difficult', desc: 'Multi-stage unknowns, reverse deduction & error analysis' },
            };

            return (
              <div
                key={lvl}
                onClick={() => toggleDifficulty(lvl)}
                className={`p-3 border-2 cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-primary)] font-bold retro-border-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-color)] opacity-70 hover:opacity-100'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}} // handled by parent onClick
                    className="accent-[var(--accent)] cursor-pointer"
                  />
                  <span className="font-pixel text-sm">{levelTitles[lvl].name}</span>
                </div>
                <div className="text-[11px] font-normal text-[var(--text-muted)] leading-tight">
                  {levelTitles[lvl].desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Random Difficulty Toggle */}
        <div className="pt-2">
          <label className="flex items-start space-x-2.5 cursor-pointer p-2.5 bg-[var(--bg-color)] border border-[var(--border-color)]">
            <input
              type="checkbox"
              checked={randomDifficulty}
              onChange={(e) => setRandomDifficulty(e.target.checked)}
              className="mt-0.5 accent-[var(--accent)]"
            />
            <div>
              <span className="font-bold">Random Difficulty per Question</span>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                Randomly draws from your checked difficulty levels for each new question without gradual progression.
              </p>
            </div>
          </label>
        </div>

        {selectedDifficulties.length === 0 && (
          <div className="p-2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-400 text-xs font-bold">
            ! Warning: Select at least one difficulty level.
          </div>
        )}
      </div>

      {/* Constant Gravity Notice */}
      <div className="bg-[var(--card-bg)] retro-border p-4 space-y-1.5 border-l-4 border-l-[var(--accent)]">
        <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
          <span>[PHYSICAL CONSTANT] GRAVITATIONAL ACCELERATION</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          Standard gravitational acceleration is fixed at <strong>g = 9.8 m/s²</strong> throughout all practice questions and step-by-step mathematical calculations.
        </p>
      </div>

      {/* Bottom action bar */}
      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack} className="retro-btn px-4 py-2 font-bold">
          &lt; CANCEL & RETURN
        </button>

        <button
          onClick={handleStart}
          disabled={!isValid}
          className="retro-btn-accent px-8 py-3 font-pixel text-lg font-bold tracking-wider"
        >
          START PRACTICE SESSION &gt;&gt;
        </button>
      </div>
    </div>
  );
};
