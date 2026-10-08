import React from 'react';
import { Flag, AlertTriangle, Octagon, CheckCircle2, Bell } from 'lucide-react';
import { TrackFlag } from '../types';

interface FlagControlsProps {
  currentFlag: TrackFlag;
  onSetFlag: (flag: TrackFlag) => void;
}

export const FlagControls: React.FC<FlagControlsProps> = ({ currentFlag, onSetFlag }) => {
  const flags: {
    id: TrackFlag;
    label: string;
    sub: string;
    icon: React.ReactNode;
    activeStyle: string;
    idleStyle: string;
  }[] = [
    {
      id: 'GREEN',
      label: 'GREEN FLAG',
      sub: 'Track Hot • Active',
      icon: <Flag className="w-5 h-5 fill-emerald-500 text-emerald-400" />,
      activeStyle: 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 font-bold',
      idleStyle: 'bg-slate-900/90 text-emerald-400 border-emerald-900/60 hover:bg-emerald-950/40 hover:border-emerald-700',
    },
    {
      id: 'YELLOW',
      label: 'YELLOW FLAG',
      sub: 'Caution • Rider Down',
      icon: <AlertTriangle className="w-5 h-5 fill-amber-500 text-amber-950" />,
      activeStyle: 'bg-amber-500 text-slate-950 border-amber-300 shadow-lg shadow-amber-500/30 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 font-bold animate-pulse',
      idleStyle: 'bg-slate-900/90 text-amber-400 border-amber-900/60 hover:bg-amber-950/40 hover:border-amber-700',
    },
    {
      id: 'RED',
      label: 'RED FLAG',
      sub: 'Track Stopped • Immediate',
      icon: <Octagon className="w-5 h-5 fill-rose-600 text-white" />,
      activeStyle: 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30 ring-2 ring-rose-400 ring-offset-2 ring-offset-slate-950 font-bold animate-pulse',
      idleStyle: 'bg-slate-900/90 text-rose-400 border-rose-900/60 hover:bg-rose-950/40 hover:border-rose-700',
    },
    {
      id: 'WHITE',
      label: 'WHITE FLAG',
      sub: 'Final Lap • 1 Min Left',
      icon: <Bell className="w-5 h-5 fill-slate-200 text-slate-800" />,
      activeStyle: 'bg-slate-100 text-slate-950 border-white shadow-lg shadow-white/20 ring-2 ring-white ring-offset-2 ring-offset-slate-950 font-bold',
      idleStyle: 'bg-slate-900/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white',
    },
    {
      id: 'CHECKERED',
      label: 'CHECKERED',
      sub: 'Heat Finish • Exit Track',
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      activeStyle: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white border-amber-400 shadow-lg shadow-slate-900/50 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 font-bold',
      idleStyle: 'bg-slate-900/90 text-slate-200 border-slate-700 hover:bg-slate-800 hover:border-slate-500',
    },
  ];

  return (
    <div id="track-flag-controls" className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flag className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Live Track Flag Status
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">Click flag to broadcast marshal alert</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {flags.map((flag) => {
          const isActive = currentFlag === flag.id;
          return (
            <button
              id={`flag-btn-${flag.id.toLowerCase()}`}
              key={flag.id}
              type="button"
              onClick={() => onSetFlag(flag.id)}
              className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isActive ? flag.activeStyle : flag.idleStyle
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {flag.icon}
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                )}
              </div>
              <div>
                <div className="text-xs font-black tracking-wide leading-tight">{flag.label}</div>
                <div className="text-[10px] opacity-80 mt-0.5 leading-tight">{flag.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
