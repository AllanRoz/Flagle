import React, { useState } from 'react';
import { getStoredStats, resetStoredStats } from '../utils/storage';
import { getFlagUrl } from '../data/countries';
import { CONTINENTS } from '../data/continents';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import {
  Trophy,
  Target,
  Flame,
  CheckCircle2,
  XCircle,
  Edit3,
  RotateCcw,
  BarChart2,
  Globe,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react';
import { SoundEngine } from '../utils/sound';

export default function Statistics() {
  const [stats, setStats] = useState(getStoredStats);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const {
    totalGamesPlayed = 0,
    totalQuestionsAnswered = 0,
    totalCorrect = 0,
    totalSpellingMistakes = 0,
    totalIncorrect = 0,
    highestStreak = 0,
    gameModeCount = {},
    continentStats = {},
    countryStats = {},
  } = stats;

  const totalSuccess = totalCorrect + totalSpellingMistakes;
  const overallAccuracy =
    totalQuestionsAnswered > 0 ? Math.round((totalSuccess / totalQuestionsAnswered) * 100) : 0;

  // Find favorite game mode
  const flagleCount = gameModeCount['flagle'] || 0;
  const mcCount = gameModeCount['multiple-choice'] || 0;
  const typedCount = gameModeCount['typed'] || 0;
  let favoriteMode = 'None yet';
  const maxPlays = Math.max(flagleCount, mcCount, typedCount);
  if (maxPlays > 0) {
    if (flagleCount === maxPlays) favoriteMode = 'Flagle Reveal';
    else if (mcCount === maxPlays) favoriteMode = 'Multiple Choice';
    else favoriteMode = 'Type the Country';
  }

  // Frequently missed countries (sorted by incorrect count desc)
  const missedCountries = Object.entries(countryStats)
    .filter(([_, data]) => data.incorrect > 0)
    .sort((a, b) => b[1].incorrect - a[1].incorrect)
    .slice(0, 8);

  // Mastered countries (sorted by correct count desc)
  const masteredCountries = Object.entries(countryStats)
    .filter(([_, data]) => data.correct > 0)
    .sort((a, b) => b[1].correct - a[1].correct)
    .slice(0, 8);

  const handleConfirmReset = () => {
    SoundEngine.playClick();
    const freshStats = resetStoredStats();
    setStats(freshStats);
    setIsResetModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <BarChart2 className="w-7 h-7 text-brand-500" />
            <span>Statistics Dashboard</span>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Track your world flag mastery and learning history
          </p>
        </div>

        {totalQuestionsAnswered > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsResetModalOpen(true)}
            className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50"
            icon={RotateCcw}
          >
            Reset Statistics
          </Button>
        )}
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Games Played</span>
            <Globe className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {totalGamesPlayed}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            {totalQuestionsAnswered} flags answered
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Accuracy</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {overallAccuracy}%
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            {totalSuccess} / {totalQuestionsAnswered} correct
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Best Streak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-500">
            🔥 {highestStreak}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            consecutive correct
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Typos Saved</span>
            <Edit3 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-500">
            {totalSpellingMistakes}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            via spelling assistant
          </div>
        </Card>
      </div>

      {/* Continent Performance & Modes Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Continent Accuracy Bars */}
        <Card className="md:col-span-2 space-y-4">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-brand-500" />
            <span>Continent Accuracy</span>
          </h3>

          <div className="space-y-3">
            {CONTINENTS.filter((c) => c.id !== 'world').map((continent) => {
              const cStat = continentStats[continent.id] || { asked: 0, correct: 0 };
              const cPercent =
                cStat.asked > 0 ? Math.round((cStat.correct / cStat.asked) * 100) : 0;

              return (
                <div key={continent.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
                    <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                      <span>{continent.emoji}</span>
                      <span>{continent.name}</span>
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {cPercent}% ({cStat.correct}/{cStat.asked})
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${continent.color} transition-all duration-500`}
                      style={{ width: `${cPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Favorite Game Mode Card */}
        <Card className="space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-2">
              Game Modes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Favorite mode: <span className="font-bold text-brand-600 dark:text-brand-400">{favoriteMode}</span>
            </p>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">🧩 Flagle Reveal</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                  {flagleCount} games
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">🎴 Multiple Choice</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                  {mcCount} games
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">⌨️ Type Country</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                  {typedCount} games
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center">
            <div className="text-xs font-bold text-brand-600 dark:text-brand-400">
              {totalQuestionsAnswered === 0 ? 'Start your first quiz to record stats!' : 'Keep practicing to master all flags!'}
            </div>
          </div>
        </Card>
      </div>

      {/* Frequently Missed Countries List */}
      <div className="space-y-3">
        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <XCircle className="w-5 h-5 text-rose-500" />
          <span>Frequently Missed Flags</span>
        </h3>

        {missedCountries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {missedCountries.map(([code, data]) => (
              <div
                key={code}
                className="p-3 rounded-2xl glass-card border border-rose-500/30 flex items-center gap-3"
              >
                <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-slate-100 shadow-sm">
                  <img
                    src={getFlagUrl(code, 'png', 160)}
                    alt={data.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {data.name}
                  </h4>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
                    {data.incorrect} {data.incorrect === 1 ? 'miss' : 'misses'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl glass-card text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-60" />
            <p className="text-sm font-semibold">No missed flags yet! You have a clean record.</p>
          </div>
        )}
      </div>

      {/* Reset Stats Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Reset All Statistics?"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to permanently reset all saved scores, streaks, and history? This cannot be undone.
            </p>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsResetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="rose"
              onClick={handleConfirmReset}
            >
              Yes, Reset Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
