import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Shuffle,
  RotateCcw,
  Search,
  Check,
  CheckCircle2,
  AlertCircle,
  Edit3,
  HelpCircle,
  Hash,
  ChevronsUp
} from 'lucide-react';
import { Question } from '../types';
import { questionStore } from '../utils/questionStore';

interface SeriesManagerProps {
  questions: Question[];
  currentQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onEditQuestion?: (question: Question) => void;
}

export const SeriesManager: React.FC<SeriesManagerProps> = ({
  questions,
  currentQuestionIndex,
  onSelectQuestion,
  onEditQuestion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [targetPositions, setTargetPositions] = useState<{ [id: string]: string }>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (statusMessage) {
      const t = setTimeout(() => setStatusMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [statusMessage]);

  const handleMoveUp = async (index: number) => {
    if (index <= 0 || isProcessing) return;
    setIsProcessing(true);
    await questionStore.moveQuestion(index, index - 1);
    setStatusMessage(`Moved question to series position #${index}`);
    setIsProcessing(false);
  };

  const handleMoveDown = async (index: number) => {
    if (index >= questions.length - 1 || isProcessing) return;
    setIsProcessing(true);
    await questionStore.moveQuestion(index, index + 1);
    setStatusMessage(`Moved question to series position #${index + 2}`);
    setIsProcessing(false);
  };

  const handleMoveToTop = async (questionId: string) => {
    if (isProcessing) return;
    setIsProcessing(true);
    await questionStore.moveQuestionToTop(questionId);
    setStatusMessage(`Question moved to the very top (Series #1)!`);
    setIsProcessing(false);
  };

  const handleSwapToPosition = async (questionId: string, currentPositionOneBased: number) => {
    const rawVal = targetPositions[questionId];
    if (!rawVal) return;
    const target = parseInt(rawVal, 10);
    if (isNaN(target) || target < 1 || target > questions.length) {
      alert(`Please enter a valid series number between 1 and ${questions.length}.`);
      return;
    }
    if (target === currentPositionOneBased) return;

    setIsProcessing(true);
    await questionStore.moveQuestionToPosition(questionId, target);
    setStatusMessage(`Question #${currentPositionOneBased} re-sequenced to Series #${target}`);
    setTargetPositions((prev) => ({ ...prev, [questionId]: '' }));
    setIsProcessing(false);
  };

  const handleManualShuffle = async () => {
    const confirmShuffle = window.confirm(
      'Shuffle the question series sequence? The question numbers will automatically re-index from 1 to ' +
        questions.length +
        ' based on the shuffled order.'
    );
    if (!confirmShuffle) return;

    setIsProcessing(true);
    const order = questions.map((q) => q.id);
    // Fisher-Yates shuffle
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    await questionStore.setQuestionOrder(order);
    setStatusMessage(`All ${questions.length} questions have been shuffled! Numbers are updated in series order.`);
    setIsProcessing(false);
  };

  const handleResetOrder = async () => {
    const confirmReset = window.confirm('Reset series sequence back to default original order?');
    if (!confirmReset) return;

    setIsProcessing(true);
    await questionStore.resetQuestionOrder();
    setStatusMessage('Series order reset to original default blueprint sequence.');
    setIsProcessing(false);
  };

  const filteredQuestions = questions.filter((q, idx) => {
    const query = searchTerm.toLowerCase();
    const seriesNumber = (idx + 1).toString();
    return (
      seriesNumber === query ||
      q.title.toLowerCase().includes(query) ||
      q.prompt.toLowerCase().includes(query) ||
      q.badge.toLowerCase().includes(query) ||
      q.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-sm border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <ArrowUpDown className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Question Series Sequence &amp; Rearrangement
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Series Reordering &amp; Dynamic Sequence
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Swap or move questions across the series. Whenever you change the order (e.g. moving Question 31 to #2), 
            the question numbers automatically re-sequence in 1, 2, 3... series order.
          </p>
        </div>

        {/* Global actions: Shuffle and Reset */}
        <div className="flex items-center gap-2.5 flex-shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleManualShuffle}
            disabled={isProcessing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50"
            title="Randomly shuffle the question series pool"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Series</span>
          </button>

          <button
            type="button"
            onClick={handleResetOrder}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors disabled:opacity-50"
            title="Reset series back to original default sequence"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Order</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Search Filter and Stats Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by series #, title, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 w-full sm:w-auto justify-between sm:justify-end">
          <span>
            Total in Series: <strong className="text-slate-800">{questions.length} Questions</strong>
          </span>
          <span className="hidden sm:inline">•</span>
          <span>
            Active In Exam: <strong className="text-indigo-600">Q#{currentQuestionIndex + 1}</strong>
          </span>
        </div>
      </div>

      {/* Series Items List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No questions match your filter.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            // Find the true current 0-based index in the master questions array
            const trueIndex = questions.findIndex((item) => item.id === q.id);
            const seriesNumber = trueIndex + 1;
            const isCurrentActive = trueIndex === currentQuestionIndex;

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isCurrentActive ? 'bg-indigo-50/50' : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Left: Series Number Badge & Question Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Big Series Number */}
                  <div
                    className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center font-bold flex-shrink-0 border ${
                      isCurrentActive
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold leading-none opacity-75">Q#</span>
                    <span className="text-base leading-none mt-0.5">{seriesNumber}</span>
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {q.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {q.id}</span>
                      {isCurrentActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          Current in Exam
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug truncate">
                      {q.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 leading-relaxed">
                      {q.prompt}
                    </p>
                  </div>
                </div>

                {/* Right: Quick Positioning Controls (Swap, Move Up/Down, Top, Edit, Jump) */}
                <div className="flex items-center gap-2 flex-wrap self-end md:self-center flex-shrink-0">
                  {/* Swap To Position Input Form */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 px-1">Move to #</span>
                    <input
                      type="number"
                      min={1}
                      max={questions.length}
                      placeholder={`${seriesNumber}`}
                      value={targetPositions[q.id] || ''}
                      onChange={(e) =>
                        setTargetPositions({ ...targetPositions, [q.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSwapToPosition(q.id, seriesNumber);
                        }
                      }}
                      className="w-12 px-1.5 py-1 text-xs font-bold text-slate-900 bg-white rounded border border-slate-300 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSwapToPosition(q.id, seriesNumber)}
                      disabled={isProcessing}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition-colors disabled:opacity-50"
                      title="Move question directly to this series number"
                    >
                      Go
                    </button>
                  </div>

                  {/* Move Up Button */}
                  <button
                    type="button"
                    onClick={() => handleMoveUp(trueIndex)}
                    disabled={trueIndex === 0 || isProcessing}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors"
                    title="Move up one position in series"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Move Down Button */}
                  <button
                    type="button"
                    onClick={() => handleMoveDown(trueIndex)}
                    disabled={trueIndex === questions.length - 1 || isProcessing}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:hover:bg-slate-100 transition-colors"
                    title="Move down one position in series"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Move to Top */}
                  {trueIndex > 0 && (
                    <button
                      type="button"
                      onClick={() => handleMoveToTop(q.id)}
                      disabled={isProcessing}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Move this question to position #1 at the top of the series"
                    >
                      <ChevronsUp className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden sm:inline">Top (#1)</span>
                    </button>
                  )}

                  {/* Edit Question */}
                  {onEditQuestion && (
                    <button
                      type="button"
                      onClick={() => onEditQuestion(q)}
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Edit question prompt, options, bullets and explanations"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  )}

                  {/* Jump To / Select Question */}
                  <button
                    type="button"
                    onClick={() => onSelectQuestion(trueIndex)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isCurrentActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isCurrentActive ? 'Active' : 'Open in Exam'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
