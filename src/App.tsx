import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { WordModeScreen } from './screens/WordModeScreen';
import { TestModeScreen } from './screens/TestModeScreen';
import { ResultScreen } from './screens/ResultScreen';
import wordsData from './data/words.json';
import type { Word, LearningMode, AppState } from './types';
import { getReviewList, getLearnedList, getActiveSession, saveActiveSession, clearActiveSession } from './lib/storage';

const App: React.FC = () => {
  const allWords = wordsData as Word[];
  const maxWords = allWords.length;

  const [state, setState] = useState<AppState>({
    mode: 'none',
    rangeStart: 1,
    rangeEnd: Math.min(400, maxWords),
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    sessionWords: [],
  });

  const [reviewWordCount, setReviewWordCount] = useState(0);
  const [reviewPhraseCount, setReviewPhraseCount] = useState(0);
  const [reviewTestWordCount, setReviewTestWordCount] = useState(0);
  const [reviewTestPhraseCount, setReviewTestPhraseCount] = useState(0);
  const [learnedWordCount, setLearnedWordCount] = useState(0);
  const [learnedPhraseCount, setLearnedPhraseCount] = useState(0);
  const [learnedTestWordCount, setLearnedTestWordCount] = useState(0);
  const [learnedTestPhraseCount, setLearnedTestPhraseCount] = useState(0);

  const updateReviewCounts = () => {
    // Only count reviews within the current range
    const inRange = (id: number) => id >= state.rangeStart && id <= state.rangeEnd;
    setReviewWordCount(getReviewList('word').filter(inRange).length);
    setReviewPhraseCount(getReviewList('phrase').filter(inRange).length);
    setReviewTestWordCount(getReviewList('test_word').filter(inRange).length);
    setReviewTestPhraseCount(getReviewList('test_phrase').filter(inRange).length);

    // Using simple import logic for getLearnedList, let's make sure it's imported at the top
    setLearnedWordCount(getLearnedList('word').filter(inRange).length);
    setLearnedPhraseCount(getLearnedList('phrase').filter(inRange).length);
    setLearnedTestWordCount(getLearnedList('test_word').filter(inRange).length);
    setLearnedTestPhraseCount(getLearnedList('test_phrase').filter(inRange).length);
  };

  useEffect(() => {
    if (state.mode === 'none') {
      updateReviewCounts();
    }
  }, [state.mode, state.rangeStart, state.rangeEnd]);

  const handleStartMode = (mode: LearningMode) => {
    // Check if there is an active session for this specific category and mode
    const activeSession = getActiveSession(mode, state.rangeStart, state.rangeEnd);
    if (activeSession) {
      if (window.confirm('過去の中断データがあります。続きから再開しますか？\n「キャンセル」を押すと最初から開始します。')) {
        setState(activeSession);
        return;
      } else {
        // User wants to start from scratch, clear the old session
        clearActiveSession(mode, state.rangeStart, state.rangeEnd);
      }
    }

    // Get words in range
    const wordsInRange = allWords.filter(
      (w) => w.id >= state.rangeStart && w.id <= state.rangeEnd
    );

    let sessionWords: Word[] = [];

    if (mode === 'word_all' || mode === 'phrase_all' || mode === 'test_word' || mode === 'test_phrase') {
      sessionWords = [...wordsInRange];
      // Randomize for test mode
      if (mode === 'test_word' || mode === 'test_phrase') {
        sessionWords.sort(() => Math.random() - 0.5);
      }
    } else if (mode === 'word_review') {
      const reviewIds = getReviewList('word');
      sessionWords = wordsInRange.filter((w) => reviewIds.includes(w.id));
    } else if (mode === 'phrase_review') {
      const reviewIds = getReviewList('phrase');
      sessionWords = wordsInRange.filter((w) => reviewIds.includes(w.id));
    } else if (mode === 'test_word_review') {
      const reviewIds = getReviewList('test_word');
      sessionWords = wordsInRange.filter((w) => reviewIds.includes(w.id));
      sessionWords.sort(() => Math.random() - 0.5);
    } else if (mode === 'test_phrase_review') {
      const reviewIds = getReviewList('test_phrase');
      sessionWords = wordsInRange.filter((w) => reviewIds.includes(w.id));
      sessionWords.sort(() => Math.random() - 0.5);
    } else if (mode === 'word_learned') {
      const learnedIds = getLearnedList('word');
      sessionWords = wordsInRange.filter((w) => learnedIds.includes(w.id));
    } else if (mode === 'phrase_learned') {
      const learnedIds = getLearnedList('phrase');
      sessionWords = wordsInRange.filter((w) => learnedIds.includes(w.id));
    } else if (mode === 'test_word_learned') {
      const learnedIds = getLearnedList('test_word');
      sessionWords = wordsInRange.filter((w) => learnedIds.includes(w.id));
      sessionWords.sort(() => Math.random() - 0.5);
    } else if (mode === 'test_phrase_learned') {
      const learnedIds = getLearnedList('test_phrase');
      sessionWords = wordsInRange.filter((w) => learnedIds.includes(w.id));
      sessionWords.sort(() => Math.random() - 0.5);
    }

    if (sessionWords.length === 0) {
      alert('対象の単語がありません');
      return;
    }

    const newState = {
      ...state,
      mode,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      sessionWords,
    };
    setState(newState);
    saveActiveSession(mode, state.rangeStart, state.rangeEnd, newState);
  };

  const handleProgress = (currentIndex: number, correctCount: number, incorrectCount: number) => {
    const updatedState = { ...state, currentIndex, correctCount, incorrectCount };
    setState(updatedState);
    saveActiveSession(state.mode, state.rangeStart, state.rangeEnd, updatedState);
  };

  const handleQuit = () => {
    setState((prev) => ({
      ...prev,
      mode: 'none',
    }));
  };

  const handleFinish = (correctCount: number, incorrectCount: number) => {
    clearActiveSession(state.mode, state.rangeStart, state.rangeEnd);
    setState((prev) => ({
      ...prev,
      mode: 'result' as any,
      correctCount,
      incorrectCount,
    }));
  };

  const handleReturnHome = () => {
    setState((prev) => ({
      ...prev,
      mode: 'none',
    }));
  };

  return (
    <Layout>
      {state.mode === 'none' && (
        <HomeScreen
          rangeStart={state.rangeStart}
          rangeEnd={state.rangeEnd}
          maxWords={maxWords}
          setRangeStart={(v) => setState((p) => ({ ...p, rangeStart: v }))}
          setRangeEnd={(v) => setState((p) => ({ ...p, rangeEnd: v }))}
          onStartMode={handleStartMode}
          reviewWordCount={reviewWordCount}
          reviewPhraseCount={reviewPhraseCount}
          reviewTestWordCount={reviewTestWordCount}
          reviewTestPhraseCount={reviewTestPhraseCount}
          learnedWordCount={learnedWordCount}
          learnedPhraseCount={learnedPhraseCount}
          learnedTestWordCount={learnedTestWordCount}
          learnedTestPhraseCount={learnedTestPhraseCount}
        />
      )}

      {(state.mode === 'word_all' || state.mode === 'word_review' || state.mode === 'word_learned') && (
        <WordModeScreen
          words={state.sessionWords}
          initialIndex={state.currentIndex}
          initialCorrect={state.correctCount}
          initialIncorrect={state.incorrectCount}
          onProgress={handleProgress}
          onQuit={handleQuit}
          onFinish={handleFinish}
          reviewType="word"
        />
      )}

      {(state.mode === 'phrase_all' || state.mode === 'phrase_review' || state.mode === 'phrase_learned') && (
        <WordModeScreen
          words={state.sessionWords}
          initialIndex={state.currentIndex}
          initialCorrect={state.correctCount}
          initialIncorrect={state.incorrectCount}
          onProgress={handleProgress}
          onQuit={handleQuit}
          onFinish={handleFinish}
          reviewType="phrase"
        />
      )}

      {(state.mode === 'test_word' || state.mode === 'test_phrase' || state.mode === 'test_word_review' || state.mode === 'test_phrase_review' || state.mode === 'test_word_learned' || state.mode === 'test_phrase_learned') && (
        <TestModeScreen
          words={state.sessionWords}
          initialIndex={state.currentIndex}
          initialCorrect={state.correctCount}
          initialIncorrect={state.incorrectCount}
          onProgress={handleProgress}
          onQuit={handleQuit}
          onFinish={handleFinish}
          testType={state.mode.includes('word') ? 'word' : 'phrase'}
        />
      )}

      {state.mode === ('result' as any) && (
        <ResultScreen
          total={state.sessionWords.length}
          correct={state.correctCount}
          incorrect={state.incorrectCount}
          onReturnHome={handleReturnHome}
        />
      )}
    </Layout>
  );
};

export default App;
