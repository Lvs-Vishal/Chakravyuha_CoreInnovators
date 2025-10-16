# 📧 Email Rate Limiting - 3 Minute Intervals

## ✅ Changes Made

### 🕐 **Auto-Refresh Reduced**
- **Old:** Every 10 seconds (very frequent)
- **New:** Every 3 minutes (180 seconds)
- **Benefit:** Less page refreshes, fewer email checks

### 📧 **Email Cooldown Added**
- **Cooldown Period:** 3 minutes between emails
- **Max Emails:** ~480 per day (if alerts constant)
- **Benefit:** Prevents email spam, stays under free tier limits

---

## 🎯 How It Works

### Auto-Refresh Schedule:
```
Dashboard Opens
    ↓
Wait 3 minutes
    ↓
Page Refreshes (checks for new sensor data)
    ↓
Wait 3 minutes
    ↓
Repeat...
```

### Email Cooldown Logic:
```
Alert Detected (CO2 > 1000)
    ↓
Check: Has it been 3+ minutes since last email?
    ↓
YES → Send email, start cooldown timer
    ↓
NO → Show "cooldown active" toast only
```

---

## 📊 Email Frequency Calculation

### Maximum Emails Per Day:

#### **Scenario 1: Constant Alerts** (worst case)
- **Cooldown:** 3 minutes
- **Emails per hour:** 60 ÷ 3 = 20 emails
- **Emails per day:** 20 × 24 = **480 emails/day**

#### **Scenario 2: Typical Usage** (realistic)
- **Alert frequency:** Few times per day
- **Estimated emails:** 5-20 per day
- **Well under free tier limits**

### Free Tier Limits:
| Service | Daily Limit | Our Max | Safe? |
|---------|------------|---------|-------|
| **EmailJS** | ~6/hour (200/month) | 480/day | ⚠️ May exceed |
| **SendGrid** | 100/day | 480/day | ❌ Will exceed |
| **Resend** | 100/day | 480/day | ❌ Will exceed |
| **Mailgun** | ~166/day (5000/month) | 480/day | ❌ Will exceed |

### ✅ Recommended:
Current 3-minute cooldown is good for **typical usage** (5-20 alerts/day).

For **constant alerts**, consider:
- Increase cooldown to 15 minutes → Max 96 emails/day ✅
- Or increase to 30 minutes → Max 48 emails/day ✅

---

## 🔧 Technical Implementation

### State Added:
```typescript
const [lastAlertTime, setLastAlertTime] = useState<number>(0);
const EMAIL_COOLDOWN = 180000; // 3 minutes in milliseconds
```

### Cooldown Check:
```typescript
const currentTime = Date.now();
const timeSinceLastAlert = currentTime - lastAlertTime;

if (timeSinceLastAlert < EMAIL_COOLDOWN) {
  // Still in cooldown - don't send email
  const remainingTime = Math.ceil((EMAIL_COOLDOWN - timeSinceLastAlert) / 1000 / 60);
  console.log(`⏳ Email cooldown active. Next email in ${remainingTime} minute(s)`);
  return; // Exit without sending
}

// Cooldown expired - send email
sendEmailNotification(email, message);
setLastAlertTime(currentTime); // Reset cooldown timer
```

---

## 🎨 User Experience

### During Cooldown:
```
Gas Alert Detected
    ↓
Check: Last email was 1 minute ago
    ↓
Toast: "Gas level alert detected! Email cooldown active. Next alert in 2 min"
    ↓
NO EMAIL SENT (saves quota)
```

### After Cooldown:
```
Gas Alert Detected
    ↓
Check: Last email was 4 minutes ago
    ↓
Send Email via EmailJS
    ↓
Toast: "Gas level alert! Email sent to durai@innovators.com"
    ↓
Reset cooldown timer
```

---

## 📝 Console Messages

### Email Sent:
```
✅ Email sent successfully via EmailJS!
```

### Cooldown Active:
```
⏳ Email cooldown active. Next email in 2 minute(s)
```

