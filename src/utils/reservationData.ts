import { ManufacturerGuideline, Reservation, BlockId, BookingTier } from '../types';

export const MANUFACTURER_GUIDELINES: Record<string, ManufacturerGuideline> = {
  'cx3-c': {
    classId: 'cx3-c',
    recommendedAge: 'Ages 7–9 Years',
    riderWeightLimit: 'Max 85 lbs (38 kg) per Cobra Moto CX3 OEM Specs',
    riderHeightOrInseam: 'Minimum 19" (48 cm) inseam',
    skillPrerequisites: [
      'Class C (Novice / Beginner): Proficient use of an electric bicycle qualifies a participant (demonstrating two-wheel balance, throttle control, and braking modulation)',
      'Demonstrated understanding of track flag signaling, gate staging, and yellow/red safety procedures',
      'Promotion Pathway: Riders who demonstrate proficient motocross skills shall be promoted to Class B with parent approval as directed by the Track Director',
    ],
    batteryPackType: 'Cobra Moto CX3 Rapid-Swap Li-Ion Fleet Pack',
  },
  'cx3-b': {
    classId: 'cx3-b',
    recommendedAge: 'Ages 7–9 Years',
    riderWeightLimit: 'Max 85 lbs (38 kg) per Cobra Moto CX3 OEM Specs',
    riderHeightOrInseam: 'Minimum 19" (48 cm) inseam',
    skillPrerequisites: [
      'Class B (Intermediate): Solid cornering speed, standing over obstacles, and controlled jumps',
      'Eligibility: Promoted from Class C by Track Director with parent approval, or proven organized youth motocross racing credentials',
      'Adherence to gate staging protocol, track etiquette, and fast-paced heat line choices',
    ],
    batteryPackType: 'Cobra Moto CX3 Rapid-Swap Li-Ion Fleet Pack',
  },
  'cx5-c': {
    classId: 'cx5-c',
    recommendedAge: 'Ages 10–12 Years',
    riderWeightLimit: 'Max 125 lbs (57 kg) per Cobra Moto CX5 OEM Specs',
    riderHeightOrInseam: 'Minimum 23" (58 cm) seat clearance',
    skillPrerequisites: [
      'Class C (Novice / Developing): Proficient use of an electric bicycle qualifies a participant (demonstrating throttle modulation, two-wheel balance, and brake control)',
      'Capable of managing 50cc competition chassis power response and track flag compliance',
      'Promotion Pathway: Riders who demonstrate proficient motocross skills shall be promoted to Class B with parent approval as directed by the Track Director',
    ],
    batteryPackType: 'Cobra Moto CX5 High-Output Liquid-Cooled Pack',
  },
  'cx5-b': {
    classId: 'cx5-b',
    recommendedAge: 'Ages 10–12 Years',
    riderWeightLimit: 'Max 125 lbs (57 kg) per Cobra Moto CX5 OEM Specs',
    riderHeightOrInseam: 'Full competition frame geometry',
    skillPrerequisites: [
      'Class B (Intermediate / Advanced): Aggressive racing lines, scrubbing, jumping, and passing etiquette',
      'Eligibility: Promoted from Class C by Track Director with parent approval, or active amateur national/regional youth motocross history',
      'Flawless throttle and brake modulation under full electric power delivery',
    ],
    batteryPackType: 'Cobra Moto CX5 High-Output Liquid-Cooled Pack',
  },
};

export const PRICING_RATES = {
  SCHEDULED_BLOCK: 65,
  WALK_IN_BLOCK: 85,
  MEMBER_BLOCK: 40,
  ANNUAL_MEMBERSHIP_FEE: 200,
  RESERVATION_WINDOW_DAYS: 60,
  PAYMENT_CONFIRMATION_DAYS_PRIOR: 7,
  GEAR_KIT_ADVANCE_NOTICE_DAYS: 7, // Minimum 1 week advance notice required to request complimentary full gear kit
} as const;

