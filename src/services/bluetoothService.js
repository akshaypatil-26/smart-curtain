import { getStoredBleConfig } from '../config/bleConfig';

export const CONNECTION_STATUS = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  ERROR: 'ERROR'
};

class BluetoothService {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this.status = CONNECTION_STATUS.DISCONNECTED;
    this.statusListeners = new Set();
    this.messageListeners = new Set();
    this.errorListeners = new Set();
    this.deviceInfo = null;
    this.lastCommand = null;
    this.lastResponse = null;
  }

  isWebBluetoothSupported() {
    return typeof navigator !== 'undefined' && Boolean(navigator.bluetooth);
  }

  onStatusChange(listener) {
    this.statusListeners.add(listener);
    listener(this.status, this.deviceInfo);
    return () => this.statusListeners.delete(listener);
  }

  onMessage(listener) {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  onError(listener) {
    this.errorListeners.add(listener);
    return () => this.errorListeners.delete(listener);
  }

  _notifyStatus(status, deviceInfo = null) {
    this.status = status;
    this.deviceInfo = deviceInfo || this.deviceInfo;
    this.statusListeners.forEach((listener) => {
      try {
        listener(this.status, this.deviceInfo);
      } catch (e) {
        console.error("Status listener error:", e);
      }
    });
  }

  _notifyMessage(parsedData) {
    this.lastResponse = parsedData.raw || parsedData.state || String(parsedData.type);
    this.messageListeners.forEach((listener) => {
      try {
        listener(parsedData);
      } catch (e) {
        console.error("Message listener error:", e);
      }
    });
  }

  _notifyError(error) {
    this.errorListeners.forEach((listener) => {
      try {
        listener(error);
      } catch (e) {
        console.error("Error listener error:", e);
      }
    });
  }

  /**
   * Parse real incoming hardware messages from ESP32:
   * OPEN
   * CLOSED
   * OPENING
   * CLOSING
   * STOPPED
   * POSITION:0..100
   * LIGHT:420
   * TEMP:27
   * HUMIDITY:58
   */
  parseIncomingData(rawString) {
    const trimmed = rawString ? rawString.trim() : '';
    if (!trimmed) return null;

    const lines = trimmed.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const results = [];

    for (const line of lines) {
      if (line === 'OPEN') {
        results.push({ type: 'STATE', state: 'OPEN', position: 100, motor: 'Idle', raw: line });
      } else if (line === 'CLOSED') {
        results.push({ type: 'STATE', state: 'CLOSED', position: 0, motor: 'Idle', raw: line });
      } else if (line === 'OPENING') {
        results.push({ type: 'STATE', state: 'OPENING', motor: 'Opening', raw: line });
      } else if (line === 'CLOSING') {
        results.push({ type: 'STATE', state: 'CLOSING', motor: 'Closing', raw: line });
      } else if (line === 'STOPPED') {
        results.push({ type: 'STATE', state: 'STOPPED', motor: 'Stopped', raw: line });
      } else if (line.startsWith('POSITION:')) {
        const val = parseInt(line.substring(9), 10);
        if (!isNaN(val)) {
          const clamped = Math.max(0, Math.min(100, val));
          results.push({ 
            type: 'POSITION', 
            position: clamped, 
            state: clamped === 100 ? 'OPEN' : clamped === 0 ? 'CLOSED' : 'STOPPED',
            motor: 'Idle',
            raw: line 
          });
        }
      } else if (line.startsWith('LIGHT:')) {
        const val = parseFloat(line.substring(6));
        if (!isNaN(val)) {
          results.push({ type: 'LIGHT', light: Math.round(val), raw: line });
        }
      } else if (line.startsWith('TEMP:')) {
        const val = parseFloat(line.substring(5));
        if (!isNaN(val)) {
          results.push({ type: 'TEMP', temp: Math.round(val * 10) / 10, raw: line });
        }
      } else if (line.startsWith('HUMIDITY:')) {
        const val = parseFloat(line.substring(9));
        if (!isNaN(val)) {
          results.push({ type: 'HUMIDITY', humidity: Math.round(val), raw: line });
        }
      } else {
        results.push({ type: 'RAW', raw: line });
      }
    }

    return results;
  }

  _handleCharacteristicValueChanged = (event) => {
    try {
      const value = event.target.value;
      const decoder = new TextDecoder('utf-8');
      const text = decoder.decode(value);
      const parsedItems = this.parseIncomingData(text);
      if (parsedItems && parsedItems.length > 0) {
        parsedItems.forEach(item => this._notifyMessage(item));
      }
    } catch (e) {
      console.error("Error decoding characteristic value:", e);
    }
  };

  _handleDisconnected = () => {
    console.warn("ESP32 Device disconnected unexpectedly");
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this._notifyStatus(CONNECTION_STATUS.DISCONNECTED, null);
  };

  async connectESP32(customConfig = null) {
    if (!this.isWebBluetoothSupported()) {
      const err = new Error("Web Bluetooth is not supported in this browser. Please use Chrome on a supported device.");
      this._notifyError(err);
      throw err;
    }

    const config = customConfig || getStoredBleConfig();
    this._notifyStatus(CONNECTION_STATUS.CONNECTING);

    try {
      const options = {
        filters: [
          { name: config.deviceName },
          { namePrefix: "Smart Curtain" }
        ],
        optionalServices: [config.serviceUUID]
      };

      this.device = await navigator.bluetooth.requestDevice(options);
      this.device.addEventListener('gattserverdisconnected', this._handleDisconnected);

      this.server = await this.device.gatt.connect();
      this.service = await this.server.getPrimaryService(config.serviceUUID);
      this.characteristic = await this.service.getCharacteristic(config.characteristicUUID);

      try {
        await this.characteristic.startNotifications();
        this.characteristic.addEventListener('characteristicvaluechanged', this._handleCharacteristicValueChanged);
      } catch (notifErr) {
        console.warn("Notifications could not be enabled on characteristic:", notifErr);
      }

      const deviceInfo = {
        name: this.device.name || config.deviceName,
        id: this.device.id,
        connectedAt: new Date().toISOString()
      };

      this._notifyStatus(CONNECTION_STATUS.CONNECTED, deviceInfo);
      return deviceInfo;
    } catch (error) {
      console.error("Bluetooth connection failed:", error);
      this.server = null;
      this.service = null;
      this.characteristic = null;
      this._notifyStatus(CONNECTION_STATUS.DISCONNECTED);

      if (error.name === 'NotFoundError' || error.message.includes('User cancelled')) {
        const cancelErr = new Error("Device selection cancelled by user.");
        throw cancelErr;
      }

      const connErr = new Error("Bluetooth connection failed: " + (error.message || "Device unreachable"));
      this._notifyError(connErr);
      throw connErr;
    }
  }

  async disconnectESP32() {
    if (this.device && this.device.gatt && this.device.gatt.connected) {
      try {
        if (this.characteristic) {
          try {
            await this.characteristic.stopNotifications();
            this.characteristic.removeEventListener('characteristicvaluechanged', this._handleCharacteristicValueChanged);
          } catch (e) {
            // ignore
          }
        }
        await this.device.gatt.disconnect();
      } catch (e) {
        console.warn("Error during disconnect:", e);
      }
    }
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this._notifyStatus(CONNECTION_STATUS.DISCONNECTED, null);
  }

  /**
   * One reliable centralized motor command function:
   * sendCurtainCommand(command)
   * Strictly allowed commands: "OPEN", "STOP", "CLOSE"
   */
  async sendCurtainCommand(command) {
    if (command !== 'OPEN' && command !== 'STOP' && command !== 'CLOSE') {
      throw new Error(`Invalid motor command "${command}". Allowed: OPEN, STOP, CLOSE`);
    }

    if (this.status !== CONNECTION_STATUS.CONNECTED || !this.characteristic) {
      throw new Error("Connect ESP32 before controlling the curtain.");
    }

    try {
      this.lastCommand = command;
      const encoder = new TextEncoder();
      const data = encoder.encode(command.trim() + '\n');

      if (this.characteristic.writeValueWithResponse) {
        await this.characteristic.writeValueWithResponse(data);
      } else {
        await this.characteristic.writeValue(data);
      }

      return { success: true, command };
    } catch (error) {
      console.error(`Failed to send command ${command}:`, error);
      throw new Error(`Unable to send command: ${error.message}`);
    }
  }

  /**
   * Optional helper if ESP32 firmware supports POSITION:0-100
   */
  async sendPosition(position) {
    const val = parseInt(position, 10);
    if (isNaN(val) || val < 0 || val > 100) {
      throw new Error("Position must be an integer between 0 and 100");
    }

    const command = `POSITION:${val}`;
    if (this.status !== CONNECTION_STATUS.CONNECTED || !this.characteristic) {
      throw new Error("Connect ESP32 before controlling the curtain.");
    }

    try {
      this.lastCommand = command;
      const encoder = new TextEncoder();
      const data = encoder.encode(command + '\n');

      if (this.characteristic.writeValueWithResponse) {
        await this.characteristic.writeValueWithResponse(data);
      } else {
        await this.characteristic.writeValue(data);
      }

      return { success: true, command };
    } catch (error) {
      console.error(`Failed to send position command:`, error);
      throw new Error(`Unable to send position: ${error.message}`);
    }
  }
}

export const bluetoothService = new BluetoothService();
export default bluetoothService;
