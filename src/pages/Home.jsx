import React from 'react';
import { Link } from 'react-router-dom';
import { Play, BarChart2, Settings as SettingsIcon, Globe, Sparkles, CheckCircle2, Award, Zap, BookOpen } from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { getStoredStats } from '../utils/storage';
import { TOTAL_COUNTRIES_COUNT } from '../data/countries';
import { SoundEngine } from '../utils/sound';

export default function Home() {
  const stats = getStoredStats();
  const hasPlayed = stats.totalGamesPlayed > 0;
  const accuracy = stats.totalQuestionsAnswered > 0
    ? Math.round(((stats.totalCorrect + stats.totalSpellingMistakes) / stats.totalQuestionsAnswered) * 100)
    : 0;

  // Sample decorative flag codes for the hero animation
  const heroFlagCodes = ['jp', 'br', 'fr', 'ca', 'au', 'eg', 'de', 'kr', 'za', 'mx', 'it', 'es'];

  return (
    <div className="space-y-10 sm:space-y-14 py-4 sm:py-8 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center space-y-6 relative">
        {/* Floating Flag Badges */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap max-w-lg mx-auto mb-2 opacity-90 select-none">
          {heroFlagCodes.map((code, idx) => (
            <div
              key={code}
              className="w-8 h-6 sm:w-10 sm:h-7 rounded-lg overflow-hidden shadow-md border border-white/40 dark:border-slate-700/60 transform transition-transform hover:scale-125 duration-200"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <img
                src={`https://flagcdn.com/w80/${code}.png`}
                alt={code}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-400/10 border border-brand-500/20 text-brand-600 dark:text-brand-300 text-xs sm:text-sm font-bold tracking-wide">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Over {TOTAL_COUNTRIES_COUNT} Flags Across All 6 Continents</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            FlagGuess <span className="inline-block animate-bounce-subtle">🌎</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 font-medium max-w-xl mx-auto">
            How well do you know the world's flags? Challenge yourself in Multiple Choice or Typed Answer modes!
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <Link to="/setup" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="xl"
              className="w-full sm:w-auto text-lg px-8 py-4 shadow-xl shadow-brand-500/30"
              icon={Play}
              iconPosition="left"
            >
              Start Playing Now
            </Button>
          </Link>

          <Link to="/statistics" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="xl"
              className="w-full sm:w-auto text-base px-6 py-4"
              icon={BarChart2}
              iconPosition="left"
            >
              View Statistics
            </Button>
          </Link>
        </div>
      </section>

      {/* Player Stats Snippet if played */}
      {hasPlayed && (
        <section className="max-w-xl mx-auto">
          <Card className="bg-gradient-to-r from-brand-500/5 via-cyan-500/5 to-emerald-500/5 border border-brand-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Your Overall Progress
              </span>
              <Link
                to="/statistics"
                onClick={() => SoundEngine.playClick()}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Full Dashboard →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalGamesPlayed}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Games Played</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {accuracy}%
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Accuracy</div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
                <div className="text-xl sm:text-2xl font-black text-amber-500">
                  🔥 {stats.highestStreak}
                </div>
                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Best Streak</div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Game Features Grid */}
      <section className="max-w-4xl mx-auto space-y-4">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white text-center">
          Exciting Features & Modes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card hover className="space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              🎴
            </div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Multiple Choice Mode</h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Fast-paced 4-option quiz. Use number keys (1, 2, 3, 4) on keyboard for lightning-fast guesses!
            </p>
          </Card>

          <Card hover className="space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              ⌨️
            </div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Smart Typed Answer Mode</h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Type the country name. Our fuzzy spelling matcher recognizes aliases and prompts "Did you mean...?" for typos!
            </p>
          </Card>

          <Card hover className="space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              🌍
            </div>
            <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Continent Customization</h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Practice specific regions (Europe, Asia, Africa, Americas, Oceania) or take on the entire world.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
