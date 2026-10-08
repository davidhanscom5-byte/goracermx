import React, { useState } from 'react';
import {
  Globe,
  Server,
  Zap,
  Users,
  Flag,
  Share2,
  Database,
  Cloud,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Building,
  Radio,
  MapPin,
  Lock,
  Activity,
  Award
} from 'lucide-react';

export const GoRacerGlobalNetworkView: React.FC = () => {
  const [activeTier, setActiveTier] = useState<'local' | 'global-mesh' | 'stack' | 'connect'>('local');
  const [syncedTracks, setSyncedTracks] = useState<number>(14);
  const [networkedRiders, setNetworkedRiders] = useState<number>(3420);

  const GOOGLE_TECH_STACK = [
    {
      service: 'Google Cloud Run & Kubernetes',
      role: 'Autonomous Microservices Backbone',
      detail: 'Instantly scales containerized local race servers from single-track arena heats to thousands of concurrent championship heats with sub-10ms edge latency.',
    },
    {
      service: 'Google Cloud Firestore & Bigtable',
      role: 'Real-Time Telemetry & Global Ledgers',
      detail: 'Ultra-low latency microsecond lap-time streaming synchronized globally across track RFID loops, promoter displays, and parent mobile devices.',
    },
    {
      service: 'Google Workspace Enterprise',
      role: 'Unified Track, Rider & Promoter Identity',
      detail: 'Verified domain credentials (@usaemoto.com / @goracer.org) with OAuth 2.0 single sign-on across federated track associations and timing marshals.',
    },
    {
      service: 'Google Pub/Sub Event Mesh',
      role: 'Inter-Track Event Distribution',
      detail: 'Publishes gate drops, flags, and finishing order instantaneously to regional sanctioning boards and national amateur championship standings.',
    },
    {
      service: 'Google Maps Platform & Places API',
      role: 'Global Facility Directory & Proximity Intake',
      detail: 'Geolocates sanctioned indoor arenas, automatically matching youth riders to nearest practice sessions, certified rental fleets, and regional qualifiers.',
    },
    {
      service: 'Cloud Identity & Zero-Trust IAM',
      role: 'Role-Based Data Privacy & Ownership',
      detail: 'Independent track owners maintain 100% sovereign ownership of their customer lists, revenue settlements, and financial ledgers.',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans text-slate-100">
      {/* Hero: Go Racer Local & Go Global Architecture */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black tracking-widest uppercase font-mono shadow-md">
                STANDALONE RACE MANAGER &rarr; GO GLOBAL™
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-bold uppercase tracking-wider font-mono border border-cyan-500/30">
                GOOGLE CLOUD TECH STACK BACKBONE
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono border border-emerald-500/30">
                SOVEREIGN TRACK DATA
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              Go Racer™ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Local Race Manager</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Operates out-of-the-box as an independent, standalone local race director for single track arenas—and seamlessly expands into <strong>Go Global™</strong>, a unified Google Tech Stack backbone interconnecting tracks, riders, and promoters into a nationwide amateur racing ecosystem.
            </p>

            <div className="flex items-center gap-3 pt-3 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTier('local')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTier === 'local'
                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <Server className="w-3.5 h-3.5" />
                <span>Standalone Local Mode</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTier('global-mesh')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTier === 'global-mesh'
                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Go Global™ Network</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTier('stack')}
                className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTier === 'stack'
                    ? 'bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-400/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                }`}
              >
                <Cloud className="w-3.5 h-3.5" />
                <span>Google Cloud Architecture</span>
              </button>
            </div>
          </div>

          {/* Network Health & Scalability Widget */}
          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl min-w-[280px] space-y-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                Network Node Status
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ACTIVE MESH
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Local Engine:</span>
                <span className="text-white font-bold">Zero Dependency (Offline Capable)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Cloud Mesh Link:</span>
                <span className="text-cyan-400 font-bold">Google Cloud Backbone</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Interconnected Tracks:</span>
                <span className="text-white font-bold">{syncedTracks} Sanctioned Arenas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Rider Passport Sync:</span>
                <span className="text-emerald-400 font-bold">{networkedRiders.toLocaleString()} Active Licences</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono text-center">
              Multi-Region Low Latency Cluster &bull; Cloud Run
            </div>
          </div>
        </div>
      </div>

      {/* TIER 1: STANDALONE LOCAL RACE MANAGER */}
      {activeTier === 'local' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                CORE CAPABILITY
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Standalone Local Race Director
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Go Racer™ operates locally right on your arena laptop or staging tablet. Even if internet connection drops during an event, heat management, gate release triggers, safety flags, and 10-minute session timers continue running without missing a beat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
                  01
                </div>
                <h4 className="text-sm font-bold text-white">Full Local Heat Staging</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Automated rider lineup cards, 10-minute on-track clocks, 3-minute paddock clearing, and white/checkered flag protocols.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
                  02
                </div>
                <h4 className="text-sm font-bold text-white">Hardware Direct Link</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Direct RS-485 / UHF communication with Go Gate™ drop mechanisms and 24V battery-powered Go Win™ finish line transponders.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-sm">
                  03
                </div>
                <h4 className="text-sm font-bold text-white">Independent Ledger Control</h4>
                <p className="text-xs text-slate-400 leading-snug">
                  Your entry fees, spectator counts, and member records remain 100% your private property on your designated local or cloud instance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TIER 2: GO GLOBAL™ NETWORK (TRACKS, RIDERS, PROMOTERS) */}
      {activeTier === 'global-mesh' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                EXPANSION ENGINE
              </span>
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                Go Global™: The Tri-Party Motocross Network
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Flip the switch on Go Global™ to connect your local venue into a national amateur motocross ecosystem connecting three key stakeholders:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pillar 1: Tracks */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Independent Track Owners</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join a shared national calendar without giving up autonomy. Cross-promote championship series, fill empty gate slots with traveling racers, and benchmark lap metrics against other facilities.
                </p>
                <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sovereign Stripe / Billing Integration</span>
                </div>
              </div>

              {/* Pillar 2: Riders */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Youth Riders &amp; Families</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Single digital "Rider Passport." A youth racer verified in Class C at Track A carries their certified safety credentials, emergency contacts, and progression status seamlessly to Track B across state lines.
                </p>
                <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>National Class C &rarr; Class B Passport</span>
                </div>
              </div>

              {/* Pillar 3: Promoters */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Series Promoters &amp; Sanction</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Run multi-round regional or national electric motocross championships across multiple venues. Real-time aggregate point tables, automatic tie-breakers, and broadcast-ready leaderboards.
                </p>
                <div className="text-[11px] font-mono text-amber-400 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Live FIM-Style TV Broadcast Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TIER 3: GOOGLE TECH STACK BACKBONE */}
      {activeTier === 'stack' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                  ENTERPRISE INFRASTRUCTURE
                </span>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                  Google Cloud &amp; Google Workspace Backbone
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Engineered on battle-tested Google infrastructure for carrier-grade uptime, military-grade encryption, and millisecond edge telemetry.
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 font-mono text-xs font-bold flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                <span>Google Cloud Partner Tier Architecture</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GOOGLE_TECH_STACK.map((item, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                      {item.service}
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.role}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
