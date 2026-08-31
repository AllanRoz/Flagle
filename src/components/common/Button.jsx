import React from 'react';
import { SoundEngine } from '../../utils/sound';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  playSound = true,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) return;
    if (playSound) {
      SoundEngine.playClick();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const baseStyles =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 shadow-md',
    xl: 'px-8 py-4 text-lg gap-3 shadow-lg',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-brand-500/25 focus:ring-brand-500 border border-brand-400/30',
    secondary:
      'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:ring-slate-400',
    emerald:
      'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 focus:ring-emerald-500 border border-emerald-400/30',
    amber:
      'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-amber-500/25 focus:ring-amber-500 border border-amber-400/30',
    rose:
      'bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white shadow-rose-500/25 focus:ring-rose-500 border border-rose-400/30',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:ring-slate-400',
    outline:
      'bg-transparent border-2 border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 focus:ring-brand-500',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-5 h-5 flex-shrink-0" />}
    </button>
  );
}
