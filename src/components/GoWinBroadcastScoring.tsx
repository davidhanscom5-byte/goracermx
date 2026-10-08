import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Zap,
  Radio,
  Timer,
  Flag,
  Award,
  Play,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  Download
} from 'lucide-react';

interface LeaderboardEntry {
  position: number;
  countryCode: string;
  countryName: string;
  flagEmoji: string;
  bikeNumber: string;
  riderFirstName: string;
  riderLastName: string;
  machine: string;
  division: string;
  lastLapTime: string;
  bestLapTime: string;
  gap: string;
  points: number;
  rfidChipId: string;
}

export const GoWinBroadcastScoring: React.FC = () => {
  const [sessionActive, setSessionActive] = useState<boolean>(true);
  const [sessionElapsedMs, setSessionElapsedMs] = useState<number>(374500); // ~6:14 into heat
  const [activeTab, setActiveTab] = useState<'broadcast' | 'hardware' | 'rfid-feed' | 'specs'>('broadcast');

  // Simulated live telemetry matching international broadcast graphics
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
    {
      position: 1,
      countryCode: 'USA',
      countryName: 'United States',
      flagEmoji: '🇺🇸',
      bikeNumber: '4',
      riderFirstName: 'Jaydin',
      riderLastName: 'SMART',
      machine: 'Cobra Moto CX5',
      division: 'Class B (10-12)',
      lastLapTime: '2:09.460',
      bestLapTime: '2:09.460',
      gap: 'LEADER',
      points: 25,
      rfidChipId: 'RFID-CX5-04-USA',
    },
    {
      position: 2,
      countryCode: 'CRO',
      countryName: 'Croatia',
      flagEmoji: '🇭🇷',
      bikeNumber: '643',
      riderFirstName: 'Roko',
      riderLastName: 'IVANDIC',
      machine: 'Cobra Moto CX5',
      division: 'Class B (10-12)',
      lastLapTime: '2:11.820',
      bestLapTime: '2:10.980',
      gap: '+2.360',
      points: 22,
      rfidChipId: 'RFID-CX5-22-CRO',
    },
    {
      position: 3,
      countryCode: 'COL',
      countryName: 'Colombia',
      flagEmoji: '🇨🇴',
      bikeNumber: '111',
      riderFirstName: 'Martin',
      riderLastName: 'OSPINA',
      machine: 'Cobra Moto CX5',
      division: 'Class B (10-12)',
      lastLapTime: '2:13.150',
      bestLapTime: '2:12.440',
      gap: '+3.690',
      points: 20,
      rfidChipId: 'RFID-CX5-19-COL',
    },
    {
      position: 4,
      countryCode: 'BRA',
      countryName: 'Brazil',
      flagEmoji: '🇧🇷',
      bikeNumber: '12',
      riderFirstName: 'Henri',
      riderLastName: 'OLIVEIRA KRUG',
      machine: 'Cobra Moto CX5',
      division: 'Class B (10-12)',
      lastLapTime: '2:14.020',
      bestLapTime: '2:13.780',
      gap: '+4.560',
      points: 18,
      rfidChipId: 'RFID-CX5-31-BRA',
    },
    {
      position: 5,
      countryCode: 'SLO',
      countryName: 'Slovenia',
      flagEmoji: '🇸🇮',
      bikeNumber: '119',
      riderFirstName: 'Leo',
      riderLastName: 'GAJSER',
      machine: 'Cobra Moto CX3',
      division: 'Class B (7-9)',
      lastLapTime: '2:15.890',
      bestLapTime: '2:15.200',
      gap: '+6.430',
      points: 16,
      rfidChipId: 'RFID-CX3-08-SLO',
    },
    {
      position: 6,
      countryCode: 'DEN',
      countryName: 'Denmark',
      flagEmoji: '🇩🇰',
      bikeNumber: '474',
      riderFirstName: 'Willads',
      riderLastName: 'GORDON',
      machine: 'Cobra Moto CX3',
      division: 'Class B (7-9)',
      lastLapTime: '2:17.340',
      bestLapTime: '2:16.850',
      gap: '+7.880',
      points: 15,
      rfidChipId: 'RFID-CX3-14-DEN',
    },
    {
      position: 7,
      countryCode: 'AUT',
      countryName: 'Austria',
      flagEmoji: '🇦🇹',
      bikeNumber: '981',
      riderFirstName: 'Maurice',
      riderLastName: 'HEIDEGGER',
      machine: 'Cobra Moto CX3',
      division: 'Class C (7-9)',
      lastLapTime: '2:19.410',
      bestLapTime: '2:18.990',
      gap: '+9.950',
      points: 14,
      rfidChipId: 'RFID-CX3-27-AUT',
    },
    {
      position: 8,
      countryCode: 'CAN',
      countryName: 'Canada',
      flagEmoji: '🇨🇦',
      bikeNumber: '9',
      riderFirstName: 'Chandler',
      riderLastName: 'POWELL',
      machine: 'Cobra Moto CX3',
      division: 'Class C (7-9)',
      lastLapTime: '2:21.050',
      bestLapTime: '2:20.120',
      gap: '+11.590',
      points: 13,
      rfidChipId: 'RFID-CX3-02-CAN',
    },
  ]);

  const leader = leaderboard[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-amber-500/30 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl shadow-inner">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                GO WIN™ BROADCAST ENGINE
              </span>
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                LIVE TIMING &amp; SCORING
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Go Win™ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">World Championship Telemetry</span>
            </h2>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
          {[
            { id: 'broadcast', label: 'Broadcast Overlay', icon: Trophy },
            { id: 'hardware', label: '0V Battery RFID Specs (Rule #14)', icon: Radio },
            { id: 'rfid-feed', label: 'Live RFID Transponder Feed', icon: Zap },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
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

      {/* TAB 1: BROADCAST OVERLAY GRAPHICS (Modeled directly after the MXGP / Blu Cru SuperFinale Graphic) */}
      {activeTab === 'broadcast' && (
        <div className="space-y-6">
          {/* Authentic FIM / Motocross TV Graphics Card */}
          <div className="rounded-3xl overflow-hidden border-2 border-slate-700 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 shadow-2xl relative">
            {/* Top Broadcast Event Header Bar */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b-2 border-slate-700 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 px-3 py-1 rounded text-white font-black text-xs tracking-wider uppercase italic shadow">
                  GO WIN™ MX
                </div>
                <div className="text-white font-black text-sm tracking-wide uppercase flex items-center gap-2 font-mono">
                  <span>USA E MOTO™ INDOOR ARENACROSS FINALE</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-400">RACE RESULTS</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-400">COBRA CX5 CLASS B</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">TRACK: 10FT LANES (RULE #1)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  OFFICIAL FIM-STYLE CLASSIFICATION
                </span>
              </div>
            </div>

            {/* Main Stage: Winner Spotlight & Full Grid Leaderboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left Column: WINNER SPOTLIGHT CARD (Like Jaydin SMART graphic) */}
              <div className="lg:col-span-4 bg-gradient-to-br from-slate-950/95 to-slate-900/90 border-r border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black tracking-widest text-amber-400 uppercase bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40">
                      HEAT WINNER 🏆
                    </span>
                    <span className="text-5xl font-black text-slate-700/60 font-mono tracking-tighter">
                      #{leader.bikeNumber}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                      {leader.riderFirstName}
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                      {leader.riderLastName}
                    </div>
                    <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight mt-1 flex items-center gap-2">
                      <Timer className="w-5 h-5" />
                      <span>{leader.lastLapTime}</span>
                    </div>
                  </div>

                  {/* Rider Spec Details */}
                  <div className="mt-6 space-y-2.5 text-xs font-mono">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Machine Fleet:</span>
                      <span className="text-white font-bold">{leader.machine} (40 Units)</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Competition Division:</span>
                      <span className="text-cyan-400 font-bold">{leader.division}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">RFID Finish Transponder:</span>
                      <span className="text-emerald-400 font-bold">{leader.rfidChipId}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Championship Points:</span>
                      <span className="text-amber-400 font-black text-sm">+{leader.points} pts</span>
                    </div>
                  </div>
                </div>

                {/* Podium Trophy Banner */}
                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-500/30 flex items-center gap-3">
                  <div className="text-3xl">🥇</div>
                  <div>
                    <div className="text-xs font-black text-white uppercase font-mono">USA E MOTO™ Class B Holeshot</div>
                    <div className="text-[10px] text-slate-400 font-mono">0.0V Powered Finish Line Reader Certified</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Broadcast Leaderboard Rows (1 through 8) */}
              <div className="lg:col-span-8 p-4 sm:p-6 flex flex-col justify-center space-y-2 bg-slate-950/60">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.position}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      entry.position === 1
                        ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border-amber-500/40 shadow-lg'
                        : 'bg-slate-900/70 border-slate-800/80 hover:bg-slate-850'
                    }`}
                  >
                    {/* Position & Country */}
                    <div className="flex items-center gap-3 min-w-[200px] sm:min-w-[240px]">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                          entry.position === 1
                            ? 'bg-amber-400 text-slate-950 shadow'
                            : entry.position === 2
                            ? 'bg-slate-300 text-slate-950'
                            : entry.position === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {entry.position}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xl" title={entry.countryName}>{entry.flagEmoji}</span>
                        <span className="font-mono font-bold text-xs text-slate-300 w-9">{entry.countryCode}</span>
                      </div>

                      <div className="w-10 h-7 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-black text-xs text-white">
                        {entry.bikeNumber}
                      </div>

                      <div className="text-xs font-mono">
                        <span className="text-slate-400 font-medium mr-1.5">{entry.riderFirstName}</span>
                        <span className="text-white font-black uppercase">{entry.riderLastName}</span>
                      </div>
                    </div>

                    {/* Machine Badge */}
                    <div className="hidden md:flex items-center">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
                        {entry.machine.replace('Cobra Moto ', '')}
                      </span>
                    </div>

                    {/* Gap / Lap Time & Points */}
                    <div className="flex items-center gap-4 font-mono text-xs">
                      <div className="text-right w-20">
                        <span
                          className={`font-bold ${
                            entry.position === 1 ? 'text-emerald-400 font-black' : 'text-slate-400'
                          }`}
                        >
                          {entry.gap}
                        </span>
                      </div>

                      <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-400 font-black w-16 text-center">
                        {entry.points} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Broadcast Bar */}
            <div className="bg-slate-950 border-t border-slate-800 px-6 py-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span>RFID Transponder Loop: PASSIVE UHF GATE + BATTERY ACTIVE FINISH (RULE #13 &amp; #14)</span>
                <span className="text-emerald-400 font-bold">0.0V LINE VOLTAGE ON DIRT</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">USA E MOTO™ SCORING NETWORK</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HARDWARE & RULE #14 SPECIFICATIONS */}
      {activeTab === 'hardware' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-mono font-bold text-sm flex items-center justify-center">
                #14
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Battery-Powered RFID Finish Equipment (Rule #14)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To eliminate any electrocution risk on wet dirt surfaces with youth riders, Rule #14 strictly mandates that finish line RFID reader equipment must be battery powered. Zero line voltage (120V / 240V AC) is permitted on the track floor footprint.
            </p>

            <div className="space-y-3 pt-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Power Architecture:</span>
                <span className="text-emerald-400 font-bold">Independent 24V LiFePO4 Battery Bank</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">AC Line Voltage on Dirt:</span>
                <span className="text-emerald-400 font-black">0.00 V (BANNED BY PROTOCOL)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Battery Operating Runway:</span>
                <span className="text-white font-bold">14 Continuous Hours per Charge</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Timing Accuracy:</span>
                <span className="text-cyan-400 font-bold">0.001 sec (1/1000th microsecond sync)</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 font-mono font-bold text-sm flex items-center justify-center">
                #13
              </span>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Passive RFID Gate Staging Chute (Rule #13)
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The starting gate chute entrance utilizes non-energized passive RFID readers. As parents and pit crew escort the machine into staging chute, the bike's ID is verified instantly against the session schedule.
            </p>

            <div className="space-y-3 pt-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Staging Verification:</span>
                <span className="text-cyan-400 font-bold">Automatic 10-Minute Alert Cross-Check</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Rider ID Transponder:</span>
                <span className="text-white font-bold">Cobra Fork Guard Passive UHF Tag</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">False Gate Detection:</span>
                <span className="text-emerald-400 font-bold">Automatic Staging Lockout</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-400">Grounding Standard (Rule #15):</span>
                <span className="text-emerald-400 font-bold">Redundant Ground Loop Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE RFID TRANSPONDER FEED */}
      {activeTab === 'rfid-feed' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                Raw Transponder Antenna Telemetry Log
              </h3>
              <p className="text-xs text-slate-400">
                High-speed microsecond timestamps generated from the battery-powered finish line antenna loop.
              </p>
            </div>
            <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 self-start sm:self-auto">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              ANTENNA FREQ: 915.25 MHz UHF
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2.5 px-3">Transponder UID</th>
                  <th className="py-2.5 px-3">Rider</th>
                  <th className="py-2.5 px-3">Machine</th>
                  <th className="py-2.5 px-3">Antenna Hit Time</th>
                  <th className="py-2.5 px-3">Lap Time</th>
                  <th className="py-2.5 px-3">Signal Strength (RSSI)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {leaderboard.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40">
                    <td className="py-2.5 px-3 text-cyan-400 font-bold">{r.rfidChipId}</td>
                    <td className="py-2.5 px-3 text-white font-bold">{r.riderFirstName} {r.riderLastName}</td>
                    <td className="py-2.5 px-3 text-slate-300">{r.machine}</td>
                    <td className="py-2.5 px-3 text-slate-400">14:28:{42 + idx}.{120 + idx * 85}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{r.lastLapTime}</td>
                    <td className="py-2.5 px-3 text-amber-400">-42 dBm (Optimal)</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
                        Scored &bull; Valid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
