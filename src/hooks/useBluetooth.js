import { useCurtain } from '../context/CurtainContext';

export const useBluetooth = () => {
  const {
    connectionStatus,
    deviceInfo,
    bleConfig,
    updateBleConfig,
    resetBleConfig,
    connectESP32,
    disconnectESP32,
    reconnectESP32,
    isWebBluetoothSupported,
    demoMode
  } = useCurtain();

  const isConnected = connectionStatus === 'CONNECTED';
  const isConnecting = connectionStatus === 'CONNECTING';

  return {
    connectionStatus,
    deviceInfo,
    bleConfig,
    updateBleConfig,
    resetBleConfig,
    connectESP32,
    disconnectESP32,
    reconnectESP32,
    isWebBluetoothSupported,
    isConnected,
    isConnecting,
    demoMode
  };
};

export default useBluetooth;
