import React, { useState } from 'react';
import { 
  Settings, 
  Bluetooth, 
  BluetoothConnected, 
  BluetoothOff, 
  RefreshCw, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  RotateCcw, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  Cpu,
  Terminal,
  ChevronDown,
  ChevronUp,
  Activity,
  Sliders
} from 'lucide-react';
import { useCurtain } from '../context/CurtainContext';

export const SettingsPage = () => {
  const { 
    bleConfig, 
    updateBleConfig, 
    resetBleConfig, 
    connectionStatus, 
    connectESP32, 
    disconnectESP32, 
    reconnectESP32,
    demoMode,
    setDemoMode,
    positionControlSupported,
    setPositionSupport,
    lastCommand,
    lastResponse,
    theme,
    setTheme,
    animationsEnabled,
    setAnimationsEnabled,
    soundEnabled,
    setSoundEnabled
  } = useCurtain();

  // Local form state for BLE configuration
  const [deviceName, setDeviceName] = useState(bleConfig.deviceName);
  const [serviceUUID, setServiceUUID] = useState(bleConfig.serviceUUID);
  const [charUUID, setCharUUID] = useState(bleConfig.characteristicUUID);
  const [showUUIDs, setShowUUIDs] = useState(false);
  const [debugOpen, setDebugOpen] = useState(true);

  const isConnected = connectionStatus === 'CONNECTED';
  const isConnecting = connectionStatus === 'CONNECTING';

  const handleSaveBleConfig = (e) => {
    e.preventDefault();
    updateBleConfig({
      deviceName: deviceName.trim(),
      serviceUUID: serviceUUID.trim(),
      characteristicUUID: charUUID.trim()
    });
  };

  const maskUUID = (uuid) => {
    if (showUUIDs) return uuid;
    if (!uuid) return '••••••••••••••••••••••••••••••••••••';
    return uuid.substring(0, 4) + '••••-••••-••••-••••' + uuid.substring(uuid.length - 4);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          System Settings & Preferences
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure Bluetooth GATT parameters, hardware simulation, and interface behavior
        </p>
      </div>

      {/* SECTION 1: System Status */}
      <div className="rounded-3xl bg-emerald-500/10 border border-emerald-500/30 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                  Curtain Motor System
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white tracking-wider">
                  Active
                </span>
              </div>
              <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
                The smart curtain controller is fully operational. Motor controls, position slider, presets, and light sensors are active.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Position Control Support Toggle */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 shrink-0 mt-0.5">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                ESP32 Position Command Support
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Enable if your ESP32 sketch supports <code>POSITION:0-100</code> commands. If your firmware only supports <code>OPEN</code>, <code>STOP</code>, and <code>CLOSE</code>, keep this off.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
              {positionControlSupported ? 'SUPPORTED' : '3-COMMAND ONLY'}
            </span>
            <button
              onClick={() => setPositionSupport(!positionControlSupported)}
              className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                positionControlSupported ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Toggle Position Support"
            >
              <span
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  positionControlSupported ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: Device / BLE Debug Panel (Collapsible) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft overflow-hidden">
        <button
          onClick={() => setDebugOpen(!debugOpen)}
          className="w-full p-6 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Device / BLE Debug
              </h3>
              <p className="text-xs text-slate-400">
                Inspect real-time GATT packet exchange and active parameters
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-xs font-semibold">{debugOpen ? 'Collapse' : 'Expand'}</span>
            {debugOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {debugOpen && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Device:</span>
                <span className="font-bold text-slate-800 dark:text-white mt-0.5 block truncate">
                  {bleConfig.deviceName}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Connection:</span>
                <span className={`font-bold mt-0.5 block ${isConnected ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Service UUID:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 mt-0.5 block truncate text-[11px]">
                  {bleConfig.serviceUUID}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Characteristic:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 mt-0.5 block truncate text-[11px]">
                  {bleConfig.characteristicUUID}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Last Command:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">
                  {lastCommand || 'None'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800">
                <span className="text-[11px] text-slate-400 block font-sans">Last Device Response:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                  {lastResponse || 'None'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Bluetooth Settings */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-7">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              <Bluetooth className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Bluetooth Settings
              </h3>
              <p className="text-xs text-slate-400">
                Web Bluetooth API GATT Services and Characteristic Configuration
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowUUIDs(!showUUIDs)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            {showUUIDs ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showUUIDs ? 'Mask UUIDs' : 'Reveal UUIDs'}</span>
          </button>
        </div>

        <form onSubmit={handleSaveBleConfig} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Device Name Filter:
            </label>
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Smart Curtain ESP32"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Service UUID:
              </label>
              <input
                type="text"
                value={showUUIDs ? serviceUUID : maskUUID(serviceUUID)}
                onChange={(e) => {
                  if (showUUIDs) setServiceUUID(e.target.value);
                }}
                readOnly={!showUUIDs}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Characteristic UUID (RX / TX):
              </label>
              <input
                type="text"
                value={showUUIDs ? charUUID : maskUUID(charUUID)}
                onChange={(e) => {
                  if (showUUIDs) setCharUUID(e.target.value);
                }}
                readOnly={!showUUIDs}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={resetBleConfig}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Defaults
            </button>

            {showUUIDs && (
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Update BLE Configuration
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <button
            onClick={connectESP32}
            disabled={isConnected || isConnecting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            <Bluetooth className="w-4 h-4" />
            Connect ESP32
          </button>

          <button
            onClick={disconnectESP32}
            disabled={!isConnected}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            <BluetoothOff className="w-4 h-4" />
            Disconnect ESP32
          </button>

          <button
            onClick={reconnectESP32}
            disabled={!isConnected && !isConnecting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-40"
          >
            <RefreshCw className="w-4 h-4" />
            Reconnect Link
          </button>
        </div>
      </div>

      {/* SECTION 5: Interface Settings */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6 sm:p-7 space-y-5">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Interface & Experience Settings
          </h3>
          <p className="text-xs text-slate-400">
            Customize visual theme, motion animations, and audio haptics
          </p>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          <div className="py-3.5 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-white block">
                Dashboard Appearance
              </span>
              <span className="text-xs text-slate-400">
                Switch between clean light canvas and immersive dark mode
              </span>
            </div>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-xs font-bold"
            >
              {theme === 'dark' ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-400" />
                  Dark Mode
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  Light Mode
                </>
              )}
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-white block">
                Fluid Animations
              </span>
              <span className="text-xs text-slate-400">
                Smooth curtain gliding and responsive visual transitions
              </span>
            </div>
            <button
              onClick={() => setAnimationsEnabled(!animationsEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                animationsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="py-3.5 flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-slate-800 dark:text-white block">
                Audio Tone Feedback
              </span>
              <span className="text-xs text-slate-400">
                Web Audio synthesizer beeps on command dispatch & BLE connections
              </span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
