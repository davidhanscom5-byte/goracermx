export type BikeType = 'cx3' | 'cx5' | 'cobra' | 'stacyc';

export type SkillLevel = 'B' | 'C';

export type MachineModel = 'CX3' | 'CX5';

export type BlockId = 'morning' | 'afternoon';

export type ActiveRoleTerminal =
  | 'director'           // Track Director: Full access to all operations & track control
  | 'machine-marshall'   // Machine Marshall: Dedicated UI for 80 Cobra Moto e-bikes
  | 'registration'       // Registration Desk: Front office check-in, bookings & walk-ins
  | 'standalone-products'// Standalone Product Packages: Go Gate, Go Win, Go Ride, Go Race, Go Academy
  | 'paddock-tv'         // Paddock TV Mode: Spectator & pit broadcast board
  | 'public-portal';     // Public Portal: Online customer pre-registration

export type TrackFlag = 'GREEN' | 'YELLOW' | 'RED' | 'WHITE' | 'CHECKERED';

export type SessionPhase = 'riding' | 'interval';

export interface MotocrossClass {
  id: string;
  name: string;
  category: BikeType;
  machineModel?: MachineModel;
  skillLevel?: SkillLevel;
  model: string;
  subTitle: string;
  ageBracket: string;
  colorScheme: {
    primary: string;
    bg: string;
    border: string;
    text: string;
    badge: string;
    accent: string;
  };
}

export interface Rider {
  id: string;
  number: string;
  name: string;
  classId: string;
  blockId: BlockId;
  transponderId: string;
  riderRfidTag: string; // RFID Tag assigned to the rider (wristband/jersey)
  machineRfidTag: string; // RFID Tag assigned to the bike/machine (frame/fender)
  batteryPercent: number;
  batteryStatus: 'full' | 'charging' | 'swapped' | 'low';
  checkedIn: boolean;
  waiverSigned: boolean;
  qualificationType?: 'electric_bicycle' | 'motocross' | 'promoted';
  isPromotedToB?: boolean;
  promotionDetails?: {
    promotedAt: string;
    parentApproval: boolean;
    parentName?: string;
    directorSignoff: boolean;
    directorName?: string;
    notes?: string;
  };
}

export interface SessionSlot {
  index: number; // 0 to N-1
  startTime: string; // e.g. "08:00 AM"
  rideEndTime: string; // e.g. "08:10 AM" (10-minute on-track heat end)
  endTime: string; // e.g. "08:13 AM" (incorporating 3-minute paddock clearing interval)
  startMinutesFromMidnight: number;
  rideDurationMinutes: number; // 10 minutes
  intervalMinutes: number; // 3 minutes
  totalSlotMinutes: number; // 13 minutes
  classId: string;
  className: string;
  heatNumber: number; // 1 to 6 (or 8)
  totalHeats: number; // 6 (or 8)
  cumulativeTrackMinutes: number; // 10, 20, 30, 40, 50, 60
  isTargetComplete: boolean; // true on final heat
}

export interface BlockConfig {
  id: BlockId;
  name: string;
  startTimeLabel: string;
  endTimeLabel: string; // "1:30 PM" or "9:00 PM"
  closingTimeLabel: string; // "1:30 PM" or "9:00 PM Target Closing"
  startHour: number; // 8 or 14
  startMinute: number; // 0
  durationHours: number; // 5.5 hours (morning) or 7.0 hours (afternoon)
  totalSlots: number; // 24 (morning) or 32 (afternoon)
  targetRiderMinutes: number; // 60 or 80 minutes
  ridersPerSession: number; // 15
  intervalBetweenSessionsMin: number; // 3 minutes
  interBlockIntervalMin: number; // 30 minutes
}

export type RiderExperienceLevel = 'electric_bicycle' | 'novice' | 'intermediate' | 'advanced' | 'expert_competition';

