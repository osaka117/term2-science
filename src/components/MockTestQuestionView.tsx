import React, { useState } from 'react';
import { Question } from '../types/physics';
import { FormattedText } from './MathRenderer';
import { TrajectoryVisualizer } from './TrajectoryVisualizer';

interface MockTestQuestionViewProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<number, number>; // questionIndex -> optionIndex
  flaggedQuestions: Set<number>;
  onSelectOption: (qIndex: number, optionIndex: number) => void;
  onToggleFlag: (qIndex: number) => void;
  onNavigateTo: (qIndex: number) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmitTest: () => void;
}

export const MockTestQuestionView: React.FC<MockTestQuestionViewProps> = ({
  questions,
  currentIndex,
  userAnswers,
  flaggedQuestions,
  onSelectOption,
  onToggleFlag,
  onNavigateTo,
  onNext,
  onPrev,
  onSubmitTest,
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];
  const selectedOption = userAnswers[currentIndex] !== undefined ? userAnswers[currentIndex] : null;
  const isFlagged = flaggedQuestions.has(currentIndex);

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = totalQuestions - answeredCount;

  const handleAttemptSubmit = () => {
    setShowConfirmModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6 select-none font-mono text-xs sm:text-sm">
      {/* Test Header */}
      <div className="bg-[var(--card-bg)] retro-border p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="font-pixel text-xl sm:text-2xl font-bold text-[var(--accent)]">
            QUESTION {currentIndex + 1} OF {totalQuestions}
          </span>
          <button
            onClick={() => onToggleFlag(currentIndex)}
            className={`px-2 py-1 text-xs font-bold border transition-colors ${
              isFlagged
                ? 'bg-amber-400 text-black border-amber-600'
                : 'bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            {isFlagged ? '★ FLAGGED' : '☆ FLAG FOR REVIEW'}
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 bg-[var(--bg-color)] border border-[var(--border-color)] text-[11px] font-bold">
            LVL {currentQuestion.difficulty}
          </span>
          <span className="px-2 py-0.5 bg-[var(--accent-light)] text-[var(--accent)] border border-[var(--border-color)] text-[11px] font-bold uppercase truncate max-w-[200px] sm:max-w-none">
            {currentQuestion.topicTitle}
          </span>
        </div>
      </div>

      {/* Question navigation grid / palette */}
      <div className="bg-[var(--card-bg)] retro-border p-3 space-y-2">
        <div className="flex justify-between items-center text-[11px] text-[var(--text-muted)] border-b border-[var(--border-color)] pb-1">
          <span>[NAVIGATION PALETTE: JUMP TO QUESTION]</span>
          <span>
            ANSWERED: <strong>{answeredCount}</strong> / {totalQuestions} ({unansweredCount} remaining)
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {questions.map((_, idx) => {
            const isAnswered = userAnswers[idx] !== undefined;
            const isCurrent = idx === currentIndex;
            const isQFlagged = flaggedQuestions.has(idx);

            let btnClass = 'bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-muted)]';

            if (isCurrent) {
              btnClass = 'bg-[var(--accent)] text-white font-bold ring-2 ring-[var(--border-color)]';
            } else if (isAnswered) {
              btnClass = 'bg-[var(--accent-light)] border-[var(--accent)] text-[var(--accent)] font-bold';
            }

            return (
              <button
                key={idx}
                onClick={() => onNavigateTo(idx)}
                className={`relative w-8 h-8 text-xs font-mono border cursor-pointer flex items-center justify-center transition-all ${btnClass}`}
                title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}${isQFlagged ? ' (Flagged)' : ''}`}
              >
                {idx + 1}
                {isQFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border border-black"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main question card */}
      <div className="bg-[var(--card-bg)] retro-border p-5 sm:p-7 space-y-5">
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider">
            [EXAMINATION QUESTION]
          </div>
          <FormattedText
            text={currentQuestion.prompt}
            className="text-sm sm:text-base font-semibold leading-relaxed text-[var(--text-primary)]"
          />
        </div>

        {/* Diagram if available */}
        {currentQuestion.diagram && (
          <div className="my-3">
            <TrajectoryVisualizer data={currentQuestion.diagram} />
          </div>
        )}

        {/* Four multiple choice options */}
        <div className="space-y-2.5 pt-2">
          <div className="text-[11px] font-bold text-[var(--text-muted)] tracking-wider">
            [OPTIONS]
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const letter = ['A', 'B', 'C', 'D'][idx];
              const isSelected = selectedOption === idx;

              return (
                <div
                  key={idx}
                  onClick={() => onSelectOption(currentIndex, idx)}
                  className={`p-3.5 transition-all flex items-start space-x-3 cursor-pointer ${
                    isSelected
                      ? 'border-2 border-[var(--accent)] bg-[var(--accent-light)] text-[var(--text-primary)] font-bold retro-border-sm'
                      : 'border-2 border-[var(--border-color)] bg-[var(--bg-color)] hover:border-[var(--accent)]'
                  }`}
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

        {/* Bottom controls: Previous, Next, Submit */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-[var(--border-color)]">
          <div className="flex space-x-2">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="retro-btn px-4 py-2 font-bold disabled:opacity-40"
            >
              &lt; PREVIOUS
            </button>
            <button
              onClick={onNext}
              disabled={currentIndex === totalQuestions - 1}
              className="retro-btn px-4 py-2 font-bold disabled:opacity-40"
            >
              NEXT &gt;
            </button>
          </div>

          <button
            onClick={handleAttemptSubmit}
            className="retro-btn-accent px-6 py-2.5 font-pixel text-base font-bold tracking-wider"
          >
            SUBMIT TEST &gt;&gt;
          </button>
        </div>
      </div>

      {/* Confirmation modal before submission */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[var(--card-bg)] retro-border p-5 max-w-md w-full space-y-4 font-mono text-xs">
            <div className="bg-[#2b3a32] text-white px-3 py-1.5 font-pixel text-sm font-bold flex justify-between">
              <span>[CONFIRM TEST SUBMISSION]</span>
              <span>ATTENTION</span>
            </div>

            <div className="space-y-3 py-2 text-[var(--text-primary)]">
              {unansweredCount > 0 ? (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-600 text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold">
                    ⚠ Warning: You have {unansweredCount} unanswered question(s)!
                  </div>
                  <p className="text-[11px]">
                    Answered: {answeredCount} / {totalQuestions}. Any unanswered questions will be marked incorrect.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-green-50 dark:bg-green-950/60 border border-green-600 text-green-900 dark:text-green-200">
                  ✓ All {totalQuestions} questions have been answered. Ready to score.
                </div>
              )}

              <p className="text-xs">
                Are you sure you want to finalize and submit your test? Once submitted, you cannot change your answers, and full solutions will be revealed.
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-[var(--border-color)]">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="retro-btn px-3 py-1.5 font-bold"
              >
                RETURN TO TEST
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  onSubmitTest();
                }}
                className="retro-btn-accent px-4 py-1.5 font-bold"
              >
                CONFIRM & SUBMIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
