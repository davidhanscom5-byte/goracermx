import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle2, ChevronRight, Filter, Trophy } from 'lucide-react';
import { SessionSlot, MotocrossClass, BlockConfig } from '../types';

interface ScheduleTimelineProps {
  slots: SessionSlot[];
  currentSlotIndex: number;
  classes: MotocrossClass[];
  blockConfig: BlockConfig;
  onSelectSlot: (slotIndex: number) => void;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  slots,
  currentSlotIndex,
  classes,
  blockConfig,
  onSelectSlot,
}) => {
  const [filterClassId, setFilterClassId] = useState<string>('all');

  const filteredSlots = filterClassId === 'all'
    ? slots
    : slots.filter((s) => s.classId === filterClassId);

  const getClassMeta = (classId: string) => {
    return classes.find((c) => c.id === classId);
  };

  return (
    <div id="schedule-timeline-view" className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {blockConfig.name} Master Schedule
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {blockConfig.totalSlots} Rotations • 10-min heats + 3-min intervals (13-min cycle) • {blockConfig.startTimeLabel} to {blockConfig.endTimeLabel}
          </p>
        </div>

        {/* Filter by class buttons */}
        <div className="flex items-center flex-wrap gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center px-2 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 mr-1" />
            <span className="hidden sm:inline">Filter:</span>
          </div>
          <button
            id="filter-all-classes-btn"
            type="button"
            onClick={() => setFilterClassId('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterClassId === 'all'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            All {slots.length} Rotations
          </button>
          {classes.map((cls) => (
            <button
              key={cls.id}
              id={`filter-class-${cls.id}-btn`}
              type="button"
              onClick={() => setFilterClassId(cls.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                filterClassId === cls.id
                  ? 'bg-slate-800 text-white border border-slate-700 shadow'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cls.colorScheme.primary }} />
              <span>{cls.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Rotation Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-3 px-3 text-center w-14">Slot #</th>
              <th className="py-3 px-3">Session & Interval</th>
              <th className="py-3 px-4">Class & Electric Bike</th>
              <th className="py-3 px-3 text-center">Heat #</th>
              <th className="py-3 px-3 text-center">Rider Track Time</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredSlots.map((slot) => {
              const cls = getClassMeta(slot.classId);
              const isCurrent = slot.index === currentSlotIndex;
              const isPast = slot.index < currentSlotIndex;
              const isNext = slot.index === currentSlotIndex + 1;

              return (
                <tr
                  key={slot.index}
                  id={`schedule-row-${slot.index}`}
                  onClick={() => onSelectSlot(slot.index)}
                  className={`cursor-pointer transition-colors ${
                    isCurrent
                      ? 'bg-emerald-950/40 hover:bg-emerald-950/60 text-white font-medium'
                      : isPast
                      ? 'bg-slate-950/40 text-slate-400 hover:bg-slate-900/60'
                      : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  {/* Slot Number */}
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span
                      className={`inline-block w-7 h-7 leading-7 rounded-lg text-center ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : isPast
                          ? 'bg-slate-900 text-slate-500'
                          : 'bg-slate-900 text-slate-300'
                      }`}
                    >
                      {slot.index + 1}
                    </span>
                  </td>

                  {/* Time Window (10 min ride + 3 min interval) */}
                  <td className="py-3 px-3 font-mono">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span className={isCurrent ? 'text-emerald-400 font-bold' : 'text-slate-200 font-medium'}>
                          {slot.startTime} – {slot.rideEndTime}
                        </span>
                        <span className="text-[10px] text-emerald-400/90 font-sans">(10m Ride)</span>
                      </div>
                      <div className="text-[10px] text-amber-400/90 pl-5 font-mono">
                        +3m Interval to {slot.endTime}
                      </div>
                    </div>
                  </td>

                  {/* Class Name & Model */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cls?.colorScheme.primary }}
                      />
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{slot.className}</span>
                          {slot.isTargetComplete && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                              <Trophy className="w-2.5 h-2.5" /> TARGET COMPLETE
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">{cls?.model}</div>
                      </div>
                    </div>
                  </td>

                  {/* Heat # */}
                  <td className="py-3 px-3 text-center font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                      Heat {slot.heatNumber} of {slot.totalHeats}
                    </span>
                  </td>

                  {/* Cumulative Rider Minutes */}
                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono font-bold text-emerald-400">
                        {slot.cumulativeTrackMinutes} / {slot.totalHeats * 10} min
                      </span>
                      <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-1">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${(slot.cumulativeTrackMinutes / (slot.totalHeats * 10)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        LIVE ON TRACK
                      </span>
                    ) : isPast ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70" />
                        Completed
                      </span>
                    ) : isNext ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        ON DECK (Next)
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">Upcoming</span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectSlot(slot.index);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-colors ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      {isCurrent ? 'Current' : 'Jump Here'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Facility Operational Timeline Footer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
              30-Minute Inter-Block Interval (1:30 PM – 2:00 PM)
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Mid-day track grooming, safety barrier inspection, and high-amp DC paddock fast charger battery depot reset between blocks.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-3">
          <Trophy className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wide">
              Facility Operating Schedule • Target Closing 9:00 PM
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Morning Block: 8:00 AM – 1:30 PM • 30-min Break • Afternoon / Evening Block: 2:00 PM – 9:00 PM Target Closing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
