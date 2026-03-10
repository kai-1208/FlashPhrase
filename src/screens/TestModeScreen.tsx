import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Word } from '../types';
import { addReviewId } from '../lib/storage';

interface TestModeScreenProps {
  words: Word[];
  onFinish: (correctCount: number, incorrectCount: number) => void;
  testType: 'word' | 'phrase';
}

export const TestModeScreen: React.FC<TestModeScreenProps> = ({ words, onFinish, testType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  
  // local state for choices to avoid re-shuffling on re-render
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      // In word test, answer is English word's meaning (answer_ja).
      // In phrase test, maybe answer should be sentence_ja? The user said: "単語の確認テストでは例文(フレーズ)とその日本語訳、フレーズの確認テストでは単語とその日本語も表示されるようにしてください"
      // Wait, what is the right answer for phrase test? The user didn't specify the choice generation for phrase test, but normally it's Japanese translation of phrase. Since dummy choices are for words, let's keep the choices the same (meaning of the word) but the question is sentence_en?
      // Ah, "4択確認テストについて、単語とフレーズどちらにも対応させてください... フレーズの確認テストでは単語とその日本語も表示されるようにしてください". This implies the phrase test asks the meaning of a phrase. But we lack phrase dummies. Let's assume the question is the phrase, and the choices are the same dummy words, or maybe the choices are English phrases? No, let's use sentence_en as the question, and answer_ja/dummies as choices to see if they know the core word in the phrase.
      // Let's make the question text dynamic.
      const options = [
        currentWord.answer_ja,
        currentWord.dummy1,
        currentWord.dummy2,
        currentWord.dummy3
      ].filter(Boolean); // filter out empty strings if any

      // Shuffle
      options.sort(() => Math.random() - 0.5);
      setChoices(options);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentIndex, currentWord]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent double taps

    setSelectedAnswer(answer);
    
    const isCorrect = answer === currentWord.answer_ja;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
      addReviewId('test', currentWord.id);
    }

    // Show explanation instead of auto-advancing
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Pass the count without recalculating the current word
      onFinish(correctCount, incorrectCount);
    }
  };

  if (!currentWord) return null;

  const renderHighlightedSentence = (sentence: string, targetWord: string) => {
    if (!sentence || !targetWord) return sentence;
    const escapedTarget = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTarget})`, 'gi');
    const parts = sentence.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === targetWord.toLowerCase() ? (
            <span key={i} className="text-primary-500 underline decoration-2 underline-offset-[6px]">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-6 px-4 pt-12">
      {/* Progress */}
      <div className="absolute top-4 left-0 right-0 px-6">
        <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-2">
          <span>{currentIndex + 1} / {words.length}</span>
          <span className="uppercase tracking-widest text-primary-500">Test Mode</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <Card className="shrink-0 mb-6 shadow-md border-none min-h-[160px] flex items-center justify-center">
        <CardContent className="text-center p-8">
          <h2 className={`tracking-tight text-slate-800 break-words leading-tight ${
            testType === 'word' ? 'text-4xl font-extrabold' : 'text-2xl font-bold'
          }`}>
            {testType === 'word' 
              ? currentWord.word_en 
              : renderHighlightedSentence(currentWord.sentence_en, currentWord.word_en)}
          </h2>
        </CardContent>
      </Card>

      {/* Choices */}
      <div className="flex flex-col gap-4 flex-1 justify-end">
        {choices.map((choice, i) => {
          const isSelected = selectedAnswer === choice;
          const isCorrectAnswer = choice === currentWord.answer_ja;
          
          let btnVariant: 'outline' | 'success' | 'danger' = 'outline';
          if (selectedAnswer) {
            if (isCorrectAnswer) btnVariant = 'success';
            else if (isSelected) btnVariant = 'danger';
          }

          return (
            <Button
              key={i}
              variant={btnVariant}
              className={`h-16 text-lg rounded-2xl border-2 transition-all ${
                selectedAnswer ? 'pointer-events-none' : 'hover:scale-[1.01] active:scale-[0.98]'
              }`}
              onClick={() => handleAnswer(choice)}
            >
              {choice}
            </Button>
          );
        })}
      </div>

      {/* Explanation Section */}
      {showExplanation && (
        <div className="absolute inset-x-0 bottom-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-t-3xl pt-8 pb-8 px-6 flex flex-col items-center animate-in slide-in-from-bottom-full duration-300 z-20">
          {/* Result Badge */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <div className={`px-6 py-1.5 rounded-full font-bold text-lg shadow-lg border-4 border-white whitespace-nowrap ${
              selectedAnswer === currentWord.answer_ja ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'
            }`}>
              {selectedAnswer === currentWord.answer_ja ? '正解！' : '不正解...'}
            </div>
          </div>

          <div className="w-12 h-1.5 bg-slate-200 rounded-full mb-4" />
          
          <div className="w-full text-center space-y-4 mb-6">
            <h3 className="text-xl font-bold text-slate-800">
              {testType === 'word' ? currentWord.word_ja : currentWord.sentence_ja}
            </h3>
            
            {testType === 'word' && currentWord.sentence_en && currentWord.sentence_ja && (
              <div className="bg-slate-50 rounded-xl py-3 px-4 border border-slate-100 text-left">
                <p className="font-semibold text-slate-700 text-[0.95rem] leading-snug">{currentWord.sentence_en}</p>
                <p className="text-slate-500 text-sm mt-1.5 leading-snug">{currentWord.sentence_ja}</p>
              </div>
            )}

            {testType === 'phrase' && (
              <div className="bg-slate-50 rounded-xl py-3 px-4 border border-slate-100 text-left">
                <p className="font-semibold text-slate-700 text-[0.95rem] leading-snug">{currentWord.word_en}</p>
                <p className="text-slate-500 text-sm mt-1.5 leading-snug">{currentWord.word_ja}</p>
              </div>
            )}
            
            {currentWord.memo && (
              <p className="text-slate-500 text-sm leading-relaxed text-left bg-primary-50 px-4 py-3 rounded-xl">
                {currentWord.memo}
              </p>
            )}
          </div>

          <Button 
            variant="primary" 
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-primary-500/20 shadow-lg"
            onClick={handleNext}
          >
            次へ進む
          </Button>
        </div>
      )}
    </div>
  );
};
