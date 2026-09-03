import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getFlagUrl } from '../../data/countries';
import { normalizeString } from '../../utils/countryMatching';
import Button from '../common/Button';
import { Send, Search, Eye, ChevronRight, Check, X, Compass, Globe, Sparkles } from 'lucide-react';

/**
 * FlagleMode Component
 * Interactive progressive reveal guessing interface with autocomplete,
 * attempt feedback, distance & direction indicators, and skip/reveal controls.
 */
export default function FlagleMode({
  targetCountry,
  allCountries = [],
  attempts = [],
  maxAttempts = 6,
  isAnswered = false,
  onGuessSubmit,
  onSkipReveal,
  revealedCount = 1,
}) {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const remainingAttempts = Math.max(0, maxAttempts - attempts.length);

  // Focus input when question starts or advances
  useEffect(() => {
    setInputValue('');
    setIsOpen(false);
    if (!isAnswered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [targetCountry?.code, isAnswered]);

  // Filter country candidates based on user typing
  const filteredSuggestions = useMemo(() => {
    const query = normalizeString(inputValue);
    if (!query || query.length < 1) return [];

    const matches = allCountries.filter((country) => {
      const normName = normalizeString(country.name);
      if (normName.includes(query)) return true;
      if (country.aliases) {
        return country.aliases.some((alias) => normalizeString(alias).includes(query));
      }
      return false;
    });

    // Sort: exact startsWith first, then others
    matches.sort((a, b) => {
      const aStarts = normalizeString(a.name).startsWith(query);
      const bStarts = normalizeString(b.name).startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.name.localeCompare(b.name);
    });

    return matches.slice(0, 6);
  }, [inputValue, allCountries]);

  // Handle dropdown open/close on clicks outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCountry = (country) => {
    setInputValue('');
    setIsOpen(false);
    onGuessSubmit(country);
  };

  const handleKeyDown = (e) => {
    if (!isOpen || filteredSuggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (inputValue.trim()) {
          onGuessSubmit(inputValue.trim());
          setInputValue('');
        }
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredSuggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredSuggestions.length) % filteredSuggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (filteredSuggestions[highlightedIndex]) {
        handleSelectCountry(filteredSuggestions[highlightedIndex]);
      } else if (inputValue.trim()) {
        onGuessSubmit(inputValue.trim());
        setInputValue('');
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setHighlightedIndex(0);
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-4">
      {/* 6 Attempt Pips (Flagle / Wordle style) */}
      <div className="flex items-center justify-center gap-2 select-none">
        {Array.from({ length: maxAttempts }).map((_, idx) => {
          const attempt = attempts[idx];
          let bg = 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700';
          let icon = null;

          if (attempt) {
            if (attempt.isCorrect) {
              bg = 'bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-500/20';
              icon = <Check className="w-3.5 h-3.5 stroke-[3]" />;
            } else if (attempt.skipped) {
              bg = 'bg-amber-500 border-amber-600 text-white shadow-md shadow-amber-500/20';
              icon = <Eye className="w-3.5 h-3.5" />;
            } else {
              bg = 'bg-rose-500 border-rose-600 text-white shadow-md shadow-rose-500/20';
              icon = <X className="w-3.5 h-3.5 stroke-[3]" />;
            }
          } else if (idx === attempts.length && !isAnswered) {
            bg = 'bg-brand-500/20 border-brand-500 ring-2 ring-brand-500/30 animate-pulse';
          }

          return (
            <div
              key={idx}
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl border-2 flex items-center justify-center text-xs font-bold transition-all ${bg}`}
              title={`Guess ${idx + 1} of ${maxAttempts}`}
            >
              {icon || <span className="opacity-40">{idx + 1}</span>}
            </div>
          );
        })}
      </div>

      {/* Input & Search Form */}
      {!isAnswered && (
        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isOpen && filteredSuggestions.length > 0 && filteredSuggestions[highlightedIndex]) {
                handleSelectCountry(filteredSuggestions[highlightedIndex]);
              } else if (inputValue.trim()) {
                onGuessSubmit(inputValue.trim());
                setInputValue('');
              }
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (inputValue.trim()) setIsOpen(true);
                }}
                disabled={isAnswered || remainingAttempts <= 0}
                placeholder="Search or type country name..."
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                className="w-full py-3 pl-10 pr-4 text-sm sm:text-base font-semibold rounded-2xl glass-input border border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 shadow-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!inputValue.trim() || isAnswered || remainingAttempts <= 0}
                className="flex-1 sm:flex-none px-5 font-bold shadow-md shadow-brand-500/20"
                icon={Send}
                iconPosition="right"
              >
                Guess
              </Button>

              {/* Skip / Reveal Next Piece Button */}
              {revealedCount < maxAttempts && remainingAttempts > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={onSkipReveal}
                  disabled={isAnswered}
                  className="px-3 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  title="Reveal next piece (+1 attempt used)"
                  icon={Eye}
                >
                  <span className="hidden sm:inline">Reveal Piece</span>
                  <span className="sm:hidden">Reveal</span>
                </Button>
              )}
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {isOpen && filteredSuggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-40 max-h-64 overflow-y-auto animate-scale-in"
            >
              {filteredSuggestions.map((country, idx) => {
                const isSelected = idx === highlightedIndex;

                return (
                  <div
                    key={country.code}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    onClick={() => handleSelectCountry(country)}
                    className={`px-3.5 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-500 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center min-w-0">
                      <span className="text-sm font-semibold truncate">
                        {country.name}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {country.continent}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Guess History Feed */}
      {attempts.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-1">
            <span>Previous Guesses ({attempts.length}/{maxAttempts})</span>
            <span>Closeness & Bearing</span>
          </div>

          <div className="space-y-1.5">
            {attempts.map((att, idx) => {
              const country = att.country;
              const flagUrl = country ? getFlagUrl(country.code, 'png', 80) : null;

              if (att.skipped) {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold">#{idx + 1}</span>
                      <Eye className="w-4 h-4 text-amber-500" />
                      <span>Revealed Tile #{idx + 1} (Pass)</span>
                    </div>
                    <span className="text-[11px] opacity-75">Piece Unlocked</span>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    att.isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200 font-bold'
                      : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xs font-extrabold text-slate-400">
                      #{idx + 1}
                    </span>
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt=""
                        className="w-5 h-3.5 object-cover rounded shadow-xs flex-shrink-0"
                      />
                    )}
                    <span className="truncate font-bold">
                      {country ? country.name : att.guessText}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Continent comparison tag */}
                    {att.sameContinent ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
                        {att.targetContinent || 'Same Continent'}
                      </span>
                    ) : att.guessedContinent ? (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 text-[11px]">
                        {att.guessedContinent}
                      </span>
                    ) : null}

                    {/* Distance & Compass Bearing */}
                    {att.distanceKm !== null && att.distanceKm !== undefined ? (
                      <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 text-xs">
                        <span>{att.distanceKm.toLocaleString()} km</span>
                        {att.direction && (
                          <span title={`${att.direction.label} bearing`}>
                            {att.direction.arrow}
                          </span>
                        )}
                      </span>
                    ) : null}

                    {att.isCorrect && (
                      <span className="text-emerald-500 font-black">✓ Correct</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
