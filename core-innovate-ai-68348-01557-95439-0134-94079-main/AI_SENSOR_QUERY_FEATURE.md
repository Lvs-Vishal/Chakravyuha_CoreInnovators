# 🎤 AI Assistant Sensor Query Feature

## ✅ Changes Made

### 1. **Removed Knowledge Page**
   - ❌ Deleted `/knowledge` route from App.tsx
   - ❌ Removed "Knowledge" menu item from Sidebar
   - ❌ Removed BookOpen icon import
   - ✅ Cleaned up all references

### 2. **Added Real-time Sensor Querying via AI Assistant**
   
**New Capability:** Ask CORE AI about current sensor values!

---

## 🎯 How to Use

### Voice Commands:

#### **CO2 Queries:**
```
"Hey Core, what is the CO2 level?"
"Hey Core, check CO2"
"Hey Core, tell me the carbon dioxide level"
"Hey Core, show me current CO2"
```

**Response Example:**
> "Current CO2 level is 650 PPM, which is good."

---

#### **CO (Carbon Monoxide) Queries:**
```
"Hey Core, what is the CO level?"
"Hey Core, check carbon monoxide"
"Hey Core, tell me the CO reading"
```

**Response Example:**
> "Current carbon monoxide level is 3 PPM, which is safe."

---

#### **Air Quality Queries:**
```
"Hey Core, what is the air quality?"
"Hey Core, check air quality"
"Hey Core, tell me the air pollution level"
```

**Response Example:**
> "Current air quality is 35 PPM, which is good."

---

#### **Smoke Queries:**
```
"Hey Core, what is the smoke level?"
"Hey Core, check smoke"
"Hey Core, is there smoke?"
```

**Response Example:**
> "Current smoke level is 30 PPM, which is normal."

---

#### **Flame/Fire Queries:**
```
"Hey Core, is there a flame?"
"Hey Core, check for fire"
"Hey Core, flame status"
```

**Response Example:**
> "No flame detected. Fire sensor is normal."

**Emergency Response:**
> "ALERT! Flame has been detected! Please evacuate immediately and call emergency services."

---

#### **All Sensors Query:**
```
"Hey Core, what are all the sensor readings?"
"Hey Core, check all sensors"
"Hey Core, sensor status"
```

**Response Example:**
> "Current sensor readings: CO2: 650 PPM, CO: 3 PPM, Air Quality: 35 PPM, Smoke: 30 PPM, Flame: Not detected"

---

## 🔧 Technical Implementation

### Sensor Data Integration:

```typescript
interface SensorData {
  co2_ppm: number | null;
  co_ppm: number | null;
  air_quality_ppm: number | null;
  smoke_ppm: number | null;
  flame_detected: boolean | null;
  motion_detected: boolean | null;
}
```

### Features:

1. **Initial Data Fetch**
   - Fetches latest sensor reading from `environment_data` table on mount

2. **Real-time Updates**
   - Subscribes to Supabase real-time channel
   - Automatically updates sensor values as new data arrives
   - Always provides latest readings

3. **Intelligent Status Interpretation**
   - CO2: "excellent" (<800), "good" (<1000), "elevated" (<1500), "unhealthy" (≥1500)
   - CO: "safe" (<9), "elevated" (<35), "DANGEROUS" (≥35)
   - Air Quality: "good" (<35), "moderate" (<75), "unhealthy" (≥75)
   - Smoke: "normal" (<300), "elevated" (<800), "high" (≥800)
   - Flame: "Not detected" / "DETECTED - EVACUATE"

4. **Smart Query Detection**
   - Recognizes: "what is", "what's", "check", "tell me", "show me", "current"
   - Works with various phrasings
   - Case-insensitive matching

5. **Visual & Audio Feedback**
   - Voice response with appropriate emotion
   - Toast notification with sensor icon
   - Duration: 5 seconds (8 seconds for all sensors)

---

## 📊 Sensor Status Thresholds

### CO2 (Carbon Dioxide):
- **< 800 ppm**: Excellent ✅
- **800-1000 ppm**: Good 👍
- **1000-1500 ppm**: Elevated ⚠️
- **> 1500 ppm**: Unhealthy ❌

### CO (Carbon Monoxide):
- **< 9 ppm**: Safe ✅
- **9-35 ppm**: Elevated - Ventilate ⚠️
- **> 35 ppm**: DANGEROUS - Evacuate ❌

### Air Quality:
- **< 35 ppm**: Good ✅
- **35-75 ppm**: Moderate ⚠️
- **> 75 ppm**: Unhealthy ❌

### Smoke:
- **< 300 ppm**: Normal ✅
- **300-800 ppm**: Elevated ⚠️
- **> 800 ppm**: High - Check for fire ❌

### Flame:
- **Not detected**: Normal ✅
- **Detected**: EMERGENCY - Evacuate! 🚨

