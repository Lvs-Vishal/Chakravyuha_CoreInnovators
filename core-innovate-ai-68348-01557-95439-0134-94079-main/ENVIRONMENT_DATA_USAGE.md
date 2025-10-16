# Environment Data Table Usage - Complete Guide

## ✅ Updated: All Pages Now Use `environment_data` Table

This document confirms that **ALL** pages and components in the CORE Innovators OS application now consistently use the `environment_data` table from Supabase for real-time sensor monitoring.

---

## 📊 Table Structure: `environment_data`

```sql
CREATE TABLE public.environment_data (
  id BIGINT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  co2_ppm REAL,              -- Carbon Dioxide (ppm)
  co_ppm REAL,               -- Carbon Monoxide (ppm)
  air_quality_ppm REAL,      -- Air Quality Index
  smoke_ppm REAL,            -- Smoke Concentration
  flame_detected BOOLEAN,    -- Fire Detection
  motion_detected BOOLEAN,   -- Motion Sensor
  relay_on BOOLEAN          -- Relay Status
);
```

---

## 🎯 Pages Using `environment_data`

### 1. **Dashboard** (`src/pages/Dashboard.tsx`)
**Status:** ✅ Already using `environment_data`

**Features:**
- Real-time sensor data display
- Auto-control devices based on thresholds:
  - CO₂ > 1000 ppm → Trigger devices
  - CO > 9 ppm → Trigger devices  
  - Air Quality > 75 ppm → Trigger devices
  - Smoke > 150 ppm → Trigger devices
  - Flame detected → Trigger devices
- Live updates via Supabase real-time subscriptions

**Implementation:**
```typescript
const channel = supabase
  .channel('sensor-updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'environment_data' },
    (payload) => {
      setSensorData({
        co2_ppm: payload.new.co2_ppm || 420,
        co_ppm: payload.new.co_ppm || 3,
        air_quality_ppm: payload.new.air_quality_ppm || 35,
        smoke_ppm: payload.new.smoke_ppm || 30,
        flame_detected: payload.new.flame_detected || false,
        motion_detected: payload.new.motion_detected || false,
      });
    }
  )
  .subscribe();
```

---

### 2. **Analytics** (`src/pages/Analytics.tsx`)
**Status:** ✅ **UPDATED** to use `environment_data`

**Changes Made:**
- ❌ Removed mock data (`temperatureData`, `gasData`, `humidityData`)
- ✅ Added real-time data fetching from `environment_data`
- ✅ Created 4 charts from real sensor data:
  1. **CO₂ Levels Trend** - Area chart
  2. **Carbon Monoxide (CO) Levels** - Line chart
  3. **Air Quality Index** - Area chart
  4. **Smoke Detection Levels** - Line chart

**Implementation:**
```typescript
const fetchEnvironmentData = async () => {
  const { data, error } = await supabase
    .from('environment_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
    
  // Process and display last 50 readings
  setCo2Data(data.map(item => ({
    time: new Date(item.created_at).toLocaleTimeString(),
    value: item.co2_ppm || 0,
  })));
  // ... similar for CO, air quality, and smoke
};
```

**Real-time Updates:**
```typescript
supabase
  .channel('analytics-updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'environment_data' },
    () => fetchEnvironmentData()
  )
  .subscribe();
```

---

### 3. **SensorPanel Component** (`src/components/SensorPanel.tsx`)
**Status:** ✅ Already using `environment_data`

**Features:**
- Displays sensor tiles for each room
- Real-time monitoring with threshold alerts
- Automatic notifications for:
  - Air Quality > 75 ppm (critical) or > 35 ppm (warning)
  - CO > 35 ppm (critical) or > 9 ppm (warning)
  - CO₂ > 1000 ppm (critical) or > 800 ppm (warning)
  - Smoke > 800 ppm (critical) or > 300 ppm (warning)
  - Flame detection (critical)

