import React, { useState, useEffect } from 'react';
import { DifficultyLevel, MockTestConfig, PracticeConfig, Question, TOPICS } from './types/physics';
import { generateQuestion } from './physics/engine';
import { RetroHeader } from './components/RetroHeader';
import { HomeScreen } from './components/HomeScreen';
import { PracticeConfigView } from './components/PracticeConfigView';
import { PracticeQuestionView } from './components/PracticeQuestionView';
import { MockTestConfigView } from './components/MockTestConfigView';
import { MockTestQuestionView } from './components/MockTestQuestionView';
import { MockTestResultsView } from './components/MockTestResultsView';
import { FormulaSheetModal } from './components/FormulaSheetModal';
import { GitHubPagesModal } from './components/GitHubPagesModal';

type AppView =
  | 'home'
  | 'practice_config'
  | 'practice_active'
  | 'mock_config'
  | 'mock_active'
  | 'mock_results';

interface SavedState {
  view: AppView;
  practiceConfig: PracticeConfig;
  mockConfig: MockTestConfig;
  practiceQuestion: Question | null;
  practiceCount: number;
  mockQuestions: Question[];
  mockCurrentIndex: number;
  mockUserAnswers: Record<number, number>;
  mockFlaggedIndices: number[];
  theme: 'dark' | 'green' | 'amber' | 'paper';
  scanlines: boolean;
}

const STORAGE_KEY = 'projectile_motion_reviewer_state_v4';

