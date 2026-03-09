import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { HomeScreen } from './screens/HomeScreen';
import { WordModeScreen } from './screens/WordModeScreen';
import { TestModeScreen } from './screens/TestModeScreen';
import { ResultScreen } from './screens/ResultScreen';
import wordsData from './data/words.json';
import type { Word, LearningMode, AppState } from './types';
import { getReviewList } from './lib/storage';

const App: React.FC = () => {
  const allWords = wordsData as Word[];
  const maxWords = allWords.length;

  const [state, setState] = useState<AppState>({
    mode: 'none',
    rangeStart: 1,
    rangeEnd: Math.min(100, maxWords),
    currentIndex: 0,
    correctCount: 0,
    incorrectCount: 0,
    sessionWords: [],
  });

  const [reviewWordCount, setReviewWordCount] = useState(0);
  const [reviewPhraseCount, setReviewPhraseCount] = useState(0);
  const [reviewTestCount, setReviewTestCount] = useState(0);

  const updateReviewCounts = () => {
    // Only count reviews within the current range
    const inRange = (id: number) => id >= state.rangeStart && id <= state.rangeEnd;
    setReviewWordCount(getReviewList('word').filter(inRange).length);
    setReviewPhraseCount(getReviewList('phrase').filter(inRange).length);
    setReviewTestCount(getReviewList('test').filter(inRange).length);
  };

  useEffect(() => {
    if (state.mode === 'none') {
      updateReviewCounts();
    }
  }, [state.mode, state.rangeStart, state.rangeEnd]);

  const handleStartMode = (mode: LearningMode) => {
    // Get words in range
    const wordsInRange = allWords.filter(
      (w) => w.id >= state.rangeStart && w.id <= state.rangeEnd
    );

    let sessionWords: Word[] = [];

    if (mode === 'word_all' || mode === 'phrase_all' || mode === 'test') {
      sessionWords = [...wordsInRange];
      // Randomize for test mode
      if (mode === 'test') {
        sessionWords.sort(() => Math.random() - 0.5);
      }
    } else if (mode === 'word_review') {
      const reviewIds = getReviewList('word');
      sessionWords = wordsInRange.filter((w) => reviewIds.includes(w.id));
    } else if (mode === 'phrase_review') {
      const reviewIds = getReviewList('phrase');
      sessionWords = wordsInRange.filter((w) => reviewIds.includes(w.id));
    }

    if (sessionWords.length === 0) {
      alert('対象の単語がありません');
      return;
    }

    setState({
      ...state,
      mode,
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      sessionWords,
    });
  };

  const handleFinish = (correctCount: number, incorrectCount: number) => {
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
      currentIndex: 0,
      correctCount: 0,
      incorrectCount: 0,
      sessionWords: [],
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
          reviewTestCount={reviewTestCount}
        />
      )}
      
      {(state.mode === 'word_all' || state.mode === 'word_review') && (
        <WordModeScreen 
          words={state.sessionWords}
          onFinish={handleFinish}
          reviewType="word"
        />
      )}

      {(state.mode === 'phrase_all' || state.mode === 'phrase_review') && (
        <WordModeScreen 
          words={state.sessionWords}
          onFinish={handleFinish}
          reviewType="phrase"
        />
      )}

      {state.mode === 'test' && (
        <TestModeScreen 
          words={state.sessionWords}
          onFinish={handleFinish}
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
