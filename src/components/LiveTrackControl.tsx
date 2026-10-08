import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Zap, Battery, Users, ArrowRight, Volume2, Radio, CheckCircle2, Clock, ShieldCheck, Camera, AlertTriangle } from 'lucide-react';
import { SessionSlot, MotocrossClass, Rider, TrackFlag, SessionPhase, GateSafetyVerification } from '../types';

interface LiveTrackControlProps {
  currentSlot: SessionSlot;
  totalSlots: number;
  currentClass: MotocrossClass;
  nextSlot?: SessionSlot;
  nextClass?: MotocrossClass;
  currentRiders: Rider[];
  nextRiders: Rider[];
  secondsRemaining: number; // 0 to 600
  intervalSecondsRemaining: number; // 0 to 180
  sessionPhase: SessionPhase;
  isRunning: boolean;
  onTogglePlay: () => void;
  onResetTimer: () => void;
  onNextSlot: () => void;
  onPrevSlot: () => void;
  onSkipInterval: () => void;
  currentFlag: TrackFlag;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  onPlayStagingSound: () => void;
  onOpenGateSafety: () => void;
  gateVerifications?: Record<string, GateSafetyVerification>;
}

export const LiveTrackControl: React.FC<LiveTrackControlProps> = ({
  currentSlot,
  totalSlots,
  currentClass,
  nextSlot,
  nextClass,
  currentRiders,
  nextRiders,
  secondsRemaining,
  intervalSecondsRemaining,
  sessionPhase,
  isRunning,
  onTogglePlay,
  onResetTimer,
  onNextSlot,
  onPrevSlot,
  onSkipInterval,
  currentFlag,
  autoAdvance,
  onToggleAutoAdvance,
  onPlayStagingSound,
  onOpenGateSafety,
  gateVerifications = {},
}) => {
  // Format riding countdown
  const rideMinutes = Math.floor(secondsRemaining / 60);
  const rideSeconds = secondsRemaining % 60;
  const rideTimeFormatted = `${rideMinutes.toString().padStart(2, '0')}:${rideSeconds.toString().padStart(2, '0')}`;

  // Format interval countdown (3 minutes)
  const intMinutes = Math.floor(intervalSecondsRemaining / 60);
  const intSeconds = intervalSecondsRemaining % 60;
  const intTimeFormatted = `${intMinutes.toString().padStart(2, '0')}:${intSeconds.toString().padStart(2, '0')}`;

  // Staged gate checks count
  const targetStagedRiders = sessionPhase === 'interval' ? (nextRiders.length > 0 ? nextRiders : currentRiders) : nextRiders;
  const verifiedCount = targetStagedRiders.filter(r => gateVerifications[r.id]?.stateOfMind === 'ready_confident').length;
  const holdCount = targetStagedRiders.filter(r => gateVerifications[r.id]?.stateOfMind === 'hesitant_hold' || gateVerifications[r.id]?.stateOfMind === 'distressed_standdown').length;

  // 10 minutes = 600 seconds
  const rideProgressPercent = Math.max(0, Math.min(100, ((600 - secondsRemaining) / 600) * 100));
  // 3 minutes = 180 seconds
  const intervalProgressPercent = Math.max(0, Math.min(100, ((180 - intervalSecondsRemaining) / 180) * 100));

  // Determine flag-based styling for the timer glow
  const getTimerBorder = () => {
    if (sessionPhase === 'interval') {
      return 'border-amber-400/80 shadow-amber-500/20 bg-amber-950/20';
    }
    switch (currentFlag) {
      case 'GREEN':
        return 'border-emerald-500/50 shadow-emerald-500/10';
      case 'YELLOW':
        return 'border-amber-500/70 shadow-amber-500/20';
      case 'RED':
        return 'border-rose-500/70 shadow-rose-500/20';
      case 'WHITE':
        return 'border-slate-200/60 shadow-white/10';
      case 'CHECKERED':
        return 'border-cyan-400/70 shadow-cyan-400/20';
      default:
        return 'border-slate-800';
    }
  };

  return (
    <div id="live-track-control" className="space-y-4">
      {/* Top Banner: Active Slot & Class Spotlight */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Subtle background glow based on current class color */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentClass.colorScheme.primary }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left info: Slot & Class identity */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Slot #{currentSlot.index + 1} of {totalSlots}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {currentSlot.startTime} – {currentSlot.rideEndTime}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800/80 text-amber-300 border border-amber-500/20">
                +3m Interval to {currentSlot.endTime}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  {currentClass.name}
                </h2>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${currentClass.colorScheme.badge}`}>
                  {currentClass.category.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentClass.subTitle}</p>
              <div className="text-xs text-slate-300 font-mono mt-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentClass.model}</span>
              </div>
            </div>

            {/* Rider Cumulative Track Time Progress */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400">Heat {currentSlot.heatNumber} of {currentSlot.totalHeats}</span>
                <span className="font-mono font-bold text-emerald-400">
                  {currentSlot.cumulativeTrackMinutes}m / {currentSlot.totalHeats * 10}m Target
                </span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 flex">
                {Array.from({ length: currentSlot.totalHeats }).map((_, i) => {
                  const heat = i + 1;
                  return (
                    <div
                      key={heat}
                      className={`h-full flex-1 border-r border-slate-900 last:border-none transition-colors ${
                        heat <= currentSlot.heatNumber ? 'bg-emerald-500' : 'bg-slate-800/80'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {currentSlot.isTargetComplete
                  ? `🏆 Final Heat: Target complete for these 15 riders!`
                  : `${currentSlot.totalHeats - currentSlot.heatNumber} heats remaining to reach goal.`}
              </p>
            </div>
          </div>

          {/* Center: The Massive Countdown Clock with Riding vs 3-min Interval Modes */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              id="countdown-clock-container"
              className={`w-full max-w-sm bg-slate-950/90 rounded-2xl p-4 sm:p-5 border-2 shadow-2xl flex flex-col items-center transition-all ${getTimerBorder()}`}
            >
              {sessionPhase === 'riding' ? (
                <>
                  <div className="flex items-center justify-between w-full text-xs text-slate-400 mb-1 px-1">
                    <span className="uppercase tracking-wider font-semibold text-[11px] flex items-center gap-1 text-emerald-400">
                      <Zap className="w-3.5 h-3.5" />
                      10-Minute Track Heat
                    </span>
                    <span className="font-mono text-slate-400">
                      {isRunning ? 'GREEN FLAG LIVE' : 'PAUSED'}
                    </span>
                  </div>

                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white my-1 tabular-nums">
                    {rideTimeFormatted}
                  </div>

                  {/* Progress Bar for the 10 min session */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden my-2 border border-slate-800">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        currentFlag === 'GREEN'
                          ? 'bg-emerald-500'
                          : currentFlag === 'YELLOW'
                          ? 'bg-amber-400'
                          : currentFlag === 'RED'
                          ? 'bg-rose-500'
                          : currentFlag === 'WHITE'
                          ? 'bg-white'
                          : 'bg-cyan-400'
                      }`}
                      style={{ width: `${rideProgressPercent}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* 3-Minute Interval Screen */}
                  <div className="flex items-center justify-between w-full text-xs text-amber-400 mb-1 px-1">
                    <span className="uppercase tracking-wider font-bold text-[11px] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      3-Minute Session Interval
                    </span>
                    <span className="font-mono text-amber-300 font-semibold">
                      Paddock Transition
                    </span>
                  </div>

                  <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-amber-400 my-1 tabular-nums animate-pulse">
                    {intTimeFormatted}
                  </div>

                  {/* Interval Progress Bar */}
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden my-2 border border-slate-800">
                    <div
                      className="h-full bg-amber-400 transition-all duration-1000"
                      style={{ width: `${intervalProgressPercent}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-amber-200/90 text-center font-medium mt-0.5">
                    Marshals clearing track • Next 15 riders moving to gate • RFID tag verification
                  </p>
                </>
              )}

              {/* Primary Timer Controls */}
              <div className="flex items-center gap-2 mt-2 w-full justify-center">
                <button
                  id="prev-slot-btn"
                  type="button"
                  onClick={onPrevSlot}
                  disabled={currentSlot.index === 0}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Previous Slot"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  id="play-pause-timer-btn"
                  type="button"
                  onClick={onTogglePlay}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${
                    isRunning
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/20'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-4 h-4 fill-slate-950" />
                      <span>{sessionPhase === 'interval' ? 'PAUSE INTERVAL' : 'PAUSE HEAT'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-slate-950" />
                      <span>{sessionPhase === 'interval' ? 'RESUME INTERVAL' : 'START HEAT'}</span>
                    </>
                  )}
                </button>

                <button
                  id="reset-timer-btn"
                  type="button"
                  onClick={onResetTimer}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Reset to 10:00"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  id="next-slot-btn"
                  type="button"
                  onClick={onNextSlot}
                  disabled={currentSlot.index === totalSlots - 1}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  title="Next Slot"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {sessionPhase === 'interval' && (
                  <button
                    id="skip-interval-btn"
                    type="button"
                    onClick={onSkipInterval}
                    className="px-3 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold transition-all shadow"
                    title="Riders staged early: Skip remaining interval and drop Green Flag immediately"
                  >
                    Skip to Green
                  </button>
                )}
              </div>

              {/* Auto Advance Toggle & RFID ping */}
              <div className="mt-3 pt-2 border-t border-slate-800/80 w-full flex items-center justify-between text-[11px] text-slate-400">
                <button
                  id="toggle-auto-advance-btn"
                  type="button"
                  onClick={onToggleAutoAdvance}
                  className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border transition-colors ${
                    autoAdvance
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {autoAdvance ? 'AUTO-ADVANCE (3m INTERVAL)' : 'MANUAL CONFIRM'}
                </button>

                <span className="flex items-center gap-1 font-mono text-emerald-400/90">
                  <Radio className="w-3 h-3 text-emerald-400" />
                  RFID Live
                </span>
              </div>
            </div>
          </div>

          {/* Right: Next Up In Staging Gate */}
          <div className="lg:col-span-3 bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black tracking-widest uppercase text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  ON DECK • STAGING GATE
                </span>
                <button
                  id="broadcast-staging-chime-btn"
                  type="button"
                  onClick={onPlayStagingSound}
                  title="Broadcast Staging Chime to Paddock"
                  className="text-slate-400 hover:text-amber-400 p-1 rounded hover:bg-slate-800 transition-colors"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {nextSlot && nextClass ? (
                <div>
                  <div className="text-lg font-bold text-white flex items-center gap-1.5">
                    <span>{nextClass.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Heat {nextSlot.heatNumber} of {nextSlot.totalHeats} • Start: {nextSlot.startTime}
                  </div>
                  <div className="mt-2 text-xs text-slate-300 bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                    <p className="font-semibold text-amber-300 text-[11px] mb-1">
                      Marshall Checklist (3m Transition):
                    </p>
                    <ul className="text-[10px] text-slate-400 space-y-0.5 list-disc list-inside">
                      <li>Helmets buckled &amp; goggles on</li>
                      <li>15 Riders in Staging Chute</li>
                      <li>RFID Tags verified (Rider + Machine)</li>
                      <li>Bikes switched to ON</li>
                      <li>Battery swap checked (30m rest)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic py-4">
                  Final session of the block completed!
                </div>
              )}
            </div>

            {nextSlot && (
              <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Riders on deck:</span>
                  <span className="font-bold text-amber-400 font-mono">15 Staged</span>
                </div>

                {/* Gate Safety Action Button */}
                <button
                  id="open-gate-safety-btn"
                  type="button"
                  onClick={onOpenGateSafety}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-black flex items-center justify-between transition-all shadow-md active:scale-95 border ${
                    verifiedCount === targetStagedRiders.length && targetStagedRiders.length > 0
                      ? 'bg-emerald-600/90 hover:bg-emerald-500 text-white border-emerald-400'
                      : holdCount > 0
                      ? 'bg-amber-600/90 hover:bg-amber-500 text-white border-amber-400'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white border-cyan-400/50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>"Are You Ready?" Gate Check</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-slate-950/70 text-[10px] font-mono">
                    {verifiedCount}/{targetStagedRiders.length} Ready
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Track Grid: Current 15 Riders on Track */}
      <div id="on-track-riders-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Active Track Session • 15 Riders ({currentClass.name})
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Full Track Capacity (15/15)
            </span>
            <span>•</span>
            <span className="font-mono text-emerald-300">
              Heat {currentSlot.heatNumber}/{currentSlot.totalHeats} ({currentSlot.cumulativeTrackMinutes} min)
            </span>
          </div>
        </div>

        {/* 15 Rider Chips Grid with Rider & Machine RFID Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {currentRiders.map((rider) => (
            <div
              key={rider.id}
              id={`rider-card-${rider.id}`}
              className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-2.5 hover:border-slate-700 transition-colors flex flex-col justify-between gap-2"
            >
              <div className="flex items-center gap-2.5">
                {/* Motocross Number Plate */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm tracking-tighter shrink-0 border shadow-inner"
                  style={{
                    backgroundColor: `${currentClass.colorScheme.primary}20`,
                    borderColor: `${currentClass.colorScheme.primary}60`,
                    color: currentClass.colorScheme.primary,
                  }}
                >
                  #{rider.number}
                </div>

                {/* Rider Name & Status */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-200 truncate leading-snug">
                    {rider.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-0.5">
                    <span className="font-mono">{rider.transponderId}</span>
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono ${
                        rider.batteryPercent > 80
                          ? 'text-emerald-400'
                          : rider.batteryPercent > 40
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      <Battery className="w-3 h-3 inline" />
                      {rider.batteryPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* RFID Identification (Rider Tag + Machine Tag) */}
              <div className="pt-1.5 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[9px] font-mono">
                <div className="bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800/60 truncate" title={`Rider RFID: ${rider.riderRfidTag}`}>
                  <span className="text-slate-500 font-sans">Rider:</span> <span className="text-cyan-300 font-bold">{rider.riderRfidTag}</span>
                </div>
                <div className="bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800/60 truncate" title={`Machine RFID: ${rider.machineRfidTag}`}>
                  <span className="text-slate-500 font-sans">Machine:</span> <span className="text-amber-300 font-bold">{rider.machineRfidTag}</span>
                </div>
              </div>

              {/* State of Mind "Are You Ready?" Verification Pill */}
              <div className="pt-1 border-t border-slate-800/50 flex items-center justify-between text-[9px]">
                <span className="text-slate-500 font-sans">Gate Ready Check:</span>
                {gateVerifications[rider.id]?.stateOfMind === 'ready_confident' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-400 font-mono">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    CONFIRMED
                  </span>
                ) : gateVerifications[rider.id]?.stateOfMind === 'hesitant_hold' ? (
                  <span className="inline-flex items-center gap-1 font-bold text-amber-400 font-mono">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    ON HOLD
                  </span>
                ) : (
                  <span className="text-slate-500 font-mono">
                    PENDING
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
