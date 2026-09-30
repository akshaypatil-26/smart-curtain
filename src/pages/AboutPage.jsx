import React from 'react';
import { 
  Info, 
  Blinds, 
  Cpu, 
  Bluetooth, 
  Laptop, 
  Smartphone, 
  Radio, 
  Cog, 
  Sun, 
  Thermometer, 
  ArrowDown, 
  CheckCircle2, 
  Code2, 
  Layers, 
  User 
} from 'lucide-react';

export const AboutPage = () => {
  const technologies = [
    { name: 'ESP32 Microcontroller', category: 'Hardware Core', desc: 'Dual-core Tensilica Xtensa 32-bit LX6 with BLE 4.2 / 5.0' },
    { name: 'Bluetooth Low Energy (BLE)', category: 'Wireless Protocol', desc: 'Custom GATT UART Server with RX/TX notification profile' },
    { name: 'Web Bluetooth API', category: 'Browser Interface', desc: 'Native browser GATT connection without third-party drivers' },
    { name: 'React 19', category: 'Frontend Framework', desc: 'Component architecture with Context API and custom hooks' },
    { name: 'Vite 8', category: 'Build Tooling', desc: 'Next-generation ultra-fast frontend build engine' },
    { name: 'Tailwind CSS', category: 'Styling Engine', desc: 'Utility-first modern responsive smart home design system' },
    { name: 'Lucide Icons', category: 'UI Assets', desc: 'Clean vector iconography for IoT smart device controls' },
    { name: 'Web Audio API', category: 'Audio Synthesis', desc: 'Synthesized tactical acoustic audio feedback' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto">
      {/* Hero Header Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-navy-900 via-slate-900 to-navy-950 text-white p-8 sm:p-10 shadow-2xl overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              <Blinds className="w-4 h-4" />
              <span>Smart Home IoT Ecosystem</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Smart Curtain Control
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              An IoT-based automatic curtain control system using ESP32, Bluetooth Low Energy, and a web interface.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span>System Version</span>
              <span className="text-white font-bold bg-white/10 px-2.5 py-1 rounded-lg">
                v1.0.0 Production
              </span>
            </div>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-glow-blue shrink-0 ring-4 ring-white/10">
            <Blinds className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      {/* SECTION: Hardware Architecture Diagram */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-8">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Hardware & Communication Architecture
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Physical layout connecting browser Web Bluetooth client to ESP32 motor drive and sensors
          </p>
        </div>

        {/* Visual Architecture Diagram */}
        <div className="mt-8 flex flex-col items-center">
          {/* Top Tier: Client Device */}
          <div className="w-full max-w-md p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-300 dark:border-blue-800 flex items-center justify-center gap-3 shadow-sm">
            <Laptop className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <div className="text-left">
              <div className="font-extrabold text-sm text-slate-900 dark:text-white">
                Client Device (Mobile / Laptop / Tablet)
              </div>
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                React Web App + Web Bluetooth API (navigator.bluetooth)
              </div>
            </div>
          </div>

          {/* Connection Link Arrow */}
          <div className="my-2 flex flex-col items-center">
            <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 shadow-sm">
              <Bluetooth className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              Web Bluetooth BLE 2.4 GHz
            </span>
            <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700" />
            <ArrowDown className="w-4 h-4 text-slate-400 -mt-1" />
          </div>

          {/* Middle Tier: ESP32 Core */}
          <div className="w-full max-w-lg p-5 rounded-2xl bg-navy-900 text-white border-2 border-blue-500 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-400/30">
                <Cpu className="w-7 h-7" />
              </div>
              <div>
                <div className="font-bold text-base text-white flex items-center gap-2">
                  SMART CURTAIN ESP32
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    BLE Server
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  GATT UART Server • Motor PID / PWM • ADC Sensor Polling
                </div>
              </div>
            </div>
          </div>

          {/* Branching down to Actuator & Sensors */}
          <div className="w-full max-w-lg grid grid-cols-2 gap-4 mt-4">
            {/* Actuator Branch */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
              <ArrowDown className="w-4 h-4 text-slate-400 -mt-1" />
              <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <Cog className="w-4 h-4 text-orange-500" />
                  Motor Driver (L298N)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div>• H-Bridge GPIO 18 & 19 (PWM)</div>
                  <div>• Open Limit Switch (GPIO 32)</div>
                  <div>• Close Limit Switch (GPIO 33)</div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-extrabold text-blue-600 dark:text-blue-400">
                  <Blinds className="w-4 h-4" />
                  DC Gear Motor → Curtain
                </div>
              </div>
            </div>

            {/* Sensor Branch */}
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700" />
              <ArrowDown className="w-4 h-4 text-slate-400 -mt-1" />
              <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white">
                  <Sun className="w-4 h-4 text-amber-500" />
                  Environmental Sensors
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                  <div>• BH1750 / LDR (I2C Light Lux)</div>
                  <div>• DHT22 (Digital Temp & RH)</div>
                  <div>• ADC Battery / Voltage Divider</div>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  <Radio className="w-4 h-4" />
                  BLE Telemetry Notify
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: Technologies Used */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-8">
        <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            Technology Stack & Standards
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Engineering tools powering the Smart Curtain Control IoT stack
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {tech.category}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                  {tech.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
