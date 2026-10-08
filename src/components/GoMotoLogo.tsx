import React from 'react';

interface GoMotoLogoProps {
  variant?: 'full' | 'compact' | 'badge' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showSubtitle?: boolean;
}

export const GoMotoLogo: React.FC<GoMotoLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  showSubtitle = false,
}) => {
  const sizeMap = {
    xs: { icon: 'w-6 h-6', text: 'text-sm', subtext: 'text-[9px]' },
    sm: { icon: 'w-7 h-7', text: 'text-base', subtext: 'text-[10px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', subtext: 'text-xs' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', subtext: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', subtext: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  if (variant === 'badge') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black tracking-wider uppercase font-sans shadow-md shadow-emerald-500/20 ${className}`}
      >
        <span className="font-extrabold italic tracking-tight">GO MOTO</span>
      </span>
    );
  }

  if (variant === 'icon') {
    return (
      <div
        className={`relative rounded-xl overflow-hidden shadow-md shadow-emerald-500/20 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 flex items-center justify-center ${currentSize.icon} ${className}`}
      >
        <img
          src="/src/assets/images/go_moto_logo_1790540646792.jpg"
          alt="Go Moto Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to SVG if image loading fails in any environment
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-slate-950 hidden"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Brand Icon / Generated Avatar badge */}
      <div
        className={`relative rounded-xl overflow-hidden border border-emerald-400/40 shadow-md shadow-emerald-500/20 bg-slate-950 shrink-0 ${currentSize.icon}`}
      >
        <img
          src="/src/assets/images/go_moto_logo_1790540646792.jpg"
          alt="Go Moto"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-black italic tracking-tighter uppercase text-white font-sans ${currentSize.text}`}>
            GO<span className="text-emerald-400 ml-1">MOTO</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase font-bold tracking-widest">
            MX
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-slate-400 font-medium tracking-wide uppercase ${currentSize.subtext}`}>
            Indoor Electric Motocross
          </span>
        )}
      </div>
    </div>
  );
};
