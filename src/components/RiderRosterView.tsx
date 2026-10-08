import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Battery,
  BatteryCharging,
  FileText,
  Download,
  Trash2,
  Edit2,
  Shield,
  Radio,
  Award,
  ArrowUpRight,
  Zap,
  CheckCheck,
  Sparkles,
  X,
  UserCheck,
} from 'lucide-react';
import { Rider, MotocrossClass, BlockId } from '../types';

interface RiderRosterViewProps {
  riders: Rider[];
  classes: MotocrossClass[];
  currentBlock: BlockId;
  onUpdateRider: (rider: Rider) => void;
  onAddRider: (rider: Rider) => void;
  onDeleteRider: (riderId: string) => void;
  completedHeatsByClass: Record<string, number>;
}

export const RiderRosterView: React.FC<RiderRosterViewProps> = ({
  riders,
  classes,
  currentBlock,
  onUpdateRider,
  onAddRider,
  onDeleteRider,
  completedHeatsByClass,
}) => {
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'cx3-c');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddingRider, setIsAddingRider] = useState<boolean>(false);

  // New rider form state
  const [newNumber, setNewNumber] = useState('');
  const [newName, setNewName] = useState('');
  const [newTransponder, setNewTransponder] = useState('');
  const [newRiderRfid, setNewRiderRfid] = useState('');
  const [newMachineRfid, setNewMachineRfid] = useState('');
  const [newBattery, setNewBattery] = useState(100);
  const [newQualificationType, setNewQualificationType] = useState<'electric_bicycle' | 'motocross'>('electric_bicycle');

  // Track Director Promotion Modal State
  const [promotingRider, setPromotingRider] = useState<Rider | null>(null);
  const [directorMotocrossVerified, setDirectorMotocrossVerified] = useState(true);
  const [parentApprovalConfirmed, setParentApprovalConfirmed] = useState(false);
  const [parentNameInput, setParentNameInput] = useState('');
  const [directorNameInput, setDirectorNameInput] = useState('Track Director');
  const [promotionNotesInput, setPromotionNotesInput] = useState('Demonstrated proficient cornering, gate reaction, obstacle clearance, and speed modulation.');

  // Filter riders for current block and selected class
  const blockRiders = riders.filter((r) => r.blockId === currentBlock);
  const classRiders = blockRiders.filter((r) => r.classId === selectedClassId);

  const filteredRiders = classRiders.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.number.includes(q) ||
      r.transponderId.toLowerCase().includes(q) ||
      (r.riderRfidTag && r.riderRfidTag.toLowerCase().includes(q)) ||
      (r.machineRfidTag && r.machineRfidTag.toLowerCase().includes(q))
    );
  });

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const isClassC = selectedClass.id.endsWith('-c');
  const completedHeats = completedHeatsByClass[selectedClassId] || 0;
  const completedMinutes = completedHeats * 10;

  // Promotion Handlers
  const handleOpenPromote = (rider: Rider) => {
    setPromotingRider(rider);
    setDirectorMotocrossVerified(true);
    setParentApprovalConfirmed(false);
    setParentNameInput('');
    setDirectorNameInput('Track Director');
    setPromotionNotesInput('Demonstrated proficient motocross cornering, jump clearance, and safe throttle control on track.');
  };

  const handleConfirmPromotion = () => {
    if (!promotingRider || !parentApprovalConfirmed || !directorMotocrossVerified) return;

    // CX3-C -> CX3-B; CX5-C -> CX5-B
    const targetClassId = promotingRider.classId === 'cx3-c'
      ? 'cx3-b'
      : promotingRider.classId === 'cx5-c'
      ? 'cx5-b'
      : promotingRider.classId;

    const updated: Rider = {
      ...promotingRider,
      classId: targetClassId,
      isPromotedToB: true,
      qualificationType: 'promoted',
      promotionDetails: {
        promotedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        parentApproval: true,
        parentName: parentNameInput.trim() || 'Parent / Guardian on File',
        directorSignoff: true,
        directorName: directorNameInput.trim() || 'Track Director',
        notes: promotionNotesInput.trim(),
      },
    };

    onUpdateRider(updated);
    setPromotingRider(null);
    setSelectedClassId(targetClassId);
  };

  // Handle adding rider
  const handleCreateRider = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newNumber.trim()) return;

    const riderTag = newRiderRfid.trim() || `RF-R-${newNumber.trim().padStart(3, '0')}`;
    const machineTag = newMachineRfid.trim() || `RF-M-${newNumber.trim().padStart(3, '0')}`;

    const newRider: Rider = {
      id: `${currentBlock}-${selectedClassId}-${Date.now()}`,
      number: newNumber.trim(),
      name: newName.trim(),
      classId: selectedClassId,
      blockId: currentBlock,
      transponderId: newTransponder.trim() || `TX-${Math.floor(100 + Math.random() * 900)}`,
      riderRfidTag: riderTag,
      machineRfidTag: machineTag,
      batteryPercent: Number(newBattery) || 100,
      batteryStatus: 'full',
      checkedIn: true,
      waiverSigned: true,
      qualificationType: newQualificationType,
    };

    onAddRider(newRider);
    setIsAddingRider(false);
    setNewName('');
    setNewNumber('');
    setNewTransponder('');
    setNewRiderRfid('');
    setNewMachineRfid('');
    setNewBattery(100);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Rider #', 'Name', 'Class', 'Block', 'Transponder', 'Qualification', 'Promoted', 'Rider RFID', 'Machine RFID', 'Battery %', 'Checked In', 'Waiver Signed'];
    const rows = blockRiders.map((r) => {
      const clsName = classes.find((c) => c.id === r.classId)?.name || r.classId;
      return [
        `"#${r.number}"`,
        `"${r.name}"`,
        `"${clsName}"`,
        `"${r.blockId}"`,
        `"${r.transponderId}"`,
        `"${r.qualificationType || 'E-Bike / Novice'}"`,
        `"${r.isPromotedToB ? 'YES (Track Dir & Parent)' : 'NO'}"`,
        `"${r.riderRfidTag || ''}"`,
        `"${r.machineRfidTag || ''}"`,
        `"${r.batteryPercent}%"`,
        `"${r.checkedIn ? 'YES' : 'NO'}"`,
        `"${r.waiverSigned ? 'YES' : 'NO'}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `go-moto-roster-${currentBlock}-block.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="rider-roster-view" className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Class Rosters &amp; Rider Check-In ({currentBlock === 'morning' ? 'Morning 8:00 AM' : 'Afternoon 2:00 PM'})
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict 15 riders per class capacity • Track cumulative progress toward 60 min (1 hr) goal
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="export-roster-csv-btn"
            type="button"
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export Roster CSV</span>
          </button>

          <button
            id="open-add-rider-modal-btn"
            type="button"
            onClick={() => setIsAddingRider(!isAddingRider)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingRider ? 'Cancel' : 'Add Rider'}</span>
          </button>
        </div>
      </div>

      {/* Class C E-Bike Qualification & Track Director Advancement Policy Banner */}
      <div id="roster-qualification-policy-banner" className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/25 to-slate-950 border border-emerald-500/30 rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-inner">
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Class C Rider Qualification &amp; Track Director Advancement Policy</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            <strong>Class C Eligibility:</strong> Proficient use of an electric bicycle qualifies a participant to compete in Class C (demonstrating two-wheel balance, throttle control, and braking).
            <br />
            <strong>Skill Promotion:</strong> Riders who demonstrate proficient motocross skills shall be promoted to the higher classification (Class B) with parental approval as directed by the Track Director.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            E-Bike Qualifies Class C
          </span>
          <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold text-[10px] flex items-center gap-1">
            <Award className="w-3 h-3 text-cyan-400" />
            Director Promotes to Class B
          </span>
        </div>
      </div>

      {/* Class Selector Tabs (4 Classes) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {classes.map((cls) => {
          const isSelected = cls.id === selectedClassId;
          const count = blockRiders.filter((r) => r.classId === cls.id).length;
          const heats = completedHeatsByClass[cls.id] || 0;

          return (
            <button
              key={cls.id}
              id={`roster-class-tab-${cls.id}`}
              type="button"
              onClick={() => setSelectedClassId(cls.id)}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-950 border-emerald-500/60 shadow-lg ring-1 ring-emerald-500/40'
                  : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: cls.colorScheme.primary }}
                />
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {count}/15 Riders
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{cls.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{cls.ageBracket}</div>

              <div className="mt-2 text-[10px] text-emerald-400 font-mono flex items-center justify-between border-t border-slate-900 pt-1">
                <span>Completed:</span>
                <span>{heats * 10} / 60 min</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Add Rider Form Inline */}
      {isAddingRider && (
        <form
          id="add-rider-form"
          onSubmit={handleCreateRider}
          className="bg-slate-950 border border-emerald-500/40 rounded-2xl p-4 shadow-xl space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Register New Rider for {selectedClass.name}
            </h4>
            <span className="text-[11px] text-slate-400">Max capacity: 15 riders per heat</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Bike Number (#)
              </label>
              <input
                id="new-rider-number"
                type="text"
                placeholder="e.g. 7"
                required
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Rider Full Name / Nickname
              </label>
              <input
                id="new-rider-name"
                type="text"
                placeholder="e.g. Ryder 'Speedy' Johnson"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Qualification
              </label>
              <select
                id="new-rider-qualification"
                value={newQualificationType}
                onChange={(e) => setNewQualificationType(e.target.value as 'electric_bicycle' | 'motocross')}
                className="w-full px-2 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="electric_bicycle">E-Bicycle Qualified (Class C)</option>
                <option value="motocross">Motocross Experience</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Rider RFID
              </label>
              <input
                id="new-rider-rfid"
                type="text"
                placeholder="RF-R-007"
                value={newRiderRfid}
                onChange={(e) => setNewRiderRfid(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                Bike RFID
              </label>
              <input
                id="new-machine-rfid"
                type="text"
                placeholder="RF-M-007"
                value={newMachineRfid}
                onChange={(e) => setNewMachineRfid(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingRider(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 text-xs hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="submit-add-rider-btn"
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold"
            >
              Save Rider to Roster
            </button>
          </div>
        </form>
      )}

      {/* Search & Class Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            id="search-riders-input"
            type="text"
            placeholder="Search by name, #, RFID tag or transponder..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="font-mono">
            Riders: <strong className="text-white">{classRiders.length}</strong> / 15
          </span>
          <span>•</span>
          <span className="font-mono">
            Class Track Progress: <strong className="text-emerald-400">{completedMinutes}m</strong> / 60m
          </span>
        </div>
      </div>

      {/* Roster Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/40">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[10px]">
              <th className="py-2.5 px-3 text-center w-14"># Plate</th>
              <th className="py-2.5 px-3">Rider Name</th>
              <th className="py-2.5 px-3">Division &amp; Advancement</th>
              <th className="py-2.5 px-3">RFID Identification</th>
              <th className="py-2.5 px-3">Transponder</th>
              <th className="py-2.5 px-3 text-center">Track Time</th>
              <th className="py-2.5 px-3 text-center">Battery Pack</th>
              <th className="py-2.5 px-3 text-center">Waiver</th>
              <th className="py-2.5 px-3 text-center">Check-In</th>
              <th className="py-2.5 px-3 text-right">Remove</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredRiders.map((rider) => (
              <tr
                key={rider.id}
                id={`roster-row-${rider.id}`}
                className="hover:bg-slate-900/60 transition-colors"
              >
                {/* Number Plate */}
                <td className="py-2.5 px-3 text-center">
                  <span
                    className="inline-block px-2 py-1 rounded font-black font-mono text-xs border shadow-inner"
                    style={{
                      backgroundColor: `${selectedClass.colorScheme.primary}20`,
                      borderColor: `${selectedClass.colorScheme.primary}50`,
                      color: selectedClass.colorScheme.primary,
                    }}
                  >
                    #{rider.number}
                  </span>
                </td>

                {/* Rider Name */}
                <td className="py-2.5 px-3">
                  <div className="font-semibold text-white">{rider.name}</div>
                  <div className="text-[10px] text-slate-400">{selectedClass.model}</div>
                </td>

                {/* Division & Advancement (Class C Qualification vs Promotion to Class B) */}
                <td className="py-2.5 px-3">
                  {rider.isPromotedToB ? (
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 text-amber-300 border border-amber-500/40 font-bold text-[10px] shadow-sm">
                        <Award className="w-3 h-3 text-amber-400" />
                        ★ PROMOTED TO CLASS B
                      </span>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <CheckCheck className="w-2.5 h-2.5 text-emerald-400" />
                        <span>Dir. Approved • Parent Confirmed</span>
                      </div>
                    </div>
                  ) : isClassC ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                          E-Bike / Novice Qualified
                        </span>
                      </div>
                      <button
                        id={`promote-rider-btn-${rider.id}`}
                        type="button"
                        onClick={() => handleOpenPromote(rider)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold transition-all shadow-sm active:scale-95"
                        title="Rider became proficient in motocross skills - promote to Class B with parent approval and Track Director directive"
                      >
                        <Award className="w-3 h-3 text-emerald-400" />
                        <span>Promote to Class B</span>
                        <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                        Class B Division (Intermediate)
                      </span>
                    </div>
                  )}
                </td>

                {/* RFID Tags (Rider & Machine) */}
                <td className="py-2.5 px-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="text-slate-500 font-sans">Rider:</span>
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 font-bold">
                        {rider.riderRfidTag || 'UNASSIGNED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="text-slate-500 font-sans">Bike:</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold">
                        {rider.machineRfidTag || 'UNASSIGNED'}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Transponder ID */}
                <td className="py-2.5 px-3 font-mono text-slate-300">
                  {rider.transponderId}
                </td>

                {/* Cumulative Track Time */}
                <td className="py-2.5 px-3 text-center font-mono">
                  <span className="font-bold text-emerald-400">
                    {completedMinutes}m / 60m
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {completedHeats}/6 Heats
                  </div>
                </td>

                {/* Battery Status & Selector */}
                <td className="py-2.5 px-3 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <select
                      id={`battery-select-${rider.id}`}
                      value={rider.batteryPercent}
                      onChange={(e) => {
                        const newPct = Number(e.target.value);
                        onUpdateRider({
                          ...rider,
                          batteryPercent: newPct,
                          batteryStatus: newPct > 80 ? 'full' : newPct > 50 ? 'swapped' : 'low',
                        });
                      }}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                    >
                      <option value={100}>100% (Full)</option>
                      <option value={90}>90% (Swapped)</option>
                      <option value={75}>75% (Good)</option>
                      <option value={50}>50% (Charge Soon)</option>
                      <option value={25}>25% (Swap Needed)</option>
                    </select>
                  </div>
                </td>

                {/* Waiver Signed Checkbox */}
                <td className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onUpdateRider({ ...rider, waiverSigned: !rider.waiverSigned })}
                    className={`p-1 rounded-lg border transition-colors ${
                      rider.waiverSigned
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                    }`}
                    title={rider.waiverSigned ? 'Waiver Cleared' : 'Waiver Pending'}
                  >
                    <Shield className="w-3.5 h-3.5" />
                  </button>
                </td>

                {/* Check-In Checkbox */}
                <td className="py-2.5 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onUpdateRider({ ...rider, checkedIn: !rider.checkedIn })}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                      rider.checkedIn
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {rider.checkedIn ? 'PRESENT' : 'ABSENT'}
                  </button>
                </td>

                {/* Delete */}
                <td className="py-2.5 px-3 text-right">
                  <button
                    type="button"
                    onClick={() => onDeleteRider(rider.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                    title="Remove Rider"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Track Director Motocross Promotion Modal */}
      {promotingRider && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            id="track-director-promotion-modal"
            className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    Track Director Motocross Skill Promotion
                  </h4>
                  <p className="text-xs text-slate-400">
                    Official progression from Class C to Class B division
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPromotingRider(null)}
                className="p-1 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Rider Target Details */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Candidate Rider:</span>
                <span className="font-bold text-white">#{promotingRider.number} {promotingRider.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Division:</span>
                <span className="font-mono text-amber-400 font-semibold">{classes.find(c => c.id === promotingRider.classId)?.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-900 pt-2">
                <span className="text-slate-400">Target Promoted Division:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {promotingRider.classId === 'cx3-c' ? 'Cobra CX3 - Class B' : 'Cobra CX5 - Class B'}
                </span>
              </div>
            </div>

            {/* Regulatory Requirements (Track Director Directive & Parental Approval) */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/40 cursor-pointer">
                <input
                  id="check-director-directive"
                  type="checkbox"
                  checked={directorMotocrossVerified}
                  onChange={(e) => setDirectorMotocrossVerified(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-bold text-emerald-300">
                    Track Director Motocross Proficiency Directive
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Rider has demonstrated proficient motocross cornering, jump and whoop line control, safe roll-off, and track etiquette under race pace.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/40 cursor-pointer">
                <input
                  id="check-parent-approval"
                  type="checkbox"
                  required
                  checked={parentApprovalConfirmed}
                  onChange={(e) => setParentApprovalConfirmed(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-bold text-emerald-300">
                    Parent / Legal Guardian Formal Approval
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Parent or legal guardian has been consulted and formally approved promoting the rider to the faster Class B competition heats.
                  </div>
                </div>
              </label>
            </div>

            {/* Signoff Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Parent / Guardian Name
                </label>
                <input
                  id="input-promotion-parent-name"
                  type="text"
                  placeholder="e.g. Sarah Taylor"
                  value={parentNameInput}
                  onChange={(e) => setParentNameInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Track Director Sign-Off
                </label>
                <input
                  id="input-promotion-director-name"
                  type="text"
                  placeholder="Track Director Name"
                  value={directorNameInput}
                  onChange={(e) => setDirectorNameInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Director Observation Notes
                </label>
                <input
                  id="input-promotion-notes"
                  type="text"
                  placeholder="Observation notes on track speed and line choices"
                  value={promotionNotesInput}
                  onChange={(e) => setPromotionNotesInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-400 text-[11px]"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPromotingRider(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                id="confirm-promotion-to-class-b-btn"
                type="button"
                disabled={!parentApprovalConfirmed || !directorMotocrossVerified}
                onClick={handleConfirmPromotion}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Award className="w-4 h-4" />
                <span>Confirm &amp; Promote to Class B</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
