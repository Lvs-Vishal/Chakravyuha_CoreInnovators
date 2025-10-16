# 🚀 IoT Sensor Data Pipeline Guide

Complete guide to connect your IoT sensors to the CORE Innovators OS dashboard.

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Setup Requirements](#setup-requirements)
3. [Pipeline Options](#pipeline-options)
4. [Implementation Examples](#implementation-examples)
5. [Testing & Validation](#testing--validation)
6. [Troubleshooting](#troubleshooting)

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│  IoT Sensors    │ (ESP32, Arduino, Raspberry Pi, etc.)
│  - CO2 Sensor   │
│  - CO Sensor    │
│  - Air Quality  │
│  - Smoke        │
│  - Flame        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Data Pipeline  │ (HTTP API, MQTT, WebSocket, etc.)
│  - Format data  │
│  - Validate     │
│  - Send to DB   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase DB    │
│ environment_data│ Table
└────────┬────────┘
         │
         ▼ (Real-time subscription)
┌─────────────────┐
│  React Dashboard│
│  - Auto-update  │
│  - Display data │
│  - Device control│
└─────────────────┘
```

---

## 🔧 Setup Requirements

### 1. Supabase Configuration

Get your Supabase credentials:
- **URL**: `https://your-project.supabase.co`
- **API Key (anon public)**: Found in Settings > API

### 2. Database Table Schema

Already created! The `environment_data` table has:

```sql
- id (auto-generated)
- created_at (timestamp)
- co2_ppm (float)
- co_ppm (float)
- air_quality_ppm (float)
- smoke_ppm (float)
- flame_detected (boolean)
- motion_detected (boolean)
- relay_on (boolean)
```

### 3. Network Access

Ensure your IoT devices can:
- ✅ Connect to internet
- ✅ Make HTTPS requests to Supabase
- ✅ Have your Supabase API key

---

## 🛠️ Pipeline Options

### Option 1: Direct HTTP POST (Recommended) ⭐
**Best for:** ESP32, Arduino with WiFi, Raspberry Pi

**Pros:**
- Simple implementation
- Direct to database
- No intermediate server needed
- Real-time updates

**Cons:**
- Requires internet connection
- Each device needs API key

### Option 2: MQTT Bridge
**Best for:** Multiple devices, IoT mesh networks

**Pros:**
- Lightweight protocol
- Batch processing
- Offline buffering
- Central control

**Cons:**
- Requires MQTT broker setup
- Additional infrastructure

### Option 3: REST API Server
**Best for:** Complex processing, multiple sources

**Pros:**
- Data validation/transformation
- Rate limiting
- Authentication control
- Logging

**Cons:**
- Extra server maintenance
- More complex setup

### Option 4: WebSocket Stream
**Best for:** High-frequency updates

**Pros:**
- Persistent connection
- Low latency
- Bidirectional

**Cons:**
- More complex code
- Connection management

---

## 💻 Implementation Examples

### 🔥 Option 1: ESP32/Arduino (HTTP POST)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Supabase configuration
const char* supabaseUrl = "https://YOUR_PROJECT.supabase.co";
const char* supabaseKey = "YOUR_ANON_KEY";

// Sensor pins (adjust based on your setup)
const int CO2_PIN = 34;
const int CO_PIN = 35;
const int AIR_QUALITY_PIN = 32;
const int SMOKE_PIN = 33;
const int FLAME_PIN = 25;

void setup() {
  Serial.begin(115200);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
  
  // Initialize sensor pins
  pinMode(FLAME_PIN, INPUT);
}

void loop() {
  // Read sensor values
  float co2 = readCO2Sensor();
  float co = readCOSensor();
  float airQuality = readAirQualitySensor();
  float smoke = readSmokeSensor();
  bool flame = digitalRead(FLAME_PIN);
  
  // Send to Supabase
  sendToSupabase(co2, co, airQuality, smoke, flame);
  
  // Wait 5 seconds before next reading
  delay(5000);
}

void sendToSupabase(float co2, float co, float airQuality, float smoke, bool flame) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    
    // Prepare URL
    String url = String(supabaseUrl) + "/rest/v1/environment_data";
    http.begin(url);
    
    // Set headers
    http.addHeader("Content-Type", "application/json");
    http.addHeader("apikey", supabaseKey);
    http.addHeader("Authorization", "Bearer " + String(supabaseKey));
    http.addHeader("Prefer", "return=minimal");
    
    // Create JSON payload
    StaticJsonDocument<256> doc;
    doc["co2_ppm"] = co2;
    doc["co_ppm"] = co;
    doc["air_quality_ppm"] = airQuality;
    doc["smoke_ppm"] = smoke;
    doc["flame_detected"] = flame;
    doc["motion_detected"] = false;
    doc["relay_on"] = false;
    
    String jsonString;
    serializeJson(doc, jsonString);
    
    // Send POST request
    int httpResponseCode = http.POST(jsonString);
    
    if (httpResponseCode == 201) {
      Serial.println("✅ Data sent successfully!");
    } else {
      Serial.print("❌ Error: ");
      Serial.println(httpResponseCode);
    }
    
    http.end();
  }
}

// Sensor reading functions (adjust based on your sensors)
float readCO2Sensor() {
  int raw = analogRead(CO2_PIN);
  // Convert raw reading to PPM (adjust formula for your sensor)
  return map(raw, 0, 4095, 400, 5000);
}

float readCOSensor() {
  int raw = analogRead(CO_PIN);
  return map(raw, 0, 4095, 0, 100);
}

float readAirQualitySensor() {
  int raw = analogRead(AIR_QUALITY_PIN);
  return map(raw, 0, 4095, 0, 500);
}

float readSmokeSensor() {
  int raw = analogRead(SMOKE_PIN);
  return map(raw, 0, 4095, 0, 1000);
}
```

---

### 🐍 Option 2: Python (Raspberry Pi / Desktop)

```python
import requests
import time
import json
from datetime import datetime

# Supabase configuration
SUPABASE_URL = "https://YOUR_PROJECT.supabase.co"
SUPABASE_KEY = "YOUR_ANON_KEY"

class SensorPipeline:
    def __init__(self):
        self.headers = {
            "Content-Type": "application/json",
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Prefer": "return=minimal"
        }
        self.endpoint = f"{SUPABASE_URL}/rest/v1/environment_data"
    
    def read_sensors(self):
        """Read data from sensors (implement based on your hardware)"""
        # Example: Replace with actual sensor reading code
        return {
            "co2_ppm": self.read_co2(),
            "co_ppm": self.read_co(),
            "air_quality_ppm": self.read_air_quality(),
            "smoke_ppm": self.read_smoke(),
            "flame_detected": self.read_flame(),
            "motion_detected": False,
            "relay_on": False
        }
    
    def read_co2(self):
        # TODO: Implement actual CO2 sensor reading
        # Example placeholder
        return 420.0
    
    def read_co(self):
        # TODO: Implement actual CO sensor reading
        return 3.0
    
    def read_air_quality(self):
        # TODO: Implement actual air quality sensor reading
        return 35.0
    
    def read_smoke(self):
        # TODO: Implement actual smoke sensor reading
        return 30.0
    
    def read_flame(self):
        # TODO: Implement actual flame sensor reading
        return False
    
    def send_data(self, data):
        """Send sensor data to Supabase"""
        try:
            response = requests.post(
                self.endpoint,
                headers=self.headers,
                json=data,
                timeout=10
            )
            
            if response.status_code == 201:
                print(f"✅ Data sent successfully at {datetime.now()}")
                return True
            else:
                print(f"❌ Error {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Exception: {e}")
            return False
    
    def run(self, interval=5):
        """Main loop - read and send data every 'interval' seconds"""
        print("🚀 Sensor pipeline started!")
        
        while True:
            try:
                # Read sensor data
                sensor_data = self.read_sensors()
                print(f"📊 Readings: CO2={sensor_data['co2_ppm']} ppm, "
                      f"CO={sensor_data['co_ppm']} ppm, "
                      f"AQ={sensor_data['air_quality_ppm']} ppm")
                
                # Send to Supabase
                self.send_data(sensor_data)
                
                # Wait before next reading
                time.sleep(interval)
                
            except KeyboardInterrupt:
                print("\n🛑 Pipeline stopped by user")
                break
            except Exception as e:
                print(f"❌ Error in main loop: {e}")
                time.sleep(interval)

if __name__ == "__main__":
    pipeline = SensorPipeline()
    pipeline.run(interval=5)  # Send data every 5 seconds
```

---

### 🟢 Option 3: Node.js / JavaScript

```javascript
// sensor-pipeline.js
const axios = require('axios');

// Supabase configuration
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_KEY = 'YOUR_ANON_KEY';

class SensorPipeline {
  constructor() {
    this.client = axios.create({
      baseURL: `${SUPABASE_URL}/rest/v1`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal'
      }
    });
  }

  // Read sensor data (implement based on your hardware)
  async readSensors() {
    return {
      co2_ppm: await this.readCO2(),
      co_ppm: await this.readCO(),
      air_quality_ppm: await this.readAirQuality(),
      smoke_ppm: await this.readSmoke(),
      flame_detected: await this.readFlame(),
      motion_detected: false,
      relay_on: false
    };
  }

  async readCO2() {
    // TODO: Implement actual sensor reading
    return 420.0;
  }

  async readCO() {
    return 3.0;
  }

  async readAirQuality() {
    return 35.0;
  }

  async readSmoke() {
    return 30.0;
  }

  async readFlame() {
    return false;
  }

  // Send data to Supabase
  async sendData(data) {
    try {
      const response = await this.client.post('/environment_data', data);
      console.log(`✅ Data sent successfully at ${new Date().toISOString()}`);
      return true;
    } catch (error) {
      console.error(`❌ Error sending data:`, error.message);
      return false;
    }
  }

  // Main loop
  async run(interval = 5000) {
    console.log('🚀 Sensor pipeline started!');

    setInterval(async () => {
      try {
        // Read sensor data
        const sensorData = await this.readSensors();
        console.log(`📊 Readings:`, sensorData);

        // Send to Supabase
        await this.sendData(sensorData);
      } catch (error) {
        console.error('❌ Error in main loop:', error);
      }
    }, interval);
  }
}

// Run the pipeline
const pipeline = new SensorPipeline();
pipeline.run(5000); // Send data every 5 seconds
```

**Install dependencies:**
```bash
npm install axios
node sensor-pipeline.js
```

---

### 🔧 Option 4: cURL / Shell Script (Testing)

```bash
#!/bin/bash

# Supabase configuration
SUPABASE_URL="https://YOUR_PROJECT.supabase.co"
SUPABASE_KEY="YOUR_ANON_KEY"

# Function to send sensor data
send_data() {
  local co2=$1
  local co=$2
  local air_quality=$3
  local smoke=$4
  local flame=$5

  curl -X POST "${SUPABASE_URL}/rest/v1/environment_data" \
    -H "Content-Type: application/json" \
    -H "apikey: ${SUPABASE_KEY}" \
    -H "Authorization: Bearer ${SUPABASE_KEY}" \
    -H "Prefer: return=minimal" \
    -d "{
      \"co2_ppm\": ${co2},
      \"co_ppm\": ${co},
      \"air_quality_ppm\": ${air_quality},
      \"smoke_ppm\": ${smoke},
      \"flame_detected\": ${flame},
      \"motion_detected\": false,
      \"relay_on\": false
    }"

  echo "✅ Data sent at $(date)"
}

# Main loop
while true; do
  # Read sensor values (replace with actual sensor reading)
  CO2=$(echo "scale=1; 400 + $RANDOM % 600" | bc)
  CO=$(echo "scale=1; 1 + $RANDOM % 10" | bc)
  AIR_QUALITY=$(echo "scale=1; 20 + $RANDOM % 50" | bc)
  SMOKE=$(echo "scale=1; 10 + $RANDOM % 100" | bc)
  FLAME="false"

  # Send data
  send_data $CO2 $CO $AIR_QUALITY $SMOKE $FLAME

  # Wait 5 seconds
  sleep 5
done
```

**Run:**
```bash
chmod +x sensor-pipeline.sh
./sensor-pipeline.sh
```

---

## 🧪 Testing & Validation

### 1. Test Manual Insert (curl)

```bash
curl -X POST "https://YOUR_PROJECT.supabase.co/rest/v1/environment_data" \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Prefer: return=minimal" \
  -d '{
    "co2_ppm": 500,
    "co_ppm": 5,
    "air_quality_ppm": 40,
    "smoke_ppm": 50,
    "flame_detected": false,
    "motion_detected": false,
    "relay_on": false
  }'
