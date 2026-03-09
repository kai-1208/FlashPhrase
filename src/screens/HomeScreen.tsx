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
  reviewTestCount: number;
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
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto pb-8">
      {/* Header */}
      <div className="pt-12 pb-6 px-6 bg-white shrink-0 rounded-b-3xl shadow-sm z-10">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">FlashPhrase</h1>
        <p className="text-slate-500 mt-1 font-medium">1日10分の反復学習でスコアアップ</p>
      </div>

      <div className="px-5 mt-6 space-y-6 flex-1">
        {/* Range Selection Card */}
        <Card className="border-none shadow-md shadow-slate-200/50">
          <CardContent className="p-5">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">学習範囲の設定</h2>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Number(e.target.value))}
                  className="w-full h-14 bg-slate-100 rounded-xl px-4 text-xl font-semibold text-center text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  min={1}
                  max={maxWords}
                />
                <span className="absolute left-3 top-4 text-sm text-slate-400 font-medium">No.</span>
              </div>
              <span className="text-slate-400 font-bold">〜</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Number(e.target.value))}
                  className="w-full h-14 bg-slate-100 rounded-xl px-4 text-xl font-semibold text-center text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  min={1}
                  max={maxWords}
                />
              </div>
            </div>
            <p className="text-xs text-center text-slate-400 mt-3">全 {maxWords} 単語収録</p>
          </CardContent>
        </Card>

        {/* Modes */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">単語モード</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl shadow-primary-500/20 shadow-lg"
              onClick={() => onStartMode('word_all')}
            >
              <BookOpen className="w-6 h-6 mb-1" />
              <div className="text-sm font-bold">すべて</div>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm"
              onClick={() => onStartMode('word_review')}
              disabled={reviewWordCount === 0}
            >
              <BookCheck className={cn("w-6 h-6 mb-1", reviewWordCount > 0 ? "text-amber-500" : "text-slate-300")} />
              <div className="text-sm font-bold">復習のみ</div>
              {reviewWordCount > 0 && (
                <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {reviewWordCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">フレーズモード</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="primary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl shadow-primary-500/20 shadow-lg"
              onClick={() => onStartMode('phrase_all')}
            >
              <MessageCircle className="w-6 h-6 mb-1" />
              <div className="text-sm font-bold">すべて</div>
            </Button>
            <Button
              variant="secondary"
              className="h-auto py-5 flex-col gap-2 rounded-2xl bg-white border border-slate-200 text-slate-700 shadow-sm"
              onClick={() => onStartMode('phrase_review')}
              disabled={reviewPhraseCount === 0}
            >
              <MessageSquareCheck className={cn("w-6 h-6 mb-1", reviewPhraseCount > 0 ? "text-amber-500" : "text-slate-300")} />
              <div className="text-sm font-bold">復習のみ</div>
              {reviewPhraseCount > 0 && (
                <span className="absolute top-3 right-3 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {reviewPhraseCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">確認テスト (4択)</h2>
          <Button
            variant="success"
            className="w-full h-auto py-5 flex-col gap-2 rounded-2xl shadow-success-500/20 shadow-lg"
            onClick={() => onStartMode('test')}
          >
            <BrainCircuit className="w-7 h-7 mb-1" />
            <div className="text-base font-bold">テストを開始する</div>
          </Button>
        </div>
      </div>
    </div>
  );
};