export interface ManufacturerGuideline {
  classId: string;
  recommendedAge: string;
  riderWeightLimit: string;
  riderHeightOrInseam: string;
  skillPrerequisites: string[];
  batteryPackType: string;
}

export type BookingTier = 'scheduled' | 'walk_in' | 'member';

export type GearArmoryStagingStatus = 'kit_requested' | 'armory_prepped' | 'issued_at_gate' | 'returned_sanitized';

export interface GearKitDetails {
  requested: boolean;
  helmetSize: string; // e.g. 'Youth M'
  bootSize: string; // e.g. 'Youth 3'
  chestProtectorSize: string; // e.g. 'Youth M (60–80 lbs)'
  jerseyPantSize: string; // e.g. 'Youth M (24-26")'
  notes?: string;
  stagingStatus: GearArmoryStagingStatus;
}

export interface Reservation {
  id: string;
  riderName: string;
  riderAge: number;
  bikeNumber: string;
  parentGuardianName: string;
  contactPhone: string;
  contactEmail: string;
  eventDate: string; // YYYY-MM-DD
  classId: string;
  blocks: BlockId[]; // ['morning'] | ['afternoon'] | ['morning', 'afternoon']
  experienceLevel: RiderExperienceLevel;
  priorTrackHistory: string; // Mandatory proof of non-first-time rider
  manufacturerGuidelinesAcknowledged: boolean;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  physicalCheckupDate: string;
  physicianClinic: string;
  gearAcknowledged: boolean; // Confirmed rider safety gear (either personal gear or requested loaner kit)
  gearLoanerRequested?: boolean; // True if client requested complimentary full track gear kit
  gearKitDetails?: GearKitDetails;
  assignedRiderRfid?: string;
  assignedMachineRfid?: string;
  createdAt: string;
  chargeDate: string; // 7 days prior to eventDate (7-day payment confirmation)
  bookingTier: BookingTier; // 'scheduled' ($65) | 'walk_in' ($85) | 'member' ($40)
  ratePerBlock: number; // $65 scheduled, $85 walk-in, $40 member
  hasAnnualMembership?: boolean;
  annualMembershipFeeIncluded?: boolean; // +$200 for annual membership
  totalAmountCalculated: number;
  amountDueToday: number; // $0.00 for advance placeholder, or immediate if walk-in / <7 days
  status: 'placeholder_locked' | 'payment_pending_7d' | 'payment_pending_1wk' | 'payment_confirmed' | 'charged' | 'cancelled';
  paymentConfirmedAt?: string;
}

export type StateOfMindAssessment = 'ready_confident' | 'hesitant_hold' | 'distressed_standdown' | 'unverified';

export type MachineImpoundStatus = 'quarantined_charging' | 'ready_for_pickup' | 'checked_out_to_gate' | 'on_track';

export interface MachineImpoundRecord {
  riderId: string;
  riderNumber: string;
  riderName: string;
  classId: string;
  impoundBay: string; // e.g., "BAY-04"
  batteryPercent: number;
  status: MachineImpoundStatus;
  isParentAlerted: boolean;
  isPickedUpByParent: boolean;
  pickedUpAt?: string;
}

export interface GateSafetyVerification {
  id: string;
  riderId: string;
  riderNumber: string;
  riderName: string;
  classId: string;
  slotIndex: number;
  blockId: BlockId;
  timestamp: string; // ISO timestamp of gate check
  cameraSourceId: string; // e.g. "GATE-CAM-01 (Starting Area)" or "MARSHAL-BODYCAM-A"
  cameraSnapshotUrl?: string; // Captured photo from camera or stream
  areYouReadyConfirmed: boolean; // Child verbal "Yes" + thumbs up
  stateOfMind: StateOfMindAssessment;
  gearCheckPassed: boolean; // Helmet buckle tight, goggles on, boots, chest protector
  machineRfidVerified: boolean; // Confirmed matches machine
  riderRfidVerified: boolean; // Confirmed matches rider
  marshalInitials: string; // Track official on duty
  notes?: string;
}