```

**Expected response:** `HTTP 201 Created`

### 2. Verify Data in Dashboard

1. Open your dashboard: `http://localhost:8080`
2. Watch the sensor cards update in real-time
3. Check if "No Data" changes to actual values

### 3. Check Supabase Table

Go to Supabase Dashboard → Table Editor → `environment_data` → See new rows

### 4. Test Real-time Updates

1. Keep dashboard open
2. Send data via curl/script
3. Watch dashboard update instantly (no refresh needed!)

---

## 🔍 Troubleshooting

### Issue 1: 401 Unauthorized
**Cause:** Invalid API key  
**Solution:** 
- Check your API key in Supabase Settings > API
- Ensure you're using the "anon public" key, not service role key
- Verify headers are correctly set

### Issue 2: 400 Bad Request
**Cause:** Invalid JSON or data types  
**Solution:**
- Validate JSON syntax
- Check data types (numbers not strings)
- Ensure required fields are present

### Issue 3: Dashboard Not Updating
**Cause:** Real-time subscription not working  
**Solution:**
- Check browser console for errors
- Verify Supabase real-time is enabled
- Try refreshing the page

### Issue 4: Sensor Values Show "No Data"
**Cause:** No data in database or connection issue  
**Solution:**
- Verify data is being inserted (check Supabase table)
- Check real-time subscription in Dashboard.tsx
- Look for console errors

