import React from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Square, 
  Sliders,
  CheckCircle2,
  Sparkles,
  Percent
} from 'lucide-react';
import { useCurtain } from '../../context/CurtainContext';

export const ControlPanel = () => {
  const { 
    curtainPosition, 
    curtainState, 
    motorState,
    openCurtain, 
    closeCurtain, 
    stopCurtain, 
    setDirectPosition,
    moveToPosition
  } = useCurtain();

  // Helper for status badge presentation
  const getStatusBadge = () => {
    switch (curtainState) {
      case 'OPEN':
        return { 
          label: 'OPEN', 
          dot: 'bg-emerald-500 shadow-glow-green', 
          text: 'text-emerald-700 dark:text-emerald-300', 
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800' 
        };
      case 'CLOSED':
        return { 
          label: 'CLOSED', 
          dot: 'bg-slate-400', 
          text: 'text-slate-700 dark:text-slate-300', 
          bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' 
        };
      case 'OPENING':
        return { 
          label: 'OPENING', 
          dot: 'bg-blue-500 animate-ping', 
          text: 'text-blue-700 dark:text-blue-300', 
          bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800' 
        };
      case 'CLOSING':
        return { 
          label: 'CLOSING', 
          dot: 'bg-amber-500 animate-ping', 
          text: 'text-amber-700 dark:text-amber-300', 
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800' 
        };
      case 'STOPPED':
      default:
        return { 
          label: 'STOPPED', 
          dot: 'bg-slate-500', 
          text: 'text-slate-700 dark:text-slate-300', 
          bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' 
        };
    }
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-7 flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Curtain Control
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Interactive motor control and positioning
            </p>
          </div>
        </div>

        {/* THREE LARGE DISTINCT MOTOR BUTTONS: OPEN, STOP, CLOSE */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 mt-6">
          {/* 1. OPEN BUTTON */}
          <button
            onClick={openCurtain}
            className={`flex flex-col items-center justify-center py-5 px-4 rounded-2xl font-bold transition-all duration-150 active:scale-[0.98] shadow-lg group ${
              curtainState === 'OPENING'
                ? 'bg-blue-700 text-white ring-4 ring-blue-400/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
            }`}
            aria-label="Open Curtain"
          >
            <div className="p-2.5 rounded-xl bg-white/15 group-hover:scale-110 transition-transform">
              <ArrowUp className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
            <span className="mt-2.5 text-base sm:text-lg font-extrabold tracking-wide">
              {curtainState === 'OPENING' ? 'OPENING...' : 'OPEN'}
            </span>
            <span className="text-xs text-blue-100 font-medium opacity-90">
              Open Curtain (100%)
            </span>
          </button>

          {/* 2. STOP BUTTON (RED) */}
          <button
            onClick={stopCurtain}
            className="flex flex-col items-center justify-center py-5 px-4 rounded-2xl font-bold bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white shadow-lg shadow-rose-600/25 transition-all duration-150 active:scale-[0.98] group"
            aria-label="Stop Motor"
          >
            <div className="p-2.5 rounded-xl bg-white/15 group-hover:scale-110 transition-transform">
              <Square className="w-7 h-7 text-white fill-white stroke-[1.5]" />
            </div>
            <span className="mt-2.5 text-base sm:text-lg font-extrabold tracking-wide">
              STOP
            </span>
            <span className="text-xs text-rose-100 font-medium opacity-90">
              Halt At Current Position
            </span>
          </button>

          {/* 3. CLOSE BUTTON (DARK BLUE) */}
          <button
            onClick={closeCurtain}
            className={`flex flex-col items-center justify-center py-5 px-4 rounded-2xl font-bold transition-all duration-150 active:scale-[0.98] shadow-lg group ${
              curtainState === 'CLOSING'
                ? 'bg-slate-900 text-white ring-4 ring-slate-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white shadow-slate-900/20'
            }`}
            aria-label="Close Curtain"
          >
            <div className="p-2.5 rounded-xl bg-white/15 group-hover:scale-110 transition-transform">
              <ArrowDown className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
            <span className="mt-2.5 text-base sm:text-lg font-extrabold tracking-wide">
              {curtainState === 'CLOSING' ? 'CLOSING...' : 'CLOSE'}
            </span>
            <span className="text-xs text-slate-300 font-medium opacity-90">
              Close Curtain (0%)
            </span>
          </button>
        </div>
      </div>

      {/* Dynamic Status Section */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Curtain Live Telemetry
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* Status */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Curtain Status</span>
            <span className={`inline-flex items-center gap-1.5 mt-1 font-bold ${statusBadge.text}`}>
              <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
              {statusBadge.label}
            </span>
          </div>

          {/* Position */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Position</span>
            <span className="font-extrabold text-slate-900 dark:text-white mt-1 block">
              {curtainPosition}%
            </span>
          </div>

          {/* Motor */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Motor State</span>
            <span className={`font-bold mt-1 block ${
              motorState === 'Opening' || motorState === 'Closing' 
                ? 'text-blue-600 dark:text-blue-400 animate-pulse'
                : 'text-slate-700 dark:text-slate-300'
            }`}>
              {motorState}
            </span>
          </div>

          {/* Mode */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">System Mode</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Position Slider Section */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Curtain Position Slider
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full font-semibold">
              Live Control
            </span>
          </div>
          <span className="text-base font-extrabold text-blue-600 dark:text-blue-400 font-mono">
            {curtainPosition}%
          </span>
        </div>

        <div className="relative py-2">
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={curtainPosition}
            onChange={(e) => setDirectPosition(parseInt(e.target.value, 10))}
            className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer focus:outline-none"
            aria-label="Curtain Position"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
          <button 
            type="button" 
            onClick={() => moveToPosition(0)} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            0% (Closed)
          </button>
          <button 
            type="button" 
            onClick={() => moveToPosition(50)} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            50% (Half)
          </button>
          <button 
            type="button" 
            onClick={() => moveToPosition(100)} 
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            100% (Open)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
