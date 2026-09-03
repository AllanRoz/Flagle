import { COUNTRIES, TOTAL_COUNTRIES_COUNT } from '../src/data/countries.js';
import { CONTINENTS, CONTINENT_NAMES } from '../src/data/continents.js';
import {
  normalizeString,
  damerauLevenshteinDistance,
  evaluateAnswer,
  getNormalizedCountryNames,
} from '../src/utils/countryMatching.js';
import {
  getFilteredCountries,
  createQuestionQueue,
  generateMultipleChoiceOptions,
  calculateAccuracy,
} from '../src/utils/gameLogic.js';
import { findCountryByInput } from '../src/utils/countryMatching.js';
import {
  calculateDistanceKm,
  calculateCompassBearing,
  getCountryComparison,
  getCountryCoordinates,
} from '../src/data/countryCoordinates.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n--- 1. Testing Dataset & Continents ---');
assert(COUNTRIES.length >= 240, `Dataset contains ${COUNTRIES.length} countries (expected >= 240)`);
assert(CONTINENT_NAMES.length === 6, `Has 6 continent definitions`);
const europe = COUNTRIES.filter((c) => c.continent === 'Europe');
const asia = COUNTRIES.filter((c) => c.continent === 'Asia');
const africa = COUNTRIES.filter((c) => c.continent === 'Africa');
const na = COUNTRIES.filter((c) => c.continent === 'North America');
const sa = COUNTRIES.filter((c) => c.continent === 'South America');
const oceania = COUNTRIES.filter((c) => c.continent === 'Oceania');
assert(europe.length >= 45, `Europe has ${europe.length} countries`);
assert(asia.length >= 45, `Asia has ${asia.length} countries`);
assert(africa.length >= 50, `Africa has ${africa.length} countries`);
assert(na.length >= 20, `North America has ${na.length} countries`);
assert(sa.length >= 12, `South America has ${sa.length} countries`);
assert(oceania.length >= 14, `Oceania has ${oceania.length} countries`);

console.log('\n--- 2. Testing String Normalization ---');
assert(normalizeString('  JAPAN  ') === 'japan', 'Trims and lowercases');
assert(normalizeString("Côte d'Ivoire") === 'cote d ivoire', 'Removes accents and apostrophes');
assert(normalizeString('The United States') === 'united states', 'Removes leading "The "');
assert(normalizeString('United   States') === 'united states', 'Collapses whitespace');

console.log('\n--- 3. Testing Damerau-Levenshtein Distance ---');
assert(damerauLevenshteinDistance('japan', 'japan') === 0, 'Exact match distance 0');
assert(damerauLevenshteinDistance('jpan', 'japan') === 1, 'Deletion distance 1 (jpan)');
assert(damerauLevenshteinDistance('frnace', 'france') === 1, 'Transposition distance 1 (frnace)');
assert(damerauLevenshteinDistance('untied states', 'united states') === 1, 'Transposition distance 1 (untied states)');

console.log('\n--- 4. Testing Typed Answer & Fuzzy Evaluator ---');
const japan = COUNTRIES.find((c) => c.code === 'JP');
const usa = COUNTRIES.find((c) => c.code === 'US');
const france = COUNTRIES.find((c) => c.code === 'FR');

// Exact & Alias
assert(evaluateAnswer('Japan', japan, COUNTRIES).isExact === true, 'Japan exact match');
assert(evaluateAnswer('japan', japan, COUNTRIES).isExact === true, 'japan lowercase match');
assert(evaluateAnswer('JAPAN', japan, COUNTRIES).isExact === true, 'JAPAN uppercase match');
assert(evaluateAnswer('USA', usa, COUNTRIES).isExact === true, 'USA alias match');
assert(evaluateAnswer('United States', usa, COUNTRIES).isExact === true, 'United States primary match');
assert(evaluateAnswer('America', usa, COUNTRIES).isExact === true, 'America alias match');

// Fuzzy Typo Triggers
const fuzzyJapan1 = evaluateAnswer('Jpan', japan, COUNTRIES);
assert(fuzzyJapan1.isFuzzyMatch === true && fuzzyJapan1.isCorrect === false, 'Jpan triggers fuzzy suggestion');

const fuzzyJapan2 = evaluateAnswer('Japn', japan, COUNTRIES);
assert(fuzzyJapan2.isFuzzyMatch === true && fuzzyJapan2.isCorrect === false, 'Japn triggers fuzzy suggestion');

