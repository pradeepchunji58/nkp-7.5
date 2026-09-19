import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Layers,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { Question, OptionKey } from '../types';

interface MobileQuestionQuickDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<string, { selected: OptionKey | null; isSubmitted: boolean }>;
  onSelectQuestion: (index: number) => void;
}

export const MobileQuestionQuickDrawer: React.FC<MobileQuestionQuickDrawerProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  userAnswers,
  onSelectQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unanswered' | 'answered' | 'incorrect'>('all');

  const filteredQuestions = useMemo(() => {
    return questions.map((q, idx) => ({ ...q, originalIndex: idx })).filter((q) => {
      const ans = userAnswers[q.id];
      const isAnswered = Boolean(ans?.isSubmitted);
      const isCorrect = isAnswered && ans?.selected === q.correctOptionId;
      const isIncorrect = isAnswered && ans?.selected !== q.correctOptionId;

      if (filterType === 'unanswered' && isAnswered) return false;
      if (filterType === 'answered' && !isAnswered) return false;
      if (filterType === 'incorrect' && !isIncorrect) return false;

      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      const qNum = `q${q.originalIndex + 1}`.includes(term) || `${q.originalIndex + 1}` === term;
      const titleMatch = q.title.toLowerCase().includes(term);
      const promptMatch = q.prompt.toLowerCase().includes(term);
      const badgeMatch = q.badge.toLowerCase().includes(term);
      return qNum || titleMatch || promptMatch || badgeMatch;
    });
  }, [questions, userAnswers, filterType, searchTerm]);

  if (!isOpen) return null;

  const totalQuestions = questions.length;
  const answeredCount = questions.filter((q) => userAnswers[q.id]?.isSubmitted).length;
  const correctCount = questions.filter(
    (q) => userAnswers[q.id]?.isSubmitted && userAnswers[q.id]?.selected === q.correctOptionId
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center items-center bg-slate-950/75 backdrop-blur-sm animate-fade-in p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator & Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex-shrink-0">
          <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-3 sm:hidden" />
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Select Question</h3>
                <p className="text-[11px] text-slate-300 font-mono">
                  {answeredCount} of {totalQuestions} answered • {correctCount} correct
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative mt-3">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Q number (e.g. 103) or keyword..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                filterType === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All ({totalQuestions})
            </button>
            <button
              onClick={() => setFilterType('unanswered')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                filterType === 'unanswered'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Unanswered ({totalQuestions - answeredCount})
            </button>
            <button
              onClick={() => setFilterType('answered')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                filterType === 'answered'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Answered ({answeredCount})
            </button>
            <button
              onClick={() => setFilterType('incorrect')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 whitespace-nowrap ${
                filterType === 'incorrect'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Incorrect ({answeredCount - correctCount})
            </button>
          </div>
        </div>

        {/* Scrollable Questions Grid */}
        <div className="p-3 sm:p-5 overflow-y-auto flex-1 space-y-4">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider px-1">
            Tap any question number to jump directly ({filteredQuestions.length} available)
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {filteredQuestions.map((q) => {
              const ans = userAnswers[q.id];
              const isCurrent = q.originalIndex === currentIndex;
              const isAnswered = Boolean(ans?.isSubmitted);
              const isCorrect = isAnswered && ans?.selected === q.correctOptionId;
              const isIncorrect = isAnswered && ans?.selected !== q.correctOptionId;

              let tileStyle =
                'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';

              if (isCurrent) {
                tileStyle = 'ring-2 ring-emerald-500 ring-offset-2 font-black shadow-md ';
              }

              if (isCorrect) {
                tileStyle += ' bg-emerald-100 text-emerald-900 border-emerald-300';
              } else if (isIncorrect) {
                tileStyle += ' bg-amber-100 text-amber-900 border-amber-300';
              } else if (isCurrent) {
                tileStyle += ' bg-slate-900 text-white border-slate-900';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(q.originalIndex);
                    onClose();
                  }}
                  className={`h-12 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 cursor-pointer relative ${tileStyle}`}
                  title={`Question ${q.originalIndex + 1}: ${q.title}`}
                >
                  <span className="text-xs font-bold">{q.originalIndex + 1}</span>
                  {isCorrect && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5" />
                  )}
                  {isIncorrect && (
                    <XCircle className="w-3 h-3 text-amber-600 mt-0.5" />
                  )}
                  {!isAnswered && !isCurrent && (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1" />
                  )}
                  {isCurrent && !isCorrect && !isIncorrect && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="py-12 text-center text-slate-500 text-xs">
              No questions found matching your filter or search query.
            </div>
          )}
        </div>

        {/* Drawer Footer with Quick Close */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-shrink-0">
          <span>Current: <strong>Q{currentIndex + 1}</strong> of {totalQuestions}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
