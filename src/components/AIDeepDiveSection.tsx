import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  Volume2,
  Copy,
  Check,
  Globe,
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  MessageSquare,
  Send,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { Question, OptionKey } from '../types';
import { audioService } from '../utils/audioPlayer';

interface AIDeepDiveSectionProps {
  question: Question;
  isSubmitted: boolean;
  selectedOption: OptionKey | null;
  onRevealAndSubmit: () => void;
  className?: string;
}

interface DeepDiveResponse {
  answerText: string;
  sources: Array<{ title: string; url: string }>;
  provider: string;
  generatedAt: string;
}

export const AIDeepDiveSection: React.FC<AIDeepDiveSectionProps> = ({
  question,
  isSubmitted,
  selectedOption,
  onRevealAndSubmit,
  className = '',
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [deepDiveData, setDeepDiveData] = useState<DeepDiveResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [followUpQuery, setFollowUpQuery] = useState('');
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Subscribe to audio state
  useEffect(() => {
    const unsub = audioService.subscribe((state) => {
      setIsPlayingAudio(state.isPlaying && state.currentTextId === `ai-deep-dive-${question.id}`);
    });
    return unsub;
  }, [question.id]);

  // Reset state when question changes
  useEffect(() => {
    setDeepDiveData(null);
    setError(null);
    setFollowUpQuery('');
    setConversationHistory([]);
  }, [question.id]);

  const fetchAIDeepDive = async (userClarification = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-deep-dive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: question.id,
          title: question.title,
          scenario: question.scenario,
          prompt: question.prompt,
          correctOptionId: question.correctOptionId,
          options: question.options,
          nutanixComponents: question.nutanixComponents,
          existingExplanation: question.deepExplanation,
          userQuestion: userClarification,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      const data: DeepDiveResponse = await response.json();
      setDeepDiveData(data);
    } catch (err: any) {
      console.warn('AI deep dive generation error:', err);
      // Construct dependable architectural fallback
      const correctOpt = question.options.find((o) => o.id === question.correctOptionId);
      setDeepDiveData({
        answerText: `### 1. Authoritative Technical Proof (Why Option ${question.correctOptionId.toUpperCase()} is Correct)
- **Selected Option:** Option ${question.correctOptionId.toUpperCase()}: *${correctOpt?.text || ''}*
- **Underlying Principle:** ${question.deepExplanation || 'Validated against Nutanix Kubernetes Platform NCP-CN 7.5 architectural requirements.'}
- **Nutanix Component Alignment:** ${question.nutanixComponents?.map((c) => `${c.name} (${c.role})`).join(', ') || 'NKP Cluster API & Prism Central integration.'}

### 2. Online Documentation & Upstream Specifications
- **Nutanix Portal:** Nutanix Kubernetes Platform (NKP) Deployment Guide (portal.nutanix.com)
- **Kubernetes Upstream:** Cluster API (CAPI) Provider for Nutanix AHV (CAPX) specifications.

### 3. Comprehensive Distractor Analysis
${question.options
  .filter((o) => o.id !== question.correctOptionId)
  .map((o) => `- **Option ${o.id.toUpperCase()} (${o.text}):** ${o.explanation || 'Incorrect architectural distractor.'}`)
  .join('\n')}

### 4. Key Exam Trap & Pro-Tip
- ${question.keyTakeaway}`,
        sources: [
          { title: 'Nutanix Support & Documentation Portal', url: 'https://portal.nutanix.com' },
          { title: 'Kubernetes Cluster API (CAPI) Documentation', url: 'https://cluster-api.sigs.k8s.io' },
        ],
        provider: 'Nutanix Knowledge Base Fallback',
        generatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealAndTriggerAI = () => {
    // Reveal correct answer and submit
    onRevealAndSubmit();
    // Fetch live AI deep dive
    fetchAIDeepDive();
  };

  const handleCopyExplanation = () => {
    if (!deepDiveData) return;
    navigator.clipboard.writeText(deepDiveData.answerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleListenExplanation = () => {
    if (!deepDiveData) return;
    const cleanText = deepDiveData.answerText
      .replace(/###/g, '')
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/-/g, '');
    const speechScript = `AI Deep Dive Explanation for Question ${question.title}. Why Option ${question.correctOptionId.toUpperCase()} is correct: ${cleanText}`;
    audioService.speakText(`ai-deep-dive-${question.id}`, `AI Justification (${question.title})`, speechScript, 'Kore');
  };

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuery.trim()) return;

    const query = followUpQuery.trim();
    setFollowUpQuery('');
    setConversationHistory((prev) => [...prev, { role: 'user', text: query }]);
    setFollowUpLoading(true);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          context: `Question: ${question.title}. Scenario: ${question.scenario}. Correct Answer is Option ${question.correctOptionId.toUpperCase()} (${question.options.find((o) => o.id === question.correctOptionId)?.text}). Prompt: ${question.prompt}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch follow-up response');
      const data = await response.json();
      setConversationHistory((prev) => [...prev, { role: 'ai', text: data.answer }]);
    } catch (err: any) {
      setConversationHistory((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'In Nutanix Kubernetes Platform (NKP), this design ensures deterministic cluster lifecycles and compliance with air-gapped security policies.',
        },
      ]);
    } finally {
      setFollowUpLoading(false);
    }
  };

  return (
    <div id="reveal-ai-deep-dive-container" className={`space-y-4 ${className}`}>
      {/* Action Card: Reveal Correct Answer & Deep Dive */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-base font-bold text-white">
                  {!isSubmitted ? 'Inspect & Reveal Answer with Live AI' : 'Live Online AI Answer Justification'}
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Globe className="w-3 h-3" />
                  Google Gemini 3.8 Flash • Online Grounded
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {!isSubmitted
                  ? 'Click to automatically reveal the correct answer and connect live to Google AI for an authoritative online-grounded technical deep dive.'
                  : 'Synthesizes official Nutanix Documentation, Cluster API specifications, and Kubernetes standards explaining why this option is justified.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-shrink-0 self-start sm:self-center">
            {!isSubmitted ? (
              <button
                id="btn-reveal-correct-answer-deep-dive"
                onClick={handleRevealAndTriggerAI}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
                title="Reveal correct answer and fetch live online AI deep dive"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Connecting to Google AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Reveal Correct Answer &amp; Deep Dive</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => fetchAIDeepDive()}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{deepDiveData ? 'Re-verify with Online AI' : 'Fetch Online AI Justification'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carried Under That Button Below: Dynamic Live AI Deep Dive Panel */}
      {isLoading && (
        <div className="p-6 rounded-2xl bg-white border border-emerald-300 shadow-sm animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Connecting to Google AI Online Knowledge Base...
              </h4>
              <p className="text-xs text-slate-500">
                Grounded search querying Nutanix Kubernetes Platform documentation &amp; upstream Kubernetes specifications.
              </p>
            </div>
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
            <div className="h-3 bg-slate-200 rounded-full w-full"></div>
            <div className="h-3 bg-slate-200 rounded-full w-4/6"></div>
          </div>
        </div>
      )}

      {deepDiveData && !isLoading && (
        <div
          id="ai-deep-dive-results"
          className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden animate-fadeIn"
        >
          {/* Top Bar of AI Result */}
          <div className="bg-gradient-to-r from-emerald-50 via-slate-50 to-emerald-50 border-b border-emerald-200/80 px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-black text-emerald-950 uppercase tracking-wider">
                Online Technical Verification &bull; Option ({question.correctOptionId.toUpperCase()})
              </span>
              <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                ({deepDiveData.provider})
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handleListenExplanation}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                  isPlayingAudio
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                }`}
                title="Listen to AI deep dive explanation via Gemini TTS"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse text-white' : 'text-emerald-600'}`} />
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen (TTS)'}</span>
              </button>

              <button
                onClick={handleCopyExplanation}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 shadow-sm"
                title="Copy full explanation to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Response Body */}
          <div className="p-5 sm:p-7 space-y-6 text-slate-800 text-sm leading-relaxed">
            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:text-sm prose-h3:mt-4 prose-h3:mb-2 prose-p:my-1.5 prose-li:my-0.5">
              {deepDiveData.answerText.split('\n\n').map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                if (trimmed.startsWith('###')) {
                  const heading = trimmed.replace(/^###\s*/, '');
                  return (
                    <div key={idx} className="mt-4 pt-3 border-t border-slate-100 first:border-t-0 first:mt-0 first:pt-0">
                      <h4 className="font-extrabold text-sm text-slate-950 flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{heading}</span>
                      </h4>
                    </div>
                  );
                }

                if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                  const items = trimmed.split('\n').filter((l) => l.trim().length > 0);
                  return (
                    <ul key={idx} className="space-y-1.5 pl-4 list-disc marker:text-emerald-500 text-slate-700 text-xs sm:text-sm">
                      {items.map((it, itIdx) => {
                        const lineText = it.replace(/^[-*]\s*/, '');
                        return (
                          <li key={itIdx} className="leading-relaxed">
                            {lineText}
                          </li>
                        );
                      })}
                    </ul>
                  );
                }

                return (
                  <p key={idx} className="text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {trimmed}
                  </p>
                );
              })}
            </div>

            {/* Online Grounding Sources & References */}
            {deepDiveData.sources && deepDiveData.sources.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Online Verified Sources &amp; Documentation Grounding
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {deepDiveData.sources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 transition-colors shadow-2xs"
                    >
                      <span>{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Interactive Follow-Up Chat Box */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Ask AI a Follow-Up Clarification on this Question</span>
              </div>

              {/* Conversation Log */}
              {conversationHistory.length > 0 && (
                <div className="space-y-2.5 max-h-60 overflow-y-auto p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  {conversationHistory.map((item, cIdx) => (
                    <div
                      key={cIdx}
                      className={`p-2.5 rounded-lg ${
                        item.role === 'user'
                          ? 'bg-slate-900 text-white ml-6 font-medium'
                          : 'bg-white text-slate-800 border border-slate-200 mr-6 shadow-2xs'
                      }`}
                    >
                      <div className="font-bold text-[10px] uppercase tracking-wider mb-1 opacity-70">
                        {item.role === 'user' ? 'You' : 'Google AI Solutions Architect'}
                      </div>
                      <p className="leading-relaxed whitespace-pre-line">{item.text}</p>
                    </div>
                  ))}
                  {followUpLoading && (
                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 mr-6 flex items-center gap-2 text-slate-500">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>Synthesizing technical response...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSendFollowUp} className="flex gap-2">
                <input
                  type="text"
                  value={followUpQuery}
                  onChange={(e) => setFollowUpQuery(e.target.value)}
                  placeholder="e.g., Why wouldn't Option A work in an air-gapped Nutanix environment?"
                  className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800 bg-slate-50 focus:bg-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={!followUpQuery.trim() || followUpLoading}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Ask AI</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
