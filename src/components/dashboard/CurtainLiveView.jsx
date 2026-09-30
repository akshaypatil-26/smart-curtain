import React from 'react';
import { useCurtain } from '../../context/CurtainContext';
import { Eye, Sun, Moon } from 'lucide-react';

export const CurtainLiveView = () => {
  const { 
    curtainPosition, 
    curtainState, 
    sensorData,
    animationsEnabled 
  } = useCurtain();

  // Position is 0 (Closed) to 100 (Open)
  // At 0% (Closed): each drape occupies 50% width, meeting in center
  // At 100% (Open): each drape occupies 10% width, pulled to sides
  // At 50%: each drape occupies 30% width
  const drapeWidthPercent = Math.max(10, Math.min(50, 50 - (curtainPosition / 100) * 40));

  // Determine outdoor window scenery based on light lux
  const isNight = sensorData.light < 200;
  const isSunset = sensorData.light >= 200 && sensorData.light < 400;

  const getBadgeText = () => {
    if (curtainState === 'OPENING') return `Curtain Opening... (${curtainPosition}%)`;
    if (curtainState === 'CLOSING') return `Curtain Closing... (${curtainPosition}%)`;
    if (curtainState === 'STOPPED') return `Curtain Stopped at ${curtainPosition}%`;
    if (curtainPosition === 100) return 'Curtain is Open (100%)';
    if (curtainPosition === 0) return 'Curtain is Closed (0%)';
    return `Curtain is ${curtainPosition}% Open`;
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Live Curtain View
            </h2>
            <p className="text-xs text-slate-400">
              Real-time physical curtain position simulation
            </p>
          </div>
        </div>

        {/* Live Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 shadow-sm">
            <span className={`w-2 h-2 rounded-full ${
              curtainState === 'OPENING' || curtainState === 'CLOSING' 
                ? 'bg-blue-500 animate-ping' 
                : curtainPosition === 100 
                ? 'bg-emerald-500' 
                : 'bg-blue-500'
            }`} />
            {getBadgeText()}
          </span>
        </div>
      </div>

      {/* Main Interactive Window Scene */}
      <div className="relative p-6 sm:p-8 flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100/60 dark:from-slate-950/40 dark:to-slate-900/40 select-none min-h-[300px]">
        {/* Living Room Window Frame Container */}
        <div className="relative w-full max-w-xl h-64 sm:h-72 rounded-2xl shadow-2xl overflow-hidden border-8 border-slate-800/95 dark:border-slate-950 bg-slate-900">
          
          {/* Outdoor Scene Backdrop */}
          <div className={`absolute inset-0 transition-colors duration-1000 ${
            isNight
              ? 'bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900'
              : isSunset
              ? 'bg-gradient-to-b from-amber-600 via-orange-500 to-indigo-900'
              : 'bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-100'
          }`}>
            
            {/* Celestial Body: Sun or Moon */}
            {isNight ? (
              <div className="absolute top-6 right-10 flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 shadow-[0_0_25px_rgba(254,243,199,0.9)] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-amber-200/50" />
                </div>
                <span className="absolute -left-12 top-4 w-1 h-1 bg-white rounded-full opacity-80" />
                <span className="absolute -left-20 top-10 w-1.5 h-1.5 bg-white rounded-full opacity-90" />
              </div>
            ) : isSunset ? (
              <div className="absolute top-12 left-16">
                <div className="w-14 h-14 rounded-full bg-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.9)]" />
              </div>
            ) : (
              <div className="absolute top-6 left-12">
                <div className="w-14 h-14 rounded-full bg-amber-300 shadow-[0_0_50px_rgba(252,211,77,0.95)]" />
                <div className="absolute -right-24 top-4 w-24 h-7 bg-white/70 rounded-full blur-[1px]" />
              </div>
            )}

            {/* Landscape silhouette */}
            <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none opacity-85">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
                <path 
                  d="M0,150 L0,80 Q120,20 240,75 T480,40 L500,60 L500,150 Z" 
                  fill={isNight ? '#090d16' : isSunset ? '#261b2e' : '#1e3a2f'} 
                />
              </svg>
            </div>

            {/* Window Glass Pane Glare */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-white/[0.1] pointer-events-none" />

            {/* Window Mullions */}
            <div className="absolute inset-0 grid grid-cols-2 pointer-events-none">
              <div className="border-r-4 border-slate-800/80 dark:border-slate-950/90 h-full" />
              <div className="h-full" />
            </div>
            <div className="absolute inset-0 grid grid-rows-2 pointer-events-none">
              <div className="border-b-4 border-slate-800/80 dark:border-slate-950/90 w-full" />
              <div className="w-full" />
            </div>
          </div>

          {/* Curtain Rail / Rod */}
          <div className="absolute top-2 inset-x-2 h-3 bg-gradient-to-b from-slate-400 via-amber-200 to-amber-700 rounded-full shadow-md z-20 flex items-center justify-between px-3">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm -ml-2" />
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm -mr-2" />
          </div>

          {/* LEFT CURTAIN DRAPE */}
          <div
            className={`absolute top-3.5 bottom-0 left-0 bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 z-10 shadow-2xl overflow-hidden ${
              animationsEnabled ? 'transition-all duration-300 ease-out' : ''
            }`}
            style={{ width: `${drapeWidthPercent}%` }}
          >
            <div className="absolute inset-0 curtain-pleats opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
            <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-black/50 to-transparent" />
            {curtainPosition > 70 && (
              <div className="absolute top-1/2 left-0 right-0 h-3.5 bg-gradient-to-r from-amber-400 to-amber-600 shadow-md border-y border-amber-300/60 z-20" />
            )}
          </div>

          {/* RIGHT CURTAIN DRAPE */}
          <div
            className={`absolute top-3.5 bottom-0 right-0 bg-gradient-to-l from-blue-900 via-blue-700 to-indigo-800 z-10 shadow-2xl overflow-hidden ${
              animationsEnabled ? 'transition-all duration-300 ease-out' : ''
            }`}
            style={{ width: `${drapeWidthPercent}%` }}
          >
            <div className="absolute inset-0 curtain-pleats opacity-85" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/50 to-transparent" />
            {curtainPosition > 70 && (
              <div className="absolute top-1/2 left-0 right-0 h-3.5 bg-gradient-to-r from-amber-400 to-amber-600 shadow-md border-y border-amber-300/60 z-20" />
            )}
          </div>

          {/* Window Sill */}
          <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-t from-slate-900 to-slate-700 z-20" />
        </div>
      </div>
    </div>
  );
};

export default CurtainLiveView;
