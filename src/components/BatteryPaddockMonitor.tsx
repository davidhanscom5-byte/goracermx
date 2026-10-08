import React from 'react';
import { BatteryCharging, Clock, Wrench, CheckCircle } from 'lucide-react';
import { MotocrossClass, SessionSlot } from '../types';

interface BatteryPaddockMonitorProps {
  currentSlotIndex: number;
  classes: MotocrossClass[];
  slots: SessionSlot[];
}

export const BatteryPaddockMonitor: React.FC<BatteryPaddockMonitorProps> = ({
  currentSlotIndex,
  classes,
  slots,
}) => {
  const currentSlot = slots[currentSlotIndex] || slots[0];

  // For each of the 4 classes, calculate how many minutes until their next track session
  // or if they are currently ON TRACK
  const classPaddockStates = classes.map((cls) => {
    const isOnTrack = cls.id === currentSlot.classId;

    // Find next slot index where this class rides
    let slotsUntilNext = 0;
    if (!isOnTrack) {
      for (let offset = 1; offset <= 4; offset++) {
        const nextIdx = currentSlotIndex + offset;
        if (nextIdx < slots.length && slots[nextIdx].classId === cls.id) {
          slotsUntilNext = offset;
          break;
        }
      }
    }

    const minutesUntilNext = slotsUntilNext * 10;

    // Calculate how many heats this class has finished in this block
    const finishedHeats = slots
      .slice(0, currentSlotIndex + (isOnTrack ? 1 : 0))
      .filter((s) => s.classId === cls.id).length;

    const completedTrackTime = finishedHeats * 10;

    return {
      class: cls,
      isOnTrack,
      slotsUntilNext,
      minutesUntilNext,
      finishedHeats,
      completedTrackTime,
    };
  });

  return (
    <div id="paddock-monitor" className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <BatteryCharging className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Paddock & Battery Recharge Monitor (30-Min Rest Windows)
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Each class rests 30m between 10m track heats
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {classPaddockStates.map((state) => {
          const { class: cls, isOnTrack, minutesUntilNext, finishedHeats, completedTrackTime } = state;
          const isFullyDone = completedTrackTime >= 60;

          return (
            <div
              key={cls.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isOnTrack
                  ? 'bg-slate-950/90 border-emerald-500/50 ring-1 ring-emerald-500/30 shadow-md'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cls.colorScheme.primary }}
                  />
                  <h4 className="font-bold text-xs text-white truncate max-w-[130px]">{cls.name}</h4>
                </div>

                {isOnTrack ? (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                    ON TRACK NOW
                  </span>
                ) : isFullyDone ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 60m DONE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    <Clock className="w-3 h-3 text-amber-400" />
                    In {minutesUntilNext}m
                  </span>
                )}
              </div>

              {/* Status Message */}
              <div className="bg-slate-900/80 rounded-xl p-2.5 border border-slate-800/70 text-xs">
                {isOnTrack ? (
                  <div className="text-emerald-300 flex items-center justify-between text-[11px]">
                    <span className="font-semibold">Track Session Active</span>
                    <span className="font-mono">Heat {finishedHeats}/6</span>
                  </div>
                ) : isFullyDone ? (
                  <div className="text-cyan-300 flex items-center justify-between text-[11px]">
                    <span>Program Finished!</span>
                    <span className="font-bold font-mono">1 hr Logged</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span className="flex items-center gap-1">
                        <Wrench className="w-3 h-3 text-cyan-400" />
                        {cls.machineModel === 'CX3' ? 'Cobra CX3 Rapid Bay' : 'Cobra CX5 Liquid-Cool Bay'}
                      </span>
                      <span className="font-mono text-amber-400 font-bold">{minutesUntilNext} min rest</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {cls.machineModel === 'CX3'
                        ? 'CX3 (40 unit pool) rapid battery swap & torque check'
                        : 'CX5 (40 unit pool) fast charge & liquid-cooling cooldown'}
                    </div>
                  </div>
                )}
              </div>

              {/* Cumulative Track Time Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span>Track Time Logged</span>
                  <span className="font-mono font-bold text-slate-200">{completedTrackTime} / 60 min</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (completedTrackTime / 60) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
