import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  X,
  ListFilter,
  Eye,
  Check,
  Award,
  Layers
} from 'lucide-react';
import { Question, OptionKey } from '../types';
import { FormattedText } from './FormattedText';

interface QuestionDirectoryLookupProps {
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, { selected: OptionKey | null; isSubmitted: boolean }>;
  onSelectQuestion: (index: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const QuestionDirectoryLookup: React.FC<QuestionDirectoryLookupProps> = ({
  questions,
  currentIndex,
  userAnswers,
  onSelectQuestion,
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'previous' | 'answered' | 'unanswered'>('previous');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Filter questions according to activeFilter & search query
  const filteredQuestions = useMemo(() => {
    return questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter((q) => {
      // Filter tab check
      if (activeFilter === 'previous' && q.originalIndex >= currentIndex) {
        return false;
      }
      if (activeFilter === 'answered' && !userAnswers[q.id]?.isSubmitted) {
        return false;
      }
      if (activeFilter === 'unanswered' && userAnswers[q.id]?.isSubmitted) {
        return false;
      }

      // Search check
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const matchTitle = q.title.toLowerCase().includes(term);
      const matchPrompt = q.prompt.toLowerCase().includes(term);
      const matchScenario = q.scenario.toLowerCase().includes(term);
      const matchBadge = q.badge.toLowerCase().includes(term);
      const matchOptions = q.options.some((opt) => opt.text.toLowerCase().includes(term));
      const matchIndex = `q${q.originalIndex + 1}`.includes(term);

      return matchTitle || matchPrompt || matchScenario || matchBadge || matchOptions || matchIndex;
    });
  }, [questions, currentIndex, userAnswers, activeFilter, searchTerm]);

  if (!isOpen) return null;

  const previousCount = currentIndex;
  const answeredCount = questions.filter((q) => userAnswers[q.id]?.isSubmitted).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="bg-white rounded-2xl border border-emerald-500/40 shadow-xl overflow-hidden animate-fade-in transition-all">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 sm:p-5 border-b border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Eye className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Question Directory &amp; Options Preview
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 font-mono">
              {filteredQuestions.length} Shown
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Browse previous questions (Q1 to Q{Math.max(1, currentIndex)}) and preview full scenarios, prompts, and all 4 options before jumping.
          </p>
        </div>

        <button
          onClick={onClose}
          className="self-end sm:self-auto p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          title="Close Preview Directory"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Control Toolbar: Filters & Search */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveFilter('previous')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'previous'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Previous Questions (Q1 - Q{previousCount})
          </button>

          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Questions ({questions.length})
          </button>

          <button
            onClick={() => setActiveFilter('answered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'answered'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Answered ({answeredCount})
          </button>

          <button
            onClick={() => setActiveFilter('unanswered')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'unanswered'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Unanswered ({unansweredCount})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Q#, titles, scenarios, or options..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
        </div>
      </div>

      {/* Questions & Options List View */}
      <div className="max-h-[600px] overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-slate-100">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No questions found</p>
            <p className="text-xs text-slate-500">
              {activeFilter === 'previous' && currentIndex === 0
                ? 'You are currently on Question 1, so there are no previous questions yet. Switch to "All Questions" to preview all 31+ questions and options.'
                : 'Try adjusting your search keywords or switching filter tabs.'}
            </p>
            {activeFilter === 'previous' && currentIndex === 0 && (
              <button
                onClick={() => setActiveFilter('all')}
                className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
              >
                Show All Questions &amp; Options
              </button>
            )}
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isCurrent = q.originalIndex === currentIndex;
            const answerState = userAnswers[q.id];
            const isAnswered = !!answerState?.isSubmitted;
            const isCorrect = isAnswered && answerState.selected === q.correctOptionId;
            const isExpanded = expandedQuestionId === q.id || filteredQuestions.length <= 3;

            return (
              <div
                key={q.id}
                className={`pt-4 first:pt-0 rounded-xl transition-all ${
                  isCurrent ? 'bg-emerald-50/40 p-4 border border-emerald-300' : ''
                }`}
              >
                {/* Question Header Card */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-extrabold text-xs font-mono">
                        Q{q.originalIndex + 1}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {q.badge}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                          Active Question
                        </span>
                      )}
                      {isAnswered && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {isCorrect ? 'Answered Correctly' : 'Answered Incorrectly'} (Option {answerState.selected?.toUpperCase()})
                        </span>
                      )}
                      {!isAnswered && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          Unanswered
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {q.title}
                    </h4>
                  </div>

                  {/* Actions: Jump or Toggle Options */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        onSelectQuestion(q.originalIndex);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <span>Open Question</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setExpandedQuestionId(expandedQuestionId === q.id ? null : q.id)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                      title={isExpanded ? 'Collapse Question & Options' : 'Expand Question & Options'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Question Scenario & Prompt Preview */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-800 space-y-2 mb-3">
                  <div className="text-slate-700">
                    <strong className="text-slate-900 block mb-0.5">Deployment Scenario:</strong>
                    <FormattedText content={q.scenario} />
                  </div>
                  <div className="pt-2 border-t border-slate-200/70 font-semibold text-slate-900">
                    <strong className="text-emerald-700 block mb-0.5">Question Prompt:</strong>
                    <FormattedText content={q.prompt} />
                  </div>
                </div>

                {/* THE 4 OPTIONS PREVIEW - FULLY VIEWABLE */}
                {isExpanded && (
                  <div className="space-y-2 pl-1 sm:pl-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <ListFilter className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Available Options (A, B, C, D):</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {q.options.map((opt) => {
                        const isUserChoice = answerState?.selected === opt.id;
                        const isCorrectOption = opt.id === q.correctOptionId;

                        let optClasses = 'border-slate-200 bg-white text-slate-800';
                        if (isAnswered) {
                          if (isCorrectOption) {
                            optClasses = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 ring-1 ring-emerald-500';
                          } else if (isUserChoice && !isCorrectOption) {
                            optClasses = 'border-rose-400 bg-rose-50/80 text-rose-950 ring-1 ring-rose-400';
                          }
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-xl border text-xs leading-relaxed transition-all flex flex-col justify-between gap-1.5 ${optClasses}`}
                          >
                            <div className="flex items-start gap-2">
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5 ${
                                  isAnswered && isCorrectOption
                                    ? 'bg-emerald-600 text-white'
                                    : isAnswered && isUserChoice && !isCorrectOption
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                                }`}
                              >
                                {opt.id}
                              </span>
                              <div className="flex-1 min-w-0">
                                <FormattedText content={opt.text} />
                              </div>
                            </div>

                            {/* Status pill if answered */}
                            {isAnswered && isCorrectOption && (
                              <div className="text-[10px] font-bold text-emerald-700 pl-7 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Correct Solution
                              </div>
                            )}
                            {isAnswered && isUserChoice && !isCorrectOption && (
                              <div className="text-[10px] font-bold text-rose-700 pl-7 flex items-center gap-1">
                                <XCircle className="w-3 h-3" /> Your Selected Option
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 px-5">
        <span>Click <strong>Open Question</strong> on any question card to jump directly to it in the practice exam.</span>
        <button
          onClick={onClose}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
        >
          Close Panel
        </button>
      </div>
    </div>
  );
};
