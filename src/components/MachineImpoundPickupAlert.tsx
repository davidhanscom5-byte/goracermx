import React from 'react';
import { Shield, BatteryCharging, CheckCircle2, Clock, Volume2, UserCheck, ArrowRight, AlertTriangle, Key } from 'lucide-react';
import { MotocrossClass, SessionSlot, Rider } from '../types';

interface MachineImpoundPickupAlertProps {
  currentSlot: SessionSlot;
  nextSlot?: SessionSlot;
  nextClass?: MotocrossClass;
  nextRiders: Rider[];
  secondsRemaining: number;
  intervalSecondsRemaining: number;
  sessionPhase: 'riding' | 'interval';
  pickedUpRiderIds: Record<string, boolean>;
  onTogglePickup: (riderId: string) => void;
  onBatchPickupAll: () => void;
  onPlayPickupAlertSound: () => void;
}

export const MachineImpoundPickupAlert: React.FC<MachineImpoundPickupAlertProps> = ({
  currentSlot,
  nextSlot,
  nextClass,
  nextRiders,
  secondsRemaining,
  intervalSecondsRemaining,
  sessionPhase,
  pickedUpRiderIds,
  onTogglePickup,
  onBatchPickupAll,
  onPlayPickupAlertSound,
}) => {
  if (!nextSlot || !nextClass) {
    return null;
  }

  // Target riders for the upcoming heat (15 riders)
  const targetRiders = nextRiders.slice(0, 15);
  const pickedUpCount = targetRiders.filter((r) => pickedUpRiderIds[r.id]).length;
  const allPickedUp = targetRiders.length > 0 && pickedUpCount === targetRiders.length;

  // Minutes and seconds until gate staging
  const totalSecondsUntilGate = sessionPhase === 'riding' ? secondsRemaining + 180 : intervalSecondsRemaining;
  const countdownMinutes = Math.floor(totalSecondsUntilGate / 60);
  const countdownSeconds = totalSecondsUntilGate % 60;
  const timeFormatted = `${countdownMinutes.toString().padStart(2, '0')}:${countdownSeconds.toString().padStart(2, '0')}`;

  // Impound Rack label based on machine model
  const rackPrefix = nextClass.machineModel === 'CX3' ? 'CX3-BAY' : 'CX5-BAY';

  return (
    <div id="machine-impound-pickup-panel" className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Header: Physical Separation Policy & 10-Minute Alert */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider animate-pulse">
                ⚠️ 10-MIN PRE-STAGING DISPATCH ALERT
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                Machines &amp; Humans Separated by Default
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-white mt-0.5 flex items-center gap-2">
              <span>Pit Crew Machine Pickup: {nextClass.name}</span>
            </h3>
          </div>
        </div>

        {/* Action Controls & Countdown */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400 animate-spin" />
            <div>
              <div className="text-[9px] uppercase font-bold text-slate-400">Time to Gate Staging</div>
              <div className="text-xs font-black font-mono text-amber-300 tabular-nums">
                {timeFormatted}
              </div>
            </div>
          </div>

          <button
            id="broadcast-pickup-sound-btn"
            type="button"
            onClick={onPlayPickupAlertSound}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
            title="Broadcast Pit Crew Pickup Chime over PA"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Page Pit Crew</span>
          </button>

          <button
            id="batch-pickup-all-btn"
            type="button"
            onClick={onBatchPickupAll}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow active:scale-95 ${
              allPickedUp
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{allPickedUp ? 'All 15 Machines Picked Up' : 'Mark All Picked Up'}</span>
          </button>
        </div>
      </div>

      {/* Instructional Banner for Pit Crew Parents */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-slate-200 font-semibold flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Safety Isolation Protocol: Inactive bikes are locked in Impound Rack {rackPrefix}.</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All 15 machines for Heat #{nextSlot.heatNumber} have completed cool-down, battery pack verification, and torque checks. 
            <strong className="text-amber-300"> Pit crew parents:</strong> Present your Pit Crew Badge at Impound Bay, collect your child's machine, and escort it to Staging Chute 1.
          </p>
        </div>

        <div className="shrink-0 bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Checkout Status</div>
          <div className="text-xs font-mono font-bold text-white mt-0.5">
            <span className={allPickedUp ? 'text-emerald-400' : 'text-amber-400'}>
              {pickedUpCount} / {targetRiders.length}
            </span>{' '}
            <span className="text-[10px] text-slate-400">Escorted to Gate</span>
          </div>
        </div>
      </div>

      {/* 15 Machine Impound Bays Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">
            Impound Bay Assignments ({nextClass.name} • 15 Machines)
          </span>
          <span className="text-[11px] font-mono">
            Click any bay to toggle parent pickup confirmation
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {targetRiders.map((rider, idx) => {
            const isPickedUp = !!pickedUpRiderIds[rider.id];
            const bayNumber = `${rackPrefix}-${(idx + 1).toString().padStart(2, '0')}`;

            return (
              <div
                key={rider.id}
                id={`impound-bay-${rider.id}`}
                onClick={() => onTogglePickup(rider.id)}
                className={`p-2.5 rounded-2xl border cursor-pointer select-none transition-all flex flex-col justify-between gap-2 shadow-sm ${
                  isPickedUp
                    ? 'bg-emerald-950/30 border-emerald-500/50 hover:border-emerald-400 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950 border-slate-800 hover:border-amber-500/50'
                }`}
              >
                {/* Bay # & Battery Status */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                    {bayNumber}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3" />
                    100% Ready
                  </span>
                </div>

                {/* Rider Info */}
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs border shrink-0"
                    style={{
                      backgroundColor: `${nextClass.colorScheme.primary}20`,
                      borderColor: `${nextClass.colorScheme.primary}60`,
                      color: nextClass.colorScheme.primary,
                    }}
                  >
                    #{rider.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate">{rider.name}</div>
                    <div className="text-[9px] text-slate-400 font-mono truncate">
                      Tag: {rider.machineRfidTag}
                    </div>
                  </div>
                </div>

                {/* Pickup Toggle Button / Badge */}
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-sans">Pit Status:</span>
                  {isPickedUp ? (
                    <span className="text-emerald-300 font-bold font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ESCORTE TO GATE
                    </span>
                  ) : (
                    <span className="text-amber-300 font-bold font-mono flex items-center gap-1 animate-pulse">
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                      AWAITING PARENT
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