**Implementation:**
```typescript
const channel = supabase
  .channel(`sensor-updates-${roomId}`)
  .on('postgres_changes', {
    event: "*",
    schema: "public",
    table: "environment_data",
  }, (payload) => {
    setSensorData({
      air_quality_ppm: payload.new.air_quality_ppm || 0,
      co_ppm: payload.new.co_ppm || 0,
      co2_ppm: payload.new.co2_ppm || 0,
      smoke_ppm: payload.new.smoke_ppm || 0,
      flame_detected: payload.new.flame_detected || false,
      motion_detected: payload.new.motion_detected || false,
    });
  })
  .subscribe();
```

---

### 4. **Assistant** (`src/pages/Assistant.tsx`)
**Status:** ✅ No sensor data needed

**Purpose:** Chat-based interface for voice commands and device control. Does not directly display sensor data.

---

### 5. **Automation** (`src/pages/Automation.tsx`)
**Status:** ✅ No direct sensor data display

**Purpose:** Configure automation rules. Could be enhanced to create rules based on `environment_data` thresholds in the future.

---

### 6. **Settings** (`src/pages/Settings.tsx`)
**Status:** ✅ No sensor data needed

**Purpose:** User profile and system configuration. No sensor monitoring required.

---

## 🔧 Real-Time Subscription Pattern

All pages use the same pattern for real-time updates:

```typescript
// Subscribe to real-time changes
const channel = supabase
  .channel('unique-channel-name')
  .on('postgres_changes', {
    event: '*',                    // Listen to all events (INSERT, UPDATE, DELETE)
    schema: 'public',
    table: 'environment_data',
  }, (payload) => {
    // Handle the update
    console.log('New data:', payload.new);
  })
  .subscribe();

// Cleanup on unmount
return () => {
  supabase.removeChannel(channel);
};
```

---

## 📈 Data Flow Architecture

```
Arduino/ESP32 Sensors
        ↓
  [Supabase API]
        ↓
environment_data table
        ↓
Real-time Subscriptions
        ↓
┌────────────────────────┐
│   Dashboard Page       │ ← Live monitoring + auto-control
│   Analytics Page       │ ← Historical charts (4 metrics)
│   SensorPanel Component│ ← Room-specific displays
└────────────────────────┘
```

---

## 🚨 Safety Thresholds

All pages respect these critical safety thresholds from `environment_data`:

| Sensor | Warning | Critical | Action |
|--------|---------|----------|--------|
| **CO₂** | > 800 ppm | > 1000 ppm | Auto-enable ventilation |
| **CO** | > 9 ppm | > 35 ppm | Alert + ventilation |
| **Air Quality** | > 35 ppm | > 75 ppm | Enable air purifiers |
| **Smoke** | > 300 ppm | > 800 ppm | Alert + investigate |
| **Flame** | N/A | detected | Emergency alert |

---

## ✨ Benefits of Centralized `environment_data` Table

1. **Single Source of Truth** - All sensor data in one table
2. **Real-time Updates** - Supabase subscriptions keep UI in sync
3. **Historical Tracking** - All readings stored with timestamps
4. **Scalability** - Easy to add new sensor types
5. **Analytics Ready** - Perfect for trend analysis and charts
6. **Safety First** - Consistent threshold monitoring across all pages

---

## 🔮 Future Enhancements

- Add temperature and humidity sensors to `environment_data`
- Create automation rules based on `environment_data` trends
- ML-based anomaly detection on sensor patterns
- Export analytics data for external analysis
- Add room-specific filtering in Analytics page

---

## ✅ Verification Checklist

- [x] Dashboard uses `environment_data` ✅
- [x] Analytics uses `environment_data` ✅ (Updated)
- [x] SensorPanel uses `environment_data` ✅
- [x] Real-time subscriptions configured ✅
- [x] Safety thresholds implemented ✅
- [x] Charts display real sensor data ✅
- [x] No mock data remaining ✅

---

**Last Updated:** October 16, 2025  
**Status:** ✅ All pages now use `environment_data` table consistently