export const GEAR_SIZING_OPTIONS = {
  helmetSizes: [
    { value: 'Youth S', label: 'Youth Small (47–48 cm / 18.5–19 in)' },
    { value: 'Youth M', label: 'Youth Medium (49–50 cm / 19.3–19.7 in)' },
    { value: 'Youth L', label: 'Youth Large (51–52 cm / 20.1–20.5 in)' },
    { value: 'Youth XL', label: 'Youth XL (53–54 cm / 20.9–21.3 in)' },
  ],
  bootSizes: [
    { value: 'Youth 1', label: 'Youth 1 (US 1 / EU 32)' },
    { value: 'Youth 2', label: 'Youth 2 (US 2 / EU 33)' },
    { value: 'Youth 3', label: 'Youth 3 (US 3 / EU 34)' },
    { value: 'Youth 4', label: 'Youth 4 (US 4 / EU 36)' },
    { value: 'Youth 5', label: 'Youth 5 (US 5 / EU 37)' },
    { value: 'Youth 6', label: 'Youth 6 (US 6 / EU 38)' },
    { value: 'Youth 7', label: 'Youth 7 (US 7 / EU 39)' },
  ],
  chestProtectorSizes: [
    { value: 'Youth S (40–60 lbs)', label: 'Youth Small (40–60 lbs / 18–27 kg)' },
    { value: 'Youth M (60–80 lbs)', label: 'Youth Medium (60–80 lbs / 27–36 kg)' },
    { value: 'Youth L (80–110 lbs)', label: 'Youth Large (80–110 lbs / 36–50 kg)' },
  ],
  jerseyPantSizes: [
    { value: 'Youth S (20-22")', label: 'Youth Small (Waist 20–22" / Jersey YS)' },
    { value: 'Youth M (24-26")', label: 'Youth Medium (Waist 24–26" / Jersey YM)' },
    { value: 'Youth L (26-28")', label: 'Youth Large (Waist 26–28" / Jersey YL)' },
    { value: 'Youth XL (28-30")', label: 'Youth XL (Waist 28–30" / Jersey YXL)' },
  ],
};

/**
 * Validates if an event date qualifies for a complimentary full track gear kit request
 * (Must be requested at least a week ahead of time: >= 7 days)
 */
export function canRequestGearKit(eventDateStr: string): { eligible: boolean; daysUntil: number; message?: string } {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = eventDateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntil >= PRICING_RATES.GEAR_KIT_ADVANCE_NOTICE_DAYS) {
      return { eligible: true, daysUntil };
    } else {
      return {
        eligible: false,
        daysUntil: Math.max(0, daysUntil),
        message: `Complimentary full gear kits require at least 1 week (7 days) advance notice for armory sizing, technical inspection, and sanitization. This event is ${daysUntil < 0 ? 'in the past' : `${daysUntil} day(s) away`}. Rider must provide personal safety gear.`,
      };
    }
  } catch {
    return { eligible: false, daysUntil: 0, message: 'Invalid event date.' };
  }
}

/**
 * Calculates the payment confirmation / charge date (exactly 7 days prior to the event date)
 */
export function calculateChargeDate(eventDateStr: string): string {
  try {
    const [year, month, day] = eventDateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() - PRICING_RATES.PAYMENT_CONFIRMATION_DAYS_PRIOR);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  } catch {
    return eventDateStr;
  }
}

/**
 * Calculates reservation cost total
 * $65 for scheduled block, $85 for walk-in, $40 per block for members (with optional $200/yr membership fee)
 */
export function calculateReservationCost(
  blocks: BlockId[],
  bookingTier: BookingTier = 'scheduled',
  includeMembershipFee: boolean = false
): number {
  let rate: number = PRICING_RATES.SCHEDULED_BLOCK;
  if (bookingTier === 'walk_in') rate = PRICING_RATES.WALK_IN_BLOCK;
  if (bookingTier === 'member') rate = PRICING_RATES.MEMBER_BLOCK;

  const blocksSubtotal = blocks.length * rate;
  const membership = includeMembershipFee ? PRICING_RATES.ANNUAL_MEMBERSHIP_FEE : 0;
  return blocksSubtotal + membership;
}

/**
 * Detailed cost breakdown helper
 */
