export interface Word {
  id: number;
  word_en: string;
  word_ja: string;
  sentence_en: string;
  sentence_ja: string;
  memo: string;
  dummy1: string;
  dummy2: string;
  dummy3: string;
}

export type LearningMode = 
  | 'word_all'
  | 'word_review'
  | 'phrase_all'
  | 'phrase_review'
  | 'test'
  | 'none';

export interface AppState {
  mode: LearningMode;
  rangeStart: number;
  rangeEnd: number;
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  sessionWords: Word[];
}

export interface StorageData {
  wordReviewIds: number[];
  phraseReviewIds: number[];
  testReviewIds: number[];
}