### Issue 5: ESP32 Connection Failed
**Cause:** WiFi or HTTPS issues  
**Solution:**
- Verify WiFi credentials
- Check if ESP32 can reach internet (`ping 8.8.8.8`)
- Ensure SSL certificates are up to date
- Try HTTP client libraries with SSL support

---

## 📊 Data Flow Verification

```
1. Sensor reads value ──────────────────────> ✅ Check: Serial monitor shows reading
                                              
2. Format as JSON ─────────────────────────> ✅ Check: Valid JSON structure
                                              
3. Send HTTP POST to Supabase ────────────> ✅ Check: HTTP 201 response
                                              
4. Data inserted into environment_data ────> ✅ Check: Row appears in Supabase table
                                              
5. Real-time subscription triggers ───────> ✅ Check: Browser console shows update
                                              
6. Dashboard updates sensor cards ────────> ✅ Check: "No Data" → actual values
                                              
7. Auto-control devices (if thresholds) ──> ✅ Check: Devices turn on/off automatically
```

---

## 🎯 Next Steps

1. **Choose your pipeline option** based on your hardware
2. **Update credentials** in the example code
3. **Test with manual insert** using curl
4. **Deploy to your IoT device**
5. **Monitor dashboard** for real-time updates
6. **Set up alerts** for critical values
7. **Add error handling** and retry logic
8. **Implement data backup** for offline scenarios

---

## 📚 Additional Resources

- [Supabase REST API Docs](https://supabase.com/docs/guides/api)
- [ESP32 WiFi Examples](https://github.com/espressif/arduino-esp32/tree/master/libraries/WiFi/examples)
- [Raspberry Pi GPIO Guide](https://www.raspberrypi.com/documentation/computers/raspberry-pi.html)
- [Arduino JSON Library](https://arduinojson.org/)

---

**Created:** October 16, 2025  
**Status:** Ready for implementation 🚀