export function calculatePricingBreakdown(
  blocks: BlockId[],
  bookingTier: BookingTier = 'scheduled',
  includeMembershipFee: boolean = false
) {
  let ratePerBlock: number = PRICING_RATES.SCHEDULED_BLOCK;
  if (bookingTier === 'walk_in') ratePerBlock = PRICING_RATES.WALK_IN_BLOCK;
  if (bookingTier === 'member') ratePerBlock = PRICING_RATES.MEMBER_BLOCK;

  const blocksSubtotal = blocks.length * ratePerBlock;
  const membershipFee = includeMembershipFee ? PRICING_RATES.ANNUAL_MEMBERSHIP_FEE : 0;
  const total = blocksSubtotal + membershipFee;
  const savingsPerBlock = bookingTier === 'member' ? (PRICING_RATES.SCHEDULED_BLOCK - PRICING_RATES.MEMBER_BLOCK) : 0;
  const totalSavings = savingsPerBlock * blocks.length;

  return {
    ratePerBlock,
    blocksCount: blocks.length,
    blocksSubtotal,
    membershipFee,
    total,
    savingsPerBlock,
    totalSavings,
  };
}

/**
 * Current date string YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Maximum advance scheduling date (strictly 60-day reservation window)
 */
export function getMaxAdvanceDateString(daysAhead: number = PRICING_RATES.RESERVATION_WINDOW_DAYS): string {
  const future = new Date();
  future.setDate(future.getDate() + daysAhead);
  const y = future.getFullYear();
  const m = String(future.getMonth() + 1).padStart(2, '0');
  const d = String(future.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Validates if an event date is strictly within the 60-day window
 */
export function isDateWithinReservationWindow(eventDateStr: string): { valid: boolean; daysUntil: number; message?: string } {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = eventDateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntil < 0) {
      return { valid: false, daysUntil, message: 'Event date cannot be in the past.' };
    }
    if (daysUntil > PRICING_RATES.RESERVATION_WINDOW_DAYS) {
      return {
        valid: false,
        daysUntil,
        message: `Only a 60-day reservation window is allowed (latest date: ${getMaxAdvanceDateString()}). You selected ${daysUntil} days in advance.`,
      };
    }
    return { valid: true, daysUntil };
  } catch {
    return { valid: false, daysUntil: 0, message: 'Invalid date specified.' };
  }
}

/**
 * Checks if 7-day payment confirmation is due (within 7 days of event)
 */
export function isPaymentConfirmationDue(eventDateStr: string): boolean {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = eventDateStr.split('-').map(Number);
    const targetDate = new Date(y, m - 1, d);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return daysUntil <= PRICING_RATES.PAYMENT_CONFIRMATION_DAYS_PRIOR;
  } catch {
    return false;
  }
}

/**
 * Sample pre-seeded advance reservations within the strictly allowed 60-day window
 */
