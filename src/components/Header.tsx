import React from 'react';
import { Volume2, VolumeX, Tv, Clock, ShieldCheck, UserCheck, Database, Zap, Building2, AlertTriangle, Monitor } from 'lucide-react';
import { BlockId, ActiveRoleTerminal } from '../types';
import { BLOCKS_CONFIG } from '../utils/scheduleData';
import { GoMotoLogo } from './GoMotoLogo';

interface HeaderProps {
  currentBlock: BlockId;
  onSelectBlock: (block: BlockId) => void;
  isSoundEnabled: boolean;
  onToggleSound: () => void;
  currentTerminal: ActiveRoleTerminal;
  onSelectTerminal: (terminal: ActiveRoleTerminal) => void;
  currentTimeStr: string;
  onOpenSupabaseModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentBlock,
  onSelectBlock,
  isSoundEnabled,
  onToggleSound,
  currentTerminal,
  onSelectTerminal,
  currentTimeStr,
  onOpenSupabaseModal,
}) => {
  return (
    <header id="app-header" className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Brand & Status Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Facility Title */}
          <div className="flex items-center gap-3">
            <GoMotoLogo variant="icon" size="md" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#00F0FF] text-slate-950 shadow-sm font-sans">
                  USA E MOTO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-sm font-sans">
                  GO MOTO
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-sm font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  GO RACER™ TECH MESH
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {currentTimeStr}
                </span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Go Moto Indoor Arena
                <span className="text-xs font-normal text-slate-400 border-l border-slate-700 pl-2 hidden sm:inline">
                  80 Cobra Moto CX3 &amp; CX5 Fleet
                </span>
              </h1>
            </div>
          </div>

          {/* Block Selector & Quick Sound/DB Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Morning vs Afternoon Block Toggle */}
            <div id="block-selector" className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800">
              <button
                id="select-morning-block-btn"
                type="button"
                onClick={() => onSelectBlock('morning')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  currentBlock === 'morning'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>Morning Block</span>
                <span className="text-[10px] opacity-80 font-mono">(8:00 AM)</span>
              </button>
              <button
                id="select-afternoon-block-btn"
                type="button"
                onClick={() => onSelectBlock('afternoon')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                  currentBlock === 'afternoon'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>Afternoon Block</span>
                <span className="text-[10px] opacity-80 font-mono">(2:00 PM)</span>
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              id="toggle-sound-btn"
              type="button"
              onClick={onToggleSound}
              title={isSoundEnabled ? 'Audio alerts enabled (Track horns active)' : 'Audio alerts muted'}
              className={`p-2 rounded-xl border transition-colors ${
                isSoundEnabled
                  ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700'
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'
              }`}
            >
              {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Supabase Cloud Database & Deployment Button */}
            {onOpenSupabaseModal && (
              <button
                id="header-open-supabase-btn"
                type="button"
                onClick={onOpenSupabaseModal}
                className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/60 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title="Supabase Database Status, 1-Click SQL Script, and gomotomx.com Setup"
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Supabase DB</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Connected"></span>
              </button>
            )}
          </div>
        </div>

        {/* ROLE-BASED TERMINAL SWITCHER (Fixed Station Consoles) */}
        <div className="py-2.5 border-t border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {/* 1. Track Director (Full Operations) */}
            <button
              id="terminal-btn-director"
              type="button"
              onClick={() => onSelectTerminal('director')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentTerminal === 'director'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>🏢 Track Director (Full Ops)</span>
            </button>

            {/* 2. Machine Marshall (E-Bikes & Impound) */}
            <button
              id="terminal-btn-marshall"
              type="button"
              onClick={() => onSelectTerminal('machine-marshall')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentTerminal === 'machine-marshall'
                  ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Machine Marshall (80 E-Bikes)</span>
            </button>

            {/* 3. Registration Desk (Front Office) */}
            <button
              id="terminal-btn-registration"
              type="button"
              onClick={() => onSelectTerminal('registration')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentTerminal === 'registration'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>📝 Registration Desk (Intake)</span>
            </button>

            {/* 4. Standalone Product Packages (Go Gate, Go Win, Go Ride, Go Race, Go Academy) */}
            <button
              id="terminal-btn-standalone-packages"
              type="button"
              onClick={() => onSelectTerminal('standalone-products')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentTerminal === 'standalone-products'
                  ? 'bg-[#00F0FF] text-slate-950 font-black shadow-lg shadow-[#00F0FF]/30 ring-2 ring-cyan-300'
                  : 'bg-slate-950 border border-cyan-500/40 text-cyan-300 hover:text-white hover:border-cyan-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse"></span>
              <span>📦 Standalone Products (Go Gate/Win/Ride/Race)</span>
            </button>

            {/* 5. Paddock TV Display */}
            <button
              id="terminal-btn-tv"
              type="button"
              onClick={() => onSelectTerminal('paddock-tv')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentTerminal === 'paddock-tv'
                  ? 'bg-purple-500 text-slate-950 font-black shadow-lg shadow-purple-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>📺 Paddock TV</span>
            </button>

            {/* 6. Public Online Pre-Reg */}
            <button
              id="terminal-btn-public"
              type="button"
              onClick={() => onSelectTerminal('public-portal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                currentTerminal === 'public-portal'
                  ? 'bg-blue-500 text-slate-950 font-black shadow-lg shadow-blue-500/20'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>🌐 Public Portal</span>
            </button>
          </div>

          {/* Safety Rule: Handheld Ban Badge */}
          <div className="flex items-center gap-1.5 text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 font-medium">
            <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate">Handheld devices strictly prohibited on track floor</span>
          </div>
        </div>
      </div>
    </header>
  );
};

