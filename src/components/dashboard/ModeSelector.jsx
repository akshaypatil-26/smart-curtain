import React from 'react';
import { Hand, Cpu, Check, Sun, Sparkles } from 'lucide-react';
import { useCurtain } from '../../context/CurtainContext';

export const ModeSelector = () => {
  const { mode, setMode, autoThresholds, sensorData } = useCurtain();
  const isAuto = mode === 'automatic';

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Operation Mode
          </h2>
          <p className="text-xs text-slate-400">
            Switch between direct manual commands and smart light-triggered automation
          </p>
        </div>

        {/* Current Mode Badge */}
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
          isAuto 
            ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
            : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isAuto ? 'bg-purple-500 animate-pulse' : 'bg-blue-500'}`} />
          {isAuto ? 'AUTOMATIC ACTIVE' : 'MANUAL CONTROL'}
        </span>
      </div>

      {/* Mode Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
        {/* MANUAL MODE */}
        <button
          onClick={() => setMode('manual')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
            !isAuto
              ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-slate-900 dark:text-white shadow-md shadow-blue-500/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl ${
            !isAuto ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            <Hand className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm sm:text-base">Manual Mode</span>
              {!isAuto && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Curtain responds only to buttons, slider, and presets without automatic override.
            </p>
          </div>
        </button>

        {/* AUTOMATIC MODE */}
        <button
          onClick={() => setMode('automatic')}
          className={`flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
            isAuto
              ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30 text-slate-900 dark:text-white shadow-md shadow-purple-500/10'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
          }`}
        >
          <div className={`p-3 rounded-xl ${
            isAuto ? 'bg-purple-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
          }`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm sm:text-base">Automatic Mode</span>
              {isAuto && <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Dynamically adjusts curtain position based on ambient light sensor thresholds.
            </p>
          </div>
        </button>
      </div>

      {/* Auto Rules Explainer (when in Auto mode) */}
      {isAuto && (
        <div className="mt-4 p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-slate-700 dark:text-purple-200 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-purple-900 dark:text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-500" />
            Active Light-Sensor Rules:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-200/50 dark:border-purple-900/50">
              <span className="font-bold text-amber-600 block">☀️ High Light ({'>'}{autoThresholds.closeAboveLux} lux)</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Closes curtain to protect interior</span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-200/50 dark:border-purple-900/50">
              <span className="font-bold text-emerald-600 block">🌤️ Normal Light (250-700 lux)</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Sets position to 50% open</span>
            </div>
            <div className="p-2 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-purple-200/50 dark:border-purple-900/50">
              <span className="font-bold text-blue-600 block">🌙 Low Light ({'<'}{autoThresholds.openBelowLux} lux)</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Opens curtain for natural view</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;
