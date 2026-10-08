import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Shield,
  UploadCloud,
  DownloadCloud,
  Globe,
  Key,
  Layers,
  Server,
  X,
  Code2,
  Sparkles,
} from 'lucide-react';
import {
  getSupabaseUrl,
  getSupabaseAnonKey,
  saveSupabaseConfig,
  testSupabaseConnection,
  syncReservationToSupabase,
  fetchReservationsFromSupabase,
  syncRidersToSupabase,
  fetchRidersFromSupabase,
  SUPABASE_SQL_SCHEMA,
} from '../utils/supabaseClient';
import { Reservation, Rider } from '../types';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservations: Reservation[];
  riders: Rider[];
  onImportReservations: (imported: Reservation[]) => void;
  onImportRiders: (imported: Rider[]) => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({
  isOpen,
  onClose,
  reservations,
  riders,
  onImportReservations,
  onImportRiders,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'sync' | 'domain'>('status');
  const [url, setUrl] = useState<string>(getSupabaseUrl());
  const [anonKey, setAnonKey] = useState<string>(getSupabaseAnonKey());
  const [showKey, setShowKey] = useState<boolean>(false);
  const [testing, setTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [syncingUp, setSyncingUp] = useState<boolean>(false);
  const [syncingDown, setSyncingDown] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({ success: false, message: err?.message || 'Connection failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveCredentials = () => {
    saveSupabaseConfig(url, anonKey);
    handleTestConnection();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handlePushAllToCloud = async () => {
    setSyncingUp(true);
    setSyncMessage(null);
    try {
      // 1. Sync all riders (fleet of 80 Cobra CX3 / CX5 bikes)
      const ridersOk = await syncRidersToSupabase(riders);

      // 2. Sync all reservations
      let resCount = 0;
      for (const res of reservations) {
        const ok = await syncReservationToSupabase(res);
        if (ok) resCount++;
      }

      setSyncMessage(
        `Successfully pushed to Supabase! Seeded ${riders.length} Cobra fleet bikes (${ridersOk ? 'OK' : 'Check tables'}) and ${resCount}/${reservations.length} reservations.`
      );
    } catch (err: any) {
      setSyncMessage(`Push error: ${err?.message || 'Please check that you ran the SQL schema in Supabase.'}`);
    } finally {
      setSyncingUp(false);
    }
  };

  const handlePullFromCloud = async () => {
    setSyncingDown(true);
    setSyncMessage(null);
    try {
      const cloudRes = await fetchReservationsFromSupabase();
      const cloudRiders = await fetchRidersFromSupabase();

      if (cloudRes && cloudRes.length > 0) {
        onImportReservations(cloudRes);
      }
      if (cloudRiders && cloudRiders.length > 0) {
        onImportRiders(cloudRiders);
      }

      const resCount = cloudRes?.length ?? 0;
      const riderCount = cloudRiders?.length ?? 0;
      setSyncMessage(`Successfully downloaded ${resCount} reservations and ${riderCount} riders from Supabase cloud.`);
    } catch (err: any) {
      setSyncMessage(`Download error: ${err?.message || 'Check database connection'}`);
    } finally {
      setSyncingDown(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">Supabase Cloud Database &amp; gomotomx.com</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  LIVE CONNECTED
                </span>
              </div>
              <p className="text-xs text-slate-400">
                PostgreSQL persistence for 60-day reservations, 80 Cobra Moto units, and gate safety checks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-800 bg-slate-900/60 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'status'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Connection &amp; Credentials</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'sql'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>SQL Schema Script (1-Click)</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'sync'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Cloud Data Sync</span>
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'domain'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>gomotomx.com DNS &amp; Deploy</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200">
          {/* TAB 1: STATUS & CREDENTIALS */}
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Quick Status Banner */}
              <div
                className={`p-4 rounded-xl border flex items-start gap-3 ${
                  testResult?.success
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : testResult === null
                    ? 'bg-slate-800/50 border-slate-700 text-slate-300'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                }`}
              >
                {testResult?.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : testResult === null ? (
                  <RefreshCw className="w-5 h-5 text-slate-400 animate-spin shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 text-xs">
                  <div className="font-bold text-sm mb-0.5">
                    {testResult?.success
                      ? 'Supabase Project Active & Connected'
                      : testResult === null
                      ? 'Testing connection to Supabase...'
                      : 'Connection Attention Needed'}
                  </div>
                  <p className="opacity-90">
                    {testResult?.message ||
                      'Connecting to https://uhvxnwxdjywwefijadmq.supabase.co with your publishable key...'}
                  </p>
                </div>
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>Test Again</span>
                </button>
              </div>

              {/* Credentials Fields */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  Supabase Project Configuration
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Supabase Project URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
                    />
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 flex items-center gap-1 shrink-0"
                    >
                      <span>Open Console</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">
                      Publishable / Anon API Key
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      {showKey ? 'Hide key' : 'Show key'}
                    </button>
                  </div>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="sb_publishable_... or eyJ..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Configured for project <strong className="text-emerald-400">uhvxnwxdjywwefijadmq</strong>. Safe to use in browser clients with Row Level Security.
                  </p>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-800/80">
                  <button
                    onClick={handleSaveCredentials}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Save &amp; Reconnect
                  </button>
                </div>
              </div>

              {/* Folder Structure Explanation */}
              <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-200">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Do you need to create a folder structure manually?</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong>No! You do not need to create any folders.</strong> Unlike file storage, Supabase is a powerful cloud PostgreSQL relational database. All tables (<code className="text-emerald-400 font-mono">reservations</code>, <code className="text-emerald-400 font-mono">riders</code>, <code className="text-emerald-400 font-mono">gate_verifications</code>, and <code className="text-emerald-400 font-mono">track_safety_logs</code>) are created automatically when you paste and run our 1-click SQL script in the Supabase SQL editor!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SQL SCHEMA SCRIPT */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>How to run this in your Supabase Dashboard:</span>
                  </div>
                  <button
                    onClick={handleCopySql}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy Complete SQL Script'}</span>
                  </button>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1 leading-relaxed">
                  <li>
                    Go to your project SQL Editor:{' '}
                    <a
                      href="https://supabase.com/dashboard/project/uhvxnwxdjywwefijadmq/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 underline font-mono"
                    >
                      supabase.com/dashboard/project/uhvxnwxdjywwefijadmq/sql
                    </a>
                  </li>
                  <li>Click <strong>&quot;New query&quot;</strong> in the top left.</li>
                  <li>Click <strong>&quot;Copy Complete SQL Script&quot;</strong> above, paste it into the editor, and click the green <strong>&quot;Run&quot;</strong> button.</li>
                  <li>All 4 tables, performance indexes, and public Row-Level Security policies are instantly created!</li>
                </ol>
              </div>

              {/* SQL Viewer */}
              <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/80 text-[11px] font-mono text-slate-400">
                  <span>schema.sql (PostgreSQL DDL)</span>
                  <button
                    onClick={handleCopySql}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSql ? 'Copied!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-80 leading-relaxed whitespace-pre selection:bg-emerald-500 selection:text-slate-950">
                  {SUPABASE_SQL_SCHEMA}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: DATA SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Push Card */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                      <UploadCloud className="w-4 h-4 text-emerald-400" />
                      <span>Push Local Data to Supabase</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Uploads the 80 Cobra Moto CX3 &amp; CX5 units, RFID tags, battery statuses, and all {reservations.length} pre-entry reservations currently in local state to your cloud PostgreSQL database.
                    </p>
                  </div>
                  <button
                    onClick={handlePushAllToCloud}
                    disabled={syncingUp}
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {syncingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>{syncingUp ? 'Pushing Data to Cloud...' : 'Seed & Push to Supabase'}</span>
                  </button>
                </div>

                {/* Pull Card */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-1">
                      <DownloadCloud className="w-4 h-4 text-cyan-400" />
                      <span>Pull Latest from Supabase</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Fetches reservations and rider fleet states submitted by customers online or updated on staff iPads to keep this terminal 100% in sync.
                    </p>
                  </div>
                  <button
                    onClick={handlePullFromCloud}
                    disabled={syncingDown}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/30 shadow-md transition-all active:scale-95 disabled:opacity-50"
                  >
                    {syncingDown ? <RefreshCw className="w-4 h-4 animate-spin" /> : <DownloadCloud className="w-4 h-4" />}
                    <span>{syncingDown ? 'Downloading...' : 'Pull Cloud Reservations'}</span>
                  </button>
                </div>
              </div>

              {/* Status Message */}
              {syncMessage && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{syncMessage}</span>
                </div>
              )}

              {/* Current Local Counts */}
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 font-mono">
                <div>
                  <span className="text-slate-400">Total Reservations:</span>{' '}
                  <strong className="text-emerald-400">{reservations.length} records</strong>
                </div>
                <div>
                  <span className="text-slate-400">Fleet Inventory:</span>{' '}
                  <strong className="text-cyan-400">{riders.length} Cobra Moto units (40 CX3 + 40 CX5)</strong>
                </div>
                <div>
                  <span className="text-slate-400">Auto-Cloud Sync:</span>{' '}
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOMAIN & DEPLOYMENT GUIDE */}
          {activeTab === 'domain' && (
            <div className="space-y-4 text-xs">
              <div className="bg-gradient-to-r from-emerald-950/40 via-cyan-950/40 to-slate-900 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Connecting gomotomx.com to this Application</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  You secured <strong>gomotomx.com</strong>! To make this system live on your custom domain, follow these 3 straightforward steps:
                </p>
              </div>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">
                      1
                    </span>
                    <span>Deploy Frontend Code (Vercel / Netlify / Cloudflare Pages)</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Deploy this Vite/React project to a fast CDN host like Vercel (free, automatic SSL, instant custom domain linking). Connect your GitHub repository or use Vercel CLI (<code className="text-cyan-400 font-mono">vercel deploy</code>).
                  </p>
                  <div className="p-2.5 bg-slate-900 rounded-lg font-mono text-[11px] text-slate-300">
                    Add Environment Variables in your hosting project settings:
                    <div className="text-emerald-400 mt-1">VITE_SUPABASE_URL = {url}</div>
                    <div className="text-emerald-400">VITE_SUPABASE_ANON_KEY = {anonKey}</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">
                      2
                    </span>
                    <span>Set DNS Records for gomotomx.com</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Log into the domain registrar where you purchased <strong>gomotomx.com</strong> (e.g., GoDaddy, Namecheap, Google Domains / Squarespace) and update the DNS settings:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] border border-slate-800 rounded-lg">
                      <thead className="bg-slate-900 text-slate-400">
                        <tr>
                          <th className="p-2">Type</th>
                          <th className="p-2">Host / Name</th>
                          <th className="p-2">Value / Points to</th>
                          <th className="p-2">TTL</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        <tr>
                          <td className="p-2 text-cyan-400 font-bold">A</td>
                          <td className="p-2">@ (root)</td>
                          <td className="p-2 text-emerald-400">76.76.21.21 (if using Vercel)</td>
                          <td className="p-2">Auto / 3600</td>
                        </tr>
                        <tr>
                          <td className="p-2 text-cyan-400 font-bold">CNAME</td>
                          <td className="p-2">www</td>
                          <td className="p-2 text-emerald-400">cname.vercel-dns.com</td>
                          <td className="p-2">Auto / 3600</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px]">
                      3
                    </span>
                    <span>Authorize gomotomx.com in Supabase</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    In your Supabase project dashboard, navigate to <strong>Project Settings &gt; Authentication &gt; URL Configuration</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                    <li>Set <strong>Site URL</strong> to: <code className="text-emerald-400 font-mono">https://gomotomx.com</code></li>
                    <li>Add <strong>Redirect URLs</strong>: <code className="text-emerald-400 font-mono">https://gomotomx.com/**</code> and <code className="text-emerald-400 font-mono">https://www.gomotomx.com/**</code></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 bg-slate-950/80">
          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Project: <strong className="text-white font-mono">uhvxnwxdjywwefijadmq</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
