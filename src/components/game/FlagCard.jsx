import React, { useState, useEffect } from 'react';
import { getFlagUrl } from '../../data/countries';
import { ImageOff, Loader2 } from 'lucide-react';

export default function FlagCard({ country }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [country?.code]);

  if (!country) return null;

  const flagSrc = getFlagUrl(country.code, 'png', 640);
  const flagSvg = getFlagUrl(country.code, 'svg');

  return (
    <div className="w-full flex justify-center py-2">
      <div className="relative group w-full max-w-sm sm:max-w-md aspect-[3/2] rounded-2xl overflow-hidden glass-card border-2 border-slate-200/90 dark:border-slate-700/90 shadow-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-all duration-300">
        {/* Loading Spinner */}
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        )}

        {/* Fallback if flag fails to load */}
        {error ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <ImageOff className="w-12 h-12 mb-2 stroke-1" />
            <span className="text-sm font-semibold">{country.name} Flag</span>
          </div>
        ) : (
          <img
            src={flagSrc}
            alt={`Flag of ${country.name}`}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              // Try SVG fallback before giving up
              if (e.target.src !== flagSvg) {
                e.target.src = flagSvg;
              } else {
                setError(true);
              }
            }}
            className={`w-full h-full object-cover object-center transition-all duration-300 select-none pointer-events-none ${
              loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            loading="eager"
          />
        )}
      </div>
    </div>
  );
}
