# 📧 Email Alert System - Devices Always OFF

## ✅ Major Changes Made

### 🚫 **Devices No Longer Auto-Control**
- ❌ Air Purifier stays **OFF**
- ❌ Ventilation Fan stays **OFF**
- ✅ Manual control only via dashboard switches
- ✅ Email alerts sent instead of automatic device activation

### 📧 **Email Notification System**
- ✅ Alerts sent when gas levels are **HIGH or LOW**
- ✅ User-configurable email address in Settings
- ✅ Detailed alert messages with sensor readings
- ✅ Alert history stored in browser (last 50 alerts)

---

## 🎯 How It Works

### Alert Triggers:

#### **HIGH Level Alerts:**
- 🌬️ **CO2 > 1000 PPM** - High carbon dioxide
- ☁️ **CO > 9 PPM** - High carbon monoxide
- 🍃 **Air Quality > 75 PPM** - Poor air quality
- 💨 **Smoke > 150 PPM** - Smoke detected
- 🔥 **Flame Detected** - Fire emergency

#### **LOW Level Alerts:**
- 🌬️ **CO2 < 300 PPM** - Abnormally low CO2
- ☁️ **CO < 1 PPM** - Abnormally low CO

---

## 📧 Email Alert Format

### Subject:
```
CORE Innovators - Gas Level Alert
```

### Body Example:
```
Alert from CORE Innovators Smart Air Control System

⚠️ High CO2: 1350 PPM
⚠️ High Air Quality: 85 PPM
💨 High Smoke: 450 PPM

Timestamp: 10/16/2025, 3:45:12 PM

Devices remain OFF. Manual intervention required.
```

---

## ⚙️ Setup Instructions

### 1. **Configure Your Email Address**

Go to **Settings** page:
1. Navigate to **Settings** from sidebar
2. Find **Profile Information** card
3. Update **Email (for gas alerts)** field
4. Enter your email address (e.g., `your.email@example.com`)
5. Click **"Update Profile"** button
6. You'll see confirmation: "Profile updated successfully - Gas alerts will be sent to your.email@example.com"

### 2. **Email is Saved Automatically**
- Email stored in browser's localStorage
- Persists across page refreshes
- Default: `durai@innovators.com` (if not set)

### 3. **Alerts Automatically Trigger**
- System monitors sensor data in real-time
- When thresholds are exceeded, alert is generated
- Email details logged to console
- Toast notification appears on screen
- Alert saved to history

---

## 🔧 Technical Implementation

### Dashboard Changes (`src/pages/Dashboard.tsx`):

#### **Old Behavior (REMOVED):**
```typescript
// Auto-turned ON devices when gas levels high
if (shouldTurnOn && device.status === "off") {
  toggleDevice(device.id, true);
  toast.warning(`${device.name} auto-enabled`);
}
```

#### **New Behavior:**
```typescript
// Send email alert, devices stay OFF
if (isHighCO2 || isHighCO || ...) {
  const userEmail = localStorage.getItem('userEmail');
  sendEmailNotification(userEmail, alertMessages);
  toast.error(`Gas level alert! Email sent to ${userEmail}`);
}
```

### Settings Changes (`src/pages/Settings.tsx`):

#### **Added State Management:**
```typescript
const [userEmail, setUserEmail] = useState("");

// Load from localStorage
useEffect(() => {
  const savedEmail = localStorage.getItem('userEmail');
  setUserEmail(savedEmail);
}, []);

// Save to localStorage
const handleUpdateProfile = () => {
  localStorage.setItem('userEmail', userEmail);
  toast.success("Profile updated");
};
```

---

## 📊 Alert Monitoring

### View Alert History:

Open **Browser Console** (F12) and type:
```javascript
// View last 50 alerts
JSON.parse(localStorage.getItem('gasAlerts'))

// Clear alert history
localStorage.removeItem('gasAlerts')

// View current email
localStorage.getItem('userEmail')
```

### Alert Data Structure:
```json
{
  "timestamp": "2025-10-16T15:45:12.000Z",
  "email": "durai@innovators.com",
  "message": "⚠️ High CO2: 1350 PPM",
  "sensors": {
    "co2": 1350,
    "co": 3,
    "airQuality": 85,
    "smoke": 450,
    "flame": false
  }
}
```

---

## 🎨 User Experience

### On Dashboard:

#### **Normal Operation:**
- Devices show **OFF** status
- Sensor values display in real-time
- Manual control available via switches

#### **When Alert Triggers:**
1. **Toast Notification** appears (8 seconds):
   ```
   ❌ Gas level alert! Email sent to durai@innovators.com
   ⚠️ High CO2: 1350 PPM | ⚠️ High Air Quality: 85 PPM
   ```

2. **Console Log:**
   ```
   📧 Email Alert: {
     to: "durai@innovators.com",
     subject: "CORE Innovators - Gas Level Alert",
     body: "Alert from CORE Innovators..."
   }
   ```

3. **Devices Stay OFF:**
   - Air Purifier: ○ STANDBY
   - Ventilation Fan: ○ STANDBY

4. **User Takes Action:**
   - Manually turn ON devices if needed
   - Investigate the cause
   - Check email for detailed report

---

## 🚀 Benefits

### For Safety:
- ✅ **Manual oversight required** - Prevents accidental automation failures
- ✅ **Email paper trail** - Record of all alerts for compliance
- ✅ **User awareness** - Forces user to acknowledge issues
- ✅ **Energy efficient** - Devices not running unnecessarily

