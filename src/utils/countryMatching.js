/**
 * Country Name Normalization and Fuzzy Matching System
 */

/**
 * Normalizes a string by:
 * - Lowercasing
 * - Stripping accents/diacritics (e.g., Côte d'Ivoire -> Cote d'Ivoire)
 * - Removing punctuation (periods, commas, hyphens, apostrophes, parentheses)
 * - Removing leading "the "
 * - Collapsing multiple whitespaces to single space and trimming
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/['’`\.,\-_/\\()]/g, ' ') // replace punctuation with space
    .replace(/^the\s+/, '') // remove leading "the "
    .replace(/\s+/g, ' ') // collapse multi-spaces
    .trim();
}

/**
 * Computes the Damerau-Levenshtein Distance between two strings
 * Handles insertions, deletions, substitutions, and adjacent transpositions (e.g. "Frnace" <-> "France")
 */
export function damerauLevenshteinDistance(source, target) {
  if (!source) return target ? target.length : 0;
  if (!target) return source ? source.length : 0;

  const m = source.length;
  const n = target.length;
  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = source[i - 1] === target[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && source[i - 1] === target[j - 2] && source[i - 2] === target[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[m][n];
}

/**
 * Calculates string similarity ratio between 0 and 1
 */
export function getSimilarity(s1, s2) {
  const maxLen = Math.max(s1.length, s2.length);
  if (maxLen === 0) return 1.0;
  const dist = damerauLevenshteinDistance(s1, s2);
  return 1 - dist / maxLen;
}

/**
 * Gets all normalized names and aliases for a country
 */
export function getNormalizedCountryNames(country) {
  const names = [country.name, ...(country.aliases || [])];
  return names.map(normalizeString).filter(Boolean);
}

/**
 * Determines if distance qualifies as a likely typo / misspelling
 */
export function isLikelyTypo(input, targetName) {
  const len = targetName.length;
  const dist = damerauLevenshteinDistance(input, targetName);
  const similarity = getSimilarity(input, targetName);

  if (dist === 0) return false; // exact match, not a typo

  // Very short names (3 chars like USA, UAE): dist must be <= 1 and min len 2
  if (len <= 3) {
    return dist === 1 && input.length >= 2;
  }

  // Medium names (4-7 chars like Japan, France, Spain, Brazil): dist <= 2, similarity >= 0.65
  if (len <= 7) {
    return dist <= 2 && similarity >= 0.65;
  }

  // Longer names (8+ chars like United States, Germany, Australia): dist <= 3, similarity >= 0.70
  return dist <= 3 && similarity >= 0.70;
}

/**
 * Evaluates the player's typed answer against the target country
 * Returns:
 * {
 *   isCorrect: boolean,
 *   isExact: boolean,
 *   isAlias: boolean,
 *   isFuzzyMatch: boolean,
 *   suggestedCountry: Country | null,
 *   normalizedInput: string
 * }
 */
export function evaluateAnswer(rawInput, targetCountry, allCountries = []) {
  const normalizedInput = normalizeString(rawInput);
  if (!normalizedInput) {
    return {
      isCorrect: false,
      isExact: false,
      isAlias: false,
      isFuzzyMatch: false,
      suggestedCountry: null,
      normalizedInput: ''
    };
  }

  const targetNames = getNormalizedCountryNames(targetCountry);

  // 1. Check Exact Primary Name Match
  const normalizedPrimary = normalizeString(targetCountry.name);
  if (normalizedInput === normalizedPrimary) {
    return {
      isCorrect: true,
      isExact: true,
      isAlias: false,
      isFuzzyMatch: false,
      suggestedCountry: targetCountry,
      normalizedInput
    };
  }

  // 2. Check Alias Match
  if (targetNames.includes(normalizedInput)) {
    return {
      isCorrect: true,
      isExact: true,
      isAlias: true,
      isFuzzyMatch: false,
      suggestedCountry: targetCountry,
      normalizedInput
    };
  }

  // 3. Check Fuzzy Match against the target country's name or aliases
  for (const name of targetNames) {
    if (isLikelyTypo(normalizedInput, name)) {
      return {
        isCorrect: false, // Needs user confirmation!
        isExact: false,
        isAlias: false,
        isFuzzyMatch: true,
        suggestedCountry: targetCountry,
        normalizedInput
      };
    }
  }

  // 4. If not fuzzy matching the target country, check if user mistyped SOME OTHER country
  // We can see if it's closer to another country or just completely unrecognized
  let closestOtherCountry = null;
  let bestOtherDist = Infinity;

  if (allCountries && allCountries.length > 0) {
    for (const c of allCountries) {
      if (c.code === targetCountry.code) continue;
      const cNames = getNormalizedCountryNames(c);
      for (const name of cNames) {
        const dist = damerauLevenshteinDistance(normalizedInput, name);
        if (dist < bestOtherDist) {
          bestOtherDist = dist;
          closestOtherCountry = c;
        }
      }
    }
  }

  // If the user typed an exact or close match to ANOTHER country, it is definitely a wrong guess
  return {
    isCorrect: false,
    isExact: false,
    isAlias: false,
    isFuzzyMatch: false,
    suggestedCountry: null,
    normalizedInput
  };
}
