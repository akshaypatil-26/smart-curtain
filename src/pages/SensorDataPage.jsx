import React, { useState } from 'react';
import { 
  Activity, 
  Sun, 
  Thermometer, 
  Droplets, 
  Blinds, 
  Wifi, 
  BatteryCharging, 
  Clock, 
  RefreshCw,
  TrendingUp,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCurtain } from '../context/CurtainContext';

export const SensorDataPage = () => {
  const { 
    sensorData, 
    sensorHistory, 
    curtainPosition, 
    curtainState, 
    connectionStatus, 
    deviceInfo,
    demoMode,
    setSensorData 
  } = useCurtain();

  const [activeChartMetric, setActiveChartMetric] = useState('light'); // light, temperature, humidity, position
  const isConnected = connectionStatus === 'CONNECTED';

  // SVG Chart points calculation
  const dataPoints = sensorHistory || [];
  const maxValues = {
    light: 1000,
    temperature: 45,
    humidity: 100,
    position: 100
  };

  const getMetricColor = (metric) => {
    switch (metric) {
      case 'light': return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)', name: 'Light Intensity (lux)' };
      case 'temperature': return { stroke: '#f97316', fill: 'rgba(249, 115, 22, 0.15)', name: 'Temperature (°C)' };
      case 'humidity': return { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.15)', name: 'Humidity (% RH)' };
      case 'position': return { stroke: '#8b5cf6', fill: 'rgba(139, 92, 246, 0.15)', name: 'Curtain Position (%)' };
      default: return { stroke: '#2563eb', fill: 'rgba(37, 99, 235, 0.15)', name: 'Telemetry' };
    }
  };

  const activeColor = getMetricColor(activeChartMetric);

  // Generate SVG path for trendline
  const width = 600;
  const height = 200;
  const padding = 20;

  const getSvgCoordinates = () => {
    if (dataPoints.length === 0) return '';
    const maxVal = maxValues[activeChartMetric];
    const stepX = (width - padding * 2) / (dataPoints.length - 1 || 1);

    const points = dataPoints.map((item, idx) => {
      const val = item[activeChartMetric] || 0;
      const x = padding + idx * stepX;
      const y = height - padding - (val / maxVal) * (height - padding * 2);
      return `${x},${y}`;
    });

    return points.join(' ');
  };

  const linePath = dataPoints.length > 0 ? `M ${getSvgCoordinates()}` : '';
  const areaPath = dataPoints.length > 0 ? `M ${padding},${height - padding} L ${getSvgCoordinates()} L ${width - padding},${height - padding} Z` : '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Sensor Telemetry & Analytics
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time environmental sensor logs and curtain state telemetry
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Sensor Stream Active</span>
          </span>
        </div>
      </div>

      {/* 4 Large Real-time Metric Dials */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Light */}
        <div 
          onClick={() => setActiveChartMetric('light')}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
            activeChartMetric === 'light'
              ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Light Sensor</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
              <Sun className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {sensorData.light} <span className="text-sm font-semibold text-slate-400">lux</span>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1">
              BH1750 Ambient Sensor
            </p>
          </div>
        </div>

        {/* Temperature */}
        <div 
          onClick={() => setActiveChartMetric('temperature')}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
            activeChartMetric === 'temperature'
              ? 'border-orange-500 bg-orange-50/20 dark:bg-orange-950/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Temperature</span>
            <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-500">
              <Thermometer className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {sensorData.temperature}° <span className="text-sm font-semibold text-slate-400">C</span>
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold mt-1">
              DHT22 Precision Sensor
            </p>
          </div>
        </div>

        {/* Humidity */}
        <div 
          onClick={() => setActiveChartMetric('humidity')}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
            activeChartMetric === 'humidity'
              ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Relative Humidity</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-500">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {sensorData.humidity} <span className="text-sm font-semibold text-slate-400">% RH</span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-1">
              Capacitive Humidity
            </p>
          </div>
        </div>

        {/* Curtain Position */}
        <div 
          onClick={() => setActiveChartMetric('position')}
          className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
            activeChartMetric === 'position'
              ? 'border-purple-500 bg-purple-50/20 dark:bg-purple-950/20 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Curtain Position</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-500">
              <Blinds className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {curtainPosition} <span className="text-sm font-semibold text-slate-400">%</span>
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-1">
              State: {curtainState}
            </p>
          </div>
        </div>
      </div>

      {/* SVG Interactive Telemetry Chart */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Sensor Trend Timeline: {activeColor.name}
            </h3>
            <p className="text-xs text-slate-400">
              Rolling real-time readings window (20 periodic samples)
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {[
              { id: 'light', label: 'Light' },
              { id: 'temperature', label: 'Temp' },
              { id: 'humidity', label: 'Humidity' },
              { id: 'position', label: 'Curtain %' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveChartMetric(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeChartMetric === tab.id
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* SVG Graph */}
        <div className="mt-6 w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-64">
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeColor.stroke} stopOpacity="0.3" />
                <stop offset="100%" stopColor={activeColor.stroke} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid lines */}
            {[0.25, 0.5, 0.75].map((pct, idx) => {
              const y = height - padding - pct * (height - padding * 2);
              return (
                <line
                  key={idx}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-slate-800 stroke-[1]"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Area Fill */}
            {areaPath && (
              <path d={areaPath} fill="url(#metricGradient)" />
            )}

            {/* Line Path */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke={activeColor.stroke}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* Time axis labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-2 px-4">
            <span>{dataPoints[0]?.time || 'T-20m'}</span>
            <span>Rolling Sensor Stream</span>
            <span>{dataPoints[dataPoints.length - 1]?.time || 'Now'}</span>
          </div>
        </div>
      </div>

      {/* Hardware Telemetry Specs Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <Wifi className="w-5 h-5 text-emerald-500" />
            ESP32 Radio & Connection Health
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850">
              <span className="text-slate-500">Bluetooth RSSI Signal:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                {isConnected ? `${sensorData.rssi} dBm (Good)` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850">
              <span className="text-slate-500">Power Supply Rail:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                12V DC (Regulated 3.3V Core)
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-850">
              <span className="text-slate-500">ESP32 Device Node:</span>
              <span className="font-mono font-bold text-slate-800 dark:text-white">
                {deviceInfo?.name || 'Smart Curtain ESP32'}
              </span>
            </div>
          </div>
        </div>

        {/* Sensor Calibration & Tuning */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <Sliders className="w-5 h-5 text-purple-600" />
            Sensor Calibration & Tuning Controls
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Manually calibrate sensor readings to test threshold triggers
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">Light Override:</span>
                <span className="font-mono font-bold text-amber-500">{sensorData.light} lux</span>
              </div>
              <input
                type="range"
                min="50"
                max="1200"
                value={sensorData.light}
                onChange={(e) => setSensorData(prev => ({ ...prev, light: parseInt(e.target.value, 10) }))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-500">Temperature Override:</span>
                <span className="font-mono font-bold text-orange-500">{sensorData.temperature}°C</span>
              </div>
              <input
                type="range"
                min="18"
                max="38"
                step="0.5"
                value={sensorData.temperature}
                onChange={(e) => setSensorData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorDataPage;
