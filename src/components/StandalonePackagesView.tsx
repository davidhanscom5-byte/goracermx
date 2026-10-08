import React, { useState } from 'react';
import {
  Shield,
  Zap,
  Flag,
  Radio,
  Clock,
  Layers,
  Cpu,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BatteryCharging,
  Maximize2,
  RefreshCw,
  Power,
  Tv,
  Users,
  Compass,
  Award,
  Globe,
  Server,
  Lock,
} from 'lucide-react';
import { ActiveRoleTerminal, BlockId, Rider, SessionSlot } from '../types';

export type StandaloneProductPackage =
  | 'unified'       // Master Suite (Go Racer / Google Tech Stack Networked)
  | 'go-gate'       // Starting Gate Standalone
  | 'go-win'        // Finish Line Standalone
  | 'go-ride'       // Fleet Management Standalone
  | 'go-race'       // Operations & Reservations Standalone
  | 'go-academy';   // Rider Training & Skill Progression Standalone

interface StandalonePackagesViewProps {
  currentPackage: StandaloneProductPackage;
  onSelectPackage: (pkg: StandaloneProductPackage) => void;
  onSwitchTerminal: (term: ActiveRoleTerminal) => void;
  riders: Rider[];
  currentSlot: SessionSlot;
}

export const StandalonePackagesView: React.FC<StandalonePackagesViewProps> = ({
  currentPackage,
  onSelectPackage,
  onSwitchTerminal,
  riders,
  currentSlot,
}) => {
  // Go Gate Hardware Calibration States
  const [gateTrafficLight, setGateTrafficLight] = useState<'RED' | 'YELLOW' | 'GREEN'>('RED');
  const [gateDropArmed, setGateDropArmed] = useState(false);
  const [gateHeightInches, setGateHeightInches] = useState(1.5); // 1" to 2" tolerance above axle
  const [gateSurfaceFlush, setGateSurfaceFlush] = useState(true);
  const [passiveRfidReaderActive, setPassiveRfidReaderActive] = useState(true);
  const [gateRelayPingMs, setGateRelayPingMs] = useState(12);

  // Go Win Hardware Calibration States
  const [finishLineBatteryVolts, setFinishLineBatteryVolts] = useState(25.4); // 24V nominal DC battery
  const [zeroLineVoltageConfirmed, setZeroLineVoltageConfirmed] = useState(true);
  const [redundantGroundOhms, setRedundantGroundOhms] = useState(0.08); // < 0.1 ohm optimal
  const [transponderHitsLog, setTransponderHitsLog] = useState<
    Array<{ id: string; rider: string; time: string; lap: number; mph: number }>
  >([
    { id: 'TX-44', rider: 'Brayden Miller', time: '0:34.218', lap: 4, mph: 28.4 },
    { id: 'TX-12', rider: 'Liam Vance', time: '0:35.042', lap: 4, mph: 27.9 },
    { id: 'TX-88', rider: 'Colton Brooks', time: '0:35.890', lap: 4, mph: 26.8 },
  ]);

  // Network Mesh Modes: Standalone vs Google Tech Stack
  const [isCloudNetworked, setIsCloudNetworked] = useState(true);

  // Quick Gate Drop Sequence Simulation
  const handleTriggerGateSequence = () => {
    setGateTrafficLight('YELLOW');
    setTimeout(() => {
      setGateTrafficLight('GREEN');
      setGateSurfaceFlush(true);
      setTimeout(() => {
        setGateTrafficLight('RED');
      }, 5000);
    }, 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Brand Suite Hero Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-[#00F0FF] text-slate-950 font-mono shadow-sm">
                USA E MOTO &amp; GO FAMILY
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30 font-mono">
                SIGNATURE ACCENT: #00F0FF
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono flex items-center gap-1">
                <Globe className="w-3 h-3" />
                GOOGLE TECH STACK MESH
              </span>
            </div>

            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Modular Product Architecture
              <span className="text-sm font-bold text-slate-400 font-mono border-l border-slate-700 pl-3 hidden sm:inline">
                Standalone &amp; Networked Packages
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Every hardware module is commercially available as an independent standalone system with its own local controller, or can be networked together through the Google Cloud Tech Stack into the master <strong>Go Racer™</strong> arena command suite.
            </p>
          </div>

          {/* Cloud Network Toggle */}
          <div className="flex items-center gap-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800 flex-shrink-0">
            <div className="text-right">
              <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google Tech Stack Mesh</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                {isCloudNetworked ? 'Active Real-Time Sync' : 'Isolated Standalone Mode'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsCloudNetworked(!isCloudNetworked)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isCloudNetworked
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isCloudNetworked ? 'Networked' : 'Standalone'}
            </button>
          </div>
        </div>

        {/* Product Line Selector Pills */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* 1. Unified Master Suite */}
          <button
            type="button"
            onClick={() => onSelectPackage('unified')}
            className={`p-3 rounded-2xl border text-left transition-all relative ${
              currentPackage === 'unified'
                ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-black text-cyan-400 mb-0.5">MASTER SUITE</div>
            <div className="text-xs font-black text-white">GO RACER™</div>
            <div className="text-[10px] text-slate-400 mt-1">All-in-One Cloud Mesh</div>
          </button>

          {/* 2. Go Gate */}
          <button
            type="button"
            onClick={() => onSelectPackage('go-gate')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              currentPackage === 'go-gate'
                ? 'bg-slate-800/90 border-[#00F0FF] ring-2 ring-[#00F0FF]/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-black text-emerald-400 mb-0.5">STANDALONE</div>
            <div className="text-xs font-black text-white">GO GATE™</div>
            <div className="text-[10px] text-slate-400 mt-1">Starting Gate &amp; Signals</div>
          </button>

          {/* 3. Go Win */}
          <button
            type="button"
            onClick={() => onSelectPackage('go-win')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              currentPackage === 'go-win'
                ? 'bg-slate-800/90 border-[#00F0FF] ring-2 ring-[#00F0FF]/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-black text-cyan-400 mb-0.5">STANDALONE</div>
            <div className="text-xs font-black text-white">GO WIN™</div>
            <div className="text-[10px] text-slate-400 mt-1">Finish Line &amp; Timing</div>
          </button>

          {/* 4. Go Ride */}
          <button
            type="button"
            onClick={() => onSelectPackage('go-ride')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              currentPackage === 'go-ride'
                ? 'bg-slate-800/90 border-[#00F0FF] ring-2 ring-[#00F0FF]/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-black text-blue-400 mb-0.5">STANDALONE</div>
            <div className="text-xs font-black text-white">GO RIDE™</div>
            <div className="text-[10px] text-slate-400 mt-1">80-Unit Fleet &amp; Impound</div>
          </button>

          {/* 5. Go Race */}
          <button
            type="button"
            onClick={() => onSelectPackage('go-race')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              currentPackage === 'go-race'
                ? 'bg-slate-800/90 border-[#00F0FF] ring-2 ring-[#00F0FF]/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-black text-amber-400 mb-0.5">STANDALONE</div>
            <div className="text-xs font-black text-white">GO RACE™</div>
            <div className="text-[10px] text-slate-400 mt-1">Tower Ops &amp; Bookings</div>
          </button>

          {/* 6. Go Academy */}
          <button
            type="button"
            onClick={() => onSelectPackage('go-academy')}
            className={`p-3 rounded-2xl border text-left transition-all ${
              currentPackage === 'go-academy'
                ? 'bg-slate-800/90 border-[#00F0FF] ring-2 ring-[#00F0FF]/30 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono uppercase font-black text-purple-400 mb-0.5">STANDALONE</div>
            <div className="text-xs font-black text-white">GO ACADEMY™</div>
            <div className="text-[10px] text-slate-400 mt-1">Skill &amp; Promotion Deck</div>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PACKAGE 1: GO GATE™ (STANDALONE STARTING GATE SYSTEM)
         ========================================================================= */}
      {(currentPackage === 'go-gate' || currentPackage === 'unified') && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-lg">
                🏁
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono">
                    STANDALONE PRODUCT
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">MODEL: GO-GATE-20R</span>
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">
                  GO GATE™ — 20-Rider Precision Starting Gate System
                </h2>
                <p className="text-xs text-slate-400">
                  Operates as a self-contained starting gate with automated dual traffic signal relays, axle height sensors, flush drop confirmation, and staging chute passive RFID.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTriggerGateSequence}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>Simulate Gate Drop Cycle</span>
            </button>
          </div>

          {/* Gate Telemetry & Rule Calibration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Rule 20: Dual Traffic Signal Lights */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Dual Traffic Signals</span>
                <span className="text-[10px] font-mono text-slate-500">Rule #20</span>
              </div>
              <div className="flex items-center justify-center gap-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    gateTrafficLight === 'RED'
                      ? 'bg-red-500 border-red-300 shadow-lg shadow-red-500/50 animate-pulse'
                      : 'bg-red-950/60 border-red-900/60'
                  }`}
                  title="Red by default"
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    gateTrafficLight === 'YELLOW'
                      ? 'bg-yellow-400 border-yellow-200 shadow-lg shadow-yellow-400/50 animate-pulse'
                      : 'bg-yellow-950/60 border-yellow-900/60'
                  }`}
                  title="Yellow 10s before drop"
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    gateTrafficLight === 'GREEN'
                      ? 'bg-emerald-400 border-emerald-200 shadow-lg shadow-emerald-400/50 animate-pulse'
                      : 'bg-emerald-950/60 border-emerald-900/60'
                  }`}
                  title="Green is GO"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                Located 20 ft forward &amp; 10 ft above grade. Red default hold.
              </p>
            </div>

            {/* Rule 18: Starting Gate Height */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Gate Height Tolerance</span>
                <span className="text-[10px] font-mono text-slate-500">Rule #18</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {gateHeightInches.toFixed(1)}"
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  CALIBRATED (1" - 2" ABOVE AXLE)
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: '75%' }} />
              </div>
              <p className="text-[10px] text-slate-400">
                Front axle height reference: calibrated for Cobra CX3 and CX5 geometry.
              </p>
            </div>

            {/* Rule 19: Flush Surface Drop */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Surface Flatness Sensor</span>
                <span className="text-[10px] font-mono text-slate-500">Rule #19</span>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="font-mono text-white text-xs font-bold">
                  {gateSurfaceFlush ? 'FLUSH WITH SURFACE (0.0°)' : 'POSITION FAULT'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Pneumatic drop lays completely flat flush with track surface upon release.
              </p>
            </div>

            {/* Rule 13: Passive RFID at Gate Entrance */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Gate Entrance RFID</span>
                <span className="text-[10px] font-mono text-slate-500">Rule #13</span>
              </div>
              <div className="flex items-center justify-between pt-1 font-mono">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  PASSIVE UHF
                </span>
                <span className="text-slate-400 text-[10px]">902-928 MHz</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Captures rider wristband RFID tags as they enter staging chute.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PACKAGE 2: GO WIN™ (STANDALONE FINISH LINE & TIMING SYSTEM)
         ========================================================================= */}
      {(currentPackage === 'go-win' || currentPackage === 'unified') && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-xl shadow-lg">
                🏆
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-mono">
                    STANDALONE PRODUCT
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">MODEL: GO-WIN-RFX</span>
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">
                  GO WIN™ — Battery-Powered RFID Finish Line &amp; Timing Suite
                </h2>
                <p className="text-xs text-slate-400">
                  Strictly battery-powered with ZERO line voltage on the track floor area. Precision transponder timing, lap scoring, and redundant grounding monitoring.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300">
                Loop Sensor: <strong className="text-emerald-400">Active</strong>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300">
                Zero Line Voltage: <strong className="text-emerald-400">0V (Rule #14)</strong>
              </span>
            </div>
          </div>

          {/* Finish Line Telemetry Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Battery Power Telemetry */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Dedicated Battery DC Pack</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Rule #14</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {finishLineBatteryVolts.toFixed(1)}V DC
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Est: 14.2 hrs remaining</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Powered RFID reader runs 100% on isolated DC battery power. No line voltage cords or AC conduit across dirt.
              </p>
            </div>

            {/* Redundant Electrical Grounding */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Redundant Ground Continuity</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">Rule #15</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {redundantGroundOhms.toFixed(2)} Ω
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  OPTIMAL (&lt;0.1Ω)
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                Dual bonding paths to primary earth grounding rod. Auto-trips alert if resistance exceeds 0.25Ω.
              </p>
            </div>

            {/* Checkered Flag Trigger */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">Finish Line Scoring</span>
                <span className="text-[10px] font-mono text-cyan-400">AUTO-SCORING</span>
              </div>
              <div className="flex items-center gap-2 pt-1 font-mono text-white">
                <Flag className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-xs">Checkered Flag at 00:00 Heat</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Transponder hits automatically calculate gap to leader, fastest lap, and finish order.
              </p>
            </div>
          </div>

          {/* Live Transponder Stream */}
          <div className="bg-slate-950/60 rounded-2xl p-4 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
              <span>Live Finish Line Transponder Loop Stream</span>
              <span className="text-[10px] font-mono text-emerald-400">● LIVE DETECTING</span>
            </h4>
            <div className="space-y-2 font-mono text-xs">
              {transponderHitsLog.map((hit, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">
                      P{idx + 1}
                    </span>
                    <span className="font-bold text-white">{hit.rider}</span>
                    <span className="text-slate-500 text-[11px]">({hit.id})</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span>Lap {hit.lap}</span>
                    <span className="text-amber-400 font-bold">{hit.time}</span>
                    <span className="text-cyan-400 font-bold">{hit.mph} MPH</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PACKAGE 3: GO RIDE™ (STANDALONE FLEET MANAGEMENT SYSTEM)
         ========================================================================= */}
      {(currentPackage === 'go-ride' || currentPackage === 'unified') && (
        <div className="bg-slate-900 border border-blue-500/40 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xl shadow-lg">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-500 text-slate-950 font-mono">
                    STANDALONE PRODUCT
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">MODEL: GO-RIDE-FLEET80</span>
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">
                  GO RIDE™ — 80-Unit Cobra Moto Machine Fleet &amp; Impound System
                </h2>
                <p className="text-xs text-slate-400">
                  Full lifecycle fleet control for 40 Cobra CX3 (Ages 7–9) and 40 Cobra CX5 (Ages 10–12). Physical separation policy, rapid battery swaps, and parent dispatch alerts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSwitchTerminal('machine-marshall')}
              className="px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <span>Open Machine Marshall Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">CX3 Inventory</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">40 Units</div>
              <span className="text-[10px] text-slate-400">Ages 7–9 (Class C &amp; B)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">CX5 Inventory</span>
              <div className="text-2xl font-black text-cyan-400 font-mono mt-1">40 Units</div>
              <span className="text-[10px] text-slate-400">Ages 10–12 (Class C &amp; B)</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Impound Separation</span>
              <div className="text-base font-black text-white font-mono mt-1">ISOLATED BY DEFAULT</div>
              <span className="text-[10px] text-emerald-400">Machines separated from humans</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Pre-Staging Dispatch</span>
              <div className="text-base font-black text-amber-400 font-mono mt-1">10 MIN PRIOR ALERT</div>
              <span className="text-[10px] text-slate-400">Parent retrieval escort call</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PACKAGE 4: GO RACE™ (STANDALONE OPERATIONS & RESERVATION SYSTEM)
         ========================================================================= */}
      {(currentPackage === 'go-race' || currentPackage === 'unified') && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shadow-lg">
                🏢
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-mono">
                    STANDALONE PRODUCT
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">MODEL: GO-RACE-OPS</span>
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">
                  GO RACE™ — Arena Operations &amp; Reservation Desk System
                </h2>
                <p className="text-xs text-slate-400">
                  Track Director command deck, 10-minute heat timers, 3-minute intervals, 60-day advance booking window, and 7-day payment settlement protocol.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onSwitchTerminal('director')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md"
              >
                Track Director Tower
              </button>
              <button
                type="button"
                onClick={() => onSwitchTerminal('registration')}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md"
              >
                Registration Intake
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Scheduled Block Fee</span>
              <div className="text-2xl font-black text-white font-mono mt-1">$65</div>
              <span className="text-[10px] text-slate-400">Per 10-min heat block</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Same-Day Walk-In</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-1">$85</div>
              <span className="text-[10px] text-slate-400">On-site counter registration</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Annual Membership</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-1">$200/yr</div>
              <span className="text-[10px] text-slate-400">Unlocks $40/block member rate</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Payment Settlement</span>
              <div className="text-base font-black text-cyan-400 font-mono mt-1">7-DAY PROTOCOL</div>
              <span className="text-[10px] text-slate-400">Zero-down placeholder, charged at 7d</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PACKAGE 5: GO ACADEMY™ (RIDER SKILL & PROMOTION DECK)
         ========================================================================= */}
      {(currentPackage === 'go-academy' || currentPackage === 'unified') && (
        <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-xl shadow-lg">
                🎓
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-500 text-slate-950 font-mono">
                    STANDALONE PRODUCT
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">MODEL: GO-ACADEMY-SKILL</span>
                </div>
                <h2 className="text-xl font-black text-white mt-0.5">
                  GO ACADEMY™ — Rider Training, Eligibility &amp; Skill Progression
                </h2>
                <p className="text-xs text-slate-400">
                  Class C electric bicycle proficiency qualification verification, and Track Director formal skill progression promotions to Class B with parent authorization.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Class C Rider Eligibility Ground Truth
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                Proficient use of an electric bicycle qualifies a participant to register and compete in <strong>Class C (Novice)</strong>. Riders demonstrate:
              </p>
              <ul className="list-disc list-inside text-slate-400 space-y-1 font-mono text-[11px]">
                <li>Two-wheel dynamic balance on indoor surface</li>
                <li>Electric throttle control &amp; modulation</li>
                <li>Front/rear brake modulation and stopping distance control</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                Formal Rider Promotion Policy
              </h4>
              <p className="text-slate-300 leading-relaxed text-xs">
                Riders who demonstrate proficient motocross skills on track shall be promoted to the higher classification (<strong>Class C to Class B</strong>).
              </p>
              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px]">
                <strong>Governance Rule:</strong> Promotion is formally directed by the Track Director with verified parental consent logged in the system.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
