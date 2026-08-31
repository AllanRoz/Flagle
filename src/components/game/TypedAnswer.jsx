import React, { useState, useEffect, useRef } from 'react';
import Button from '../common/Button';
import { Send, X, CornerDownLeft } from 'lucide-react';

export default function TypedAnswer({ onSubmit, isAnswered, correctCountry }) {
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setInputVal('');
    if (!isAnswered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [correctCountry?.code, isAnswered]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAnswered || !inputVal.trim()) return;
    onSubmit(inputVal.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-4 space-y-3">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          disabled={isAnswered}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type country name (e.g. Japan, France, USA)..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          className="w-full py-3.5 pl-4 pr-12 text-base sm:text-lg font-medium rounded-2xl glass-input transition-all duration-200 shadow-inner"
        />

        {inputVal && !isAnswered && (
          <button
            type="button"
            onClick={() => {
              setInputVal('');
              if (inputRef.current) inputRef.current.focus();
            }}
            className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Clear input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <CornerDownLeft className="w-3.5 h-3.5" /> Press Enter to submit
        </span>

        <Button
          type="submit"
          disabled={isAnswered || !inputVal.trim()}
          variant="primary"
          size="md"
          className="w-full sm:w-auto ml-auto px-6"
          icon={Send}
          iconPosition="right"
        >
          Submit Answer
        </Button>
      </div>
    </form>
  );
}
