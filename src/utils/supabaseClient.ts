import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Reservation, Rider, GateSafetyVerification } from '../types';

// Preset default URL and Publishable/Anon Key provided by the user for gomotomx.com
export const DEFAULT_SUPABASE_URL = 'https://uhvxnwxdjywwefijadmq.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_CVEeTAcaoQ2zyHfMR31fKA_Ya3ftXpq';

const STORAGE_KEY_URL = 'gomoto_supabase_url';
const STORAGE_KEY_ANON = 'gomoto_supabase_anon_key';

export function getSupabaseUrl(): string {
  const envUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim();
  }
  const stored = localStorage.getItem(STORAGE_KEY_URL);
  if (stored && stored.trim() !== '') {
    return stored.trim();
  }
  return DEFAULT_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim() !== '') {
    return envKey.trim();
  }
  const stored = localStorage.getItem(STORAGE_KEY_ANON);
  if (stored && stored.trim() !== '') {
    return stored.trim();
  }
  return DEFAULT_SUPABASE_ANON_KEY;
}

export function saveSupabaseConfig(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
}

export function clearSupabaseConfig() {
  localStorage.removeItem(STORAGE_KEY_ANON);
}

let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export function getSupabase(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  if (!url || !anonKey) {
    return null;
  }

  const clientKey = `${url}___${anonKey}`;
  if (cachedClient && lastClientKey === clientKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastClientKey = clientKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
}

/**
 * Test connectivity with Supabase by pinging or querying a table
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase URL or anon API key is missing. Please enter your anon key.',
    };
  }

  try {
    // Try querying reservations table or auth service
    const { data, error } = await supabase.from('reservations').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet (42P01 in postgres), connection is still valid!
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase project! (Tables not created yet — run the SQL schema script below).',
        };
      }
      // If unauthorized / invalid API key
      if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('apikey')) {
        return {
          success: false,
          message: `Invalid API key: ${error.message}`,
        };
      }
      return {
        success: true,
        message: `Connected to Supabase! (${error.message})`,
      };
    }

    return {
      success: true,
      message: `Successfully connected to Go Moto Supabase project (${data?.length ?? 0} existing rows found).`,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Connection test failed: ${msg}`,
    };
  }
}

/**
 * Push reservation to Supabase table
 */
export async function syncReservationToSupabase(reservation: Reservation): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = {
      id: reservation.id,
      rider_name: reservation.riderName,
      rider_age: reservation.riderAge,
      bike_number: reservation.bikeNumber,
      parent_guardian_name: reservation.parentGuardianName,
      contact_phone: reservation.contactPhone,
      contact_email: reservation.contactEmail,
      event_date: reservation.eventDate,
      class_id: reservation.classId,
      blocks: reservation.blocks,
      experience_level: reservation.experienceLevel,
      prior_track_history: reservation.priorTrackHistory,
      manufacturer_guidelines_acknowledged: reservation.manufacturerGuidelinesAcknowledged,
      insurance_provider: reservation.insuranceProvider,
      insurance_policy_number: reservation.insurancePolicyNumber,
      physical_checkup_date: reservation.physicalCheckupDate,
      physician_clinic: reservation.physicianClinic,
      gear_acknowledged: reservation.gearAcknowledged,
      gear_loaner_requested: !!reservation.gearLoanerRequested,
      gear_kit_details: reservation.gearKitDetails || null,
      assigned_rider_rfid: reservation.assignedRiderRfid || null,
      assigned_machine_rfid: reservation.assignedMachineRfid || null,
      booking_tier: reservation.bookingTier,
      rate_per_block: reservation.ratePerBlock,
      has_annual_membership: !!reservation.hasAnnualMembership,
      annual_membership_fee_included: !!reservation.annualMembershipFeeIncluded,
      total_amount_calculated: reservation.totalAmountCalculated,
      amount_due_today: reservation.amountDueToday,
      charge_date: reservation.chargeDate,
      status: reservation.status,
      payment_confirmed_at: reservation.paymentConfirmedAt || null,
      created_at: reservation.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('reservations').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase reservation upsert warning:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error syncing reservation to Supabase:', err);
    return false;
  }
}

/**
 * Fetch all reservations from Supabase
 */
