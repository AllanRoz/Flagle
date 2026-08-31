import React, { useState } from 'react';
import Card from '../common/Card';
import { getFlagUrl } from '../../data/countries';
import { CheckCircle2, XCircle, Edit3, Filter } from 'lucide-react';

export default function ReviewGrid({ history = [] }) {
  const [filter, setFilter] = useState('all');

  if (!history || history.length === 0) return null;

  const correctItems = history.filter((h) => h.status === 'correct');
  const spellingItems = history.filter((h) => h.status === 'spelling_corrected');
  const incorrectItems = history.filter((h) => h.status === 'incorrect');

  const filteredItems = history.filter((item) => {
    if (filter === 'correct') return item.status === 'correct';
    if (filter === 'spelling') return item.status === 'spelling_corrected';
    if (filter === 'incorrect') return item.status === 'incorrect';
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <span>Question Review</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {history.length}
          </span>
        </h3>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            All ({history.length})
          </button>

          {incorrectItems.length > 0 && (
            <button
              onClick={() => setFilter('incorrect')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'incorrect'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              <XCircle className="w-3 h-3" />
              Missed ({incorrectItems.length})
            </button>
          )}

          {spellingItems.length > 0 && (
            <button
              onClick={() => setFilter('spelling')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'spelling'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              <Edit3 className="w-3 h-3" />
              Typos ({spellingItems.length})
            </button>
          )}

          {correctItems.length > 0 && (
            <button
              onClick={() => setFilter('correct')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                filter === 'correct'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Correct ({correctItems.length})
            </button>
          )}
        </div>
      </div>

      {/* Grid of Reviewed Flags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredItems.map((item, idx) => {
          const { country, status, userGuess } = item;
          const isCorrect = status === 'correct';
          const isSpelling = status === 'spelling_corrected';
          const isIncorrect = status === 'incorrect';

          let borderStyle = 'border-emerald-500/40 bg-emerald-500/5';
          let StatusIcon = CheckCircle2;
          let iconColor = 'text-emerald-500';

          if (isSpelling) {
            borderStyle = 'border-amber-500/40 bg-amber-500/5';
            StatusIcon = Edit3;
            iconColor = 'text-amber-500';
          } else if (isIncorrect) {
            borderStyle = 'border-rose-500/40 bg-rose-500/5';
            StatusIcon = XCircle;
            iconColor = 'text-rose-500';
          }

          return (
            <div
              key={`${country.code}-${idx}`}
              className={`p-3.5 rounded-2xl border-2 glass-card flex items-center gap-3 transition-all hover:scale-[1.02] ${borderStyle}`}
            >
              {/* Flag image */}
              <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-100 dark:bg-slate-800 shadow-sm">
                <img
                  src={getFlagUrl(country.code, 'png', 160)}
                  alt={`Flag of ${country.name}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {country.name}
                  </h4>
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${iconColor}`} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {country.continent} • {country.capital}
                </p>
                {userGuess && userGuess !== country.name && (
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    Your guess: <span className="font-semibold text-slate-600 dark:text-slate-300">{userGuess}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
