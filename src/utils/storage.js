/**
 * LocalStorage Persistence for Statistics, Settings, and Setup Preferences
 */

const STORAGE_KEYS = {
  STATS: 'flagguess_stats_v1',
  SETTINGS: 'flagguess_settings_v1',
  SETUP: 'flagguess_setup_v1',
};

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  animationsEnabled: true,
  darkMode: false,
  confirmLeave: true,
};

const DEFAULT_SETUP = {
  gameMode: 'flagle',
  continents: ['world'],
  questionCount: 10,
};

const DEFAULT_STATS = {
  totalGamesPlayed: 0,
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  totalSpellingMistakes: 0,
  totalIncorrect: 0,
  highestStreak: 0,
  gameModeCount: {
    'flagle': 0,
    'multiple-choice': 0,
    'typed': 0,
  },
  continentStats: {
    'Africa': { asked: 0, correct: 0 },
    'Asia': { asked: 0, correct: 0 },
    'Europe': { asked: 0, correct: 0 },
    'North America': { asked: 0, correct: 0 },
    'South America': { asked: 0, correct: 0 },
    'Oceania': { asked: 0, correct: 0 },
  },
  countryStats: {}, // { [code]: { name, asked, correct, spelling, incorrect } }
  lastPlayed: null,
};

export function getStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      // Check system color scheme preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      return { ...DEFAULT_SETTINGS, darkMode: prefersDark };
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {}
}

export function getStoredSetup() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETUP);
    if (!raw) return DEFAULT_SETUP;
    return { ...DEFAULT_SETUP, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_SETUP;
  }
}

export function saveStoredSetup(setup) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETUP, JSON.stringify(setup));
  } catch (e) {}
}

export function getStoredStats() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      gameModeCount: { ...DEFAULT_STATS.gameModeCount, ...(parsed.gameModeCount || {}) },
      continentStats: { ...DEFAULT_STATS.continentStats, ...(parsed.continentStats || {}) },
      countryStats: { ...(parsed.countryStats || {}) },
    };
  } catch (e) {
    return { ...DEFAULT_STATS };
  }
}

/**
 * Updates stats with a completed or ended game session
 */
export function recordGameSession(sessionData) {
  try {
    const currentStats = getStoredStats();
    const {
      gameMode,
      questionsAnswered = 0,
      correctCount = 0,
      spellingMistakeCount = 0,
      incorrectCount = 0,
      maxStreak = 0,
      history = [],
    } = sessionData;

    // Only count as a game played if at least 1 question was answered
    if (questionsAnswered > 0) {
      currentStats.totalGamesPlayed += 1;
    }

    currentStats.totalQuestionsAnswered += questionsAnswered;
    currentStats.totalCorrect += correctCount;
    currentStats.totalSpellingMistakes += spellingMistakeCount;
    currentStats.totalIncorrect += incorrectCount;
    currentStats.highestStreak = Math.max(currentStats.highestStreak, maxStreak);

    if (gameMode) {
      currentStats.gameModeCount[gameMode] = (currentStats.gameModeCount[gameMode] || 0) + 1;
    }

    // Process individual question history for detailed insights
    history.forEach((item) => {
      const { country, status } = item;
      if (!country || !country.code) return;

      const code = country.code;
      const continent = country.continent;

      // Continent stats
      if (continent && currentStats.continentStats[continent]) {
        currentStats.continentStats[continent].asked += 1;
        if (status === 'correct' || status === 'spelling_corrected') {
          currentStats.continentStats[continent].correct += 1;
        }
      }

      // Individual country stats
      if (!currentStats.countryStats[code]) {
        currentStats.countryStats[code] = {
          name: country.name,
          continent: country.continent,
          asked: 0,
          correct: 0,
          spelling: 0,
          incorrect: 0,
        };
      }

      const cStat = currentStats.countryStats[code];
      cStat.asked += 1;
      if (status === 'correct') {
        cStat.correct += 1;
      } else if (status === 'spelling_corrected') {
        cStat.spelling += 1;
      } else {
        cStat.incorrect += 1;
      }
    });

    currentStats.lastPlayed = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(currentStats));
    return currentStats;
  } catch (e) {
    console.error('Failed to save stats', e);
    return DEFAULT_STATS;
  }
}

export function resetStoredStats() {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    return { ...DEFAULT_STATS };
  } catch (e) {
    return { ...DEFAULT_STATS };
  }
}
