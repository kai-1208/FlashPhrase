export interface Word {
  id: number;
  word_en: string;
  word_ja: string;
  sentence_en: string;
  sentence_ja: string;
  memo: string;
  answer_ja: string;
  dummy1: string;
  dummy2: string;
  dummy3: string;
}

export type LearningMode =
  | 'word_all'
  | 'word_review'
  | 'word_learned'
  | 'phrase_all'
  | 'phrase_review'
  | 'phrase_learned'
  | 'test_word'
  | 'test_word_review'
  | 'test_word_learned'
  | 'test_phrase'
  | 'test_phrase_review'
  | 'test_phrase_learned'
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
