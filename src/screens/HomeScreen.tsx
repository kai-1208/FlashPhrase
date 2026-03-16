import React from 'react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { BookOpen, BookCheck, MessageCircle, MessageSquareCheck, BrainCircuit } from 'lucide-react';
import type { LearningMode } from '../types';
import { cn } from '../lib/utils';

interface HomeScreenProps {
  rangeStart: number;
  rangeEnd: number;
  maxWords: number;
  setRangeStart: (val: number) => void;
  setRangeEnd: (val: number) => void;
  onStartMode: (mode: LearningMode) => void;
  reviewWordCount: number;
  reviewPhraseCount: number;
  reviewTestWordCount: number;
  reviewTestPhraseCount: number;
  learnedWordCount: number;
  learnedPhraseCount: number;
  learnedTestWordCount: number;
  learnedTestPhraseCount: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  rangeStart,
  rangeEnd,
  maxWords,
  setRangeStart,
  setRangeEnd,
  onStartMode,
  reviewWordCount,
  reviewPhraseCount,
  reviewTestWordCount,
  reviewTestPhraseCount,
  learnedWordCount,
  learnedPhraseCount,
  learnedTestWordCount,
  learnedTestPhraseCount,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-8">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-white shrink-0 rounded-b-3xl shadow-sm z-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">FlashPhrase</h1>
        <p className="text-slate-500 mt-1 font-medium">1日10分の反復学習でスコアアップ</p>
      </div>

      <div className="px-5 mt-6 space-y-6 flex-1">
        {/* Category Selection Card */}
        <Card className="border-none shadow-md shadow-slate-200/50">
          <CardContent className="p-5">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">学習カテゴリ</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '1〜400', start: 1, end: 400 },
                { label: '401〜700', start: 401, end: 700 },
                { label: '701〜900', start: 701, end: 900 },
                { label: '901〜1000', start: 901, end: 1000 },
              ].map((cat) => {
                const isSelected = rangeStart === cat.start && rangeEnd === cat.end;
                return (
                  <Button
                    key={cat.label}
                    variant={isSelected ? 'primary' : 'outline'}
                    className={cn(
                      'h-12 rounded-xl text-sm font-bold transition-all',
                      isSelected ? 'shadow-primary-500/20 shadow-md ring-2 ring-primary-500/50' : 'text-slate-500 hover:bg-slate-50'
                    )}
                    onClick={() => {
                      setRangeStart(cat.start);
                      setRangeEnd(cat.end);
                    }}
                  >
                    {cat.label}
                  </Button>
                );
              })}
            </div>
            <p className="text-xs text-center text-slate-400 mt-4">全 {maxWords} 単語収録</p>
          </CardContent>
        </Card>

        {/* Modes */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">単語モード</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="primary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl shadow-primary-500/20 shadow-lg px-2"
              onClick={() => onStartMode('word_all')}
            >
              <BookOpen className="w-6 h-6 mb-1" />
              <div className="text-xs font-bold leading-tight">すべて</div>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('word_review')}
              disabled={reviewWordCount === 0}
            >
              <BookCheck className={cn("w-6 h-6 mb-1", reviewWordCount > 0 ? "text-amber-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">復習のみ</div>
              {reviewWordCount > 0 && (
                <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {reviewWordCount}
                </span>
              )}
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('word_learned')}
              disabled={learnedWordCount === 0}
            >
              <BookCheck className={cn("w-6 h-6 mb-1", learnedWordCount > 0 ? "text-success-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">学習済み</div>
              {learnedWordCount > 0 && (
                <span className="absolute top-2 right-2 bg-success-100 text-success-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {learnedWordCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">フレーズモード</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="primary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl shadow-primary-500/20 shadow-lg px-2"
              onClick={() => onStartMode('phrase_all')}
            >
              <MessageCircle className="w-6 h-6 mb-1" />
              <div className="text-xs font-bold leading-tight">すべて</div>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('phrase_review')}
              disabled={reviewPhraseCount === 0}
            >
              <MessageSquareCheck className={cn("w-6 h-6 mb-1", reviewPhraseCount > 0 ? "text-amber-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">復習のみ</div>
              {reviewPhraseCount > 0 && (
                <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {reviewPhraseCount}
                </span>
              )}
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('phrase_learned')}
              disabled={learnedPhraseCount === 0}
            >
              <MessageSquareCheck className={cn("w-6 h-6 mb-1", learnedPhraseCount > 0 ? "text-success-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">学習済み</div>
              {learnedPhraseCount > 0 && (
                <span className="absolute top-2 right-2 bg-success-100 text-success-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {learnedPhraseCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">単語テスト (4択)</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="success"
              className="h-auto py-5 flex-col gap-2 rounded-2xl shadow-success-500/20 shadow-lg px-2"
              onClick={() => onStartMode('test_word')}
            >
              <BrainCircuit className="w-6 h-6 mb-1" />
              <div className="text-xs font-bold leading-tight">すべて</div>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('test_word_review')}
              disabled={reviewTestWordCount === 0}
            >
              <BookCheck className={cn("w-6 h-6 mb-1", reviewTestWordCount > 0 ? "text-amber-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">復習のみ</div>
              {reviewTestWordCount > 0 && (
                <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {reviewTestWordCount}
                </span>
              )}
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('test_word_learned')}
              disabled={learnedTestWordCount === 0}
            >
              <BookCheck className={cn("w-6 h-6 mb-1", learnedTestWordCount > 0 ? "text-success-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">学習済み</div>
              {learnedTestWordCount > 0 && (
                <span className="absolute top-2 right-2 bg-success-100 text-success-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {learnedTestWordCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">フレーズテスト (4択)</h2>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="success"
              className="h-auto py-5 flex-col gap-2 rounded-2xl shadow-success-500/20 shadow-lg px-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
              onClick={() => onStartMode('test_phrase')}
            >
              <MessageCircle className="w-6 h-6 mb-1" />
              <div className="text-xs font-bold leading-tight">すべて</div>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('test_phrase_review')}
              disabled={reviewTestPhraseCount === 0}
            >
              <MessageSquareCheck className={cn("w-6 h-6 mb-1", reviewTestPhraseCount > 0 ? "text-amber-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">復習のみ</div>
              {reviewTestPhraseCount > 0 && (
                <span className="absolute top-2 right-2 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {reviewTestPhraseCount}
                </span>
              )}
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm px-2 relative"
              onClick={() => onStartMode('test_phrase_learned')}
              disabled={learnedTestPhraseCount === 0}
            >
              <MessageSquareCheck className={cn("w-6 h-6 mb-1", learnedTestPhraseCount > 0 ? "text-success-500" : "text-slate-300")} />
              <div className="text-xs font-bold leading-tight">学習済み</div>
              {learnedTestPhraseCount > 0 && (
                <span className="absolute top-2 right-2 bg-success-100 text-success-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {learnedTestPhraseCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