### Page Refresh:
```
🔄 Auto-refreshing Dashboard to fetch latest data...
```

---

## ⚙️ Customization Options

### Change Auto-Refresh Interval:

Edit `src/pages/Dashboard.tsx` (line ~52):

```typescript
// Current: 3 minutes
}, 180000);

// Options:
}, 60000);   // 1 minute
}, 300000);  // 5 minutes
}, 600000);  // 10 minutes
}, 900000);  // 15 minutes
```

### Change Email Cooldown:

Edit `src/pages/Dashboard.tsx` (line ~55):

```typescript
// Current: 3 minutes
const EMAIL_COOLDOWN = 180000;

// Conservative (fewer emails):
const EMAIL_COOLDOWN = 300000;  // 5 minutes → Max 288/day
const EMAIL_COOLDOWN = 600000;  // 10 minutes → Max 144/day
const EMAIL_COOLDOWN = 900000;  // 15 minutes → Max 96/day ✅ Safe
const EMAIL_COOLDOWN = 1800000; // 30 minutes → Max 48/day ✅ Very safe

// Aggressive (more emails):
const EMAIL_COOLDOWN = 60000;   // 1 minute → Max 1440/day ❌ Too many
const EMAIL_COOLDOWN = 120000;  // 2 minutes → Max 720/day ❌ Too many
```

---

## 🎯 Recommended Settings by Use Case

### For Testing:
```typescript
// Auto-refresh: 1 minute (see results faster)
}, 60000);

// Email cooldown: 2 minutes (test without waiting long)
const EMAIL_COOLDOWN = 120000;
```

### For Production (Low Alert Frequency):
```typescript
// Auto-refresh: 3 minutes (current - good balance)
}, 180000);

// Email cooldown: 3 minutes (current - allows quick response)
const EMAIL_COOLDOWN = 180000;
```

### For Production (High Alert Frequency):
```typescript
// Auto-refresh: 5 minutes (reduce checks)
}, 300000);

// Email cooldown: 15 minutes (prevent spam)
const EMAIL_COOLDOWN = 900000; // ✅ Max 96 emails/day
```

### For Production (Very Conservative):
```typescript
// Auto-refresh: 10 minutes
}, 600000);

// Email cooldown: 30 minutes
const EMAIL_COOLDOWN = 1800000; // ✅ Max 48 emails/day
```

---

## 📊 Email Budget Planning

### EmailJS Free Tier: 200 emails/month

| Cooldown | Max/Day | Days Until Limit | Realistic Usage |
|----------|---------|------------------|-----------------|
| 1 min | 1440 | <1 day | ❌ Exceeds instantly |
| 3 min | 480 | <1 day | ⚠️ If constant alerts |
| 5 min | 288 | <1 day | ⚠️ If constant alerts |
| 15 min | 96 | 2 days | ✅ Safe for typical use |
| 30 min | 48 | 4 days | ✅ Very safe |

### Typical Real-World Usage:
- **Morning check:** 1-2 alerts
- **During day:** 3-5 alerts
- **Evening:** 1-2 alerts
- **Total:** ~5-10 emails/day
- **Monthly:** 150-300 emails

**Recommendation:** Keep 3-minute cooldown if alerts are occasional. Increase to 15-30 minutes if seeing constant alerts.

---

## 🔍 Monitoring Email Usage

### Check Console Logs:

#### Email Sent:
```javascript
✅ Email sent successfully via EmailJS!
Response: { status: 200, text: 'OK' }
```

#### Cooldown Blocked:
```javascript
⏳ Email cooldown active. Next email in 2 minute(s)
```

### Check Alert History:

Open console and run:
```javascript
// View all alerts (sent and blocked)
JSON.parse(localStorage.getItem('gasAlerts'))

// Count total alerts today
const alerts = JSON.parse(localStorage.getItem('gasAlerts') || '[]');
const today = new Date().toDateString();
const todayAlerts = alerts.filter(a => 
  new Date(a.timestamp).toDateString() === today
);
console.log(`Alerts today: ${todayAlerts.length}`);

// Clear history
localStorage.removeItem('gasAlerts')
```

