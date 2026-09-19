import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Volume2,
  Sparkles,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Check,
  ShieldCheck,
  Server,
  Database,
  Cpu,
  Archive,
  Layers,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertTriangle,
  Edit3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Question, OptionKey, QuestionImageAttachment } from '../types';
import { audioService } from '../utils/audioPlayer';
import { imageService } from '../utils/imageService';
import { AVAILABLE_VOICES } from '../data/nkpQuestions';
import { FormattedText } from './FormattedText';

interface QuestionCardProps {
  question: Question;
  selectedOption: OptionKey | null;
  onSelectOption: (key: OptionKey) => void;
  isSubmitted: boolean;
  onSubmit: () => void;
  onReset: () => void;
  onOpenAdmin?: (questionId: string) => void;
  onRevealCorrectAnswer?: () => void;
  onDeleteQuestion?: (questionId: string) => void;
  onEditQuestion?: (question: Question) => void;
  onNextQuestion?: () => void;
  onPrevQuestion?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  questionIndex?: number;
  totalQuestions?: number;
  onOpenQuestionList?: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  isSubmitted,
  onSubmit,
  onReset,
  onOpenAdmin,
  onRevealCorrectAnswer,
  onDeleteQuestion,
  onEditQuestion,
  onNextQuestion,
  onPrevQuestion,
  hasPrev = false,
  hasNext = false,
  questionIndex,
  totalQuestions,
  onOpenQuestionList,
}) => {
  const [activeVoice, setActiveVoice] = useState<'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr'>('Kore');
  const [isPlayingQuestion, setIsPlayingQuestion] = useState(false);
  const [images, setImages] = useState<QuestionImageAttachment[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const unsub = audioService.subscribe((state) => {
      setIsPlayingQuestion(state.isPlaying);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    // Load images for this question
    const loadImages = () => {
      const qImages = imageService.getImagesForQuestion(question.id);
      setImages(qImages);
    };

    loadImages();
    const unsub = imageService.subscribe(loadImages);
    return () => unsub();
  }, [question.id]);

  const handleListenQuestion = async () => {
    if (isPlayingQuestion) {
      audioService.stop();
      return;
    }

    const narrationScript = `
      Nutanix Kubernetes Platform exam question.
      Scenario: ${question.scenario}
      Question prompt: ${question.prompt}
      Option A: ${question.options.find((o) => o.id === 'a')?.text || ''}.
      Option B: ${question.options.find((o) => o.id === 'b')?.text || ''}.
      Option C: ${question.options.find((o) => o.id === 'c')?.text || ''}.
      Option D: ${question.options.find((o) => o.id === 'd')?.text || ''}.
    `;

    try {
      await audioService.speakText(
        `question-${question.id}`,
        `Question ${question.title}`,
        narrationScript,
        activeVoice
      );
    } catch (e) {
      console.error('Failed to read question aloud:', e);
    }
  };

  const getOptionIcon = (id: string) => {
    switch (id) {
      case 'a':
        return <Server className="w-3.5 h-3.5 text-slate-500" />;
      case 'b':
        return <Database className="w-3.5 h-3.5 text-slate-500" />;
      case 'c':
        return <Cpu className="w-3.5 h-3.5 text-slate-500" />;
      case 'd':
        return <Archive className="w-3.5 h-3.5 text-slate-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div
      id="main-question-card"
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <ShieldCheck className="w-3.5 h-3.5" />
              {question.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {question.id.toUpperCase()}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">{question.title}</h2>
        </div>

        {/* Action Buttons: TTS, Edit, Delete */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <select
            id="select-voice-question"
            value={activeVoice}
            onChange={(e) => {
              const v = e.target.value as any;
              setActiveVoice(v);
              audioService.setVoice(v);
            }}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-2 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            title="TTS Voice Profile"
          >
            {AVAILABLE_VOICES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.tone.split(' ')[0]})
              </option>
            ))}
          </select>

          <button
            id="btn-listen-question"
            onClick={handleListenQuestion}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all ${
              isPlayingQuestion
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
            }`}
            title="Listen to question and options via Gemini 3.1 Flash TTS"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingQuestion ? 'animate-pulse' : ''}`} />
            <span>{isPlayingQuestion ? 'Reading Aloud...' : 'Read Aloud (TTS)'}</span>
            <Sparkles className="w-3 h-3 text-emerald-200" />
          </button>

          {/* Edit Question Action Button */}
          {onEditQuestion && (
            <button
              id="btn-edit-question-header"
              onClick={() => onEditQuestion(question)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50 transition-colors"
              title="Edit and update this question"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}

          {onDeleteQuestion && (
            <button
              id="btn-delete-question-header"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 hover:border-red-500/50 transition-colors"
              title="Delete this question"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Delete Question Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Question?</h3>
                <p className="text-xs text-slate-500 font-mono">ID: {question.id}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1.5">
              <p className="font-semibold text-slate-900 line-clamp-1">{question.title}</p>
              <p className="text-slate-500 line-clamp-2">{question.prompt}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to permanently delete this question? It will be removed from your active exam pool, practice simulation, and associated screenshots.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  if (onDeleteQuestion) {
                    onDeleteQuestion(question.id);
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Delete Question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scenario & Question Prompt */}
      <div className="p-5 sm:p-7 space-y-6">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm leading-relaxed">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5 flex-1 min-w-0">
              <HelpCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="w-full">
                <p className="font-semibold text-slate-900 mb-1">Deployment Scenario:</p>
                <div className="text-slate-800">
                  <FormattedText text={question.scenario} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {onEditQuestion && (
                <button
                  onClick={() => onEditQuestion(question)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                  title="Edit question text, options and explanation"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Edit</span>
                </button>
              )}
              {onOpenAdmin && (
                <button
                  onClick={() => onOpenAdmin(question.id)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors"
                  title="Add or manage screenshots for this question"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Add Screenshot</span>
                </button>
              )}
              {onDeleteQuestion && (
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors"
                  title="Delete this question"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Attached Reference Screenshots Gallery - FIT TO SHOW (Direct Full Width / Actual Ratio, No Zoom Modal) */}
        {images.length > 0 && (
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Question Reference Screenshots &amp; Exhibit Topology ({images.length})
                </h4>
              </div>

              {onOpenAdmin && (
                <button
                  onClick={() => onOpenAdmin(question.id)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1"
                >
                  <span>Manage Images</span>
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col"
                >
                  {/* Fit to show: image is displayed directly with clean padding and natural containment */}
                  <div className="w-full bg-slate-950 flex items-center justify-center p-2 sm:p-4">
                    <img
                      src={img.imageUrl}
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

        <div>
          <div className="text-lg font-bold text-slate-900 mb-4">
            <FormattedText text={question.prompt} />
          </div>

          {/* Multiple Choice Options List */}
          <div className="space-y-3" role="radiogroup" aria-label="Multiple Choice Options">
            {question.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isOptionCorrect = option.id === question.correctOptionId;

              let containerStyles =
                'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80 text-slate-800';
              let badgeStyles = 'bg-slate-100 text-slate-700 border-slate-300';

              if (isSelected && !isSubmitted) {
                containerStyles =
                  'border-emerald-600 bg-emerald-50/40 text-emerald-950 ring-2 ring-emerald-500/30';
                badgeStyles = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSubmitted) {
                if (isOptionCorrect) {
                  containerStyles =
                    'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/40';
                  badgeStyles = 'bg-emerald-600 text-white border-emerald-600';
                } else if (isSelected && !isOptionCorrect) {
                  containerStyles =
                    'border-red-400 bg-red-50/70 text-red-950 ring-2 ring-red-400/40';
                  badgeStyles = 'bg-red-600 text-white border-red-600';
                } else {
                  containerStyles = 'border-slate-200 bg-slate-50/60 opacity-60 text-slate-600';
                }
              }

              return (
                <div
                  key={option.id}
                  id={`option-container-${option.id}`}
                  onClick={() => !isSubmitted && onSelectOption(option.id)}
                  className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 min-h-[56px] select-none active:scale-[0.99] touch-manipulation ${containerStyles}`}
                >
                  {/* Option Letter Tag */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs uppercase flex-shrink-0 border shadow-xs ${badgeStyles}`}
                  >
                    {isSubmitted && isOptionCorrect ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : isSubmitted && isSelected && !isOptionCorrect ? (
                      <XCircle className="w-4 h-4" />
                    ) : (
                      option.id
                    )}
                  </div>

                  {/* Option Text & Description */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-0.5">
                      <span className="p-1 rounded bg-slate-100/80 mt-0.5 flex-shrink-0">{getOptionIcon(option.id)}</span>
                      <div className="font-semibold text-sm sm:text-base leading-snug w-full">
                        <FormattedText text={option.text} />
                      </div>
                    </div>

                    {/* Explanatory feedback when submitted */}
                    {isSubmitted && (
                      <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 text-xs leading-relaxed">
                        {isOptionCorrect ? (
                          <div className="flex items-start gap-1.5 text-emerald-800 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <div className="w-full">
                              <FormattedText text={option.explanation} />
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-1.5 text-slate-600">
                            <span className="font-semibold text-slate-800 flex-shrink-0">
                              Distractor Analysis:
                            </span>
                            <div className="w-full">
                              <FormattedText text={option.explanation} />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {isSubmitted ? (
              <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Review submitted. See detailed architectural analysis below.
              </span>
            ) : (
              <span>Select an option (a, b, c, or d) and check your answer.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
            {isSubmitted ? (
              <button
                id="btn-retry-question"
                onClick={onReset}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors w-full sm:w-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try Again
              </button>
            ) : (
              <>
                <button
                  id="btn-check-answer"
                  onClick={onSubmit}
                  disabled={!selectedOption}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all w-full sm:w-auto cursor-pointer"
                >
                  <span>Check Answer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onRevealCorrectAnswer && (
                  <button
                    id="btn-reveal-correct-answer-card"
                    type="button"
                    onClick={onRevealCorrectAnswer}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all w-full sm:w-auto cursor-pointer"
                    title="Reveal correct answer and fetch live online AI deep dive"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Reveal Answer &amp; Deep Dive</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Highlight Result Callout when submitted */}
        {isSubmitted && (
          <div
            id="result-banner"
            className={`p-4 rounded-xl border ${
              selectedOption === question.correctOptionId
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {selectedOption === question.correctOptionId ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="w-full">
                <h4 className="font-bold text-sm">
                  {selectedOption === question.correctOptionId
                    ? 'Excellent! You selected the correct answer.'
                    : `Correct Answer: Option (${question.correctOptionId.toUpperCase()}) — ${
                        question.options.find((o) => o.id === question.correctOptionId)?.text
                      }`}
                </h4>
                <div className="text-xs mt-1 leading-relaxed opacity-90">
                  <FormattedText text={question.keyTakeaway} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Portrait Thumb-Friendly Bottom Bar (Sticky at bottom on mobile/tablet view) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2.5 shadow-2xl flex items-center justify-between gap-2">
        {onPrevQuestion && (
          <button
            type="button"
            onClick={onPrevQuestion}
            disabled={!hasPrev}
            className="h-11 px-3 rounded-xl border border-slate-300 text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-xs active:scale-95 transition-all"
            title="Previous Question"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5" />
            <span>Prev</span>
          </button>
        )}

        {onOpenQuestionList && questionIndex !== undefined && totalQuestions !== undefined && (
          <button
            type="button"
            onClick={onOpenQuestionList}
            className="h-11 px-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 font-extrabold text-xs flex items-center justify-center gap-1 font-mono active:scale-95 transition-all"
            title="Open Question Drawer"
          >
            <span>Q{questionIndex + 1}/{totalQuestions}</span>
          </button>
        )}

        <div className="flex-1 flex items-center gap-1.5">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!selectedOption}
              className="h-11 flex-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shadow transition-all active:scale-95"
            >
              <span>Check Answer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex-1 flex items-center gap-1.5">
              <button
                type="button"
                onClick={onReset}
                className="h-11 px-3 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-semibold text-xs flex items-center justify-center gap-1 active:scale-95 transition-all"
                title="Try Again"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="sr-only sm:not-sr-only">Retry</span>
              </button>

              {hasNext && onNextQuestion ? (
                <button
                  type="button"
                  onClick={onNextQuestion}
                  className="h-11 flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow transition-all active:scale-95"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              ) : (
                <div className="flex-1 text-center text-xs font-bold text-emerald-800 bg-emerald-100/80 py-2.5 rounded-xl">
                  Completed
                </div>
              )}
            </div>
          )}
        </div>

        {onNextQuestion && (
          <button
            type="button"
            onClick={onNextQuestion}
            disabled={!hasNext}
            className="h-11 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center font-bold text-xs active:scale-95 transition-all"
            title="Next Question"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        )}
      </div>
    </div>
  );
};
