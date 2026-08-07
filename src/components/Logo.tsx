import React from 'react';
import { useApp } from '../context/AppContext';

interface LogoProps {
  variant?: 'full' | 'compact' | 'icon' | 'print';
  mode?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  mode = 'dark',
  size = 'md',
  className = '',
  onClick,
}) => {
  const { language } = useApp();

  const isLight = mode === 'light';

  // Height sizing
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-12 sm:h-14',
    xl: 'h-16 sm:h-20',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // If variant is icon: show cropped golden K emblem from official image
  if (variant === 'icon') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center overflow-hidden rounded-xl border border-[#C6A052]/40 bg-[#F4F1EA] shadow-sm select-none ${
          onClick ? 'cursor-pointer hover:border-[#C6A052] transition-colors' : ''
        } ${iconSizes[size]} ${className}`}
        title="كوفادو Kofado"
      >
        <img
          src="/kofado-logo.jpg"
          alt="كوفادو - Kofado Icon"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-right rounded-xl scale-125"
        />
      </div>
    );
  }

  // Print mode for receipts and invoices
  if (variant === 'print') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center select-none ${className}`}
      >
        <img
          src="/kofado-logo.jpg"
          alt="كوفادو - Kofado Print Logo"
          referrerPolicy="no-referrer"
          className="h-14 sm:h-16 w-auto object-contain max-w-[280px] rounded-lg shadow-xs"
        />
      </div>
    );
  }

  // Compact variant: Emblem + "كوفادو" text
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center gap-2 select-none ${
          onClick ? 'cursor-pointer group' : ''
        } ${className}`}
      >
        <div className="h-9 w-9 rounded-lg overflow-hidden border border-[#C6A052]/40 bg-[#F4F1EA] shrink-0">
          <img
            src="/kofado-logo.jpg"
            alt="كوفادو Kofado Emblem"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-right scale-125"
          />
        </div>
        <div className="flex flex-col text-right">
          <span className={`font-black tracking-tight leading-none text-base ${isLight ? 'text-[#1E130D]' : 'text-[#F4F1EA]'}`}>
            كوفادو
          </span>
          <span className="text-[10px] font-bold text-[#C6A052] uppercase tracking-wider">
            KOFADO
          </span>
        </div>
      </div>
    );
  }

  // Full variant (Default): Render the full official luxury Kofado logo image banner
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className={`relative overflow-hidden rounded-xl border border-[#C6A052]/40 bg-[#FAF8F5] p-1 shadow-sm transition-all duration-200 group-hover:border-[#C6A052] ${heightClasses[size]}`}>
        <img
          src="/kofado-logo.jpg"
          alt="كوفادو - نظام ذكي لإدارة أعمال الخياطة والأقمشة"
          referrerPolicy="no-referrer"
          className="h-full w-auto object-contain rounded-lg max-h-full"
        />
      </div>
    </div>
  );
};

