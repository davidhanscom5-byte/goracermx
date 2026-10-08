import { MotocrossClass, BlockConfig, SessionSlot, BlockId } from '../types';

export const MOTOCROSS_CLASSES: MotocrossClass[] = [
  {
    id: 'cx3-c',
    name: 'Cobra CX3 - Class C',
    category: 'cx3',
    machineModel: 'CX3',
    skillLevel: 'C',
    model: 'Cobra Moto CX3 (40 Unit Fleet)',
    subTitle: 'Ages 7–9 • C Class (Novice / Beginner)',
    ageBracket: 'Ages 7–9',
    colorScheme: {
      primary: '#10b981', // emerald
      bg: 'bg-emerald-950/40',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      accent: '#059669',
    },
  },
  {
    id: 'cx3-b',
    name: 'Cobra CX3 - Class B',
    category: 'cx3',
    machineModel: 'CX3',
    skillLevel: 'B',
    model: 'Cobra Moto CX3 (40 Unit Fleet)',
    subTitle: 'Ages 7–9 • B Class (Intermediate)',
    ageBracket: 'Ages 7–9',
    colorScheme: {
      primary: '#06b6d4', // cyan
      bg: 'bg-cyan-950/40',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      accent: '#0891b2',
    },
  },
  {
    id: 'cx5-c',
    name: 'Cobra CX5 - Class C',
    category: 'cx5',
    machineModel: 'CX5',
    skillLevel: 'C',
    model: 'Cobra Moto CX5 (40 Unit Fleet)',
    subTitle: 'Ages 10–12 • C Class (Novice / Developing)',
    ageBracket: 'Ages 10–12',
    colorScheme: {
      primary: '#f59e0b', // amber
      bg: 'bg-amber-950/40',
      border: 'border-amber-500/40',
      text: 'text-amber-400',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      accent: '#d97706',
    },
  },
  {
    id: 'cx5-b',
    name: 'Cobra CX5 - Class B',
    category: 'cx5',
    machineModel: 'CX5',
    skillLevel: 'B',
    model: 'Cobra Moto CX5 (40 Unit Fleet)',
    subTitle: 'Ages 10–12 • B Class (Intermediate / Advanced)',
    ageBracket: 'Ages 10–12',
    colorScheme: {
      primary: '#ef4444', // red/orange
      bg: 'bg-rose-950/40',
      border: 'border-rose-500/40',
      text: 'text-rose-400',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      accent: '#dc2626',
    },
  },
];

export const BLOCKS_CONFIG: Record<BlockId, BlockConfig> = {
  morning: {
    id: 'morning',
    name: 'Morning Session Block',
    startTimeLabel: '8:00 AM',
    endTimeLabel: '1:30 PM',
    closingTimeLabel: '1:30 PM Block Conclusion',
    startHour: 8,
    startMinute: 0,
    durationHours: 5.5, // 8:00 AM - 1:30 PM
    totalSlots: 24, // 24 heats x 13 min = 312 min (8:00 AM - 1:12 PM + 18 min buffer to 1:30 PM)
    targetRiderMinutes: 60, // 6 heats x 10 min = 60 min per rider
    ridersPerSession: 15,
    intervalBetweenSessionsMin: 3,
    interBlockIntervalMin: 30, // 1:30 PM - 2:00 PM break
  },
  afternoon: {
    id: 'afternoon',
    name: 'Afternoon / Evening Block',
    startTimeLabel: '2:00 PM',
    endTimeLabel: '9:00 PM',
    closingTimeLabel: '9:00 PM Target Closing',
    startHour: 14,
    startMinute: 0,
    durationHours: 7.0, // 2:00 PM - 9:00 PM
    totalSlots: 32, // 32 heats x 13 min = 416 min (2:00 PM - 8:56 PM, concluding at 9:00 PM closing)
    targetRiderMinutes: 80, // 8 heats x 10 min = 80 min per rider
    ridersPerSession: 15,
    intervalBetweenSessionsMin: 3,
    interBlockIntervalMin: 30,
  },
};

/**
 * Format total minutes from midnight into 12-hour AM/PM string
 */
export function formatTimeLabel(totalMinutes: number): string {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hours12}:${minsStr} ${ampm}`;
}

/**
 * Generates the full schedule for a given block incorporating the 3-minute session interval
 */
export function generateBlockSchedule(blockId: BlockId): SessionSlot[] {
  const config = BLOCKS_CONFIG[blockId];
  const startMins = config.startHour * 60 + config.startMinute;
  const slots: SessionSlot[] = [];
  const totalSlots = config.totalSlots;
  const totalHeatsPerClass = totalSlots / 4; // 6 for morning, 8 for afternoon

  const classHeatCounters: Record<string, number> = {
    'cx3-c': 0,
    'cx3-b': 0,
    'cx5-c': 0,
    'cx5-b': 0,
  };

  for (let i = 0; i < totalSlots; i++) {
    const classIndex = i % 4;
    const currentClass = MOTOCROSS_CLASSES[classIndex];
    classHeatCounters[currentClass.id] += 1;
    const heatNum = classHeatCounters[currentClass.id];

    // Each session cycle = 10 minutes on-track riding + 3 minutes paddock clearing interval = 13 minutes
    const slotStartMins = startMins + i * 13;
    const rideEndMins = slotStartMins + 10;
    const slotEndMins = slotStartMins + 13;
    const cumulativeMins = heatNum * 10;

    slots.push({
      index: i,
      startTime: formatTimeLabel(slotStartMins),
      rideEndTime: formatTimeLabel(rideEndMins),
      endTime: formatTimeLabel(slotEndMins),
      startMinutesFromMidnight: slotStartMins,
      rideDurationMinutes: 10,
      intervalMinutes: 3,
      totalSlotMinutes: 13,
      classId: currentClass.id,
      className: currentClass.name,
      heatNumber: heatNum,
      totalHeats: totalHeatsPerClass,
      cumulativeTrackMinutes: cumulativeMins,
      isTargetComplete: heatNum === totalHeatsPerClass,
    });
  }

  return slots;
}
