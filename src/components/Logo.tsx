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
  const textColor = isLight ? 'text-[#1E130D]' : 'text-[#F4F1EA]';
  const subtextColor = isLight ? 'text-[#8C6221]' : 'text-[#C6A052]';
  const lineBg = isLight ? 'bg-[#8C6221]/40' : 'bg-[#C6A052]/40';

  // Size mapping
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  // Emblem Symbol Component
  const GoldenEmblem = ({ className = 'w-9 h-9' }: { className?: string }) => (
    <svg
      viewBox="0 0 200 200"
      className={`${className} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B88A3B" />
          <stop offset="30%" stopColor="#E2C175" />
          <stop offset="60%" stopColor="#FDF0A6" />
          <stop offset="85%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8F6222" />
        </linearGradient>
        <linearGradient id="logoGoldAccent" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF2B2" />
          <stop offset="100%" stopColor="#C59B27" />
        </linearGradient>
      </defs>

      {/* Outer Golden Frame */}
      <rect
        x="20"
        y="20"
        width="160"
        height="160"
        rx="36"
        ry="36"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="22"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Inner K Fold Ribbon */}
      <path
        d="M 170 30 L 75 100 L 170 170 M 105 100 L 165 100"
        fill="none"
        stroke="url(#logoGold)"
        strokeWidth="20"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div onClick={onClick} className={`inline-flex items-center cursor-pointer ${className}`}>
        <GoldenEmblem className={iconSizes[size]} />
      </div>
    );
  }

  if (variant === 'print') {
    return (
      <div onClick={onClick} className={`flex items-center gap-3 ${className}`}>
        {/* Emblem */}
        <GoldenEmblem className="w-12 h-12" />

        {/* Divider */}
        <div className="w-[1.5px] h-10 bg-stone-400" />

        {/* Text */}
        <div className="text-right">
          <div className="font-extrabold text-xl text-stone-900 tracking-tight leading-none">
            كوفادو <span className="text-xs font-bold text-stone-600">| KOFADO</span>
          </div>
          <div className="text-[10px] text-stone-600 font-semibold mt-0.5">
            نظام ذكي لإدارة أعمال الخياطة والأقمشة
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3.5 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Right side in Arabic RTL: Golden Ribbon Emblem */}
      <GoldenEmblem className={iconSizes[size]} />

      {/* Divider */}
      <div className={`w-[1px] h-8 sm:h-9 ${lineBg} rounded-full`} />

      {/* Brand Text Block */}
      <div className="flex flex-col text-right justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${titleSizes[size]} ${textColor}`}>
            كوفادو
          </span>
          <span className="text-[10px] sm:text-xs font-bold text-[#C6A052] uppercase tracking-wider">
            KOFADO
          </span>
        </div>

        {variant === 'full' && (
          <span className={`font-medium ${subtitleSizes[size]} ${subtextColor} mt-1 leading-tight`}>
            {language === 'ar'
              ? 'نظام ذكي لإدارة أعمال الخياطة والأقمشة'
              : 'Smart Tailoring & Fabric Management'}
          </span>
        )}
      </div>
    </div>
  );
};
