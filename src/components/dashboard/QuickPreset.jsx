import React from 'react';
import { Sun, CloudSun, Moon, Zap, Check } from 'lucide-react';
import { useCurtain } from '../../context/CurtainContext';

export const QuickPresets = () => {
  const { 
    curtainPosition, 
    moveToPosition 
  } = useCurtain();

  const presets = [
    {
      id: 'morning',
      title: 'Morning',
      icon: Sun,
      position: 100,
      description: '100% Open',
      subtext: 'Opens curtain fully for morning sunlight',
      action: () => moveToPosition(100),
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400',
      tagColor: 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
    },
    {
      id: 'day',
      title: 'Day',
      icon: CloudSun,
      position: 50,
      description: '50% Open',
      subtext: 'Partially drawn for balanced natural daylight',
      action: () => moveToPosition(50),
      iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400',
      tagColor: 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
    },
    {
      id: 'night',
      title: 'Night',
      icon: Moon,
      position: 0,
      description: 'Closed (0%)',
      subtext: 'Closes curtain completely for privacy',
      action: () => moveToPosition(0),
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400',
      tagColor: 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300'
    }
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Quick Presets
            </h2>
            <p className="text-xs text-slate-400">
              One-touch comfort positions with smooth automated gliding
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {presets.map((preset) => {
          const Icon = preset.icon;
          const isSelected = curtainPosition === preset.position;

          return (
            <button
              key={preset.id}
              onClick={preset.action}
              className={`p-5 rounded-2xl border-2 text-left transition-all flex flex-col justify-between group active:scale-[0.98] ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl transition-transform group-hover:scale-105 ${preset.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${preset.tagColor}`}>
                    {preset.description}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {preset.title}
                    </h3>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-blue-600 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {preset.subtext}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                Apply Preset →
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickPresets;
