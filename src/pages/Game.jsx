import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COUNTRIES } from '../data/countries';
import {
  getFilteredCountries,
  createQuestionQueue,
  generateMultipleChoiceOptions,
  shuffleArray,
} from '../utils/gameLogic';
import { evaluateAnswer } from '../utils/countryMatching';
import { getStoredSetup, getStoredSettings, recordGameSession } from '../utils/storage';
import { SoundEngine } from '../utils/sound';
import { fireStreakConfetti } from '../utils/confetti';

import FlagCard from '../components/game/FlagCard';
import FlagTileCard from '../components/game/FlagTileCard';
import QuestionHeader from '../components/game/QuestionHeader';
import MultipleChoice from '../components/game/MultipleChoice';
import TypedAnswer from '../components/game/TypedAnswer';
import FlagleMode from '../components/game/FlagleMode';
import SpellingModal from '../components/game/SpellingModal';
import AnswerFeedback from '../components/game/AnswerFeedback';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { getCountryComparison } from '../data/countryCoordinates';
import { findCountryByInput } from '../utils/countryMatching';
import { AlertTriangle, Home } from 'lucide-react';

export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();

  // Load setup from state or stored preferences
  const setup = location.state || getStoredSetup();
  const settings = getStoredSettings();

  const gameMode = setup.gameMode || 'multiple-choice';
  const continents = setup.continents || ['world'];
  const totalQuestions = setup.questionCount || 10;
  const isEndless = totalQuestions === 'endless';

  // Pool of candidate countries based on selected continents
  const countryPool = useMemo(() => {
    return getFilteredCountries(continents);
  }, [continents]);

  // Queue of countries for the game
  const [deck, setDeck] = useState(() => createQuestionQueue(countryPool, totalQuestions));
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active question state
  const currentCountry = deck[currentIndex] || countryPool[0];

  const [mcOptions, setMcOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null); // 'correct' | 'spelling_corrected' | 'incorrect' | null
  const [userGuessText, setUserGuessText] = useState('');

  // Flagle progressive reveal state
  const [revealedTiles, setRevealedTiles] = useState([0]);
  const [flagleAttempts, setFlagleAttempts] = useState([]);

  // Scores and streak
  const [correctCount, setCorrectCount] = useState(0);
  const [spellingCount, setSpellingCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [history, setHistory] = useState([]);

  // Spelling typo modal state
  const [spellingModalState, setSpellingModalState] = useState({
    isOpen: false,
    input: '',
    suggestedCountry: null,
  });

  // Leave game modal state
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  // Generate options when currentCountry changes for Multiple Choice or reset Flagle
  useEffect(() => {
    if (gameMode === 'multiple-choice' && currentCountry) {
      const options = generateMultipleChoiceOptions(currentCountry, countryPool, COUNTRIES);
      setMcOptions(options);
    }
    setIsAnswered(false);
    setSelectedOption(null);
    setAnswerStatus(null);
    setUserGuessText('');
    setRevealedTiles([0]);
    setFlagleAttempts([]);
  }, [currentIndex, currentCountry, gameMode, countryPool]);

  // Check if this is the final question of a fixed game
  const isLastQuestion = !isEndless && currentIndex >= deck.length - 1;

  // Handle streak milestones
  const updateStreak = useCallback((isSuccess) => {
    if (isSuccess) {
      setStreak((prev) => {
        const nextStreak = prev + 1;
        setMaxStreak((currentMax) => Math.max(currentMax, nextStreak));
        if (nextStreak > 0 && nextStreak % 5 === 0) {
          SoundEngine.playStreak();
          fireStreakConfetti();
        }
        return nextStreak;
      });
    } else {
      setStreak(0);
    }
  }, []);

  // Finalize answer and record history
  const finalizeAnswer = useCallback(
    (status, userGuess, extraData = {}) => {
      setIsAnswered(true);
      setAnswerStatus(status);
      setUserGuessText(userGuess);

      const recordItem = {
        country: currentCountry,
        userGuess: userGuess,
        status: status,
        questionIndex: currentIndex,
        ...extraData,
      };

      setHistory((prev) => [...prev, recordItem]);

      if (status === 'correct') {
        setCorrectCount((c) => c + 1);
        updateStreak(true);
        SoundEngine.playCorrect();
      } else if (status === 'spelling_corrected') {
        setSpellingCount((c) => c + 1);
        updateStreak(true);
        SoundEngine.playSpellingCorrect();
      } else {
        setIncorrectCount((c) => c + 1);
        updateStreak(false);
        SoundEngine.playIncorrect();
      }
    },
    [currentCountry, currentIndex, updateStreak]
  );

  // Flagle Guess Submit
  const handleFlagleGuess = (countryOrInput) => {
    if (isAnswered) return;

    const guessedCountry = findCountryByInput(countryOrInput, COUNTRIES);
    const guessName = guessedCountry
      ? guessedCountry.name
      : typeof countryOrInput === 'string'
      ? countryOrInput
      : '';

    const isCorrect = guessedCountry ? guessedCountry.code === currentCountry.code : false;
    const comparison = guessedCountry ? getCountryComparison(guessedCountry, currentCountry) : null;

    const newAttempt = {
      country: guessedCountry,
      guessText: guessName,
      isCorrect,
      skipped: false,
      distanceKm: comparison ? comparison.distanceKm : null,
      direction: comparison ? comparison.direction : null,
      sameContinent: comparison ? comparison.sameContinent : false,
      guessedContinent: guessedCountry ? guessedCountry.continent : null,
      targetContinent: currentCountry.continent,
    };

    const nextAttempts = [...flagleAttempts, newAttempt];
    setFlagleAttempts(nextAttempts);

    if (isCorrect) {
      setRevealedTiles([0, 1, 2, 3, 4, 5]);
      finalizeAnswer('correct', guessName, {
        revealsUsed: revealedTiles.length,
        attemptsCount: nextAttempts.length,
      });
    } else {
      // Reveal next tile if available
      let nextTiles = [...revealedTiles];
      if (nextTiles.length < 6) {
        nextTiles = Array.from({ length: nextTiles.length + 1 }, (_, i) => i);
        setRevealedTiles(nextTiles);
      }

      if (nextAttempts.length >= 6) {
        setRevealedTiles([0, 1, 2, 3, 4, 5]);
        finalizeAnswer('incorrect', guessName, {
          revealsUsed: 6,
          attemptsCount: 6,
        });
      } else {
        SoundEngine.playIncorrect();
      }
    }
  };

  // Flagle Skip / Reveal Piece
  const handleFlagleSkip = () => {
    if (isAnswered || revealedTiles.length >= 6) return;

    SoundEngine.playClick();
    const nextTiles = Array.from({ length: revealedTiles.length + 1 }, (_, i) => i);
    setRevealedTiles(nextTiles);

    const skipAttempt = {
      skipped: true,
      country: null,
      guessText: 'Skipped',
      isCorrect: false,
    };

    const nextAttempts = [...flagleAttempts, skipAttempt];
    setFlagleAttempts(nextAttempts);

    if (nextAttempts.length >= 6) {
      setRevealedTiles([0, 1, 2, 3, 4, 5]);
      finalizeAnswer('incorrect', 'Skipped', {
        revealsUsed: 6,
        attemptsCount: 6,
      });
    }
  };

  // Multiple Choice option clicked
  const handleSelectMultipleChoice = (option) => {
    if (isAnswered) return;
    setSelectedOption(option);
    const isCorrect = option.code === currentCountry.code;
    finalizeAnswer(isCorrect ? 'correct' : 'incorrect', option.name);
  };

  // Typed answer submitted
  const handleTypedSubmit = (typedText) => {
    if (isAnswered || !typedText.trim()) return;

    const evalResult = evaluateAnswer(typedText, currentCountry, COUNTRIES);

    if (evalResult.isExact || evalResult.isAlias) {
      finalizeAnswer('correct', typedText);
    } else if (evalResult.isFuzzyMatch && evalResult.suggestedCountry) {
      // Open spelling confirmation modal
      setSpellingModalState({
        isOpen: true,
        input: typedText,
        suggestedCountry: evalResult.suggestedCountry,
      });
    } else {
      finalizeAnswer('incorrect', typedText);
    }
  };

  // Spelling modal confirmed ("Yes, I meant ...")
  const handleConfirmSpelling = () => {
    const input = spellingModalState.input;
    setSpellingModalState({ isOpen: false, input: '', suggestedCountry: null });
    finalizeAnswer('spelling_corrected', input);
  };

  // Spelling modal rejected ("No, guessing something else")
  const handleRejectSpelling = () => {
    const input = spellingModalState.input;
    setSpellingModalState({ isOpen: false, input: '', suggestedCountry: null });
    finalizeAnswer('incorrect', input);
  };

  // Move to next question or replenish endless deck
  const handleNextQuestion = () => {
    if (isEndless) {
      if (currentIndex >= deck.length - 1) {
        // Replenish deck with reshuffled pool
        const moreQuestions = shuffleArray(countryPool);
        setDeck((prev) => [...prev, ...moreQuestions]);
      }
      setCurrentIndex((prev) => prev + 1);
    } else if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleFinishGame();
    }
  };

  // Complete game and navigate to results
  const handleFinishGame = () => {
    const sessionSummary = {
      gameMode,
      continents,
      totalQuestions: isEndless ? currentIndex + 1 : deck.length,
      questionsAnswered: currentIndex + 1,
      correctCount: correctCount + (answerStatus === 'correct' ? 0 : 0),
      spellingMistakeCount: spellingCount,
      incorrectCount: incorrectCount,
      score: correctCount + spellingCount,
      maxStreak: Math.max(maxStreak, streak),
      history: history,
    };

    recordGameSession(sessionSummary);
    SoundEngine.playVictory();
    navigate('/results', { state: sessionSummary });
  };

  // Exit game handling
  const handleExitClick = () => {
    if (settings.confirmLeave && currentIndex > 0 && !isAnswered) {
      setIsLeaveModalOpen(true);
    } else {
      navigate('/setup');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-2 sm:py-4 space-y-4 sm:space-y-5 animate-fade-in">
      {/* Header with question progress, scores, streak, exit */}
      <QuestionHeader
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        streak={streak}
        correctCount={correctCount}
        spellingCount={spellingCount}
        incorrectCount={incorrectCount}
        onExitClick={handleExitClick}
        gameMode={gameMode}
      />

      {/* Flag Display Card (Tile Card for Flagle, standard card for others) */}
      {gameMode === 'flagle' ? (
        <FlagTileCard
          country={currentCountry}
          revealedIndices={revealedTiles}
          isFullyRevealed={isAnswered}
        />
      ) : (
        <FlagCard country={currentCountry} />
      )}

      {/* Question Prompt */}
      <div className="text-center">
        <h3 className="text-base sm:text-lg font-bold text-slate-700 dark:text-slate-200">
          {gameMode === 'flagle'
            ? 'Guess the country from the revealed pieces of its flag!'
            : 'Which country does this flag belong to?'}
        </h3>
      </div>

      {/* Game Mode Interaction */}
      {gameMode === 'flagle' ? (
        <FlagleMode
          targetCountry={currentCountry}
          allCountries={COUNTRIES}
          attempts={flagleAttempts}
          maxAttempts={6}
          isAnswered={isAnswered}
          onGuessSubmit={handleFlagleGuess}
          onSkipReveal={handleFlagleSkip}
          revealedCount={revealedTiles.length}
        />
      ) : gameMode === 'multiple-choice' ? (
        <MultipleChoice
          options={mcOptions}
          correctCountry={currentCountry}
          selectedAnswer={selectedOption}
          onSelectOption={handleSelectMultipleChoice}
          isAnswered={isAnswered}
        />
      ) : (
        <TypedAnswer
          onSubmit={handleTypedSubmit}
          isAnswered={isAnswered}
          correctCountry={currentCountry}
        />
      )}

      {/* Answer Feedback Banner & Next Button */}
      {isAnswered && (
        <AnswerFeedback
          status={answerStatus}
          country={currentCountry}
          userGuess={userGuessText}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={isLastQuestion}
          onFinishGame={handleFinishGame}
          autoAdvance={gameMode === 'multiple-choice'}
          autoAdvanceDuration={5000}
        />
      )}

      {/* Spelling Check Confirmation Modal */}
      <SpellingModal
        isOpen={spellingModalState.isOpen}
        userInput={spellingModalState.input}
        suggestedCountry={spellingModalState.suggestedCountry}
        onConfirmSpelling={handleConfirmSpelling}
        onRejectSpelling={handleRejectSpelling}
      />

      {/* Leave Game Confirmation Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Leave Current Game?"
        maxWidth="max-w-sm"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to quit? Your active session progress will be lost.
            </p>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button
              variant="secondary"
              onClick={() => setIsLeaveModalOpen(false)}
            >
              Keep Playing
            </Button>
            <Button
              variant="rose"
              onClick={() => {
                setIsLeaveModalOpen(false);
                navigate('/setup');
              }}
            >
              Quit Game
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
