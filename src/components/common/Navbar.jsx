import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Globe, BarChart2, Settings as SettingsIcon, Moon, Sun, Play } from 'lucide-react';
import { SoundEngine } from '../../utils/sound';

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();
  const isGamePage = location.pathname === '/game';

  const toggleTheme = () => {
    SoundEngine.playClick();
    setDarkMode(!darkMode);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => SoundEngine.playClick()}
          className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-xl px-1.5 py-1"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5 animate-pulse-glow" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 dark:from-brand-400 dark:to-cyan-300 bg-clip-text text-transparent leading-none">
              Flagle
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              Flag Quiz
            </span>
          </div>
        </Link>

        {/* Navigation Links & Controls */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {!isGamePage && (
            <Link
              to="/setup"
              onClick={() => SoundEngine.playClick()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-sm shadow-brand-500/30 transition-all hover:scale-105 active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Play Now</span>
            </Link>
          )}

          <Link
            to="/statistics"
            onClick={() => SoundEngine.playClick()}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              location.pathname === '/statistics'
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Statistics"
            aria-label="Statistics"
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden md:inline">Stats</span>
          </Link>

          <Link
            to="/settings"
            onClick={() => SoundEngine.playClick()}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              location.pathname === '/settings'
                ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/50 dark:text-brand-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Settings"
            aria-label="Settings"
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden md:inline">Settings</span>
          </Link>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-scale-in" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 animate-scale-in" />
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
