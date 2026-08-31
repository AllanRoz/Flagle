import React, { useEffect } from 'react';
import Button from '../common/Button';
import { CheckCircle2, XCircle, ArrowRight, Edit3, Flag } from 'lucide-react';

export default function AnswerFeedback({
  status, // 'correct' | 'spelling_corrected' | 'incorrect'
  country,
  userGuess,
  onNextQuestion,
  isLastQuestion,
  onFinishGame,
}) {
  // Listen for Enter or Space to quickly advance
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (isLastQuestion && onFinishGame) {
          onFinishGame();
        } else {
          onNextQuestion();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextQuestion, isLastQuestion, onFinishGame]);

  if (!status || !country) return null;

  const isCorrect = status === 'correct';
  const isSpelling = status === 'spelling_corrected';
  const isIncorrect = status === 'incorrect';

  let bannerStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-200';
  let title = 'Correct!';
  let Icon = CheckCircle2;
  let iconColor = 'text-emerald-500';

  if (isSpelling) {
    bannerStyle = 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200';
    title = 'Correct (Spelling Mistake)';
    Icon = Edit3;
    iconColor = 'text-amber-500';
  } else if (isIncorrect) {
    bannerStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200';
    title = 'Incorrect!';
    Icon = XCircle;
    iconColor = 'text-rose-500';
  }

  return (
    <div className={`w-full max-w-xl mx-auto p-4 sm:p-5 rounded-2xl border-2 shadow-lg animate-slide-up transition-all ${bannerStyle} space-y-3`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Icon className={`w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0 ${iconColor} animate-scale-in`} />
          <div>
            <h4 className="font-extrabold text-base sm:text-lg leading-tight">{title}</h4>
            <p className="text-xs sm:text-sm font-semibold opacity-90">
              {country.name}
            </p>
          </div>
        </div>

        <div className="hidden sm:flex flex-col text-right text-xs opacity-75">
          <span className="font-bold">{country.continent}</span>
          <span>Capital: {country.capital}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-current/10">
        <span className="text-xs opacity-75 font-medium hidden sm:inline">
          Press Space or Enter for next
        </span>

        <Button
          variant={isIncorrect ? 'rose' : isSpelling ? 'amber' : 'emerald'}
          size="md"
          className="w-full sm:w-auto ml-auto px-6 py-2.5 font-bold text-sm sm:text-base shadow-md"
          onClick={isLastQuestion && onFinishGame ? onFinishGame : onNextQuestion}
          icon={ArrowRight}
          iconPosition="right"
        >
          {isLastQuestion ? 'View Results' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
}
