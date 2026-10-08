import React from 'react';
import { Globe, ExternalLink, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { EcosystemDomain, DOMAIN_CONFIGS, detectEcosystemDomain } from '../utils/domainRouter';
import { ActiveRoleTerminal } from '../types';
import { StandaloneProductPackage } from './StandalonePackagesView';

interface ActiveDomainBarProps {
  currentDomain: EcosystemDomain;
  onSelectDomain: (domain: EcosystemDomain) => void;
  onNavigateTerminal: (terminal: ActiveRoleTerminal, pkg?: StandaloneProductPackage) => void;
  onOpenPreReg?: () => void;
}

export const ActiveDomainBar: React.FC<ActiveDomainBarProps> = ({
  currentDomain,
  onSelectDomain,
  onNavigateTerminal,
  onOpenPreReg,
}) => {
  const activeMeta = DOMAIN_CONFIGS[currentDomain];
  const domainKeys: EcosystemDomain[] = [
    'goracermx.com',
    'gogatemx.com',
    'gowinmx.com',
    'gomotomx.com',
    'usaemoto.com',
  ];

  return (
    <div className="bg-slate-950/95 border-b border-cyan-500/20 px-3 sm:px-6 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
        
        {/* Domain Cluster Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
            <Globe className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-bold text-white">CLOUDFLARE ACTIVE SITES:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {domainKeys.map((domain) => {
              const meta = DOMAIN_CONFIGS[domain];
              const isSelected = currentDomain === domain;
              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => {
                    onSelectDomain(domain);
                    if (meta.targetTerminal) {
                      onNavigateTerminal(meta.targetTerminal, meta.targetPackage);
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-cyan-500/10 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`}></span>
                  <span>{domain}</span>
                </button>
              );
            })}
          </div>
          {onOpenPreReg && (
            <button
              type="button"
              onClick={onOpenPreReg}
              className="ml-2 px-2.5 py-1 rounded-lg text-[11px] font-mono bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black shadow-sm shadow-cyan-500/20 hover:brightness-110 flex items-center gap-1.5 transition-all"
            >
              <span>⚡</span>
              <span>LOCK IN RIDER PROFILE</span>
            </button>
          )}
        </div>

        {/* Current Active Domain Context Indicator */}
        <div className="flex items-center gap-2 text-[11px] text-slate-300 font-mono">
          <span className="text-slate-500">Live Context:</span>
          <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {activeMeta.brandName}
          </span>
          <span className="hidden sm:inline text-slate-400 truncate max-w-xs">
            • {activeMeta.subTitle}
          </span>
        </div>

      </div>
    </div>
  );
};
