import React, { useState, useEffect } from 'react';
import {
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flag,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Award,
  BookOpen,
  HelpCircle,
  ShieldCheck,
  Pause,
  Play,
  Check,
  Eye,
  FileText
} from 'lucide-react';
import { questionStore } from '../utils/questionStore';
import { imageService } from '../utils/imageService';
import { Question, OptionKey, QuestionImageAttachment } from '../types';
import { NutanixLogo } from './NutanixLogo';
import { FormattedText } from './FormattedText';
import { Image as ImageIcon } from 'lucide-react';

interface PreExamSimulatorProps {
  onExitSimulation?: () => void;
  onReviewInDrawer?: (questionId: string) => void;
}

export const PreExamSimulator: React.FC<PreExamSimulatorProps> = ({
  onExitSimulation,
  onReviewInDrawer,
}) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>(() => questionStore.getAllQuestions());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, OptionKey | null>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [secondsRemaining, setSecondsRemaining] = useState<number>(90 * 60); // 90 minutes
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isExamFinished, setIsExamFinished] = useState<boolean>(false);
  const [isReviewMode, setIsReviewMode] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'flagged' | 'unanswered'>('all');
  const [images, setImages] = useState<QuestionImageAttachment[]>([]);

  useEffect(() => {
    const unsub = questionStore.subscribe((questions) => {
      setAllQuestions(questions);
    });
    setAllQuestions(questionStore.getAllQuestions());
    return unsub;
  }, []);

  const currentQuestion: Question | undefined = allQuestions[currentIndex] || allQuestions[0];

  useEffect(() => {
    if (!currentQuestion) return;
    const loadImgs = () => {
      setImages(imageService.getImagesForQuestion(currentQuestion.id));
    };
    loadImgs();
    const unsub = imageService.subscribe(loadImgs);
    return () => unsub();
  }, [currentQuestion?.id]);

  // Countdown timer effect
  useEffect(() => {
    if (isExamFinished || isTimerPaused) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExamFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamFinished, isTimerPaused]);

  const totalQuestions = allQuestions.length;

  const handleSelectOption = (optionId: OptionKey) => {
    if (isExamFinished) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const toggleFlag = (questionId: string) => {
    const next = new Set(flaggedQuestions);
    if (next.has(questionId)) {
      next.delete(questionId);
    } else {
      next.add(questionId);
    }
    setFlaggedQuestions(next);
  };

  const handleRestart = () => {
    if (window.confirm('Restart the simulation? All answers will be reset.')) {
      setUserAnswers({});
      setFlaggedQuestions(new Set());
      setSecondsRemaining(90 * 60);
      setIsExamFinished(false);
      setCurrentIndex(0);
    }
  };

  // Format timer in minutes and seconds (e.g. 90:00 down to 00:00)
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Score calculations
  const answeredCount = Object.values(userAnswers).filter(Boolean).length;
  let correctCount = 0;
  allQuestions.forEach((q) => {
    if (userAnswers[q.id] === q.correctOptionId) {
      correctCount++;
    }
  });

  const percentScore = Math.round((correctCount / totalQuestions) * 100);
  const scaledScore = Math.round(1000 + (percentScore / 100) * 2000); // 1000 - 3000 scale
  const isPassed = scaledScore >= 2100 || percentScore >= 70; // Nutanix standard passing is ~70-75%

  // Filter questions for the bottom drawer
  const visibleIndices = allQuestions.map((_, idx) => idx).filter((idx) => {
    const q = allQuestions[idx];
    const isAnswered = !!userAnswers[q.id];
    const isFlagged = flaggedQuestions.has(q.id);

    if (filterMode === 'flagged') return isFlagged;
    if (filterMode === 'unanswered') return !isAnswered;
    return true;
  });

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Top Simulation Header & Live Status */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 rounded-2xl border border-slate-700 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
              <NutanixLogo className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">
                  Official Exam Simulation
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold border border-emerald-400/40">
                  NCP-CN 7.5 Version
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Nutanix Certified Professional - Cloud Native (NCP-CN 7.5) Pre-Exam Simulator
              </h2>
            </div>
          </div>

          {/* Exam Timer & Controls */}
          <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
            {!isExamFinished && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs font-mono font-bold">
                <Timer className="w-4 h-4 text-emerald-400" />
                <span className={secondsRemaining < 600 ? 'text-red-400 animate-pulse' : 'text-slate-200'}>
                  {formatTime(secondsRemaining)}
                </span>
                <button
                  onClick={() => setIsTimerPaused(!isTimerPaused)}
                  className="p-1 text-slate-400 hover:text-white"
                  title={isTimerPaused ? 'Resume Timer' : 'Pause Timer'}
                >
                  {isTimerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            <div className="text-xs text-slate-300 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 font-medium">
              {answeredCount}/{totalQuestions} Answered
            </div>

            {!isExamFinished ? (
              <button
                onClick={() => {
                  if (
                    answeredCount < totalQuestions &&
                    !window.confirm(
                      `You have answered ${answeredCount} of ${totalQuestions} questions. Are you sure you want to finish the exam now?`
                    )
                  ) {
                    return;
                  }
                  setIsExamFinished(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all active:scale-95"
              >
                Finish Exam
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Simulation</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* FINISHED EXAM SCORECARD & DETAILED REPORT */}
      {isExamFinished ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center ${
                isPassed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {isPassed ? <Award className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold font-mono uppercase bg-slate-100 text-slate-700">
              NCP-CN 7.5 Exam Results
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              {isPassed ? 'Congratulations! You Passed the NCP-CN 7.5 Simulator' : 'Review Recommended Before Official Testing'}
            </h2>

            <p className="text-xs text-slate-600">
              {isPassed
                ? 'Your knowledge of Bastion Host configuration, darksite image mirrors, CAPI lifecycle, and Nutanix AHV meets the criteria for NCP-CN 7.5 certification.'
                : 'Focus on strengthening Bastion prerequisites, air-gapped storage requirements, and CAPI bootstrap pivots.'}
            </p>
          </div>

          {/* Score Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold uppercase">Scaled Score</div>
              <div className={`text-3xl font-black mt-1 ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                {scaledScore}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Passing: 2100 / 3000</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold uppercase">Percentage</div>
              <div className={`text-3xl font-black mt-1 ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                {percentScore}%
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{correctCount} of {totalQuestions} Correct</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold uppercase">Outcome</div>
              <div className={`text-3xl font-black mt-1 ${isPassed ? 'text-emerald-600' : 'text-red-600'}`}>
                {isPassed ? 'PASS' : 'FAIL'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">NCP-CN 7.5 Standard</div>
            </div>
          </div>

          {/* Action to Review Questions */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setIsReviewMode(true);
                setIsExamFinished(false);
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Review Your Answers &amp; Explanations</span>
            </button>
            <button
              onClick={() => {
                setIsReviewMode(false);
                handleRestart();
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors cursor-pointer"
            >
              Start New Test
            </button>
          </div>
        </div>
      ) : (
        /* ACTIVE EXAM QUESTION INTERFACE */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          {/* Review Mode Banner */}
          {isReviewMode && (
            <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between gap-3 text-xs text-indigo-950">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="font-semibold">
                  Exam Review Mode — Reviewing verified answers, Nutanix explanations, and key takeaways.
                </span>
              </div>
              <button
                onClick={() => setIsExamFinished(true)}
                className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 font-bold text-indigo-700 hover:bg-indigo-100 transition-colors flex-shrink-0 cursor-pointer"
              >
                Back to Scorecard
              </button>
            </div>
          )}

          {/* Question Meta Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs font-mono text-slate-400">ID: {currentQuestion.id}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                {currentQuestion.badge}
              </span>
            </div>

            <button
              onClick={() => toggleFlag(currentQuestion.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                flaggedQuestions.has(currentQuestion.id)
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Flag
                className={`w-3.5 h-3.5 ${
                  flaggedQuestions.has(currentQuestion.id) ? 'fill-amber-500 text-amber-500' : ''
                }`}
              />
              <span>{flaggedQuestions.has(currentQuestion.id) ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>
          </div>

          {/* Scenario & Question Prompt */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">Scenario:</strong>
              <FormattedText content={currentQuestion.scenario} />
            </div>

            {/* Attached Reference Screenshots & Exhibit Gallery (Same as NKP Exam Questions) */}
            {images.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                    Question Reference Screenshots &amp; Exhibit Topology ({images.length})
                  </h4>
                </div>

                <div className="space-y-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col"
                    >
                      {/* Fit to show: natural containment with clean background padding */}
                      <div className="w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4">
                        <img
                          src={img.imageUrl || (img as any).dataUrl}
                          alt={img.caption || img.fileName}
                          className="w-auto max-w-full h-auto max-h-[500px] object-contain rounded-lg border border-slate-800 shadow-md"
                          loading="lazy"
                        />
                      </div>

                      {img.caption && (
                        <div className="px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                          <span className="font-medium">{img.caption}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{img.fileName}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm sm:text-base font-bold text-slate-900">
              <FormattedText content={currentQuestion.prompt} />
            </div>
          </div>

          {/* Options Radio List */}
          <div className="space-y-3 pt-2">
            {currentQuestion.options.map((option) => {
              const isSelected = userAnswers[currentQuestion.id] === option.id;
              const isCorrect = option.id === currentQuestion.correctOptionId;

              let cardClasses = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
              if (isReviewMode) {
                if (isCorrect) {
                  cardClasses = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500';
                } else if (isSelected && !isCorrect) {
                  cardClasses = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                }
              } else if (isSelected) {
                cardClasses = 'border-emerald-500 bg-emerald-50/70 text-slate-900 ring-1 ring-emerald-500/30';
              }

              return (
                <div
                  key={option.id}
                  onClick={() => {
                    if (!isReviewMode) {
                      handleSelectOption(option.id);
                    }
                  }}
                  className={`p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all flex flex-col gap-2 min-h-[50px] select-none active:scale-[0.99] touch-manipulation ${cardClasses} ${
                    !isReviewMode ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 flex-shrink-0 transition-colors ${
                        isReviewMode && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : isReviewMode && isSelected && !isCorrect
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'border border-slate-300 bg-white text-slate-600'
                      }`}
                    >
                      {option.id}
                    </div>

                    <div className="leading-relaxed flex-1">
                      <FormattedText content={option.text} />
                    </div>

                    {isReviewMode && isCorrect && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 flex items-center gap-1 flex-shrink-0">
                        <Check className="w-3 h-3" /> Correct Answer
                      </span>
                    )}
                    {isReviewMode && isSelected && !isCorrect && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-200 text-rose-900 flex items-center gap-1 flex-shrink-0">
                        <XCircle className="w-3 h-3" /> Your Choice
                      </span>
                    )}
                  </div>

                  {/* Review Mode Explanation */}
                  {isReviewMode && option.explanation && (
                    <div className="mt-1 pt-2 border-t border-slate-200/80 text-slate-600 text-[11px] pl-8">
                      <span className="font-semibold text-slate-700">Rationale: </span>
                      <FormattedText content={option.explanation} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Review Mode Key Takeaway and Architecture Analysis */}
          {isReviewMode && (currentQuestion.keyTakeaway || currentQuestion.deepExplanation) && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              {currentQuestion.keyTakeaway && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-700" />
                    <span>Key Architecture Takeaway:</span>
                  </div>
                  <div className="text-amber-950">
                    <FormattedText content={currentQuestion.keyTakeaway} />
                  </div>
                </div>
              )}
              {currentQuestion.deepExplanation && (
                <div className="p-3.5 rounded-xl bg-slate-900 text-slate-100 text-xs border border-slate-800">
                  <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nutanix Deep Technical Analysis:</span>
                  </div>
                  <div className="text-slate-300">
                    <FormattedText content={currentQuestion.deepExplanation} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              {userAnswers[currentQuestion.id] ? 'Option selected' : 'Not answered yet'}
            </span>

            <button
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              disabled={currentIndex === totalQuestions - 1}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Question Tracker & Grid Navigator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Simulation Question Navigator ({totalQuestions} Questions)</span>
          </h4>

          {/* Filters */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterMode === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              onClick={() => setFilterMode('flagged')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                filterMode === 'flagged' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              <span>Flagged</span>
              <span className="text-[10px] px-1 rounded bg-amber-800/30">{flaggedQuestions.size}</span>
            </button>
            <button
              onClick={() => setFilterMode('unanswered')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterMode === 'unanswered' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Unanswered ({totalQuestions - answeredCount})
            </button>
          </div>
        </div>

        {/* Question Bubble Grid */}
        <div className="grid grid-cols-6 xs:grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-1.5 max-h-56 overflow-y-auto p-1">
          {visibleIndices.map((idx) => {
            const q = allQuestions[idx];
            const isAnswered = !!userAnswers[q.id];
            const isFlagged = flaggedQuestions.has(q.id);
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative min-h-[36px] py-1.5 px-1 rounded-lg text-xs font-bold transition-all flex items-center justify-center active:scale-95 ${
                  isCurrent
                    ? 'ring-2 ring-emerald-500 bg-emerald-600 text-white shadow-sm'
                    : isAnswered
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
                title={`Question ${idx + 1}: ${q.title}`}
              >
                {idx + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
