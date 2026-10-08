import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  User,
  Phone,
  Mail,
  Zap,
  Info,
  Lock,
  Search,
  FileText,
  Printer,
  ChevronRight,
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Share2,
  Copy,
  Tag,
  CreditCard,
  Award,
  Shirt,
  HeartHandshake,
  Database,
} from 'lucide-react';
import {
  Reservation,
  MotocrossClass,
  BlockId,
  RiderExperienceLevel,
  BookingTier,
} from '../types';
import {
  MANUFACTURER_GUIDELINES,
  PRICING_RATES,
  calculateChargeDate,
  calculateReservationCost,
  calculatePricingBreakdown,
  isDateWithinReservationWindow,
  isPaymentConfirmationDue,
  getTodayDateString,
  getMaxAdvanceDateString,
  canRequestGearKit,
  GEAR_SIZING_OPTIONS,
} from '../utils/reservationData';
import { GoMotoLogo } from './GoMotoLogo';

interface ClientPreRegistrationScreenProps {
  classes: MotocrossClass[];
  reservations: Reservation[];
  onAddReservation: (res: Reservation) => void;
  onSwitchToStaff: () => void;
  onOpenSupabaseModal?: () => void;
}

export const ClientPreRegistrationScreen: React.FC<ClientPreRegistrationScreenProps> = ({
  classes,
  reservations,
  onAddReservation,
  onSwitchToStaff,
  onOpenSupabaseModal,
}) => {
  const [activeClientTab, setActiveClientTab] = useState<'register' | 'lookup' | 'guidelines'>('register');

  // Form State
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [eventDate, setEventDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 21); // Default to 3 weeks out
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  });

  const [bookingTier, setBookingTier] = useState<BookingTier>('scheduled');
  const [purchaseAnnualMembership, setPurchaseAnnualMembership] = useState<boolean>(false);
  const [selectedBlocks, setSelectedBlocks] = useState<BlockId[]>(['morning']);
  const [selectedClassId, setSelectedClassId] = useState<string>('cx3-c');

  // Rider Details
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

  // Riding Gear & Financial Accessibility Kit
  const [gearAcknowledged, setGearAcknowledged] = useState(false);
  const [gearChoice, setGearChoice] = useState<'own_gear' | 'request_kit'>('own_gear');
  const [gearHelmetSize, setGearHelmetSize] = useState<string>('Youth M');
  const [gearBootSize, setGearBootSize] = useState<string>('Youth 3');
  const [gearChestSize, setGearChestSize] = useState<string>('Youth M (60–80 lbs)');
  const [gearJerseySize, setGearJerseySize] = useState<string>('Youth M (24-26")');
  const [gearSizingNotes, setGearSizingNotes] = useState<string>('');
  const [gearKitAcknowledged, setGearKitAcknowledged] = useState<boolean>(false);

  // Confirmation Pass
  const [submittedReservation, setSubmittedReservation] = useState<Reservation | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Lookup State
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<Reservation[] | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyPublicLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('view', 'client');
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const oemGuidelines = MANUFACTURER_GUIDELINES[selectedClassId] || MANUFACTURER_GUIDELINES['cx3-c'];
  const pricingBreakdown = calculatePricingBreakdown(
    selectedBlocks.length,
    bookingTier,
    purchaseAnnualMembership
  );
  const dateWindowCheck = isDateWithinReservationWindow(eventDate);
  const chargeDate = calculateChargeDate(eventDate);
  const gearKitEligibility = canRequestGearKit(eventDate);
  const dueToday = bookingTier === 'walk_in'
    ? pricingBreakdown.total
    : (purchaseAnnualMembership ? PRICING_RATES.ANNUAL_MEMBERSHIP_FEE : 0);

  const toggleBlock = (block: BlockId) => {
    if (selectedBlocks.includes(block)) {
      if (selectedBlocks.length > 1) {
        setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
      }
    } else {
      setSelectedBlocks([...selectedBlocks, block]);
    }
  };

  const validateCurrentStep = (step: number): boolean => {
    setValidationError(null);
    if (step === 1) {
      if (!eventDate) {
        setValidationError('Please select a valid event date.');
        return false;
      }
      if (!dateWindowCheck.valid) {
        setValidationError(dateWindowCheck.message);
        return false;
      }
      if (selectedBlocks.length === 0) {
        setValidationError('Please select at least one session block.');
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!oemComplianceAcknowledged) {
        setValidationError('You must certify that the rider meets the manufacturer specifications.');
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!riderName.trim() || !parentName.trim() || !phone.trim() || !email.trim()) {
        setValidationError('Please fill in all rider and guardian contact fields.');
        return false;
      }
      if (!bikeNumber.trim()) {
        setValidationError('Please specify the bike # or plate number.');
        return false;
      }
      if (!priorTrackHistory.trim()) {
        setValidationError('Prior riding/track history is required. First-time and absolute beginner riders are excluded for safety concerns (Novice or electric bicycle proficiency is the minimum accepted qualification).');
        return false;
      }
      return true;
    }
    if (step === 4) {
      if (!insuranceProvider.trim() || !insurancePolicy.trim()) {
        setValidationError('Health insurance carrier and policy/member number are required.');
        return false;
      }
      if (!physicalDate.trim() || !physicianClinic.trim()) {
        setValidationError('Physical checkup date and clinic name are required (within last 12 months).');
        return false;
      }
      if (gearChoice === 'request_kit') {
        if (!gearKitEligibility.eligible) {
          setValidationError(gearKitEligibility.message || 'Full gear kits must be requested at least 1 week (7 days) ahead of the scheduled event.');
          return false;
        }
        if (!gearKitAcknowledged) {
          setValidationError('Please confirm your request for the complimentary full safety kit and agree to arrive 20 minutes prior for technical staging fitment.');
          return false;
        }
      } else {
        if (!gearAcknowledged) {
          setValidationError('You must certify that your rider will arrive with complete personal protective equipment.');
          return false;
        }
      }
      return true;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep(4)) return;

    const newRes: Reservation = {
      id: `EMX-${Math.floor(100000 + Math.random() * 900000)}`,
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
      gearLoanerRequested: gearChoice === 'request_kit',
      gearKitDetails: gearChoice === 'request_kit' ? {
        requested: true,
        helmetSize: gearHelmetSize,
        bootSize: gearBootSize,
        chestProtectorSize: gearChestSize,
        jerseyPantSize: gearJerseySize,
        notes: gearSizingNotes.trim() || undefined,
        stagingStatus: 'kit_requested',
      } : undefined,
      createdAt: getTodayDateString(),
      chargeDate,
      bookingTier,
      ratePerBlock: pricingBreakdown.ratePerBlock,
      hasAnnualMembership: bookingTier === 'member' || purchaseAnnualMembership,
      totalAmountCalculated: pricingBreakdown.total,
      amountDueToday: dueToday,
      status: bookingTier === 'walk_in' ? 'payment_confirmed' : 'placeholder_locked',
      paymentConfirmedAt: bookingTier === 'walk_in' ? new Date().toISOString() : undefined,
    };

    onAddReservation(newRes);
    setSubmittedReservation(newRes);
    setCurrentStep(5);
  };

  const handleResetForm = () => {
    setSubmittedReservation(null);
    setCurrentStep(1);
    setBookingTier('scheduled');
    setPurchaseAnnualMembership(false);
    setRiderName('');
    setBikeNumber('');
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
    setValidationError(null);
  };

  const handlePerformLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = lookupQuery.toLowerCase().trim();
    if (!q) {
      setLookupResult([]);
      return;
    }
    const matches = reservations.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.contactEmail.toLowerCase().includes(q) ||
        r.contactPhone.replace(/\D/g, '').includes(q.replace(/\D/g, '')) ||
        r.riderName.toLowerCase().includes(q)
    );
    setLookupResult(matches);
  };

  return (
    <div id="client-pre-registration-screen" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Client Navigation Bar */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-40 shadow-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <GoMotoLogo variant="icon" size="md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-sm font-sans">
                  GO MOTO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  GOOGLE TECH STACK POWERED
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                  60-Day Reservation Window • 7-Day Payment Confirmation
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Go Moto Indoor Arena Pre-Entry Portal
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Tab navigation for client */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveClientTab('register');
                  if (submittedReservation) setSubmittedReservation(null);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeClientTab === 'register'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Pre-Register ($0)
              </button>
              <button
                type="button"
                onClick={() => setActiveClientTab('lookup')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeClientTab === 'lookup'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                My Reservations
              </button>
              <button
                type="button"
                onClick={() => setActiveClientTab('guidelines')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeClientTab === 'guidelines'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OEM Specs & Rules
              </button>
            </div>

            {/* Copy / Share Public Portal Link */}
            <button
              id="copy-public-portal-link-btn"
              type="button"
              onClick={handleCopyPublicLink}
              className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title="Copy direct public link for parents & riders"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Public Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Share Public Link</span>
                  <span className="sm:hidden">Share</span>
                </>
              )}
            </button>

            {/* Supabase Cloud Database Quick Access */}
            {onOpenSupabaseModal && (
              <button
                id="client-open-supabase-btn"
                type="button"
                onClick={onOpenSupabaseModal}
                className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Open Supabase Cloud Database Console & Sync"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Supabase DB</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            )}

            {/* Switch back to Staff Console */}
            <button
              id="switch-to-staff-btn"
              type="button"
              onClick={onSwitchToStaff}
              className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              title="Return to Track Staff / Director Timer View"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Track Staff View</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* VIEW 1: REGISTRATION FLOW */}
        {activeClientTab === 'register' && !submittedReservation && (
          <div className="space-y-6">
            {/* Intro Trust Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Official 60-Day Advance Booking &amp; 7-Day Payment Confirmation
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Go Moto Youth Electric Motocross Registration
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Our indoor track runs strictly limited 15-rider rotations with dedicated Cobra Moto CX3 &amp; CX5 fleets. Reserve up to <strong>60 days in advance</strong> with guaranteed placement and a mandatory 7-day payment confirmation prior to gate drop.
                </p>

                {/* 4 Pricing & Policy Pillars */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px]">
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-emerald-400 font-bold block">$65 Scheduled</span>
                    <span className="text-slate-400 text-[10px]">Per block • Confirmed 7 days prior</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-purple-400 font-bold block">$40 Member Rate</span>
                    <span className="text-slate-400 text-[10px]">$200/yr pass • Saves $25/block</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-cyan-400 font-bold block">$85 Walk-In</span>
                    <span className="text-slate-400 text-[10px]">Per block • Same-day paddock entry</span>
                  </div>
                  <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-amber-400 font-bold block">60-Day Window</span>
                    <span className="text-slate-400 text-[10px]">Strict max booking horizon</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center justify-between px-2 sm:px-6">
              {[
                { step: 1, title: 'Pricing & Schedule' },
                { step: 2, title: 'Class & OEM' },
                { step: 3, title: 'Rider Info' },
                { step: 4, title: 'Medical & Gear' },
              ].map((item) => {
                const isCurrent = currentStep === item.step;
                const isPast = currentStep > item.step;
                return (
                  <div key={item.step} className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20'
                          : isPast
                          ? 'bg-slate-800 text-emerald-400'
                          : 'bg-slate-900 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {isPast ? <Check className="w-4 h-4" /> : item.step}
                    </div>
                    <span
                      className={`text-xs font-semibold hidden sm:inline ${
                        isCurrent ? 'text-white font-bold' : isPast ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Step Content Container */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              {validationError && (
                <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* STEP 1: PRICING TIER, DATE & SESSION BLOCK */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white">Select Pricing Tier &amp; Event Schedule</h3>
                    <p className="text-xs text-slate-400">
                      Standard scheduled reservations feature our 60-day reservation window with a 7-day payment confirmation rule.
                    </p>
                  </div>

                  {/* Pricing Tier Selector */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Choose Registration Tier
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Scheduled */}
                      <button
                        type="button"
                        onClick={() => setBookingTier('scheduled')}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          bookingTier === 'scheduled'
                            ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/40 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-emerald-400" />
                            Scheduled Block
                          </span>
                          <span className="text-base font-black font-mono text-emerald-400">$65</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          Up to 60-day advance window. Confirmed &amp; billed 7 days prior to event.
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">
                          $0 Due Today
                        </span>
                      </button>

                      {/* Member Rate */}
                      <button
                        type="button"
                        onClick={() => setBookingTier('member')}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          bookingTier === 'member'
                            ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/40 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-purple-400" />
                            Annual Member
                          </span>
                          <span className="text-base font-black font-mono text-purple-400">$40</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          Save $25 per block. Requires $200/year membership pass.
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded">
                          Save $25/block
                        </span>
                      </button>

                      {/* Walk-in */}
                      <button
                        type="button"
                        onClick={() => {
                          setBookingTier('walk_in');
                          setEventDate(getTodayDateString());
                        }}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          bookingTier === 'walk_in'
                            ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/40 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-white flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            Paddock Walk-In
                          </span>
                          <span className="text-base font-black font-mono text-cyan-400">$85</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                          Same-day immediate entry. Subject to impound bay and grid availability.
                        </p>
                        <span className="inline-block mt-2 text-[10px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded">
                          Pay Today At Gate
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Membership Add-on Option if Member Tier is selected */}
                  {bookingTier === 'member' && (
                    <div className="p-4 bg-purple-950/20 border border-purple-500/40 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            id="client-membership-enroll-checkbox"
                            type="checkbox"
                            checked={purchaseAnnualMembership}
                            onChange={(e) => setPurchaseAnnualMembership(e.target.checked)}
                            className="rounded text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-700"
                          />
                          <span className="text-xs font-bold text-white">
                            Enroll in $200 / Year Annual Membership Pass Today
                          </span>
                        </label>
                        <span className="text-xs font-mono font-bold text-purple-300">+$200.00</span>
                      </div>
                      <p className="text-[11px] text-purple-200/80 pl-6 leading-relaxed">
                        {purchaseAnnualMembership
                          ? 'Membership fee of $200.00 will be charged today to activate the $40/block member pricing. Session blocks will be billed 7 days prior.'
                          : 'Uncheck if rider already holds an active $200/yr annual membership ID. (Will be verified by staff during technical impound staging).'}
                      </p>
                    </div>
                  )}

                  {/* Event Date & Block Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-300">
                          Choose Event Date
                        </label>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                          Max 60 Days Out
                        </span>
                      </div>
                      <input
                        id="client-event-date"
                        type="date"
                        min={getTodayDateString()}
                        max={getMaxAdvanceDateString()}
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className={`w-full px-4 py-3 rounded-2xl bg-slate-950 border text-white font-mono text-sm focus:outline-none ${
                          dateWindowCheck.valid ? 'border-slate-700 focus:border-emerald-500' : 'border-rose-500'
                        }`}
                      />
                      <div className="flex items-center justify-between mt-1.5 text-[11px]">
                        <span className={`font-mono ${dateWindowCheck.valid ? 'text-slate-400' : 'text-rose-400'}`}>
                          {dateWindowCheck.valid ? (
                            dateWindowCheck.daysUntil !== undefined ? (
                              <span>📅 {dateWindowCheck.daysUntil} days ahead (within 60-day window)</span>
                            ) : (
                              `Window open through ${getMaxAdvanceDateString()}`
                            )
                          ) : (
                            <span>⚠️ {dateWindowCheck.message}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-300">
                          Select Session Block (${pricingBreakdown.ratePerBlock} / block)
                        </label>
                        <span className="text-[10px] font-mono text-slate-400">
                          {selectedBlocks.length} Selected
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => toggleBlock('morning')}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            selectedBlocks.includes('morning')
                              ? 'bg-emerald-500/20 border-emerald-500 text-white ring-1 ring-emerald-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">Morning Block</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">08:00 AM – 12:00 PM</div>
                          <div className="text-[10px] text-emerald-400 font-bold mt-2">
                            ${pricingBreakdown.ratePerBlock}.00 ({bookingTier === 'walk_in' ? 'Due Today' : `Due ${chargeDate}`})
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleBlock('afternoon')}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            selectedBlocks.includes('afternoon')
                              ? 'bg-cyan-500/20 border-cyan-500 text-white ring-1 ring-cyan-500'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <div className="text-xs font-bold">Afternoon Block</div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">02:00 PM – 06:00 PM</div>
                          <div className="text-[10px] text-cyan-400 font-bold mt-2">
                            ${pricingBreakdown.ratePerBlock}.00 ({bookingTier === 'walk_in' ? 'Due Today' : `Due ${chargeDate}`})
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Callout with Transparent Breakdown */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Pricing Tier:</span>
                        <span className="font-bold text-white capitalize">{bookingTier.replace('_', '-')} Rate</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          ${pricingBreakdown.ratePerBlock}/block
                        </span>
                        {pricingBreakdown.totalSavings > 0 && (
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                            Saved ${pricingBreakdown.totalSavings}.00
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-[11px]">
                        {selectedBlocks.length} Block(s) = ${pricingBreakdown.blocksSubtotal}.00
                        {purchaseAnnualMembership && ' + $200.00 Annual Membership'}
                        {' '}(Total: ${pricingBreakdown.total}.00)
                      </p>
                      {bookingTier !== 'walk_in' && (
                        <p className="text-[10px] text-cyan-400 font-mono">
                          Payment confirmation deadline: <strong>{chargeDate}</strong> (7 days prior to event)
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Amount Due Today</span>
                      <span className="text-emerald-400 font-black text-xl font-mono">
                        ${dueToday}.00
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: CLASS & OEM SPECIFICATIONS */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-white">Select Motocross Class & Review OEM Criteria</h3>
                    <p className="text-xs text-slate-400">
                      Rider pool is strictly governed by manufacturer recommendations to maintain balanced, safe indoor track speeds.
                    </p>
                  </div>

                  {/* Class Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {classes.map((cls) => {
                      const isSelected = cls.id === selectedClassId;
                      return (
                        <button
                          key={cls.id}
                          type="button"
                          onClick={() => setSelectedClassId(cls.id)}
                          className={`p-4 rounded-2xl border text-left transition-all ${
                            isSelected
                              ? 'bg-slate-950 border-emerald-500 ring-2 ring-emerald-500/50'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                            {cls.category.toUpperCase()}
                          </span>
                          <div className="text-sm font-black text-white mt-2">{cls.name}</div>
                          <div className="text-xs text-slate-400">{cls.subTitle}</div>
                          <div className="text-xs font-mono text-emerald-400 mt-2 font-bold">{cls.ageBracket}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic OEM Specifications Callout */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                      <Info className="w-4 h-4 text-cyan-400" />
                      <span>Official Manufacturer Recommendations for {selectedClass.name}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Age Bracket</span>
                        <span className="font-bold text-white text-sm">{oemGuidelines.recommendedAge}</span>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Weight Limit</span>
                        <span className="font-bold text-white text-sm">{oemGuidelines.riderWeightLimit}</span>
                      </div>
                      <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Inseam / Height</span>
                        <span className="font-bold text-white text-sm">{oemGuidelines.riderHeightOrInseam}</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1 pt-1">
                      <span className="font-bold text-slate-300 text-[11px]">Skill & Power Handling Criteria:</span>
                      <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                        {oemGuidelines.skillPrerequisites.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Mandatory OEM Checkbox */}
                    <label className="flex items-start gap-2.5 pt-3 border-t border-slate-800 cursor-pointer">
                      <input
                        id="client-oem-certify"
                        type="checkbox"
                        checked={oemComplianceAcknowledged}
                        onChange={(e) => setOemComplianceAcknowledged(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                      />
                      <span className="text-xs text-slate-200 font-medium leading-snug">
                        I certify that my rider fulfills all manufacturer specifications (age, weight limit, minimum inseam) and is physically capable of controlling this class of electric bike.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 3: RIDER & GUARDIAN PROFILE (NO FIRST-TIME RIDERS) */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-white">Rider & Guardian Profile</h3>
                    <p className="text-xs text-slate-400">
                      Strict rule: <strong>No first-time riders.</strong> Riders must have documented prior track, pump track, or series experience.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Rider Full Name
                      </label>
                      <input
                        id="client-rider-name"
                        type="text"
                        required
                        placeholder="e.g. Wyatt Reed"
                        value={riderName}
                        onChange={(e) => setRiderName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Rider Age
                      </label>
                      <input
                        id="client-rider-age"
                        type="number"
                        min={3}
                        max={14}
                        value={riderAge}
                        onChange={(e) => setRiderAge(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Preferred Bike # (Plate)
                      </label>
                      <input
                        id="client-bike-number"
                        type="text"
                        placeholder="e.g. 23"
                        value={bikeNumber}
                        onChange={(e) => setBikeNumber(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Parent / Legal Guardian
                      </label>
                      <input
                        id="client-parent-name"
                        type="text"
                        placeholder="Full name"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Contact Mobile Phone
                      </label>
                      <input
                        id="client-phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Notification Email
                      </label>
                      <input
                        id="client-email"
                        type="email"
                        placeholder="parent@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Prior Track History & Experience Level (Novice Accepted • First-Time Excluded) */}
                  <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-inner">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Rider Classification &amp; Safety Acceptance Standard</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                          ✓ Novice Accepted
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                          ✕ First-Time/Beginner Excluded
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      <strong>Proficient Electric Bicycle Riders &amp; Novice classification are accepted</strong> (two-wheel balance, throttle control, braking modulation, or pump track competency). 
                      <span className="text-emerald-400 block mt-1 font-semibold">
                        ⚡ <strong>Class C Qualification:</strong> Proficient use of an electric bicycle qualifies a participant in Class C.
                      </span>
                      <span className="text-cyan-300 block mt-1 font-semibold">
                        🏁 <strong>Skill Promotion Policy:</strong> Riders who demonstrate proficient motocross skills on track shall be promoted to the higher classification (Class B) with parental approval as directed by the Track Director.
                      </span>
                      <span className="text-amber-300 block mt-1">
                        ⚠️ <strong>Safety Rule:</strong> Absolute first-time riders without basic 2-wheel balance or throttle familiarity are excluded for track safety.
                      </span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Experience Classification (Minimum: E-Bicycle / Novice)
                        </label>
                        <select
                          id="client-experience-select"
                          value={experienceLevel}
                          onChange={(e) => setExperienceLevel(e.target.value as RiderExperienceLevel)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                        >
                          <option value="electric_bicycle">Class C Qualifier: Proficient Electric Bicycle Rider</option>
                          <option value="novice">Class C: Novice Motocross (Basic balance, throttle &amp; off-road practice)</option>
                          <option value="intermediate">Class B: Intermediate (Prior racing or Track Director promoted)</option>
                          <option value="advanced">Class B: Advanced Youth Motocross</option>
                          <option value="expert_competition">Class B: Expert / Competition Series</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                          Previous Experience / Equipment (Required Proof)
                        </label>
                        <input
                          id="client-prior-history"
                          type="text"
                          required
                          placeholder="e.g. Electric balance bike, BMX pump track, youth dirt course"
                          value={priorTrackHistory}
                          onChange={(e) => setPriorTrackHistory(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400 placeholder-slate-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: MEDICAL INSURANCE & GEAR CONFIRMATION */}
              {currentStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <h3 className="text-lg font-black text-white">Medical Clearance & Gear Acknowledgment</h3>
                    <p className="text-xs text-slate-400">
                      Proof of current health insurance, recent physical checkup, and personal safety gear are required for entry.
                    </p>
                  </div>

                  {/* Medical Insurance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Health Insurance Carrier
                      </label>
                      <input
                        id="client-insurance-provider"
                        type="text"
                        placeholder="e.g. Blue Shield, Kaiser, United, Aetna"
                        value={insuranceProvider}
                        onChange={(e) => setInsuranceProvider(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Policy / Member Number
                      </label>
                      <input
                        id="client-insurance-policy"
                        type="text"
                        placeholder="e.g. POL-9842104"
                        value={insurancePolicy}
                        onChange={(e) => setInsurancePolicy(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Physical Checkup Date (Within Last 12 Months)
                      </label>
                      <input
                        id="client-physical-date"
                        type="date"
                        value={physicalDate}
                        onChange={(e) => setPhysicalDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                        Physician Name / Medical Clinic
                      </label>
                      <input
                        id="client-physician-clinic"
                        type="text"
                        placeholder="e.g. Valley Pediatrics / Dr. H. Lin"
                        value={physicianClinic}
                        onChange={(e) => setPhysicianClinic(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Riding Gear & Financial Accessibility Program */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Shirt className="w-4 h-4 text-emerald-400" />
                        <span>Riding Gear &amp; Safety Equipment</span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        Financial Barrier Removal Program Available
                      </span>
                    </div>

                    {/* Mission Callout: Barrier Removal Policy */}
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-xl p-3.5 space-y-1.5 text-xs text-emerald-200">
                      <div className="flex items-center gap-2 font-bold text-emerald-300">
                        <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Gear Kit Loaner Program — Removing Financial Barriers</span>
                      </div>
                      <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                        To ensure every youth rider can participate safely regardless of equipment ownership, the facility offers a <strong>complimentary full safety kit ($0.00)</strong>. Requests must be placed <strong>at least 1 week (7 days) ahead of the scheduled event</strong> to allow for certified technical inspection, armory sizing, and sanitization.
                      </p>
                    </div>

                    {/* Choice Selector: Own Gear vs Request Kit */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {/* Option 1: Own Gear */}
                      <button
                        id="gear-choice-own-btn"
                        type="button"
                        onClick={() => {
                          setGearChoice('own_gear');
                          setGearKitAcknowledged(false);
                        }}
                        className={`p-4 rounded-xl border text-left transition-all space-y-2 ${
                          gearChoice === 'own_gear'
                            ? 'bg-slate-900 border-emerald-500 ring-1 ring-emerald-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            Rider Has Personal Gear
                          </span>
                          <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            Client Provided
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          Rider will bring their own certified personal safety equipment (DOT/ECE helmet, boots, chest guard, goggles, gloves).
                        </p>
                      </button>

                      {/* Option 2: Request Complimentary Kit */}
                      <button
                        id="gear-choice-kit-btn"
                        type="button"
                        disabled={!gearKitEligibility.eligible}
                        onClick={() => {
                          if (gearKitEligibility.eligible) {
                            setGearChoice('request_kit');
                            setGearAcknowledged(false);
                          }
                        }}
                        className={`p-4 rounded-xl border text-left transition-all space-y-2 relative ${
                          !gearKitEligibility.eligible
                            ? 'opacity-60 bg-slate-900/40 border-slate-800 cursor-not-allowed'
                            : gearChoice === 'request_kit'
                            ? 'bg-purple-950/20 border-purple-500 ring-1 ring-purple-500 text-white'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-purple-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                            <Shirt className="w-4 h-4 text-purple-400" />
                            Request Full Gear Kit
                          </span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">
                            FREE • $0.00
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          Complimentary armory loaner kit with helmet, boots, chest armor, goggles, gloves, &amp; race apparel.
                        </p>
                        {!gearKitEligibility.eligible && (
                          <div className="pt-1 text-[10px] text-amber-400 flex items-center gap-1 font-semibold">
                            <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                            <span>Requires ≥ 7 days notice ({gearKitEligibility.daysUntil}d until event)</span>
                          </div>
                        )}
                      </button>
                    </div>

                    {/* Own Gear Acknowledgement Form */}
                    {gearChoice === 'own_gear' && (
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 animate-in fade-in duration-150">
                        <div className="text-xs text-slate-300 font-semibold">
                          Required Safety Equipment Checklist (Must be present at Tech Staging):
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300 py-1">
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> DOT/ECE Helmet
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> MX Boots
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Chest / Roost Armor
                          </span>
                          <span className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Goggles &amp; Gloves
                          </span>
                        </div>

                        <label className="flex items-start gap-2.5 pt-2 border-t border-slate-800 cursor-pointer">
                          <input
                            id="client-gear-acknowledge"
                            type="checkbox"
                            checked={gearAcknowledged}
                            onChange={(e) => setGearAcknowledged(e.target.checked)}
                            className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-950 border-slate-700"
                          />
                          <span className="text-xs text-slate-200 font-semibold leading-snug">
                            I certify that my rider will bring their own certified personal protective equipment meeting track standards.
                          </span>
                        </label>
                      </div>
                    )}

                    {/* Request Kit Sizing Form */}
                    {gearChoice === 'request_kit' && (
                      <div className="bg-purple-950/10 border border-purple-500/30 rounded-xl p-4 space-y-4 animate-in fade-in duration-150">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h5 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                              Complimentary Full Track Kit Sizing Specification
                            </h5>
                            <p className="text-[11px] text-slate-400">
                              Reserved for {riderName || 'your rider'} at the technical armory. Sized and sanitized prior to event.
                            </p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            Loaner Fee: $0.00
                          </span>
                        </div>

                        {/* Included items breakdown */}
                        <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-purple-400" /> Full DOT/ECE Helmet
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-purple-400" /> Motocross Boots
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-purple-400" /> Roost Chest Armor
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-purple-400" /> MX Goggles &amp; Gloves
                          </div>
                        </div>

                        {/* Sizing dropdowns */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                          <div>
                            <label className="block text-[10px] uppercase font-bold text-purple-300 mb-1">
                              Helmet Size *
                            </label>
                            <select
                              id="client-gear-helmet-size"
                              value={gearHelmetSize}
                              onChange={(e) => setGearHelmetSize(e.target.value)}
                              className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                            >
                              {GEAR_SIZING_OPTIONS.helmetSizes.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-purple-300 mb-1">
                              Boot Size (Youth) *
                            </label>
                            <select
                              id="client-gear-boot-size"
                              value={gearBootSize}
                              onChange={(e) => setGearBootSize(e.target.value)}
                              className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                            >
                              {GEAR_SIZING_OPTIONS.bootSizes.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-purple-300 mb-1">
                              Chest Protector *
                            </label>
                            <select
                              id="client-gear-chest-size"
                              value={gearChestSize}
                              onChange={(e) => setGearChestSize(e.target.value)}
                              className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                            >
                              {GEAR_SIZING_OPTIONS.chestProtectorSizes.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase font-bold text-purple-300 mb-1">
                              Jersey &amp; Pants *
                            </label>
                            <select
                              id="client-gear-jersey-size"
                              value={gearJerseySize}
                              onChange={(e) => setGearJerseySize(e.target.value)}
                              className="w-full px-2.5 py-2 rounded-xl bg-slate-950 border border-purple-500/40 text-white text-xs focus:outline-none focus:border-purple-400"
                            >
                              {GEAR_SIZING_OPTIONS.jerseyPantSizes.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Optional Notes */}
                        <div>
                          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                            Fit Notes / Sizing Details (Optional)
                          </label>
                          <input
                            id="client-gear-notes"
                            type="text"
                            placeholder="e.g. Rider wears glasses inside goggles, or prefers looser boots"
                            value={gearSizingNotes}
                            onChange={(e) => setGearSizingNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        {/* Acknowledgment checkbox */}
                        <label className="flex items-start gap-2.5 pt-2 border-t border-purple-500/20 cursor-pointer">
                          <input
                            id="client-gear-kit-acknowledge"
                            type="checkbox"
                            checked={gearKitAcknowledged}
                            onChange={(e) => setGearKitAcknowledged(e.target.checked)}
                            className="mt-0.5 rounded text-purple-500 focus:ring-purple-500 bg-slate-950 border-purple-500/50"
                          />
                          <span className="text-xs text-purple-200 font-semibold leading-snug">
                            I request a complimentary full safety kit and certify our pit crew will arrive <strong>20 minutes prior</strong> to staging for fitment and helmet strap inspection at the technical armory.
                          </span>
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Financial Breakdown Card */}
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                      <div>
                        <div className="text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                          Pricing Breakdown • {bookingTier.replace('_', '-').toUpperCase()} RATE
                        </div>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {selectedBlocks.length} Block(s) × ${pricingBreakdown.ratePerBlock}.00 = ${pricingBreakdown.blocksSubtotal}.00
                          {purchaseAnnualMembership && (
                            <span className="text-purple-300 font-mono font-normal"> + $200.00 Annual Membership</span>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Grand Total</span>
                        <span className="text-lg font-black font-mono text-white">${pricingBreakdown.total}.00</span>
                      </div>
                    </div>

                    {/* Due Today Callout */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                      <div>
                        {bookingTier === 'walk_in' ? (
                          <p className="text-[11px] text-cyan-300">
                            Walk-in paddock entry: Total of <strong>${pricingBreakdown.total}.00</strong> is payable upon immediate gate check-in.
                          </p>
                        ) : purchaseAnnualMembership ? (
                          <p className="text-[11px] text-purple-300">
                            <strong>$200.00</strong> annual membership pass charged today. Session blocks (${pricingBreakdown.blocksSubtotal}.00) scheduled for auto-charge on <strong>{chargeDate}</strong> (7 days prior).
                          </p>
                        ) : (
                          <p className="text-[11px] text-emerald-400">
                            Card authorized for $0.00 today. Session fee of <strong>${pricingBreakdown.total}.00</strong> scheduled for auto-charge on <strong>{chargeDate}</strong> (7 days prior to event).
                          </p>
                        )}
                        {pricingBreakdown.totalSavings > 0 && (
                          <span className="text-[10px] font-bold text-emerald-400 font-mono inline-block mt-0.5">
                            ★ Saving ${pricingBreakdown.totalSavings}.00 off standard rates with Member pricing
                          </span>
                        )}
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-[10px] text-slate-400 uppercase font-mono block">Amount Due Today</span>
                        <span className="text-2xl font-black font-mono text-emerald-400">${dueToday}.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons between Steps */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition-all"
                  >
                    Back
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <span>Continue</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="client-submit-placeholder-btn"
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    {bookingTier === 'walk_in'
                      ? `Confirm Walk-In Entry ($${dueToday}.00 Due at Paddock)`
                      : purchaseAnnualMembership
                      ? `Enroll $200 Membership & Lock Pre-Entry ($200.00 Today)`
                      : `Lock Pre-Entry Reservation ($0.00 Due Today)`}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SUBMITTED CONFIRMATION PASS / RECEIPT */}
        {submittedReservation && (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {submittedReservation.bookingTier === 'walk_in'
                  ? 'Walk-In Paddock Entry Registered!'
                  : 'Pre-Entry Reservation Confirmed!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                {submittedReservation.bookingTier === 'walk_in'
                  ? 'Your rider is checked in for same-day paddock rotation. Present this pass at tech staging.'
                  : `Your rider’s spot is officially secured with $${submittedReservation.amountDueToday ?? 0}.00 charged today under the 7-day payment confirmation policy.`}
              </p>
            </div>

            {/* Printable Digital Confirmation Pass */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-sans">
                      GO MOTO
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      CERTIFIED TRACK PASS
                    </span>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {submittedReservation.bookingTier?.replace('_', '-')} TIER (${submittedReservation.ratePerBlock ?? 65}/block)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                    CONFIRMATION PASS ID
                  </span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-white">
                    {submittedReservation.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Save Pass
                  </button>
                </div>
              </div>

              {/* Pass Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Rider Details</span>
                  <p className="text-white font-black text-base">{submittedReservation.riderName}</p>
                  <p className="text-slate-400">Bike Plate: #{submittedReservation.bikeNumber} • Age {submittedReservation.riderAge}</p>
                  <p className="text-emerald-400 font-mono text-[11px] mt-1 font-semibold">
                    Class: {classes.find((c) => c.id === submittedReservation.classId)?.name}
                  </p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Classification:</span>
                    <span className="font-bold text-amber-300 uppercase font-mono">
                      {submittedReservation.experienceLevel} (Accepted)
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Event Date & Blocks</span>
                  <p className="text-white font-black text-base font-mono">{submittedReservation.eventDate}</p>
                  <p className="text-slate-400">
                    {submittedReservation.blocks.map((b) => (b === 'morning' ? 'Morning (8:00 AM)' : 'Afternoon (2:00 PM)')).join(' & ')}
                  </p>
                  <p className="text-slate-400 text-[11px] mt-1">
                    60–120 min track duration (10-min rotation cycles)
                  </p>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Billing & Policy</span>
                  <p className="text-emerald-400 font-black text-base font-mono">
                    ${submittedReservation.amountDueToday ?? 0}.00 Paid Today
                  </p>
                  <p className="text-slate-300 font-semibold text-[11px] mt-0.5">
                    Total: ${submittedReservation.totalAmountCalculated}.00
                  </p>
                  {submittedReservation.bookingTier !== 'walk_in' ? (
                    <p className="text-cyan-400 font-mono font-bold text-xs mt-1">
                      7-Day Confirmation Due: {submittedReservation.chargeDate}
                    </p>
                  ) : (
                    <p className="text-amber-400 font-mono font-bold text-xs mt-1">
                      Walk-In Direct Payment
                    </p>
                  )}
                  {submittedReservation.hasAnnualMembership && (
                    <span className="inline-block mt-1 text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      ★ Active $200/yr Member
                    </span>
                  )}
                </div>
              </div>

              {/* Gear Status Card in Confirmation Pass */}
              <div className={`p-4 rounded-2xl border text-xs ${
                submittedReservation.gearLoanerRequested
                  ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="font-bold flex items-center gap-2">
                    <Shirt className="w-4 h-4 text-purple-400" />
                    {submittedReservation.gearLoanerRequested
                      ? 'Complimentary Full Track Gear Kit Reserved ($0.00)'
                      : 'Personal Protective Equipment Certified'}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {submittedReservation.gearLoanerRequested ? 'Armory Loaner Program' : 'Client Provided'}
                  </span>
                </div>
                {submittedReservation.gearLoanerRequested && submittedReservation.gearKitDetails ? (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Helmet</span>
                        <span className="font-bold text-white">{submittedReservation.gearKitDetails.helmetSize}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Boots</span>
                        <span className="font-bold text-white">Youth {submittedReservation.gearKitDetails.bootSize}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Chest Guard</span>
                        <span className="font-bold text-white">{submittedReservation.gearKitDetails.chestProtectorSize}</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400 block text-[10px] uppercase font-mono">Apparel</span>
                        <span className="font-bold text-white">{submittedReservation.gearKitDetails.jerseyPantSize}</span>
                      </div>
                    </div>
                    {submittedReservation.gearKitDetails.notes && (
                      <p className="text-[10px] text-slate-400 italic">
                        Notes: "{submittedReservation.gearKitDetails.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 pt-2">
                    Rider will arrive with full personal certified equipment meeting DOT/ECE helmet and motocross boot standards.
                  </p>
                )}
              </div>

              {/* Check-In Instructions */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Important Track Day Reminders:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Please arrive 30 minutes prior to your block start for tech inspection and transponder assignment.</li>
                  {submittedReservation.gearLoanerRequested ? (
                    <li className="text-purple-300 font-semibold">
                      <strong>Gear Loaner Kit Reserved:</strong> Report to the Technical Armory Bay 20 minutes prior for fitting and safety certification.
                    </li>
                  ) : (
                    <li>
                      <strong>Personal Riding Gear Required:</strong> Full-face DOT/ECE helmet, motocross boots, chest guard, gloves, and goggles are mandatory.
                    </li>
                  )}
                  <li>Proof of health insurance and sports physical must match your registered details.</li>
                </ul>
              </div>

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
                >
                  Book Another Rider / Reservation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: MY RESERVATIONS LOOKUP */}
        {activeClientTab === 'lookup' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div>
                <h3 className="text-xl font-black text-white flex items-center gap-2">
                  <Search className="w-5 h-5 text-emerald-400" />
                  Look Up Your Pre-Entry Reservation
                </h3>
                <p className="text-xs text-slate-400">
                  Enter your confirmation ID (e.g. EMX-101), notification email, phone number, or rider's name.
                </p>
              </div>

              <form onSubmit={handlePerformLookup} className="flex gap-2">
                <input
                  id="client-lookup-input"
                  type="text"
                  placeholder="e.g. EMX-101 or parent@example.com or rider name"
                  value={lookupQuery}
                  onChange={(e) => setLookupQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  id="client-lookup-submit-btn"
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all"
                >
                  Search
                </button>
              </form>

              {lookupResult !== null && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-400">
                    Search Results ({lookupResult.length} reservation found)
                  </div>

                  {lookupResult.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                      No matching advance reservations found. Please verify your email or confirmation number.
                    </div>
                  ) : (
                    lookupResult.map((res) => {
                      const cls = classes.find((c) => c.id === res.classId);
                      return (
                        <div
                          key={res.id}
                          className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-emerald-400">{res.id}</span>
                              <span className="font-bold text-white text-sm">{res.riderName}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                                {cls?.name} (#{res.bikeNumber})
                              </span>
                              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                                res.bookingTier === 'member'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                  : res.bookingTier === 'walk_in'
                                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              }`}>
                                {res.bookingTier?.replace('_', '-')} (${res.ratePerBlock ?? 65}/block)
                              </span>
                              {res.gearLoanerRequested ? (
                                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1 font-bold">
                                  <Shirt className="w-2.5 h-2.5" /> Full Kit Loaner ($0)
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                                  Personal Gear
                                </span>
                              )}
                            </div>
                            <div className="text-slate-400 text-[11px] mt-1">
                              Event Date: <strong className="text-white">{res.eventDate}</strong> • Block(s):{' '}
                              {res.blocks.map((b) => (b === 'morning' ? 'Morning 8am' : 'Afternoon 2pm')).join(' & ')}
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-emerald-400 font-bold font-mono block">
                              ${res.amountDueToday ?? 0}.00 Paid Today
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono block">
                              Total: ${res.totalAmountCalculated}.00
                            </span>
                            <span className={`text-[10px] font-mono font-bold block mt-0.5 ${
                              res.status === 'payment_confirmed' ? 'text-emerald-400' : 'text-cyan-400'
                            }`}>
                              {res.status === 'payment_confirmed'
                                ? '✓ Payment Confirmed'
                                : `7-Day Confirmation Due: ${res.chargeDate}`}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 4: OEM SPECS & TRACK RULES */}
        {activeClientTab === 'guidelines' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
              <div>
                <h3 className="text-xl font-black text-white">Manufacturer Specifications &amp; Facility Rules</h3>
                <p className="text-xs text-slate-400">
                  Detailed rider eligibility standards per Stacyc &amp; Cobra MOTO OEM manuals.
                </p>
              </div>

              {/* Rider Classification Standard Banner */}
              <div className="bg-slate-950 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Facility Rider Acceptance Policy</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      ✓ Novice Classification Accepted
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                      ✕ First-Time/Beginners Excluded
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 pt-1">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-emerald-400 font-bold block text-[11px] uppercase tracking-wider">
                      ✓ Why Novice Riders Are Accepted
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Novice riders possess core machine management fundamentals: independent balance, throttle roll-off reflexes, hand brake modulation, and prior experience on pump tracks, BMX courses, or off-road trails. They can safely negotiate the indoor track without stalling rotations.
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1.5">
                    <span className="text-rose-400 font-bold block text-[11px] uppercase tracking-wider">
                      ✕ Why First-Time / Beginner Riders Are Excluded
                    </span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      Due to indoor motocross circuit speeds, rhythm rollers, tabletop jumps, and group dynamics with other youth riders, first-time riders who have never operated a powered 2-wheel bike pose significant safety risks to themselves and fellow riders.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gear Loaner Program Policy Banner */}
              <div className="bg-purple-950/20 border border-purple-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-white">
                    <HeartHandshake className="w-5 h-5 text-purple-400" />
                    <span>Complimentary Full Gear Loaner Program (Financial Barrier Removal)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                    $0.00 Kit • 7-Day Lead Time
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Financial accessibility is a core pillar of Go Moto. Riders who do not own personal motocross protective apparel can request a complimentary, fully certified equipment package at least one week (7 days) prior to their scheduled block.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] pt-1">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-purple-300 block mb-1">1. Full Safety Equipment</span>
                    <p className="text-slate-400">
                      Includes DOT/ECE full-face helmet, articulated boots, roost guard chest protector, anti-fog goggles, gloves, and pants/jersey.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-cyan-300 block mb-1">2. 7-Day Advance Notice</span>
                    <p className="text-slate-400">
                      Requests must be locked at least 7 days before event date to allow armory sizing, certified safety inspection, and hospital-grade sanitization.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="font-bold text-emerald-300 block mb-1">3. 20-Minute Pre-Fitting</span>
                    <p className="text-slate-400">
                      Rider pit crew must arrive 20 minutes prior to session gate staging for individual fitment and chin strap / tether verification.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {classes.map((cls) => {
                  const oem = MANUFACTURER_GUIDELINES[cls.id] || MANUFACTURER_GUIDELINES['cx3-c'];
                  return (
                    <div key={cls.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <div>
                          <div className="font-black text-white text-sm">{cls.name}</div>
                          <div className="text-[11px] text-slate-400">{cls.subTitle}</div>
                        </div>
                        <span className="text-xs font-mono font-bold text-emerald-400">{oem.recommendedAge}</span>
                      </div>

                      <div className="text-xs space-y-1.5 text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Weight Limit:</span>
                          <span className="font-semibold">{oem.riderWeightLimit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Clearance / Inseam:</span>
                          <span className="font-semibold">{oem.riderHeightOrInseam}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Battery Spec:</span>
                          <span className="font-semibold font-mono text-cyan-400 text-[11px]">{oem.batteryPackType}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                        <span className="text-slate-400 font-bold block mb-1">Prerequisites:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                          {oem.skillPrerequisites.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Portal Footer with Tech Credit */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 text-center text-xs text-slate-400 mt-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="font-bold text-slate-200">GO MOTO</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold">Google Tech Stack Powered</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Empowering Next-Gen Youth Motocross</span>
          </span>
          <span className="text-slate-500 font-mono text-[11px]">
            Cloud Run Architecture &amp; Precision Timing Engine
          </span>
        </div>
      </footer>
    </div>
  );
};
