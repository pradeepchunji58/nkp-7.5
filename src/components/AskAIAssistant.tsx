import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Volume2,
  HelpCircle,
  Terminal,
  Server,
  Database,
  ArrowRight
} from 'lucide-react';
import { audioService } from '../utils/audioPlayer';

export const AskAIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const suggestedPrompts = [
    'Why does the bastion host need Docker/containerd installed?',
    'What happens when NKP pivots control from the bastion to the management cluster?',
    'How does Nutanix CSI driver differ from the Bastion host storage role?',
    'What firewall ports must be open between Bastion and Nutanix Prism Central?',
  ];

  const handleAsk = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userPrompt,
          context:
            'Nutanix Kubernetes Platform (NKP) bastion host prerequisites, Kind bootstrap cluster lifecycle, CAPI orchestration, and Nutanix AHV infrastructure integration.',
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setAnswer(data.answer);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch AI answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleListenAnswer = () => {
    if (!answer) return;
    const cleanText = answer.replace(/[`*#_]/g, '');
    audioService.speakText('ai-response', 'AI Architectural Answer', cleanText);
    setIsPlayingAudio(true);
  };

  return (
    <div
      id="ask-ai-section"
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-5"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Ask NKP Architectural Assistant</h3>
            <p className="text-xs text-slate-500">
              Instant deep answers powered by Gemini 3.8 Flash & speech synthesis with Gemini 3.1 Flash TTS
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Suggested technical questions:
        </span>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(p);
                handleAsk(p);
              }}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-slate-700 transition-all text-left flex items-center gap-1.5"
            >
              <span>{p}</span>
              <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk(query);
        }}
        className="flex gap-2"
      >
        <input
          id="input-ai-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask any technical question about NKP, bastion hosts, or cluster architecture..."
          className="flex-1 rounded-xl border border-slate-300 px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 placeholder:text-slate-400 shadow-sm"
        />
        <button
          id="btn-submit-ai-query"
          type="submit"
          disabled={loading || !query.trim()}
          className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-40 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span>Ask AI</span>
              <Send className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          {error}
        </div>
      )}

      {/* AI Answer Card */}
      {answer && (
        <div
          id="ai-answer-card"
          className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Architecture Analysis
            </span>
            <button
              id="btn-listen-ai-answer"
              onClick={handleListenAnswer}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
              title="Listen to AI answer via Gemini 3.1 Flash TTS"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Listen with Gemini TTS</span>
            </button>
          </div>

          <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 whitespace-pre-line">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
};
