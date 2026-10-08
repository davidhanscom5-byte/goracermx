import React, { useState, useMemo } from 'react';
import {
  UserCheck,
  Calendar,
  CreditCard,
  ShieldCheck,
  Clock,
  Search,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  DollarSign,
  UserPlus,
  Bike,
  Award,
  Radio,
  Tag,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Rider, Reservation, BlockId, MotocrossClass } from '../types';
import { MOTOCROSS_CLASSES } from '../utils/scheduleData';

interface RegistrationDeskTerminalProps {
  riders: Rider[];
  reservations: Reservation[];
  currentBlock: BlockId;
  onSelectBlock: (block: BlockId) => void;
  onAddReservation: (res: Reservation) => void;
  onUpdateRider: (rider: Rider) => void;
  onSwitchTerminal: (terminal: string) => void;
}

export const RegistrationDeskTerminal: React.FC<RegistrationDeskTerminalProps> = ({
  riders,
  reservations,
  currentBlock,
  onSelectBlock,
  onAddReservation,
  onUpdateRider,
  onSwitchTerminal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'manifest' | 'walkin' | 'bookings' | 'memberships'>('manifest');

  // Filter riders for today's active block
  const blockRiders = useMemo(() => {
    return riders.filter((r) => r.blockId === currentBlock);
  }, [riders, currentBlock]);

  // Filtered riders for search
  const filteredRiders = useMemo(() => {
    if (!searchQuery.trim()) return blockRiders;
    const q = searchQuery.toLowerCase();
    return blockRiders.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.number.includes(q) ||
        r.riderRfidTag.toLowerCase().includes(q) ||
        r.classId.toLowerCase().includes(q)
    );
  }, [blockRiders, searchQuery]);

  // Stats
  const checkedInCount = blockRiders.filter((r) => r.checkedIn).length;
  const pendingCount = blockRiders.length - checkedInCount;

  // Walk-in form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinNumber, setWalkinNumber] = useState('');
  const [walkinClassId, setWalkinClassId] = useState('cx3-c');
  const [walkinIsMember, setWalkinIsMember] = useState(false);
  const [walkinEbikeProficient, setWalkinEbikeProficient] = useState(true);
  const [walkinWaiverSigned, setWalkinWaiverSigned] = useState(true);
  const [walkinRentHelmet, setWalkinRentHelmet] = useState(false);
  const [walkinRentChest, setWalkinRentChest] = useState(false);
  const [walkinSuccessMsg, setWalkinSuccessMsg] = useState<string | null>(null);

  // Handle Quick Check-in
  const handleToggleCheckin = (rider: Rider) => {
    onUpdateRider({
      ...rider,
      checkedIn: !rider.checkedIn,
    });
  };

  // Submit Walk-in Rider
  const handleProcessWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    const chosenClass = MOTOCROSS_CLASSES.find((c) => c.id === walkinClassId) || MOTOCROSS_CLASSES[0];
    const newNumber = walkinNumber.trim() || String(Math.floor(10 + Math.random() * 89));
    const randomRfid = `RFID-WRIST-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRider: Rider = {
      id: `walkin-${Date.now()}`,
      number: newNumber,
      name: walkinName.trim(),
      classId: walkinClassId,
      blockId: currentBlock,
      transponderId: `TX-${newNumber}`,
      riderRfidTag: randomRfid,
      machineRfidTag: `RFID-${chosenClass.machineModel || 'CX3'}-${newNumber}`,
      batteryPercent: 100,
      batteryStatus: 'full',
      checkedIn: true,
      waiverSigned: walkinWaiverSigned,
      qualificationType: walkinEbikeProficient ? 'electric_bicycle' : 'motocross',
    };

    onUpdateRider(newRider);

    // Also add to reservations
    const todayStr = new Date().toISOString().split('T')[0];
    const newRes: Reservation = {
      id: `RES-WALK-${Date.now().toString().slice(-6)}`,
      riderName: walkinName.trim(),
      riderAge: chosenClass.machineModel === 'CX3' ? 8 : 11,
      bikeNumber: newNumber,
      parentGuardianName: 'Guardian on Site',
      contactPhone: '555-0199',
      contactEmail: 'walkin@gomotomx.com',
      eventDate: todayStr,
      classId: walkinClassId,
      blocks: [currentBlock],
      experienceLevel: walkinEbikeProficient ? 'electric_bicycle' : 'novice',
      priorTrackHistory: 'Class C e-bike proficiency confirmed at front desk',
      manufacturerGuidelinesAcknowledged: true,
      insuranceProvider: 'Track Day Participant Coverage',
      insurancePolicyNumber: `POL-${Date.now().toString().slice(-8)}`,
      physicalCheckupDate: todayStr,
      physicianClinic: 'Walk-In Registration Verification',
      gearAcknowledged: true,
      gearLoanerRequested: walkinRentHelmet || walkinRentChest,
      createdAt: todayStr,
      chargeDate: todayStr,
      bookingTier: walkinIsMember ? 'member' : 'walk_in',
      ratePerBlock: walkinIsMember ? 40 : 85,
      hasAnnualMembership: walkinIsMember,
      totalAmountCalculated: walkinIsMember ? 40 : 85,
      amountDueToday: walkinIsMember ? 40 : 85,
      status: 'charged',
      assignedRiderRfid: randomRfid,
      assignedMachineRfid: `RFID-${chosenClass.machineModel || 'CX3'}-${newNumber}`,
      paymentConfirmedAt: new Date().toISOString(),
    };

    onAddReservation(newRes);

    setWalkinSuccessMsg(
      `Walk-in check-in complete! Rider ${walkinName} (#${newNumber}) placed into ${chosenClass.name}. Passive RFID Wristband: ${randomRfid} assigned.`
    );
    setWalkinName('');
    setWalkinNumber('');
    setTimeout(() => setWalkinSuccessMsg(null), 5000);
  };

  return (
    <div id="registration-desk-terminal" className="space-y-5 animate-fadeIn">
      {/* Terminal Header */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-lg">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono">
                  FIXED STATION TERMINAL
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-emerald-300 border border-emerald-500/30 font-mono">
                  STATION 03 • REGISTRATION &amp; FRONT OFFICE
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  60-DAY WINDOW • 7-DAY PAYMENT SETTLEMENT
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                Registration Desk Intake &amp; Check-In Console
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Front office check-in manifest, same-day walk-in entry ($85), 60-day pre-registrations ($65), annual membership desk ($200/yr to $40/block), and passive RFID wristband assignment.
              </p>
            </div>
          </div>

          {/* Quick Terminal Switching */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onSwitchTerminal('director')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Tower Operations (Track Director)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              type="button"
              onClick={() => onSwitchTerminal('marshall')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>E-Bike Bay (Machine Marshall)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Pricing & Protocol Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-300">
              Scheduled Block: <strong className="text-white font-mono">$65</strong>
            </span>
            <span className="text-slate-300">
              Walk-in Entry: <strong className="text-amber-400 font-mono">$85</strong>
            </span>
            <span className="text-slate-300">
              Annual Membership: <strong className="text-emerald-400 font-mono">$200/yr</strong>
            </span>
            <span className="text-slate-300">
              Member Block Rate: <strong className="text-cyan-400 font-mono">$40/block</strong> <span className="text-[10px] text-slate-400">(Save $25)</span>
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Passive RFID Reader at Staging Entrance Ready</span>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveSubTab('manifest')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'manifest'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Today's Check-In Manifest ({checkedInCount}/{blockRiders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('walkin')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'walkin'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Process Walk-In ($85)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('bookings')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'bookings'
                ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>60-Day Reservation Calendar</span>
          </button>
        </div>

        {/* Block Toggle */}
        <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onSelectBlock('morning')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              currentBlock === 'morning'
                ? 'bg-emerald-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Morning Block (8:00 AM)
          </button>
          <button
            type="button"
            onClick={() => onSelectBlock('afternoon')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              currentBlock === 'afternoon'
                ? 'bg-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Afternoon Block (2:00 PM)
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: CHECK-IN MANIFEST */}
      {activeSubTab === 'manifest' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search rider name, #, RFID tag, or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="text-emerald-400 font-bold">{checkedInCount} Checked In</span>
              <span>•</span>
              <span className="text-amber-400 font-bold">{pendingCount} Pending</span>
            </div>
          </div>

          {/* Rider Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4"># Bike</th>
                    <th className="py-3 px-4">Rider Name</th>
                    <th className="py-3 px-4">Class &amp; Machine</th>
                    <th className="py-3 px-4">Eligibility</th>
                    <th className="py-3 px-4">Passive RFID Band</th>
                    <th className="py-3 px-4">Waiver</th>
                    <th className="py-3 px-4 text-right">Check-In Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredRiders.map((rider) => {
                    const cls = MOTOCROSS_CLASSES.find((c) => c.id === rider.classId);
                    return (
                      <tr key={rider.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 font-mono font-black text-amber-300 text-sm">
                          #{rider.number}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{rider.name}</div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Transponder: {rider.transponderId}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-0.5 rounded text-[10px] font-bold"
                            style={{
                              backgroundColor: `${cls?.colorScheme.primary}20`,
                              color: cls?.colorScheme.primary,
                              border: `1px solid ${cls?.colorScheme.primary}40`,
                            }}
                          >
                            {cls?.name || rider.classId.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            E-Bike Proficient (Class C)
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300 text-[11px]">
                          <span className="flex items-center gap-1">
                            <Radio className="w-3 h-3 text-cyan-400" />
                            {rider.riderRfidTag}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Signed
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckin(rider)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                              rider.checkedIn
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md font-black uppercase'
                            }`}
                          >
                            {rider.checkedIn ? 'Checked In ✓' : 'Check In'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PROCESS WALK-IN */}
      {activeSubTab === 'walkin' && (
        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  Same-Day Walk-In Registration
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Process on-site entry ($85 walk-in rate or $40 with active annual membership).
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-400 font-mono">
                  {walkinIsMember ? '$40' : '$85'}
                </span>
                <div className="text-[10px] text-slate-400">Total Entry Fee</div>
              </div>
            </div>
          </div>

          {walkinSuccessMsg && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{walkinSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleProcessWalkin} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Rider Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mason Davis"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Desired Bike # (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 44 (Auto-assigned if blank)"
                  value={walkinNumber}
                  onChange={(e) => setWalkinNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Class &amp; Machine Assignment *</label>
              <select
                value={walkinClassId}
                onChange={(e) => setWalkinClassId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500"
              >
                {MOTOCROSS_CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} — {cls.model} ({cls.ageBracket})
                  </option>
                ))}
              </select>
            </div>

            {/* Checkboxes for eligibility & safety */}
            <div className="space-y-2.5 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <input
                  type="checkbox"
                  checked={walkinEbikeProficient}
                  onChange={(e) => setWalkinEbikeProficient(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-white">Class C Eligibility Qualification Verified</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Rider demonstrates proficient use of an electric bicycle (two-wheel balance, throttle control, and braking modulation).
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <input
                  type="checkbox"
                  checked={walkinIsMember}
                  onChange={(e) => setWalkinIsMember(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-white">Active Annual Member ($200/yr Membership on File)</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Applies the $40 member rate instead of standard $85 walk-in rate ($45 savings).
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <input
                  type="checkbox"
                  checked={walkinWaiverSigned}
                  onChange={(e) => setWalkinWaiverSigned(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-0"
                />
                <div>
                  <span className="font-bold text-white">Parent / Guardian Liability Waiver Signed on Counter Tablet</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-wider text-xs shadow-lg transition-all active:scale-98"
            >
              Complete Walk-In Entry &amp; Assign Passive RFID Band
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 3: 60-DAY RESERVATION CALENDAR */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                60-Day Pre-Registration Window &amp; 7-Day Payment Settlements
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bookings accepted up to 60 days ahead with zero-down placeholder. Payment charges settle exactly 7 days prior to session date.
              </p>
            </div>
            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300">
              {reservations.length} Total Bookings on File
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {reservations.slice(0, 12).map((res) => {
              const cls = MOTOCROSS_CLASSES.find((c) => c.id === res.classId);
              return (
                <div key={res.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-cyan-400 text-[11px]">{res.id}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      {res.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-black text-white text-sm">{res.riderName}</div>
                    <div className="text-slate-400 text-[11px]">
                      Session Date: <strong>{res.eventDate}</strong> ({res.blocks?.join(', ') || 'morning'})
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">{cls?.name}</span>
                    <span className="font-bold text-amber-400 font-mono">${res.totalAmountCalculated}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
