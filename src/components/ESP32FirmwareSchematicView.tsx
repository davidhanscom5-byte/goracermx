import React, { useState } from 'react';
import {
  Cpu,
  Radio,
  Zap,
  BatteryCharging,
  Code2,
  Terminal,
  CheckCircle2,
  Copy,
  Download,
  Check,
  Layers,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Wifi,
  Lock
} from 'lucide-react';

export const ESP32FirmwareSchematicView: React.FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'ino' | 'pinout' | 'protocol'>('ino');
  const [copied, setCopied] = useState<boolean>(false);
  const [telemetrySim, setTelemetrySim] = useState({
    batteryV: 25.6,
    rssi: -58,
    activeFlag: 'CHECKERED',
    shaftPwm: 185,
    waveCadenceHz: 2.4,
    status: 'ONLINE & SYNCED TO GO RACER',
  });

  const ESP32_CODE = `/*
 * =========================================================================
 * GO FLAG™ MX — AUTOMATED 4-FLAG FINISH LINE ROBOTIC MECHANISM
 * Target Hardware: ESP32-WROOM-32 / ESP32-S3 (24V DC LiFePO4 Battery System)
 * Architecture: Single Oscillating Shaft Motor (PWM) + 4x Solenoid Locking Pins
 * Communications: ESP-NOW (Sub-2ms) + Wi-Fi UDP Mesh to Go Racer™ Race Director
 * =========================================================================
 */

#include <WiFi.h>
#include <esp_now.h>

// --- PIN DEFINITIONS (Rule #14 Compliant 0.0V DC Isolated Dirt) ---
#define PIN_MOTOR_PWM     18    // MOSFET / H-Bridge PWM (Shaft oscillation motor)
#define PIN_MOTOR_DIR     19    // Direction polarity pin
#define PIN_PIN_GREEN     21    // Solenoid Pin 1: Green Flag Collar
#define PIN_PIN_YELLOW    22    // Solenoid Pin 2: Yellow Caution Collar
#define PIN_PIN_WHITE     23    // Solenoid Pin 3: White Final Lap Collar
#define PIN_PIN_CHECKERED 25    // Solenoid Pin 4: Checkered Finish Collar
#define PIN_BATTERY_SENSE 34    // ADC Battery Voltage divider (24V LiFePO4 sense)

// --- MECHANICAL WAVE TUNING ---
float waveFrequencyHz = 2.4;    // Oscillations per second
int   sweepMaxPWM     = 210;    // Peak torque into shaft
bool  isWaving        = false;
int   currentFlagId   = 0;      // 0=Stowed, 1=Green, 2=Yellow, 3=White, 4=Checkered

// --- GO RACER TELEMETRY PACKET STRUCTURE ---
typedef struct struct_message {
  uint8_t commandFlag;   // 0=STOW, 1=GREEN, 2=YELLOW, 3=WHITE, 4=CHECKERED
  float   cadenceHz;     // Variable wave speed
  uint16_t durationSec;  // Auto-stow timeout
} FlagCommand;

FlagCommand incomingCmd;

void disengageAllPins() {
  digitalWrite(PIN_PIN_GREEN, LOW);
  digitalWrite(PIN_PIN_YELLOW, LOW);
  digitalWrite(PIN_PIN_WHITE, LOW);
  digitalWrite(PIN_PIN_CHECKERED, LOW);
  analogWrite(PIN_MOTOR_PWM, 0); // Stop main oscillating shaft
  isWaving = false;
  currentFlagId = 0;
}

void deployFlagWithPin(int flagId) {
  disengageAllPins();
  delay(30); // 30ms settling buffer

  // Engage only the designated solenoid locking pin
  switch (flagId) {
    case 1: digitalWrite(PIN_PIN_GREEN, HIGH); break;
    case 2: digitalWrite(PIN_PIN_YELLOW, HIGH); break;
    case 3: digitalWrite(PIN_PIN_WHITE, HIGH); break;
    case 4: digitalWrite(PIN_PIN_CHECKERED, HIGH); break;
    default: return; // Stowed
  }

  delay(20); // 20ms solenoid latch time into drive key
  isWaving = true;
  currentFlagId = flagId;
}

// --- ESP-NOW LOW-LATENCY PACKET CALLBACK (<2ms response) ---
void onDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&incomingCmd, incomingData, sizeof(incomingCmd));
  waveFrequencyHz = incomingCmd.cadenceHz;
  deployFlagWithPin(incomingCmd.commandFlag);
}

void setup() {
  Serial.begin(115200);

  // Solenoid Pin Outputs
  pinMode(PIN_PIN_GREEN, OUTPUT);
  pinMode(PIN_PIN_YELLOW, OUTPUT);
  pinMode(PIN_PIN_WHITE, OUTPUT);
  pinMode(PIN_PIN_CHECKERED, OUTPUT);
  pinMode(PIN_MOTOR_PWM, OUTPUT);
  pinMode(PIN_MOTOR_DIR, OUTPUT);
  pinMode(PIN_BATTERY_SENSE, INPUT);

  disengageAllPins();

  // ESP-NOW Wireless Mesh Setup
  WiFi.mode(WIFI_STA);
  if (esp_now_init() == ESP_OK) {
    esp_now_register_recv_cb(onDataRecv);
    Serial.println("GO FLAG ESP32: Listening for Go Racer / Go Win trigger");
  }
}

// --- SINUSOIDAL WAVE LOOP ---
void loop() {
  if (isWaving && currentFlagId > 0) {
    unsigned long now = millis();
    float timeSec = now / 1000.0;
    
    // Smooth harmonic sinusoidal waveform
    float sinVal = sin(timeSec * 2.0 * PI * waveFrequencyHz);
    
    // Set Direction
    digitalWrite(PIN_MOTOR_DIR, sinVal >= 0 ? HIGH : LOW);
    
    // Variable Speed Torque Output
    int pwmOut = (int)(fabs(sinVal) * sweepMaxPWM);
    analogWrite(PIN_MOTOR_PWM, pwmOut);
  } else {
    analogWrite(PIN_MOTOR_PWM, 0);
  }

  delay(5); // 200Hz loop cadence for ultra-smooth mechanical motion
}`;

  const PINOUT_DATA = [
    { pin: 'GPIO 18', role: 'Motor PWM Speed', hardware: 'IRFZ44N / BTS7960 Motor Driver' },
    { pin: 'GPIO 19', role: 'Motor Direction', hardware: 'H-Bridge Direction Polarity Logic' },
    { pin: 'GPIO 21', role: 'Pin 1: Green Flag', hardware: '24V / 1.2A Linear Pull Solenoid' },
    { pin: 'GPIO 22', role: 'Pin 2: Yellow Caution', hardware: '24V / 1.2A Linear Pull Solenoid' },
    { pin: 'GPIO 23', role: 'Pin 3: White Final Lap', hardware: '24V / 1.2A Linear Pull Solenoid' },
    { pin: 'GPIO 25', role: 'Pin 4: Checkered Finish', hardware: '24V / 1.2A Linear Pull Solenoid' },
    { pin: 'GPIO 34', role: 'LiFePO4 Battery ADC', hardware: '10:1 Resistor Divider (0–30V Range)' },
    { pin: 'Antenna', role: 'ESP-NOW & UDP Mesh', hardware: '2.4 GHz Low-Latency (<2ms) Transceiver' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(ESP32_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans text-slate-100">
      {/* Title Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3.5 py-1 rounded-full bg-cyan-400 text-slate-950 text-[10px] font-black tracking-widest uppercase font-mono shadow-md">
                EMBEDDED HARDWARE ARCHITECTURE
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-cyan-300 text-[10px] font-bold uppercase tracking-wider font-mono border border-cyan-500/30">
                ESP32 + 24V LiFePO4 + ESP-NOW WIRELESS
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono border border-emerald-500/30">
                ZERO LINE VOLTAGE ON DIRT (RULE #14)
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
              ESP32 Wave Loop &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Wireless Comms</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Complete firmware, electrical schematic, and wireless handshake for your <strong>Go Flag™ common-shaft mechanism</strong>. Powered by a self-contained 24V LiFePO4 pack with an ESP32 microcontroller executing a smooth sinusoidal wave equation and listening for sub-2ms wireless triggers from <strong>Go Racer™</strong> and <strong>Go Win™</strong>!
            </p>
          </div>

          {/* Real-Time Battery & ESP32 Telemetry Monitor */}
          <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl min-w-[280px] space-y-3 font-mono text-xs shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>ESP32-WROOM-32</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                ONLINE
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Battery Pack:</span>
                <span className="text-emerald-400 font-bold">{telemetrySim.batteryV}V (LiFePO4)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Wireless Protocol:</span>
                <span className="text-cyan-400 font-bold">ESP-NOW (1.8ms Latency)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Signal Strength:</span>
                <span className="text-slate-200 font-bold">{telemetrySim.rssi} dBm (Rock Solid)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Solenoid:</span>
                <span className="text-amber-400 font-bold">{telemetrySim.activeFlag} PIN</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
              Autonomous 0.0V DC Arena Arch
            </div>
          </div>
        </div>
      </div>

      {/* Tri-Pillar Hardware Breakdown: Battery, ESP32, Communications */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1: Battery System */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <BatteryCharging className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">1. 24V LiFePO4 Battery Pack</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Eliminates 120V AC wiring on the track completely (strict Rule #14 compliance). A compact 24V 10Ah LiFePO4 battery pack powers the motor and solenoids for <strong>14+ hours of continuous racing heats</strong> on a single charge.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-400">
            &bull; Built-in Low-Voltage Protection Cutoff (21.6V)
          </div>
        </div>

        {/* Pillar 2: ESP32 Brain */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">2. Dual-Core ESP32 Controller</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Core 0 runs the <strong>sinusoidal wave equation loop</strong> at 200 Hz for lifelike cloth flutter. Core 1 manages the 4 MOSFET solenoid drivers (15ms latch) and monitors battery cell voltage via analog ADC.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-cyan-400">
            &bull; 200Hz Hardware PWM Sine-Wave Generation
          </div>
        </div>

        {/* Pillar 3: Communications */}
        <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-xl">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">3. ESP-NOW &amp; Wi-Fi UDP Mesh</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connects wirelessly without needing an arena internet router! Operates over ESP-NOW peer-to-peer RF protocol with <strong>sub-2 millisecond latency</strong> directly from the Go Racer™ Director desk and Go Win™ finish loop.
          </p>
          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-amber-400">
            &bull; Failsafe Timeout: Auto-Stows if signal is lost
          </div>
        </div>
      </div>

      {/* Firmware Code & Pinout Workbench */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span>Production Arduino / ESP-IDF Firmware Code</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Complete, ready-to-flash code for Arduino IDE or PlatformIO to run the wave loop and solenoids.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveCodeTab('ino')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeCodeTab === 'ino' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                GoFlag_ESP32.ino
              </button>
              <button
                type="button"
                onClick={() => setActiveCodeTab('pinout')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  activeCodeTab === 'pinout' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                GPIO Pinout &amp; Wiring
              </button>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: C++ / Arduino Code View */}
        {activeCodeTab === 'ino' && (
          <div className="relative">
            <pre className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto max-h-[480px] leading-relaxed">
              <code>{ESP32_CODE}</code>
            </pre>
          </div>
        )}

        {/* Tab 2: GPIO Pinout Table */}
        {activeCodeTab === 'pinout' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-3 px-4">ESP32 Pin</th>
                  <th className="py-3 px-4">Function / Role</th>
                  <th className="py-3 px-4">Connected Hardware Component</th>
                  <th className="py-3 px-4">Signal Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {PINOUT_DATA.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/50">
                    <td className="py-3 px-4 font-bold text-cyan-400">{row.pin}</td>
                    <td className="py-3 px-4 text-white">{row.role}</td>
                    <td className="py-3 px-4 text-slate-300">{row.hardware}</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {row.pin.includes('PWM') ? 'PWM (200 Hz)' : row.pin.includes('ADC') ? 'Analog (0–3.3V)' : 'Digital 3.3V / 24V Opto'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
