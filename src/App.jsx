import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import GameSetup from './pages/GameSetup';
import Game from './pages/Game';
import Results from './pages/Results';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import { getStoredSettings } from './utils/storage';
import { SoundEngine } from './utils/sound';

export default function App() {
  const initialSettings = getStoredSettings();
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);

  useEffect(() => {
    // Apply dark class to document root
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Initialize sound engine status
    SoundEngine.setEnabled(initialSettings.soundEnabled);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      darkMode ? 'bg-mesh-dark text-slate-100' : 'bg-mesh-light text-slate-900'
    }`}>
      {/* Top Navigation */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col justify-start">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<GameSetup />} />
          <Route path="/game" element={<Game />} />
          <Route path="/results" element={<Results />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings darkMode={darkMode} setDarkMode={setDarkMode} />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-slate-400 dark:text-slate-500 select-none">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Flagle 🌎 • Guess World Flags & Progressive Reveal</span>
          <span className="text-[11px]">100% Client-Side • GitHub Pages Ready</span>
        </div>
      </footer>
    </div>
  );
}
