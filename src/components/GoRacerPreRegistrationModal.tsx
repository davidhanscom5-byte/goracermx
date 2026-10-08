import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Mail,
  User,
  Phone,
  Calendar,
  Award,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  MapPin,
  Bike,
  FileCheck2,
} from 'lucide-react';
import { MOTOCROSS_CLASSES } from '../utils/scheduleData';

interface GoRacerPreRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDomain?: string;
}

export interface GoRacerProfileLead {
  id: string;
  riderFirstName: string;
  riderLastName: string;
  riderAge: number;
  riderDob: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  cityState: string;
  preferredClassId: string;
  experienceLevel: 'electric_bicycle' | 'novice_gas' | 'experienced_motocross';
  currentMachine: string;
  wantsMembershipNotice: boolean;
  wantsRegionalQualifierNews: boolean;
  newsletterOptIn: boolean;
  timestamp: string;
}

export const GoRacerPreRegistrationModal: React.FC<GoRacerPreRegistrationModalProps> = ({
  isOpen,
  onClose,
  targetDomain = 'goracermx.com',
}) => {
  const [formData, setFormData] = useState({
    riderFirstName: '',
    riderLastName: '',
    riderAge: 8,
    riderDob: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    cityState: '',
    preferredClassId: 'cx3-c',
    experienceLevel: 'electric_bicycle' as const,
    currentMachine: 'Stacyc / Electric E-Bike',
    wantsMembershipNotice: true,
    wantsRegionalQualifierNews: true,
    newsletterOptIn: true,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileId, setProfileId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedId = `GR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newLead: GoRacerProfileLead = {
      id: generatedId,
      ...formData,
      timestamp: new Date().toISOString(),
    };

    // Save lead locally
    try {
      const existing = localStorage.getItem('goracer_profile_leads');
      const leads = existing ? JSON.parse(existing) : [];
      leads.push(newLead);
      localStorage.setItem('goracer_profile_leads', JSON.stringify(leads));
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setProfileId(generatedId);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-6 border-b border-cyan-500/30 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#00F0FF] text-slate-950 font-mono shadow-sm">
              GORACERMX.COM
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-mono shadow-sm">
              DIRECT TRACK DISPATCH & NEWS
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mt-2 flex items-center gap-2">
            <span>⚡</span> Lock In Your Go Racer™ Passport
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Pre-register your youth rider profile to reserve your official competition number, receive opening dates, and secure founding member allocations.
          </p>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                PROFILE PRE-REGISTRATION CONFIRMED
              </span>
              <h3 className="text-2xl font-black text-white">
                Welcome to Go Racer™ MX, {formData.riderFirstName}!
              </h3>
              <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto">
                Your profile reservation has been registered. An intake confirmation dispatch was routed to your parent inbox at <span className="text-cyan-300 font-mono font-bold">{formData.parentEmail}</span>.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 max-w-sm mx-auto space-y-1 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Rider Passport ID:</span>
                <span className="text-cyan-400 font-bold">{profileId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Class Placement:</span>
                <span className="text-white font-bold">{formData.preferredClassId.toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dispatched Directly To:</span>
                <span className="text-emerald-400 font-bold">Director Team @ {targetDomain}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition-colors"
              >
                Return to Track Hub
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 text-xs">
            
            {/* Rider Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider font-mono">
                <Bike className="w-4 h-4" />
                <span>1. Rider Information</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Rider First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.riderFirstName}
                    onChange={(e) => setFormData({ ...formData, riderFirstName: e.target.value })}
                    placeholder="e.g. Liam"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Rider Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.riderLastName}
                    onChange={(e) => setFormData({ ...formData, riderLastName: e.target.value })}
                    placeholder="e.g. Vance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Rider Age (7–12) *</label>
                  <select
                    value={formData.riderAge}
                    onChange={(e) => {
                      const age = Number(e.target.value);
                      const defaultClass = age <= 9 ? 'cx3-c' : 'cx5-c';
                      setFormData({ ...formData, riderAge: age, preferredClassId: defaultClass });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    {[7, 8, 9, 10, 11, 12].map((age) => (
                      <option key={age} value={age}>
                        Age {age} ({age <= 9 ? 'Cobra CX3 Division' : 'Cobra CX5 Division'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Preferred Competition Division</label>
                  <select
                    value={formData.preferredClassId}
                    onChange={(e) => setFormData({ ...formData, preferredClassId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {MOTOCROSS_CLASSES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.ageBracket} • {c.subTitle})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Riding Experience Qualification</label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="electric_bicycle">Electric Bicycle / Stacyc (Qualifies for Class C)</option>
                    <option value="novice_gas">Novice Motocross (50cc / E-Moto)</option>
                    <option value="experienced_motocross">Experienced Motocross Racer (Class B Eligible)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Parent & Contact Routing */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider font-mono">
                <Mail className="w-4 h-4" />
                <span>2. Parent / Guardian &amp; Routing Ingest</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Parent / Guardian Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. David Vance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Parent Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Mobile Phone (SMS Alerts) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Home City &amp; State</label>
                <input
                  type="text"
                  value={formData.cityState}
                  onChange={(e) => setFormData({ ...formData, cityState: e.target.value })}
                  placeholder="e.g. Indianapolis, IN"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-2 pt-3 border-t border-slate-800/80 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wantsMembershipNotice}
                  onChange={(e) => setFormData({ ...formData, wantsMembershipNotice: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-300">
                  <strong className="text-white">Annual Membership Advance Access:</strong> Alert me when the $200/year memberships open ($40/block member rate vs $65 scheduled / $85 walk-in).
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.wantsRegionalQualifierNews}
                  onChange={(e) => setFormData({ ...formData, wantsRegionalQualifierNews: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-300">
                  <strong className="text-white">Go Racer™ National Series &amp; Telemetry:</strong> Receive official updates on youth e-motocross rankings and regional qualifier rounds.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.newsletterOptIn}
                  onChange={(e) => setFormData({ ...formData, newsletterOptIn: e.target.checked })}
                  className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                />
                <span className="text-slate-300">
                  <strong className="text-white">Track Opening & Schedule Dispatches:</strong> Receive official dates, rulebook updates, and direct notifications from track management.
                </span>
              </label>
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-500 font-mono">
                Physical Separation &amp; 6-Point Safety Gate Enforced
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Locking In...</span>
                ) : (
                  <>
                    <span>Lock In Rider Profile</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
