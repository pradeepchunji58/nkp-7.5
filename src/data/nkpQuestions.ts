import { Question, VoiceOption } from '../types';
import { questions1to40 } from './questions/questions1to40';
import { questions41to105 } from './questions/questions41to105';

export const AVAILABLE_VOICES: VoiceOption[] = [
  { id: 'Kore', name: 'Kore', gender: 'Female', tone: 'Clear, authoritative & articulate (Default)' },
  { id: 'Puck', name: 'Puck', gender: 'Male', tone: 'Energetic, crisp & engaging' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Male', tone: 'Deep, steady enterprise speaker' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'Female', tone: 'Warm, calm & natural' },
  { id: 'Charon', name: 'Charon', gender: 'Male', tone: 'Grounded, resonant & serious' },
];

export const NKP_QUESTIONS: Question[] = [
  ...questions1to40,
  ...questions41to105,
];


