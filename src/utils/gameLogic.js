/**
 * Game Logic & Question Generation Engine
 */

import { COUNTRIES } from '../data/countries.js';

/**
 * Fisher-Yates Array Shuffle
 */
export function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Filters the country list based on selected continents
 * @param {Array<string>} selectedContinents - e.g. ['world'] or ['Europe', 'Asia']
 */
export function getFilteredCountries(selectedContinents = ['world']) {
  if (!selectedContinents || selectedContinents.length === 0 || selectedContinents.includes('world')) {
    return COUNTRIES;
  }
  return COUNTRIES.filter((c) => selectedContinents.includes(c.continent));
}

/**
 * Generates an array of target countries for the session
 * Gracefully handles small pools (e.g., Oceania with 17 countries and a 50-question game)
 */
export function createQuestionQueue(countryPool, totalQuestions) {
  if (!countryPool || countryPool.length === 0) {
    countryPool = COUNTRIES;
  }

  // Endless mode: start with a full shuffled deck
  if (totalQuestions === 'endless') {
    return shuffleArray(countryPool);
  }

  const count = parseInt(totalQuestions, 10) || 10;
  let queue = [];

  while (queue.length < count) {
    const remainingNeeded = count - queue.length;
    const shuffled = shuffleArray(countryPool);
    if (shuffled.length <= remainingNeeded) {
      queue = queue.concat(shuffled);
    } else {
      queue = queue.concat(shuffled.slice(0, remainingNeeded));
    }
  }

  return queue;
}

/**
 * Generates 4 multiple choice options with 1 correct and 3 distinct distractors
 * Ensures the correct answer is randomly placed among the 4 slots
 */
export function generateMultipleChoiceOptions(correctCountry, pool = COUNTRIES, allCountries = COUNTRIES) {
  const distractors = [];
  
  // Prefer distractors from the same selected pool/continent first
  let candidates = pool.filter((c) => c.code !== correctCountry.code);
  
  // If the candidate pool is too small (< 3), supplement from all countries
  if (candidates.length < 3) {
    const extraCandidates = allCountries.filter(
      (c) => c.code !== correctCountry.code && !candidates.some((item) => item.code === c.code)
    );
    candidates = candidates.concat(extraCandidates);
  }

  const shuffledCandidates = shuffleArray(candidates);
  for (let i = 0; i < 3 && i < shuffledCandidates.length; i++) {
    distractors.push(shuffledCandidates[i]);
  }

  // Combine and shuffle the 4 options
  const allOptions = shuffleArray([correctCountry, ...distractors]);
  return allOptions;
}

/**
 * Calculates score percentage
 */
export function calculateAccuracy(correct, total) {
  if (!total || total === 0) return 0;
  return Math.round((correct / total) * 100);
}
