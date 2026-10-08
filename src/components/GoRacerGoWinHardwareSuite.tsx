import React, { useState } from 'react';
import {
  Zap,
  Radio,
  Cpu,
  Trophy,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  PhoneCall,
  Sliders,
  Sparkles,
  Download,
  Flame,
  Award,
  Activity,
  FileText
} from 'lucide-react';

interface CommercialBundle {
  id: string;
  name: string;
  tagline: string;
  price: string;
  turnkey: boolean;
  components: string[];
  description: string;
}

export const GoRacerGoWinHardwareSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'turnkey-bundle' | 'how-they-work' | 'specs' | 'inquiry'>('turnkey-bundle');
  const [rfidSyncStatus, setRfidSyncStatus] = useState<'idle' | 'transponder_hit' | 'score_posted'>('idle');
  const [simLapTime, setSimLapTime] = useState<string>('2:09.460');

  const COMMERCIAL_BUNDLES: CommercialBundle[] = [
    {
      id: 'championship-turnkey',
      name: 'Go Arena™ Complete Turnkey Racing Suite',
      tagline: 'Go Racer Local Race Manager + Go Win Smart RFID Finish Line + Go Gate Indoor Model v1',
      price: '$28,900 Factory Direct Package',
      turnkey: true,
      components: [
        'Go Gate™ Indoor Model v1 (20-Slot Smart Drop Gate)',
        'Go Gate™ Dual Overhead Signal Towers (20ft ahead / 10ft high, Rule #20)',
        'Go Win™ Smart RFID Finish Line Loop (Battery-Powered, 0V line voltage on dirt, Rule #14)',
        'Go Racer™ Standalone Local Race Manager (Ruggedized Edge Console)',
        '100x Passive UHF Transponder Fork Tags for Cobra CX3 / CX5 Fleet',
        'Direct FIM-Style TV Broadcast Graphics Output Engine',
      ],
      description: 'The complete, plug-and-play youth motocross arena operating system. Integrates starting gate drop release, passive staging RFID, active battery-powered finish timing, and local race heats into an unified commercial hardware & software bundle.',
    },
    {
      id: 'timing-scoring-pair',
      name: 'Go Racer™ + Go Win™ Timing & Scoring Kit',
      tagline: 'Edge Race Manager Software Paired with Smart RFID Transponder Hardware',
      price: '$12,400 Standalone System',
      turnkey: false,
      components: [
        'Go Win™ Smart RFID Battery-Powered Finish Line Array',
        'Go Racer™ Standalone Edge Server & Race Director App',
        '50x High-Durability Machine Transponders',
        'Overhead High-Gain Directional Timing Antenna',
        'Live Broadcast HDMI / NDI Video Graphics Streamer',
      ],
      description: 'Perfect for existing tracks with their own starting gates looking to upgrade to zero-touch, microsecond-accurate RFID transponder scoring and automated local race management.',
    },
    {
      id: 'gate-v1-standalone',
      name: 'Go Gate™ Indoor Model v1 (20-Slot)',
      tagline: 'Outside-Footprint 20-Rider Smart Starting System with Overhead Signals',
      price: '$18,500 Hardware Package',
      turnkey: false,
      components: [
        '20-Slot Modular Hardened T6 Aluminum Drop Grid',
        'Rule #18 Axle-Height Drop Bar (1"–2" median height)',
        'Rule #19 Zero-Grade Dead-Flat Flush Surface Recess',
        'Rule #20 Dual Overhead 10ft Signal Towers (10-second yellow alert)',
        '24V DC Safe Low-Voltage Solenoid Bank with Redundant Grounding',
      ],
      description: 'Engineered specifically for indoor electric youth motocross tracks to meet USA E MOTO safety rules #10, #18, #19, and #20.',
    },
  ];

  const handleSimulateFinish = () => {
    setRfidSyncStatus('transponder_hit');
    setTimeout(() => {
      setRfidSyncStatus('score_posted');
      setTimeout(() => setRfidSyncStatus('idle'), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans text-slate-100">
      {/* Hero: Go Racer + Go Win + Go Gate Commercial Pairing */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black tracking-widest uppercase font-mono shadow-md">
                COMMERCIAL TURNKEY HARDWARE SUITE
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono border border-amber-500/30">
                GO RACER + GO WIN + GO GATE
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono border border-emerald-500/30">
                PLUG-AND-PLAY MOTOCROSS ECOSYSTEM
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              The Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-cyan-400">Arena Racing System</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              <strong>Go Racer™</strong> (the standalone local race manager) and <strong>Go Win™</strong> (the smart battery-powered RFID finish line) work together as a unified commercial product, integrating alongside the <strong>Go Gate™ Indoor Model v1</strong> (the 20-slot smart starting gate).
            </p>

            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('turnkey-bundle')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'turnkey-bundle'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Commercial Hardware Packages</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('how-they-work')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'how-they-work'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>How The Trio Operates Together</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('inquiry')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'inquiry'
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Procure Equipment Suite</span>
              </button>
            </div>
          </div>

          {/* Live Trio Status Visualizer */}
          <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl min-w-[290px] space-y-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
                Hardware Interlock Link
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ALL 3 ONLINE
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">1. Go Gate™ v1:</span>
                <span className="text-cyan-400 font-bold">20 Slots &bull; Ready</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">2. Go Win™ RFID:</span>
                <span className="text-amber-400 font-bold">0.0V DC &bull; Active Loop</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">3. Go Racer™ Edge:</span>
                <span className="text-emerald-400 font-bold">Local Host &bull; Synced</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSimulateFinish}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Transponder Hit</span>
            </button>

            {rfidSyncStatus !== 'idle' && (
              <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 text-center font-mono text-xs">
                {rfidSyncStatus === 'transponder_hit' && (
                  <span className="text-amber-300 animate-pulse">RFID HIT: Transponder #4 detected...</span>
                )}
                {rfidSyncStatus === 'score_posted' && (
                  <span className="text-emerald-400 font-bold">SCORED: Jaydin SMART (2:09.460) posted to Go Racer!</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TAB 1: COMMERCIAL HARDWARE PACKAGES */}
      {activeTab === 'turnkey-bundle' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <span>📦</span> Turnkey Arena Hardware Packages
              </h2>
              <p className="text-xs text-slate-400">
                Direct procurement options for indoor facilities, sanctioning bodies, and municipal motorparks.
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              FACTORY DIRECT OEM PRICING
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {COMMERCIAL_BUNDLES.map((bundle) => (
              <div
                key={bundle.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between border transition-all ${
                  bundle.turnkey
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/40 shadow-xl shadow-amber-500/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                      {bundle.turnkey ? 'COMPLETE TURNKEY PACKAGE' : 'MODULAR COMPONENT'}
                    </span>
                    {bundle.turnkey && <Sparkles className="w-4 h-4 text-amber-400" />}
                  </div>

                  <h3 className="text-xl font-black text-white tracking-tight">{bundle.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-1">{bundle.tagline}</p>

                  <div className="my-5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <div className="text-lg font-black text-amber-400 font-mono">{bundle.price}</div>
                    <div className="text-[10px] text-slate-400 font-mono">Includes Hardware, Firmware &amp; License</div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {bundle.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Package Inclusions:</div>
                    {bundle.components.map((c, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inquiry')}
                    className={`w-full py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      bundle.turnkey
                        ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-md shadow-amber-400/20'
                        : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    <span>Request Technical Quote</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HOW THE TRIO OPERATES TOGETHER */}
      {activeTab === 'how-they-work' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                END-TO-END WORKFLOW
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                The Integrated Motocross Arena Data Pipeline
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                By uniting Go Gate™ (mechanical starting hardware), Go Win™ (battery RFID detection), and Go Racer™ (edge race management), you eliminate manual paperwork, stopwatch human errors, and starter flag disputes.
              </p>
            </div>

            {/* 4 Step Process Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 font-mono font-bold text-sm flex items-center justify-center">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">Go Racer: Heat Staging</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Go Racer assigns 20 riders into gates 1 through 20. Passive RFID chute reader (Rule #13) verifies the bike fork transponders as they roll onto the pads.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">Go Gate v1: Drop Trigger</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Dual overhead signal lights engage Yellow at T-10s (Rule #20). Solenoids release in 38ms; gate drops dead-flat flush with the surface (Rule #19).
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">Go Win: 0V RFID Finish</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Riders complete laps over the finish antenna. The 24V battery array ensures 0.0V line voltage on dirt (Rule #14), logging microsecond lap splits.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 font-mono font-bold text-sm flex items-center justify-center">
                  04
                </div>
                <h4 className="text-sm font-bold text-white">Go Global: Live Scoring</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Go Racer aggregates finishing order, calculates championship points, and pushes FIM-style broadcast graphics to arena TVs and Go Global cloud.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROCUREMENT INQUIRY FORM */}
      {activeTab === 'inquiry' && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl max-w-3xl mx-auto space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 inline-block mb-2">
              COMMERCIAL SALES &amp; FACILITY SPECIFICATION
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Procure The Complete Arena Hardware Suite
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Order Go Racer™, Go Win™ RFID, and Go Gate™ Indoor Model v1 for your new or existing facility.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Commercial RFQ Received! An engineering representative will contact you within 24 hours.');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="David Hanscom"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Corporate / Track Email *</label>
                <input
                  type="email"
                  required
                  placeholder="dave@trackfacility.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Facility Name / City</label>
                <input
                  type="text"
                  placeholder="Go Moto Arena #1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Select Hardware Bundle</label>
                <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none font-mono">
                  <option value="complete">Go Arena™ Complete Turnkey Package ($28,900)</option>
                  <option value="gate">Go Gate™ Indoor Model v1 (20-Slot Standalone) ($18,500)</option>
                  <option value="win">Go Racer™ + Go Win™ Timing &amp; Scoring Pair ($12,400)</option>
                  <option value="custom">Custom Multi-Gate Installation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Facility Dimensions &amp; Target Deployment Date</label>
              <textarea
                rows={3}
                placeholder="Arena indoor footprint, track surface type, target opening timeline..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all font-mono shadow-xl shadow-amber-400/20"
            >
              Submit Commercial Procurement Request
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
