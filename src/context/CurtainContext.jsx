import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import soundService from '../services/soundService';
import { useToast } from './ToastContext';

const CurtainContext = createContext(null);

export const CurtainProvider = ({ children }) => {
  const { showSuccess, showInfo, showWarning } = useToast();

  // Standalone state
  const demoStatus = "Active";
  const [demoMode, setDemoMode] = useState(true);

  // Curtain Position & States
  // Initial state is CLOSED (0%) so user can immediately test OPEN -> STOP -> CLOSE
  const [curtainPosition, setCurtainPosition] = useState(0);
  const [curtainState, setCurtainState] = useState('CLOSED'); // 'OPEN' | 'CLOSED' | 'OPENING' | 'CLOSING' | 'STOPPED'
  const [motorState, setMotorState] = useState('Idle'); // 'Idle' | 'Opening' | 'Closing' | 'Stopped'

  // Ref to track latest position synchronously for callbacks & intervals
  const positionRef = useRef(0);
  useEffect(() => {
    positionRef.current = curtainPosition;
  }, [curtainPosition]);

  // Operation Mode: 'manual' | 'automatic'
  const [mode, setModeState] = useState(() => {
    return localStorage.getItem('smart_curtain_mode') || 'manual';
  });

  // Automation Thresholds
  const [autoThresholds, setAutoThresholds] = useState(() => {
    const saved = localStorage.getItem('smart_curtain_thresholds');
    return saved ? JSON.parse(saved) : {
      closeAboveLux: 700,
      openBelowLux: 250,
      midPosition: 50,
      enabled: false
    };
  });

  // Simulated Environmental Sensors
  const [sensorData, setSensorData] = useState({
    light: 420,
    temperature: 27.0,
    humidity: 58,
    battery: 98,
    rssi: -62,
    lastUpdated: new Date()
  });

  // Sensor History for rolling analytics charts
  const [sensorHistory, setSensorHistory] = useState(() => {
    const initial = [];
    const now = Date.now();
    for (let i = 19; i >= 0; i--) {
      const time = new Date(now - i * 60000);
      initial.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        light: Math.floor(400 + Math.sin(i / 3) * 50),
        temperature: 27.0,
        humidity: 58,
        position: 0
      });
    }
    return initial;
  });

  // UI Preferences
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('smart_curtain_theme') || 'light';
  });
  const [animationsEnabled, setAnimationsEnabledState] = useState(() => {
    const saved = localStorage.getItem('smart_curtain_animations');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('smart_curtain_sound');
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Fallback BLE Config for settings compatibility without requiring actual BLE
  const [bleConfig, setBleConfig] = useState({
    deviceName: 'Smart Curtain ESP32',
    serviceUUID: '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
    characteristicUUID: 'beb5483e-36e1-4688-b7f5-ea07361b26a8'
  });
  const [lastCommand, setLastCommand] = useState('None');
  const [lastResponse, setLastResponse] = useState('OK');
  const [positionControlSupported, setPositionControlSupported] = useState(true);

  // Activity Log
  const [eventLogs, setEventLogs] = useState([
    { id: 1, text: "System ready. Ready for instant curtain control.", time: "Ready", type: "system" }
  ]);

  const addEventLog = useCallback((text, type = "info") => {
    const newLog = {
      id: Date.now(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type
    };
    setEventLogs(prev => [newLog, ...prev.slice(0, 49)]);
  }, []);

  // Animation Interval Ref
  const movementIntervalRef = useRef(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (movementIntervalRef.current) {
        clearInterval(movementIntervalRef.current);
      }
    };
  }, []);

  // Sync sound settings
  useEffect(() => {
    soundService.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Apply Dark Theme Class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Clear running animation interval
  const clearMovement = useCallback(() => {
    if (movementIntervalRef.current) {
      clearInterval(movementIntervalRef.current);
      movementIntervalRef.current = null;
    }
  }, []);

  /**
   * STOP COMMAND:
   * Immediately stop the curtain animation at its current position.
   * Status must become "STOPPED".
   * The curtain must remain at that exact position.
   */
  const stopCurtain = useCallback(() => {
    clearMovement();
    soundService.playStop();
    const current = positionRef.current;
    setCurtainState('STOPPED');
    setMotorState('Stopped');
    setLastCommand('STOP');
    setLastResponse('ACK:STOPPED');
    addEventLog(`Curtain halted at ${current}%`, "curtain");
    showSuccess(`Curtain stopped at ${current}%.`, "Stopped");
  }, [clearMovement, addEventLog, showSuccess]);

  /**
   * OPEN COMMAND:
   * When clicked, curtain must visibly animate from current to 100%.
   * Status must change to "OPENING" and then "OPEN".
   * Position must smoothly move from 0% to 100%.
   */
  const openCurtain = useCallback(() => {
    clearMovement();
    soundService.playOpen();

    const current = positionRef.current;
    if (current >= 100) {
      setCurtainPosition(100);
      setCurtainState('OPEN');
      setMotorState('Idle');
      showInfo("Curtain is already fully open.", "Open");
      return;
    }

    setCurtainState('OPENING');
    setMotorState('Opening');
    setLastCommand('OPEN');
    setLastResponse('ACK:OPENING');
    showSuccess("Opening curtain...", "Opening");
    addEventLog("Command: OPEN curtain", "command");

    const step = 2; // 2% per step
    const stepIntervalMs = 40; // 40ms -> 50 steps -> 2.0s full smooth travel

    movementIntervalRef.current = setInterval(() => {
      setCurtainPosition((prev) => {
        const next = Math.min(100, prev + step);
        positionRef.current = next;
        if (next >= 100) {
          clearMovement();
          setCurtainState('OPEN');
          setMotorState('Idle');
          setLastResponse('ACK:OPEN');
          addEventLog("Curtain reached 100% (OPEN)", "curtain");
          showSuccess("Curtain is now fully open.", "Open");
          return 100;
        }
        return next;
      });
    }, stepIntervalMs);
  }, [clearMovement, addEventLog, showSuccess, showInfo]);

  /**
   * CLOSE COMMAND:
   * When clicked, curtain must visibly animate from current to 0%.
   * Status must show "CLOSING" and then "CLOSED".
   * Position must smoothly move from 100% to 0%.
   */
  const closeCurtain = useCallback(() => {
    clearMovement();
    soundService.playClose();

    const current = positionRef.current;
    if (current <= 0) {
      setCurtainPosition(0);
      setCurtainState('CLOSED');
      setMotorState('Idle');
      showInfo("Curtain is already fully closed.", "Closed");
      return;
    }

    setCurtainState('CLOSING');
    setMotorState('Closing');
    setLastCommand('CLOSE');
    setLastResponse('ACK:CLOSING');
    showSuccess("Closing curtain...", "Closing");
    addEventLog("Command: CLOSE curtain", "command");

    const step = 2; // 2% per step
    const stepIntervalMs = 40; // 40ms -> 50 steps -> 2.0s full smooth travel

    movementIntervalRef.current = setInterval(() => {
      setCurtainPosition((prev) => {
        const next = Math.max(0, prev - step);
        positionRef.current = next;
        if (next <= 0) {
          clearMovement();
          setCurtainState('CLOSED');
          setMotorState('Idle');
          setLastResponse('ACK:CLOSED');
          addEventLog("Curtain reached 0% (CLOSED)", "curtain");
          showSuccess("Curtain is now fully closed.", "Closed");
          return 0;
        }
        return next;
      });
    }, stepIntervalMs);
  }, [clearMovement, addEventLog, showSuccess, showInfo]);

  /**
   * Smooth target positioning (e.g. for presets or slider clicks)
   */
  const moveToPosition = useCallback((target) => {
    clearMovement();
    const clampedTarget = Math.max(0, Math.min(100, Math.round(target)));
    const current = positionRef.current;

    if (current === clampedTarget) {
      const finalState = clampedTarget === 100 ? 'OPEN' : clampedTarget === 0 ? 'CLOSED' : 'STOPPED';
      setCurtainState(finalState);
      setMotorState('Idle');
      return;
    }

    const isOpening = clampedTarget > current;
    setCurtainState(isOpening ? 'OPENING' : 'CLOSING');
    setMotorState(isOpening ? 'Opening' : 'Closing');
    setLastCommand(`POSITION:${clampedTarget}`);
    setLastResponse(`ACK:MOVING_TO_${clampedTarget}`);

    const step = isOpening ? 2 : -2;
    const speedMs = 35;

    movementIntervalRef.current = setInterval(() => {
      setCurtainPosition((prev) => {
        const next = prev + step;
        const reached = isOpening ? next >= clampedTarget : next <= clampedTarget;
        if (reached) {
          clearMovement();
          positionRef.current = clampedTarget;
          const finalState = clampedTarget === 100 ? 'OPEN' : clampedTarget === 0 ? 'CLOSED' : 'STOPPED';
          setCurtainState(finalState);
          setMotorState('Idle');
          setLastResponse(`ACK:AT_${clampedTarget}`);
          addEventLog(`Curtain reached ${clampedTarget}%`, "curtain");
          return clampedTarget;
        }
        positionRef.current = next;
        return next;
      });
    }, speedMs);
  }, [clearMovement, addEventLog]);

  /**
   * Manual position change via slider dragging
   * Instantly updates position without animation lag
   */
  const setDirectPosition = useCallback((newPos) => {
    clearMovement();
    const clamped = Math.max(0, Math.min(100, Math.round(newPos)));
    positionRef.current = clamped;
    setCurtainPosition(clamped);
    if (clamped === 100) {
      setCurtainState('OPEN');
    } else if (clamped === 0) {
      setCurtainState('CLOSED');
    } else {
      setCurtainState('STOPPED');
    }
    setMotorState('Idle');
    setLastCommand(`SCRUB:${clamped}`);
  }, [clearMovement]);

  // Mode Setter
  const setMode = (newMode) => {
    setModeState(newMode);
    localStorage.setItem('smart_curtain_mode', newMode);
    setAutoThresholds(prev => {
      const updated = { ...prev, enabled: newMode === 'automatic' };
      localStorage.setItem('smart_curtain_thresholds', JSON.stringify(updated));
      return updated;
    });
    addEventLog(`Control mode: ${newMode.toUpperCase()}`, "mode");
    showInfo(`Mode switched to ${newMode === 'automatic' ? 'Automatic Mode' : 'Manual Mode'}`);
  };

  const updateThresholds = (newThresholds) => {
    const updated = { ...autoThresholds, ...newThresholds };
    setAutoThresholds(updated);
    localStorage.setItem('smart_curtain_thresholds', JSON.stringify(updated));
    showSuccess("Automation rules updated successfully.");
  };

  const setTheme = (val) => {
    setThemeState(val);
    localStorage.setItem('smart_curtain_theme', val);
  };

  const setAnimationsEnabled = (val) => {
    setAnimationsEnabledState(val);
    localStorage.setItem('smart_curtain_animations', JSON.stringify(val));
  };

  const setSoundEnabled = (val) => {
    setSoundEnabledState(val);
    localStorage.setItem('smart_curtain_sound', JSON.stringify(val));
  };

  const updateBleConfig = (cfg) => {
    setBleConfig(prev => ({ ...prev, ...cfg }));
    showSuccess("Configuration saved successfully.");
  };

  const resetBleConfig = () => {
    setBleConfig({
      deviceName: 'Smart Curtain ESP32',
      serviceUUID: '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
      characteristicUUID: 'beb5483e-36e1-4688-b7f5-ea07361b26a8'
    });
    showInfo("BLE configuration reset to defaults.");
  };

  const connectESP32 = () => {
    showInfo("Device connected and operational.");
  };

  const disconnectESP32 = () => {
    showInfo("Device disconnected.");
  };

  const reconnectESP32 = () => {
    showInfo("Connection link reset.");
  };

  // Automatic Mode Logic (Autonomous light-based response)
  useEffect(() => {
    if (mode !== 'automatic') return;

    const { closeAboveLux, openBelowLux } = autoThresholds;
    const currentLux = sensorData.light;
    const currentPos = positionRef.current;

    if (currentLux >= closeAboveLux && currentPos !== 0 && curtainState !== 'CLOSING') {
      addEventLog(`Auto: High Light (${currentLux} lux) -> Closing curtain`, "auto");
      showInfo(`Auto mode: High light (${currentLux} lux). Closing curtain.`);
      closeCurtain();
    } else if (currentLux <= openBelowLux && currentPos !== 100 && curtainState !== 'OPENING') {
      addEventLog(`Auto: Low Light (${currentLux} lux) -> Opening curtain`, "auto");
      showInfo(`Auto mode: Low light (${currentLux} lux). Opening curtain.`);
      openCurtain();
    }
  }, [sensorData.light, mode, autoThresholds, curtainState, closeCurtain, openCurtain, addEventLog, showInfo]);

  // Realistic sensor drift simulation
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      setSensorData((prev) => {
        const lightDelta = Math.floor((Math.random() - 0.48) * 12);
        const tempDelta = parseFloat(((Math.random() - 0.5) * 0.2).toFixed(1));
        const humDelta = Math.floor((Math.random() - 0.5) * 2);

        return {
          ...prev,
          light: Math.max(50, Math.min(1200, prev.light + lightDelta)),
          temperature: parseFloat(Math.max(18, Math.min(38, prev.temperature + tempDelta)).toFixed(1)),
          humidity: Math.max(30, Math.min(85, prev.humidity + humDelta)),
          lastUpdated: new Date()
        };
      });
    }, 4500);

    return () => clearInterval(sensorInterval);
  }, []);

  // Rolling sensor history logger
  useEffect(() => {
    const historyInterval = setInterval(() => {
      setSensorHistory((prev) => {
        const latest = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          light: sensorData.light,
          temperature: sensorData.temperature,
          humidity: sensorData.humidity,
          position: positionRef.current
        };
        return [...prev.slice(1), latest];
      });
    }, 15000);

    return () => clearInterval(historyInterval);
  }, [sensorData]);

  return (
    <CurtainContext.Provider
      value={{
        demoStatus,
        demoMode,
        setDemoMode,
        isAvailable: true,

        curtainPosition,
        curtainState,
        motorState,

        openCurtain,
        closeCurtain,
        stopCurtain,
        moveToPosition,
        setDirectPosition,

        mode,
        setMode,
        autoThresholds,
        updateThresholds,

        sensorData,
        sensorHistory,
        setSensorData,

        theme,
        setTheme,
        animationsEnabled,
        setAnimationsEnabled,
        soundEnabled,
        setSoundEnabled,

        bleConfig,
        updateBleConfig,
        resetBleConfig,
        connectionStatus: 'CONNECTED',
        deviceInfo: { name: 'Smart Curtain ESP32', id: 'ESP32-NODE-01' },
        connectESP32,
        disconnectESP32,
        reconnectESP32,
        isWebBluetoothSupported: true,
        positionControlSupported,
        setPositionSupport: setPositionControlSupported,
        lastCommand,
        lastResponse,

        eventLogs,
        addEventLog
      }}
    >
      {children}
    </CurtainContext.Provider>
  );
};

export const useCurtain = () => {
  const context = useContext(CurtainContext);
  if (!context) {
    throw new Error('useCurtain must be used within a CurtainProvider');
  }
  return context;
};

export default CurtainContext;
