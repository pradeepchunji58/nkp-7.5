export type OptionKey = 'a' | 'b' | 'c' | 'd';

export interface QuestionOption {
  id: OptionKey;
  text: string;
  isCorrect: boolean;
  explanation: string;
  nutanixEquivalent?: string;
}

export interface NutanixComponentRef {
  name: string;
  role: string;
  comparison: string;
}

export interface QuestionImageAttachment {
  id: string;
  questionId: string;
  imageUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  fileName: string;
  fileSize?: number;
  uploadedAt: string;
}

export interface Question {
  id: string;
  badge: string;
  title: string;
  scenario: string;
  prompt: string;
  options: QuestionOption[];
  correctOptionId: OptionKey;
  keyTakeaway: string;
  deepExplanation: string;
  images?: QuestionImageAttachment[];
  distractorBreakdown?: {
    option: OptionKey;
    title: string;
    whyIncorrect: string;
    actualNutanixSolution: string;
  }[];
  nutanixComponents?: NutanixComponentRef[];
  cliSnippet?: {
    command: string;
    description: string;
  };
}

export interface VoiceOption {
  id: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  name: string;
  gender: 'Female' | 'Male' | 'Neutral';
  tone: string;
}

export interface TTSState {
  isLoading: boolean;
  isPlaying: boolean;
  activeTextId: string | null;
  activeTitle: string;
  selectedVoice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  playbackRate: number;
  duration: number;
  currentTime: number;
  error: string | null;
}

export interface PrerequisiteCheck {
  id: string;
  category: 'Hardware & OS' | 'Binaries & Tools' | 'Networking & Ports' | 'Security & Auth' | 'Air-Gapped';
  title: string;
  description: string;
  commandSnippet?: string;
  importance: 'Required' | 'Recommended';
}

export type TabKey =
  | 'exam-question'
  | 'series-manager'
  | 'add-question'
  | 'practice-mode'
  | 'prerequisites'
  | 'local-setup'
  | 'ask-ai';

export interface TabPermission {
  key: TabKey;
  label: string;
  enabled: boolean;
  hidden: boolean;
  description: string;
}