export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    riderName: 'Chase "Maverick" Vance',
    riderAge: 7,
    bikeNumber: '17',
    parentGuardianName: 'Greg Vance',
    contactPhone: '(555) 234-8891',
    contactEmail: 'greg.vance@example.com',
    eventDate: '2026-10-18', // ~28 days in advance (within 60-day window)
    classId: 'cx3-b',
    blocks: ['morning'],
    experienceLevel: 'advanced',
    priorTrackHistory: '2 seasons District 37 Youth Mini Moto, Milestone MX regular',
    manufacturerGuidelinesAcknowledged: true,
    insuranceProvider: 'Blue Cross Blue Shield of CA',
    insurancePolicyNumber: 'BC-9982410-A',
    physicalCheckupDate: '2026-06-15',
    physicianClinic: 'Pediatric Sports Medicine Group / Dr. H. Lin',
    gearAcknowledged: true,
    gearLoanerRequested: false, // Rider brings personal gear
    createdAt: '2026-09-01',
    chargeDate: '2026-10-11', // 7 days prior to event
    bookingTier: 'scheduled',
    ratePerBlock: 65,
    totalAmountCalculated: 65,
    amountDueToday: 0,
    status: 'placeholder_locked',
  },
  {
    id: 'res-102',
    riderName: 'Ruby "Spark" Martinez',
    riderAge: 8,
    bikeNumber: '8',
    parentGuardianName: 'Carlos Martinez',
    contactPhone: '(555) 443-1290',
    contactEmail: 'cmartinez@example.com',
    eventDate: '2026-11-07', // ~48 days in advance (within 60-day window)
    classId: 'cx3-c',
    blocks: ['morning', 'afternoon'],
    experienceLevel: 'electric_bicycle',
    priorTrackHistory: 'Class C Qualifier: 2 years electric balance bike pump track, controlled throttle',
    manufacturerGuidelinesAcknowledged: true,
    insuranceProvider: 'Kaiser Permanente',
    insurancePolicyNumber: 'KP-55209118',
    physicalCheckupDate: '2026-05-20',
    physicianClinic: 'Kaiser Youth Health Center / Dr. S. Patel',
    gearAcknowledged: true,
    gearLoanerRequested: true, // Requested complimentary full kit (barrier removal program)
    gearKitDetails: {
      requested: true,
      helmetSize: 'Youth M',
      bootSize: 'Youth 2',
      chestProtectorSize: 'Youth S (40–60 lbs)',
      jerseyPantSize: 'Youth S (20-22")',
      notes: 'First time full MX kit loaner; request boot sizing check at check-in',
      stagingStatus: 'armory_prepped',
    },
    createdAt: '2026-09-02',
    chargeDate: '2026-10-31', // 7 days prior
    bookingTier: 'member',
    ratePerBlock: 40,
    hasAnnualMembership: true,
    totalAmountCalculated: 80, // 2 blocks x $40 member rate
    amountDueToday: 0,
    status: 'placeholder_locked',
  },
  {
    id: 'res-103',
    riderName: 'Braxton "Blaze" Taylor',
    riderAge: 11,
    bikeNumber: '4',
    parentGuardianName: 'Sarah Taylor',
    contactPhone: '(555) 871-3329',
    contactEmail: 'sarah.taylor@example.com',
    eventDate: '2026-09-24', // 4 days away! (Within 7-day payment window)
    classId: 'cx5-b',
    blocks: ['morning'],
    experienceLevel: 'expert_competition',
    priorTrackHistory: 'AMA Youth Regional Champion, 3 years competitive MX',
    manufacturerGuidelinesAcknowledged: true,
    insuranceProvider: 'United Healthcare',
    insurancePolicyNumber: 'UHC-4401982-Z',
    physicalCheckupDate: '2026-04-10',
    physicianClinic: 'Oak Ridge Pediatrics / Dr. R. Gomez',
    gearAcknowledged: true,
    gearLoanerRequested: false, // Walk-in (<7 days), owns own gear
    createdAt: '2026-09-15',
    chargeDate: '2026-09-17',
    bookingTier: 'walk_in',
    ratePerBlock: 85,
    totalAmountCalculated: 85, // $85 walk-in rate
    amountDueToday: 85,
    status: 'payment_confirmed',
    paymentConfirmedAt: '2026-09-17 09:15 AM',
  },
  {
    id: 'res-104',
    riderName: 'Logan "Rocket" Hayes',
    riderAge: 10,
    bikeNumber: '29',
    parentGuardianName: 'Danielle Hayes',
    contactPhone: '(555) 602-9182',
    contactEmail: 'dhayes.moto@example.com',
    eventDate: '2026-11-12', // ~53 days in advance (within 60-day window)
    classId: 'cx5-c',
    blocks: ['afternoon'],
    experienceLevel: 'novice',
    priorTrackHistory: 'Glen Helen practice series & electric balance bike transitions',
    manufacturerGuidelinesAcknowledged: true,
    insuranceProvider: 'Aetna Student & Youth Health',
    insurancePolicyNumber: 'AET-88120349',
    physicalCheckupDate: '2026-07-22',
    physicianClinic: 'Valley Pediatric Care / Dr. M. Torres',
    gearAcknowledged: true,
    gearLoanerRequested: true, // Requested complimentary full kit
    gearKitDetails: {
      requested: true,
      helmetSize: 'Youth L',
      bootSize: 'Youth 5',
      chestProtectorSize: 'Youth M (60–80 lbs)',
      jerseyPantSize: 'Youth M (24-26")',
      stagingStatus: 'kit_requested',
    },
    createdAt: '2026-09-18',
    chargeDate: '2026-11-05', // 7 days prior
    bookingTier: 'scheduled',
    ratePerBlock: 65,
    totalAmountCalculated: 65, // $65 scheduled rate
    amountDueToday: 0,
    status: 'placeholder_locked',
  },
];
