import React, { useState } from 'react';
import { 
  Sparkles, 
  Sun, 
  CloudSun, 
  Moon, 
  Check, 
  Sliders, 
  Zap, 
  Eye, 
  AlertCircle,
  HelpCircle,
  Play
} from 'lucide-react';
import { useCurtain } from '../context/CurtainContext';

export const AutomationPage = () => {
  const { 
    mode, 
    setMode, 
    autoThresholds, 
    updateThresholds, 
    sensorData, 
    setSensorData,
    curtainPosition, 
    curtainState 
  } = useCurtain();

  const isAutoActive = mode === 'automatic';

  // Local state for threshold sliders
  const [closeLux, setCloseLux] = useState(autoThresholds.closeAboveLux || 700);
  const [openLux, setOpenLux] = useState(autoThresholds.openBelowLux || 250);

  const handleSaveThresholds = () => {
    updateThresholds({
      closeAboveLux: closeLux,
      openBelowLux: openLux,
      midPosition: 50
    });
  };

  // Determine which rule is actively matching current sensorData.light
  const currentLux = sensorData.light;
  const isBrightRuleActive = currentLux >= closeLux;
  const isLowRuleActive = currentLux <= openLux;
  const isMediumRuleActive = !isBrightRuleActive && !isLowRuleActive;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            Automatic Curtain Control
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Sensor-driven autonomous smart curtain positioning based on ambient light
          </p>
        </div>

        {/* Master ON/OFF Toggle */}
        <div className="flex items-center gap-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-soft">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 pl-2">
            {isAutoActive ? 'Automatic Mode Active' : 'Automatic Mode Off'}
          </span>
          <button
            onClick={() => setMode(isAutoActive ? 'manual' : 'automatic')}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isAutoActive ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            aria-label="Toggle Automatic Mode"
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                isAutoActive ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mode Status Banner */}
      <div className={`p-5 rounded-3xl border transition-all ${
        isAutoActive
          ? 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-200'
          : 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full ${isAutoActive ? 'bg-purple-500 animate-ping' : 'bg-slate-400'}`} />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">
                {isAutoActive ? 'Automatic Mode Active' : 'Manual Mode Enabled (Automation Paused)'}
              </h3>
              <p className="text-xs opacity-80 mt-0.5">
                {isAutoActive 
                  ? 'The ESP32 is actively evaluating light sensor data and managing curtain position automatically.' 
                  : 'Toggle the switch above to activate automatic sensor-based curtain control.'}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-xs font-mono font-bold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
            Live Light: {sensorData.light} lux
          </div>
        </div>
      </div>

      {/* Automation Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Rule 1: Bright Light */}
        <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
          isAutoActive && isBrightRuleActive
            ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
                <Sun className="w-6 h-6" />
              </div>
              {isAutoActive && isBrightRuleActive && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-white tracking-wider animate-pulse">
                  Rule Triggered
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                ☀️ Bright Light
              </h3>
              <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-1">
                Close Curtain (0%)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                When light exceeds threshold, curtain closes to block harsh thermal heat and screen glare.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500">
            Trigger: {'>='} {closeLux} lux
          </div>
        </div>

        {/* Rule 2: Medium Light */}
        <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
          isAutoActive && isMediumRuleActive
            ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-500">
                <CloudSun className="w-6 h-6" />
              </div>
              {isAutoActive && isMediumRuleActive && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-blue-500 text-white tracking-wider animate-pulse">
                  Rule Triggered
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                🌤️ Medium Light
              </h3>
              <div className="text-sm font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                50% Open
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Partially closes to allow soft diffused daylight while preserving balanced room comfort.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500">
            Trigger: {openLux} - {closeLux} lux
          </div>
        </div>

        {/* Rule 3: Low Light */}
        <div className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${
          isAutoActive && isLowRuleActive
            ? 'bg-indigo-500/10 border-indigo-500 shadow-lg shadow-indigo-500/10'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500">
                <Moon className="w-6 h-6" />
              </div>
              {isAutoActive && isLowRuleActive && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500 text-white tracking-wider animate-pulse">
                  Rule Triggered
                </span>
              )}
            </div>

            <div className="mt-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                🌙 Low Light
              </h3>
              <div className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                Open Curtain (100%)
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                When exterior illumination drops, curtain opens to welcome outdoor breeze and sunset ambiance.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-500">
            Trigger: {'<='} {openLux} lux
          </div>
        </div>
      </div>

      {/* Threshold Controls Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              Light Intensity Threshold Controls
            </h3>
            <p className="text-xs text-slate-400">
              Customize the lux sensitivity cutoffs for automatic curtain movement
            </p>
          </div>

          <button
            onClick={handleSaveThresholds}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Save Thresholds
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Close Above Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Close Curtain Above (High Light):
              </label>
              <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                {closeLux} lux
              </span>
            </div>
            <input
              type="range"
              min="400"
              max="1200"
              step="25"
              value={closeLux}
              onChange={(e) => setCloseLux(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>400 lux (Sensitive)</span>
              <span>1200 lux (Blazing Sun)</span>
            </div>
          </div>

          {/* Open Below Slider */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-200">
                Open Curtain Below (Low Light):
              </label>
              <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {openLux} lux
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={openLux}
              onChange={(e) => setOpenLux(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>50 lux (Deep Dusk)</span>
              <span>400 lux (Overcast)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Interactive Test Slider for Testing Rules */}
      <div className="rounded-3xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200/70 dark:border-slate-800 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Interactive Light Rule Simulator
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">Drag to test automatic triggers</span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Simulate Ambient Light:</span>
            <span className="font-bold font-mono text-purple-600 dark:text-purple-400 text-sm">
              {sensorData.light} lux
            </span>
          </div>
          <input
            type="range"
            min="50"
            max="1100"
            step="10"
            value={sensorData.light}
            onChange={(e) => setSensorData(prev => ({ ...prev, light: parseInt(e.target.value, 10) }))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default AutomationPage;
