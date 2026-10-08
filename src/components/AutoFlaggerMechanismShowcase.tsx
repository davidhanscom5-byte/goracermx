import React, { useState, useEffect } from 'react';
import {
  Flag,
  RotateCcw,
  Sliders,
  Cpu,
  Zap,
  CheckCircle2,
  Lock,
  Unlock,
  Radio,
  Settings,
  Layers,
  ChevronRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export type FlagType = 'green' | 'yellow' | 'white' | 'checkered' | 'stowed';

interface ShaftFlagArm {
  id: FlagType;
  label: string;
  flagColor: string;
  pattern: string;
  pinEngaged: boolean;
  angle: number;
}

export const AutoFlaggerMechanismShowcase: React.FC = () => {
  const [activeFlag, setActiveFlag] = useState<FlagType>('stowed');
  const [waveFrequencyHz, setWaveFrequencyHz] = useState<number>(2.2);
  const [sweepAngleDeg, setSweepAngleDeg] = useState<number>(50);
  const [shaftAngle, setShaftAngle] = useState<number>(0);
  const [shaftMotorRunning, setShaftMotorRunning] = useState<boolean>(false);

  // Solenoid locking pin states for each of the 4 flags on the common oscillating shaft
  const [flags, setFlags] = useState<Record<FlagType, { name: string; color: string; pattern: string; stowed: boolean }>>({
    green: { name: 'Green Flag', color: 'bg-emerald-500 border-emerald-400', pattern: 'bg-emerald-600', stowed: true },
    yellow: { name: 'Yellow Caution', color: 'bg-amber-400 border-amber-300', pattern: 'bg-amber-500', stowed: true },
    white: { name: 'White Flag', color: 'bg-slate-100 border-white', pattern: 'bg-slate-200', stowed: true },
    checkered: { name: 'Checkered Flag', color: 'bg-slate-900 border-slate-700', pattern: 'bg-[repeating-conic-gradient(#000000_0%_25%,#ffffff_0%_50%)] [background-size:16px_16px]', stowed: true },
    stowed: { name: 'All Stowed', color: 'bg-slate-800 border-slate-700', pattern: 'bg-slate-800', stowed: true }
  });

  // Mechanical oscillation: Single drive motor oscillates the continuous center shaft
  useEffect(() => {
    if (!shaftMotorRunning || activeFlag === 'stowed') {
      setShaftAngle(0);
      return;
    }

    let frameId: number;
    let startTime = performance.now();

    const animateShaft = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;
      // Single continuous shaft oscillates back & forth:
      const angle = Math.sin(elapsedSec * Math.PI * 2 * waveFrequencyHz) * sweepAngleDeg;
      setShaftAngle(angle);
      frameId = requestAnimationFrame(animateShaft);
    };

    frameId = requestAnimationFrame(animateShaft);
    return () => cancelAnimationFrame(frameId);
  }, [shaftMotorRunning, activeFlag, waveFrequencyHz, sweepAngleDeg]);

  const selectFlag = (flag: FlagType) => {
    if (flag === 'stowed') {
      setShaftMotorRunning(false);
      setActiveFlag('stowed');
    } else {
      setActiveFlag(flag);
      setShaftMotorRunning(true);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20 text-slate-100 font-sans">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border border-amber-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black tracking-widest uppercase font-mono shadow-md">
                ELEGANT MECHANICAL DESIGN
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono border border-amber-500/30">
                COMMON OSCILLATING SHAFT &bull; INDEPENDENT LOCKING PINS
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono border border-emerald-500/30">
                1 MOTOR &bull; 4 SOLENOID PINS
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              The Common-Shaft <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">Robotic Flagger</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Your mechanical concept is <strong>sublime in its simplicity</strong>: A single 24V motor rocks one continuous main shaft back and forth. Each of the 4 flag collars idles on the shaft, resting upward in its stowed detent—until an independent <strong>electric solenoid pin drops into that collar’s drive key</strong>, locking it to the shaft so it waves!
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl min-w-[280px] space-y-2.5 font-mono text-xs shadow-xl">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Drive Actuators:</span>
              <span className="text-emerald-400 font-bold">1 Motor (Oscillator)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Locking Pins:</span>
              <span className="text-cyan-400 font-bold">4x 24V Solenoid Plungers</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Stowed Position:</span>
              <span className="text-amber-400 font-bold">Spring Return to Top Detent</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Common Shaft Angle:</span>
              <span className="text-white font-bold">{Math.round(shaftAngle)}° Sweep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Mechanical Exploded View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: The Common Shaft & 4 Independent Collar Visualizer */}
        <div className="lg:col-span-8 bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              OVERHEAD FINISH ARCH &bull; COMMON SHAFT CROSS-SECTION
            </span>
            <span className="text-xs font-mono text-slate-400">
              MAIN SHAFT ANGLE: <strong className="text-amber-400">{Math.round(shaftAngle)}°</strong>
            </span>
          </div>

          {/* Schematic Diagram of the Common Shaft and 4 Flag Collars */}
          <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl space-y-6">
            {/* The Continuous Central Shaft Visual */}
            <div className="relative py-4">
              <div className="text-[10px] font-mono text-slate-400 mb-2 uppercase flex justify-between">
                <span>[← Vertical 24V Motor & 90° Bevel Gearbox (6.5" Slim Profile)]</span>
                <span className="text-amber-400 font-bold">CONTINUOUS STAINLESS DRIVE SHAFT</span>
                <span>[Opposite Bearing Pillow Block →]</span>
              </div>
              {/* Main steel rod */}
              <div className="w-full h-7 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-md border-2 border-slate-500 shadow-inner relative flex items-center justify-around">
                <span className="text-[9px] font-mono font-bold text-slate-900 tracking-widest uppercase">
                  OSCILLATING DRIVE TORQUE (±{sweepAngleDeg}°)
                </span>
              </div>
            </div>

            {/* The 4 Independent Flag Collar Stations */}
            <div className="grid grid-cols-4 gap-3 pt-2">
              {(['green', 'yellow', 'white', 'checkered'] as FlagType[]).map((f) => {
                const isSelected = activeFlag === f;
                const flagInfo = flags[f];

                return (
                  <div
                    key={f}
                    className={`rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-slate-950 border-slate-800 opacity-80'
                    }`}
                  >
                    {/* Locking Pin Status */}
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800 text-[10px] font-mono">
                      <span className="text-slate-400 uppercase font-bold">{f}</span>
                      {isSelected ? (
                        <span className="text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                          <Lock className="w-3 h-3" />
                          <span>PIN ENGAGED</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1">
                          <Unlock className="w-3 h-3" />
                          <span>DISENGAGED</span>
                        </span>
                      )}
                    </div>

                    {/* Mechanical Flag Simulation in its station */}
                    <div className="py-6 flex flex-col items-center justify-center min-h-[140px]">
                      {/* Flag Collar sitting on the common shaft */}
                      <div className="w-10 h-7 bg-slate-800 border-2 border-slate-600 rounded-md shadow relative flex items-center justify-center">
                        {isSelected && (
                          <div className="w-2 h-3 bg-amber-400 rounded-sm animate-pulse" title="Solenoid Pin Dropped"></div>
                        )}
                      </div>

                      {/* Mast & Flag Fabric */}
                      <div
                        className="relative transition-transform duration-75 origin-top mt-1"
                        style={{
                          transform: isSelected ? `rotate(${shaftAngle}deg)` : 'rotate(-90deg)', // -90 is retracted/horizontal in stowed shelf
                        }}
                      >
                        {/* Mast */}
                        <div className="w-1.5 h-20 bg-gradient-to-b from-emerald-400 via-slate-400 to-emerald-400 rounded-full shadow" title="Non-Rigid High-Flex Mast"></div>

                        {/* Fabric */}
                        <div
                          className={`absolute top-2 left-1.5 w-16 h-12 rounded-r-lg border shadow-md ${flagInfo.color}`}
                        >
                          <div className={`w-full h-full opacity-90 rounded-r-md ${flagInfo.pattern}`}></div>
                        </div>
                      </div>
                    </div>

                    {/* Sub-label */}
                    <div className="text-center pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] font-mono text-slate-400 block font-bold">
                        {isSelected ? 'WAVING ON SHAFT' : 'SPRING-STOWED (0°)'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How This Saves Cost & Increases Reliability */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <span className="font-mono text-amber-400 font-bold block">1. Only ONE Motor Needed</span>
              <p className="text-slate-400 leading-snug">
                Instead of 4 bulky gearmotors, a single continuous wiper motor or harmonic brushless servo drives the entire common shaft continuously.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <span className="font-mono text-cyan-400 font-bold block">2. Fast Solenoid Engagement</span>
              <p className="text-slate-400 leading-snug">
                A 24V linear solenoid pin fires in <strong>15 milliseconds</strong> into the keyed drive dog. Instant flag engagement on demand!
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <span className="font-mono text-emerald-400 font-bold block">3. Fail-Safe Auto-Stow</span>
              <p className="text-slate-400 leading-snug">
                When the solenoid unpowers, a torsion clock-spring snaps the idle flag upward into its rubber detent cushion inside the overhead ceiling hood.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Solenoid Selection Control Desk */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2 font-mono">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Solenoid Pin Selector</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">15ms Pin Drop</span>
            </div>

            <p className="text-xs text-slate-400">
              Select which flag solenoid pin to energize. All other 3 flags remain securely pinned in their stowed overhead detents:
            </p>

            <div className="space-y-2.5">
              {[
                { id: 'green', label: '🟢 Green Flag Pin', desc: 'Locks Green collar to shaft' },
                { id: 'yellow', label: '🟡 Yellow Caution Pin', desc: 'Locks Yellow collar to shaft' },
                { id: 'white', label: '⚪ White Flag Pin', desc: 'Locks White collar to shaft' },
                { id: 'checkered', label: '🏁 Checkered Flag Pin', desc: 'Locks Checkered collar to shaft' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectFlag(item.id as FlagType)}
                  className={`w-full p-3.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center justify-between border ${
                    activeFlag === item.id
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-left">
                    <span className="block">{item.label}</span>
                    <span className="text-[10px] opacity-75 font-normal">{item.desc}</span>
                  </div>
                  {activeFlag === item.id ? (
                    <Lock className="w-4 h-4 text-slate-950" />
                  ) : (
                    <Unlock className="w-4 h-4 text-slate-500" />
                  )}
                </button>
              ))}

              <button
                type="button"
                onClick={() => selectFlag('stowed')}
                className={`w-full py-3 rounded-2xl font-mono text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 border ${
                  activeFlag === 'stowed'
                    ? 'bg-slate-800 text-white border-slate-600'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Disengage All Pins &bull; All 4 Stowed</span>
              </button>
            </div>
          </div>

          {/* Common Shaft Motor Speed Controls */}
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-2 font-mono">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Main Shaft Motor Cadence</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Shaft RPM / Cadence:</span>
                <span className="text-cyan-400 font-bold">{waveFrequencyHz.toFixed(1)} Hz</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="4.5"
                step="0.1"
                value={waveFrequencyHz}
                onChange={(e) => setWaveFrequencyHz(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Oscillating Sweep Arc:</span>
                <span className="text-amber-400 font-bold">±{sweepAngleDeg}°</span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                step="5"
                value={sweepAngleDeg}
                onChange={(e) => setSweepAngleDeg(parseInt(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
