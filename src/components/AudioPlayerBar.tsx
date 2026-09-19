import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, AlertCircle, Loader2, Gauge } from 'lucide-react';
import { audioService, AudioPlayState } from '../utils/audioPlayer';
import { AVAILABLE_VOICES } from '../data/nkpQuestions';

export const AudioPlayerBar: React.FC = () => {
  const [state, setState] = useState<AudioPlayState>(audioService.getState());
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = audioService.subscribe(setState);
    return unsubscribe;
  }, []);

  if (!state.currentTextId && !state.isLoading && !state.error) {
    return null;
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div
      id="audio-player-bar"
      className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-700/80 text-white shadow-2xl px-4 py-3 sm:px-6"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Track Information & AI model badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
          <div className="relative flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            {state.isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            ) : state.isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-3" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-4 delay-100" />
                <span className="w-1 bg-emerald-400 rounded-full animate-bounce h-2 delay-200" />
              </div>
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {state.engine === 'gemini' ? (
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Gemini 3.1 Flash TTS
                  {state.isCached && (
                    <span className="text-[10px] lowercase font-normal px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
                      cached
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  Browser Voice Engine
                  <span className="text-[10px] lowercase font-normal px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">
                    fallback active
                  </span>
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                Voice: {state.voice}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-100 truncate">
              {state.currentTitle || 'Nutanix NKP Voice Reader'}
            </p>
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center gap-1.5 w-full sm:max-w-md">
          <div className="flex items-center gap-3">
            <button
              id="btn-replay-audio"
              onClick={() => audioService.replay()}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Replay from start"
              disabled={state.isLoading}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-toggle-play-pause"
              onClick={() => audioService.togglePlayPause()}
              disabled={state.isLoading}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              title={state.isPlaying ? 'Pause' : 'Play'}
            >
              {state.isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : state.isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Speed control */}
            <div className="relative">
              <button
                id="btn-playback-rate"
                onClick={() => {
                  const rates = [1.0, 1.25, 1.5, 0.8];
                  const nextIdx = (rates.indexOf(state.playbackRate) + 1) % rates.length;
                  audioService.setPlaybackRate(rates[nextIdx]);
                }}
                className="px-2 py-1 rounded text-xs font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1"
                title="Change playback speed"
              >
                <Gauge className="w-3 h-3 text-slate-400" />
                {state.playbackRate}x
              </button>
            </div>
          </div>

          {/* Scrubber / Progress Bar */}
          <div className="w-full flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>{formatTime(state.currentTime)}</span>
            <input
              id="audio-progress-slider"
              type="range"
              min="0"
              max={state.duration || 100}
              value={state.currentTime || 0}
              onChange={(e) => audioService.seek(parseFloat(e.target.value))}
              className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
            />
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Right: Voice selector & Close */}
        <div className="flex items-center gap-2 relative w-full sm:w-auto justify-end">
          <div className="relative">
            <button
              id="btn-voice-selector"
              onClick={() => setShowVoiceMenu(!showVoiceMenu)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>Voice: <strong>{state.voice}</strong></span>
            </button>

            {showVoiceMenu && (
              <div
                id="voice-dropdown-menu"
                className="absolute right-0 bottom-full mb-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-xl p-2 z-50 text-xs"
              >
                <div className="px-2 py-1 text-slate-400 font-medium uppercase text-[10px] tracking-wider border-b border-slate-800 mb-1">
                  Select Gemini Voice
                </div>
                {AVAILABLE_VOICES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      audioService.setVoice(v.id);
                      setShowVoiceMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      state.voice === v.id
                        ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-slate-100">{v.name}</div>
                      <div className="text-[10px] text-slate-400">{v.tone}</div>
                    </div>
                    {state.voice === v.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            id="btn-stop-audio"
            onClick={() => audioService.stop()}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800"
            title="Dismiss player"
          >
            Dismiss
          </button>
        </div>
      </div>

      {state.notice && (
        <div className="max-w-6xl mx-auto mt-2 text-[11px] text-cyan-300 flex items-center gap-1.5 bg-cyan-950/40 px-3 py-1 rounded-md border border-cyan-800/40">
          <Sparkles className="w-3 h-3 flex-shrink-0 text-cyan-400" />
          <span>{state.notice}</span>
        </div>
      )}

      {state.error && (
        <div className="max-w-6xl mx-auto mt-2 text-xs text-amber-300 flex items-center justify-between gap-2 bg-amber-950/40 px-3 py-1.5 rounded-md border border-amber-800/40">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-amber-400" />
            <span>{state.error}</span>
          </div>
          <button
            onClick={() => audioService.stop()}
            className="text-[10px] underline text-amber-300 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
