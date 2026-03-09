import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Word } from '../types';
import { addReviewId } from '../lib/storage';

interface TestModeScreenProps {
  words: Word[];
  onFinish: (correctCount: number, incorrectCount: number) => void;
}

export const TestModeScreen: React.FC<TestModeScreenProps> = ({ words, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  
  // local state for choices to avoid re-shuffling on re-render
  const [choices, setChoices] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (currentWord) {
      const options = [
        currentWord.word_ja,
        currentWord.dummy1,
        currentWord.dummy2,
        currentWord.dummy3
      ].filter(Boolean); // filter out empty strings if any

      // Shuffle
      options.sort(() => Math.random() - 0.5);
      setChoices(options);
      setSelectedAnswer(null);
    }
  }, [currentIndex, currentWord]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return; // Prevent double taps

    setSelectedAnswer(answer);
    
    const isCorrect = answer === currentWord.word_ja;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    } else {
      setIncorrectCount(prev => prev + 1);
      addReviewId('test', currentWord.id);
    }

    // Wait a brief moment before next question for visual feedback
    setTimeout(() => {
      if (currentIndex + 1 < words.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onFinish(correctCount + (isCorrect ? 1 : 0), incorrectCount + (!isCorrect ? 1 : 0));
      }
    }, 700);
  };

  if (!currentWord) return null;

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
          <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 break-words leading-tight">
            {currentWord.word_en}
          </h2>
        </CardContent>
      </Card>

      {/* Choices */}
      <div className="flex flex-col gap-4 flex-1 justify-end">
        {choices.map((choice, i) => {
          const isSelected = selectedAnswer === choice;
          const isCorrectAnswer = choice === currentWord.word_ja;
          
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
    </div>
  );
};
