const STORAGE_KEY_WORD_REVIEW = 'flashphrase_word_review';
const STORAGE_KEY_PHRASE_REVIEW = 'flashphrase_phrase_review';
const STORAGE_KEY_TEST_REVIEW = 'flashphrase_test_review';

const STORAGE_KEY_WORD_LEARNED = 'flashphrase_word_learned';
const STORAGE_KEY_PHRASE_LEARNED = 'flashphrase_phrase_learned';

export const getReviewList = (type: 'word' | 'phrase' | 'test'): number[] => {
  try {
    const key = type === 'word' ? STORAGE_KEY_WORD_REVIEW : 
                type === 'phrase' ? STORAGE_KEY_PHRASE_REVIEW : 
                STORAGE_KEY_TEST_REVIEW;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse from localStorage', error);
    return [];
  }
};

export const getLearnedList = (type: 'word' | 'phrase'): number[] => {
  try {
    const key = type === 'word' ? STORAGE_KEY_WORD_LEARNED : STORAGE_KEY_PHRASE_LEARNED;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to parse from localStorage', error);
    return [];
  }
};

export const addReviewId = (type: 'word' | 'phrase' | 'test', id: number): void => {
  try {
    const list = getReviewList(type);
    if (!list.includes(id)) {
      list.push(id);
      const key = type === 'word' ? STORAGE_KEY_WORD_REVIEW : 
                  type === 'phrase' ? STORAGE_KEY_PHRASE_REVIEW : 
                  STORAGE_KEY_TEST_REVIEW;
      localStorage.setItem(key, JSON.stringify(list));
    }
    // Remove from learned list if mistakenly added before
    if (type !== 'test') {
      removeLearnedId(type, id);
    }
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};

export const addLearnedId = (type: 'word' | 'phrase', id: number): void => {
  try {
    const list = getLearnedList(type);
    if (!list.includes(id)) {
      list.push(id);
      const key = type === 'word' ? STORAGE_KEY_WORD_LEARNED : STORAGE_KEY_PHRASE_LEARNED;
      localStorage.setItem(key, JSON.stringify(list));
    }
    // If it was in the review list, maybe we should remove it? 
    // Yes, if we newly learned it.
    removeReviewId(type, id);
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};

export const removeReviewId = (type: 'word' | 'phrase' | 'test', id: number): void => {
  try {
    let list = getReviewList(type);
    list = list.filter((itemId) => itemId !== id);
    const key = type === 'word' ? STORAGE_KEY_WORD_REVIEW : 
                type === 'phrase' ? STORAGE_KEY_PHRASE_REVIEW : 
                STORAGE_KEY_TEST_REVIEW;
    localStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};

export const removeLearnedId = (type: 'word' | 'phrase', id: number): void => {
  try {
    let list = getLearnedList(type);
    list = list.filter((itemId) => itemId !== id);
    const key = type === 'word' ? STORAGE_KEY_WORD_LEARNED : STORAGE_KEY_PHRASE_LEARNED;
    localStorage.setItem(key, JSON.stringify(list));
  } catch (error) {
    console.error('Failed to save to localStorage', error);
  }
};
