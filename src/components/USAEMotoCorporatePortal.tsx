import React, { useState } from 'react';
import {
  Shield,
  Award,
  Globe2,
  Building2,
  FileText,
  Mail,
  Users2,
  CheckCircle2,
  ArrowRight,
  Download,
  ExternalLink,
  Lock,
  Landmark,
  Briefcase,
  PhoneCall,
  Scale,
  Sparkles,
  Zap,
  Flame,
  ChevronRight,
  TrendingUp,
  Cpu,
  Layers,
  MapPin,
  Calendar,
  Compass,
  Check,
  ChevronDown
} from 'lucide-react';

export const USAEMotoCorporatePortal: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'sanctioning' | 'governance' | 'franchise' | 'procurement' | 'contact'>('overview');
  const [inquiryType, setInquiryType] = useState('Arena Joint Venture / Franchise Inquiry');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [selectedRuleCategory, setSelectedRuleCategory] = useState<'all' | 'geometry' | 'electrical' | 'safety'>('all');
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    organization: '',
    email: '',
    phone: '',
    state: '',
    message: '',
  });

  const TRACK_RULES = [
    { num: '01', category: 'geometry', title: '10-Foot Wide Lanes', desc: 'Uniform 10ft corridor clearance maintained throughout all circuit sectors to prevent youth rider pinch collisions.' },
    { num: '02', category: 'geometry', title: 'Whoop Sections Banned', desc: 'Rhythm whoops are strictly banned across all sanctioned classes to prevent repetitive spinal compression injuries.' },
    { num: '03', category: 'safety', title: 'Sub-Surface Soil Hydration', desc: 'Automated underground precision injection sustains dust-free soil moisture without slick top-surface pooling.' },
    { num: '04', category: 'safety', title: 'Full-Duty Track Marshall', desc: 'Certified safety official with dedicated line-of-sight command over full course caution lighting at all times.' },
    { num: '05', category: 'safety', title: 'Full-Duty Medical Professional', desc: 'Licensed emergency responder stationed in technical paddock equipped with spinal stabilization apparatus.' },
    { num: '06', category: 'geometry', title: 'No Double or Triple Jumps', desc: 'Airborne obstacles strictly limited to single tabletops and progressive step-ups with forgiving down-slopes.' },
    { num: '07', category: 'safety', title: '10ft Emergency Exits', desc: '10-foot wide emergency evacuation portals positioned at opposite ends of the arena for rapid medical ingress.' },
    { num: '08', category: 'safety', title: 'Full-Course Caution Lighting', desc: 'Interlocked high-visibility LED perimeter strobe grid capable of instant yellow neutralization in <200ms.' },
    { num: '09', category: 'safety', title: 'Non-Blinding Arena Illumination', desc: 'High-CRI anti-glare diffused optics engineered specifically for helmet visors and high-speed youth eye tracking.' },
    { num: '10', category: 'geometry', title: 'Outside Footprint Staging', desc: '20-rider start line and chute physically isolated outside the live racing perimeter to eliminate active-track hazard.' },
    { num: '11', category: 'geometry', title: 'Opposite Entry & Exit Chutes', desc: 'One-way rider flow separating staging intake from post-heat recovery paddock at opposing arena boundaries.' },
    { num: '12', category: 'safety', title: '16" Tuff Block Safety Buffer', desc: '4-foot buffer zones between adjoining track lanes flanked by certified 16-inch high-density foam barriers.' },
    { num: '13', category: 'electrical', title: 'Passive RFID Staging Reader', desc: 'Non-powered RFID antennas at staging gate verify transponders and lock out unassigned or unverified bikes.' },
    { num: '14', category: 'electrical', title: '0.0V Battery Finish Line Reader', desc: 'Finish timing array powered strictly by 24V DC battery banks. Zero AC line voltage permitted on the track floor.' },
    { num: '15', category: 'electrical', title: 'Redundant Grounding Grid', desc: 'All arena electronics, gates, and metal infrastructure verified under 0.04 Ohm certified double grounding loops.' },
    { num: '16', category: 'safety', title: 'Pre-Action Dry-Pipe Fire Protection', desc: 'Specialized dry-pipe pre-action fire suppression charged over the arena floor to protect electric battery banks.' },
    { num: '17', category: 'safety', title: 'Non-Rigid Landing Markers', desc: 'Flexible high-contrast visual indicators located at down-slope landing transitions to guide youth trajectories.' },
    { num: '18', category: 'geometry', title: '1"–2" Axle Height Drop Bar', desc: 'Starting gate drop bar calibrated precisely 1" to 2" above youth front wheel axles to eliminate wheel-over roll.' },
    { num: '19', category: 'geometry', title: 'Dead-Flat Flush Recessed Gate', desc: 'Lowered starting bar drops into an under-grade channel with 0.0" tire deflection upon magnetic shear release.' },
    { num: '20', category: 'electrical', title: 'Dual 20ft/10ft Overhead Signals', desc: 'Two elevated traffic signal towers placed 20ft ahead and 10ft high with automated 10-second yellow alert.' },
  ];

  const filteredRules = selectedRuleCategory === 'all' 
    ? TRACK_RULES 
    : TRACK_RULES.filter(r => r.category === selectedRuleCategory);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24 text-slate-100 font-sans">
      {/* Institutional Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-800/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 p-8 sm:p-14 lg:p-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-3xl space-y-5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-[10px] font-black tracking-widest uppercase font-mono shadow-md">
                  USA E MOTO™ SANCTIONING AUTHORITY
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-900 text-blue-300 text-[10px] font-bold uppercase tracking-wider font-mono border border-slate-700">
                  NATIONAL REGULATORY CHARTER
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  GOOGLE WORKSPACE VERIFIED
                </span>
              </div>

              <h1 className="text-3xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                National Governance for <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-slate-100">
                  Youth Electric Motocross
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl">
                USA E MOTO™ establishes the standardized engineering, safety, classification, and timing regulations for youth electric arena motocross. We govern the national fleet standards and technical specifications for CX3 and CX5 competitive youth electric motocross categories across North America.
              </p>

              <div className="flex items-center gap-3 pt-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveSection('sanctioning')}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider font-mono transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
                >
                  <Shield className="w-4 h-4" />
                  <span>Sanctioning Handbook &amp; 20 Rules</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('franchise')}
                  className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-blue-300 font-bold text-xs uppercase tracking-wider font-mono border border-slate-700 transition-all flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Arena Joint Ventures</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('contact')}
                  className="px-6 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold font-mono border border-slate-800 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Executive Office</span>
                </button>
              </div>
            </div>

            {/* Institutional Seal & Corporate Credentials */}
            <div className="bg-slate-900/90 border border-slate-800 p-7 rounded-3xl min-w-[300px] lg:min-w-[340px] shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black font-mono text-lg shadow-inner">
                    USA
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase font-mono">USA E MOTO LLC</div>
                    <div className="text-[10px] text-slate-400 font-mono">Governing Body &bull; Est. 2026</div>
                  </div>
                </div>
                <Landmark className="w-5 h-5 text-slate-500" />
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Headquarters Domain:</span>
                  <span className="text-blue-400 font-bold">usaemoto.com</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Fleet Standard:</span>
                  <span className="text-white font-bold">80 Cobra Units (CX3/CX5)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Track Engineering:</span>
                  <span className="text-cyan-400 font-bold">20 Mandatory Specs</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Finish Protocol:</span>
                  <span className="text-emerald-400 font-bold">0V Line Voltage (Rule #14)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Verified Identity:</span>
                  <span className="text-slate-200 font-bold">admin@usaemoto.com</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-mono text-center">
                National Youth Electric Motocross Sanction
              </div>
            </div>
          </div>

          {/* Navigation Sub-Bar */}
          <div className="flex items-center gap-2 mt-10 pt-6 border-t border-slate-800/80 overflow-x-auto">
            {[
              { id: 'overview', label: 'Executive Charter', icon: Globe2 },
              { id: 'sanctioning', label: '20 Track Engineering Specs', icon: Shield },
              { id: 'governance', label: 'Cobra Fleet Governance', icon: Landmark },
              { id: 'franchise', label: 'Turnkey Arena JV Model', icon: Building2 },
              { id: 'procurement', label: 'Hardware Suite Procurement', icon: Cpu },
              { id: 'contact', label: 'Executive Inquiries', icon: Mail },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveSection(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeSection === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 1: EXECUTIVE CHARTER */}
      {activeSection === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Equitable Competition</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                By governing an identical fleet of 80 factory Cobra Moto machines, USA E MOTO™ completely removes mechanical spending advantages. Victory is determined solely by rider discipline, technique, and racecraft.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Indoor Arena Expansion</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero combustion emissions and low-decibel electric motors unlock climate-controlled urban arenas, civic convention facilities, and suburban entertainment parks operating year-round without noise complaints.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Standardized Safety Standards</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our 20 mandatory track specifications mandate 0.0V electrical floor architecture, sub-surface hydration, banned whoops, physical rider separation, and pre-action fire protection.
              </p>
            </div>
          </div>

          {/* Institutional Mission Quote - Proudly Independent */}
          <div className="bg-slate-950 border-2 border-blue-500/40 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <div className="max-w-3xl space-y-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest font-mono border border-blue-500/30">
                  AUTONOMOUS &bull; UNBIASED &bull; FOR THE FAMILIES
                </span>
                <span className="text-xs font-mono text-slate-400">Independent Sanctioning Charter</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight leading-tight">
                "Stronger Independent. Built Directly for the Families, the Racers, and the Future of Motorsport."
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                USA E MOTO™ operates with complete independence from equipment manufacturers and corporate interests. By remaining an autonomous governing authority, our loyalty belongs strictly to the riders, the parents, and the local arena operators. We mandate standardized, factory-governed equipment so victory is earned by discipline, balance, and pure racecraft—not a family's checkbook.
              </p>

              {/* The Community Safety Mission: From Public Roads to Sanctioned Arenas */}
              <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                  <span className="text-amber-400 font-bold block uppercase flex items-center gap-1.5">
                    <span>⚡</span> The Real-World Epidemic: Street E-Bikes
                  </span>
                  <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                    Across American towns from Salem, Massachusetts to suburban metro centers, thousands of youth are riding fast electric bikes on open public roadways without safety gear, medical standby, or traffic separation. Police crackdowns and street confiscations don't solve the problem—kids want to ride!
                  </p>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-2xl border border-emerald-500/30 space-y-1.5">
                  <span className="text-emerald-400 font-bold block uppercase flex items-center gap-1.5">
                    <span>🛡️</span> The USA E MOTO™ Arena Solution
                  </span>
                  <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                    Following proven indoor flat-track arena models expanding across Europe and France, USA E MOTO™ channels this boundless youth energy off hazardous asphalt into climate-controlled, professionally marshaled, and insured indoor arena tracks. We transform street riders into disciplined athletes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: 20 TRACK ENGINEERING SPECS */}
      {activeSection === 'sanctioning' && (
        <div className="space-y-8">
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">
                  SANCTIONING CRITERIA
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                  The 20 Mandatory Engineering Standards
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Every sanctioned USA E MOTO™ facility must certify adherence to all 20 requirements prior to license issuance.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
                {[
                  { id: 'all', label: 'All 20 Specs' },
                  { id: 'geometry', label: 'Track Geometry' },
                  { id: 'safety', label: 'Safety & Medical' },
                  { id: 'electrical', label: 'Electrical & 0V' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedRuleCategory(cat.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      selectedRuleCategory === cat.id
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredRules.map((rule) => (
                <div
                  key={rule.num}
                  className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        RULE #{rule.num}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1.5">{rule.title}</h4>
                    <p className="text-[11px] text-slate-400 leading-snug">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: COBRA FLEET GOVERNANCE */}
      {activeSection === 'governance' && (
        <div className="space-y-8">
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Machine Fleet Standard &amp; Rider Divisions
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Under USA E MOTO™ rules, machines and humans are separated by default. The 80-unit Cobra Moto fleet is maintained in isolated technical impound bays. Parents are alerted 10 minutes prior to gate staging to escort their rider to the chute.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-slate-950 border border-slate-800 p-7 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 uppercase bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    40 UNITS &bull; AGES 7–9
                  </span>
                  <span className="text-xs font-mono text-slate-400">10" Front Wheel</span>
                </div>
                <h4 className="text-2xl font-black text-white">Cobra Moto CX3</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  The foundational platform for novice to intermediate competitors. Factory-governed power delivery curves and standardized ergonomics.
                </p>
                <div className="space-y-2.5 text-xs font-mono pt-2">
                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Class C Division:</span>
                    <span className="text-white font-bold">Novice / Electric Balance Bike Transition</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Class B Division:</span>
                    <span className="text-cyan-400 font-bold">Intermediate Competitive Racing</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Impound Assignment:</span>
                    <span className="text-emerald-400 font-bold">Bays #1 to #40 (Rapid Swap)</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-7 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    40 UNITS &bull; AGES 10–12
                  </span>
                  <span className="text-xs font-mono text-slate-400">12" Front Wheel</span>
                </div>
                <h4 className="text-2xl font-black text-white">Cobra Moto CX5</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Senior youth competition platform featuring advanced quick-change lithium battery modules, adjustable regenerative engine braking, and full telemetry.
                </p>
                <div className="space-y-2.5 text-xs font-mono pt-2">
                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Class C Division:</span>
                    <span className="text-white font-bold">Developing Senior Youth</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Class B Division:</span>
                    <span className="text-cyan-400 font-bold">Advanced National Championship</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800 text-slate-400">
                    <span>Impound Assignment:</span>
                    <span className="text-emerald-400 font-bold">Bays #41 to #80 (Rapid Swap)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: FRANCHISE & ARENA JV */}
      {activeSection === 'franchise' && (
        <div className="space-y-8">
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Turnkey Arena Joint Venture Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              We partner with commercial real estate owners, municipalities, and sports venue developers to install and operate fully sanctioned electric arenas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-2xl font-black text-blue-400 font-mono">01</span>
                <h4 className="text-base font-bold text-white">Hardware &amp; Track Supply</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Turnkey delivery of 80 Cobra Moto machines, Go Gate™ 20-slot starting system, overhead traffic towers, and battery RFID scoring loops.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-2xl font-black text-blue-400 font-mono">02</span>
                <h4 className="text-base font-bold text-white">Enterprise Software Suite</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Go Racer™ race management, 60-day reservation engine with automated 7-day payment settlement, live telemetry, and parent mobile alerts.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3">
                <span className="text-2xl font-black text-blue-400 font-mono">03</span>
                <h4 className="text-base font-bold text-white">Turnkey Sanctioning &amp; Insurance</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Comprehensive participant motorsport liability coverage, official marshal training certification, and access to national championship qualifiers.
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setInquiryType('Arena Joint Venture / Franchise Inquiry');
                  setActiveSection('contact');
                }}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider font-mono transition-all shadow-lg shadow-blue-600/30"
              >
                Inquire Regarding Arena JV Partnership
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: HARDWARE SUITE PROCUREMENT */}
      {activeSection === 'procurement' && (
        <div className="space-y-8">
          <div className="bg-slate-900/90 border border-slate-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Procure Sanctioned Hardware &amp; Starting Systems
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Equip your venue with factory-direct, USA E MOTO™ certified equipment. Guaranteed compliance with Track Specifications #10, #14, #18, #19, and #20.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">FLAGSHIP ARENA BUNDLE</span>
                  <h4 className="text-lg font-bold text-white mt-1">Go Arena™ Complete Suite</h4>
                  <div className="text-xl font-mono font-black text-amber-400 my-2">$28,900</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Includes Go Gate™ Indoor Model v1 (20 slots), overhead signal towers, Go Win™ 0V RFID finish loop, Go Racer™ edge software, and 100 transponders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryType('Complete Go Arena Suite ($28,900)');
                    setActiveSection('contact');
                  }}
                  className="w-full mt-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-mono text-xs font-bold uppercase"
                >
                  Order Arena Package
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">STARTING GRID ONLY</span>
                  <h4 className="text-lg font-bold text-white mt-1">Go Gate™ Indoor Model v1</h4>
                  <div className="text-xl font-mono font-black text-cyan-400 my-2">$18,500</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    20-rider smart outside-footprint drop grid, 38ms release, 1"–2" front axle height, dead-flat flush surface recess, and Rule #20 signal towers.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryType('Go Gate Indoor Model v1 ($18,500)');
                    setActiveSection('contact');
                  }}
                  className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase border border-slate-700"
                >
                  Order Starting Gate
                </button>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">TIMING &amp; TELEMETRY</span>
                  <h4 className="text-lg font-bold text-white mt-1">Go Racer™ + Go Win™ Pair</h4>
                  <div className="text-xl font-mono font-black text-emerald-400 my-2">$12,400</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Smart battery-powered 24V finish line array (0.0V line voltage on dirt) paired with Go Racer™ local race manager and 50 transponders.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setInquiryType('Go Racer + Go Win Pair ($12,400)');
                    setActiveSection('contact');
                  }}
                  className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold uppercase border border-slate-700"
                >
                  Order Timing Pair
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: EXECUTIVE INQUIRIES */}
      {activeSection === 'contact' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 max-w-3xl mx-auto space-y-8 shadow-2xl">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 inline-block">
              EXECUTIVE HEADQUARTERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              USA E MOTO™ Executive Office
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Direct communication portal for municipal recreation departments, arena operators, and corporate partners.
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                @
              </div>
              <div>
                <span className="text-white font-bold block">Verified Google Workspace Domain:</span>
                <span className="text-blue-300">admin@usaemoto.com &bull; contact@usaemoto.com</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
              SPF / DKIM ACTIVE
            </span>
          </div>

          {inquirySubmitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-xl font-bold text-white">Executive Correspondence Transmitted</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Thank you for contacting USA E MOTO™. Your inquiry has been routed to our executive director. We will reply via our verified domain email shortly.
              </p>
              <button
                type="button"
                onClick={() => setInquirySubmitted(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="David Hanscom"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Corporate / Domain Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="dave@usaemoto.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Title / Role</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Executive Director / Venue Developer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Organization / Municipality</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="USA E MOTO LLC / Civic Sports Authority"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Subject / Inquiry Type</label>
                <select
                  value={inquiryType}
                  onChange={(e) => setInquiryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-blue-400 focus:outline-none font-mono"
                >
                  <option value="Arena Joint Venture / Franchise Inquiry">Arena Joint Venture / Franchise Inquiry</option>
                  <option value="Sanctioning Standards & Track Inspection">Sanctioning Standards &amp; Track Inspection</option>
                  <option value="Complete Go Arena Suite ($28,900)">Complete Go Arena Suite ($28,900)</option>
                  <option value="Go Gate Indoor Model v1 ($18,500)">Go Gate Indoor Model v1 ($18,500)</option>
                  <option value="Go Racer + Go Win Pair ($12,400)">Go Racer + Go Win Pair ($12,400)</option>
                  <option value="Cobra Moto Fleet Allocation">Cobra Moto Fleet Allocation (80 Units)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Executive Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Facility specifications, municipal zoning status, target deployment date..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:border-blue-400 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all font-mono shadow-xl shadow-blue-600/30"
              >
                Transmit Official Executive Inquiry
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
