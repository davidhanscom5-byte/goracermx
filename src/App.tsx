import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Header } from './components/Header';
import { ActiveDomainBar } from './components/ActiveDomainBar';
import { GoRacerPreRegistrationModal } from './components/GoRacerPreRegistrationModal';
import { EcosystemDomain, DOMAIN_CONFIGS, detectEcosystemDomain } from './utils/domainRouter';
import { LiveTrackControl } from './components/LiveTrackControl';
import { FlagControls } from './components/FlagControls';
import { BatteryPaddockMonitor } from './components/BatteryPaddockMonitor';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { RiderRosterView } from './components/RiderRosterView';
import { KioskDisplay } from './components/KioskDisplay';
import { PreEntryReservationView } from './components/PreEntryReservationView';
import { TrackTelemetrySpecsView } from './components/TrackTelemetrySpecsView';
import { GoGateProductShowcase } from './components/GoGateProductShowcase';
import { GoWinBroadcastScoring } from './components/GoWinBroadcastScoring';
import { USAEMotoCorporatePortal } from './components/USAEMotoCorporatePortal';
import { GoRacerGlobalNetworkView } from './components/GoRacerGlobalNetworkView';
import { GoRacerGoWinHardwareSuite } from './components/GoRacerGoWinHardwareSuite';
import { AutoFlaggerMechanismShowcase } from './components/AutoFlaggerMechanismShowcase';
import { ESP32FirmwareSchematicView } from './components/ESP32FirmwareSchematicView';
import { ClientPreRegistrationScreen } from './components/ClientPreRegistrationScreen';
import { GateSafetyReleaseModal } from './components/GateSafetyReleaseModal';
import { MachineImpoundPickupAlert } from './components/MachineImpoundPickupAlert';
import { SupabaseSyncModal } from './components/SupabaseSyncModal';
import { MachineMarshallTerminal } from './components/MachineMarshallTerminal';
import { RegistrationDeskTerminal } from './components/RegistrationDeskTerminal';
import { StandalonePackagesView, StandaloneProductPackage } from './components/StandalonePackagesView';
import { BlockId, TrackFlag, Rider, SessionSlot, Reservation, SessionPhase, GateSafetyVerification, ActiveRoleTerminal } from './types';
import { MOTOCROSS_CLASSES, BLOCKS_CONFIG, generateBlockSchedule } from './utils/scheduleData';
import { INITIAL_RIDERS } from './data/initialRiders';
import { INITIAL_RESERVATIONS } from './utils/reservationData';
import { trackAudio } from './utils/soundEffects';
import {
  syncReservationToSupabase,
  syncGateVerificationToSupabase,
  syncRidersToSupabase,
  fetchReservationsFromSupabase,
  fetchRidersFromSupabase,
} from './utils/supabaseClient';
import { Clock, Users, Calendar, BatteryCharging, Zap, Trophy, Shield, FileCheck2, ExternalLink, Camera, ShieldCheck, Database, Building2, AlertTriangle } from 'lucide-react';

