import React, { useState, useEffect } from 'react';
import {
  Server,
  Sparkles,
  Volume2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  ClipboardList,
  Layers,
  ArrowRight,
  Info,
  PlusCircle,
  PlayCircle,
  Lock,
  HelpCircle,
  ArrowUpDown,
  Eye,
  Maximize2,
  Minimize2,
  Grid
} from 'lucide-react';
import { questionStore } from './utils/questionStore';
import { Question, OptionKey } from './types';
import { audioService } from './utils/audioPlayer';
import { Header, NavTab } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { ExplanationDrawer } from './components/ExplanationDrawer';
import { PrerequisitesChecklist } from './components/PrerequisitesChecklist';
import { BastionAchievementGuidance } from './components/BastionAchievementGuidance';
import { PreExamSimulator } from './components/PreExamSimulator';
import { NutanixLogo } from './components/NutanixLogo';
import { AskAIAssistant } from './components/AskAIAssistant';
import { LocalSetupGuide } from './components/LocalSetupGuide';
import { QuestionCreator } from './components/QuestionCreator';
import { SeriesManager } from './components/SeriesManager';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { AIDeepDiveSection } from './components/AIDeepDiveSection';
import { AdminTabProtectionModal } from './components/AdminTabProtectionModal';
import { BlurLockContainer } from './components/BlurLockContainer';
import { adminTabStore } from './utils/adminTabStore';
import { QuestionDirectoryLookup } from './components/QuestionDirectoryLookup';
import { MobileQuestionQuickDrawer } from './components/MobileQuestionQuickDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('prerequisites');
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => questionStore.getAllQuestions());
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [adminSelectedQuestionId, setAdminSelectedQuestionId] = useState<string | undefined>(undefined);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, { selected: OptionKey | null; isSubmitted: boolean }>>({
    'nkp-q1': { selected: null, isSubmitted: false },
  });
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [isWideScreen, setIsWideScreen] = useState<boolean>(() => {
    return localStorage.getItem('nkp_layout_widescreen') !== 'false';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(adminTabStore.isUserAdmin());
  const [isDirectoryLookupOpen, setIsDirectoryLookupOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nkp_focus_mode');
    if (saved !== null) return saved === 'true';
    return typeof window !== 'undefined' && window.innerWidth < 768;
  });

  // Re-route if activeTab is or becomes hidden (fixed hide mode: hidden tabs disappear from entire screen)
  useEffect(() => {
    const tabOrder: NavTab[] = [
      'prerequisites',
      'practice-mode',
      'exam-question',
      'series-manager',
      'add-question',
      'local-setup',
      'ask-ai',
    ];
    if (adminTabStore.isTabHidden(activeTab)) {
      const firstAvailable = tabOrder.find((t) => !adminTabStore.isTabHidden(t)) || 'prerequisites';
      setActiveTab(firstAvailable);
    }
  }, [activeTab]);

  // Subscribe to dynamic question updates
  useEffect(() => {
    const unsub = questionStore.subscribe((questions) => {
      setAllQuestions(questions);
    });
    return unsub;
  }, []);

  // Subscribe to admin auth / permissions updates
  useEffect(() => {
    const unsub = adminTabStore.subscribe(() => {
      setIsAdmin(adminTabStore.isUserAdmin());
      // If current active tab was hidden by administrator, immediately switch to first visible tab
      setActiveTab((prev) => {
        if (adminTabStore.isTabHidden(prev)) {
          const tabOrder: NavTab[] = [
            'prerequisites',
            'practice-mode',
            'exam-question',
            'series-manager',
            'add-question',
            'local-setup',
            'ask-ai',
          ];
          return tabOrder.find((t) => !adminTabStore.isTabHidden(t)) || 'prerequisites';
        }
        return prev;
      });
    });
    return unsub;
  }, []);

  const toggleWideScreen = () => {
    setIsWideScreen((prev) => {
      const next = !prev;
      localStorage.setItem('nkp_layout_widescreen', String(next));
      return next;
    });
  };

  const currentQuestion = allQuestions[questionIndex] || allQuestions[0];
  const currentState = (currentQuestion && userAnswers[currentQuestion.id]) || { selected: null, isSubmitted: false };

  useEffect(() => {
    const unsub = audioService.subscribe((state) => {
      setIsAudioPlaying(state.isPlaying);
    });
    return unsub;
  }, []);

  const handleSelectOption = (key: OptionKey) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: key,
        isSubmitted: false,
      },
    }));
  };

  const handleSubmit = () => {
    if (!currentQuestion || !currentState.selected) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...currentState,
        isSubmitted: true,
      },
    }));
  };

  const handleRevealCorrectAnswer = () => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: currentQuestion.correctOptionId,
        isSubmitted: true,
      },
    }));
  };

  const handleReset = () => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        selected: null,
        isSubmitted: false,
      },
    }));
  };

  const handleNextQuestion = () => {
    if (questionIndex < allQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleDeleteQuestion = async (qId: string) => {
    await questionStore.deleteQuestion(qId);
    const updated = questionStore.getAllQuestions();
    setAllQuestions(updated);
    if (questionIndex >= updated.length) {
      setQuestionIndex(Math.max(0, updated.length - 1));
    }
  };

  const answeredCount = (Object.values(userAnswers) as { selected: OptionKey | null; isSubmitted: boolean }[]).filter(
    (a) => a.isSubmitted
  ).length;
  const correctCount = (Object.entries(userAnswers) as [string, { selected: OptionKey | null; isSubmitted: boolean }][]).filter(
    ([id, a]) => a.isSubmitted && a.selected === allQuestions.find((q) => q.id === id)?.correctOptionId
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans antialiased pb-28">
      {/* Top Header (Desktop navigation with scroll-down auto-hide + Mobile/Tablet floating pill & drawer) */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentQuestionIndex={questionIndex}
        totalQuestions={allQuestions.length}
        isAudioPlaying={isAudioPlaying}
        isWideScreen={isWideScreen}
        onToggleWideScreen={toggleWideScreen}
        onOpenAdminProtection={() => setIsAdminModalOpen(true)}
      />

      {/* Main Container - Full Scale & Fluid Optimization */}
      <main
        className={`flex-1 w-full transition-all ${
          activeTab === 'exam-question' && isFocusMode
            ? 'px-2 sm:px-4 py-3 sm:py-4 space-y-4'
            : 'px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8 space-y-6'
        } ${isWideScreen ? 'max-w-none' : 'max-w-[1720px] mx-auto'}`}
      >
        {/* Tab View Area (When tab is hidden, it completely disappears from the entire screen) */}
        {!adminTabStore.isTabHidden(activeTab) && (
        <BlurLockContainer
          isLocked={!isAdmin && adminTabStore.isTabBlurLocked(activeTab)}
          title={`Restricted Tab: ${adminTabStore.getConfig(activeTab).label}`}
          subtitle="This tab has been restricted by the examination administrator."
          badgeLabel="Restricted Tab • Copy-Paste Disabled"
          onUnlockRequest={() => setIsAdminModalOpen(true)}
        >
          {/* Tab: Series Manager & Reordering */}
          {activeTab === 'series-manager' && (
            <div className="space-y-6">
              <SeriesManager
                questions={allQuestions}
                currentQuestionIndex={questionIndex}
                onSelectQuestion={(idx) => {
                  setQuestionIndex(idx);
                  setActiveTab('exam-question');
                }}
                onEditQuestion={(q) => {
                  setEditingQuestion(q);
                  setActiveTab('add-question');
                }}
              />
            </div>
          )}

          {/* Tab: Manual Question Creator & Editor */}
          {activeTab === 'add-question' && (
          <div className="space-y-6">
            <QuestionCreator
              editQuestion={editingQuestion}
              initialQuestionId={adminSelectedQuestionId}
              onCancelEdit={() => {
                setEditingQuestion(null);
                setAdminSelectedQuestionId(undefined);
              }}
              onQuestionCreated={(newIdx) => {
                setEditingQuestion(null);
                setAdminSelectedQuestionId(undefined);
                setQuestionIndex(newIdx);
                setActiveTab('exam-question');
              }}
              onNavigateToQuestion={(idx) => {
                setEditingQuestion(null);
                setAdminSelectedQuestionId(undefined);
                setQuestionIndex(idx);
                setActiveTab('exam-question');
              }}
            />
          </div>
        )}

        {/* Tab 1: Primary Exam Questions */}
        {activeTab === 'exam-question' && (
          <div className="space-y-6">
            {allQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">No Active Questions in Pool</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    All exam questions have been deleted or filtered. You can restore default questions or author custom ones.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={async () => {
                      await questionStore.restoreAllQuestions();
                      const updated = questionStore.getAllQuestions();
                      setAllQuestions(updated);
                      setQuestionIndex(0);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors"
                  >
                    Restore All Questions
                  </button>
                  <button
                    onClick={() => setActiveTab('add-question')}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    Create Question
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Question Selector Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white px-3.5 sm:px-5 py-3 rounded-2xl border border-slate-200 gap-3 shadow-sm">
                  <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap">
                    {/* Quick 103 Question Grid Drawer Button */}
                    <button
                      type="button"
                      onClick={() => setIsMobileDrawerOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 transition-all"
                      title="Open full question grid to jump to any question"
                    >
                      <Grid className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Questions ({allQuestions.length})</span>
                    </button>

                    {/* Question Dropdown Jump */}
                    <select
                      value={questionIndex}
                      onChange={(e) => setQuestionIndex(Number(e.target.value))}
                      className="text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 max-w-[140px] xs:max-w-xs md:max-w-sm truncate"
                    >
                      {allQuestions.map((q, idx) => {
                        const ans = userAnswers[q.id];
                        const statusText = ans?.isSubmitted
                          ? ans.selected === q.correctOptionId
                            ? '✓'
                            : '✗'
                          : '○';
                        return (
                          <option key={q.id} value={idx}>
                            {statusText} Q{idx + 1}: {q.title}
                          </option>
                        );
                      })}
                    </select>

                    {/* Preview Previous Questions & Options Directory Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setIsDirectoryLookupOpen(!isDirectoryLookupOpen)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isDirectoryLookupOpen
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                      title="View previous questions and preview options"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isDirectoryLookupOpen ? 'Hide Directory' : 'Browse All'}</span>
                      <span className="sm:hidden">Browse</span>
                    </button>

                    {/* Focus Mode / Full Screen Question Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsFocusMode(!isFocusMode);
                        localStorage.setItem('nkp_focus_mode', String(!isFocusMode));
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isFocusMode
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                      title={isFocusMode ? 'Exit Full Screen Mode' : 'Enter Full Screen Focus Mode'}
                    >
                      {isFocusMode ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="hidden sm:inline">Exit Focus</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
                          <span className="hidden sm:inline">Full Screen Focus</span>
                          <span className="sm:hidden">Focus</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto flex-shrink-0">
                    <button
                      onClick={handlePrevQuestion}
                      disabled={questionIndex === 0}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Previous Question"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Prev</span>
                    </button>

                    <div className="text-xs font-mono text-slate-600 px-1 font-bold">
                      {questionIndex + 1} / {allQuestions.length}
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      disabled={questionIndex === allQuestions.length - 1}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      title="Next Question"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Directory / Preview Modal Drawer */}
                {isDirectoryLookupOpen && (
                  <div className="transition-all animate-in fade-in duration-200">
                    <QuestionDirectoryLookup
                      questions={allQuestions}
                      currentIndex={questionIndex}
                      userAnswers={userAnswers}
                      isOpen={isDirectoryLookupOpen}
                      onSelectQuestion={(idx) => {
                        setQuestionIndex(idx);
                        setIsDirectoryLookupOpen(false);
                      }}
                      onClose={() => setIsDirectoryLookupOpen(false)}
                    />
                  </div>
                )}

                {/* The Question Card Component */}
                {currentQuestion && (
                  <QuestionCard
                    question={currentQuestion}
                    selectedOption={currentState.selected}
                    onSelectOption={handleSelectOption}
                    isSubmitted={currentState.isSubmitted}
                    onSubmit={handleSubmit}
                    onReset={handleReset}
                    onRevealCorrectAnswer={handleRevealCorrectAnswer}
                    onDeleteQuestion={handleDeleteQuestion}
                    onNextQuestion={handleNextQuestion}
                    onPrevQuestion={handlePrevQuestion}
                    hasPrev={questionIndex > 0}
                    hasNext={questionIndex < allQuestions.length - 1}
                    questionIndex={questionIndex}
                    totalQuestions={allQuestions.length}
                    onOpenQuestionList={() => setIsMobileDrawerOpen(true)}
                    onEditQuestion={(q) => {
                      setEditingQuestion(q);
                      setActiveTab('add-question');
                    }}
                    onOpenAdmin={(qId) => {
                      setAdminSelectedQuestionId(qId);
                      setEditingQuestion(allQuestions.find(q => q.id === qId) || null);
                      setActiveTab('add-question');
                    }}
                  />
                )}

                {/* Reveal Correct Answer & Live AI Deep Dive Section */}
                {currentQuestion && (
                  <AIDeepDiveSection
                    question={currentQuestion}
                    isSubmitted={currentState.isSubmitted}
                    selectedOption={currentState.selected}
                    onRevealAndSubmit={handleRevealCorrectAnswer}
                  />
                )}

                {/* Built-in Architectural Explanation Teardown when submitted */}
                {currentState.isSubmitted && currentQuestion && (
                  <ExplanationDrawer
                    question={currentQuestion}
                    onOpenAdmin={(qId) => {
                      setAdminSelectedQuestionId(qId);
                      setEditingQuestion(allQuestions.find(q => q.id === qId) || null);
                      setActiveTab('add-question');
                    }}
                    onOpenAdminProtection={() => setIsAdminModalOpen(true)}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Tab: Pre-Examination Simulation Mode (NCP-CN 7.5) */}
        {activeTab === 'practice-mode' && (
          <div className="space-y-6">
            <PreExamSimulator
              onExitSimulation={() => setActiveTab('exam-question')}
              onReviewInDrawer={(qId) => {
                const idx = allQuestions.findIndex((q) => q.id === qId);
                if (idx !== -1) setQuestionIndex(idx);
                setActiveTab('exam-question');
              }}
            />
          </div>
        )}

        {/* Tab 4: Bastion Hosting Examination Achievement Guidance & Prerequisites */}
        {activeTab === 'prerequisites' && (
          <div className="space-y-6">
            <BastionAchievementGuidance onStartSimulation={() => setActiveTab('practice-mode')} />
          </div>
        )}

        {/* Tab 5: Ask AI Assistant - Exclusive home for the white platform label & action buttons */}
        {activeTab === 'ask-ai' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0 p-2">
                  <NutanixLogo className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800 font-mono">
                      Nutanix Kubernetes Platform (NKP)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold border border-emerald-300 font-mono">
                      TARGET: NCP-CN 7.5
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {allQuestions.length} Questions Bank
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      Full-Scale Fluid UI
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Targeting <strong>NCP-CN 7.5</strong> certification requirements: <strong>Bastion Host Sizing &amp; Lifecycle</strong>, <strong>Centralized Thanos Monitoring</strong>, <strong>OIDC / AD Identity</strong>, <strong>CAPI Lifecycle</strong>, and <strong>Air-Gapped Registry Operations</strong> with Gemini 3.1 Flash TTS.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 self-start sm:self-auto flex-wrap">
                {!adminTabStore.isTabHidden('practice-mode') && (
                  <button
                    onClick={() => setActiveTab('practice-mode')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>Pre-Exam Sim (7.5)</span>
                  </button>
                )}

                {!adminTabStore.isTabHidden('add-question') && (isAdmin || adminTabStore.isTabEnabled('add-question')) && (
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setActiveTab('add-question');
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 border border-emerald-400/40"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Question &amp; Image</span>
                  </button>
                )}

                {!adminTabStore.isTabHidden('series-manager') && (
                  <button
                    onClick={() => setActiveTab('series-manager')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                    title="Rearrange Question Sequence"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    <span>Arranging Series</span>
                  </button>
                )}

                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Open Admin Tab Access and Exam Lockdown Controls"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Admin Lock</span>
                </button>
              </div>
            </div>

            <AskAIAssistant />
          </div>
        )}

        {/* Tab 6: Windows Local Setup Guide */}
        {activeTab === 'local-setup' && (
          <div className="space-y-6">
            <LocalSetupGuide />
          </div>
        )}
        </BlurLockContainer>
        )}
      </main>

      {/* Admin Tab Access and Exam Lockdown Controls Modal */}
      <AdminTabProtectionModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onEnforceActiveTab={(validTab) => setActiveTab(validTab)}
      />

      {/* Mobile Question Quick Drawer for Fast Jump */}
      <MobileQuestionQuickDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        questions={allQuestions}
        currentIndex={questionIndex}
        userAnswers={userAnswers}
        onSelectQuestion={(idx) => {
          setQuestionIndex(idx);
          setIsMobileDrawerOpen(false);
        }}
      />

      {/* Floating / Sticky TTS Player Bar */}
      <AudioPlayerBar />
    </div>
  );
}
