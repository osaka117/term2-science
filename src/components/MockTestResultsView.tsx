import React, { useState } from 'react';
import { Question } from '../types/physics';
import { FormattedText, MathRenderer } from './MathRenderer';
import { TrajectoryVisualizer } from './TrajectoryVisualizer';

interface MockTestResultsViewProps {
  questions: Question[];
  userAnswers: Record<number, number>;
  onRetakeNewTest: () => void;
  onNewConfig: () => void;
  onNavigateHome: () => void;
}

export const MockTestResultsView: React.FC<MockTestResultsViewProps> = ({
  questions,
  userAnswers,
  onRetakeNewTest,
  onNewConfig,
  onNavigateHome,
}) => {
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(() => {
    // Expand incorrect by default so students immediately learn from mistakes
    const init = new Set<number>();
    questions.forEach((q, idx) => {
      if (userAnswers[idx] !== q.correctIndex) {
        init.add(idx);
      }
    });
    return init;
  });

  const totalQuestions = questions.length;
  let correctCount = 0;

  questions.forEach((q, idx) => {
    if (userAnswers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const incorrectCount = totalQuestions - correctCount;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  const toggleExpand = (idx: number) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedQuestions(new Set(questions.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedQuestions(new Set());
  };

  // Group performance by difficulty level
  const difficultyStats: Record<number, { total: number; correct: number }> = {
    1: { total: 0, correct: 0 },
    2: { total: 0, correct: 0 },
    3: { total: 0, correct: 0 },
    4: { total: 0, correct: 0 },
    5: { total: 0, correct: 0 },
  };

  questions.forEach((q, idx) => {
    difficultyStats[q.difficulty].total++;
    if (userAnswers[idx] === q.correctIndex) {
      difficultyStats[q.difficulty].correct++;
    }
  });

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 select-none font-mono text-xs sm:text-sm">
      {/* Header Banner */}
      <div className="bg-[var(--card-bg)] retro-border p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--border-color)] pb-3">
          <div>
            <span className="text-xs font-bold text-[var(--accent)] font-mono">
              [EXAMINATION REPORT // SCORECARD]
            </span>
            <h1 className="text-3xl sm:text-4xl font-pixel font-bold text-[var(--text-primary)]">
              TEST COMPLETE
            </h1>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onRetakeNewTest}
              className="retro-btn-accent px-4 py-2 font-pixel text-base font-bold"
              title="Generate a brand new set of test questions with the same topic configuration"
            >
              RETAKE TEST (NEW QUESTIONS)
            </button>
            <button
              onClick={onNavigateHome}
              className="retro-btn px-3 py-2 font-bold"
            >
              RETURN TO HOME
            </button>
          </div>
        </div>

        {/* Score metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-[var(--bg-color)] border-2 border-[var(--border-color)] text-center space-y-1">
            <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase">OVERALL SCORE</div>
            <div className="text-3xl sm:text-4xl font-pixel font-bold text-[var(--text-primary)]">
              {percentage}%
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              {correctCount} / {totalQuestions} answered correctly
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950/40 border-2 border-green-600 text-center space-y-1">
            <div className="text-[11px] font-bold text-green-700 dark:text-green-300 uppercase">
              CORRECT RESPONSES
            </div>
            <div className="text-3xl sm:text-4xl font-pixel font-bold text-green-800 dark:text-green-200">
              {correctCount}
            </div>
            <div className="text-[11px] text-green-700 dark:text-green-400">
              Proficient kinematics applications
            </div>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-center space-y-1">
            <div className="text-[11px] font-bold text-red-700 dark:text-red-300 uppercase">
              INCORRECT / UNANSWERED
            </div>
            <div className="text-3xl sm:text-4xl font-pixel font-bold text-red-800 dark:text-red-200">
              {incorrectCount}
            </div>
            <div className="text-[11px] text-red-700 dark:text-red-400">
              Review solutions below for mistakes
            </div>
          </div>
        </div>

        {/* Performance by difficulty tier */}
        <div className="p-3 bg-[var(--bg-color)] border border-[var(--border-color)] space-y-2">
          <div className="font-bold text-[11px] text-[var(--text-muted)]">
            [ACCURACY BREAKDOWN BY DIFFICULTY TIER (LEVELS 1 - 5)]
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
            {([1, 2, 3, 4, 5] as const).map((lvl) => {
              const stat = difficultyStats[lvl];
              const pct = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : null;
              return (
                <div
                  key={lvl}
                  className="p-2 bg-[var(--card-bg)] border border-[var(--border-color)]"
                >
                  <div className="font-bold text-[var(--accent)] font-pixel text-sm">LVL {lvl}</div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    {pct !== null ? `${stat.correct}/${stat.total} (${pct}%)` : 'None'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-[var(--card-bg)] retro-border p-4 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b-2 border-[var(--border-color)] pb-3 gap-2">
          <div className="font-pixel text-lg font-bold text-[var(--text-primary)]">
            COMPREHENSIVE QUESTION-BY-QUESTION REVIEW
          </div>

          {/* Filters & Bulk expand */}
          <div className="flex items-center space-x-2 flex-wrap">
            <div className="flex border border-[var(--border-color)] bg-[var(--bg-color)] p-0.5 text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 cursor-pointer ${filter === 'all' ? 'bg-[var(--accent)] text-white font-bold' : ''}`}
              >
                ALL ({totalQuestions})
              </button>
              <button
                onClick={() => setFilter('incorrect')}
                className={`px-2 py-0.5 cursor-pointer ${filter === 'incorrect' ? 'bg-[var(--accent)] text-white font-bold' : ''}`}
              >
                INCORRECT ({incorrectCount})
              </button>
              <button
                onClick={() => setFilter('correct')}
                className={`px-2 py-0.5 cursor-pointer ${filter === 'correct' ? 'bg-[var(--accent)] text-white font-bold' : ''}`}
              >
                CORRECT ({correctCount})
              </button>
            </div>

            <button onClick={expandAll} className="retro-btn px-2 py-0.5 text-[11px] font-bold">
              [EXPAND ALL]
            </button>
            <button onClick={collapseAll} className="retro-btn px-2 py-0.5 text-[11px] font-bold">
              [COLLAPSE ALL]
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {questions.map((q, idx) => {
            const userChoiceIdx = userAnswers[idx];
            const isAnswered = userChoiceIdx !== undefined;
            const isCorrect = isAnswered && userChoiceIdx === q.correctIndex;
            const isExpanded = expandedQuestions.has(idx);

            if (filter === 'incorrect' && isCorrect) return null;
            if (filter === 'correct' && !isCorrect) return null;

            return (
              <div
                key={idx}
                className={`border-2 transition-all ${
                  isCorrect
                    ? 'border-green-600/70 bg-[var(--bg-color)]'
                    : 'border-red-500 bg-[var(--bg-color)]'
                }`}
              >
                {/* Header row (clickable to expand) */}
                <div
                  onClick={() => toggleExpand(idx)}
                  className={`p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 cursor-pointer select-none ${
                    isCorrect
                      ? 'bg-green-100/60 dark:bg-green-950/30'
                      : 'bg-red-100/60 dark:bg-red-950/30'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-0.5 text-xs font-bold font-mono border ${
                        isCorrect
                          ? 'bg-green-600 text-white border-green-700'
                          : 'bg-red-600 text-white border-red-700'
                      }`}
                    >
                      {isCorrect ? '✓ CORRECT' : isAnswered ? '✗ INCORRECT' : '○ UNANSWERED'}
                    </span>
                    <span className="font-pixel text-base font-bold text-[var(--text-primary)]">
                      Q{idx + 1}. [LVL {q.difficulty}] {q.topicTitle}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-bold text-[var(--text-muted)]">
                    <span>{isExpanded ? '[-] HIDE SOLUTION' : '[+] VIEW SOLUTION'}</span>
                  </div>
                </div>

                {/* Prompt summary */}
                <div className="p-3 sm:p-4 border-t border-[var(--border-color)] space-y-2">
                  <FormattedText text={q.prompt} className="text-xs sm:text-sm font-semibold" />

                  {/* Student Answer vs Correct Answer Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                    <div
                      className={`p-2 border ${
                        isCorrect
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-400'
                          : 'bg-red-50 dark:bg-red-950/20 border-red-400'
                      }`}
                    >
                      <span className="font-bold text-[var(--text-muted)] block text-[11px]">
                        YOUR ANSWER:
                      </span>
                      {isAnswered ? (
                        <div className={!isCorrect ? 'text-red-700 dark:text-red-300 font-semibold' : 'text-green-700 dark:text-green-300 font-semibold'}>
                          [{['A', 'B', 'C', 'D'][userChoiceIdx]}]{' '}
                          <FormattedText text={q.options[userChoiceIdx]} className="inline" />
                        </div>
                      ) : (
                        <span className="text-red-600 italic">No answer submitted</span>
                      )}
                    </div>

                    <div className="p-2 border bg-green-50 dark:bg-green-950/20 border-green-400">
                      <span className="font-bold text-green-800 dark:text-green-300 block text-[11px]">
                        CORRECT ANSWER:
                      </span>
                      <div className="text-green-800 dark:text-green-200 font-bold">
                        [{['A', 'B', 'C', 'D'][q.correctIndex]}]{' '}
                        <FormattedText text={q.options[q.correctIndex]} className="inline" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Solution */}
                {isExpanded && (
                  <div className="p-4 bg-[var(--card-bg)] border-t-2 border-[var(--border-color)] space-y-4 text-xs">
                    {/* Diagram if available */}
                    {q.diagram && (
                      <div className="mb-2">
                        <TrajectoryVisualizer data={q.diagram} />
                      </div>
                    )}

                    {/* Step-by-Step Breakdown */}
                    <div className="space-y-3">
                      <div className="font-pixel text-sm font-bold text-[var(--accent)] border-b border-[var(--border-color)] pb-1">
                        [DETAILED MATHEMATICAL SOLUTION STEPS]
                      </div>

                      {/* Equations */}
                      <div className="p-2.5 bg-[var(--bg-color)] border border-[var(--border-color)]">
                        <div className="font-bold text-[var(--text-primary)] mb-1">
                          Kinematic Equations Used:
                        </div>
                        <div className="space-y-1">
                          {q.explanation.equations.map((eq, i) => (
                            <MathRenderer key={i} math={eq} block />
                          ))}
                        </div>
                      </div>

                      {/* Knowns & Unknowns */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="p-2.5 bg-[var(--bg-color)] border border-[var(--border-color)]">
                          <div className="font-bold text-[var(--text-primary)] mb-1">Known Quantities:</div>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {q.explanation.knowns.map((k, i) => (
                              <li key={i}>
                                <MathRenderer math={k.symbol} /> = {k.value}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-2.5 bg-[var(--bg-color)] border border-[var(--border-color)]">
                          <div className="font-bold text-[var(--text-primary)] mb-1">Target Unknowns:</div>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                            {q.explanation.unknowns.map((u, i) => (
                              <li key={i}>
                                <MathRenderer math={u.symbol} />: {u.target}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Physical Rationale */}
                      <div className="p-2.5 bg-[var(--bg-color)] border border-[var(--border-color)]">
                        <div className="font-bold text-[var(--text-primary)] mb-1">
                          Physical Rationale:
                        </div>
                        <FormattedText text={q.explanation.whyEquation} className="text-[11px] leading-relaxed" />
                      </div>

                      {/* Rearrangement & Substitution */}
                      <div className="p-2.5 bg-[var(--bg-color)] border border-[var(--border-color)] space-y-1">
                        <div className="font-bold text-[var(--text-primary)] mb-1">
                          Calculations & Algebraic Derivations:
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--text-muted)] text-[11px]">Rearrangement:</span>
                          <MathRenderer math={q.explanation.rearrangement} block />
                        </div>
                        <div>
                          <span className="font-semibold text-[var(--text-muted)] text-[11px]">Substitution:</span>
                          <MathRenderer math={q.explanation.substitution} block />
                        </div>
                      </div>

                      {/* Final result */}
                      <div className="p-2.5 bg-[var(--accent-light)] border border-[var(--accent)] text-[var(--text-primary)]">
                        <div className="font-bold text-[var(--accent)]">Final Verified Value:</div>
                        <div className="text-xs sm:text-sm font-bold mt-0.5">
                          {q.explanation.result}
                        </div>
                      </div>

                      {/* Error Analysis if answered incorrectly */}
                      {!isCorrect && q.explanation.commonMistakesNotice && (
                        <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-500 text-amber-900 dark:text-amber-200 text-[11px]">
                          <span className="font-bold">Probable Error Source / Pitfall: </span>
                          <span>{q.explanation.commonMistakesNotice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="pt-4 flex flex-wrap justify-between items-center gap-3 border-t-2 border-[var(--border-color)]">
          <button onClick={onNewConfig} className="retro-btn px-4 py-2 font-bold">
            &lt; CONFIGURE DIFFERENT TEST
          </button>

          <div className="flex space-x-2">
            <button
              onClick={onRetakeNewTest}
              className="retro-btn-accent px-6 py-2.5 font-pixel text-base font-bold tracking-wider"
            >
              RETAKE TEST (NEW QUESTIONS) &gt;&gt;
            </button>
            <button
              onClick={onNavigateHome}
              className="retro-btn px-4 py-2 font-bold"
            >
              RETURN TO HOME
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
