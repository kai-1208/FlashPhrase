import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { Word } from '../types';
import { addReviewId, addLearnedId } from '../lib/storage';

interface WordModeScreenProps {
  words: Word[];
  onFinish: (correctCount: number, incorrectCount: number) => void;
  reviewType: 'word' | 'phrase';
}

export const WordModeScreen: React.FC<WordModeScreenProps> = ({ words, onFinish, reviewType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const currentWord = words[currentIndex];

  const handleNext = (knew: boolean) => {
    if (!knew) {
      addReviewId(reviewType, currentWord.id);
      setIncorrectCount(prev => prev + 1);
    } else {
      addLearnedId(reviewType, currentWord.id);
      setCorrectCount(prev => prev + 1);
    }

    if (currentIndex + 1 < words.length) {
      setCurrentIndex(prev => prev + 1);
      setIsRevealed(false);
    } else {
      onFinish(correctCount + (knew ? 1 : 0), incorrectCount + (!knew ? 1 : 0));
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative pb-6 px-4 pt-12">
      {/* Progress */}
      <div className="absolute top-4 left-0 right-0 px-6">
        <div className="flex items-center justify-between text-sm font-bold text-slate-400 mb-2">
          <span>{currentIndex + 1} / {words.length}</span>
          <span className="uppercase tracking-widest">{reviewType === 'word' ? 'Word Mode' : 'Phrase Mode'}</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex flex-col justify-center max-h-[70vh]">
        <Card 
          className="flex-1 shadow-lg shadow-slate-200/50 flex flex-col cursor-pointer transition-transform active:scale-[0.98] border-none"
          onClick={() => !isRevealed && setIsRevealed(true)}
        >
          {/* Question Side */}
          <CardContent className="flex-[0.4] flex items-end justify-center pb-6 border-b border-slate-100 bg-white">
            <h2 className="text-4xl text-center font-extrabold tracking-tight text-slate-800 break-words leading-tight">
              {reviewType === 'word' ? currentWord.word_en : currentWord.sentence_en}
            </h2>
          </CardContent>

          {/* Answer Side */}
          <CardContent className={cn("flex-[0.6] bg-slate-50 flex flex-col justify-start pt-6 transition-all duration-300", 
            isRevealed ? "opacity-100" : "opacity-0 invisible")}
          >
            {isRevealed && (
              <div className="space-y-6 overflow-y-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">日本語訳</div>
                  <p className="text-xl font-bold text-slate-800 leading-snug">
                    {reviewType === 'word' ? currentWord.word_ja : currentWord.sentence_ja}
                  </p>
                </div>
                
                {reviewType === 'word' && (currentWord.sentence_en || currentWord.sentence_ja) && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">例文</div>
                    <p className="text-slate-800 font-medium mb-1">{currentWord.sentence_en}</p>
                    <p className="text-sm text-slate-600">{currentWord.sentence_ja}</p>
                  </div>
                )}

                {currentWord.memo && (
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">備考</div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{currentWord.memo}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="shrink-0 pt-6 px-2">
        {!isRevealed ? (
          <Button 
            className="w-full h-16 text-lg rounded-2xl shadow-primary-500/20 shadow-lg animate-pulse" 
            onClick={() => setIsRevealed(true)}
          >
            タップして答えを見る
          </Button>
        ) : (
          <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-300">
            <Button 
              variant="danger" 
              className="h-16 text-lg rounded-2xl shadow-danger-500/20 shadow-lg"
              onClick={() => handleNext(false)}
            >
              分からなかった
            </Button>
            <Button 
              variant="success" 
              className="h-16 text-lg rounded-2xl shadow-success-500/20 shadow-lg"
              onClick={() => handleNext(true)}
            >
              分かっていた
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple utility for cn in this file if we didn't import it
// Wait, we need to import cn. Let's add it.
import { cn } from '../lib/utils';