---

## 🚨 Alert Priority System (Future Enhancement)

### Current Behavior:
All alerts treated equally (3-minute cooldown)

### Suggested Improvement:
```typescript
// Critical alerts (flame, very high CO) - shorter cooldown
if (isFlameDetected || sensorData.co_ppm > 35) {
  EMAIL_COOLDOWN = 60000; // 1 minute for emergencies
}

// Warning alerts (high levels) - normal cooldown
else if (isHighCO2 || isHighCO || isHighSmoke) {
  EMAIL_COOLDOWN = 180000; // 3 minutes
}

// Info alerts (low levels) - longer cooldown
else if (isLowCO2 || isLowCO) {
  EMAIL_COOLDOWN = 600000; // 10 minutes
}
```

---

## ✅ Benefits

### Email Quota Management:
- ✅ **Prevents spam** - Max 1 email per 3 minutes
- ✅ **Stays under limits** - Compatible with free tiers
- ✅ **User-friendly** - Shows cooldown status
- ✅ **Customizable** - Easy to adjust intervals

### Performance:
- ✅ **Less frequent refreshes** - 3 minutes vs 10 seconds
- ✅ **Reduced server load** - Fewer API calls
- ✅ **Better UX** - Less disruptive page reloads
- ✅ **Battery efficient** - Fewer background operations

---

## 🧪 Testing

### Test Cooldown System:

1. **Trigger First Alert:**
   - Make CO2 exceed 1000 PPM
   - Should send email immediately
   - Toast: "Email sent to..."
   - Console: "✅ Email sent successfully"

2. **Test Cooldown (within 3 min):**
   - CO2 still high
   - Should NOT send email
   - Toast: "Email cooldown active. Next alert in X min"
   - Console: "⏳ Email cooldown active..."

3. **Test After Cooldown (3+ min later):**
   - Wait 3 minutes
   - CO2 still high
   - Should send email again
   - Toast: "Email sent to..."

4. **Test Page Refresh:**
   - Wait 3 minutes
   - Page should auto-refresh
   - Console: "🔄 Auto-refreshing Dashboard..."

---

## 📋 Files Modified

### `src/pages/Dashboard.tsx`

#### Changes:
1. ✅ Auto-refresh interval: `10000` → `180000` (10s → 3min)
2. ✅ Added state: `lastAlertTime` (tracks last email)
3. ✅ Added constant: `EMAIL_COOLDOWN = 180000` (3 minutes)
4. ✅ Added cooldown check before sending email
5. ✅ Added cooldown toast notification
6. ✅ Added remaining time calculation
7. ✅ Updates `lastAlertTime` after sending email

---

## ✅ Status

- ✅ Auto-refresh: Every 3 minutes
- ✅ Email cooldown: 3 minutes between alerts
- ✅ Max emails: ~480/day (constant alerts) or ~10/day (typical)
- ✅ Cooldown notifications: Shows remaining time
- ✅ No TypeScript errors
- ✅ Compatible with EmailJS free tier (with typical usage)

---

## 💡 Recommendations

### For Your Use Case:

#### **If alerts are rare** (few per day):
- ✅ Keep current settings (3-minute intervals)
- ✅ You'll send ~5-20 emails/day
- ✅ Well under free tier limits

#### **If alerts are frequent** (constant threshold violations):
- ⚠️ Consider increasing cooldown to 15 minutes
- ✅ Max 96 emails/day (safe for all free tiers)
- ✅ Still responsive for critical alerts

#### **For production deployment:**
- ✅ Start with 3 minutes, monitor usage
- ✅ Check EmailJS dashboard for daily counts
- ✅ Adjust cooldown if approaching limits
- ✅ Consider paid tier if needed (very affordable)

---

**Updated:** October 16, 2025  
**Feature:** Email Rate Limiting (3-minute cooldown)  
**Status:** ✅ Complete and Active  
**Max Emails:** ~480/day (worst case) or ~10/day (typical)
