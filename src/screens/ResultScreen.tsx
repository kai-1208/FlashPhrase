import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Trophy, Target, XCircle } from 'lucide-react';

interface ResultScreenProps {
  total: number;
  correct: number;
  incorrect: number;
  onReturnHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  total,
  correct,
  incorrect,
  onReturnHome,
}) => {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  
  let message = "Good job!";
  if (accuracy === 100) message = "Perfect!! 素晴らしい!";
  else if (accuracy >= 80) message = "Great! その調子!";

  return (
    <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
      
      <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-yellow-500/20">
        <Trophy className="w-12 h-12" />
      </div>

      <h1 className="text-3xl font-extrabold text-slate-800 mb-2">{message}</h1>
      <p className="text-slate-500 font-medium mb-8">学習セッションが完了しました</p>

      <Card className="w-full border-none shadow-lg shadow-slate-200/50 mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-y-6 divide-x divide-slate-100">
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">正答率</span>
              <span className="text-4xl font-extrabold text-slate-800">
                {accuracy}<span className="text-2xl text-slate-400">%</span>
              </span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">学習数</span>
              <span className="text-4xl font-extrabold text-slate-800">
                {total}<span className="text-2xl text-slate-400">単語</span>
              </span>
            </div>

            <div className="flex flex-col items-center col-span-2 pt-6 border-t border-slate-100">
              <div className="flex w-full px-4 justify-around">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-success-500" />
                  <span className="font-bold text-slate-600">正解: {correct}</span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-danger-500" />
                  <span className="font-bold text-slate-600">不正解: {incorrect}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button 
        className="w-full h-16 text-lg rounded-2xl shadow-primary-500/20 shadow-lg"
        onClick={onReturnHome}
      >
        ホームに戻る
      </Button>
    </div>
  );
};
