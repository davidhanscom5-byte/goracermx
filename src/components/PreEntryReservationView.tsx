import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  DollarSign,
  User,
  Phone,
  Mail,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Search,
  CheckSquare,
  Square,
  Lock,
  CreditCard,
  Award,
  Sparkles,
  Tag,
  Shirt,
  HeartHandshake,
  ArrowRight,
  RotateCcw,
  Database,
} from 'lucide-react';
import {
  Reservation,
  MotocrossClass,
  BlockId,
  RiderExperienceLevel,
  BookingTier,
  GearKitDetails,
  GearArmoryStagingStatus,
} from '../types';
import {
  MANUFACTURER_GUIDELINES,
  PRICING_RATES,
  calculateChargeDate,
  calculateReservationCost,
  calculatePricingBreakdown,
  getTodayDateString,
  getMaxAdvanceDateString,
  isDateWithinReservationWindow,
  isPaymentConfirmationDue,
  canRequestGearKit,
  GEAR_SIZING_OPTIONS,
} from '../utils/reservationData';

interface PreEntryReservationViewProps {
  reservations: Reservation[];
  classes: MotocrossClass[];
  onAddReservation: (res: Reservation) => void;
  onUpdateReservation?: (updated: Reservation) => void;
  onCancelReservation: (resId: string) => void;
  onConfirmPayment?: (resId: string) => void;
  onLaunchClientScreen?: () => void;
  onOpenSupabaseModal?: () => void;
}

