import React, { useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { SoundEngine } from '../../utils/sound';

export default function MultipleChoice({
  options,
  correctCountry,
  selectedAnswer,
  onSelectOption,
  isAnswered,
}) {
  // Listen for keyboard number shortcuts 1-4
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnswered) return;
      const key = e.key;
      if (['1', '2', '3', '4'].includes(key)) {
        const index = parseInt(key, 10) - 1;
        if (options[index]) {
          onSelectOption(options[index]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [options, isAnswered, onSelectOption]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl mx-auto mt-4">
      {options.map((option, idx) => {
        const isCorrect = option.code === correctCountry.code;
        const isSelected = selectedAnswer && selectedAnswer.code === option.code;

        let style = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-brand-400 dark:hover:border-brand-500 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]';
        let badgeStyle = 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300';
        let icon = null;

        if (isAnswered) {
          if (isCorrect) {
            style = 'bg-emerald-500/10 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-glow-emerald font-bold ring-2 ring-emerald-500/50 scale-[1.02]';
            badgeStyle = 'bg-emerald-500 text-white';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 animate-scale-in" />;
          } else if (isSelected && !isCorrect) {
            style = 'bg-rose-500/10 border-rose-500 text-rose-800 dark:text-rose-300 shadow-glow-rose font-bold ring-2 ring-rose-500/50 animate-shake';
            badgeStyle = 'bg-rose-500 text-white';
            icon = <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0 animate-scale-in" />;
          } else {
            style = 'opacity-40 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500';
          }
        }

        return (
          <button
            key={option.code}
            disabled={isAnswered}
            onClick={() => {
              if (!isAnswered) {
                onSelectOption(option);
              }
            }}
            className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 text-left w-full focus:outline-none focus:ring-2 focus:ring-brand-500 ${style}`}
          >
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-extrabold text-xs flex-shrink-0 transition-colors ${badgeStyle}`}>
                {idx + 1}
              </span>
              <span className="text-sm sm:text-base font-semibold truncate">
                {option.name}
              </span>
            </div>
            {icon}
          </button>
        );
      })}
    </div>
  );
}
