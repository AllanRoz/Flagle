import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTINENTS, CONTINENT_NAMES } from '../data/continents';
import { getFilteredCountries } from '../utils/gameLogic';
import { getStoredSetup, saveStoredSetup } from '../utils/storage';
import { SoundEngine } from '../utils/sound';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { Play, Check, Globe, HelpCircle, Layers, Infinity } from 'lucide-react';

export default function GameSetup() {
  const navigate = useNavigate();
  const initialSetup = getStoredSetup();

  const [gameMode, setGameMode] = useState(initialSetup.gameMode || 'multiple-choice');
  const [continents, setContinents] = useState(initialSetup.continents || ['world']);
  const [questionCount, setQuestionCount] = useState(initialSetup.questionCount || 10);

  // Compute live available country count based on continent selection
  const availableCountries = getFilteredCountries(continents);

  // Handle continent toggle
  const toggleContinent = (continentId) => {
    SoundEngine.playClick();

    if (continentId === 'world') {
      setContinents(['world']);
      return;
    }

    let updated = continents.filter((c) => c !== 'world');
    if (updated.includes(continentId)) {
      updated = updated.filter((c) => c !== continentId);
      if (updated.length === 0) {
        updated = ['world'];
      }
    } else {
      updated.push(continentId);
      // If player picked all continents, revert to 'world'
      if (updated.length === CONTINENT_NAMES.length) {
        updated = ['world'];
      }
    }

    setContinents(updated);
  };

  const handleStartGame = () => {
    const setupData = {
      gameMode,
      continents,
      questionCount,
    };
    saveStoredSetup(setupData);
    navigate('/game', { state: setupData });
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Game Configuration 🎮
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Choose your game mode, region, and question length
        </p>
      </div>

      {/* 1. Game Mode Selection */}
      <div className="space-y-3">
        <label className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          1. Select Game Mode
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Multiple Choice Card */}
          <div
            onClick={() => {
              SoundEngine.playClick();
              setGameMode('multiple-choice');
            }}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-start gap-3.5 ${
              gameMode === 'multiple-choice'
                ? 'bg-brand-500/10 border-brand-500 shadow-md shadow-brand-500/10 ring-2 ring-brand-500/40'
                : 'glass-card border-slate-200 dark:border-slate-700 hover:border-brand-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold ${
              gameMode === 'multiple-choice' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              🎴
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Multiple Choice</h4>
                {gameMode === 'multiple-choice' && <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pick from 4 options. Fast, fun, and beginner friendly.
              </p>
            </div>
          </div>

          {/* Typed Answer Card */}
          <div
            onClick={() => {
              SoundEngine.playClick();
              setGameMode('typed');
            }}
            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer select-none flex items-start gap-3.5 ${
              gameMode === 'typed'
                ? 'bg-brand-500/10 border-brand-500 shadow-md shadow-brand-500/10 ring-2 ring-brand-500/40'
                : 'glass-card border-slate-200 dark:border-slate-700 hover:border-brand-300'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl font-bold ${
              gameMode === 'typed' ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}>
              ⌨️
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white">Type the Country</h4>
                {gameMode === 'typed' && <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Type the name. Includes smart typo detection & aliases!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Region / Continents Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            2. Choose Region / Continents
          </label>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full border border-brand-500/20">
            {availableCountries.length} countries in pool
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {CONTINENTS.map((item) => {
            const isSelected = item.id === 'world'
              ? continents.includes('world')
              : continents.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleContinent(item.id)}
                className={`p-3 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-brand-500 select-none ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-brand-950 dark:text-white font-bold ring-1 ring-brand-500/40 shadow-sm'
                    : 'glass-card border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-brand-300'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xl">{item.emoji}</span>
                  {isSelected && <Check className="w-4 h-4 text-brand-500" />}
                </div>
                <div className="text-xs sm:text-sm font-bold truncate">{item.name}</div>
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 italic">
          💡 You can select multiple continents to combine them (e.g. Europe + Asia).
        </p>
      </div>

      {/* 3. Number of Questions */}
      <div className="space-y-3">
        <label className="block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300">
          3. Game Length
        </label>
        <div className="grid grid-cols-4 gap-2.5">
          {[10, 20, 50, 'endless'].map((len) => {
            const isSelected = questionCount === len;
            return (
              <button
                key={len}
                type="button"
                onClick={() => {
                  SoundEngine.playClick();
                  setQuestionCount(len);
                }}
                className={`py-3.5 px-2 rounded-2xl border-2 text-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 select-none ${
                  isSelected
                    ? 'bg-brand-500 text-white border-brand-500 font-extrabold shadow-md shadow-brand-500/25 scale-[1.02]'
                    : 'glass-card border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-brand-300'
                }`}
              >
                <span className="text-base sm:text-lg">
                  {len === 'endless' ? '∞ Endless' : `${len} Flags`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Game CTA */}
      <div className="pt-4">
        <Button
          variant="primary"
          size="xl"
          className="w-full text-lg py-4 font-black shadow-xl shadow-brand-500/30"
          onClick={handleStartGame}
          icon={Play}
          iconPosition="right"
        >
          Start Game →
        </Button>
      </div>
    </div>
  );
}