export default function App() {
  // Theme and aesthetic effects: default is 'dark'
  const [theme, setTheme] = useState<'dark' | 'green' | 'amber' | 'paper'>('dark');
  const [scanlines, setScanlines] = useState<boolean>(false);

  // Modals
  const [isFormulaOpen, setIsFormulaOpen] = useState<boolean>(false);
  const [isDeployOpen, setIsDeployOpen] = useState<boolean>(false);

  // Default view is practice_active (shows questions on startup!)
  const [view, setView] = useState<AppView>('practice_active');

  // Practice session state: defaults to 'random' topic on startup with g = 9.8 m/s²
  const [practiceConfig, setPracticeConfig] = useState<PracticeConfig>({
    topicSelection: 'random', // Random mode selected on startup!
    selectedDifficulties: [1, 2, 3, 4, 5],
    randomDifficulty: true,
  });

  // Initialize first question on startup immediately with Random Topic and g = 9.8
  const [practiceQuestion, setPracticeQuestion] = useState<Question>(() => {
    const initTopic = Math.floor(Math.random() * 10) + 1;
    const initDiff = (Math.floor(Math.random() * 5) + 1) as DifficultyLevel;
    return generateQuestion(initTopic, initDiff, 9.8);
  });
  const [practiceCount, setPracticeCount] = useState<number>(1);

  // Mock test session state
  const [mockConfig, setMockConfig] = useState<MockTestConfig>({
    questionCount: 10,
    selectedTopics: TOPICS.map((t) => t.id),
  });
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [mockCurrentIndex, setMockCurrentIndex] = useState<number>(0);
  const [mockUserAnswers, setMockUserAnswers] = useState<Record<number, number>>({});
  const [mockFlagged, setMockFlagged] = useState<Set<number>>(new Set());

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedRaw = localStorage.getItem(STORAGE_KEY);
      if (savedRaw) {
        const saved: SavedState = JSON.parse(savedRaw);
        if (saved.theme) setTheme(saved.theme);
        if (typeof saved.scanlines === 'boolean') setScanlines(saved.scanlines);
        if (saved.practiceConfig) {
          setPracticeConfig({
            topicSelection: saved.practiceConfig.topicSelection ?? 'random',
            selectedDifficulties: saved.practiceConfig.selectedDifficulties || [1, 2, 3, 4, 5],
            randomDifficulty: saved.practiceConfig.randomDifficulty ?? true,
          });
        }
        if (saved.mockConfig) setMockConfig(saved.mockConfig);
        if (saved.practiceQuestion) setPracticeQuestion(saved.practiceQuestion);
        if (saved.practiceCount) setPracticeCount(saved.practiceCount);
        if (saved.mockQuestions && saved.mockQuestions.length > 0) {
          setMockQuestions(saved.mockQuestions);
          setMockCurrentIndex(saved.mockCurrentIndex || 0);
          setMockUserAnswers(saved.mockUserAnswers || {});
          setMockFlagged(new Set(saved.mockFlaggedIndices || []));
        }
        // Always default to practice_active or mock test if mock test was actively underway
        if (saved.view && saved.view.startsWith('mock_active')) {
          setView(saved.view);
        } else {
          setView('practice_active');
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Sync theme to document body
  useEffect(() => {
    document.body.classList.remove('theme-green', 'theme-amber', 'theme-paper');
    if (theme === 'green') document.body.classList.add('theme-green');
    if (theme === 'amber') document.body.classList.add('theme-amber');
    if (theme === 'paper') document.body.classList.add('theme-paper');
  }, [theme]);

  // Persist to LocalStorage on state change
  useEffect(() => {
    try {
      const stateToSave: SavedState = {
        view,
        practiceConfig,
        mockConfig,
        practiceQuestion,
        practiceCount,
        mockQuestions,
        mockCurrentIndex,
        mockUserAnswers,
        mockFlaggedIndices: Array.from(mockFlagged),
        theme,
        scanlines,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // Ignore quota errors
    }
  }, [
    view,
    practiceConfig,
    mockConfig,
    practiceQuestion,
    practiceCount,
    mockQuestions,
    mockCurrentIndex,
    mockUserAnswers,
    mockFlagged,
    theme,
    scanlines,
  ]);

  // -------------------------------------------------------------
  // PRACTICE MODE QUESTION GENERATION & HANDLERS
  // -------------------------------------------------------------

  const getNextPracticeQuestion = (config: PracticeConfig): Question => {
    // 1 topic at a time unless user chooses 'random'
    let topicId: number;
    if (config.topicSelection === 'random') {
      topicId = Math.floor(Math.random() * 10) + 1;
    } else {
      topicId = typeof config.topicSelection === 'number' ? config.topicSelection : 1;
    }

    const diffs =
      config.selectedDifficulties && config.selectedDifficulties.length > 0
        ? config.selectedDifficulties
        : ([1, 2, 3, 4, 5] as DifficultyLevel[]);
    const difficulty: DifficultyLevel = config.randomDifficulty
      ? diffs[Math.floor(Math.random() * diffs.length)]
      : diffs[0];

    // Constant gravity g = 9.8 m/s²
    return generateQuestion(topicId, difficulty, 9.8);
  };

  const handleNextPracticeQuestion = () => {
    const nextQ = getNextPracticeQuestion(practiceConfig);
    setPracticeQuestion(nextQ);
    setPracticeCount((prev) => prev + 1);
  };

  // Called directly when clicking any topic button on top of the question
  const handleSelectPracticeTopic = (topic: number | 'random') => {
    const updatedConfig: PracticeConfig = {
      ...practiceConfig,
      topicSelection: topic,
    };
    setPracticeConfig(updatedConfig);
    const newQ = getNextPracticeQuestion(updatedConfig);
    setPracticeQuestion(newQ);
    setPracticeCount((prev) => prev + 1);
  };

  // Called directly when clicking difficulty buttons on top of the question
  const handleSelectPracticeDifficulty = (diff: DifficultyLevel | 'random') => {
    let updatedConfig: PracticeConfig;
    if (diff === 'random') {
      updatedConfig = {
        ...practiceConfig,
        selectedDifficulties: [1, 2, 3, 4, 5],
        randomDifficulty: true,
      };
    } else {
      updatedConfig = {
        ...practiceConfig,
        selectedDifficulties: [diff],
        randomDifficulty: false,
      };
    }
    setPracticeConfig(updatedConfig);
    const newQ = getNextPracticeQuestion(updatedConfig);
    setPracticeQuestion(newQ);
  };

  // -------------------------------------------------------------
  // MOCK TEST MODE HANDLERS
  // -------------------------------------------------------------

  const handleStartMockTest = (config: MockTestConfig) => {
    setMockConfig(config);

    // Generate N questions across selected topics with independent random difficulty (1 to 5)
    // Constant gravity g = 9.8 m/s²
    const newQuestions: Question[] = [];
    const topics = config.selectedTopics.length > 0 ? config.selectedTopics : [1];

    for (let i = 0; i < config.questionCount; i++) {
      const topicId = topics[i % topics.length];
      const diff = (Math.floor(Math.random() * 5) + 1) as DifficultyLevel;
      newQuestions.push(generateQuestion(topicId, diff, 9.8));
    }

    // Shuffle questions order slightly so topics aren't strictly grouped
    for (let i = newQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newQuestions[i], newQuestions[j]] = [newQuestions[j], newQuestions[i]];
    }

    setMockQuestions(newQuestions);
    setMockCurrentIndex(0);
    setMockUserAnswers({});
    setMockFlagged(new Set());
    setView('mock_active');
  };

  const handleSelectMockOption = (qIndex: number, optionIndex: number) => {
    setMockUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const handleToggleMockFlag = (qIndex: number) => {
    setMockFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(qIndex)) next.delete(qIndex);
      else next.add(qIndex);
      return next;
    });
  };

  const handleSubmitMockTest = () => {
    setView('mock_results');
  };

  const handleRetakeNewMockTest = () => {
    handleStartMockTest(mockConfig);
  };

  return (
    <div className={`min-h-screen flex flex-col relative ${scanlines ? 'scanlines' : ''}`}>
      {/* Retro Navigation Header */}
      <RetroHeader
        currentView={view}
        onNavigateHome={() => setView('home')}
        onSwitchToPractice={() => setView('practice_active')}
        onSwitchToMock={() => setView('mock_config')}
        onOpenFormula={() => setIsFormulaOpen(true)}
        onOpenDeploy={() => setIsDeployOpen(true)}
        theme={theme}
        onToggleTheme={(t) => setTheme(t)}
        scanlines={scanlines}
        onToggleScanlines={() => setScanlines((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-12">
        {/* Startup & Default Practice Question View */}
        {view === 'practice_active' && practiceQuestion && (
          <PracticeQuestionView
            question={practiceQuestion}
            questionNumber={practiceCount}
            currentTopicSelection={practiceConfig.topicSelection}
            currentDifficultySelection={
              practiceConfig.randomDifficulty
                ? 'random'
                : practiceConfig.selectedDifficulties[0] || 1
            }
            onSelectTopic={handleSelectPracticeTopic}
            onSelectDifficulty={handleSelectPracticeDifficulty}
            onNextQuestion={handleNextPracticeQuestion}
            onSwitchToMockTest={() => setView('mock_config')}
          />
        )}

        {view === 'practice_config' && (
          <PracticeConfigView
            initialConfig={practiceConfig}
            onStart={(cfg) => {
              setPracticeConfig(cfg);
              const newQ = getNextPracticeQuestion(cfg);
              setPracticeQuestion(newQ);
              setPracticeCount(1);
              setView('practice_active');
            }}
            onBack={() => setView('practice_active')}
          />
        )}

        {view === 'home' && (
          <HomeScreen
            onStartPractice={() => setView('practice_active')}
            onStartMock={() => setView('mock_config')}
            onOpenFormula={() => setIsFormulaOpen(true)}
          />
        )}

        {view === 'mock_config' && (
          <MockTestConfigView
            initialConfig={mockConfig}
            onStart={handleStartMockTest}
            onBack={() => setView('practice_active')}
          />
        )}

        {view === 'mock_active' && mockQuestions.length > 0 && (
          <MockTestQuestionView
            questions={mockQuestions}
            currentIndex={mockCurrentIndex}
            userAnswers={mockUserAnswers}
            flaggedQuestions={mockFlagged}
            onSelectOption={handleSelectMockOption}
            onToggleFlag={handleToggleMockFlag}
            onNavigateTo={(idx) => setMockCurrentIndex(idx)}
            onNext={() =>
              setMockCurrentIndex((prev) => Math.min(mockQuestions.length - 1, prev + 1))
            }
            onPrev={() => setMockCurrentIndex((prev) => Math.max(0, prev - 1))}
            onSubmitTest={handleSubmitMockTest}
          />
        )}

        {view === 'mock_results' && mockQuestions.length > 0 && (
          <MockTestResultsView
            questions={mockQuestions}
            userAnswers={mockUserAnswers}
            onRetakeNewTest={handleRetakeNewMockTest}
            onNewConfig={() => setView('mock_config')}
            onNavigateHome={() => setView('practice_active')}
          />
        )}
      </main>

      {/* Footer System Status Bar */}
      <footer className="border-t-2 border-[var(--border-color)] bg-[var(--card-bg)] py-3 px-4 text-xs font-mono text-[var(--text-muted)] select-none">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse"></span>
            <span>SYSTEM STATUS: LOCAL MATH ENGINE ONLINE</span>
            <span className="hidden sm:inline">| CONSTANT g = 9.8 m/s² | SI UNITS</span>
          </div>
          <div>
            <span>GITHUB PAGES READY (VITE STATIC SPA)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FormulaSheetModal
        isOpen={isFormulaOpen}
        onClose={() => setIsFormulaOpen(false)}
      />

      <GitHubPagesModal
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
      />
    </div>
  );
}
