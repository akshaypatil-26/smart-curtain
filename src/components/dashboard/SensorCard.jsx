import React from 'react';
import { Sun, Thermometer, Droplets, Activity, RefreshCw } from 'lucide-react';
import { useCurtain } from '../../context/CurtainContext';

export const SensorCard = ({ onNavigateToSensors }) => {
  const { sensorData, demoMode, setSensorData } = useCurtain();

  // Helper status tags
  const getLightStatus = (lux) => {
    if (lux > 700) return { label: 'High / Bright', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400' };
    if (lux >= 250) return { label: 'Normal Daylight', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400' };
    return { label: 'Low Light / Night', color: 'text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-400' };
  };

  const getTempStatus = (temp) => {
    if (temp > 30) return { label: 'Warm', color: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/50 dark:text-orange-400' };
    if (temp >= 20) return { label: 'Comfortable', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400' };
    return { label: 'Cool', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400' };
  };

  const getHumStatus = (hum) => {
    if (hum > 70) return { label: 'Humid', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400' };
    if (hum >= 40) return { label: 'Optimal Normal', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400' };
    return { label: 'Dry', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400' };
  };

  const lightInfo = getLightStatus(sensorData.light);
  const tempInfo = getTempStatus(sensorData.temperature);
  const humInfo = getHumStatus(sensorData.humidity);

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-7">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Live Sensor Telemetry
            </h2>
            <p className="text-xs text-slate-400">
              ESP32 environmental sensors (BH1750 / LDR & DHT22)
            </p>
          </div>
        </div>

        {onNavigateToSensors && (
          <button
            onClick={onNavigateToSensors}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            View Full Analytics →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
        {/* LIGHT SENSOR */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Light Intensity
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {sensorData.light} <span className="text-xs font-semibold text-slate-400">lux</span>
            </div>
          </div>
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${lightInfo.color}`}>
              {lightInfo.label}
            </span>
          </div>
        </div>

        {/* TEMPERATURE SENSOR */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Room Temperature
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {sensorData.temperature}° <span className="text-xs font-semibold text-slate-400">C</span>
            </div>
          </div>
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${tempInfo.color}`}>
              {tempInfo.label}
            </span>
          </div>
        </div>

        {/* HUMIDITY SENSOR */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850/50 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Air Humidity
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {sensorData.humidity} <span className="text-xs font-semibold text-slate-400">% RH</span>
            </div>
          </div>
          <div>
            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${humInfo.color}`}>
              {humInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorCard;