export default function App() {
  // Navigation & Block State
  const [isGoRacerPreRegOpen, setIsGoRacerPreRegOpen] = useState<boolean>(() => { try { const p = new URLSearchParams(window.location.search); return p.get('prereg') === 'true'; } catch { return false; } });
  const [currentDomain, setCurrentDomain] = useState<EcosystemDomain>(() => detectEcosystemDomain());
  const [currentBlock, setCurrentBlock] = useState<BlockId>('morning');
  const [activeTab, setActiveTab] = useState<'live' | 'schedule' | 'roster' | 'paddock' | 'reservations' | 'track-specs' | 'gate-products' | 'win-scoring' | 'corporate' | 'go-global' | 'hardware-suite' | 'auto-flagger' | 'esp32-firmware'>(() => {
    const detected = detectEcosystemDomain();
    if (detected === 'usaemoto.com') return 'corporate';
    if (detected === 'goflagmx.com') return 'auto-flagger';
    if (detected === 'gogatemx.com') return 'gate-products';
    if (detected === 'gowinmx.com') return 'win-scoring';
    if (detected === 'goracermx.com') return 'go-global';
    return 'live';
  });

  const handleDomainSelect = (dom: EcosystemDomain) => {
    setCurrentDomain(dom);
    if (dom === 'usaemoto.com') setActiveTab('corporate');
    else if (dom === 'goflagmx.com') setActiveTab('auto-flagger');
    else if (dom === 'gogatemx.com') setActiveTab('gate-products');
    else if (dom === 'gowinmx.com') setActiveTab('win-scoring');
    else if (dom === 'goracermx.com') setActiveTab('go-global');
    else if (dom === 'gomotomx.com') setActiveTab('track-specs');
    else setActiveTab('live');
  };

  // Role-Based Fixed Station Terminal Navigation
  const [activeTerminal, setActiveTerminal] = useState<ActiveRoleTerminal>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const role = params.get('role') || params.get('terminal') || params.get('view') || params.get('mode');
      if (role === 'marshall' || role === 'machine-marshall') return 'machine-marshall';
      if (role === 'registration' || role === 'intake') return 'registration';
      if (role === 'packages' || role === 'products' || role === 'standalone') return 'standalone-products';
      if (role === 'kiosk' || role === 'tv' || role === 'paddock-tv') return 'paddock-tv';
      if (role === 'client' || role === 'portal' || role === 'public' || role === 'public-portal') return 'public-portal';
    } catch {
      // fallback
    }
    return 'director';
  });

  const [standalonePackage, setStandalonePackage] = useState<StandaloneProductPackage>('unified');
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(true);

  // Sync URL search params with active terminal mode
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (activeTerminal !== 'director') {
        url.searchParams.set('terminal', activeTerminal);
      } else {
        url.searchParams.delete('terminal');
        url.searchParams.delete('view');
        url.searchParams.delete('role');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // ignore
    }
  }, [activeTerminal]);

  // Timer & Session State (10 min ride + 3 min paddock clearing interval)
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);
  const [sessionPhase, setSessionPhase] = useState<SessionPhase>('riding');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600); // 10 minutes = 600 seconds
  const [intervalSecondsRemaining, setIntervalSecondsRemaining] = useState<number>(180); // 3 minutes = 180 seconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentFlag, setCurrentFlag] = useState<TrackFlag>('GREEN');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // Gate Safety & "Are You Ready?" Camera State
  const [isGateSafetyOpen, setIsGateSafetyOpen] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('db') === 'true' || params.get('supabase') === 'true';
    } catch {
      return false;
    }
  });
  const [gateVerifications, setGateVerifications] = useState<Record<string, GateSafetyVerification>>(() => {
    try {
      const saved = localStorage.getItem('emx_gate_verifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('emx_gate_verifications', JSON.stringify(gateVerifications));
    } catch {
      // ignore
    }
  }, [gateVerifications]);

  const handleSaveGateVerification = (verification: GateSafetyVerification) => {
    setGateVerifications((prev) => ({
      ...prev,
      [verification.riderId]: verification,
    }));
    syncGateVerificationToSupabase(verification).catch((err) =>
      console.warn('Supabase gate verification sync warning:', err)
    );
  };

  const handleBatchVerifyGate = (batch: GateSafetyVerification[]) => {
    setGateVerifications((prev) => {
      const updated = { ...prev };
      batch.forEach((b) => {
        updated[b.riderId] = b;
        syncGateVerificationToSupabase(b).catch((err) =>
          console.warn('Supabase batch gate verification sync warning:', err)
        );
      });
      return updated;
    });
  };

  // Reservations state (persisted to localStorage if available)
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('emx_reservations_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_RESERVATIONS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('emx_reservations_data', JSON.stringify(reservations));
    } catch {
      // ignore
    }
  }, [reservations]);

  // Riders state (persisted to localStorage if available)
  const [riders, setRiders] = useState<Rider[]>(() => {
    try {
      const saved = localStorage.getItem('emx_riders_data');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_RIDERS;
  });

  // Save riders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('emx_riders_data', JSON.stringify(riders));
    } catch {
      // ignore
    }
  }, [riders]);

  // Current block schedule (24 slots of 10 min each)
  const morningSchedule = useMemo(() => generateBlockSchedule('morning'), []);
  const afternoonSchedule = useMemo(() => generateBlockSchedule('afternoon'), []);
  const currentSchedule = currentBlock === 'morning' ? morningSchedule : afternoonSchedule;

  const currentSlot: SessionSlot = currentSchedule[currentSlotIndex] || currentSchedule[0];
  const nextSlot: SessionSlot | undefined = currentSchedule[currentSlotIndex + 1];

  const currentClass = MOTOCROSS_CLASSES.find((c) => c.id === currentSlot.classId) || MOTOCROSS_CLASSES[0];
  const nextClass = nextSlot ? MOTOCROSS_CLASSES.find((c) => c.id === nextSlot.classId) : undefined;

  // Riders in active session (15 riders)
  const activeSessionRiders = useMemo(() => {
    const list = riders.filter((r) => r.blockId === currentBlock && r.classId === currentSlot.classId);
    return list.slice(0, 15);
  }, [riders, currentBlock, currentSlot.classId]);

  // Riders in next session on deck (15 riders)
  const nextSessionRiders = useMemo(() => {
    if (!nextSlot) return [];
    const list = riders.filter((r) => r.blockId === currentBlock && r.classId === nextSlot.classId);
    return list.slice(0, 15);
  }, [riders, currentBlock, nextSlot]);

  // Track completed heats per class in current block
  const completedHeatsByClass = useMemo(() => {
    const counts: Record<string, number> = {
      'cx3-c': 0,
      'cx3-b': 0,
      'cx5-c': 0,
      'cx5-b': 0,
    };
    for (let i = 0; i < currentSlotIndex; i++) {
      const s = currentSchedule[i];
      if (s) counts[s.classId] = (counts[s.classId] || 0) + 1;
    }
    return counts;
  }, [currentSchedule, currentSlotIndex]);

  // Physical separation & Impound Rack Pickup state (10m pre-staging dispatch)
  const [pickedUpRiderIds, setPickedUpRiderIds] = useState<Record<string, boolean>>({});

  const handleTogglePickup = (riderId: string) => {
    setPickedUpRiderIds((prev) => ({
      ...prev,
      [riderId]: !prev[riderId],
    }));
  };

  const handleBatchPickupAll = () => {
    setPickedUpRiderIds((prev) => {
      const nextRiderMap: Record<string, boolean> = { ...prev };
      nextSessionRiders.forEach((r) => {
        nextRiderMap[r.id] = true;
      });
      return nextRiderMap;
    });
  };

  const handlePlayPickupAlertSound = () => {
    trackAudio.playMachinePickupAlert();
  };

  // Real-time clock string
  const [clockTimeStr, setClockTimeStr] = useState<string>('');
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update audio controller setting
  useEffect(() => {
    trackAudio.setEnabled(isSoundEnabled);
  }, [isSoundEnabled]);

  // Live Timer Effect (10-minute riding session + 3-minute paddock interval)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        if (sessionPhase === 'riding') {
          setSecondsRemaining((prev) => {
            if (prev <= 1) {
              // 10-minute Heat Completed (00:00 reached)
              handleHeatFinished();
              return 0;
            }

            // 10-minute pre-staging dispatch alert (420s heat remaining + 180s interval = 600s = 10m)
            if (prev === 420) {
              trackAudio.playMachinePickupAlert();
            }

            // 1-minute warning (60 seconds)
            if (prev === 60) {
              trackAudio.playOneMinuteWarning();
              setCurrentFlag('WHITE');
            }

            return prev - 1;
          });
        } else {
          // 3-minute Paddock Clearing Interval Phase
          setIntervalSecondsRemaining((prev) => {
            if (prev <= 1) {
              // 3-minute Interval finished -> Advance to next heat
              handleIntervalFinished();
              return 0;
            }

            // 30-second staging reminder chime
            if (prev === 30) {
              trackAudio.playStagingCall();
            }

            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, sessionPhase, currentSlotIndex, autoAdvance, currentBlock, currentSchedule.length]);

  // When 10-minute heat timer hits 00:00
  const handleHeatFinished = () => {
    trackAudio.playCheckeredFlag();
    setCurrentFlag('CHECKERED');

    if (autoAdvance) {
      // Transition to 3-minute interval after brief 3s checkered celebration
      setTimeout(() => {
        if (currentSlotIndex < currentSchedule.length - 1) {
          setSessionPhase('interval');
          setIntervalSecondsRemaining(180);
          trackAudio.playStagingCall();
        } else {
          setIsRunning(false);
        }
      }, 3000);
    } else {
      setIsRunning(false);
    }
  };

  // When 3-minute paddock interval hits 00:00 -> Start next 10m heat
  const handleIntervalFinished = () => {
    setPickedUpRiderIds({});
    if (currentSlotIndex < currentSchedule.length - 1) {
      setCurrentSlotIndex((prev) => prev + 1);
      setSessionPhase('riding');
      setSecondsRemaining(600);
      setIntervalSecondsRemaining(180);
      setCurrentFlag('GREEN');
      trackAudio.playGreenFlag();
    } else {
      setIsRunning(false);
      setSessionPhase('riding');
    }
  };

  // Marshal shortcut to skip interval early if staging gate is confirmed ready
  const handleSkipInterval = () => {
    setPickedUpRiderIds({});
    if (currentSlotIndex < currentSchedule.length - 1) {
      setCurrentSlotIndex((prev) => prev + 1);
      setSessionPhase('riding');
      setSecondsRemaining(600);
      setIntervalSecondsRemaining(180);
      setCurrentFlag('GREEN');
      trackAudio.playGreenFlag();
    } else {
      setSessionPhase('riding');
      setSecondsRemaining(600);
      setIntervalSecondsRemaining(180);
      setIsRunning(false);
    }
  };

  // Timer controls
  const handleTogglePlay = () => {
    if (!isRunning) {
      if (sessionPhase === 'riding') {
        trackAudio.playGreenFlag();
        if (currentFlag !== 'YELLOW' && currentFlag !== 'RED') {
          setCurrentFlag('GREEN');
        }
      } else {
        trackAudio.playStagingCall();
      }
    }
    setIsRunning(!isRunning);
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    if (sessionPhase === 'riding') {
      setSecondsRemaining(600);
      setCurrentFlag('GREEN');
    } else {
      setIntervalSecondsRemaining(180);
    }
  };

  const handleNextSlot = () => {
    if (currentSlotIndex < currentSchedule.length - 1) {
      setCurrentSlotIndex((prev) => prev + 1);
      setSessionPhase('riding');
      setSecondsRemaining(600);
      setIntervalSecondsRemaining(180);
      setCurrentFlag('GREEN');
      if (isRunning) trackAudio.playGreenFlag();
    }
  };

  const handlePrevSlot = () => {
    if (currentSlotIndex > 0) {
      setCurrentSlotIndex((prev) => prev - 1);
      setSessionPhase('riding');
      setSecondsRemaining(600);
      setIntervalSecondsRemaining(180);
      setCurrentFlag('GREEN');
    }
  };

  const handleSelectSlot = (idx: number) => {
    setCurrentSlotIndex(idx);
    setSessionPhase('riding');
    setSecondsRemaining(600);
    setIntervalSecondsRemaining(180);
    setCurrentFlag('GREEN');
    setActiveTab('live');
  };

  const handleSetFlag = (flag: TrackFlag) => {
    setCurrentFlag(flag);
    switch (flag) {
      case 'GREEN':
        trackAudio.playGreenFlag();
        break;
      case 'YELLOW':
        trackAudio.playYellowFlag();
        break;
      case 'RED':
        trackAudio.playRedFlag();
        setIsRunning(false); // safety rule: red flag stops countdown
        break;
      case 'WHITE':
        trackAudio.playOneMinuteWarning();
        break;
      case 'CHECKERED':
        trackAudio.playCheckeredFlag();
        break;
    }
  };

  const handleSelectBlock = (block: BlockId) => {
    if (block !== currentBlock) {
      setCurrentBlock(block);
      setCurrentSlotIndex(0);
      setSecondsRemaining(600);
      setIsRunning(false);
      setCurrentFlag('GREEN');
    }
  };

  // Rider Management
  const handleUpdateRider = (updated: Rider) => {
    setRiders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleAddRider = (newRider: Rider) => {
    setRiders((prev) => [...prev, newRider]);
  };

  const handleDeleteRider = (id: string) => {
    setRiders((prev) => prev.filter((r) => r.id !== id));
  };

  // Reservation Management
  const handleAddReservation = (newRes: Reservation) => {
    setReservations((prev) => [newRes, ...prev]);
    syncReservationToSupabase(newRes).catch((err) =>
      console.warn('Supabase reservation sync warning:', err)
    );
  };

  const handleUpdateReservation = (updated: Reservation) => {
    setReservations((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    syncReservationToSupabase(updated).catch((err) =>
      console.warn('Supabase reservation sync warning:', err)
    );
  };

  const handleCancelReservation = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          const updated = { ...r, status: 'cancelled' as const };
          syncReservationToSupabase(updated).catch((err) =>
            console.warn('Supabase cancel sync warning:', err)
          );
          return updated;
        }
        return r;
      })
    );
  };

  const handleConfirmPaymentReservation = (resId: string) => {
    setReservations((prev) =>
      prev.map((r) => {
        if (r.id === resId) {
          const updated: Reservation = {
            ...r,
            status: 'payment_confirmed',
            paymentConfirmedAt:
              new Date().toLocaleDateString() +
              ' ' +
              new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          syncReservationToSupabase(updated).catch((err) =>
            console.warn('Supabase confirm sync warning:', err)
          );
          return updated;
        }
        return r;
      })
    );
  };

  const handleImportReservations = (imported: Reservation[]) => {
    setReservations(imported);
  };

  const handleImportRiders = (imported: Rider[]) => {
    setRiders(imported);
  };

  const handlePlayStagingSound = () => {
    trackAudio.playStagingCall();
  };

  // If currentDomain is explicitly usaemoto.com, render the dedicated Executive Corporate Framework directly!
  if (currentDomain === 'usaemoto.com') {
    return (
      <div id="emx-scheduler-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <ActiveDomainBar
          onOpenPreReg={() => setIsGoRacerPreRegOpen(true)}
          currentDomain={currentDomain}
          onSelectDomain={handleDomainSelect}
          onNavigateTerminal={(term, pkg) => {
            setActiveTerminal(term);
            if (pkg) setStandalonePackage(pkg);
          }}
        />
        <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <USAEMotoCorporatePortal />
        </main>
      </div>
    );
  }

  return (
    <div id="emx-scheduler-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* 1. Public Portal Mode */}
      {activeTerminal === 'public-portal' && (
        <ClientPreRegistrationScreen
          classes={MOTOCROSS_CLASSES}
          reservations={reservations}
          onAddReservation={handleAddReservation}
          onSwitchToStaff={() => setActiveTerminal('director')}
          onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        />
      )}

      {/* 2. Paddock TV Fullscreen Broadcast Mode */}
      {activeTerminal === 'paddock-tv' && (
        <KioskDisplay
          currentSlot={currentSlot}
          currentClass={currentClass}
          nextSlot={nextSlot}
          nextClass={nextClass}
          currentRiders={activeSessionRiders}
          nextRiders={nextSessionRiders}
          secondsRemaining={secondsRemaining}
          intervalSecondsRemaining={intervalSecondsRemaining}
          sessionPhase={sessionPhase}
          isRunning={isRunning}
          currentFlag={currentFlag}
          blockConfig={BLOCKS_CONFIG[currentBlock]}
          onClose={() => setActiveTerminal('director')}
          gateVerifications={gateVerifications}
        />
      )}

      {/* 3. Fixed Station Terminals (Track Director, Machine Marshall, Registration Desk) */}
      {activeTerminal !== 'public-portal' && activeTerminal !== 'paddock-tv' && (
        <>
          {/* Starting Gate Safety & "Are You Ready?" Camera Verification Modal */}
          <GateSafetyReleaseModal
            isOpen={isGateSafetyOpen}
            onClose={() => setIsGateSafetyOpen(false)}
            stagedRiders={sessionPhase === 'interval' ? (nextSessionRiders.length > 0 ? nextSessionRiders : activeSessionRiders) : (nextSessionRiders.length > 0 ? nextSessionRiders : activeSessionRiders)}
            currentSlotIndex={currentSlotIndex}
            currentBlock={currentBlock}
            currentClassName={sessionPhase === 'interval' && nextClass ? nextClass.name : currentClass.name}
            verifications={gateVerifications}
            onSaveVerification={handleSaveGateVerification}
            onBatchVerify={handleBatchVerifyGate}
          />

          {/* Main App Header with Station Selector & Handheld Device Ban Notice */}
          <ActiveDomainBar
        onOpenPreReg={() => setIsGoRacerPreRegOpen(true)}
        currentDomain={currentDomain}
        onSelectDomain={handleDomainSelect}
        onNavigateTerminal={(term, pkg) => {
          setActiveTerminal(term);
          if (pkg) setStandalonePackage(pkg);
        }}
      />
      <Header
            currentBlock={currentBlock}
            onSelectBlock={handleSelectBlock}
            isSoundEnabled={isSoundEnabled}
            onToggleSound={() => setIsSoundEnabled(!isSoundEnabled)}
            currentTerminal={activeTerminal}
            onSelectTerminal={setActiveTerminal}
            currentTimeStr={clockTimeStr}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* TERMINAL 2: MACHINE MARSHALL (Dedicated 80 E-Bikes UI) */}
        {activeTerminal === 'machine-marshall' && (
          <MachineMarshallTerminal
            currentSlotIndex={currentSlotIndex}
            slots={currentSchedule}
            riders={riders}
            currentBlock={currentBlock}
            onSelectBlock={handleSelectBlock}
            onUpdateRider={handleUpdateRider}
            onTriggerPickupAlert={handlePlayPickupAlertSound}
            pickedUpRiderIds={pickedUpRiderIds}
            onTogglePickup={handleTogglePickup}
            onBatchPickupAll={handleBatchPickupAll}
            onSwitchTerminal={(term) => setActiveTerminal(term as ActiveRoleTerminal)}
          />
        )}

        {/* TERMINAL 3: REGISTRATION DESK (Front Office Intake UI) */}
        {activeTerminal === 'registration' && (
          <RegistrationDeskTerminal
            riders={riders}
            reservations={reservations}
            currentBlock={currentBlock}
            onSelectBlock={handleSelectBlock}
            onAddReservation={handleAddReservation}
            onUpdateRider={handleUpdateRider}
            onSwitchTerminal={(term) => setActiveTerminal(term as ActiveRoleTerminal)}
          />
        )}

        {/* TERMINAL 4: STANDALONE PRODUCT PACKAGES (Go Gate, Go Win, Go Ride, Go Race, Go Academy) */}
        {activeTerminal === 'standalone-products' && (
          <StandalonePackagesView
            currentPackage={standalonePackage}
            onSelectPackage={setStandalonePackage}
            onSwitchTerminal={(term) => setActiveTerminal(term)}
            riders={riders}
            currentSlot={currentSlot}
          />
        )}

        {/* TERMINAL 1: TRACK DIRECTOR (Tower Operations Console - Full Access) */}
        {activeTerminal === 'director' && (
          <>
            {/* Director Station Banner */}
            <div className="bg-slate-900 border border-amber-500/30 rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Station 01 • Operations Tower</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      FULL ACCESS AUTHORIZED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Track Director Command Deck: Heat Timers, Caution Lights, Gate Control, Hydration &amp; Promotion Approvals.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Track Staff Policy:</span>
                <span className="text-amber-400 font-bold font-mono bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  NO HANDHELD DEVICES ON TRACK
                </span>
              </div>
            </div>

            {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-2xl border border-slate-800">
            <button
              id="tab-btn-live"
              type="button"
              onClick={() => setActiveTab('live')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'live'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Live Track & Staging</span>
            </button>

            <button
              id="tab-btn-schedule"
              type="button"
              onClick={() => setActiveTab('schedule')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'schedule'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Daily Schedule</span>
            </button>

            <button
              id="tab-btn-roster"
              type="button"
              onClick={() => setActiveTab('roster')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'roster'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Roster & RFID (15/Class)</span>
            </button>

            <button
              id="tab-btn-paddock"
              type="button"
              onClick={() => setActiveTab('paddock')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'paddock'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BatteryCharging className="w-3.5 h-3.5" />
              <span>Paddock & Batteries (30m Rest)</span>
            </button>

            <button
              id="tab-btn-reservations"
              type="button"
              onClick={() => setActiveTab('reservations')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'reservations'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Pre-Entry Reservations</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                activeTab === 'reservations' ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {reservations.filter((r) => r.status !== 'cancelled').length}
              </span>
            </button>
          </div>

          {/* Quick Metrics Badge & Gate Safety Quick Trigger */}
          <div className="flex items-center gap-3">
            <button
              id="quick-open-gate-safety-btn"
              type="button"
              onClick={() => setIsGateSafetyOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Open Starting Gate 'Are You Ready?' Camera Verification"
            >
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Gate Safety Cam</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </button>

            <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Slot: <strong className="text-white">{currentSlotIndex + 1} / {currentSchedule.length}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                Phase: <strong className={sessionPhase === 'interval' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {sessionPhase === 'interval' ? '3m Interval' : '10m Heat'}
                </strong>
              </span>
              <span>•</span>
              <span>
                Track Time: <strong className="text-emerald-400">{currentSlotIndex * 10}m</strong> / {currentSchedule.length * 10}m
              </span>
            </div>
          </div>
        </div>

        {/* Global Track Flags Bar - Always accessible at the top */}
        <FlagControls currentFlag={currentFlag} onSetFlag={handleSetFlag} />

        {/* Active Tab View Rendering */}
        {activeTab === 'live' && (
          <div className="space-y-5">
            <LiveTrackControl
              currentSlot={currentSlot}
              totalSlots={currentSchedule.length}
              currentClass={currentClass}
              nextSlot={nextSlot}
              nextClass={nextClass}
              currentRiders={activeSessionRiders}
              nextRiders={nextSessionRiders}
              secondsRemaining={secondsRemaining}
              intervalSecondsRemaining={intervalSecondsRemaining}
              sessionPhase={sessionPhase}
              isRunning={isRunning}
              onTogglePlay={handleTogglePlay}
              onResetTimer={handleResetTimer}
              onNextSlot={handleNextSlot}
              onPrevSlot={handlePrevSlot}
              onSkipInterval={handleSkipInterval}
              currentFlag={currentFlag}
              autoAdvance={autoAdvance}
              onToggleAutoAdvance={() => setAutoAdvance(!autoAdvance)}
              onPlayStagingSound={handlePlayStagingSound}
              onOpenGateSafety={() => setIsGateSafetyOpen(true)}
              gateVerifications={gateVerifications}
            />

            {/* 10-Minute Pre-Staging Machine Impound Dispatch Alert & Separation Policy */}
            <MachineImpoundPickupAlert
              nextSlot={nextSlot}
              nextClass={nextClass}
              nextRiders={nextSessionRiders}
              secondsRemaining={secondsRemaining}
              intervalSecondsRemaining={intervalSecondsRemaining}
              sessionPhase={sessionPhase}
              pickedUpRiderIds={pickedUpRiderIds}
              onTogglePickup={handleTogglePickup}
              onBatchPickupAll={handleBatchPickupAll}
              onPlayPickupAlertSound={handlePlayPickupAlertSound}
            />

            {/* Paddock & Battery Recharge Rest Monitor */}
            <BatteryPaddockMonitor
              currentSlotIndex={currentSlotIndex}
              classes={MOTOCROSS_CLASSES}
              slots={currentSchedule}
            />
          </div>
        )}

        {activeTab === 'schedule' && (
          <ScheduleTimeline
            slots={currentSchedule}
            currentSlotIndex={currentSlotIndex}
            classes={MOTOCROSS_CLASSES}
            blockConfig={BLOCKS_CONFIG[currentBlock]}
            onSelectSlot={handleSelectSlot}
          />
        )}

        {activeTab === 'roster' && (
          <RiderRosterView
            riders={riders}
            classes={MOTOCROSS_CLASSES}
            currentBlock={currentBlock}
            onUpdateRider={handleUpdateRider}
            onAddRider={handleAddRider}
            onDeleteRider={handleDeleteRider}
            completedHeatsByClass={completedHeatsByClass}
          />
        )}

        {activeTab === 'paddock' && (
          <div className="space-y-5">
            <BatteryPaddockMonitor
              currentSlotIndex={currentSlotIndex}
              classes={MOTOCROSS_CLASSES}
              slots={currentSchedule}
            />

            {/* Indoor Electric Motocross Facility Standards */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Indoor Electric Motocross Operational Guidelines
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4" /> 10-Min Rotations
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Electric motocross heats run for precisely 10 minutes to maintain peak battery discharge performance, motor cooling, and young rider concentration on the indoor supercross layout.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                    <BatteryCharging className="w-4 h-4" /> 30-Min Pit Battery Swaps
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    With 4 rotating classes, each class has a guaranteed 30-minute paddock window between heats. Stacyc bikes swap fresh 18V/20V Li-Ion battery packs, while Cobra CX-E bikes connect to rapid cool-down chargers.
                  </p>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="font-bold text-amber-400 text-sm flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> 1 Hour Target Track Duration
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Across 24 heats (4 hours per block), every single rider achieves exactly 6 heats × 10 minutes = 60 minutes of high-intensity indoor electric motocross track time!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'esp32-firmware' && (
              <div id="view-esp32-firmware">
                <ESP32FirmwareSchematicView />
              </div>
            )}

            {activeTab === 'auto-flagger' && (
              <div id="view-auto-flagger">
                <AutoFlaggerMechanismShowcase />
              </div>
            )}

            {activeTab === 'hardware-suite' && (
              <div id="view-hardware-suite">
                <GoRacerGoWinHardwareSuite />
              </div>
            )}

            {activeTab === 'go-global' && (
              <div id="view-go-global">
                <GoRacerGlobalNetworkView />
              </div>
            )}

            {activeTab === 'corporate' && (
              <div id="view-corporate">
                <USAEMotoCorporatePortal />
              </div>
            )}

            {activeTab === 'win-scoring' && (
              <div id="view-win-scoring">
                <GoWinBroadcastScoring />
              </div>
            )}

            {activeTab === 'gate-products' && (
              <div id="view-gate-products">
                <GoGateProductShowcase />
              </div>
            )}

            {activeTab === 'track-specs' && (
              <div id="view-track-specs">
                <TrackTelemetrySpecsView />
              </div>
            )}

            {activeTab === 'reservations' && (
          <PreEntryReservationView
            reservations={reservations}
            classes={MOTOCROSS_CLASSES}
            onAddReservation={handleAddReservation}
            onUpdateReservation={handleUpdateReservation}
            onCancelReservation={handleCancelReservation}
            onConfirmPayment={handleConfirmPaymentReservation}
            onLaunchClientScreen={() => setActiveTerminal('public-portal')}
            onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
          />
        )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900/60 border-t border-slate-800/80 py-4 text-center text-xs text-slate-400 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <span className="font-black text-emerald-400">GO MOTO</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-semibold">Google Tech Stack Powered</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300">Supporting Next-Gen Youth Motocross</span>
          </span>
          <span className="font-mono text-slate-400">
            Morning 08:00–13:30 • 30m Maintenance • Afternoon 14:00–21:00 • 15 Riders/Class
          </span>
        </div>
      </footer>
        </>
      )}

      {/* Persistent Floating Supabase Cloud DB Button (Instant access on mobile & desktop) */}
      <div className="fixed bottom-5 right-5 z-[9999]">
        <button
          id="floating-supabase-db-btn"
          type="button"
          onClick={() => setIsSupabaseModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-full font-black text-xs sm:text-sm shadow-2xl flex items-center gap-2 border-2 border-slate-950 ring-2 ring-emerald-400 transition-all active:scale-95 shadow-emerald-500/50 cursor-pointer"
          title="Open Supabase Cloud Database Console & Sync"
        >
          <Database className="w-4 h-4 fill-slate-950 text-slate-950" />
          <span className="font-extrabold uppercase tracking-wide">Supabase DB</span>
          <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
        </button>
      </div>

      {/* Supabase Database & gomotomx.com Deployment Modal (Global) */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        reservations={reservations}
        riders={riders}
        onImportReservations={handleImportReservations}
        onImportRiders={handleImportRiders}
      />
          {/* Go Racer Pre-Registration Lead Capture Modal */}
      <GoRacerPreRegistrationModal
        isOpen={isGoRacerPreRegOpen}
        onClose={() => setIsGoRacerPreRegOpen(false)}
        targetDomain={currentDomain !== 'default' ? currentDomain : 'goracermx.com'}
      />
    </div>
  );
}
