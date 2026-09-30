import React, { useState } from 'react';
import { 
  Sliders, 
  ArrowUp, 
  ArrowDown, 
  Square, 
  Compass, 
  Gauge, 
  Cpu, 
  Zap, 
  Terminal,
  Send,
  CheckCircle2
} from 'lucide-react';
import { useCurtain } from '../context/CurtainContext';
import { useToast } from '../context/ToastContext';

export const ControlPage = () => {
  const { 
    curtainPosition, 
    curtainState, 
    motorState,
    openCurtain, 
    closeCurtain, 
    stopCurtain, 
    moveToPosition 
  } = useCurtain();
  const { showSuccess, showError } = useToast();

  const [motorSpeed, setMotorSpeed] = useState('normal');
  const [customCmd, setCustomCmd] = useState('');
  const [commandConsoleLogs, setCommandConsoleLogs] = useState([
    { id: 1, text: "Simulation Command Engine Ready.", type: "system", time: "Ready" }
  ]);

  const handleNudge = (delta) => {
    const target = Math.max(0, Math.min(100, curtainPosition + delta));
    moveToPosition(target);
  };

  const handleCalibration = (type) => {
    if (type === 'open') {
      showSuccess("Open limit calibrated: Moving to 100%", "Limit Calibrated");
      openCurtain();
    } else {
      showSuccess("Close limit calibrated: Moving to 0%", "Limit Calibrated");
      closeCurtain();
    }
  };

  const handleSendCustomCommand = (e) => {
    e.preventDefault();
    const cmd = customCmd.trim().toUpperCase();
    if (!cmd) return;

    if (cmd === 'OPEN') {
      openCurtain();
    } else if (cmd === 'CLOSE') {
      closeCurtain();
    } else if (cmd === 'STOP') {
      stopCurtain();
    } else if (cmd.startsWith('POSITION:')) {
      const val = parseInt(cmd.replace('POSITION:', ''), 10);
      if (!isNaN(val) && val >= 0 && val <= 100) {
        moveToPosition(val);
      } else {
        showError("Invalid position value. Use POSITION:0 to POSITION:100", "Command Error");
        return;
      }
    } else {
      showError("Unknown command. Allowed: OPEN, STOP, CLOSE", "Command Error");
      return;
    }

    setCommandConsoleLogs(prev => [
      { id: Date.now(), text: `EXEC >> ${cmd}`, type: "sent", time: new Date().toLocaleTimeString() },
      ...prev
    ]);
    setCustomCmd('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Fine-Grained Curtain Control
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Micro-stepping, calibration triggers, and interactive command terminal
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold border bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            State: {curtainState} ({curtainPosition}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Direct Controls & Calibration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Micro-Stepping Controls */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-600" />
              Micro-Stepping (Incremental Adjustments)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust the curtain motor in precise step intervals
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <button
                onClick={() => handleNudge(-10)}
                disabled={curtainPosition <= 0}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-[0.98] disabled:opacity-40"
              >
                <span className="text-rose-600 dark:text-rose-400 text-sm font-extrabold">-10%</span>
                <span className="text-[10px] text-slate-400">Step Close</span>
              </button>

              <button
                onClick={() => handleNudge(-5)}
                disabled={curtainPosition <= 0}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-[0.98] disabled:opacity-40"
              >
                <span className="text-rose-600 dark:text-rose-400 text-sm font-extrabold">-5%</span>
                <span className="text-[10px] text-slate-400">Nudge Close</span>
              </button>

              <button
                onClick={() => handleNudge(5)}
                disabled={curtainPosition >= 100}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-[0.98] disabled:opacity-40"
              >
                <span className="text-blue-600 dark:text-blue-400 text-sm font-extrabold">+5%</span>
                <span className="text-[10px] text-slate-400">Nudge Open</span>
              </button>

              <button
                onClick={() => handleNudge(10)}
                disabled={curtainPosition >= 100}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex flex-col items-center gap-1 transition-all active:scale-[0.98] disabled:opacity-40"
              >
                <span className="text-blue-600 dark:text-blue-400 text-sm font-extrabold">+10%</span>
                <span className="text-[10px] text-slate-400">Step Open</span>
              </button>
            </div>

            {/* Target Percentage jumps */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2.5">
                Exact Position Jumps
              </span>
              <div className="grid grid-cols-5 gap-2">
                {[0, 25, 50, 75, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => moveToPosition(val)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all ${
                      curtainPosition === val
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {val}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Limit Switch Calibration */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Hardware Limit Calibration
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Test end-of-travel limit switch endpoints
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-white block">
                    Fully Open Limit (100%)
                  </span>
                  <span className="text-[11px] text-slate-400">Triggers OPEN stroke</span>
                </div>
                <button
                  onClick={() => handleCalibration('open')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Send OPEN
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-slate-800 dark:text-white block">
                    Fully Closed Limit (0%)
                  </span>
                  <span className="text-[11px] text-slate-400">Triggers CLOSE stroke</span>
                </div>
                <button
                  onClick={() => handleCalibration('close')}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Send CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Motor Telemetry & Command Console (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-500" />
              Drive System Telemetry
            </h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs mt-4">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Motor Driver:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">L298N / Dual H-Bridge</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Motor State:</span>
                <span className={`font-bold ${
                  motorState === 'Opening' || motorState === 'Closing'
                    ? 'text-blue-600 dark:text-blue-400 animate-pulse'
                    : 'text-slate-600 dark:text-slate-300'
                }`}>
                  {motorState}
                </span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Control Mode:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Direct Motor Control
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Command Terminal */}
          <div className="rounded-3xl bg-navy-900 border border-slate-800 shadow-xl p-6 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Command Console</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">Interactive</span>
            </div>

            <div className="mt-3 h-36 bg-navy-950/80 rounded-xl p-3 font-mono text-[11px] overflow-y-auto space-y-1.5 border border-slate-800/80">
              {commandConsoleLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-500 text-[10px]">{log.time}</span>
                  <span className={log.type === 'sent' ? 'text-emerald-400' : 'text-blue-300'}>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendCustomCommand} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={customCmd}
                onChange={(e) => setCustomCmd(e.target.value)}
                placeholder="e.g. OPEN, STOP, CLOSE"
                className="flex-1 bg-navy-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                title="Send Command"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-400">
              <span>Quick Buttons:</span>
              {['OPEN', 'STOP', 'CLOSE'].map(cmd => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => setCustomCmd(cmd)}
                  className="font-mono bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-slate-300"
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlPage;
