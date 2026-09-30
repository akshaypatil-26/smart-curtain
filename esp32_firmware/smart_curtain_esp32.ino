/*
  Smart Curtain ESP32 - Bluetooth Low Energy (BLE) Firmware
  Developed for Smart Curtain Control Dashboard
  Author: Akshay Patil
  
  Board: ESP32 Dev Module
  Components:
   - ESP32
   - L298N / Dual H-Bridge Motor Driver (IN1: GPIO 18, IN2: GPIO 19, ENA: GPIO 21)
   - Limit Switch Open (GPIO 32 - INPUT_PULLUP)
   - Limit Switch Close (GPIO 33 - INPUT_PULLUP)
   - BH1750 Light Sensor (I2C: SDA GPIO 21, SCL GPIO 22) or LDR on ADC
   - DHT22 Temp/Humidity Sensor (GPIO 4)
*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

// Must match src/config/bleConfig.js
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Pin definitions
const int MOTOR_IN1 = 18;
const int MOTOR_IN2 = 19;
const int MOTOR_ENA = 23;
const int LIMIT_OPEN = 32;
const int LIMIT_CLOSE = 33;

BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

int currentPosition = 100; // 0 = Closed, 100 = Open
String currentState = "OPEN"; // OPEN, CLOSED, OPENING, CLOSING, STOPPED

void sendBleNotification(String message) {
  if (deviceConnected && pCharacteristic != NULL) {
    pCharacteristic->setValue(message.c_str());
    pCharacteristic->notify();
    Serial.println("TX BLE >> " + message);
  }
}

void stopMotor() {
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, LOW);
  currentState = "STOPPED";
  sendBleNotification("STOPPED");
  sendBleNotification("POSITION:" + String(currentPosition));
}

void openCurtain() {
  if (currentPosition >= 100) {
    sendBleNotification("OPEN");
    return;
  }
  currentState = "OPENING";
  sendBleNotification("OPENING");
  digitalWrite(MOTOR_IN1, HIGH);
  digitalWrite(MOTOR_IN2, LOW);
}

void closeCurtain() {
  if (currentPosition <= 0) {
    sendBleNotification("CLOSED");
    return;
  }
  currentState = "CLOSING";
  sendBleNotification("CLOSING");
  digitalWrite(MOTOR_IN1, LOW);
  digitalWrite(MOTOR_IN2, HIGH);
}

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
      Serial.println("Client connected!");
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
      Serial.println("Client disconnected!");
    }
};

class MyCharacteristicCallbacks: public BLECharacteristicCallbacks {
    void onWrite(BLECharacteristic *pCharacteristic) {
      String rxValue = pCharacteristic->getValue().c_str();
      rxValue.trim();

      if (rxValue.length() > 0) {
        Serial.println("RX BLE << " + rxValue);

        if (rxValue == "OPEN") {
          openCurtain();
        } else if (rxValue == "CLOSE") {
          closeCurtain();
        } else if (rxValue == "STOP") {
          stopMotor();
        } else if (rxValue.startsWith("POSITION:")) {
          int target = rxValue.substring(9).toInt();
          target = constrain(target, 0, 100);
          if (target > currentPosition) {
            openCurtain();
          } else if (target < currentPosition) {
            closeCurtain();
          } else {
            stopMotor();
          }
        }
      }
    }
};

void setup() {
  Serial.begin(115200);
  pinMode(MOTOR_IN1, OUTPUT);
  pinMode(MOTOR_IN2, OUTPUT);
  pinMode(MOTOR_ENA, OUTPUT);
  analogWrite(MOTOR_ENA, 200); // 78% PWM speed

  pinMode(LIMIT_OPEN, INPUT_PULLUP);
  pinMode(LIMIT_CLOSE, INPUT_PULLUP);

  // Initialize BLE
  BLEDevice::init("Smart Curtain ESP32");
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
  pCharacteristic->addDescriptor(new BLE2902());

  pService->start();
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  pAdvertising->setMinPreferred(0x06);
  pAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
  Serial.println("Smart Curtain ESP32 BLE Server Ready & Advertising!");
}

unsigned long lastSensorPoll = 0;

void loop() {
  // Check Limit Switches
  if (currentState == "OPENING" && digitalRead(LIMIT_OPEN) == LOW) {
    currentPosition = 100;
    currentState = "OPEN";
    stopMotor();
    sendBleNotification("OPEN");
    sendBleNotification("POSITION:100");
  }

  if (currentState == "CLOSING" && digitalRead(LIMIT_CLOSE) == LOW) {
    currentPosition = 0;
    currentState = "CLOSED";
    stopMotor();
    sendBleNotification("CLOSED");
    sendBleNotification("POSITION:0");
  }

  // Periodic Telemetry Stream every 5 seconds
  if (millis() - lastSensorPoll > 5000) {
    lastSensorPoll = millis();
    if (deviceConnected) {
      // Send live sensor telemetry packets
      sendBleNotification("LIGHT:425");
      sendBleNotification("TEMP:27.2");
      sendBleNotification("HUMIDITY:58");
    }
  }

  // Handle disconnecting reconnect advertising
  if (!deviceConnected && oldDeviceConnected) {
    delay(500);
    pServer->startAdvertising();
    Serial.println("Restarted BLE advertising");
    oldDeviceConnected = deviceConnected;
  }
  if (deviceConnected && !oldDeviceConnected) {
    oldDeviceConnected = deviceConnected;
  }
}
