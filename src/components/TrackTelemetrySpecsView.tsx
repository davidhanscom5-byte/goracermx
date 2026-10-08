import React, { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Activity,
  Droplets,
  Flame,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  DoorOpen,
  Box,
  Compass,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
} from 'lucide-react';

export const TrackTelemetrySpecsView: React.FC = () => {
  // Live simulated hardware states for the 20 specifications
  const [hydrationActive, setHydrationActive] = useState(false);
  const [cautionLighting, setCautionLighting] = useState<'normal' | 'full_caution' | 'emergency'>('normal');
  const [trafficSignal, setTrafficSignal] = useState<'red' | 'yellow' | 'green'>('red');
  const [gateDropped, setGateDropped] = useState(false);
  const [groundResistance, setGroundResistance] = useState(0.04); // <0.10 Ohm required
  const [finishLoopVoltage, setFinishLoopVoltage] = useState(0.0); // 0.0V Line voltage on track floor
  const [finishBatteryPercent, setFinishBatteryPercent] = useState(98);
  const [preActionStatus, setPreActionStatus] = useState<'armed' | 'holding' | 'discharged'>('armed');

  const handleSimulateGateSequence = () => {
    // Traffic signal: Red by default, yellow 10s before drop, green is go
    setTrafficSignal('yellow');
    setGateDropped(false);
    setTimeout(() => {
      setTrafficSignal('green');
      setGateDropped(true);
      setTimeout(() => {
        setTrafficSignal('red');
        setGateDropped(false);
      }, 5000);
    }, 2500);
  };

  const TRACK_RULES_20 = [
    {
      num: 1,
      title: '10-Foot Wide Lanes',
      desc: 'All course lanes are precisely calibrated to 10-foot width for youth e-moto passing safety and containment.',
      status: 'VERIFIED',
      tag: 'Track Geometry',
      icon: Layers,
    },
    {
      num: 2,
      title: 'Whoop Sections Banned',
      desc: 'High-risk rhythmic whoop sections are strictly prohibited to prevent pediatric spinal and endo compression risks.',
      status: 'ENFORCED',
      tag: 'Youth Safety',
      icon: ShieldAlert,
    },
    {
      num: 3,
      title: 'Sub-Surface Hydration System',
      desc: 'Automated underground manifold maintains optimal dirt loam moisture without surface puddling or dust clouds.',
      status: hydrationActive ? 'PUMP ACTIVE' : 'OPTIMAL LOAM',
      tag: 'Track Surface',
      icon: Droplets,
      action: () => setHydrationActive(!hydrationActive),
      actionLabel: hydrationActive ? 'Pause Pump' : 'Pulse Sub-Hydration',
    },
    {
      num: 4,
      title: 'Full Duty Track Marshall',
      desc: 'Dedicated on-track marshal in radio contact with race control, positioned for instantaneous flag and sector response.',
      status: 'STATIONED (SECTOR 1-4)',
      tag: 'Personnel',
      icon: ShieldCheck,
    },
    {
      num: 5,
      title: 'Full Duty Medical Professional',
      desc: 'Certified pediatric sports trauma/EMT stationed in track-side medical bay during all live engine/battery heats.',
      status: 'STATIONED AT PADDOCK MED',
      tag: 'Personnel',
      icon: Activity,
    },
    {
      num: 6,
      title: 'No Double or Triple Jumps',
      desc: 'Tabletops and step-downs only; high-amplitude doubles and triples strictly excluded from course architecture.',
      status: 'COMPLIANT',
      tag: 'Track Geometry',
      icon: Box,
    },
    {
      num: 7,
      title: '10-Foot Emergency Exits (Both Ends)',
      desc: 'Direct unencumbered 10-foot egress corridors at north and south track terminals for rapid paramedic access.',
      status: 'CLEAR & ARMED',
      tag: 'Emergency Egress',
      icon: DoorOpen,
    },
    {
      num: 8,
      title: 'Full Course Caution Lighting',
      desc: 'Synchronized LED caution halo surrounding track footprint, triggerable within 50ms from flag terminal.',
      status: cautionLighting === 'normal' ? 'GREEN CIRCUIT' : 'FULL CAUTION FLASH',
      tag: 'Track Electronics',
      icon: Lightbulb,
      action: () => setCautionLighting(cautionLighting === 'normal' ? 'full_caution' : 'normal'),
      actionLabel: cautionLighting === 'normal' ? 'Simulate Caution' : 'Clear Caution',
    },
    {
      num: 9,
      title: 'Non-Blinding Arena Lighting',
      desc: 'High-CRI indirect diffused LED luminaire arrays; zero direct line-of-sight glare into rider eyes over jump crests.',
      status: '420 LUX DIFFUSED',
      tag: 'Illumination',
      icon: Lightbulb,
    },
    {
      num: 10,
      title: '20-Rider Gate (Outside Track Footprint)',
      desc: 'Mechanical starting gate isolated outside riding lane footprint to eliminate pinch points and staging hazards.',
      status: '20-DROP READY',
      tag: 'Go Gate™',
      icon: Cpu,
    },
    {
      num: 11,
      title: 'Loading & Exit Chutes at Opposite Ends',
      desc: 'One-way physical flow: Riders enter via north staging chute and exit through south recovery paddock chute.',
      status: 'FLOW ENFORCED',
      tag: 'Traffic Flow',
      icon: ArrowRight,
    },
    {
      num: 12,
      title: '4-Foot Buffer with 16" Tuff Blocks',
      desc: '4-foot neutral buffer zone separating opposing lanes, equipped with 16" height high-density energy-absorbing tuff blocks.',
      status: 'BUFFER SECURED',
      tag: 'Containment',
      icon: Box,
    },
    {
      num: 13,
      title: 'Passive RFID Reader at Gate Entrance',
      desc: 'Multi-directional passive UHF RFID antenna verifies rider wristband & bike frame tag prior to gate entry.',
      status: 'PASSIVE UHF SCANNING',
      tag: 'Telemetry',
      icon: Radio,
    },
    {
      num: 14,
      title: 'Battery-Powered RFID Finish (0V on Dirt)',
      desc: 'Autonomous 24V DC battery powered loop receiver at finish line. Zero 120V/240V line voltage allowed on dirt floor.',
      status: `${finishBatteryPercent}% BATTERY (0.0V LINE)`,
      tag: 'Go Win™',
      icon: Zap,
    },
    {
      num: 15,
      title: 'Redundant Electrical Grounding',
      desc: 'Dual continuous earthing loop monitored across all metal structures, timing bridges, and gates (<0.10Ω standard).',
      status: `${groundResistance.toFixed(2)} Ω (GROUND SECURE)`,
      tag: 'Electrical Safety',
      icon: CheckCircle2,
    },
    {
      num: 16,
      title: 'Pre-Action Fire Protection System',
      desc: 'Two-stage pre-action dry pipe system within arena footprint prevents accidental discharge over lithium-ion assets.',
      status: preActionStatus.toUpperCase(),
      tag: 'Facility Fire Safety',
      icon: Flame,
    },
    {
      num: 17,
      title: 'Flexible Visual Landing Slope Markers',
      desc: 'Rigid vertical black-and-white visual poles strictly banned. Dual flexible contrast target landing markers deployed.',
      status: 'NON-RIGID EQUIPPED',
      tag: 'Jump Landings',
      icon: Compass,
    },
    {
      num: 18,
      title: 'Gate Drop Height Calibration (1"–2" Above Axle)',
      desc: 'Drop gate bar height calibrated precisely between 1.0" and 2.0" above Cobra CX3/CX5 10"/12" front axle centerlines.',
      status: '1.45" ABOVE AXLE (CALIBRATED)',
      tag: 'Go Gate™',
      icon: Sliders,
    },
    {
      num: 19,
      title: 'Flush Surface Drop Gate',
      desc: 'When gate drops, drop bar and linkages recess flush with dirt/pad plate to prevent front wheel deflections or casing.',
      status: gateDropped ? 'FLUSH LOWERED (0.0" GRADE)' : 'UPRIGHT (STAGED)',
      tag: 'Go Gate™',
      icon: CheckCircle2,
    },
    {
      num: 20,
      title: 'Dual Starting Traffic Signals (20ft Out / 10ft Up)',
      desc: 'Two traffic signal light arrays located 20 feet ahead & 10 feet above grade. Red default -> Yellow (T-10s) -> Green (Gate Drop).',
      status: `SIGNAL: ${trafficSignal.toUpperCase()}`,
      tag: 'Go Gate™ Signal',
      icon: Lightbulb,
      action: handleSimulateGateSequence,
      actionLabel: 'Test Signal Sequence',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#00F0FF] text-slate-950 font-mono shadow-sm">
                RULEBOOK COMPLIANCE ENGINE
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono shadow-sm">
                20 OF 20 SPECIFICATIONS ACTIVE
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>🏟️</span> Track Safety &amp; Telemetry Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Live operational monitoring for the 20 mandatory indoor youth motocross engineering standards governing the Go Moto™ Arena, Go Gate™, and Go Win™ hardware footprint.
            </p>
          </div>

          {/* Quick Hardware Test Cockpit */}
          <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl flex flex-col gap-2 min-w-[240px]">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              Gate &amp; Traffic Light Cockpit (Rule #20)
            </span>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <span className={`w-3.5 h-3.5 rounded-full ${trafficSignal === 'red' ? 'bg-red-500 shadow-md shadow-red-500/50 animate-pulse' : 'bg-red-950 border border-red-800'}`}></span>
                <span className={`w-3.5 h-3.5 rounded-full ${trafficSignal === 'yellow' ? 'bg-amber-400 shadow-md shadow-amber-400/50 animate-pulse' : 'bg-amber-950 border border-amber-800'}`}></span>
                <span className={`w-3.5 h-3.5 rounded-full ${trafficSignal === 'green' ? 'bg-emerald-400 shadow-md shadow-emerald-400/50 animate-pulse' : 'bg-emerald-950 border border-emerald-800'}`}></span>
              </div>
              <button
                type="button"
                onClick={handleSimulateGateSequence}
                className="px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 text-[11px] font-bold uppercase tracking-wider hover:bg-cyan-300 transition-colors shadow-sm"
              >
                Drop Test
              </button>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Gate Drop State: {gateDropped ? 'FLUSH LOWERED (0.0")' : 'UPRIGHT (STAGED)'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid of 20 Track Rule Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TRACK_RULES_20.map((rule) => {
          const Icon = rule.icon;
          return (
            <div
              key={rule.num}
              className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                      #{rule.num}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {rule.tag}
                    </span>
                  </div>
                  <Icon className="w-4 h-4 text-cyan-400/70 group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-sm font-bold text-white mb-1.5">
                  {rule.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {rule.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {rule.status}
                </span>

                {rule.action && (
                  <button
                    type="button"
                    onClick={rule.action}
                    className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono border border-slate-700 transition-colors"
                  >
                    {rule.actionLabel}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
