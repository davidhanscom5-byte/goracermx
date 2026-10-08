export type EcosystemDomain =
  | 'gogatemx.com'
  | 'goflagmx.com'
  | 'usaemoto.com'
  | 'gowinmx.com'
  | 'gomotomx.com'
  | 'goracermx.com'
  | 'default';

export interface DomainMeta {
  domain: EcosystemDomain;
  brandName: string;
  subTitle: string;
  badge: string;
  badgeColor: string;
  themeColor: string;
  description: string;
  primaryAction: string;
  targetTerminal: 'director' | 'machine-marshall' | 'registration' | 'standalone-products' | 'paddock-tv' | 'public-portal';
  targetPackage?: 'unified' | 'go-gate' | 'go-win' | 'go-ride' | 'go-race' | 'go-academy';
}

export const DOMAIN_CONFIGS: Record<EcosystemDomain, DomainMeta> = {
  'gogatemx.com': {
    domain: 'gogatemx.com',
    brandName: 'GO GATE™ MX',
    subTitle: '20-Rider Precision Starting Gate & Traffic Signal System',
    badge: 'STARTING GATE HARDWARE',
    badgeColor: 'bg-emerald-500 text-slate-950',
    themeColor: '#10B981',
    description: 'Precision mechanical & pneumatic 20-rider gate, dual traffic signals (20ft out / 10ft high), flush surface drop, and passive UHF staging RFID.',
    primaryAction: 'Launch Gate Hardware Console',
    targetTerminal: 'standalone-products',
    targetPackage: 'go-gate',
  },
  'goflagmx.com': {
    domain: 'goflagmx.com',
    brandName: 'GO FLAG™ MX',
    subTitle: '4-Flag Auto-Waving Self-Stowing Finish Line Robotics',
    badge: 'FLAG ROBOTICS & SAFETY',
    badgeColor: 'bg-amber-400 text-slate-950 font-black',
    themeColor: '#F59E0B',
    description: 'Robotic 4-flag rotating carousel (Green, Yellow, White, Checkered) with sinusoidal harmonic servo drive, overhead self-storing enclosure, and 0.0V DC battery power.',
    primaryAction: 'Launch Flag Robotics Console',
    targetTerminal: 'standalone-products',
    targetPackage: 'go-win',
  },
  'gowinmx.com': {
    domain: 'gowinmx.com',
    brandName: 'GO WIN™ MX',
    subTitle: 'Battery-Powered RFID Timing & Transponder Scoring',
    badge: 'TIMING & TELEMETRY',
    badgeColor: 'bg-cyan-400 text-slate-950',
    themeColor: '#00F0FF',
    description: 'Autonomous 24V DC battery-powered finish line transponder loop with 0V line voltage on dirt, redundant grounding monitor (<0.10Ω), and live scoring.',
    primaryAction: 'Launch Timing & Scoring Deck',
    targetTerminal: 'standalone-products',
    targetPackage: 'go-win',
  },
  'gomotomx.com': {
    domain: 'gomotomx.com',
    brandName: 'GO MOTO™ ARENA',
    subTitle: 'Your Local Indoor Electric Motocross Facility & Arena',
    badge: 'ARENA & RESERVATIONS',
    badgeColor: 'bg-blue-500 text-white',
    themeColor: '#3B82F6',
    description: 'Your premier local indoor electric motocross facility: 10ft wide lanes, 60-day advance booking, 7-day payment settlement, and family spectator access.',
    primaryAction: 'Open Reservation Portal',
    targetTerminal: 'public-portal',
    targetPackage: 'go-race',
  },
  'goracermx.com': {
    domain: 'goracermx.com',
    brandName: 'GO RACER™ MX',
    subTitle: 'National Amateur Racing Portal & Master System Suite',
    badge: 'NATIONAL RACING SUITE',
    badgeColor: 'bg-[#00F0FF] text-slate-950 font-black',
    themeColor: '#00F0FF',
    description: 'The master Google Cloud tech mesh uniting Go Gate, Go Win, Go Ride, and Go Race into a nationwide grassroots amateur racing network.',
    primaryAction: 'Enter Master System Suite',
    targetTerminal: 'director',
    targetPackage: 'unified',
  },
  'usaemoto.com': {
    domain: 'usaemoto.com',
    brandName: 'USA E MOTO',
    subTitle: 'Corporate JV & National Electric Motocross Sanction',
    badge: 'CORPORATE JV & SANCTION',
    badgeColor: 'bg-gradient-to-r from-red-600 via-white to-blue-600 text-slate-950 font-black',
    themeColor: '#EF4444',
    description: 'Corporate Joint Venture and national governing framework empowering independent track owners with data ownership and standardized electric youth racing.',
    primaryAction: 'View Sanction & Ecosystem Hub',
    targetTerminal: 'standalone-products',
    targetPackage: 'unified',
  },
  'default': {
    domain: 'default',
    brandName: 'USA E MOTO & GO RACER™',
    subTitle: 'Unified Electric Motocross Arena & Hardware Suite',
    badge: 'MULTI-DOMAIN ECOSYSTEM',
    badgeColor: 'bg-[#00F0FF] text-slate-950',
    themeColor: '#00F0FF',
    description: 'Connected network of 5 active domains powered by Cloudflare, GitHub, and Google Cloud.',
    primaryAction: 'Explore Suite',
    targetTerminal: 'director',
    targetPackage: 'unified',
  }
};

export function detectEcosystemDomain(): EcosystemDomain {
  try {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('gogatemx.com') || host.includes('gogate')) return 'gogatemx.com';
    if (host.includes('goflagmx.com') || host.includes('goflag')) return 'goflagmx.com';
    if (host.includes('gowinmx.com') || host.includes('gowin')) return 'gowinmx.com';
    if (host.includes('goracermx.com') || host.includes('goracer')) return 'goracermx.com';
    if (host.includes('gomotomx.com') || host.includes('gomoto')) return 'gomotomx.com';
    if (host.includes('usaemoto.com') || host.includes('usaemoto')) return 'usaemoto.com';
    
    // Check search param override (e.g. ?domain=goracermx.com)
    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get('domain');
    if (domainParam && DOMAIN_CONFIGS[domainParam as EcosystemDomain]) {
      return domainParam as EcosystemDomain;
    }
  } catch {
    // fallback
  }
  return 'default';
}
