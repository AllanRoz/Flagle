import React from 'react';
import { CheckCircle2, Edit3, XCircle, Flame, Trophy, Award, Target } from 'lucide-react';
import Card from '../common/Card';

export default function ScoreCard({
  score,
  total,
  correctCount,
  spellingCount,
  incorrectCount,
  maxStreak,
  gameMode,
}) {
  const percentage = total > 0 ? Math.round(((correctCount + spellingCount) / total) * 100) : 0;

  let feedback = {
    title: 'Game Complete! 🎉',
    subtitle: 'Awesome effort exploring the world!',
    icon: Trophy,
    color: 'from-amber-400 to-orange-500',
  };

  if (percentage === 100) {
    feedback = {
      title: 'Flawless Victory! 👑',
      subtitle: 'You are a true World Flag Master!',
      icon: Trophy,
      color: 'from-yellow-400 to-amber-500',
    };
  } else if (percentage >= 80) {
    feedback = {
      title: 'Outstanding Job! 🌟',
      subtitle: 'Your geography knowledge is world-class!',
      icon: Award,
      color: 'from-emerald-400 to-teal-500',
    };
  } else if (percentage >= 50) {
    feedback = {
      title: 'Solid Round! 🎯',
      subtitle: 'You know your flags well, keep it up!',
      icon: Target,
      color: 'from-blue-400 to-indigo-500',
    };
  }

  const IconComponent = feedback.icon;

  return (
    <Card className="text-center relative overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-2xl">
      {/* Decorative top icon */}
      <div className="flex justify-center mb-3">
        <div className={`w-16 h-16 rounded-3xl bg-gradient-to-tr ${feedback.color} flex items-center justify-center text-white shadow-lg animate-bounce-subtle`}>
          <IconComponent className="w-8 h-8" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
        {feedback.title}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
        {feedback.subtitle}
      </p>

      {/* Main Score Display */}
      <div className="py-4 px-6 rounded-2xl bg-slate-100 dark:bg-slate-800/80 max-w-xs mx-auto mb-6 border border-slate-200 dark:border-slate-700">
        <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-cyan-400 bg-clip-text text-transparent">
          {percentage}%
        </div>
        <div className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">
          {correctCount + spellingCount} / {total} Total Score
        </div>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-left">
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          <div>
            <div className="text-lg font-black text-emerald-800 dark:text-emerald-300">{correctCount}</div>
            <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Correct</div>
          </div>
        </div>

        {gameMode === 'typed' ? (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
            <Edit3 className="w-6 h-6 text-amber-500 flex-shrink-0" />
            <div>
              <div className="text-lg font-black text-amber-800 dark:text-amber-300">{spellingCount}</div>
              <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Typos</div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center gap-3">
            <Target className="w-6 h-6 text-brand-500 flex-shrink-0" />
            <div>
              <div className="text-lg font-black text-brand-800 dark:text-brand-300">{percentage}%</div>
              <div className="text-[11px] font-bold text-brand-700 dark:text-brand-400 uppercase tracking-wider">Accuracy</div>
            </div>
          </div>
        )}

        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
          <XCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
          <div>
            <div className="text-lg font-black text-rose-800 dark:text-rose-300">{incorrectCount}</div>
            <div className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">Incorrect</div>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-3">
          <Flame className="w-6 h-6 text-orange-500 flex-shrink-0" />
          <div>
            <div className="text-lg font-black text-orange-800 dark:text-orange-300">{maxStreak}</div>
            <div className="text-[11px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider">Best Streak</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
