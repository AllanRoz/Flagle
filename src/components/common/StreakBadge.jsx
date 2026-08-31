import React from 'react';
import { Flame } from 'lucide-react';

export default function StreakBadge({ streak = 0, className = '' }) {
  if (streak <= 0) return null;

  let bgGradient = 'from-amber-500 to-orange-500';
  let glowEffect = 'shadow-glow-amber';

  if (streak >= 10) {
    bgGradient = 'from-yellow-400 via-amber-500 to-red-500';
    glowEffect = 'shadow-lg shadow-amber-500/40 ring-2 ring-yellow-400/50';
  } else if (streak >= 5) {
    bgGradient = 'from-orange-500 via-rose-500 to-red-600';
    glowEffect = 'shadow-glow-rose';
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${bgGradient} text-white font-extrabold text-xs sm:text-sm tracking-wide shadow-md ${glowEffect} animate-scale-in select-none ${className}`}
      title={`${streak} question streak!`}
    >
      <Flame className="w-4 h-4 fill-white animate-bounce-subtle text-white" />
      <span>{streak} {streak === 1 ? 'Streak' : 'Streak!'}</span>
    </div>
  );
}
