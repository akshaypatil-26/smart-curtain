# Smart Curtain Control — Web Bluetooth IoT Application

Control Your Comfort — A modern, responsive IoT web dashboard for controlling an ESP32-based automatic curtain system using Bluetooth Low Energy (Web Bluetooth API) and real-time sensor automation.

Developed by **Akshay Patil**.

---

## 🌟 Key Features

1. **Direct Web Bluetooth Control**:
   - Native browser BLE link (`navigator.bluetooth`) to ESP32 without any bridge or backend server.
   - Dedicated BLE service (`src/services/bluetoothService.js`) with configurable UUIDs.
   - Real hardware command validation: `OPEN`, `STOP`, `CLOSE`, `POSITION:0-100`.
   - Incoming telemetry parser: `OPEN`, `CLOSED`, `OPENING`, `CLOSING`, `STOPPED`, `POSITION:<val>`, `LIGHT:<val>`, `TEMP:<val>`, `HUMIDITY:<val>`.

2. **Full Mock / Demo Mode**:
   - Built-in simulation with realistic curtain motor travel physics, smooth position interpolation, and periodic environmental sensor drift.
   - Distinct **DEMO MODE** status indicator so fake data is never confused with real hardware.
   - Easily toggled in top header or Settings.

3. **Smart Dashboard**:
   - **Top Header**: Welcome greeting (*"Welcome, Akshay 👋"*), dynamic `🟢 ESP32 Online` / `🔴 Offline` connection pill, notification center dropdown, profile badge, and theme switcher.
   - **4 Status Cards**: Curtain Status (OPEN, CLOSED, OPENING, CLOSING, STOPPED, DISCONNECTED), Curtain Position (0-100% progress bar), Light Intensity (lux with condition badge), and Room Climate (27°C, 58% RH).
   - **Interactive Live View**: Realistic window simulation with gliding fabric drapes, pleat folds, and dynamic outdoor sky (bright sun, sunset, or starry night based on ambient lux/time).
   - **Tactile Control Panel**: High-contrast `OPEN`, bold red `STOP`, and `CLOSE` buttons, plus an interactive debounced 0–100% Position Slider with markers.
   - **Mode Selector**: Seamless switching between **Manual Mode** and **Automatic Mode**.
   - **Quick Presets**: Instant one-touch presets for **Morning** (100% Open), **Day** (50% Open), and **Night** (0% Closed).
   - **Live Sensor Telemetry**: Light intensity (lux), temperature (°C), and humidity (%).

4. **Multi-Page IoT Suite**:
   - **Control Page**: Micro-stepping nudge controls (±5%, ±10%), limit switch calibration (100% / 0%), motor speed PWM profiles, motor telemetry, and direct BLE command console.
   - **Automation Page**: Sensor-based autonomous curtain control master switch, customizable high/low lux threshold sliders, rule trigger cards, and interactive test simulator.
   - **Sensor Data Page**: Real-time SVG telemetry timeline chart, live dials for light, temperature, humidity, position, and signal RSSI diagnostics.
   - **Settings Page**: Masked/revealed BLE UUID fields, connection controls, appearance theme, animation toggle, and sound synthesizer settings.
   - **About Page**: Project overview, Akshay Patil developer attribution, tech stack, and interactive Hardware Architecture block diagram.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS, Lucide Icons
- **Connectivity**: Web Bluetooth API (`navigator.bluetooth`)
- **Audio Feedback**: Web Audio API synthesizer
- **Microcontroller**: ESP32 Dual Core with BLE Server
- **Motor Control**: L298N / Dual H-Bridge Motor Driver + DC Gear Motor
- **Sensors**: BH1750 / LDR Light Sensor, DHT22 Temperature & Humidity Sensor

---

## 🚀 Getting Started

### 1. Run the Web Application
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in Google Chrome or Microsoft Edge.

### 2. Connect Real ESP32
1. Flash `esp32_firmware/smart_curtain_esp32.ino` to your ESP32 board using Arduino IDE.
2. Turn on Bluetooth on your computer or Android smartphone.
3. Open the web app and click **Connect ESP32**.
4. Select `Smart Curtain ESP32` from the browser Bluetooth pairing dialog.
5. The status pill will switch to **🟢 ESP32 Online**!
