import React, { useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { HelpCircle, Check, X, AlertCircle } from 'lucide-react';

export default function SpellingModal({
  isOpen,
  userInput,
  suggestedCountry,
  onConfirmSpelling,
  onRejectSpelling,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'y' || e.key === 'Y' || e.key === 'Enter') {
        e.preventDefault();
        onConfirmSpelling();
      } else if (e.key === 'n' || e.key === 'N' || e.key === 'Escape') {
        e.preventDefault();
        onRejectSpelling();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onConfirmSpelling, onRejectSpelling]);

  if (!isOpen || !suggestedCountry) return null;

  return (
    <Modal isOpen={isOpen} onClose={onRejectSpelling} title="Spelling Check" maxWidth="max-w-md">
      <div className="space-y-5 text-center sm:text-left">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center flex-shrink-0 text-amber-600 dark:text-amber-400 mx-auto sm:mx-0">
            <HelpCircle className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Unrecognized exact match</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              You entered: <span className="font-semibold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">"{userInput}"</span>
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Did you mean:</p>
          <p className="text-xl font-extrabold text-brand-600 dark:text-brand-400">
            {suggestedCountry.name}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {suggestedCountry.continent} • Capital: {suggestedCountry.capital}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <Button
            variant="emerald"
            size="lg"
            className="w-full font-bold flex-1 py-3 text-sm sm:text-base"
            onClick={onConfirmSpelling}
            icon={Check}
          >
            Yes, I meant {suggestedCountry.name}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto font-semibold py-3 text-sm"
            onClick={onRejectSpelling}
            icon={X}
          >
            No, something else
          </Button>
        </div>
      </div>
    </Modal>
  );
}
