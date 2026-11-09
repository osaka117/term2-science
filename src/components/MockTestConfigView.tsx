import React, { useState } from 'react';
import { MockTestConfig, TOPICS } from '../types/physics';

interface MockTestConfigViewProps {
  initialConfig: MockTestConfig;
  onStart: (config: MockTestConfig) => void;
  onBack: () => void;
}

export const MockTestConfigView: React.FC<MockTestConfigViewProps> = ({
  initialConfig,
  onStart,
  onBack,
}) => {
  const [questionCount, setQuestionCount] = useState<number>(initialConfig.questionCount);
  const [customInput, setCustomInput] = useState<string>('');
  const [selectedTopics, setSelectedTopics] = useState<number[]>(initialConfig.selectedTopics);

  const presets = [5, 10, 15, 20, 25, 30];

  const toggleTopic = (id: number) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const selectAllTopics = () => setSelectedTopics(TOPICS.map((t) => t.id));
  const clearAllTopics = () => setSelectedTopics([]);

  const handleCustomChange = (val: string) => {
    setCustomInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0 && parsed <= 50) {
      setQuestionCount(parsed);
    }
  };

  const isValid = selectedTopics.length > 0 && questionCount >= 3 && questionCount <= 50;

  const handleStart = () => {
    if (!isValid) return;
    onStart({
      questionCount,
      selectedTopics,
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 select-none font-mono text-xs sm:text-sm">
      {/* Header */}
      <div className="bg-[var(--card-bg)] retro-border p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className="retro-btn px-2.5 py-1 text-xs font-bold mb-2 inline-block cursor-pointer"
          >
            &lt; RETURN TO MAIN MENU
          </button>
          <h2 className="text-2xl sm:text-3xl font-pixel font-bold text-[var(--text-primary)]">
            CONFIG: MOCK TEST SIMULATOR
          </h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Simulate an academic examination. Difficulty is randomized from Level 1 to Level 5 independently for each question.
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={!isValid}
          className="retro-btn-accent px-6 py-3 font-pixel text-base font-bold tracking-wider"
        >
          START TEST &gt;&gt;
        </button>
      </div>

      {/* Number of Questions */}
      <div className="bg-[var(--card-bg)] retro-border p-4 sm:p-5 space-y-3">
        <div className="font-pixel text-lg font-bold text-[var(--text-primary)] border-b-2 border-[var(--border-color)] pb-2 flex justify-between items-center">
          <span>1. NUMBER OF QUESTIONS</span>
          <span className="text-xs font-mono text-[var(--accent)] font-bold">
            Active: {questionCount} questions
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {presets.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => {
                  setQuestionCount(count);
                  setCustomInput('');
                }}
                className={`px-4 py-2 text-xs font-bold cursor-pointer ${
                  questionCount === count && customInput === ''
                    ? 'retro-btn-accent font-pixel text-sm'
                    : 'retro-btn'
                }`}
              >
                {count} Questions
              </button>
            ))}
          </div>

          {/* Custom input */}
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-xs text-[var(--text-muted)]">Or enter custom count (3 - 50):</span>
            <input
              type="number"
              min={3}
              max={50}
              value={customInput}
              placeholder="e.g. 12"
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-24 px-2 py-1 bg-[var(--bg-color)] border-2 border-[var(--border-color)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>
      </div>

      {/* Mandatory note on difficulty randomization */}
      <div className="bg-[var(--bg-color)] retro-border-sm p-4 space-y-1.5 border-l-4 border-l-[var(--accent)]">
        <div className="font-bold text-[var(--text-primary)] flex items-center space-x-2">
          <span>[SYSTEM DIRECTIVE] INDEPENDENT DIFFICULTY RANDOMIZATION</span>
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
          In Mock Test Mode, difficulty is <strong>automatically and independently randomized for every question</strong> between Level 1 and Level 5. There is no manual difficulty selection or artificial gradual progression. Level 5 multi-stage problems retain their full academic rigor.
        </p>
      </div>

      {/* Topics Checklist */}
      <div className="bg-[var(--card-bg)] retro-border p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--border-color)] pb-2 gap-2">
          <div>
            <span className="font-pixel text-lg font-bold text-[var(--text-primary)]">
              2. TOPIC COVERAGE
            </span>
            <span className="ml-2 text-xs text-[var(--text-muted)]">
              ({selectedTopics.length} of {TOPICS.length} selected)
            </span>
          </div>

          <div className="space-x-2">
            <button
              onClick={selectAllTopics}
              className="retro-btn px-2 py-0.5 text-xs font-bold"
            >
              [SELECT ALL]
            </button>
            <button
              onClick={clearAllTopics}
              className="retro-btn px-2 py-0.5 text-xs font-bold"
            >
              [CLEAR ALL]
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TOPICS.map((topic) => {
            const isChecked = selectedTopics.includes(topic.id);
            return (
              <label
                key={topic.id}
                className={`p-2.5 border flex items-start space-x-2.5 cursor-pointer transition-colors ${
                  isChecked
                    ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-primary)] font-bold retro-border-sm'
                    : 'border-[var(--border-color)] bg-[var(--bg-color)] opacity-75 hover:opacity-100'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleTopic(topic.id)}
                  className="mt-1 accent-[var(--accent)]"
                />
                <div>
                  <div className="text-xs font-bold">
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

        {selectedTopics.length === 0 && (
          <div className="p-2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-400 text-xs font-bold">
            ! Warning: You must select at least one topic for the mock test.
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack} className="retro-btn px-4 py-2 font-bold">
          &lt; CANCEL & RETURN
        </button>

        <button
          onClick={handleStart}
          disabled={!isValid}
          className="retro-btn-accent px-8 py-3 font-pixel text-lg font-bold tracking-wider"
        >
          COMMENCE MOCK TEST &gt;&gt;
        </button>
      </div>
    </div>
  );
};