export async function fetchReservationsFromSupabase(): Promise<Reservation[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Failed to fetch reservations from Supabase:', error?.message);
      return null;
    }

    return data.map((row: any): Reservation => ({
      id: row.id,
      riderName: row.rider_name,
      riderAge: Number(row.rider_age),
      bikeNumber: row.bike_number,
      parentGuardianName: row.parent_guardian_name,
      contactPhone: row.contact_phone,
      contactEmail: row.contact_email,
      eventDate: row.event_date,
      classId: row.class_id,
      blocks: Array.isArray(row.blocks) ? row.blocks : ['morning'],
      experienceLevel: row.experience_level,
      priorTrackHistory: row.prior_track_history,
      manufacturerGuidelinesAcknowledged: Boolean(row.manufacturer_guidelines_acknowledged),
      insuranceProvider: row.insurance_provider,
      insurancePolicyNumber: row.insurance_policy_number,
      physicalCheckupDate: row.physical_checkup_date,
      physicianClinic: row.physician_clinic,
      gearAcknowledged: Boolean(row.gear_acknowledged),
      gearLoanerRequested: Boolean(row.gear_loaner_requested),
      gearKitDetails: row.gear_kit_details || undefined,
      assignedRiderRfid: row.assigned_rider_rfid || undefined,
      assignedMachineRfid: row.assigned_machine_rfid || undefined,
      bookingTier: row.booking_tier,
      ratePerBlock: Number(row.rate_per_block),
      hasAnnualMembership: Boolean(row.has_annual_membership),
      annualMembershipFeeIncluded: Boolean(row.annual_membership_fee_included),
      totalAmountCalculated: Number(row.total_amount_calculated),
      amountDueToday: Number(row.amount_due_today),
      chargeDate: row.charge_date,
      status: row.status,
      paymentConfirmedAt: row.payment_confirmed_at || undefined,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('Error fetching reservations:', err);
    return null;
  }
}

/**
 * Sync Riders & Cobra Moto fleet to Supabase
 */
export async function syncRidersToSupabase(riders: Rider[]): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const rows = riders.map((r) => ({
      id: r.id,
      number: r.number,
      name: r.name,
      class_id: r.classId,
      block_id: r.blockId,
      transponder_id: r.transponderId,
      rider_rfid_tag: r.riderRfidTag,
      machine_rfid_tag: r.machineRfidTag,
      battery_percent: r.batteryPercent,
      battery_status: r.batteryStatus,
      checked_in: r.checkedIn,
      waiver_signed: r.waiverSigned,
      qualification_type: r.qualificationType || 'electric_bicycle',
      is_promoted_to_b: !!r.isPromotedToB,
      promotion_details: r.promotionDetails || null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('riders').upsert(rows, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase riders upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error syncing riders:', err);
    return false;
  }
}

/**
 * Fetch all riders from Supabase
 */
export async function fetchRidersFromSupabase(): Promise<Rider[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('riders').select('*').order('number', { ascending: true });
    if (error || !data) return null;

    return data.map((row: any): Rider => ({
      id: row.id,
      number: row.number,
      name: row.name,
      classId: row.class_id,
      blockId: row.block_id,
      transponderId: row.transponder_id,
      riderRfidTag: row.rider_rfid_tag,
      machineRfidTag: row.machine_rfid_tag,
      batteryPercent: Number(row.battery_percent),
      batteryStatus: row.battery_status,
      checkedIn: Boolean(row.checked_in),
      waiverSigned: Boolean(row.waiver_signed),
      qualificationType: row.qualification_type,
      isPromotedToB: Boolean(row.is_promoted_to_b),
      promotionDetails: row.promotion_details || undefined,
    }));
  } catch (err) {
    console.error('Error fetching riders:', err);
    return null;
  }
}

/**
 * Sync Gate Safety Verification check to Supabase
 */
export async function syncGateVerificationToSupabase(verification: GateSafetyVerification): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const row = {
      id: verification.id,
      rider_id: verification.riderId,
      rider_number: verification.riderNumber,
      rider_name: verification.riderName,
      class_id: verification.classId,
      slot_index: verification.slotIndex,
      block_id: verification.blockId,
      timestamp: verification.timestamp,
      camera_source_id: verification.cameraSourceId,
      camera_snapshot_url: verification.cameraSnapshotUrl || null,
      are_you_ready_confirmed: verification.areYouReadyConfirmed,
      state_of_mind: verification.stateOfMind,
      gear_check_passed: verification.gearCheckPassed,
      machine_rfid_verified: verification.machineRfidVerified,
      rider_rfid_verified: verification.riderRfidVerified,
      marshal_initials: verification.marshalInitials,
      notes: verification.notes || null,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('gate_verifications').upsert(row, { onConflict: 'id' });
    if (error) {
      console.warn('Supabase gate verification upsert error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error syncing gate verification:', err);
    return false;
  }
}

/**
 * Complete SQL DDL Schema ready to run in Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- =========================================================================
-- GO MOTO ARENA (gomotomx.com) SUPABASE DATABASE SCHEMA
-- Track Specifications, Cobra Moto CX3/CX5 Fleet, 60-Day Reservations & Safety
-- Run this in: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. RESERVATIONS TABLE (60-day reservation window, 7-day payment protocol)
CREATE TABLE IF NOT EXISTS reservations (
  id TEXT PRIMARY KEY,
  rider_name TEXT NOT NULL,
  rider_age INTEGER NOT NULL,
  bike_number TEXT NOT NULL,
  parent_guardian_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  event_date DATE NOT NULL,
  class_id TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '["morning"]'::jsonb,
  experience_level TEXT NOT NULL,
  prior_track_history TEXT NOT NULL,
  manufacturer_guidelines_acknowledged BOOLEAN DEFAULT TRUE,
  insurance_provider TEXT NOT NULL,
  insurance_policy_number TEXT NOT NULL,
  physical_checkup_date TEXT NOT NULL,
  physician_clinic TEXT NOT NULL,
  gear_acknowledged BOOLEAN DEFAULT TRUE,
  gear_loaner_requested BOOLEAN DEFAULT FALSE,
  gear_kit_details JSONB,
  assigned_rider_rfid TEXT,
  assigned_machine_rfid TEXT,
  booking_tier TEXT NOT NULL DEFAULT 'scheduled',
  rate_per_block NUMERIC NOT NULL DEFAULT 65,
  has_annual_membership BOOLEAN DEFAULT FALSE,
  annual_membership_fee_included BOOLEAN DEFAULT FALSE,
  total_amount_calculated NUMERIC NOT NULL DEFAULT 65,
  amount_due_today NUMERIC NOT NULL DEFAULT 0,
  charge_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'placeholder_locked',
  payment_confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast querying by date, status, and rider
CREATE INDEX IF NOT EXISTS idx_reservations_event_date ON reservations(event_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_class_id ON reservations(class_id);
CREATE INDEX IF NOT EXISTS idx_reservations_charge_date ON reservations(charge_date);

-- 2. RIDERS TABLE (Active roster, 80 Cobra Moto units, RFID tags & Promotion)
CREATE TABLE IF NOT EXISTS riders (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  name TEXT NOT NULL,
  class_id TEXT NOT NULL,
  block_id TEXT NOT NULL,
  transponder_id TEXT NOT NULL,
  rider_rfid_tag TEXT NOT NULL,
  machine_rfid_tag TEXT NOT NULL,
  battery_percent INTEGER NOT NULL DEFAULT 100,
  battery_status TEXT NOT NULL DEFAULT 'full',
  checked_in BOOLEAN NOT NULL DEFAULT FALSE,
  waiver_signed BOOLEAN NOT NULL DEFAULT FALSE,
  qualification_type TEXT DEFAULT 'electric_bicycle',
  is_promoted_to_b BOOLEAN DEFAULT FALSE,
  promotion_details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riders_class_block ON riders(class_id, block_id);
CREATE INDEX IF NOT EXISTS idx_riders_rfid ON riders(rider_rfid_tag, machine_rfid_tag);

-- 3. GATE SAFETY VERIFICATIONS (6-point check, Camera capture, Are You Ready?)
CREATE TABLE IF NOT EXISTS gate_verifications (
  id TEXT PRIMARY KEY,
  rider_id TEXT NOT NULL,
  rider_number TEXT NOT NULL,
  rider_name TEXT NOT NULL,
  class_id TEXT NOT NULL,
  slot_index INTEGER NOT NULL,
  block_id TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  camera_source_id TEXT NOT NULL,
  camera_snapshot_url TEXT,
  are_you_ready_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
  state_of_mind TEXT NOT NULL DEFAULT 'ready_confident',
  gear_check_passed BOOLEAN NOT NULL DEFAULT TRUE,
  machine_rfid_verified BOOLEAN NOT NULL DEFAULT TRUE,
  rider_rfid_verified BOOLEAN NOT NULL DEFAULT TRUE,
  marshal_initials TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gate_verifications_timestamp ON gate_verifications(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_gate_verifications_rider ON gate_verifications(rider_id);

-- 4. TRACK SAFETY & HARDWARE LOG (Sub-surface hydration, Caution Lighting, Emergency Exits)
CREATE TABLE IF NOT EXISTS track_safety_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  current_flag TEXT NOT NULL,
  hydration_status TEXT DEFAULT 'standby',
  traffic_lights_state TEXT DEFAULT 'RED',
  exit_doors_status TEXT DEFAULT 'clear',
  recorded_by TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE gate_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE track_safety_logs ENABLE ROW LEVEL SECURITY;

-- Allow public and authenticated clients to read and write (for kiosk & parent booking)
DROP POLICY IF EXISTS "Public full access to reservations" ON reservations;
CREATE POLICY "Public full access to reservations" ON reservations
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to riders" ON riders;
CREATE POLICY "Public full access to riders" ON riders
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to gate_verifications" ON gate_verifications;
CREATE POLICY "Public full access to gate_verifications" ON gate_verifications
  FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public full access to track_safety_logs" ON track_safety_logs;
CREATE POLICY "Public full access to track_safety_logs" ON track_safety_logs
  FOR ALL TO public USING (true) WITH CHECK (true);
`;