---

## 🎨 Visual Indicators

Each sensor type has a unique icon:
- 🌬️ **CO2** (Carbon Dioxide)
- ☁️ **CO** (Carbon Monoxide)
- 🍃 **Air Quality**
- 💨 **Smoke**
- 🔥 **Flame/Fire**
- 📊 **All Sensors**

---

## 💡 Example Interactions

### Scenario 1: Morning Check
```
User: "Hey Core, check all sensors"
CORE: "Current sensor readings: CO2: 420 PPM, CO: 2 PPM, 
       Air Quality: 28 PPM, Smoke: 25 PPM, Flame: Not detected"
```

### Scenario 2: Poor Ventilation
```
User: "Hey Core, what is the CO2 level?"
CORE: "Current CO2 level is 1350 PPM, which is elevated."
```

### Scenario 3: Cooking Detection
```
User: "Hey Core, check smoke"
CORE: "Current smoke level is 450 PPM, which is elevated"
```

### Scenario 4: Emergency
```
User: "Hey Core, is there a flame?"
CORE: "ALERT! Flame has been detected! Please evacuate 
       immediately and call emergency services."
```

---

## 🔄 Real-time Updates

The AI assistant always has access to the **latest sensor readings** because:

1. **On Component Mount:** Fetches most recent data from database
2. **Real-time Subscription:** Listens for new inserts in `environment_data` table
3. **Automatic Updates:** State updates immediately when new data arrives
4. **No Stale Data:** Always uses current values from state

---

## 🚀 Benefits

### For Users:
- ✅ **Hands-free monitoring** - Ask instead of checking dashboard
- ✅ **Natural language** - Ask in your own words
- ✅ **Instant feedback** - Voice + visual response
- ✅ **Context-aware** - Smart status interpretation
- ✅ **Emergency alerts** - Critical warnings for dangerous levels

### For System:
- ✅ **Real-time data** - Always current readings
- ✅ **No API calls** - Data already fetched for dashboard
- ✅ **Efficient** - Single subscription for all queries
- ✅ **Scalable** - Easy to add more sensor types

---

## 📝 Files Modified

### 1. **`src/components/VoiceAssistant.tsx`**
   - Added `SensorData` interface
   - Added `sensorData` state
   - Added `useEffect` for fetching and subscribing to sensor data
   - Added sensor query handling in `handleVoiceCommand()`
   - Recognizes 6 types of sensor queries
   - Provides intelligent status interpretation

### 2. **`src/App.tsx`**
   - Removed `Knowledge` import
   - Removed `/knowledge` route

### 3. **`src/components/Sidebar.tsx`**
   - Removed `BookOpen` icon import
   - Removed "Knowledge" menu item

---

## 🧪 Testing

### Test Sensor Queries:

1. **Make sure sensor data is flowing:**
   ```bash
   node test-sensor-data.js
   # Should be sending data every 5 seconds
   ```

2. **Test AI Assistant:**
   ```
   Say: "Hey Core"
   Wait for: "Yes, Durai? I'm listening."
   
   Then say any of:
   - "What is the CO2 level?"
   - "Check CO"
   - "Tell me air quality"
   - "Is there smoke?"
   - "Check all sensors"
   ```

3. **Verify Response:**
   - ✅ Voice speaks the answer
   - ✅ Toast notification appears with icon
   - ✅ Values match dashboard readings
   - ✅ Status interpretation is correct

---

## 🎯 Query Patterns Recognized

The AI understands these patterns:
- "what is [sensor]"
- "what's [sensor]"
- "check [sensor]"
- "tell me [sensor]"
- "show me [sensor]"
- "current [sensor]"
- "[sensor] level"
- "[sensor] reading"
- "[sensor] status"

---

## 🌟 Future Enhancements

### Planned Features:
- [ ] **Historical queries** - "What was CO2 level 1 hour ago?"
- [ ] **Trends** - "Is CO2 increasing or decreasing?"
- [ ] **Predictions** - "Will air quality get worse?"
- [ ] **Comparisons** - "Compare today vs yesterday"
- [ ] **Room-specific** - "What's CO2 in bedroom?"
- [ ] **Alerts** - "Alert me when CO2 exceeds 1000"
- [ ] **Recommendations** - "Should I open windows?"

---

## ✅ Status

- ✅ Knowledge page removed
- ✅ Sensor querying added to AI Assistant
- ✅ Real-time data integration complete
- ✅ All 6 sensor types supported
- ✅ Intelligent status interpretation
- ✅ Voice + visual feedback
- ✅ Emergency alert handling
- ✅ No TypeScript errors

---

**Updated:** October 16, 2025  
**Feature:** Real-time Sensor Querying via AI Assistant  
**Status:** ✅ Complete and Working
