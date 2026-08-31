import React from 'react';
import StreakBadge from '../common/StreakBadge';
import { LogOut, CheckCircle2, XCircle, Edit3 } from 'lucide-react';
import { SoundEngine } from '../../utils/sound';

export default function QuestionHeader({
  currentIndex,
  totalQuestions,
  streak,
  correctCount,
  spellingCount,
  incorrectCount,
  onExitClick,
  gameMode,
}) {
  const isEndless = totalQuestions === 'endless';
  const progressPercent = isEndless
    ? 100
    : Math.min(100, Math.round(((currentIndex + 1) / totalQuestions) * 100));

  return (
    <div className="w-full space-y-3">
      {/* Top row: Title, Streak, Exit */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isEndless ? `Question ${currentIndex + 1}` : `Question ${currentIndex + 1} of ${totalQuestions}`}
          </span>
          <StreakBadge streak={streak} />
        </div>

        {/* Live score chips */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs font-bold" title="Correct">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{correctCount}</span>
          </div>

          {gameMode === 'typed' && spellingCount > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-xs font-bold" title="Corrected with typo">
              <Edit3 className="w-3.5 h-3.5" />
              <span>{spellingCount}</span>
            </div>
          )}

          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold" title="Incorrect">
            <XCircle className="w-3.5 h-3.5" />
            <span>{incorrectCount}</span>
          </div>

          <button
            onClick={() => {
              SoundEngine.playClick();
              onExitClick();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1 focus:outline-none focus:ring-2 focus:ring-rose-500"
            title="Leave Game"
            aria-label="Leave Game"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {!isEndless && (
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}
    </div>
  );
}
