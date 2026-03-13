const STORAGE_KEY_WORD_REVIEW = 'flashphrase_word_review';
const STORAGE_KEY_PHRASE_REVIEW = 'flashphrase_phrase_review';
const STORAGE_KEY_TEST_WORD_REVIEW = 'flashphrase_test_word_review';
const STORAGE_KEY_TEST_PHRASE_REVIEW = 'flashphrase_test_phrase_review';

const STORAGE_KEY_WORD_LEARNED = 'flashphrase_word_learned';
const STORAGE_KEY_PHRASE_LEARNED = 'flashphrase_phrase_learned';
const STORAGE_KEY_TEST_WORD_LEARNED = 'flashphrase_test_word_learned';
const STORAGE_KEY_TEST_PHRASE_LEARNED = 'flashphrase_test_phrase_learned';

export type StorageType = 'word' | 'phrase' | 'test_word' | 'test_phrase';

const getReviewKey = (type: StorageType) => {
  switch (type) {
    case 'word': return STORAGE_KEY_WORD_REVIEW;
    case 'phrase': return STORAGE_KEY_PHRASE_REVIEW;
    case 'test_word': return STORAGE_KEY_TEST_WORD_REVIEW;
    case 'test_phrase': return STORAGE_KEY_TEST_PHRASE_REVIEW;
  }
};

const getLearnedKey = (type: StorageType) => {
  switch (type) {
    case 'word': return STORAGE_KEY_WORD_LEARNED;
    case 'phrase': return STORAGE_KEY_PHRASE_LEARNED;
    case 'test_word': return STORAGE_KEY_TEST_WORD_LEARNED;
    case 'test_phrase': return STORAGE_KEY_TEST_PHRASE_LEARNED;
  }
};

export const getReviewList = (type: StorageType): number[] => {
  try {
    const data = localStorage.getItem(getReviewKey(type));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse from localStorage', error);
    return [];
  }
};

export const getLearnedList = (type: StorageType): number[] => {
  try {
    const data = localStorage.getItem(getLearnedKey(type));
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse from localStorage', error);
    return [];
  }
};

export const addReviewId = (type: StorageType, id: number): void => {
  try {
    const list = getReviewList(type);
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(getReviewKey(type), JSON.stringify(list));
    }
    // Remove from learned list if mistakenly added before
    removeLearnedId(type, id);
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};

export const addLearnedId = (type: StorageType, id: number): void => {
  try {
    const list = getLearnedList(type);
    if (!list.includes(id)) {
      list.push(id);
      localStorage.setItem(getLearnedKey(type), JSON.stringify(list));
    }
    // If it was in the review list, remove it
    removeReviewId(type, id);
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};

export const removeReviewId = (type: StorageType, id: number): void => {
  try {
    let list = getReviewList(type);
    list = list.filter((itemId) => itemId !== id);
    localStorage.setItem(getReviewKey(type), JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};

export const removeLearnedId = (type: StorageType, id: number): void => {
  try {
    let list = getLearnedList(type);
    list = list.filter((itemId) => itemId !== id);
    localStorage.setItem(getLearnedKey(type), JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};