export const PreEntryReservationView: React.FC<PreEntryReservationViewProps> = ({
  reservations,
  classes,
  onAddReservation,
  onUpdateReservation,
  onCancelReservation,
  onConfirmPayment,
  onLaunchClientScreen,
  onOpenSupabaseModal,
}) => {
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [gearFilter, setGearFilter] = useState<'all' | 'loaner_kit' | 'personal'>('all');
  const [expandedResId, setExpandedResId] = useState<string | null>(null);

  // Form State
  const [eventDate, setEventDate] = useState<string>(() => {
    // Default to a date 14 days from today (within 60-day window)
    const d = new Date();
    d.setDate(d.getDate() + 14);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  const [bookingTier, setBookingTier] = useState<BookingTier>('scheduled');
  const [purchaseAnnualMembership, setPurchaseAnnualMembership] = useState<boolean>(false);
  const [selectedBlocks, setSelectedBlocks] = useState<BlockId[]>(['morning']);
  const [selectedClassId, setSelectedClassId] = useState<string>('cx3-c');

  // Rider info
  const [riderName, setRiderName] = useState('');
  const [riderAge, setRiderAge] = useState<number>(8);
  const [bikeNumber, setBikeNumber] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Experience & Manufacturer Compliance
  const [experienceLevel, setExperienceLevel] = useState<RiderExperienceLevel>('novice');
  const [priorTrackHistory, setPriorTrackHistory] = useState('');
  const [oemComplianceAcknowledged, setOemComplianceAcknowledged] = useState(false);

  // Medical & Insurance
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insurancePolicy, setInsurancePolicy] = useState('');
  const [physicalDate, setPhysicalDate] = useState('');
  const [physicianClinic, setPhysicianClinic] = useState('');

  // Riding Gear & Loaner Kit (Financial Barrier Removal Program)
  const [gearChoice, setGearChoice] = useState<'own_gear' | 'request_kit'>('own_gear');
  const [gearAcknowledged, setGearAcknowledged] = useState(false);
  const [gearHelmetSize, setGearHelmetSize] = useState<string>('Youth M');
  const [gearBootSize, setGearBootSize] = useState<string>('Youth 3');
  const [gearChestSize, setGearChestSize] = useState<string>('Youth M (60–80 lbs)');
  const [gearJerseySize, setGearJerseySize] = useState<string>('Youth M (24-26")');
  const [gearSizingNotes, setGearSizingNotes] = useState<string>('');
  const [gearKitAcknowledged, setGearKitAcknowledged] = useState<boolean>(false);

  // Validation / Submission message
  const [formError, setFormError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Selected Class Metadata & Guidelines
  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const oemGuidelines = MANUFACTURER_GUIDELINES[selectedClassId] || MANUFACTURER_GUIDELINES['cx3-c'];

  // Calculated Pricing
  const pricingBreakdown = calculatePricingBreakdown(
    selectedBlocks,
    bookingTier,
    bookingTier === 'member' && purchaseAnnualMembership
  );
  const totalCalculated = pricingBreakdown.total;
  const dueToday = bookingTier === 'walk_in'
    ? pricingBreakdown.total
    : (bookingTier === 'member' && purchaseAnnualMembership ? pricingBreakdown.membershipFee : 0);
  const chargeDate = calculateChargeDate(eventDate);
  const dateWindowCheck = isDateWithinReservationWindow(eventDate);
  const paymentDueImmediately = isPaymentConfirmationDue(eventDate) || bookingTier === 'walk_in';
  const gearKitEligibility = canRequestGearKit(eventDate);

  // Handle block toggle
  const toggleBlock = (block: BlockId) => {
    if (selectedBlocks.includes(block)) {
      if (selectedBlocks.length > 1) {
        setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
      }
    } else {
      setSelectedBlocks([...selectedBlocks, block]);
    }
  };

  // Staff action: update armory staging status
  const handleUpdateGearStatus = (res: Reservation, newStatus: GearArmoryStagingStatus) => {
    if (!onUpdateReservation || !res.gearKitDetails) return;
    const updated: Reservation = {
      ...res,
      gearKitDetails: {
        ...res.gearKitDetails,
        stagingStatus: newStatus,
      },
    };
    onUpdateReservation(updated);
  };

  // Submit Reservation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Strict validation of 60-day reservation window:
    if (!dateWindowCheck.valid) {
      setFormError(dateWindowCheck.message || 'Event date must be within the strict 60-day advance reservation window.');
      return;
    }

    // Strict validation of user intent:
    if (!priorTrackHistory.trim()) {
      setFormError('Prior track or off-road riding experience is mandatory. First-time and beginner riders are excluded for safety concerns (Novice is the minimum accepted classification).');
      return;
    }
    if (!oemComplianceAcknowledged) {
      setFormError('You must certify that the rider meets the manufacturer specifications.');
      return;
    }
    if (!insuranceProvider.trim() || !insurancePolicy.trim()) {
      setFormError('Proof of active health insurance provider and policy number is required.');
      return;
    }
    if (!physicalDate.trim() || !physicianClinic.trim()) {
      setFormError('Proof of physical checkup and physician clinic name within the last 12 months is required.');
      return;
    }

    // Gear Loaner vs Personal Gear Validation
    let gearLoanerRequested = false;
    let gearKitDetails: GearKitDetails | undefined = undefined;

    if (gearChoice === 'request_kit') {
      const eligibility = canRequestGearKit(eventDate);
      if (!eligibility.eligible) {
        setFormError(eligibility.message || 'Loaner gear kits must be requested at least 7 days in advance.');
        return;
      }
      if (!gearKitAcknowledged) {
        setFormError('Please certify the loaner gear sizing requirements and the 20-minute early arrival condition.');
        return;
      }
      gearLoanerRequested = true;
      gearKitDetails = {
        requested: true,
        helmetSize: gearHelmetSize,
        bootSize: gearBootSize,
        chestProtectorSize: gearChestSize,
        jerseyPantSize: gearJerseySize,
        notes: gearSizingNotes.trim() || undefined,
        stagingStatus: 'kit_requested',
      };
    } else {
      if (!gearAcknowledged) {
        setFormError('You must acknowledge that rider will bring all mandatory protective gear.');
        return;
      }
    }

    const dueToday = bookingTier === 'walk_in'
      ? pricingBreakdown.total
      : (bookingTier === 'member' && purchaseAnnualMembership ? PRICING_RATES.ANNUAL_MEMBERSHIP_FEE : 0);

    const initialStatus = bookingTier === 'walk_in'
      ? 'payment_confirmed'
      : (paymentDueImmediately ? 'payment_pending_7d' : 'placeholder_locked');

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      riderName: riderName.trim(),
      riderAge: Number(riderAge),
      bikeNumber: bikeNumber.trim(),
      parentGuardianName: parentName.trim(),
      contactPhone: phone.trim(),
      contactEmail: email.trim(),
      eventDate,
      classId: selectedClassId,
      blocks: selectedBlocks,
      experienceLevel,
      priorTrackHistory: priorTrackHistory.trim(),
      manufacturerGuidelinesAcknowledged: true,
      insuranceProvider: insuranceProvider.trim(),
      insurancePolicyNumber: insurancePolicy.trim(),
      physicalCheckupDate: physicalDate,
      physicianClinic: physicianClinic.trim(),
      gearAcknowledged: true,
      gearLoanerRequested,
      gearKitDetails,
      createdAt: getTodayDateString(),
      chargeDate,
      bookingTier,
      ratePerBlock: pricingBreakdown.ratePerBlock,
      hasAnnualMembership: bookingTier === 'member',
      totalAmountCalculated: totalCalculated,
      amountDueToday: dueToday,
      status: initialStatus,
      paymentConfirmedAt: bookingTier === 'walk_in' ? `${getTodayDateString()} (Walk-In Paid)` : undefined,
    };

    onAddReservation(newRes);
    setShowBookingForm(false);
    setSuccessToast(
      `Reservation locked for ${riderName}! [${bookingTier.toUpperCase()}: $${pricingBreakdown.ratePerBlock}/blk]. ${
        gearLoanerRequested ? '★ Full Gear Loaner Kit Reserved ($0). ' : ''
      }${
        bookingTier === 'walk_in'
          ? 'Walk-in payment confirmed on-site.'
          : `$${dueToday}.00 due today. 7-day payment confirmation required on ${chargeDate}.`
      }`
    );

    // Reset fields
    setRiderName('');
    setBikeNumber('');
    setParentName('');
    setPhone('');
    setEmail('');
    setPriorTrackHistory('');
    setInsuranceProvider('');
    setInsurancePolicy('');
    setPhysicalDate('');
    setPhysicianClinic('');
    setOemComplianceAcknowledged(false);
    setGearAcknowledged(false);
    setGearChoice('own_gear');
    setGearHelmetSize('Youth M');
    setGearBootSize('Youth 3');
    setGearChestSize('Youth M (60–80 lbs)');
    setGearJerseySize('Youth M (24-26")');
    setGearSizingNotes('');
    setGearKitAcknowledged(false);
    setBookingTier('scheduled');
    setPurchaseAnnualMembership(false);

    setTimeout(() => setSuccessToast(null), 8000);
  };

  // Filtered reservations list
  const filteredReservations = reservations.filter((r) => {
    const matchesClass = classFilter === 'all' || r.classId === classFilter;
    const matchesTier = tierFilter === 'all' || r.bookingTier === tierFilter;
    const matchesGear =
      gearFilter === 'all' ||
      (gearFilter === 'loaner_kit' ? Boolean(r.gearLoanerRequested) : !r.gearLoanerRequested);
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      r.riderName.toLowerCase().includes(q) ||
      r.bikeNumber.includes(q) ||
      r.parentGuardianName.toLowerCase().includes(q) ||
      r.eventDate.includes(q);
    return matchesClass && matchesTier && matchesGear && matchesSearch;
  });

  return (
    <div id="pre-entry-reservation-view" className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-2xl p-4 text-emerald-300 flex items-start gap-3 shadow-xl">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-sm text-white">Reservation Placeholder Confirmed</p>
            <p className="mt-0.5">{successToast}</p>
          </div>
        </div>
      )}

      {/* Hero / Policy Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              60-Day Reservation Window • 7-Day Payment Confirmation Protocol
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-emerald-400">Go Moto</span> Pre-Entry Reservation &amp; Pricing
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Strictly enforced <strong className="text-emerald-400">60-day reservation window</strong> with automated <strong className="text-cyan-400">7-day advance payment confirmation</strong> prior to the event date.
            </p>

            {/* Pricing Rates Callout Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider block">
                    Scheduled Pre-Entry
                  </span>
                  <div className="text-xl font-black text-white font-mono mt-0.5">$65<span className="text-xs font-normal text-slate-400">/block</span></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                  60-day window. $0 down, 7-day payment confirmation prior to event.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider block">
                    Walk-In Entry
                  </span>
                  <div className="text-xl font-black text-white font-mono mt-0.5">$85<span className="text-xs font-normal text-slate-400">/block</span></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                  Same-day gate registration. Immediate on-site payment confirmation.
                </p>
              </div>

              <div className="bg-slate-950/80 p-3 rounded-2xl border border-cyan-500/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono tracking-wider">
                      Annual Member Rate
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                      Save $25
                    </span>
                  </div>
                  <div className="text-xl font-black text-white font-mono mt-0.5">$40<span className="text-xs font-normal text-slate-400">/block</span></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 leading-tight">
                  With $200/year membership. Lowest cost per block for regular racers.
                </p>
              </div>
            </div>

            {/* Crucial Bullet Criteria */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span><strong>60-Day Window:</strong> Bookings only allowed up to 60 days ahead</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <CreditCard className="w-4 h-4 text-cyan-400 shrink-0" />
                <span><strong>7-Day Confirmation:</strong> Payment confirmed 7 days before event</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>No First-Time Riders:</strong> Novice/E-bike min qualification</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
                <Shirt className="w-4 h-4 text-purple-400 shrink-0" />
                <span><strong>Gear Loaner Available:</strong> Request full kit 7+ days ahead ($0 fee)</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3">
            {onOpenSupabaseModal && (
              <button
                id="pre-entry-open-supabase-btn"
                type="button"
                onClick={onOpenSupabaseModal}
                className="px-4 py-3 rounded-2xl bg-cyan-950/40 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
                title="Supabase PostgreSQL Cloud Sync & Deployment"
              >
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Cloud DB Sync</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            )}

            {onLaunchClientScreen && (
              <button
                id="launch-client-screen-btn"
                type="button"
                onClick={onLaunchClientScreen}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                title="Switch to dedicated customer/parent pre-registration screen"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Open Client Screen Mode</span>
              </button>
            )}

            <button
              id="open-reservation-form-btn"
              type="button"
              onClick={() => setShowBookingForm(!showBookingForm)}
              className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Calendar className="w-4 h-4" />
              <span>{showBookingForm ? 'Close Form' : 'New Advance Reservation'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Advance Booking Form Modal / Collapsible Section */}
      {showBookingForm && (
        <form
          id="pre-entry-reservation-form"
          onSubmit={handleSubmit}
          className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-black text-white">
                Rider Pre-Entry Reservation Form
              </h3>
              <p className="text-xs text-slate-400">
                Strict 60-day reservation window with 7-day payment confirmation.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1A: Pricing Tier Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>1. Select Pricing Tier & Booking Classification</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Scheduled Tier */}
              <button
                type="button"
                onClick={() => {
                  setBookingTier('scheduled');
                  setPurchaseAnnualMembership(false);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  bookingTier === 'scheduled'
                    ? 'bg-emerald-500/20 border-emerald-500 text-white ring-1 ring-emerald-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Scheduled Block</span>
                  <span className="text-xs font-mono font-bold text-white">$65 / block</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Reserved in advance within 60 days. $0 down, 7-day payment confirmation required.
                </p>
              </button>

              {/* Walk-In Tier */}
              <button
                type="button"
                onClick={() => {
                  setBookingTier('walk_in');
                  setPurchaseAnnualMembership(false);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  bookingTier === 'walk_in'
                    ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Walk-In Entry</span>
                  <span className="text-xs font-mono font-bold text-white">$85 / block</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Same-day paddock registration. Immediate on-site payment confirmation.
                </p>
              </button>

              {/* Member Tier */}
              <button
                type="button"
                onClick={() => setBookingTier('member')}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  bookingTier === 'member'
                    ? 'bg-cyan-500/20 border-cyan-500 text-white ring-1 ring-cyan-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" /> Member Rate
                  </span>
                  <span className="text-xs font-mono font-bold text-white">$40 / block</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  $200/year annual membership ($25 savings per block).
                </p>
              </button>
            </div>

            {/* Member Add-on Option if Member Tier Selected */}
            {bookingTier === 'member' && (
              <div className="p-3 bg-cyan-950/30 border border-cyan-500/40 rounded-2xl space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={purchaseAnnualMembership}
                    onChange={(e) => setPurchaseAnnualMembership(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-xs font-bold text-cyan-200">
                    Enroll in $200/year Annual Membership today (+ $200.00 billed today)
                  </span>
                </label>
                <p className="text-[10px] text-slate-400 pl-5">
                  Uncheck if rider already has an active annual membership ID on file at the facility.
                </p>
              </div>
            )}
          </div>

          {/* Section 1B: Date & Block Selection */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>2. Select Event Date (Strict 60-Day Window) & Session Block</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Event Date (60-Day Advance Maximum)
                </label>
                <input
                  id="res-event-date"
                  type="date"
                  required
                  min={getTodayDateString()}
                  max={getMaxAdvanceDateString()}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-950 border font-mono text-xs focus:outline-none ${
                    dateWindowCheck.valid
                      ? 'border-slate-700 text-white focus:border-emerald-500'
                      : 'border-rose-500 text-rose-300 focus:border-rose-500'
                  }`}
                />
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className={dateWindowCheck.valid ? 'text-slate-400' : 'text-rose-400 font-bold'}>
                    {dateWindowCheck.valid
                      ? `${dateWindowCheck.daysUntil} days ahead (Allowed: up to 60 days)`
                      : dateWindowCheck.message}
                  </span>
                  <span className="text-slate-500 font-mono">Max: {getMaxAdvanceDateString()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Session Block ({`$${pricingBreakdown.ratePerBlock}.00`} per block)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => toggleBlock('morning')}
                    className={`p-2 rounded-xl border text-xs font-bold flex flex-col text-left transition-all ${
                      selectedBlocks.includes('morning')
                        ? 'bg-emerald-500/20 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Morning Block</span>
                    <span className="text-[10px] text-slate-400 font-mono">08:00 – 12:00</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold mt-1">
                      ${pricingBreakdown.ratePerBlock}.00
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleBlock('afternoon')}
                    className={`p-2 rounded-xl border text-xs font-bold flex flex-col text-left transition-all ${
                      selectedBlocks.includes('afternoon')
                        ? 'bg-cyan-500/20 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Afternoon Block</span>
                    <span className="text-[10px] text-slate-400 font-mono">14:00 – 18:00</span>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold mt-1">
                      ${pricingBreakdown.ratePerBlock}.00
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Class & Manufacturer Guidelines */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>2. Class Selection & Manufacturer Specifications Compliance</span>
            </h4>

            {/* Class Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {classes.map((cls) => {
                const isSelected = cls.id === selectedClassId;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate">{cls.name}</div>
                    <div className="text-[10px] text-slate-400">{cls.ageBracket}</div>
                    <div className="text-[10px] text-slate-400 mt-1 font-mono">{cls.category.toUpperCase()}</div>
                  </button>
                );
              })}
            </div>

            {/* Manufacturer Guidelines Panel */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Manufacturer OEM Guidelines for {selectedClass.name}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                <div className="bg-slate-900 p-2 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Age Criteria:</span>
                  <span className="font-semibold">{oemGuidelines.recommendedAge}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Weight Limit:</span>
                  <span className="font-semibold">{oemGuidelines.riderWeightLimit}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-xl">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Clearance:</span>
                  <span className="font-semibold">{oemGuidelines.riderHeightOrInseam}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                <p className="font-semibold text-slate-300">Prerequisites & Safety:</p>
                <ul className="list-disc list-inside space-y-0.5 text-[10px]">
                  {oemGuidelines.skillPrerequisites.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>

              {/* Mandatory OEM Checkbox */}
              <label className="flex items-start gap-2 pt-2 border-t border-slate-800/80 cursor-pointer">
                <input
                  id="check-oem-compliance"
                  type="checkbox"
                  required
                  checked={oemComplianceAcknowledged}
                  onChange={(e) => setOemComplianceAcknowledged(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                />
                <span className="text-xs text-slate-300 font-medium">
                  I certify that the rider meets the manufacturer’s recommended age, weight, and inseam specifications and has demonstrated balance and throttle competence.
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Rider Information & Experience (NO FIRST-TIME RIDERS) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>3. Rider Identity & Prior Experience (No First-Time Riders)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Rider Full Name
                </label>
                <input
                  id="res-rider-name"
                  type="text"
                  required
                  placeholder="e.g. Mason Brooks"
                  value={riderName}
                  onChange={(e) => setRiderName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Rider Age
                </label>
                <input
                  id="res-rider-age"
                  type="number"
                  required
                  min={3}
                  max={14}
                  value={riderAge}
                  onChange={(e) => setRiderAge(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Bike Number (# Plate)
                </label>
                <input
                  id="res-bike-number"
                  type="text"
                  required
                  placeholder="e.g. 19"
                  value={bikeNumber}
                  onChange={(e) => setBikeNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  id="res-parent-name"
                  type="text"
                  required
                  placeholder="Full legal name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Contact Phone
                </label>
                <input
                  id="res-contact-phone"
                  type="tel"
                  required
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Notification Email
                </label>
                <input
                  id="res-contact-email"
                  type="email"
                  required
                  placeholder="parent@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Prior Experience & Classification Standard */}
            <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Rider Classification Standard: E-Bicycle &amp; Novice Accepted</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    ✓ E-Bicycle / Novice Accepted
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                    ✕ First-Time Excluded
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                <strong>Class C Eligibility:</strong> Proficient use of an electric bicycle qualifies a participant in Class C. Riders who become proficient in motocross skills shall be promoted to Class B with parental approval as directed by the Track Director. Absolute first-time riders without basic balance/throttle familiarity are excluded for track safety.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Experience Level (Minimum: E-Bicycle / Novice)
                  </label>
                  <select
                    id="res-experience-level"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value as RiderExperienceLevel)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                  >
                    <option value="electric_bicycle">Class C Qualifier: Proficient Electric Bicycle Rider (ACCEPTED)</option>
                    <option value="novice">Class C: Novice Motocross (Basic balance &amp; throttle control - ACCEPTED)</option>
                    <option value="intermediate">Class B: Intermediate (Promoted by Track Director or organized MX - ACCEPTED)</option>
                    <option value="advanced">Class B: Advanced (Competitive regional youth series - ACCEPTED)</option>
                    <option value="expert_competition">Class B: Expert / Competition (Sanctioned club racing - ACCEPTED)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Prior Tracks / Series / Equipment History
                  </label>
                  <input
                    id="res-prior-history"
                    type="text"
                    required
                    placeholder="e.g. Electric balance bike, pump track, youth dirt course"
                    value={priorTrackHistory}
                    onChange={(e) => setPriorTrackHistory(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Health Insurance & Physical Checkup */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>4. Proof of Health Insurance & Physical Checkup</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Health Insurance Carrier / Provider
                </label>
                <input
                  id="res-insurance-provider"
                  type="text"
                  required
                  placeholder="e.g. Blue Shield, Kaiser, United, Aetna"
                  value={insuranceProvider}
                  onChange={(e) => setInsuranceProvider(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Policy / Member Number
                </label>
                <input
                  id="res-insurance-policy"
                  type="text"
                  required
                  placeholder="e.g. POL-9842104"
                  value={insurancePolicy}
                  onChange={(e) => setInsurancePolicy(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Physical Checkup Date (Within Last 12 Months)
                </label>
                <input
                  id="res-physical-date"
                  type="date"
                  required
                  value={physicalDate}
                  onChange={(e) => setPhysicalDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Physician Name / Medical Clinic
                </label>
                <input
                  id="res-physician-clinic"
                  type="text"
                  required
                  placeholder="e.g. Valley Pediatrics / Dr. H. Lin"
                  value={physicianClinic}
                  onChange={(e) => setPhysicianClinic(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Riding Gear & Complimentary Loaner Program (Financial Barrier Removal) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Shirt className="w-4 h-4 text-purple-400" />
                <span>Riding Protective Gear & Financial Barrier Removal Loaner Program</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Complimentary Full Kit ($0 Fee)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Own Gear */}
              <button
                type="button"
                id="gear-choice-own"
                onClick={() => setGearChoice('own_gear')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  gearChoice === 'own_gear'
                    ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Rider Brings Personal Gear
                  </span>
                  {gearChoice === 'own_gear' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Rider already owns DOT/ECE helmet, MX boots, chest guard, gloves, and goggles.
                </p>
              </button>

              {/* Option B: Request Complimentary Kit */}
              <button
                type="button"
                id="gear-choice-request-loaner"
                onClick={() => setGearChoice('request_kit')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  gearChoice === 'request_kit'
                    ? 'bg-purple-950/30 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
                    <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
                    Request Complimentary Loaner Kit ($0)
                  </span>
                  {gearChoice === 'request_kit' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-slate-400">
                  Removes financial barriers. Free full head-to-toe kit requested at least 1 week ahead.
                </p>
              </button>
            </div>

            {/* If Option A: Own Gear Acknowledgement */}
            {gearChoice === 'own_gear' && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2">
                <div className="text-[10px] text-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> DOT/ECE Full Helmet
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> MX Riding Boots
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Chest / Roost Guard
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Goggles & Gloves
                  </span>
                </div>
                <label className="flex items-start gap-2 pt-2 border-t border-slate-800 cursor-pointer">
                  <input
                    id="check-gear-acknowledgment"
                    type="checkbox"
                    checked={gearAcknowledged}
                    onChange={(e) => setGearAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs text-slate-200 font-semibold">
                    I confirm my rider will arrive with their own mandatory full protective gear.
                  </span>
                </label>
              </div>
            )}

            {/* If Option B: Request Loaner Kit Form & Validation */}
            {gearChoice === 'request_kit' && (
              <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-start gap-2 text-purple-200 text-xs">
                  <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">1-Week Lead Time Rule: </span>
                    <span>
                      Gear loaner kits must be requested at least 7 days in advance for inspection, sizing check, and sanitization.
                    </span>
                  </div>
                </div>

                {!gearKitEligibility.eligible ? (
                  <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>
                      {gearKitEligibility.message ||
                        'Loaner gear kits must be requested at least 7 days ahead. Please select an event date at least 7 days in advance or choose personal gear.'}
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-purple-300 font-semibold mb-1">
                          Helmet Size (DOT/ECE)
                        </label>
                        <select
                          id="loaner-helmet-size"
                          value={gearHelmetSize}
                          onChange={(e) => setGearHelmetSize(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                        >
                          {GEAR_SIZING_OPTIONS.helmetSizes.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-purple-300 font-semibold mb-1">
                          Boots Size (Youth MX)
                        </label>
                        <select
                          id="loaner-boot-size"
                          value={gearBootSize}
                          onChange={(e) => setGearBootSize(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                        >
                          {GEAR_SIZING_OPTIONS.bootSizes.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-purple-300 font-semibold mb-1">
                          Chest Guard
                        </label>
                        <select
                          id="loaner-chest-size"
                          value={gearChestSize}
                          onChange={(e) => setGearChestSize(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                        >
                          {GEAR_SIZING_OPTIONS.chestProtectorSizes.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-purple-300 font-semibold mb-1">
                          Jersey & Pants
                        </label>
                        <select
                          id="loaner-jersey-size"
                          value={gearJerseySize}
                          onChange={(e) => setGearJerseySize(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                        >
                          {GEAR_SIZING_OPTIONS.jerseyPantSizes.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-purple-300 font-semibold mb-1">
                        Sizing / Fitment Notes (Optional)
                      </label>
                      <input
                        id="loaner-notes"
                        type="text"
                        placeholder="e.g. Rider wears thick socks, requests boot test fitting at check-in"
                        value={gearSizingNotes}
                        onChange={(e) => setGearSizingNotes(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <label className="flex items-start gap-2 pt-2 border-t border-purple-500/20 cursor-pointer">
                      <input
                        id="check-loaner-kit-acknowledgment"
                        type="checkbox"
                        checked={gearKitAcknowledged}
                        onChange={(e) => setGearKitAcknowledged(e.target.checked)}
                        className="mt-0.5 rounded text-purple-500 focus:ring-purple-500 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs text-purple-200 font-semibold">
                        I certify that the above sizing is accurate and agree to arrive 20 minutes early for staging check.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 6: Price Calculation & 7-Day Payment Confirmation Schedule */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-xs font-mono text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pricing Breakdown ({bookingTier === 'scheduled' ? 'Scheduled Entry' : bookingTier === 'walk_in' ? 'Walk-In Entry' : 'Annual Member Rate'}):</span>
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {pricingBreakdown.blocksCount} Block(s) × ${pricingBreakdown.ratePerBlock}.00
                {pricingBreakdown.membershipFee > 0 && ` + $${pricingBreakdown.membershipFee}.00 Annual Membership`}
                {' = '}
                <span className="text-white font-bold text-base font-mono">${pricingBreakdown.total}.00 Total</span>
                {pricingBreakdown.totalSavings > 0 && (
                  <span className="ml-2 text-xs font-bold text-cyan-400">
                    (Member Saves ${pricingBreakdown.totalSavings}.00)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                {bookingTier === 'walk_in' ? (
                  <span className="text-amber-400 font-semibold">
                    Walk-in entry: Full payment of ${pricingBreakdown.total}.00 confirmed on-site today.
                  </span>
                ) : (
                  <span className="text-emerald-400">
                    $0 upfront placeholder locked today. <strong>7-Day Payment Confirmation</strong> required on{' '}
                    <strong className="text-white underline">{chargeDate}</strong> (strictly 7 days prior to event).
                  </span>
                )}
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
              <div className="text-center sm:text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Due Today:</span>
                <span className={`text-2xl font-black font-mono ${dueToday > 0 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                  ${dueToday}.00
                </span>
              </div>
              <button
                id="submit-reservation-btn"
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                {bookingTier === 'walk_in'
                  ? 'Confirm Walk-In Entry ($85/blk)'
                  : (dueToday > 0 ? `Confirm with $${dueToday} Membership` : 'Confirm $0 Advance Placeholder')}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Advance Reservations Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        {/* Ledger Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Advance Reservation Roster (60-Day Window)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Pre-Booked: {reservations.length} reservation(s) • Showing {filteredReservations.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                id="search-reservations-input"
                type="text"
                placeholder="Search rider, # or date..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            {/* Tier Filter */}
            <select
              id="filter-reservation-tier-select"
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="all">All Tiers</option>
              <option value="scheduled">Scheduled ($65)</option>
              <option value="walk_in">Walk-In ($85)</option>
              <option value="member">Member ($40)</option>
            </select>

            {/* Class Filter */}
            <select
              id="filter-reservation-class-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Gear Loaner Filter */}
            <select
              id="filter-reservation-gear-select"
              value={gearFilter}
              onChange={(e) => setGearFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs focus:outline-none"
            >
              <option value="all">All Gear Types</option>
              <option value="loaner_kit">Full Kit Loaner ($0)</option>
              <option value="personal">Own Personal Gear</option>
            </select>
          </div>
        </div>

        {/* Ledger Cards / List */}
        <div className="space-y-2.5">
          {filteredReservations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 italic">
              No reservations match your filter criteria.
            </div>
          ) : (
            filteredReservations.map((res) => {
              const cls = classes.find((c) => c.id === res.classId);
              const isExpanded = expandedResId === res.id;
              const isPending7d = res.status === 'payment_pending_7d';
              const isConfirmed = res.status === 'payment_confirmed';

              return (
                <div
                  key={res.id}
                  id={`reservation-card-${res.id}`}
                  className={`bg-slate-950/70 border rounded-2xl p-4 transition-all hover:border-slate-700 space-y-3 ${
                    isPending7d ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    {/* Rider & Event Date */}
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm border shadow-inner shrink-0"
                        style={{
                          backgroundColor: `${cls?.colorScheme.primary || '#10b981'}20`,
                          borderColor: `${cls?.colorScheme.primary || '#10b981'}50`,
                          color: cls?.colorScheme.primary || '#10b981',
                        }}
                      >
                        #{res.bikeNumber}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-white text-sm">{res.riderName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            (Age {res.riderAge})
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {cls?.name}
                          </span>
                          {/* Booking Tier Badge */}
                          {res.bookingTier === 'member' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                              Member ($40/blk)
                            </span>
                          ) : res.bookingTier === 'walk_in' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                              Walk-In ($85/blk)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                              Scheduled ($65/blk)
                            </span>
                          )}

                          {/* Gear Loaner Program Badge */}
                          {res.gearLoanerRequested ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center gap-1">
                              <Shirt className="w-3 h-3" />
                              Full Kit Loaner ($0)
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                              Personal Gear
                            </span>
                          )}

                          {/* Armory Staging Status Badge */}
                          {res.gearLoanerRequested && res.gearKitDetails && (
                            <span
                              className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold border ${
                                res.gearKitDetails.stagingStatus === 'armory_prepped'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                  : res.gearKitDetails.stagingStatus === 'issued_at_gate'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : res.gearKitDetails.stagingStatus === 'returned_sanitized'
                                  ? 'bg-slate-800 text-slate-400 border-slate-700'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                              }`}
                            >
                              {res.gearKitDetails.stagingStatus === 'armory_prepped'
                                ? 'Armory Prepped'
                                : res.gearKitDetails.stagingStatus === 'issued_at_gate'
                                ? 'Issued at Gate'
                                : res.gearKitDetails.stagingStatus === 'returned_sanitized'
                                ? 'Returned & Sanitized'
                                : 'Armory Prep Needed'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 flex flex-wrap items-center gap-2 mt-0.5">
                          <span className="font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                            <Calendar className="w-3 h-3 inline" />
                            {res.eventDate}
                          </span>
                          <span>•</span>
                          <span>
                            {res.blocks.map((b) => (b === 'morning' ? 'Morning (8am)' : 'Afternoon (2pm)')).join(' & ')}
                          </span>
                          {res.hasAnnualMembership && (
                            <span className="text-[10px] text-cyan-300 font-mono">
                              • Includes Annual Membership ($200/yr)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Status Badge */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          ${res.totalAmountCalculated}.00 Total
                        </div>
                        {isConfirmed ? (
                          <div className="text-[10px] text-emerald-400 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Payment Confirmed
                          </div>
                        ) : isPending7d ? (
                          <div className="text-[10px] text-amber-400 font-bold flex items-center justify-end gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            7-Day Payment Confirmation Due
                          </div>
                        ) : (
                          <div className="text-[10px] text-emerald-400 flex items-center justify-end gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            $0.00 Due Today
                          </div>
                        )}
                        <div className="text-[10px] text-slate-400 font-mono">
                          Confirm date: {res.chargeDate}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedResId(isExpanded ? null : res.id)}
                        className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                        title="Toggle verification details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Verification Details */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                      {/* 1. Medical & Insurance */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          Medical & Insurance
                        </span>
                        <p className="text-slate-200 font-medium">{res.insuranceProvider}</p>
                        <p className="text-slate-400 font-mono text-[10px]">Pol: {res.insurancePolicyNumber}</p>
                        <p className="text-slate-400 text-[10px] pt-1">
                          Physical Checkup: {res.physicalCheckupDate} ({res.physicianClinic})
                        </p>
                      </div>

                      {/* 2. Prior History & Qualification */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                          Prior Riding History & Qualification
                        </span>
                        <p className="text-slate-200 text-[11px] leading-relaxed italic">
                          "{res.priorTrackHistory}"
                        </p>
                        <p className="text-emerald-400 text-[10px] font-mono mt-1 font-semibold">
                          Classification: {res.experienceLevel.toUpperCase()} (Qualified)
                        </p>
                      </div>

                      {/* 3. Gear Loaner & Armory Staging */}
                      <div
                        className={`p-3 rounded-xl border space-y-2 ${
                          res.gearLoanerRequested
                            ? 'bg-purple-950/20 border-purple-500/30'
                            : 'bg-slate-900 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-purple-300 flex items-center gap-1">
                            <Shirt className="w-3.5 h-3.5" />
                            {res.gearLoanerRequested ? 'Loaner Kit Armory Staging' : 'Riding Gear Compliance'}
                          </span>
                          {res.gearLoanerRequested && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200">
                              Full Kit Loaner ($0)
                            </span>
                          )}
                        </div>

                        {res.gearLoanerRequested && res.gearKitDetails ? (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono bg-slate-950/60 p-2 rounded-lg border border-purple-500/20">
                              <div>
                                <span className="text-slate-400 block text-[9px]">Helmet:</span>
                                <span className="text-white font-bold">{res.gearKitDetails.helmetSize}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px]">Boots:</span>
                                <span className="text-white font-bold">{res.gearKitDetails.bootSize}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px]">Chest Guard:</span>
                                <span className="text-white font-bold">{res.gearKitDetails.chestProtectorSize}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[9px]">Apparel:</span>
                                <span className="text-white font-bold">{res.gearKitDetails.jerseyPantSize}</span>
                              </div>
                            </div>

                            {res.gearKitDetails.notes && (
                              <p className="text-[10px] text-slate-300 italic">
                                Note: {res.gearKitDetails.notes}
                              </p>
                            )}

                            {/* Armory Status Controller for Staff */}
                            <div className="pt-1.5 border-t border-purple-500/20 space-y-1.5">
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-400">Armory State:</span>
                                <span className="font-bold text-purple-300 uppercase font-mono text-[9px]">
                                  {res.gearKitDetails.stagingStatus.replace('_', ' ')}
                                </span>
                              </div>

                              {onUpdateReservation && (
                                <div className="grid grid-cols-3 gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateGearStatus(res, 'armory_prepped')}
                                    className={`px-1.5 py-1 rounded text-[9px] font-bold font-mono transition-all text-center border ${
                                      res.gearKitDetails.stagingStatus === 'armory_prepped'
                                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                        : 'bg-slate-950/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-950/50'
                                    }`}
                                    title="Mark gear inspected, sized, sanitized and prepped in armory rack"
                                  >
                                    1. Prep Kit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateGearStatus(res, 'issued_at_gate')}
                                    className={`px-1.5 py-1 rounded text-[9px] font-bold font-mono transition-all text-center border ${
                                      res.gearKitDetails.stagingStatus === 'issued_at_gate'
                                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                                        : 'bg-slate-950/80 text-emerald-300 border-emerald-500/30 hover:bg-emerald-950/50'
                                    }`}
                                    title="Issue gear kit to parent/rider at pre-staging safety gate"
                                  >
                                    2. Issue Gate
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateGearStatus(res, 'returned_sanitized')}
                                    className={`px-1.5 py-1 rounded text-[9px] font-bold font-mono transition-all text-center border ${
                                      res.gearKitDetails.stagingStatus === 'returned_sanitized'
                                        ? 'bg-slate-300 text-slate-950 border-white'
                                        : 'bg-slate-950/80 text-slate-400 border-slate-700 hover:bg-slate-800'
                                    }`}
                                    title="Kit returned after heat and logged for ozone sanitization"
                                  >
                                    3. Returned
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="text-slate-300 text-[11px]">
                              Rider brings personal DOT/ECE helmet, boots, chest protector, goggles, and gloves.
                            </p>
                            <p className="text-emerald-400 text-[10px] font-semibold">
                              ✓ 6-point safety check at pre-staging gate
                            </p>
                          </div>
                        )}
                      </div>

                      {/* 4. Parent Contact & Actions */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                            Parent Contact & Status
                          </span>
                          <p className="text-slate-200 font-medium">{res.parentGuardianName}</p>
                          <p className="text-slate-400 font-mono text-[10px]">{res.contactPhone}</p>
                          <p className="text-slate-400 font-mono text-[10px]">{res.contactEmail}</p>
                          {res.paymentConfirmedAt && (
                            <p className="text-[10px] text-emerald-400 font-mono mt-1 font-semibold">
                              Paid: {res.paymentConfirmedAt}
                            </p>
                          )}
                        </div>

                        <div className="pt-2 flex flex-col gap-1.5 border-t border-slate-800 mt-2">
                          {!isConfirmed && onConfirmPayment && (
                            <button
                              type="button"
                              onClick={() => onConfirmPayment(res.id)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center justify-center gap-1"
                            >
                              <CreditCard className="w-3 h-3" />
                              Confirm 7-Day Payment (${res.totalAmountCalculated}.00)
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => onCancelReservation(res.id)}
                            className="text-[10px] text-rose-400 hover:text-rose-300 font-bold underline text-center"
                          >
                            Cancel Reservation
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
