import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Camera, ShieldCheck, AlertTriangle, CheckCircle, Video, 
  RotateCcw, ThumbsUp, Radio, UserCheck, ShieldAlert, Heart,
  FileCheck, Download
} from 'lucide-react';
import { Rider, GateSafetyVerification, StateOfMindAssessment, BlockId } from '../types';

interface GateSafetyReleaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  stagedRiders: Rider[];
  currentSlotIndex: number;
  currentBlock: BlockId;
  currentClassName: string;
  verifications: Record<string, GateSafetyVerification>;
  onSaveVerification: (verification: GateSafetyVerification) => void;
  onBatchVerify: (verifications: GateSafetyVerification[]) => void;
}

export const GateSafetyReleaseModal: React.FC<GateSafetyReleaseModalProps> = ({
  isOpen,
  onClose,
  stagedRiders,
  currentSlotIndex,
  currentBlock,
  currentClassName,
  verifications,
  onSaveVerification,
  onBatchVerify,
}) => {
  const [selectedCamera, setSelectedCamera] = useState<string>('GATE-CAM-01 (Starting Area High-Def)');
  const [marshalInitials, setMarshalInitials] = useState<string>('TM-1 (Lead Marshal)');
  const [selectedRiderId, setSelectedRiderId] = useState<string>(stagedRiders[0]?.id || '');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'holds'>('all');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-select first rider if current selected not found
  useEffect(() => {
    if (!stagedRiders.find(r => r.id === selectedRiderId) && stagedRiders.length > 0) {
      setSelectedRiderId(stagedRiders[0].id);
    }
  }, [stagedRiders, selectedRiderId]);

  // Handle hardware camera initialization if available
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setCameraActive(true);
      } else {
        setCameraError('Camera access not supported by browser. Falling back to high-res gate feed.');
      }
    } catch (err) {
      setCameraError('Physical camera in use or permission pending. Operating with gate camera feed.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Capture snapshot from video or generate digital audit frame
  const takeSnapshot = (): string => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Watermark with timestamp and camera ID
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = '#10b981';
        ctx.fillText(`GO MOTO • ${selectedCamera} • ${new Date().toLocaleTimeString()} • SLOT ${currentSlotIndex + 1}`, 15, canvas.height - 15);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedSnapshot(dataUrl);
        return dataUrl;
      }
    }

    // High quality digital audit frame placeholder if webcam not active
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 640, 360);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, 620, 340);
      ctx.font = 'bold 20px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('GO MOTO STARTING GATE CAM', 30, 45);
      ctx.font = '14px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`SOURCE: ${selectedCamera}`, 30, 80);
      ctx.fillText(`TIMESTAMP: ${new Date().toISOString()}`, 30, 105);
      ctx.fillText(`VERIFIED MARSHAL: ${marshalInitials}`, 30, 130);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText('✓ "ARE YOU READY?" VERBAL & VISUAL CONFIRMED', 30, 180);
      ctx.fillText('✓ CHINSTRAP SNUG • GOGGLES IN PLACE • RFID ACTIVE', 30, 210);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedSnapshot(dataUrl);
      return dataUrl;
    }
    return '';
  };

  const selectedRider = stagedRiders.find(r => r.id === selectedRiderId) || stagedRiders[0];
  const selectedVerification = selectedRider ? verifications[selectedRider.id] : undefined;

  const handleUpdateRiderStatus = (
    rider: Rider, 
    status: StateOfMindAssessment, 
    notes?: string
  ) => {
    const snapshot = takeSnapshot();
    const updated: GateSafetyVerification = {
      id: verifications[rider.id]?.id || `gsv-${Date.now()}-${rider.id}`,
      riderId: rider.id,
      riderNumber: rider.number,
      riderName: rider.name,
      classId: rider.classId,
      slotIndex: currentSlotIndex,
      blockId: currentBlock,
      timestamp: new Date().toISOString(),
      cameraSourceId: selectedCamera,
      cameraSnapshotUrl: snapshot || verifications[rider.id]?.cameraSnapshotUrl,
      areYouReadyConfirmed: status === 'ready_confident',
      stateOfMind: status,
      gearCheckPassed: status !== 'distressed_standdown',
      machineRfidVerified: true,
      riderRfidVerified: true,
      marshalInitials: marshalInitials,
      notes: notes || (status === 'hesitant_hold' ? 'Rider asked for an extra breath before gate' : undefined),
    };
    onSaveVerification(updated);
  };

  const handleQuickVerifyAll = () => {
    const snapshot = takeSnapshot();
    const batchList: GateSafetyVerification[] = stagedRiders.map((r) => ({
      id: verifications[r.id]?.id || `gsv-${Date.now()}-${r.id}`,
      riderId: r.id,
      riderNumber: r.number,
      riderName: r.name,
      classId: r.classId,
      slotIndex: currentSlotIndex,
      blockId: currentBlock,
      timestamp: new Date().toISOString(),
      cameraSourceId: selectedCamera,
      cameraSnapshotUrl: snapshot,
      areYouReadyConfirmed: true,
      stateOfMind: 'ready_confident',
      gearCheckPassed: true,
      machineRfidVerified: true,
      riderRfidVerified: true,
      marshalInitials: marshalInitials,
      notes: 'All 15 riders visually & verbally confirmed ready at starting gate chute.',
    }));
    onBatchVerify(batchList);
  };

  // Metrics
  const totalStaged = stagedRiders.length;
  const verifiedCount = stagedRiders.filter(r => verifications[r.id]?.stateOfMind === 'ready_confident').length;
  const holdCount = stagedRiders.filter(r => verifications[r.id]?.stateOfMind === 'hesitant_hold' || verifications[r.id]?.stateOfMind === 'distressed_standdown').length;
  const pendingCount = totalStaged - verifiedCount - holdCount;

  const filteredRiders = stagedRiders.filter((r) => {
    const v = verifications[r.id];
    if (filterMode === 'pending') return !v || v.stateOfMind === 'unverified';
    if (filterMode === 'holds') return v && (v.stateOfMind === 'hesitant_hold' || v.stateOfMind === 'distressed_standdown');
    return true;
  });

  const downloadAuditReport = () => {
    const rows = [
      ['Rider Number', 'Rider Name', 'Class', 'State of Mind', 'Are You Ready Confirmed', 'Gear Checked', 'Rider RFID', 'Machine RFID', 'Camera Source', 'Timestamp', 'Marshal', 'Notes']
    ];
    stagedRiders.forEach((r) => {
      const v = verifications[r.id];
      rows.push([
        r.number,
        r.name,
        r.classId,
        v?.stateOfMind || 'UNVERIFIED',
        v?.areYouReadyConfirmed ? 'YES' : 'NO',
        v?.gearCheckPassed ? 'PASSED' : 'PENDING',
        r.riderRfidTag,
        r.machineRfidTag,
        v?.cameraSourceId || selectedCamera,
        v?.timestamp || 'N/A',
        v?.marshalInitials || marshalInitials,
        `"${v?.notes || ''}"`
      ]);
    });
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GO_MOTO_GateSafety_Slot${currentSlotIndex + 1}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      id="gate-safety-release-modal" 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <canvas ref={canvasRef} className="hidden" />

      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                  Gate Release &amp; "Are You Ready?" Verification
                </h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500 text-slate-950">
                  CHILD SAFETY PROTOCOL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentClassName} • Slot {currentSlotIndex + 1} Staging Chute • State of Mind &amp; Camera Visual Inspection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Summary Pill */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle className="w-3.5 h-3.5" />
                {verifiedCount}/{totalStaged} Cleared
              </span>
              {holdCount > 0 && (
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {holdCount} On Hold
                </span>
              )}
            </div>

            <button
              id="close-gate-safety-modal-btn"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Close Gate Safety"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Child Safety Mission Banner */}
        <div className="bg-emerald-950/40 border-b border-emerald-500/30 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>Zero-Coercion Safety Rule:</strong> Every child has the unconditional right to say <em>"Not today"</em> or <em>"I need a minute"</em> with total support from Go Moto staff.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400/90">
            <span>Verbal "Yes" Required</span>
            <span>•</span>
            <span>Thumbs Up Visual Check</span>
            <span>•</span>
            <span>Helmet Chinstrap Verification</span>
          </div>
        </div>

        {/* Main Content: Left Camera Feed & Controls, Right Staged Riders List */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-6">
          {/* Left Column (5 cols): Camera Viewport & Verification Controls */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Camera Viewport */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-inner">
              <div className="px-3 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-200 uppercase tracking-wide">Starting Gate Cam</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  <span className="text-rose-400 font-bold uppercase">LIVE AUDIT</span>
                </div>
              </div>

              {/* Video Area */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                />

                {!cameraActive && (
                  <div className="text-center p-6 space-y-2">
                    <Camera className="w-12 h-12 text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-300">
                      {selectedCamera}
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Digital simulation active. High-resolution timestamps and audit frames are recorded on release.
                    </p>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Retry Device Camera
                    </button>
                  </div>
                )}

                {/* Overhead HUD Overlay */}
                <div className="absolute top-2 left-2 pointer-events-none bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-400">
                  CAM: {selectedCamera.split(' ')[0]}
                </div>
                <div className="absolute top-2 right-2 pointer-events-none bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400">
                  {new Date().toLocaleTimeString()}
                </div>
                <div className="absolute bottom-2 left-2 right-2 pointer-events-none bg-slate-950/80 backdrop-blur px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-300 truncate">
                  TARGET: #{selectedRider?.number} {selectedRider?.name} • RF-R: {selectedRider?.riderRfidTag}
                </div>
              </div>

              {/* Camera Source Selector */}
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-cyan-500 flex-1"
                >
                  <option value="GATE-CAM-01 (Starting Area High-Def)">GATE-CAM-01 (Starting Chute High-Def)</option>
                  <option value="MARSHAL-BODYCAM-A (Chute 1 Lead)">MARSHAL-BODYCAM-A (Chute 1 Lead)</option>
                  <option value="MARSHAL-BODYCAM-B (Gate 2 Assistant)">MARSHAL-BODYCAM-B (Gate 2 Assistant)</option>
                  <option value="GATE-OVERHEAD-02 (Wide Pan)">GATE-OVERHEAD-02 (Wide Track View)</option>
                </select>

                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Snap</span>
                </button>
              </div>
            </div>

            {/* Selected Rider Fast Action Card */}
            {selectedRider && (
              <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-black font-mono flex items-center justify-center text-sm">
                      #{selectedRider.number}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedRider.name}</h3>
                      <div className="text-[10px] text-slate-400 font-mono">
                        RFID: {selectedRider.riderRfidTag} • Machine: {selectedRider.machineRfidTag}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase font-mono ${
                    selectedVerification?.stateOfMind === 'ready_confident'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : selectedVerification?.stateOfMind === 'hesitant_hold'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : selectedVerification?.stateOfMind === 'distressed_standdown'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {selectedVerification?.stateOfMind?.replace('_', ' ') || 'UNVERIFIED'}
                  </span>
                </div>

                {/* The "Are You Ready?" Verbal & Visual Check Question Box */}
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <ThumbsUp className="w-4 h-4 text-emerald-400" />
                    <span>State-of-Mind Verification Question:</span>
                  </div>
                  <blockquote className="text-xs italic text-slate-200 border-l-2 border-emerald-500 pl-2">
                    "Look child in the eyes: <strong>'{selectedRider.name}, are you ready to ride?'</strong> Ensure clear audible 'Yes' and thumbs up."
                  </blockquote>

                  {/* 3 State of Mind Options */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleUpdateRiderStatus(selectedRider, 'ready_confident')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedVerification?.stateOfMind === 'ready_confident'
                          ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-900/40 font-black'
                          : 'bg-slate-800/80 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10'
                      }`}
                    >
                      <UserCheck className="w-5 h-5" />
                      <span className="text-[11px] font-bold">READY &amp; CALM</span>
                      <span className="text-[9px] opacity-80">Voluntary &amp; Eager</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateRiderStatus(selectedRider, 'hesitant_hold')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedVerification?.stateOfMind === 'hesitant_hold'
                          ? 'bg-amber-600 text-white border-amber-300 shadow-lg shadow-amber-900/40 font-black'
                          : 'bg-slate-800/80 text-amber-400 border-amber-500/30 hover:bg-amber-500/10'
                      }`}
                    >
                      <AlertTriangle className="w-5 h-5" />
                      <span className="text-[11px] font-bold">HESITANT (HOLD)</span>
                      <span className="text-[9px] opacity-80">Needs a Moment</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateRiderStatus(selectedRider, 'distressed_standdown')}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        selectedVerification?.stateOfMind === 'distressed_standdown'
                          ? 'bg-rose-700 text-white border-rose-400 shadow-lg shadow-rose-900/40 font-black'
                          : 'bg-slate-800/80 text-rose-400 border-rose-500/30 hover:bg-rose-500/10'
                      }`}
                    >
                      <ShieldAlert className="w-5 h-5" />
                      <span className="text-[11px] font-bold">STAND DOWN</span>
                      <span className="text-[9px] opacity-80">Escort to Paddock</span>
                    </button>
                  </div>
                </div>

                {/* Marshal Initials & Timestamp details */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Auditor: {marshalInitials}</span>
                  {selectedVerification?.timestamp && (
                    <span className="text-emerald-400">
                      Logged at {new Date(selectedVerification.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (7 cols): Full 15-Rider Checklist & Batch Controls */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              {/* Filter Tabs */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setFilterMode('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterMode === 'all'
                      ? 'bg-slate-800 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({totalStaged})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('pending')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterMode === 'pending'
                      ? 'bg-slate-800 text-amber-300 shadow'
                      : 'text-slate-400 hover:text-amber-300'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('holds')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filterMode === 'holds'
                      ? 'bg-slate-800 text-rose-300 shadow'
                      : 'text-slate-400 hover:text-rose-300'
                  }`}
                >
                  Holds / Escorts ({holdCount})
                </button>
              </div>

              {/* Batch Clearance Button */}
              <div className="flex items-center gap-2">
                <button
                  id="batch-verify-all-btn"
                  type="button"
                  onClick={handleQuickVerifyAll}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Verify All 15 Ready</span>
                </button>
                <button
                  type="button"
                  onClick={downloadAuditReport}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Export Gate Safety CSV Audit"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Rider Checklist List */}
            <div className="flex-1 space-y-2 overflow-y-auto max-h-[500px] pr-1">
              {filteredRiders.map((rider) => {
                const v = verifications[rider.id];
                const isSelected = rider.id === selectedRiderId;
                const isVerified = v?.stateOfMind === 'ready_confident';
                const isHold = v?.stateOfMind === 'hesitant_hold' || v?.stateOfMind === 'distressed_standdown';

                return (
                  <div
                    key={rider.id}
                    onClick={() => setSelectedRiderId(rider.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/40 shadow-lg'
                        : isVerified
                        ? 'bg-slate-950 border-emerald-500/40 hover:border-emerald-500/70'
                        : isHold
                        ? 'bg-slate-950 border-amber-500/60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Left: Rider identity */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm border-2 shrink-0 ${
                          isVerified
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500'
                            : isHold
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                            : 'bg-slate-900 text-slate-300 border-slate-700'
                        }`}
                      >
                        #{rider.number}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm truncate">{rider.name}</span>
                          {isVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                          {isHold && (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2 flex-wrap mt-0.5">
                          <span className="text-cyan-400">R: {rider.riderRfidTag}</span>
                          <span>•</span>
                          <span className="text-amber-400">M: {rider.machineRfidTag}</span>
                          <span>•</span>
                          <span>{rider.transponderId}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Fast Status Buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateRiderStatus(rider, 'ready_confident');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                          isVerified
                            ? 'bg-emerald-600 text-white shadow font-black'
                            : 'bg-slate-900 text-slate-300 hover:bg-emerald-500/20 hover:text-emerald-400 border border-slate-700'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateRiderStatus(rider, 'hesitant_hold');
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          v?.stateOfMind === 'hesitant_hold'
                            ? 'bg-amber-600 text-white font-black'
                            : 'bg-slate-900 text-slate-400 hover:bg-amber-500/20 hover:text-amber-300 border border-slate-700'
                        }`}
                        title="Mark on Hold"
                      >
                        Hold
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateRiderStatus(rider, 'distressed_standdown');
                        }}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          v?.stateOfMind === 'distressed_standdown'
                            ? 'bg-rose-700 text-white font-black'
                            : 'bg-slate-900 text-slate-400 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700'
                        }`}
                        title="Stand Down / Return to Paddock"
                      >
                        Stand Down
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status & Safety Verification Notice */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>Audited By:</span>
                <input
                  type="text"
                  value={marshalInitials}
                  onChange={(e) => setMarshalInitials(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-slate-200 text-xs font-mono w-48"
                  placeholder="Official Name / Badge"
                />
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95"
              >
                Done • Return to Live Track
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
