import React, { useState, useMemo } from 'react';
import {
  BatteryCharging,
  Zap,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  Flame,
  Radio,
  Sliders,
  ChevronRight,
  UserCheck,
  Bell,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Rider, MotocrossClass, BlockId, SessionSlot } from '../types';
import { MOTOCROSS_CLASSES } from '../utils/scheduleData';
import { GoMotoLogo } from './GoMotoLogo';

interface MachineMarshallTerminalProps {
  currentSlotIndex: number;
  slots: SessionSlot[];
  riders: Rider[];
  currentBlock: BlockId;
  onSelectBlock: (block: BlockId) => void;
  onUpdateRider: (rider: Rider) => void;
  onTriggerPickupAlert: () => void;
  pickedUpRiderIds: Record<string, boolean>;
  onTogglePickup: (riderId: string) => void;
  onBatchPickupAll: () => void;
  onSwitchTerminal: (terminal: string) => void;
}

interface MachineUnit {
  id: string; // e.g. "CX3-01" to "CX3-40", "CX5-01" to "CX5-40"
  model: 'CX3' | 'CX5';
  unitNumber: number; // 1 to 40
  classEligible: string[]; // ['cx3-c', 'cx3-b'] or ['cx5-c', 'cx5-b']
  bayRackNumber: string; // "RACK-A-01"
  batteryPercent: number;
  batteryStatus: 'ready' | 'charging' | 'cooldown' | 'maintenance';
  chargeCycles: number;
  redundantGroundingOk: boolean;
  killSwitchTetherPresent: boolean;
  handlebarPaddingOk: boolean;
  tirePressurePsi: number;
  rfidTag: string;
  assignedRiderName?: string;
  assignedRiderNumber?: string;
  assignedClassId?: string;
  impoundReleased: boolean;
}

