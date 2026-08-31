import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ScoreCard from '../components/results/ScoreCard';
import ReviewGrid from '../components/results/ReviewGrid';
import Button from '../components/common/Button';
import { fireConfetti } from '../utils/confetti';
import { SoundEngine } from '../utils/sound';
import { RotateCcw, Sliders, BarChart2, Home } from 'lucide-react';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const session = location.state;

  // If no session state (e.g. accessed directly via URL), redirect to setup
  useEffect(() => {
    if (!session) {
      navigate('/setup', { replace: true });
      return;
    }

    const accuracy = session.totalQuestions > 0
      ? ((session.correctCount + session.spellingMistakeCount) / session.totalQuestions) * 100
      : 0;

    if (accuracy >= 60) {
      fireConfetti();
    }
  }, [session, navigate]);

  if (!session) return null;

  const handlePlayAgain = () => {
    SoundEngine.playClick();
    navigate('/game', {
      state: {
        gameMode: session.gameMode,
        continents: session.continents,
        questionCount: session.totalQuestions,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-4 sm:py-6 space-y-6 sm:space-y-8 animate-fade-in">
      {/* Score and Rating Card */}
      <ScoreCard
        score={session.score}
        total={session.totalQuestions}
        correctCount={session.correctCount}
        spellingCount={session.spellingMistakeCount}
        incorrectCount={session.incorrectCount}
        maxStreak={session.maxStreak}
        gameMode={session.gameMode}
      />

      {/* Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full py-3.5 text-sm sm:text-base font-extrabold shadow-md shadow-brand-500/25"
          onClick={handlePlayAgain}
          icon={RotateCcw}
        >
          Play Again
        </Button>

        <Link to="/setup" className="w-full">
          <Button
            variant="secondary"
            size="lg"
            className="w-full py-3.5 text-sm sm:text-base"
            icon={Sliders}
          >
            New Game
          </Button>
        </Link>

        <Link to="/statistics" className="w-full">
          <Button
            variant="secondary"
            size="lg"
            className="w-full py-3.5 text-sm sm:text-base"
            icon={BarChart2}
          >
            Statistics
          </Button>
        </Link>

        <Link to="/" className="w-full">
          <Button
            variant="ghost"
            size="lg"
            className="w-full py-3.5 text-sm sm:text-base border border-slate-200 dark:border-slate-700"
            icon={Home}
          >
            Home
          </Button>
        </Link>
      </div>

      {/* Interactive Question Review Section */}
      <ReviewGrid history={session.history} />
    </div>
  );
}
