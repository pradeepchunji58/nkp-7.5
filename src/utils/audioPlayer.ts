// Audio Player Manager with Gemini 3.1 Flash TTS & Web Speech Fallback Engine

export interface AudioPlayState {
  isPlaying: boolean;
  isLoading: boolean;
  currentTextId: string | null;
  currentTitle: string;
  duration: number;
  currentTime: number;
  playbackRate: number;
  error: string | null;
  notice: string | null;
  voice: string;
  engine: 'gemini' | 'browser';
  isFallback: boolean;
  isCached?: boolean;
}

type AudioListener = (state: AudioPlayState) => void;

class AudioService {
  private audioElement: HTMLAudioElement | null = null;
  private webSpeechUtterance: SpeechSynthesisUtterance | null = null;
  private progressInterval: any = null;
  private speechStartTime: number = 0;
  private speechEstimatedDuration: number = 0;
  private ttsCooldownUntil: number = 0;

  private audioCache = new Map<string, string>(); // key: `${voice}:${text}` -> blobUrl
  private listeners: Set<AudioListener> = new Set();

  private state: AudioPlayState = {
    isPlaying: false,
    isLoading: false,
    currentTextId: null,
    currentTitle: '',
    duration: 0,
    currentTime: 0,
    playbackRate: 1.0,
    error: null,
    notice: null,
    voice: 'Kore',
    engine: 'gemini',
    isFallback: false,
  };

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.state }));
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioPlayState {
    return { ...this.state };
  }

  public setVoice(voice: string) {
    this.state.voice = voice;
    this.notify();
  }

  public setPlaybackRate(rate: number) {
    this.state.playbackRate = rate;
    if (this.audioElement) {
      this.audioElement.playbackRate = rate;
    }
    if (this.state.engine === 'browser' && this.state.isPlaying) {
      // Re-trigger current utterance with new rate if using browser speech
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }
    this.notify();
  }

  // Clean Markdown and formatting tags for smooth, natural speech
  private sanitizeForSpeech(text: string): string {
    return text
      .replace(/[*_~`#]/g, '') // remove markdown symbols
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url) -> link
      .replace(/https?:\/\/\S+/g, '') // remove raw URLs
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Fallback to browser Web Speech API (window.speechSynthesis)
  private speakWithWebSpeech(
    rawText: string,
    title: string,
    textId: string,
    voiceName: string,
    noticeMessage?: string
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.state.isLoading = false;
      this.state.isPlaying = false;
      this.state.error = 'Speech synthesis is not supported in this browser.';
      this.notify();
      return;
    }

    this.stopAudioOnly();

    const cleanedText = this.sanitizeForSpeech(rawText);
    const wordCount = cleanedText.split(/\s+/).filter(Boolean).length;
    // Average speech rate is ~140 words per minute at 1.0x
    const estDuration = Math.max(3, Math.round((wordCount / (140 * this.state.playbackRate)) * 60));

    this.speechEstimatedDuration = estDuration;
    this.speechStartTime = Date.now();

    window.speechSynthesis.cancel(); // cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    this.webSpeechUtterance = utterance;

    // Try to pick an English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
    if (englishVoices.length > 0) {
      // Optionally match female/male style based on Gemini voice name
      const preferFemale = ['Kore', 'Zephyr'].includes(voiceName);
      const chosen = englishVoices.find((v) =>
        preferFemale
          ? /female|samantha|zira|victoria|google us english/i.test(v.name)
          : /male|david|george|alex|daniel/i.test(v.name)
      ) || englishVoices[0];
      utterance.voice = chosen;
    }

    utterance.rate = this.state.playbackRate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.state.isLoading = false;
      this.state.isPlaying = true;
      this.state.engine = 'browser';
      this.state.isFallback = true;
      this.state.error = null;
      this.state.notice =
        noticeMessage || 'Streaming via browser speech engine (Gemini TTS quota cooldown active).';
      this.state.duration = estDuration;
      this.state.currentTime = 0;
      this.notify();

      // Start timer tracking for slider & countdown
      if (this.progressInterval) clearInterval(this.progressInterval);
      this.progressInterval = setInterval(() => {
        if (!this.state.isPlaying || this.state.engine !== 'browser') {
          clearInterval(this.progressInterval);
          return;
        }
        const elapsed = (Date.now() - this.speechStartTime) / 1000;
        this.state.currentTime = Math.min(this.state.duration, Math.round(elapsed));
        this.notify();
      }, 500);
    };

    utterance.onend = () => {
      this.state.isPlaying = false;
      this.state.currentTime = 0;
      if (this.progressInterval) clearInterval(this.progressInterval);
      this.notify();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.state.isPlaying = false;
      this.state.isLoading = false;
      if (this.progressInterval) clearInterval(this.progressInterval);
      this.notify();
    };

    window.speechSynthesis.speak(utterance);
  }

  private stopAudioOnly() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
  }

  public async speakText(textId: string, title: string, text: string, voiceOverride?: string) {
    const voice = voiceOverride || this.state.voice;

    // Toggle pause/resume if clicking the same item while active
    if (this.state.currentTextId === textId && this.state.isPlaying) {
      this.togglePlayPause();
      return;
    }

    if (
      this.state.currentTextId === textId &&
      !this.state.isPlaying &&
      (this.audioElement || this.state.engine === 'browser') &&
      this.state.currentTime > 0
    ) {
      this.togglePlayPause();
      return;
    }

    // Stop current speech
    this.stop();

    this.state.isLoading = true;
    this.state.currentTextId = textId;
    this.state.currentTitle = title;
    this.state.error = null;
    this.state.notice = null;
    this.notify();

    const cacheKey = `${voice}:${text.trim()}`;
    let audioUrl = this.audioCache.get(cacheKey);

    // If in rate-limit cooldown and not in local cache, seamlessly use browser speech
    const isUnderCooldown = Date.now() < this.ttsCooldownUntil;
    if (!audioUrl && isUnderCooldown) {
      const remainingSecs = Math.ceil((this.ttsCooldownUntil - Date.now()) / 1000);
      this.speakWithWebSpeech(
        text,
        title,
        textId,
        voice,
        `Playing via local voice engine (Gemini quota cooldown: ${remainingSecs}s remaining).`
      );
      return;
    }

    try {
      if (!audioUrl) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice }),
        });

        if (res.status === 429) {
          // Gemini TTS rate limit (3 RPM) hit
          const errData = await res.json().catch(() => ({}));
          this.ttsCooldownUntil = Date.now() + (errData.retryAfter || 15) * 1000;
          console.warn('Gemini TTS rate limit received. Automatically playing via browser Web Speech.');
          this.speakWithWebSpeech(
            text,
            title,
            textId,
            voice,
            'Gemini TTS free-tier quota reached (3 req/min) — streaming via browser voice engine.'
          );
          return;
        }

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with HTTP ${res.status}`);
        }

        const data = await res.json();
        if (!data.audio) {
          throw new Error('Invalid audio data received from Gemini TTS.');
        }

        // Convert base64 to Blob URL
        const binary = atob(data.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
        audioUrl = URL.createObjectURL(blob);
        this.audioCache.set(cacheKey, audioUrl);
        this.state.isCached = data.cached || false;
      } else {
        this.state.isCached = true;
      }

      // Initialize HTML5 Audio Element for Gemini audio
      const audio = new Audio(audioUrl);
      this.audioElement = audio;
      audio.playbackRate = this.state.playbackRate;

      audio.onloadedmetadata = () => {
        this.state.duration = audio.duration || 0;
        this.notify();
      };

      audio.ontimeupdate = () => {
        this.state.currentTime = audio.currentTime || 0;
        this.notify();
      };

      audio.onended = () => {
        this.state.isPlaying = false;
        this.state.currentTime = 0;
        this.notify();
      };

      audio.onerror = (e) => {
        console.error('Audio playback error', e);
        // Fall back to Web Speech if audio format or blob playback fails
        this.speakWithWebSpeech(text, title, textId, voice);
      };

      await audio.play();
      this.state.isLoading = false;
      this.state.isPlaying = true;
      this.state.engine = 'gemini';
      this.state.isFallback = false;
      this.state.error = null;
      this.state.notice = this.state.isCached ? 'Gemini 3.1 Flash TTS (Instant Cached)' : null;
      this.notify();
    } catch (err: any) {
      console.warn('TTS request error, falling back to Web Speech:', err);
      // Seamlessly fall back to browser Web Speech API
      this.ttsCooldownUntil = Date.now() + 15000;
      this.speakWithWebSpeech(
        text,
        title,
        textId,
        voice,
        'Streaming via browser voice engine (Gemini TTS fallback).'
      );
    }
  }

  public togglePlayPause() {
    if (this.state.engine === 'browser') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            this.state.isPlaying = true;
            this.notify();
          } else {
            window.speechSynthesis.pause();
            this.state.isPlaying = false;
            this.notify();
          }
        }
      }
      return;
    }

    if (!this.audioElement) return;
    if (this.audioElement.paused) {
      this.audioElement
        .play()
        .then(() => {
          this.state.isPlaying = true;
          this.notify();
        })
        .catch((e) => {
          console.error('Error resuming audio:', e);
        });
    } else {
      this.audioElement.pause();
      this.state.isPlaying = false;
      this.notify();
    }
  }

  public seek(seconds: number) {
    if (this.state.engine === 'gemini' && this.audioElement) {
      this.audioElement.currentTime = seconds;
      this.state.currentTime = seconds;
      this.notify();
    }
  }

  public replay() {
    if (this.state.engine === 'gemini' && this.audioElement) {
      this.audioElement.currentTime = 0;
      this.audioElement.play();
      this.state.isPlaying = true;
      this.notify();
    } else if (this.state.engine === 'browser') {
      // Re-invoke last text
      if (this.webSpeechUtterance) {
        window.speechSynthesis.cancel();
        this.speechStartTime = Date.now();
        window.speechSynthesis.speak(this.webSpeechUtterance);
        this.state.isPlaying = true;
        this.state.currentTime = 0;
        this.notify();
      }
    }
  }

  public stop() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.webSpeechUtterance = null;
    this.state.isPlaying = false;
    this.state.isLoading = false;
    this.state.currentTime = 0;
    this.state.duration = 0;
    this.state.notice = null;
    this.notify();
  }
}

export const audioService = new AudioService();
