import React, { useState } from 'react';
import {
  Cpu,
  Zap,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Radio,
  ShieldCheck,
  Layers,
  ArrowRight,
  Download,
  PhoneCall,
  Activity,
  Award,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Gauge
} from 'lucide-react';

interface GateModel {
  id: string;
  name: string;
  tagline: string;
  gates: number;
  width: string;
  weight: string;
  powerSystem: string;
  triggerSystem: string;
  price: string;
  leadTime: string;
  description: string;
  features: string[];
  specs: {
    dropTime: string;
    dropHeight: string;
    flushTolerance: string;
    power: string;
    grounding: string;
    controlLink: string;
  };
}

export const GoGateProductShowcase: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('gate-20');
  const [activeTab, setActiveTab] = useState<'models' | 'interactive' | 'specs' | 'quote'>('models');

  // Interactive drop simulator state
  const [simState, setSimState] = useState<'staged' | 'yellow_alert' | 'dropped'>('staged');
  const [dropSpeedMs, setDropSpeedMs] = useState<number>(38); // 38 milliseconds drop
  const [isSimulating, setIsSimulating] = useState(false);

  // Quote form state
  const [quoteModel, setQuoteModel] = useState('Go Gate™ 20 Pro Arena');
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    name: '',
    email: '',
    phone: '',
    facilityName: '',
    trackType: 'Indoor Arenacross',
    gateCount: '20',
    notes: '',
  });

  const GATE_MODELS: GateModel[] = [
    {
      id: 'gate-20',
      name: 'Go Gate™ 20 Pro Arena',
      tagline: 'Championship 20-Rider Outside-Footprint Starting Grid',
      gates: 20,
      width: '84 ft total span (Modular 4-gate bay sections)',
      weight: '1,420 lbs (Hardened T6 6061 Aluminum & Steel Cam Links)',
      powerSystem: 'Autonomous 24V DC Industrial High-Torque Solenoid Banks',
      triggerSystem: 'Encrypted UHF Wireless Remote + Dual 20ft Overhead Traffic Signal Sync',
      price: '$18,500 Complete Arena Package',
      leadTime: '2–3 Weeks Built-to-Order',
      description: 'Engineered specifically for indoor electric arenas and youth sanctioning bodies. Built to meet Rule #10, #18, #19, and #20: mounts outside the riding lane footprint, drops 100% flush into pad recess (0.0" tire deflection), and holds drop bar 1"–2" above youth front axle height.',
      features: [
        'Complies with Track Rule #10: 20-rider drop located outside track lane boundary',
        'Complies with Rule #18: Height calibrated precisely 1"–2" above front axle',
        'Complies with Rule #19: True zero-grade flush surface drop plate',
        'Complies with Rule #20: Dual signal lights 20ft ahead & 10ft elevated with automated 10-second yellow warning',
        'Redundant dual-grounding lugs (<0.04 Ohm certified loop)',
        'Integrated passive UHF RFID staging antenna integration ports',
      ],
      specs: {
        dropTime: '38 ms (Instantaneous magnetic shear release)',
        dropHeight: '1.45" calibrated over Cobra CX3/CX5 10"/12" axles',
        flushTolerance: '±0.00" dead-flat with deck rubber seal',
        power: '24V DC battery-backed capacitor discharge bank',
        grounding: 'Dual brass 4AWG grounding lugs',
        controlLink: '900MHz FHSS encrypted wireless + hardwired RS-485',
      },
    },
    {
      id: 'gate-10',
      name: 'Go Gate™ 10 Sprint Bay',
      tagline: 'Compact 10-Rider Training & Local Track Starting System',
      gates: 10,
      width: '42 ft total span (2 modular sections)',
      weight: '720 lbs',
      powerSystem: '24V DC High-Speed Solenoid with Portable LiFePO4 Power Station',
      triggerSystem: 'Wireless Key fob + Single 10ft Overhead Traffic Signal Bar',
      price: '$9,850 Complete System',
      leadTime: 'In Stock / Ships 5 Days',
      description: 'Ideal for regional youth training facilities, e-moto clubs, and split-gate heat formats. Rapid bolt-together modular design allows two technicians to position and level the entire 10-gate grid in under 45 minutes.',
      features: [
        'Modular 2-piece frame for rapid seasonal or transport relocation',
        'Axle-height drop plate compatible with 50cc / CX3 / CX5 youth bikes',
        'Includes portable 10ft elevated signal pole with red/yellow/green LED heads',
        'Integrated drop-delay randomizer (1.5s to 4.2s drop window)',
        'Zero line voltage on dirt requirement compatible (100% 24V DC safe)',
      ],
      specs: {
        dropTime: '42 ms',
        dropHeight: '1.50" adjustable (0.75" to 2.25")',
        flushTolerance: '±0.05" recessed track plate',
        power: '24V DC internal battery (350 drops per charge)',
        grounding: 'Single continuous bonding strap + grounding rod',
        controlLink: 'Wireless remote (300 ft line-of-sight range)',
      },
    },
    {
      id: 'gate-4',
      name: 'Go Gate™ 4 Youth Academy Bay',
      tagline: '4-Rider Reaction Trainer & Holeshot Practice System',
      gates: 4,
      width: '18 ft total width',
      weight: '310 lbs (Castor wheel transport equipped)',
      powerSystem: '12V/24V Dual-Voltage Portable Lithium Battery Pack',
      triggerSystem: 'Bluetooth Smartphone App + Handheld Pushbutton + Mini Traffic Pod',
      price: '$4,400',
      leadTime: 'In Stock / Ready to Ship',
      description: 'The ultimate reaction time training tool for youth motocross academies, team private tracks, and pit areas. Features microsecond reaction sensors to measure rider gate reaction and throttle pull delay.',
      features: [
        'Integrated reaction timing timer with digital thousandths display',
        'Smartphone app telemetry showing reaction time history per rider',
        'Fold-up heavy-duty caster wheels for one-person movement',
        'Cuts out premature gate jumps with anti-cheat sensor lockout',
      ],
      specs: {
        dropTime: '35 ms ultra-fast drop',
        dropHeight: '1.25" calibrated youth bar height',
        flushTolerance: 'Flat rubber transition ramp included',
        power: 'Rechargeable 18V/24V power tool battery compatible',
        grounding: 'Bonded chassis ground',
        controlLink: 'BLE 5.2 + Handheld 30ft umbilical trigger',
      },
    },
    {
      id: 'gate-signal-system',
      name: 'Go Gate™ Rule #20 Traffic Signal Tower Array',
      tagline: 'Standalone Overhead Dual-Light Signal Rigging Architecture',
      gates: 0,
      width: 'Dual 10ft elevated stanchions (20ft ahead of gate line)',
      weight: '185 lbs per stanchion (Weighted base or concrete anchor)',
      powerSystem: '24V DC / PoE Industrial Low-Voltage Supply',
      triggerSystem: 'Automated Microcontroller Sync with Gate Drop Solenoid',
      price: '$3,200 (Pair of Towers + Controller)',
      leadTime: '1 Week',
      description: 'Spec-engineered to satisfy Track Specification Rule #20: Two 3-aspect high-brightness traffic signal fixtures positioned exactly 20 feet ahead of the starting gate and 10 feet above track grade. Automated logic maintains Red by default, engages Yellow warning precisely 10 seconds before gate drop, and flashes Green upon mechanical gate shear.',
      features: [
        'Exceeds Rule #20 exact geometry: 20ft down-track, 10ft elevated',
        'Ultra-high CRI non-blinding diffused LED clusters (Rule #9)',
        'Built-in audio chime & countdown beacon option',
        'Syncs with any existing mechanical or electromagnetic starting gate',
      ],
      specs: {
        dropTime: 'Zero latency solid-state relay trigger',
        dropHeight: '10\' 0" optic focal centerline above grade',
        flushTolerance: 'N/A (Overhead rigging)',
        power: '24V DC safe low-voltage (0.0V Line voltage on dirt)',
        grounding: 'Redundant copper bonding braid',
        controlLink: 'Sync umbilical to Go Gate Master Hub',
      },
    },
  ];

  const activeProduct = GATE_MODELS.find((m) => m.id === selectedModel) || GATE_MODELS[0];

  const runDropSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimState('yellow_alert');

    // Yellow for 2.5s in demo (represents 10s rule)
    setTimeout(() => {
      setSimState('dropped');
      setIsSimulating(false);
      setTimeout(() => {
        setSimState('staged');
      }, 4000);
    }, 2500);
  };

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setTimeout(() => {
      // In production syncs with Supabase/CRM
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Hero Product Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black tracking-widest uppercase font-mono shadow-md">
                GO GATE™ COMMERCIAL HARDWARE
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-bold uppercase tracking-wider font-mono border border-cyan-500/30">
                PRO INDOOR STARTING SYSTEMS
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono border border-emerald-500/40">
                MEETS 20 TRACK ENGINEERING SPECS
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              Go Gate™ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Starting Systems</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
              Industrial-grade youth &amp; pro electric motocross starting gates. Engineered for rapid mechanical drop speed (38ms), zero-grade flush surface drop bars, 10-foot elevated traffic signal integration, and 100% low-voltage autonomous 24V DC dirt floor operation.
            </p>

            <div className="flex items-center gap-3 mt-6 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('interactive')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                <Gauge className="w-4 h-4" />
                <span>Simulate Gate Drop</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('quote')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 font-bold text-xs uppercase tracking-wider border border-cyan-500/40 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Request Facility Quote</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('specs')}
                className="px-5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                Rule #10, #18, #19, #20 Compliance Specs
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="grid grid-cols-2 gap-3 min-w-[280px] bg-slate-900/90 border border-slate-800 p-4 rounded-2xl backdrop-blur-sm">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Drop Velocity</div>
              <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">38 ms</div>
              <div className="text-[9px] text-emerald-400 font-mono">Zero Hinge Bind</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Bar Profile</div>
              <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">0.00"</div>
              <div className="text-[9px] text-emerald-400 font-mono">Flush Drop (Rule #19)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Axle Elevation</div>
              <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">+1.45"</div>
              <div className="text-[9px] text-emerald-400 font-mono">1"–2" Calibrated (Rule #18)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Line Voltage</div>
              <div className="text-xl font-black text-cyan-400 font-mono mt-0.5">0.0 V</div>
              <div className="text-[9px] text-emerald-400 font-mono">24V DC Safe (Rule #14)</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-8 pt-4 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'models', label: 'Product Catalog & Models', icon: Layers },
            { id: 'interactive', label: 'Interactive Gate & Signal Cockpit', icon: Gauge },
            { id: 'specs', label: 'Rulebook Engineering Specs', icon: ShieldCheck },
            { id: 'quote', label: 'Facility RFQ / Custom Order', icon: PhoneCall },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: PRODUCT CATALOG */}
      {activeTab === 'models' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>🏁</span> Go Gate™ Hardware Models
              </h2>
              <p className="text-xs text-slate-400">
                Choose the gate configuration tailored for your arena length, heat sizes, and rider capacity.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 overflow-x-auto">
              {GATE_MODELS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModel(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap ${
                    selectedModel === m.id
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {m.name.replace('Go Gate™ ', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Active Product Deep Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Product Details */}
            <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                    {activeProduct.gates > 0 ? `${activeProduct.gates}-RIDER CAPACITY` : 'OVERHEAD SIGNAL COMPONENT'}
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight mt-0.5">
                    {activeProduct.name}
                  </h3>
                  <p className="text-xs text-cyan-300/80 font-mono mt-0.5">
                    {activeProduct.tagline}
                  </p>
                </div>
                <div className="text-left sm:text-right bg-slate-950/80 border border-slate-800 p-3 rounded-2xl">
                  <div className="text-lg font-black text-white font-mono">{activeProduct.price}</div>
                  <div className="text-[10px] text-emerald-400 font-mono">Lead Time: {activeProduct.leadTime}</div>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeProduct.description}
              </p>

              <div>
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Key Engineering Features
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeProduct.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl flex items-start gap-2.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setQuoteModel(activeProduct.name);
                    setActiveTab('quote');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 font-mono shadow-md shadow-cyan-400/20"
                >
                  <span>Order / Configure {activeProduct.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('interactive')}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all font-mono"
                >
                  Test Drop Speed
                </button>
              </div>
            </div>

            {/* Right Col: Technical Specifications Sheet */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    Technical Spec Sheet
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                    FACTORY OEM
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Drop Release Speed</span>
                    <span className="font-bold text-white font-mono">{activeProduct.specs.dropTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Drop Bar Height</span>
                    <span className="font-bold text-cyan-300 font-mono">{activeProduct.specs.dropHeight}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Flush Recess Tolerance</span>
                    <span className="font-bold text-white font-mono">{activeProduct.specs.flushTolerance}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Power Requirements</span>
                    <span className="font-bold text-white font-mono">{activeProduct.specs.power}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Electrical Grounding</span>
                    <span className="font-bold text-emerald-400 font-mono">{activeProduct.specs.grounding}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Telemetry &amp; Trigger Link</span>
                    <span className="font-bold text-slate-300 font-mono">{activeProduct.specs.controlLink}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Frame Structure Span</span>
                    <span className="font-bold text-slate-300 font-mono">{activeProduct.width}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-center">
                <span className="text-[11px] font-mono text-cyan-300 block mb-1">
                  Need custom pit dimensions or concrete pit box inserts?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteModel(activeProduct.name + ' (Custom Dimension)');
                    setActiveTab('quote');
                  }}
                  className="text-xs text-white font-bold underline hover:text-cyan-300"
                >
                  Contact Engineering Team &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE GATE & SIGNAL COCKPIT */}
      {activeTab === 'interactive' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  REAL-TIME SIMULATOR
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                  <span>🚦</span> Rule #20 Traffic Signal &amp; Gate Drop Simulator
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                  Test the exact starting cadence specified in Rule #20: Lights remain Red by default; at exactly T-10 seconds before gate drop, the Yellow aspect illuminates; Green illuminates simultaneously with the physical gate shear release.
                </p>
              </div>

              <button
                type="button"
                onClick={runDropSimulation}
                disabled={isSimulating}
                className={`px-6 py-3 rounded-2xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg ${
                  isSimulating
                    ? 'bg-amber-400 text-slate-950 animate-pulse'
                    : 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:brightness-110 shadow-emerald-500/20'
                }`}
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sequence Active...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Initiate Gate Drop Sequence</span>
                  </>
                )}
              </button>
            </div>

            {/* Interactive Physical Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-slate-950 border border-slate-800 p-6 rounded-2xl">
              {/* Left: Overhead Traffic Signal Tower */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800 rounded-xl relative">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase mb-4 text-center">
                  Rule #20 Dual Overhead Signal Pod<br />
                  <span className="text-[10px] text-slate-400">(20 ft Ahead • 10 ft Above Grade)</span>
                </div>

                {/* Simulated Signal Head Housing */}
                <div className="w-28 bg-slate-950 border-4 border-slate-800 rounded-3xl p-4 flex flex-col items-center gap-4 shadow-2xl">
                  {/* RED */}
                  <div
                    className={`w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center ${
                      simState === 'staged'
                        ? 'bg-red-500 border-red-300 shadow-[0_0_25px_rgba(239,68,68,0.9)] animate-pulse'
                        : 'bg-red-950/40 border-red-900/50'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-white uppercase">RED</span>
                  </div>

                  {/* YELLOW */}
                  <div
                    className={`w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center ${
                      simState === 'yellow_alert'
                        ? 'bg-amber-400 border-amber-200 shadow-[0_0_35px_rgba(251,191,36,1)] animate-ping'
                        : 'bg-amber-950/40 border-amber-900/50'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-slate-950 uppercase">T-10s</span>
                  </div>

                  {/* GREEN */}
                  <div
                    className={`w-16 h-16 rounded-full border-2 transition-all flex items-center justify-center ${
                      simState === 'dropped'
                        ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_40px_rgba(52,211,153,1)]'
                        : 'bg-emerald-950/40 border-emerald-900/50'
                    }`}
                  >
                    <span className="text-[9px] font-mono font-bold text-slate-950 uppercase">GO!</span>
                  </div>
                </div>

                <div className="mt-4 text-center font-mono text-xs">
                  {simState === 'staged' && <span className="text-red-400 font-bold">STATE: STAGED (GATE UPRIGHT)</span>}
                  {simState === 'yellow_alert' && <span className="text-amber-300 font-bold animate-pulse">STATE: T-10S WARNING ACTIVE</span>}
                  {simState === 'dropped' && <span className="text-emerald-400 font-bold">STATE: GATE DROPPED FLUSH (GO!)</span>}
                </div>
              </div>

              {/* Right: Mechanical Starting Gate Bar Visualizer */}
              <div className="flex flex-col items-center justify-center p-6 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="text-[11px] font-mono text-cyan-400 font-bold uppercase mb-4 text-center">
                  Rule #18 &amp; #19 Mechanical Drop Bar<br />
                  <span className="text-[10px] text-slate-400">(1"–2" Axle Height &bull; Flush Surface Drop)</span>
                </div>

                {/* Gate Hinge Graphic */}
                <div className="w-full max-w-sm h-48 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden flex flex-col justify-end p-4">
                  {/* Dirt Grade Baseline */}
                  <div className="w-full h-10 bg-amber-950/40 border-t-2 border-amber-600/40 flex items-center justify-between px-3 text-[10px] font-mono text-amber-500/80">
                    <span>TRACK DIRT GRADE (0.0")</span>
                    <span>FLUSH RECESS TRAY</span>
                  </div>

                  {/* Physical Drop Bar Simulation */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 transition-all duration-150 rounded-t-lg border-2 ${
                      simState === 'dropped'
                        ? 'bottom-2 w-48 h-3 bg-emerald-500/80 border-emerald-300 shadow-md'
                        : 'bottom-10 w-48 h-16 bg-cyan-500/90 border-cyan-200 shadow-xl'
                    }`}
                  >
                    <div className="w-full text-center text-[9px] font-mono font-bold text-slate-950 py-0.5">
                      {simState === 'dropped' ? 'FLUSH LOWERED (0.0")' : 'UPRIGHT (1.45" ABOVE AXLE)'}
                    </div>
                  </div>

                  {/* Youth Bike Wheel Reference */}
                  <div className="absolute right-6 bottom-8 w-16 h-16 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center text-[8px] font-mono text-slate-500">
                    10" Wheel
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 w-full max-w-sm font-mono text-[11px]">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">MEASURED DROP SPEED</span>
                    <span className="font-bold text-cyan-400">{dropSpeedMs} ms</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">SOLENOID VOLTAGE</span>
                    <span className="font-bold text-emerald-400">24.1 V DC (Isolated)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RULEBOOK SPECS & STANDARDS */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          {/* Kinematic Safety Separation: Hold/Release vs Lift vs Height Adjustment */}
          <div className="bg-slate-900/95 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest block">
                    INHERENT SAFETY ARCHITECTURE
                  </span>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    Separated 3-Subsystem Mechanical Kinematics
                  </h3>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30 font-bold">
                DEDICATED HOLD/RELEASE &bull; DEDICATED MOTORS
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Consolidating the lift motor with the hold-and-release frame sacrifices the <strong>inherent fail-safe safety</strong> of a true competition gate. If a shared drive binds, skips a tooth, or experiences a voltage drop, the gate can hang or drop unpredictably. Go Gate™ physically separates the machine into <strong>three decoupled subsystems</strong>:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs pt-1">
              {/* Subsystem 1: Dedicated Primary Electromagnetic Hold */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-bold text-xs uppercase">Subsystem 01</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">PRIMARY HOLD (38ms)</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase">Primary Fast-Release Hold</h4>
                <p className="text-slate-400 text-[11px] leading-snug">
                  Dual high-flux electromagnetic shear latches hold the drop bar at ready. When de-energized, gravity and mechanical torsion springs produce a clean <strong>38ms drop</strong> with zero motor drag or backdrive resistance.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-bold">
                  &bull; Fail-Safe Instant Drop on Power Loss
                </div>
              </div>

              {/* Subsystem 2: Independent Lift Motor & Dual Mechanical Positive Hold */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-cyan-400 font-bold text-xs uppercase">Subsystem 02</span>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">DUAL MECHANICAL BACKUP</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase">Independent Lift &amp; Secondary Hold</h4>
                <p className="text-slate-400 text-[11px] leading-snug">
                  A dedicated 24V gearmotor resets the gates. Crucially, this separated geometry allows <strong>dual mechanical locking systems</strong>: the lift arm can remain locked under the frame as a secondary positive mechanical safety stop during gate maintenance, track grooming, or red-flag holds!
                </p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-cyan-400 font-bold">
                  &bull; Redundant Positive Safety Interlock
                </div>
              </div>

              {/* Subsystem 3: Independent Height Adjustment Motor */}
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-xs uppercase">Subsystem 03</span>
                  <span className="text-[9px] bg-amber-400/10 text-amber-400 px-2 py-0.5 rounded border border-amber-400/30">RULE #18 CALIBRATION</span>
                </div>
                <h4 className="text-sm font-bold text-white uppercase">Independent Height Adjuster</h4>
                <p className="text-slate-400 text-[11px] leading-snug">
                  A dedicated precision lead-screw actuator adjusts the base pivot datum height (+1" to +2" above axle height) to swap between <strong>Cobra CX3 (10" wheel)</strong> and <strong>Cobra CX5 (12" wheel)</strong> heights without altering the drop velocity or latch tolerances.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-amber-400 font-bold">
                  &bull; Independent Axle Datum Calibration
                </div>
              </div>
            </div>
          </div>
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2 mb-2">
              <span>📐</span> Go Gate™ Engineering Compliance Matrix
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl mb-6">
              Every Go Gate™ starting system is built to the precise youth indoor motocross safety requirements established by the Track Director and USA E MOTO sanctioning guidelines.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                    #10
                  </span>
                  <h4 className="text-sm font-bold text-white">Outside Track Footprint Staging</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The entire 20-rider gate mechanism and starting pad are structurally located outside the live riding lane perimeter. This eliminates chicane pinch points, staging congestion, and rider hazards during active session laps.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>100% Structural Isolation Verified</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                    #18
                  </span>
                  <h4 className="text-sm font-bold text-white">1"–2" Axle Height Calibration</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Starting gate drop bar shall not be higher than 2" above and not lower than 1" above the front axle height of Cobra Moto CX3 (10" front wheel) and CX5 (12" front wheel) machines. Prevents front-wheel hop or early gate overriding.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Factory Preset to 1.45" Median Height</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                    #19
                  </span>
                  <h4 className="text-sm font-bold text-white">Zero-Grade Surface Flush Drop</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When released, the drop bar lays dead-flat flush with the dirt surface into a recessed guide plate. Zero lip or edge protrudes above grade, eliminating front tire deflection, rim casing, or handlebar twist.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>True 0.0" Surface Recess Tolerance</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center">
                    #20
                  </span>
                  <h4 className="text-sm font-bold text-white">Dual Overhead Traffic Signal Array</h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Two synchronized signal arrays positioned 20 feet in front of the gate line and 10 feet above track grade. Default Red $\rightarrow$ Yellow at T-10 seconds $\rightarrow$ Green on gate shear. Eliminates starter flag misinterpretations.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dual Rigging Towers with Automated Logic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* TAB 4: FACILITY QUOTE / RFQ FORM */}
      {activeTab === 'quote' && (
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 inline-block mb-2">
              COMMERCIAL INQUIRY &amp; CUSTOM SIZING
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Request a Go Gate™ Quotation
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Direct factory procurement for indoor electric motocross arenas, practice tracks, and racing organizations.
            </p>
          </div>

          {quoteSubmitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Quotation Request Received!</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you! Our Go Gate™ track engineering team will review your facility specifications for <span className="text-cyan-300 font-bold">{quoteModel}</span> and provide a detailed blueprint and delivery estimate within 24 business hours.
              </p>
              <button
                type="button"
                onClick={() => setQuoteSubmitted(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    placeholder="David Hanscom"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={quoteForm.email}
                    onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                    placeholder="dave@trackfacility.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    placeholder="(555) 019-2834"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Facility / Track Name</label>
                  <input
                    type="text"
                    value={quoteForm.facilityName}
                    onChange={(e) => setQuoteForm({ ...quoteForm, facilityName: e.target.value })}
                    placeholder="Go Moto Arena #1"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Select Gate Model</label>
                  <select
                    value={quoteModel}
                    onChange={(e) => setQuoteModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  >
                    {GATE_MODELS.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.price})
                      </option>
                    ))}
                    <option value="Custom Multi-Bay Solution">Custom Multi-Bay Solution</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Facility Type</label>
                  <select
                    value={quoteForm.trackType}
                    onChange={(e) => setQuoteForm({ ...quoteForm, trackType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none font-mono"
                  >
                    <option value="Indoor Arenacross">Indoor Arenacross / Supercross</option>
                    <option value="Outdoor Motocross Track">Outdoor Motocross Track</option>
                    <option value="Private Training Academy">Private Youth Training Academy</option>
                    <option value="Sanctioned Racing Series">Sanctioned Racing Series</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Installation Notes &amp; Target Timeline</label>
                <textarea
                  rows={3}
                  value={quoteForm.notes}
                  onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                  placeholder="Need 20-rider gate with Rule #20 dual overhead signal towers installed for upcoming winter indoor season..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-cyan-400 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all font-mono shadow-xl shadow-cyan-500/20"
              >
                Submit Commercial Quotation Request
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
