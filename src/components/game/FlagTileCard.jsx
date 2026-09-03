import React, { useState, useEffect } from 'react';
import { getFlagUrl } from '../../data/countries';
import { ImageOff, Loader2, Lock, Eye } from 'lucide-react';

/**
 * FlagTileCard Component
 * Displays a country flag obscured by a 6-tile grid (3 cols x 2 rows)
 * Progressively reveals tiles as attempts are made
 */
export default function FlagTileCard({
  country,
  revealedIndices = [0],
  isFullyRevealed = false,
  totalTiles = 6,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [country?.code]);

  if (!country) return null;

  const flagSrc = getFlagUrl(country.code, 'png', 640);
  const flagSvg = getFlagUrl(country.code, 'svg');

  // Tile coordinates for 3 columns x 2 rows:
  // Tile 0: top-left (col 1, row 1)
  // Tile 1: top-center (col 2, row 1)
  // Tile 2: top-right (col 3, row 1)
  // Tile 3: bottom-left (col 1, row 2)
  // Tile 4: bottom-center (col 2, row 2)
  // Tile 5: bottom-right (col 3, row 2)
  const tiles = Array.from({ length: totalTiles }, (_, i) => i);
  const revealedSet = new Set(isFullyRevealed ? tiles : revealedIndices);

  return (
    <div className="w-full flex flex-col items-center py-2 space-y-2 select-none">
      {/* Flag Frame with 3:2 Aspect Ratio */}
      <div className="relative group w-full max-w-sm sm:max-w-md aspect-[3/2] rounded-2xl overflow-hidden glass-card border-2 border-slate-200/90 dark:border-slate-700/90 shadow-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-all duration-300">
        {/* Loading Spinner */}
        {!loaded && !error && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
          </div>
        )}

        {/* Fallback if image fails */}
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
              if (e.target.src !== flagSvg) {
                e.target.src = flagSvg;
              } else {
                setError(true);
              }
            }}
            className={`w-full h-full object-cover object-center transition-opacity duration-300 select-none pointer-events-none ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
          />
        )}

        {/* 6-Tile Grid Overlay (3 cols x 2 rows) - Solid Opaque & Full Edge Coverage */}
        {loaded && !error && (
          <div className="absolute -inset-[3px] grid grid-cols-3 grid-rows-2 z-20 pointer-events-none rounded-2xl overflow-hidden">
            {tiles.map((idx) => {
              const isRevealed = revealedSet.has(idx);

              return (
                <div
                  key={idx}
                  className={`relative border border-slate-800/80 dark:border-slate-800 transition-all duration-500 ease-out flex items-center justify-center ${
                    isRevealed
                      ? 'opacity-0 scale-95 pointer-events-none'
                      : 'opacity-100 scale-100 bg-slate-900 dark:bg-slate-950 text-slate-100 shadow-sm'
                  }`}
                  style={{
                    transitionDelay: isFullyRevealed ? `${idx * 60}ms` : '0ms',
                  }}
                >
                  {!isRevealed && (
                    <div className="flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-400 transition-transform">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 dark:bg-slate-900 flex items-center justify-center text-xs font-black text-slate-200 border border-slate-700/80 shadow-inner">
                        {idx + 1}
                      </div>
                      <Lock className="w-3.5 h-3.5 opacity-75 text-slate-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Subtle Edge Glow Overlay */}
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 dark:ring-white/5 pointer-events-none z-25" />
      </div>

      {/* Progress pill below flag */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <Eye className="w-3.5 h-3.5 text-brand-500" />
          <span>
            {isFullyRevealed ? 6 : revealedSet.size} of 6 pieces revealed
          </span>
        </span>
      </div>
    </div>
  );
}
