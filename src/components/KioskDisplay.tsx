import React from 'react';
import { X, Flag, AlertTriangle, Octagon, CheckCircle, Bell, ArrowRight, Zap, Users, Clock, Radio, ShieldCheck } from 'lucide-react';
import { SessionSlot, MotocrossClass, Rider, TrackFlag, BlockConfig, SessionPhase, GateSafetyVerification } from '../types';
import { GoMotoLogo } from './GoMotoLogo';

interface KioskDisplayProps {
  currentSlot: SessionSlot;
  currentClass: MotocrossClass;
  nextSlot?: SessionSlot;
  nextClass?: MotocrossClass;
  currentRiders: Rider[];
  nextRiders: Rider[];
  secondsRemaining: number;
  intervalSecondsRemaining?: number;
  sessionPhase?: SessionPhase;
  isRunning: boolean;
  currentFlag: TrackFlag;
  blockConfig: BlockConfig;
  onClose: () => void;
  gateVerifications?: Record<string, GateSafetyVerification>;
}

export const KioskDisplay: React.FC<KioskDisplayProps> = ({
  currentSlot,
  currentClass,
  nextSlot,
  nextClass,
  currentRiders,
  nextRiders,
  secondsRemaining,
  intervalSecondsRemaining = 180,
  sessionPhase = 'riding',
  isRunning,
  currentFlag,
  blockConfig,
  onClose,
  gateVerifications = {},
}) => {
  const isInterval = sessionPhase === 'interval';
  const activeSeconds = isInterval ? intervalSecondsRemaining : secondsRemaining;
  const minutes = Math.floor(activeSeconds / 60);
  const seconds = activeSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getFlagDetails = () => {
    if (isInterval) {
      return {
        title: '3-MINUTE SESSION INTERVAL • PADDOCK TRANSITION',
        sub: 'Track Marshals Clearing Course • Next 15 Riders Staged at Starting Gate',
        bg: 'bg-amber-600 animate-pulse',
        border: 'border-amber-400',
        text: 'text-white font-black',
        icon: <Clock className="w-8 h-8 fill-current" />,
      };
    }
    switch (currentFlag) {
      case 'GREEN':
        return {
          title: 'GREEN FLAG • TRACK IS HOT',
          sub: 'Session Active • Full Speed Racing',
          bg: 'bg-emerald-600',
          border: 'border-emerald-400',
          text: 'text-white',
          icon: <Flag className="w-8 h-8 fill-current" />,
        };
      case 'YELLOW':
        return {
          title: 'YELLOW FLAG • CAUTION',
          sub: 'Rider Down • Slow Down • No Passing',
          bg: 'bg-amber-500 animate-pulse',
          border: 'border-amber-300',
          text: 'text-slate-950 font-black',
          icon: <AlertTriangle className="w-8 h-8 fill-current" />,
        };
      case 'RED':
        return {
          title: 'RED FLAG • TRACK STOPPED',
          sub: 'Session Stopped • Stay On Bikes • Marshal En Route',
          bg: 'bg-rose-600 animate-pulse',
          border: 'border-rose-400',
          text: 'text-white font-black',
          icon: <Octagon className="w-8 h-8 fill-current" />,
        };
      case 'WHITE':
        return {
          title: 'WHITE FLAG • 1 MINUTE WARNING',
          sub: 'Final Lap Of This 10-Minute Heat',
          bg: 'bg-slate-100',
          border: 'border-white',
          text: 'text-slate-950 font-black',
          icon: <Bell className="w-8 h-8 fill-current" />,
        };
      case 'CHECKERED':
        return {
          title: 'CHECKERED FLAG • HEAT COMPLETE',
          sub: '10 Minutes Complete • Slow Down & Exit Track to Paddock',
          bg: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950',
          border: 'border-amber-400',
          text: 'text-amber-400 font-black',
          icon: <CheckCircle className="w-8 h-8" />,
        };
    }
  };

  const flagInfo = getFlagDetails();

  return (
    <div id="paddock-kiosk-display" className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col p-4 sm:p-8 overflow-y-auto">
      {/* Top Bar with exit button */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <GoMotoLogo variant="icon" size="sm" />
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider font-sans">
            GO MOTO
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 text-cyan-300 font-bold text-xs uppercase tracking-widest border border-cyan-500/40 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            GOOGLE TECH STACK POWERED
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 font-bold text-xs uppercase tracking-widest border border-slate-700">
            LIVE PADDOCK PIT BOARD
          </span>
          <span className="text-sm font-mono text-slate-400">
            {blockConfig.name} ({blockConfig.startTimeLabel} – {blockConfig.endTimeLabel}) • Slot {currentSlot.index + 1}/{blockConfig.totalSlots}
          </span>
        </div>

        <button
          id="exit-kiosk-mode-btn"
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>Exit TV Mode</span>
        </button>
      </div>

      {/* Flag Announcement Banner */}
      <div className={`mt-4 p-4 sm:p-5 rounded-2xl border-2 shadow-2xl flex items-center justify-between transition-all ${flagInfo.bg} ${flagInfo.border} ${flagInfo.text}`}>
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-black/20">{flagInfo.icon}</div>
          <div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight uppercase">
              {flagInfo.title}
            </h2>
            <p className="text-xs sm:text-sm font-semibold opacity-90 mt-0.5">
              {flagInfo.sub}
            </p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <div className="text-xs font-mono font-bold opacity-80">TRACK STATUS</div>
          <div className="text-lg font-mono font-black">{isInterval ? 'INTERVAL (3m)' : currentFlag}</div>
        </div>
      </div>

      {/* Main Grid: Left Giant Timer & On Track, Right On Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 flex-1">
        {/* Left Column: Huge Clock & On-Track Class */}
        <div className="lg:col-span-8 flex flex-col space-y-6">
          {/* Active Class & Countdown Card */}
          <div className="bg-slate-900 border-2 border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded border ${
                isInterval ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                {isInterval ? '3-MINUTE PADDOCK INTERVAL' : 'CURRENT CLASS ON TRACK'}
              </span>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-1">
                {currentClass.name}
              </h1>
              <p className="text-sm text-slate-300">{currentClass.subTitle}</p>
              <div className="text-xs text-slate-400 font-mono flex items-center justify-center sm:justify-start gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{currentClass.model}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  Heat {currentSlot.heatNumber}/{currentSlot.totalHeats} ({currentSlot.cumulativeTrackMinutes} min Target)
                </span>
              </div>
            </div>

            {/* Giant Clock */}
            <div className={`bg-slate-950 border-2 rounded-3xl px-8 py-6 flex flex-col items-center justify-center shadow-inner ${
              isInterval ? 'border-amber-400 shadow-amber-500/20' : 'border-slate-700'
            }`}>
              <span className="text-[11px] font-mono tracking-widest uppercase text-slate-400 mb-1">
                {isInterval ? 'INTERVAL REMAINING' : 'SESSION TIME REMAINING'}
              </span>
              <div className={`text-6xl sm:text-7xl font-black font-mono tracking-tight ${
                isInterval ? 'text-amber-400' : 'text-white'
              }`}>
                {timeFormatted}
              </div>
              <span className={`text-xs font-bold font-mono mt-1 ${isInterval ? 'text-amber-300' : 'text-emerald-400'}`}>
                {isRunning ? (isInterval ? '● INTERVAL TIMING' : '● ROTATION ACTIVE') : '❚❚ PAUSED'}
              </span>
            </div>
          </div>

          {/* 15 Riders Currently On Track */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex-1">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  15 Riders In Session • RFID Verification
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                15/15 Track Capacity
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {currentRiders.map((rider) => (
                <div
                  key={rider.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col items-center text-center shadow"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border-2 shadow-inner mb-1.5"
                    style={{
                      backgroundColor: `${currentClass.colorScheme.primary}20`,
                      borderColor: currentClass.colorScheme.primary,
                      color: currentClass.colorScheme.primary,
                    }}
                  >
                    #{rider.number}
                  </div>
                  <span className="text-xs font-bold text-white truncate w-full">{rider.name}</span>
                  <div className="text-[9px] text-slate-400 font-mono mt-1 space-y-0.5 w-full">
                    <div className="text-cyan-300 truncate">R: {rider.riderRfidTag || rider.transponderId}</div>
                    <div className="text-amber-300 truncate">M: {rider.machineRfidTag || 'N/A'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Next Class In Staging Gate */}
        <div className="lg:col-span-4 bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 shadow-2xl flex flex-col">
          <div className="pb-4 border-b border-slate-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-widest mb-2">
              <ArrowRight className="w-4 h-4" />
              ON DECK • STAGING GATE
            </div>
            {nextSlot && nextClass ? (
              <>
                <h2 className="text-3xl font-black tracking-tight text-white mt-1">
                  {nextClass.name}
                </h2>
                <p className="text-xs text-slate-300 mt-1">{nextClass.subTitle}</p>
                <div className="text-xs text-amber-400 font-mono mt-2 flex items-center gap-2">
                  <span>Start Time: {nextSlot.startTime}</span>
                  <span>•</span>
                  <span>Heat {nextSlot.heatNumber}/{nextSlot.totalHeats}</span>
                </div>
              </>
            ) : (
              <div className="text-sm text-slate-400 py-4">
                Block completed! Final checkered flag.
              </div>
            )}
          </div>

          {nextSlot && (
            <div className="mt-4 flex-1 flex flex-col">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 text-amber-300 text-xs mb-4">
                <p className="font-bold text-xs uppercase mb-1">Gate Announcement:</p>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  All 15 riders for <strong>{nextClass?.name}</strong> report to Staging Chute 1.
                  Helmets strapped, goggles on, RFID tags scanned, battery power switched to ON.
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  15 Riders On Deck:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {nextRiders.slice(0, 15).map((r) => {
                    const isVerified = gateVerifications[r.id]?.stateOfMind === 'ready_confident';
                    return (
                      <div
                        key={r.id}
                        className={`p-2 rounded-xl border flex items-center justify-between gap-2 ${
                          isVerified ? 'bg-slate-950 border-emerald-500/50' : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`w-7 h-7 rounded-lg border font-black font-mono text-xs flex items-center justify-center shrink-0 ${
                            isVerified 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}>
                            #{r.number}
                          </span>
                          <div className="truncate">
                            <span className="text-xs text-slate-200 truncate font-semibold block">{r.name}</span>
                            <span className="text-[9px] text-cyan-300 font-mono block truncate">{r.riderRfidTag}</span>
                          </div>
                        </div>

                        {isVerified && (
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0" title="Gate Safety & State of Mind Confirmed">
                            <ShieldCheck className="w-3 h-3" />
                            READY
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
