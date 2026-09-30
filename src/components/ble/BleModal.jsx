import React, { useState } from 'react';
import { 
  Bluetooth, 
  BluetoothConnected, 
  BluetoothOff, 
  X, 
  RefreshCw, 
  ShieldCheck, 
  AlertTriangle,
  Cpu,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { useCurtain } from '../../context/CurtainContext';

export const BleModal = ({ isOpen, onClose }) => {
  const { 
    connectionStatus, 
    deviceInfo, 
    bleConfig, 
    updateBleConfig, 
    connectESP32, 
    disconnectESP32, 
    reconnectESP32,
    isWebBluetoothSupported,
    demoMode,
    setDemoMode
  } = useCurtain();

  const [copiedUUID, setCopiedUUID] = useState(false);

  if (!isOpen) return null;

  const isConnected = connectionStatus === 'CONNECTED';
  const isConnecting = connectionStatus === 'CONNECTING';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUUID(true);
    setTimeout(() => setCopiedUUID(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isConnected ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
            }`}>
              <Bluetooth className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                ESP32 Bluetooth Connection
              </h2>
              <p className="text-xs text-slate-400">
                Web Bluetooth API Low Energy Link
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Web Bluetooth Support Warning if unsupported */}
          {!isWebBluetoothSupported && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-start gap-3 text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-bold">Web Bluetooth is not supported in this browser.</p>
                <p className="text-amber-800 dark:text-amber-300">
                  Please use Google Chrome, Microsoft Edge, or Opera on Windows, Android, macOS, or ChromeOS for Web Bluetooth connectivity.
                </p>
              </div>
            </div>
          )}

          {/* Connection Status Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Connection Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? 'bg-emerald-500 shadow-glow-green' : isConnecting ? 'bg-amber-500 animate-ping' : 'bg-rose-500'
                }`} />
                <span className="text-sm font-bold text-slate-800 dark:text-white">
                  {isConnected ? 'ESP32 Connected' : isConnecting ? 'Searching / Pairing...' : 'Disconnected'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isConnected ? (
                <button
                  onClick={disconnectESP32}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 transition-colors"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={connectESP32}
                  disabled={isConnecting}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  <Bluetooth className="w-3.5 h-3.5" />
                  {isConnecting ? 'Pairing...' : 'Connect ESP32'}
                </button>
              )}
            </div>
          </div>

          {/* Configured Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active BLE Profile Details
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Device Name Filter:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {bleConfig.deviceName}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">Service UUID:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate block">
                    {bleConfig.serviceUUID}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(bleConfig.serviceUUID)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Copy UUID"
                >
                  {copiedUUID ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/40 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-slate-500 dark:text-slate-400 font-medium block">Characteristic UUID:</span>
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate block">
                    {bleConfig.characteristicUUID}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(bleConfig.characteristicUUID)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Copy UUID"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={reconnectESP32}
            disabled={!isConnected && !isConnecting}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-40"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reconnect Link
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BleModal;