export const MachineMarshallTerminal: React.FC<MachineMarshallTerminalProps> = ({
  currentSlotIndex,
  slots,
  riders,
  currentBlock,
  onSelectBlock,
  onUpdateRider,
  onTriggerPickupAlert,
  pickedUpRiderIds,
  onTogglePickup,
  onBatchPickupAll,
  onSwitchTerminal,
}) => {
  const currentSlot = slots[currentSlotIndex] || slots[0];
  const nextSlot = slots[currentSlotIndex + 1] || slots[0];

  const currentClass = MOTOCROSS_CLASSES.find((c) => c.id === currentSlot?.classId) || MOTOCROSS_CLASSES[0];
  const nextClass = MOTOCROSS_CLASSES.find((c) => c.id === nextSlot?.classId) || MOTOCROSS_CLASSES[1];

  // Search & Filters
  const [modelFilter, setModelFilter] = useState<'ALL' | 'CX3' | 'CX5'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ready' | 'charging' | 'cooldown' | 'deployed'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMachine, setSelectedMachine] = useState<MachineUnit | null>(null);

  // Quick state for rapid battery swap dialog
  const [swapSuccessMessage, setSwapSuccessMessage] = useState<string | null>(null);

  // Generate the full 80 Cobra Moto Machine fleet (40 CX3 + 40 CX5)
  const fleet: MachineUnit[] = useMemo(() => {
    const list: MachineUnit[] = [];

    // 40 Cobra CX3 (Units 1 - 40)
    for (let i = 1; i <= 40; i++) {
      const pad = String(i).padStart(2, '0');
      const machineId = `CX3-${pad}`;
      const rfidTag = `RFID-CX3-${pad}`;
      const bay = `IMP-A-${pad}`;

      // Correlate with active riders if assigned
      const assignedRider = riders.find((r) => r.machineRfidTag === rfidTag || r.id === `cx3-${i}`);
      const isPickedUp = assignedRider ? !!pickedUpRiderIds[assignedRider.id] : false;

      // Realistic battery profile for demo
      const baseCharge = i <= 20 ? 98 : i <= 32 ? 65 : 42;
      const batteryStatus =
        baseCharge > 85 ? 'ready' : baseCharge > 50 ? 'charging' : 'cooldown';

      list.push({
        id: machineId,
        model: 'CX3',
        unitNumber: i,
        classEligible: ['cx3-c', 'cx3-b'],
        bayRackNumber: bay,
        batteryPercent: baseCharge,
        batteryStatus,
        chargeCycles: 45 + (i % 20),
        redundantGroundingOk: true,
        killSwitchTetherPresent: true,
        handlebarPaddingOk: true,
        tirePressurePsi: 13.5,
        rfidTag,
        assignedRiderName: assignedRider ? assignedRider.name : undefined,
        assignedRiderNumber: assignedRider ? assignedRider.number : undefined,
        assignedClassId: assignedRider ? assignedRider.classId : (i % 2 === 0 ? 'cx3-b' : 'cx3-c'),
        impoundReleased: isPickedUp,
      });
    }

    // 40 Cobra CX5 (Units 1 - 40)
    for (let i = 1; i <= 40; i++) {
      const pad = String(i).padStart(2, '0');
      const machineId = `CX5-${pad}`;
      const rfidTag = `RFID-CX5-${pad}`;
      const bay = `IMP-B-${pad}`;

      const assignedRider = riders.find((r) => r.machineRfidTag === rfidTag || r.id === `cx5-${i}`);
      const isPickedUp = assignedRider ? !!pickedUpRiderIds[assignedRider.id] : false;

      const baseCharge = i <= 24 ? 100 : i <= 34 ? 72 : 38;
      const batteryStatus =
        baseCharge > 85 ? 'ready' : baseCharge > 50 ? 'charging' : 'cooldown';

      list.push({
        id: machineId,
        model: 'CX5',
        unitNumber: i,
        classEligible: ['cx5-c', 'cx5-b'],
        bayRackNumber: bay,
        batteryPercent: baseCharge,
        batteryStatus,
        chargeCycles: 38 + (i % 25),
        redundantGroundingOk: true,
        killSwitchTetherPresent: true,
        handlebarPaddingOk: true,
        tirePressurePsi: 14.0,
        rfidTag,
        assignedRiderName: assignedRider ? assignedRider.name : undefined,
        assignedRiderNumber: assignedRider ? assignedRider.number : undefined,
        assignedClassId: assignedRider ? assignedRider.classId : (i % 2 === 0 ? 'cx5-b' : 'cx5-c'),
        impoundReleased: isPickedUp,
      });
    }

    return list;
  }, [riders, pickedUpRiderIds]);

  // Filtered machines
  const filteredMachines = useMemo(() => {
    return fleet.filter((m) => {
      if (modelFilter !== 'ALL' && m.model !== modelFilter) return false;
      if (statusFilter === 'ready' && m.batteryStatus !== 'ready') return false;
      if (statusFilter === 'charging' && m.batteryStatus !== 'charging') return false;
      if (statusFilter === 'cooldown' && m.batteryStatus !== 'cooldown') return false;
      if (statusFilter === 'deployed' && !m.impoundReleased) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = m.id.toLowerCase().includes(q);
        const matchBay = m.bayRackNumber.toLowerCase().includes(q);
        const matchRider = m.assignedRiderName?.toLowerCase().includes(q);
        const matchNum = m.assignedRiderNumber?.includes(q);
        if (!matchId && !matchBay && !matchRider && !matchNum) return false;
      }
      return true;
    });
  }, [fleet, modelFilter, statusFilter, searchQuery]);

  // Summary counts
  const stats = useMemo(() => {
    const cx3Count = fleet.filter((m) => m.model === 'CX3').length;
    const cx5Count = fleet.filter((m) => m.model === 'CX5').length;
    const readyCount = fleet.filter((m) => m.batteryStatus === 'ready').length;
    const chargingCount = fleet.filter((m) => m.batteryStatus === 'charging').length;
    const cooldownCount = fleet.filter((m) => m.batteryStatus === 'cooldown').length;
    const deployedCount = fleet.filter((m) => m.impoundReleased).length;
    return { cx3Count, cx5Count, readyCount, chargingCount, cooldownCount, deployedCount };
  }, [fleet]);

  // Execute rapid battery swap on selected machine
  const handleRapidSwap = (machine: MachineUnit) => {
    setSwapSuccessMessage(
      `Fresh high-capacity Li-ion pack installed on ${machine.id}. Battery reading: 100% (Rapid swap completed in 38s). Thermal cooldown logged.`
    );
    setTimeout(() => setSwapSuccessMessage(null), 5000);
  };

  return (
    <div id="machine-marshall-terminal" className="space-y-5 animate-fadeIn">
      {/* Fixed Terminal Identity Banner & Handheld Device Ban Notice */}
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-lg">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono">
                  FIXED STATION TERMINAL
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30 font-mono">
                  STATION 02 • IMPOUND &amp; TECHNICAL BAY
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  REDUNDANT ELECTRICAL GROUNDING VERIFIED
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                Machine Marshall E-Bike Operations Console
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-fleet inventory control for 80 Cobra Moto units (40 CX3 + 40 CX5). Technical impound physical separation, rapid battery swaps, and parent retrieval dispatch.
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
              onClick={() => onSwitchTerminal('registration')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <span>Front Office (Registration Desk)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Handheld Device Strict Ban Notice */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              <strong>TRACK SAFETY PROTOCOL:</strong> Track staff are strictly prohibited from carrying handheld devices on the track floor area. All machine status logs and safety dispatch actions must be executed at this fixed terminal.
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
            <span>• Pre-Action Fire Suppression: <strong className="text-emerald-400">ACTIVE</strong></span>
            <span>• Line Voltage on Track: <strong className="text-emerald-400">ZERO (0V)</strong></span>
          </div>
        </div>
      </div>

      {/* Dispatch Action Header: 10-Minute Pre-Staging Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Next Session Staging Dispatch Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-400 animate-bounce" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Pre-Staging Dispatch Call (10 Minutes Prior to Gate Staging)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              NEXT UP: {nextClass?.name} ({nextSlot?.startTime})
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Trigger the broadcast announcement and parent notification alerting pit crew parents to retrieve their rider's assigned Cobra Moto e-bike from the technical impound bay and escort it to the staging chute.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Physical Separation Policy: <strong>Enforced</strong>
                </span>
                <span className="flex items-center gap-1.5 text-slate-300">
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  Rapid Battery Swap: <strong>Ready</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={onTriggerPickupAlert}
                className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Bell className="w-4 h-4 fill-slate-950" />
                <span>Dispatch Parent Call</span>
              </button>
              <button
                type="button"
                onClick={onBatchPickupAll}
                className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Authorize All Releases</span>
              </button>
            </div>
          </div>

          {swapSuccessMessage && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{swapSuccessMessage}</span>
            </div>
          )}
        </div>

        {/* Fleet Inventory Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
              80-Unit Machine Fleet Status
            </h3>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              TOTAL 80 UNITS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Cobra CX3 (Ages 7-9)</span>
              <div className="text-xl font-black text-emerald-400 font-mono mt-0.5">40 / 40</div>
              <span className="text-[10px] text-slate-500">Class C &amp; B Allocation</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Cobra CX5 (Ages 10-12)</span>
              <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">40 / 40</div>
              <span className="text-[10px] text-slate-500">Class C &amp; B Allocation</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Battery Ready (&gt;85%)</span>
              <div className="text-xl font-black text-white font-mono mt-0.5">{stats.readyCount}</div>
              <span className="text-[10px] text-emerald-400">Green for Heat Release</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Charging / Cooldown</span>
              <div className="text-xl font-black text-amber-400 font-mono mt-0.5">{stats.chargingCount + stats.cooldownCount}</div>
              <span className="text-[10px] text-slate-500">Redundant Grounded Racks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        {/* Model Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setModelFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              modelFilter === 'ALL'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Models (80)
          </button>
          <button
            type="button"
            onClick={() => setModelFilter('CX3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              modelFilter === 'CX3'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cobra CX3 (40)
          </button>
          <button
            type="button"
            onClick={() => setModelFilter('CX5')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              modelFilter === 'CX5'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cobra CX5 (40)
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium border ${
              statusFilter === 'ALL'
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All Status
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ready')}
            className={`px-2.5 py-1 rounded-lg font-medium border ${
              statusFilter === 'ready'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Ready ({stats.readyCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('charging')}
            className={`px-2.5 py-1 rounded-lg font-medium border ${
              statusFilter === 'charging'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Charging ({stats.chargingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('cooldown')}
            className={`px-2.5 py-1 rounded-lg font-medium border ${
              statusFilter === 'cooldown'
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Cooldown ({stats.cooldownCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('deployed')}
            className={`px-2.5 py-1 rounded-lg font-medium border ${
              statusFilter === 'deployed'
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-transparent border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Escorted to Chute ({stats.deployedCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search Machine ID, Rider, Bay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Machine Fleet Grid (All 80 Cobra Units) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {filteredMachines.map((machine) => {
          const isSelected = selectedMachine?.id === machine.id;
          const isCX3 = machine.model === 'CX3';

          return (
            <div
              key={machine.id}
              onClick={() => setSelectedMachine(machine)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/40 shadow-xl'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Top Row: Machine Tag & Model Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded font-mono ${
                      isCX3
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {machine.id}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {machine.bayRackNumber}
                  </span>
                </div>

                {machine.impoundReleased ? (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    ESCORTED
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-slate-500">
                    IN IMPOUND
                  </span>
                )}
              </div>

              {/* Rider Info if assigned */}
              <div className="mb-3">
                {machine.assignedRiderName ? (
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded bg-slate-800 text-amber-300 font-mono flex items-center justify-center text-[10px]">
                        #{machine.assignedRiderNumber}
                      </span>
                      <span className="truncate">{machine.assignedRiderName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Class: {machine.assignedClassId?.toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    Unassigned Fleet Unit (Reserve)
                  </div>
                )}
              </div>

              {/* Battery Charge Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 flex items-center gap-1">
                    <BatteryCharging className="w-3 h-3 text-cyan-400" />
                    Pack State:
                  </span>
                  <span
                    className={`font-black ${
                      machine.batteryPercent > 80
                        ? 'text-emerald-400'
                        : machine.batteryPercent > 40
                        ? 'text-cyan-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {machine.batteryPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      machine.batteryPercent > 80
                        ? 'bg-emerald-400'
                        : machine.batteryPercent > 40
                        ? 'bg-cyan-400'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${machine.batteryPercent}%` }}
                  />
                </div>
              </div>

              {/* Bottom Specs & Redundant Grounding */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono text-slate-500">
                  {machine.chargeCycles} cycles
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  <ShieldCheck className="w-3 h-3" />
                  Grounded
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Machine Detail & Technical Operations Drawer */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">{selectedMachine.id}</h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Cobra Moto {selectedMachine.model}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Bay: {selectedMachine.bayRackNumber} • RFID: {selectedMachine.rfidTag}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMachine(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Technical Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Redundant Grounding Check:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Magnetic Kill Switch Tether:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ATTACHED
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Handlebar Crossbar Padding:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> SECURE
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300">Tire Pressure PSI:</span>
                <span className="text-cyan-400 font-mono font-bold">
                  {selectedMachine.tirePressurePsi} PSI
                </span>
              </div>
            </div>

            {/* Rapid Swap Action Button */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 mb-5">
              <div>
                <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                  Rapid Battery Swap Station
                </h4>
                <p className="text-[11px] text-slate-300">
                  Tool-less quick-disconnect battery swap. Fresh 100% charged pack ready on Rack 3.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleRapidSwap(selectedMachine)}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex-shrink-0"
              >
                Perform Rapid Swap
              </button>
            </div>

            {/* Impound Release Action */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedMachine(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedMachine.assignedRiderName) {
                    const rider = riders.find((r) => r.name === selectedMachine.assignedRiderName);
                    if (rider) onTogglePickup(rider.id);
                  }
                  setSelectedMachine(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md"
              >
                Toggle Escort Release to Staging
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
