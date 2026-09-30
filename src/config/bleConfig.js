/**
 * Bluetooth Low Energy Configuration for Smart Curtain ESP32
 * 
 * Edit these UUIDs or device name to match your specific ESP32 firmware sketch.
 * Standard Nordic UART / Custom 128-bit UUID format.
 */

export const DEFAULT_BLE_CONFIG = {
  deviceName: "Smart Curtain ESP32",
  serviceUUID: "4fafc201-1fb5-459e-8fcc-c5c9c331914b",
  characteristicUUID: "beb5483e-36e1-4688-b7f5-ea07361b26a8",
  // Optional secondary notification characteristic if split RX/TX
  notifyCharacteristicUUID: "beb5483e-36e1-4688-b7f5-ea07361b26a8",
};

export const getStoredBleConfig = () => {
  try {
    const saved = localStorage.getItem("smart_curtain_ble_config");
    if (saved) {
      return { ...DEFAULT_BLE_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Could not load stored BLE config:", e);
  }
  return DEFAULT_BLE_CONFIG;
};

export const saveBleConfig = (config) => {
  try {
    localStorage.setItem("smart_curtain_ble_config", JSON.stringify(config));
  } catch (e) {
    console.error("Could not save BLE config:", e);
  }
};
