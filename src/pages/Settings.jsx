import React, { useState } from 'react';
import { getStoredSettings, saveStoredSettings, resetStoredStats } from '../utils/storage';
import { SoundEngine } from '../utils/sound';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import {
  Volume2,
  VolumeX,
  Moon,
  Sun,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Sliders,
  Info,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function Settings({ darkMode, setDarkMode }) {
  const [settings, setSettings] = useState(getStoredSettings);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const updateSetting = (key, value) => {
    SoundEngine.playClick();
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    saveStoredSettings(updated);

    if (key === 'soundEnabled') {
      SoundEngine.setEnabled(value);
      if (value) SoundEngine.playCorrect();
    }
  };

  const handleToggleDark = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    updateSetting('darkMode', nextDark);
  };

  const handleTestSound = () => {
    SoundEngine.playStreak();
  };

  const handleResetStats = () => {
    resetStoredStats();
    setIsResetModalOpen(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
          <Sliders className="w-7 h-7 text-brand-500" />
          <span>Game Settings</span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
          Customize your FlagGuess sound, visuals, and gameplay preferences
        </p>
      </div>

      <div className="space-y-4">
        {/* Sound Effects */}
        <Card className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
              {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Sound Effects</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Web Audio synthesizer for correct answers, streaks, and clicks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {settings.soundEnabled && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestSound}
                className="text-xs px-2.5 py-1"
              >
                Test Sound
              </Button>
            )}

            <button
              onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                settings.soundEnabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={settings.soundEnabled}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </Card>

        {/* Dark Mode */}
        <Card className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-500" />}
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Dark Theme</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Toggle between sleek dark mode and bright daylight theme
              </p>
            </div>
          </div>

          <button
            onClick={handleToggleDark}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              darkMode ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            role="switch"
            aria-checked={darkMode}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </Card>

        {/* Confirm Before Leaving */}
        <Card className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Confirm Before Leaving Game</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prompt confirmation if exiting during an active quiz
              </p>
            </div>
          </div>

          <button
            onClick={() => updateSetting('confirmLeave', !settings.confirmLeave)}
            className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              settings.confirmLeave ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            role="switch"
            aria-checked={settings.confirmLeave}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.confirmLeave ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </Card>

        {/* Reset Statistics Section */}
        <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-rose-200 dark:border-rose-900/40">
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">Reset Player Statistics</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clear all saved game records, scores, streaks, and missed country stats
            </p>
          </div>

          <Button
            variant="rose"
            size="sm"
            onClick={() => setIsResetModalOpen(true)}
            icon={RotateCcw}
            className="w-full sm:w-auto"
          >
            Reset Statistics
          </Button>
        </Card>

        {resetSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500 text-emerald-800 dark:text-emerald-300 text-xs font-bold text-center animate-fade-in">
            ✓ All statistics have been reset successfully!
          </div>
        )}
      </div>

      {/* About & Technical Info */}
      <Card className="space-y-3 bg-slate-50/80 dark:bg-slate-900/50">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-500" />
          <span>About FlagGuess</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          FlagGuess is a 100% client-side web application built with React, Vite, and Tailwind CSS.
          Designed for seamless offline caching, zero external API keys, and deployment to GitHub Pages.
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800">240+ Countries</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800">Web Audio Synth</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800">Fuzzy Typo Matcher</span>
          <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800">GitHub Pages Ready</span>
        </div>
      </Card>

      {/* Reset Confirmation Modal */}
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
              onClick={handleResetStats}
            >
              Yes, Reset
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
