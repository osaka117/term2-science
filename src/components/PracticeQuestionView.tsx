import React, { useState } from 'react';
import { DifficultyLevel, Question, TOPICS } from '../types/physics';
import { FormattedText, MathRenderer } from './MathRenderer';
import { TrajectoryVisualizer } from './TrajectoryVisualizer';

interface PracticeQuestionViewProps {
  question: Question;
  questionNumber: number;
  currentTopicSelection: number | 'random';
  currentDifficultySelection: DifficultyLevel | 'random';
  onSelectTopic: (topic: number | 'random') => void;
  onSelectDifficulty: (difficulty: DifficultyLevel | 'random') => void;
  onNextQuestion: () => void;
  onSwitchToMockTest?: () => void;
}

// Short labels for clean, responsive retro buttons
const TOPIC_SHORT_LABELS: Record<number, string> = {
  1: '01. Concepts',
  2: '02. Components',
  3: '03. Initial Vel',
  4: '04. Final Vel',
  5: '05. Flight Time',
  6: '06. Max Height',
  7: '07. Range',
  8: '08. Horiz Drop',
  9: '09. Angled Motion',
  10: '10. Mixed Multi-Step',
};

export const PracticeQuestionView: React.FC<PracticeQuestionViewProps> = ({
  question,
  questionNumber,
  currentTopicSelection,
  currentDifficultySelection,
  onSelectTopic,
  onSelectDifficulty,
  onNextQuestion,
  onSwitchToMockTest,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Reset state when new question arrives
  React.useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
  }, [question.id]);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
  };

  const isCorrect = selectedOption === question.correctIndex;
  const activeTopicObj =
    typeof currentTopicSelection === 'number'
      ? TOPICS.find((t) => t.id === currentTopicSelection)
      : null;

  return (
    <div className="max-w-4xl mx-auto py-4 px-3 sm:px-4 space-y-4 select-none font-mono text-xs sm:text-sm">
      {/* ============================================================== */}
      {/* TOPIC SELECTION CONTROL PANEL - DIRECTLY ON TOP OF QUESTIONS   */}
      {/* ============================================================== */}
      <div className="bg-[var(--card-bg)] retro-border p-3.5 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--border-color)] pb-2.5">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-[var(--accent)] inline-block"></span>
            <span className="font-pixel text-base sm:text-xl font-bold tracking-wider text-[var(--text-primary)]">
              PRACTICE TOPIC SELECTION
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-color)] font-bold text-[11px]">
              CONSTANT g = 9.8 m/s²
            </span>
            {onSwitchToMockTest && (
              <button
                onClick={onSwitchToMockTest}
                className="retro-btn px-2.5 py-0.5 text-[11px] font-bold"
                title="Switch to full mock test examination"
              >
                [MOCK TEST MODE]
              </button>
            )}
          </div>
        </div>

        {/* Direct Clickable Topic Buttons Grid */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] font-bold">
            <span>CHOOSE 1 TOPIC AT A TIME (OR RANDOM TOPIC):</span>
            <span>
              {currentTopicSelection === 'random' ? (
                <span className="text-[var(--accent)] font-bold">
                  🎲 RANDOM MODE ACTIVE (ALL 10 TOPICS)
                </span>
              ) : (
                <span className="text-[var(--text-primary)] font-bold">
                  FOCUSING ON: TOPIC {currentTopicSelection}
                </span>
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5">
            {/* Random Topic Button */}
            <button
              onClick={() => onSelectTopic('random')}
              className={`p-2 text-left border-2 cursor-pointer transition-all flex flex-col justify-between ${
                currentTopicSelection === 'random'
                  ? 'bg-[var(--accent)] text-white border-[var(--border-color)] font-bold shadow-md'
                  : 'bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)]'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-pixel text-sm font-bold">🎲 RANDOM</span>
                {currentTopicSelection === 'random' && (
                  <span className="text-[10px] bg-black/25 px-1 py-0.2">✓</span>
                )}
              </div>
              <span className="text-[10px] opacity-90 truncate">All 10 Topics</span>
            </button>

            {/* All 10 Individual Topic Buttons */}
            {TOPICS.map((t) => {
              const isSelected = currentTopicSelection === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTopic(t.id)}
                  title={`${t.id}. ${t.title}: ${t.shortDesc}`}
                  className={`p-2 text-left border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--accent)] text-white border-[var(--border-color)] font-bold shadow-md'
                      : 'bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent)]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-pixel text-sm font-bold">
                      {TOPIC_SHORT_LABELS[t.id] || `Topic ${t.id}`}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-black/25 px-1 py-0.2">✓</span>
                    )}
                  </div>
                  <span className="text-[10px] opacity-80 truncate">{t.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Topic details line */}
        <div className="p-2 bg-[var(--bg-color)] border border-[var(--border-color)] text-[11px] flex flex-wrap justify-between items-center gap-2">
          <div className="flex-1 min-w-[200px]">
            <span className="font-bold text-[var(--text-muted)]">ACTIVE CURRICULUM: </span>
            <span className="font-bold text-[var(--text-primary)]">
              {currentTopicSelection === 'random'
                ? '🎲 Random Mode — Questions will be randomly selected from all 10 projectile motion topics.'
                : `Topic ${activeTopicObj?.id}: ${activeTopicObj?.title} — ${activeTopicObj?.shortDesc}`}
            </span>
          </div>

          {/* Difficulty selector buttons directly on top */}
          <div className="flex items-center space-x-1 shrink-0">
            <span className="font-bold text-[var(--text-muted)] text-[10px]">DIFFICULTY:</span>
            {([1, 2, 3, 4, 5] as DifficultyLevel[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => onSelectDifficulty(lvl)}
                className={`w-6 h-6 text-xs font-mono font-bold border cursor-pointer transition-colors ${
                  currentDifficultySelection === lvl
                    ? 'bg-[var(--accent)] text-white border-[var(--border-color)]'
                    : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
                title={`Lock to Level ${lvl}`}
              >
                {lvl}
              </button>
            ))}
            <button
              onClick={() => onSelectDifficulty('random')}
              className={`px-1.5 h-6 text-[10px] font-mono font-bold border cursor-pointer transition-colors ${
                currentDifficultySelection === 'random'
                  ? 'bg-[var(--accent)] text-white border-[var(--border-color)]'
                  : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
              title="Randomize difficulty level per question"
            >
              RANDOM
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN QUESTION CARD                                             */}
      {/* ============================================================== */}
      <div className="bg-[var(--card-bg)] retro-border p-5 sm:p-7 space-y-5">
        {/* Question Header badge */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)] pb-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-bold font-pixel text-base text-[var(--accent)]">
              QUESTION #{questionNumber}
            </span>
            <span className="px-2 py-0.5 bg-[var(--bg-color)] border border-[var(--border-color)] font-bold">
              LVL {question.difficulty}
            </span>
            <span className="px-2 py-0.5 bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-color)] font-bold uppercase truncate max-w-[240px] sm:max-w-none">
              {question.topicTitle}
            </span>
          </div>

          <span className="text-[11px] text-[var(--text-muted)] font-mono">
            g = 9.8 m/s²
          </span>
        </div>

        {/* Prompt */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider">
            [PROBLEM STATEMENT]
          </div>
          <FormattedText
            text={question.prompt}
            className="text-sm sm:text-base font-semibold leading-relaxed text-[var(--text-primary)]"
          />
        </div>

        {/* Trajectory Visualizer Diagram if provided */}
        {question.diagram && (
          <div className="my-3">
            <TrajectoryVisualizer data={question.diagram} />
          </div>
        )}

        {/* Multiple choice options */}
        <div className="space-y-2.5 pt-2">
          <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider">
            [SELECT ONE ANSWER]
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((opt, idx) => {
              const optionLetters = ['A', 'B', 'C', 'D'];
              const letter = optionLetters[idx];
              const isSelected = selectedOption === idx;

              let optionStyle =
                'border-2 border-[var(--border-color)] bg-[var(--bg-color)] hover:border-[var(--accent)]';

              if (isSubmitted) {
                if (idx === question.correctIndex) {
                  optionStyle =
                    'border-2 border-green-600 bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-300 font-bold retro-border-sm';
                } else if (isSelected && !isCorrect) {
                  optionStyle =
                    'border-2 border-red-500 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 line-through opacity-80';
                } else {
                  optionStyle = 'border border-[var(--border-color)] opacity-50 bg-[var(--bg-color)]';
                }
              } else if (isSelected) {
                optionStyle =
                  'border-2 border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-primary)] font-bold retro-border-sm';
              }

              return (
                <div
                  key={idx}
                  onClick={() => !isSubmitted && setSelectedOption(idx)}
                  className={`p-3.5 transition-all flex items-start space-x-3 cursor-pointer ${optionStyle}`}
                >
                  <div
                    className={`w-6 h-6 shrink-0 flex items-center justify-center border font-bold text-xs ${
                      isSelected
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--card-bg)] border-[var(--border-color)] text-[var(--text-primary)]'
                    }`}
                  >
                    {letter}
                  </div>
                  <div className="flex-1 text-xs sm:text-sm pt-0.5">
                    <FormattedText text={opt} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit button / Result feedback */}
        {!isSubmitted ? (
          <div className="pt-3 flex justify-between items-center">
            <span className="text-[11px] text-[var(--text-muted)]">
              Select an option above and press Submit Answer
            </span>
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="retro-btn-accent px-8 py-3 font-pixel text-base font-bold tracking-wider"
            >
              SUBMIT ANSWER &gt;&gt;
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-3">
            {/* Instant verification banner */}
            <div
              className={`p-4 retro-border-sm flex items-center justify-between ${
                isCorrect
                  ? 'bg-green-100 dark:bg-green-950/60 border-green-600 text-green-900 dark:text-green-200'
                  : 'bg-red-100 dark:bg-red-950/60 border-red-600 text-red-900 dark:text-red-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-pixel font-bold">
                  {isCorrect ? '[✓] CORRECT ANSWER' : '[✗] INCORRECT ANSWER'}
                </span>
              </div>
              <div className="text-xs font-mono font-bold">
                Correct Choice: [
                {['A', 'B', 'C', 'D'][question.correctIndex]}]{' '}
                <FormattedText text={question.options[question.correctIndex]} className="inline" />
              </div>
            </div>

            {/* Step-by-Step Mathematical Solution Breakdown */}
            <div className="p-4 sm:p-5 bg-[var(--bg-color)] border-2 border-[var(--border-color)] space-y-4 text-xs">
              <div className="font-pixel text-base font-bold text-[var(--text-primary)] border-b border-[var(--border-color)] pb-1 flex justify-between">
                <span>[STEP-BY-STEP MATHEMATICAL SOLUTION]</span>
                <span className="text-[11px] font-mono text-[var(--text-muted)] font-normal">
                  g = 9.8 m/s² (Constant) // SI Units
                </span>
              </div>

              {/* 1. Relevant equations */}
              <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--accent)]">[1] RELEVANT KINEMATIC EQUATION(S)</div>
                <div className="space-y-1 py-1">
                  {question.explanation.equations.map((eq, i) => (
                    <MathRenderer key={i} math={eq} block />
                  ))}
                </div>
              </div>

              {/* 2. Knowns & Unknowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] space-y-1">
                  <div className="font-bold text-[var(--text-primary)]">[2A] GIVEN QUANTITIES (KNOWNS)</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {question.explanation.knowns.map((k, i) => (
                      <li key={i}>
                        <MathRenderer math={k.symbol} /> = {k.value}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] space-y-1">
                  <div className="font-bold text-[var(--text-primary)]">[2B] TARGET QUANTITY (UNKNOWNS)</div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                    {question.explanation.unknowns.map((u, i) => (
                      <li key={i}>
                        <MathRenderer math={u.symbol} />: {u.target}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 3. Why equation applies */}
              <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] space-y-1">
                <div className="font-bold text-[var(--text-primary)]">[3] PHYSICAL RATIONALE & SIGN CONVENTION</div>
                <FormattedText text={question.explanation.whyEquation} className="text-[11px] leading-relaxed" />
              </div>

              {/* 4. Formula rearrangement & Substitution */}
              <div className="p-3 bg-[var(--card-bg)] border border-[var(--border-color)] space-y-2">
                <div className="font-bold text-[var(--text-primary)]">[4] ALGEBRAIC REARRANGEMENT & SUBSTITUTION</div>
                <div className="text-[11px] space-y-1">
                  <div>
                    <span className="font-semibold text-[var(--text-muted)]">Rearranged Formula:</span>
                    <MathRenderer math={question.explanation.rearrangement} block />
                  </div>
                  <div>
                    <span className="font-semibold text-[var(--text-muted)]">Numerical Substitution:</span>
                    <MathRenderer math={question.explanation.substitution} block />
                  </div>
                </div>
              </div>

              {/* 5. Final Result */}
              <div className="p-3 bg-[var(--accent-light)] border border-[var(--accent)] text-[var(--text-primary)] space-y-1">
                <div className="font-bold text-[var(--accent)]">[5] FINAL COMPUTED RESULT</div>
                <div className="text-sm font-bold">
                  {question.explanation.result}
                </div>
              </div>

              {/* 6. Common Mistake Notice */}
              {question.explanation.commonMistakesNotice && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-500 text-amber-900 dark:text-amber-200 text-[11px] space-y-1">
                  <div className="font-bold flex items-center space-x-1">
                    <span>⚠ COMMON STUDENT MISTAKE TO AVOID:</span>
                  </div>
                  <p>{question.explanation.commonMistakesNotice}</p>
                </div>
              )}
            </div>

            {/* Next question navigation button */}
            <div className="flex justify-end items-center pt-2">
              <button
                onClick={onNextQuestion}
                className="retro-btn-accent px-8 py-3 font-pixel text-lg font-bold tracking-wider"
              >
                NEXT QUESTION &gt;&gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