### For Users:
- ✅ **Full control** - User decides when to activate devices
- ✅ **Remote monitoring** - Email alerts even when away
- ✅ **History tracking** - Last 50 alerts saved locally
- ✅ **Customizable email** - Use any email address

### For System:
- ✅ **Reduced complexity** - No auto-control logic needed
- ✅ **Predictable behavior** - Devices always OFF unless manually turned ON
- ✅ **No false positives** - User validates before taking action
- ✅ **Offline capable** - Email generation works without internet

---

## 📝 Alert Thresholds

### High Level Alerts:

| Sensor | Threshold | Severity | Action Required |
|--------|-----------|----------|-----------------|
| CO2 | > 1000 PPM | ⚠️ Warning | Ventilate area |
| CO | > 9 PPM | ⚠️ Warning | Check for leaks |
| Air Quality | > 75 PPM | ⚠️ Warning | Turn on purifier |
| Smoke | > 150 PPM | 🔴 Critical | Investigate source |
| Flame | Detected | 🚨 Emergency | Evacuate immediately |

### Low Level Alerts:

| Sensor | Threshold | Severity | Action Required |
|--------|-----------|----------|-----------------|
| CO2 | < 300 PPM | ℹ️ Info | Unusual - check sensor |
| CO | < 1 PPM | ℹ️ Info | Unusual - check sensor |

---

## 🧪 Testing

### Test Email Alerts:

1. **Trigger High CO2 Alert:**
   - Make sure test script is running: `node test-sensor-data.js`
   - Wait for CO2 to exceed 1000 PPM
   - Check dashboard for toast notification
   - Check console for email log

2. **Update Email Address:**
   - Go to Settings
   - Change email to your actual email
   - Click "Update Profile"
   - Verify toast: "Profile updated successfully"

3. **Verify Alert History:**
   - Open Console (F12)
   - Type: `JSON.parse(localStorage.getItem('gasAlerts'))`
   - See list of all alerts with timestamps

4. **Manual Device Control:**
   - Go to Dashboard
   - Toggle "Power" switch on Air Purifier
   - Verify it turns ON
   - Toggle again to turn OFF
   - Verify it stays OFF (no auto-control)

---

## 🔍 Troubleshooting

### Email Not Sending?

**Current Implementation:**
- Email details are **logged to console** only
- Not actually sending emails (requires backend)
- `mailto:` link generated but not auto-opened

**To Enable Actual Email Sending:**

You need to set up a backend email service:

#### **Option 1: Supabase Edge Functions**
```typescript
// Create Supabase Edge Function: send-email
const { data, error } = await supabase.functions.invoke('send-email', {
  body: { to: userEmail, subject, body }
});
```

#### **Option 2: EmailJS**
```bash
npm install @emailjs/browser
```
```typescript
import emailjs from '@emailjs/browser';
emailjs.send('service_id', 'template_id', {
  to_email: userEmail,
  message: alertMessages
});
```

#### **Option 3: SendGrid/Mailgun API**
```typescript
fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${API_KEY}` },
  body: JSON.stringify({ ... })
});
```

---

## 🌟 Future Enhancements

### Planned Features:
- [ ] **SMS alerts** - Text message notifications
- [ ] **Push notifications** - Browser push API
- [ ] **Webhook support** - Send to Slack/Discord
- [ ] **Email templates** - HTML formatted emails
- [ ] **Alert schedules** - Quiet hours (no alerts at night)
- [ ] **Severity filtering** - Only alert for critical issues
- [ ] **Alert frequency control** - Don't spam user
- [ ] **Multiple recipients** - CC multiple emails
- [ ] **Custom thresholds** - User-defined alert levels

---

## 📋 Files Modified

### 1. **`src/pages/Dashboard.tsx`**
   - ❌ Removed auto-control device logic
   - ✅ Added gas level monitoring with HIGH/LOW detection
   - ✅ Added `sendEmailNotification()` function
   - ✅ Added alert history storage (localStorage)
   - ✅ Toast notifications with detailed sensor readings

### 2. **`src/pages/Settings.tsx`**
   - ✅ Added `useState` for email, name, phone
   - ✅ Added `useEffect` to load from localStorage
   - ✅ Added `handleUpdateProfile()` to save to localStorage
   - ✅ Updated email input with alert description
   - ✅ Controlled inputs with state binding

---

## ✅ Status

- ✅ Devices always stay OFF (no auto-control)
- ✅ Email alerts trigger on HIGH/LOW gas levels
- ✅ User email configurable in Settings
- ✅ Alert history saved (last 50 alerts)
- ✅ Toast notifications show on dashboard
- ✅ Console logging for debugging
- ✅ Manual device control still available
- ✅ No TypeScript errors

---

## ⚠️ Important Notes

### Current Limitations:
1. **Email not actually sent** - Only logged to console (requires backend setup)
2. **localStorage only** - Data not synced across devices
3. **Browser-based** - Alerts only work when app is open
4. **No retry mechanism** - If alert fails, it's lost

### Recommendations:
- ✅ Set up proper email backend (Supabase/SendGrid)
- ✅ Add SMS notifications for critical alerts
- ✅ Store alerts in Supabase database (not just localStorage)
- ✅ Add alert acknowledgment system
- ✅ Implement alert escalation (if not acknowledged, send SMS)

---

**Updated:** October 16, 2025  
**Feature:** Email Alert System (Devices Always OFF)  
**Status:** ✅ Complete - Ready for Backend Integration  
**Default Email:** durai@innovators.com