const fuzzyFrance = evaluateAnswer('Frnace', france, COUNTRIES);
assert(fuzzyFrance.isFuzzyMatch === true && fuzzyFrance.isCorrect === false, 'Frnace triggers fuzzy suggestion for France');

const fuzzyUSA = evaluateAnswer('Untied States', usa, COUNTRIES);
assert(fuzzyUSA.isFuzzyMatch === true && fuzzyUSA.isCorrect === false, 'Untied States triggers fuzzy suggestion for USA');

// Wrong Country Guess
const wrongGuess = evaluateAnswer('Italy', france, COUNTRIES);
assert(wrongGuess.isCorrect === false && wrongGuess.isFuzzyMatch === false, 'Italy is not fuzzy matched to France');

console.log('\n--- 5. Testing Game Logic & Multiple Choice ---');
const worldPool = getFilteredCountries(['world']);
assert(worldPool.length === COUNTRIES.length, 'World pool contains all countries');

const europePool = getFilteredCountries(['Europe']);
assert(europePool.length === europe.length, 'Filtered Europe pool matches count');

const combinedPool = getFilteredCountries(['Europe', 'Asia']);
assert(combinedPool.length === europe.length + asia.length, 'Combined Europe + Asia pool works');

const deck10 = createQuestionQueue(worldPool, 10);
assert(deck10.length === 10, 'Deck 10 has 10 questions');

const deckOceania50 = createQuestionQueue(oceania, 50);
assert(deckOceania50.length === 50, 'Small oceania pool handles 50 questions without breaking');

const mcOptions = generateMultipleChoiceOptions(japan, worldPool, COUNTRIES);
assert(mcOptions.length === 4, 'Multiple choice generates 4 options');
assert(mcOptions.some((o) => o.code === 'JP'), 'Multiple choice contains correct country');
const uniqueCodes = new Set(mcOptions.map((o) => o.code));
assert(uniqueCodes.size === 4, 'Multiple choice options are 4 distinct countries');

console.log('\n--- 6. Accuracy Calculation ---');
assert(calculateAccuracy(8, 10) === 80, '8/10 = 80%');
assert(calculateAccuracy(10, 10) === 100, '10/10 = 100%');
assert(calculateAccuracy(0, 10) === 0, '0/10 = 0%');

console.log('\n--- 7. Testing Flagle Geographic & Coordinate Calculations ---');
const distParisBerlin = calculateDistanceKm(46.2276, 2.2137, 51.1657, 10.4515);
assert(distParisBerlin > 700 && distParisBerlin < 1000, `Paris to Berlin distance is reasonable: ${distParisBerlin} km`);

const bearingNorth = calculateCompassBearing(0, 0, 10, 0);
assert(bearingNorth.arrow === '⬆️' && bearingNorth.label === 'N', 'Direction North gives ⬆️ N');

const bearingEast = calculateCompassBearing(0, 0, 0, 10);
assert(bearingEast.arrow === '➡️' && bearingEast.label === 'E', 'Direction East gives ➡️ E');

const compFranceJapan = getCountryComparison(france, japan);
assert(compFranceJapan.sameContinent === false, 'France and Japan are different continents');
assert(compFranceJapan.distanceKm > 8000, 'France to Japan distance > 8000 km');
assert(compFranceJapan.direction.arrow.length > 0, 'Compass arrow returned');

const compFranceGermany = getCountryComparison(france, COUNTRIES.find((c) => c.code === 'DE'));
assert(compFranceGermany.sameContinent === true, 'France and Germany are same continent (Europe)');

console.log('\n--- 8. Testing findCountryByInput Helper ---');
const foundUSA = findCountryByInput('USA', COUNTRIES);
assert(foundUSA && foundUSA.code === 'US', 'findCountryByInput("USA") resolves to US');

const foundGermany = findCountryByInput('Deutschland', COUNTRIES);
assert(foundGermany && foundGermany.code === 'DE', 'findCountryByInput("Deutschland") alias resolves to DE');

const foundTypo = findCountryByInput('Frnace', COUNTRIES);
assert(foundTypo && foundTypo.code === 'FR', 'findCountryByInput("Frnace") typo resolves to France');

console.log(`\n=============================`);
console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
console.log(`=============================\n`);

if (failed > 0) {
  process.exit(1);
}
