import React from 'react';
import { 
  Blinds, 
  Percent, 
  Sun, 
  Thermometer, 
  Droplets, 
  ArrowUpRight, 
  ArrowDownRight,
  PauseCircle,
  CheckCircle2
} from 'lucide-react';
import { useCurtain } from '../../context/CurtainContext';

export const StatusCards = () => {
  const { 
    curtainState, 
    curtainPosition, 
    sensorData 
  } = useCurtain();

  const getStatusBadge = () => {
    switch (curtainState) {
      case 'OPEN':
        return {
          title: 'OPEN',
          badgeText: 'Curtain Open',
          badgeClass: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
          dotClass: 'bg-emerald-500 shadow-glow-green',
          icon: Blinds,
          iconClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400'
        };
      case 'CLOSED':
        return {
          title: 'CLOSED',
          badgeText: 'Curtain Closed',
          badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dotClass: 'bg-slate-400',
          icon: Blinds,
          iconClass: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400'
        };
      case 'OPENING':
        return {
          title: 'OPENING',
          badgeText: 'Moving Open',
          badgeClass: 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 animate-pulse',
          dotClass: 'bg-blue-500 animate-ping',
          icon: ArrowUpRight,
          iconClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400'
        };
      case 'CLOSING':
        return {
          title: 'CLOSING',
          badgeText: 'Moving Close',
          badgeClass: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 animate-pulse',
          dotClass: 'bg-amber-500 animate-ping',
          icon: ArrowDownRight,
          iconClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400'
        };
      case 'STOPPED':
      default:
        return {
          title: 'STOPPED',
          badgeText: 'Position Held',
          badgeClass: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dotClass: 'bg-slate-500',
          icon: PauseCircle,
          iconClass: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
        };
    }
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  const getLightCondition = (lux) => {
    if (lux > 700) return 'Bright';
    if (lux >= 250) return 'Normal';
    return 'Low Light';
  };

  const getTempCondition = (temp) => {
    if (temp > 30) return 'Warm';
    if (temp >= 21) return 'Comfortable';
    return 'Cool';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {/* CARD 1: Curtain Status */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Curtain Status
          </span>
          <div className={`p-2.5 rounded-xl ${statusInfo.iconClass}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {statusInfo.title}
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusInfo.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`} />
              {statusInfo.badgeText}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 2: Curtain Position */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Position
          </span>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
            <span>{curtainPosition}</span>
            <span className="text-sm font-semibold text-slate-400">%</span>
          </div>

          <div className="mt-2.5 space-y-1.5">
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${curtainPosition}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>0% Closed</span>
              <span>100% Open</span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: Light Intensity */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Light Intensity
          </span>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Sun className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-1">
            <span>{sensorData.light}</span>
            <span className="text-xs font-semibold text-slate-400">lux</span>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {getLightCondition(sensorData.light)}
            </span>
          </div>
        </div>
      </div>

      {/* CARD 4: Room Climate */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft hover:shadow-soft-lg transition-all duration-200 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Room Climate
          </span>
          <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400">
            <Thermometer className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline justify-between">
            <div className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {sensorData.temperature}°C
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>{sensorData.humidity}% RH</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              {getTempCondition(sensorData.temperature)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCards;
