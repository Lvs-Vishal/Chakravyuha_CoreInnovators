# 📧 EmailJS Setup Guide - ALMOST COMPLETE!

## ✅ What's Done:

1. ✅ **EmailJS Package Installed** - `@emailjs/browser` is ready
2. ✅ **Service ID Added** - `service_t50h7hw` is configured
3. ✅ **Code Updated** - Real email sending function implemented
4. ✅ **Import Added** - EmailJS imported in Dashboard

---

## ⚠️ NEXT STEPS - You Need 2 More Values:

### 🔑 Missing Credentials:

Go to your EmailJS dashboard and get:

1. **Template ID** - Look like `template_xxxxxx`
2. **Public Key** - Look like a long string of characters

---

## 📝 How to Get Missing Values:

### Step 1: Get Template ID

1. **Go to:** https://dashboard.emailjs.com/admin/templates
2. **Click:** "Create New Template" or use existing
3. **Template Editor:** Set up your email template
4. **Copy Template ID:** It shows at the top (e.g., `template_abc123`)

### Example Template Content:
```
Subject: {{subject}}

Alert from CORE Innovators Smart Air Control System

{{message}}

Sensor Readings:
- CO2 Level: {{co2_level}} PPM
- CO Level: {{co_level}} PPM
- Air Quality: {{air_quality}} PPM
- Smoke Level: {{smoke_level}} PPM
- Flame Status: {{flame_status}}

Timestamp: {{timestamp}}

Devices remain OFF. Manual intervention required.

---
This is an automated alert from CORE Innovators Smart Home System.
```

### Step 2: Get Public Key

1. **Go to:** https://dashboard.emailjs.com/admin/account
2. **Section:** "API Keys" or "Account"
3. **Copy:** Your Public Key (starts with letters/numbers)

---

## 🔧 Update the Code:

### Open: `src/pages/Dashboard.tsx`

Find these lines (around line 165):
```typescript
const EMAILJS_SERVICE_ID = 'service_t50h7hw'; // ✅ Already set!
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // ⚠️ Replace this
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // ⚠️ Replace this
```

### Replace with your actual values:
```typescript
const EMAILJS_SERVICE_ID = 'service_t50h7hw';
const EMAILJS_TEMPLATE_ID = 'template_abc123'; // Your Template ID
const EMAILJS_PUBLIC_KEY = 'your_public_key_here'; // Your Public Key
```

---

## 📧 Email Template Variables

Your EmailJS template can use these variables:

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `{{to_email}}` | Recipient email | `durai@innovators.com` |
| `{{subject}}` | Email subject | `CORE Innovators - Gas Level Alert` |
| `{{message}}` | Alert message | `⚠️ High CO2: 1350 PPM` |
| `{{timestamp}}` | Current time | `10/16/2025, 7:45:12 AM` |
| `{{co2_level}}` | CO2 sensor value | `1350` |
| `{{co_level}}` | CO sensor value | `3` |
| `{{air_quality}}` | Air quality value | `85` |
| `{{smoke_level}}` | Smoke sensor value | `450` |
| `{{flame_status}}` | Flame detection | `DETECTED` or `Not detected` |

---

## 🧪 Testing After Setup

### Step 1: Update the Code
Replace `YOUR_TEMPLATE_ID` and `YOUR_PUBLIC_KEY` with your actual values.

### Step 2: Save and Refresh
The dev server will auto-reload with your changes.

### Step 3: Trigger an Alert
- Make sure test sensor data is running
- Wait for CO2 to exceed 1000 PPM (or other thresholds)
- Alert should trigger automatically

### Step 4: Check Results
1. **Console:** Should see `✅ Email sent successfully via EmailJS!`
2. **Toast:** Should see "Email alert sent successfully!"
3. **Your inbox:** Check for the actual email!

---

## 🎯 What Happens When Alert Triggers

### Current Flow:
```
1. Gas level exceeds threshold
   ↓
2. Dashboard detects abnormal reading
   ↓
3. Calls sendEmailNotification()
   ↓
4. EmailJS sends real email 📧
   ↓
5. User receives email in inbox
   ↓
6. Toast notification shows success
   ↓
7. Alert saved to localStorage
```

### Email You'll Receive:
```
From: your-email@gmail.com (connected to EmailJS)
To: durai@innovators.com (from Settings)
Subject: CORE Innovators - Gas Level Alert

Alert from CORE Innovators Smart Air Control System

⚠️ High CO2: 1350 PPM
⚠️ High Air Quality: 85 PPM

Sensor Readings:
- CO2 Level: 1350 PPM
- CO Level: 3 PPM
- Air Quality: 85 PPM
- Smoke Level: 450 PPM
- Flame Status: Not detected

Timestamp: 10/16/2025, 7:45:12 AM

Devices remain OFF. Manual intervention required.
```

---

## ✅ Checklist

- [x] **EmailJS account created**
- [x] **Service ID obtained:** `service_t50h7hw`
- [x] **EmailJS package installed:** `@emailjs/browser`
- [x] **Code updated in Dashboard.tsx**
- [ ] **Template created in EmailJS** ← YOU ARE HERE
- [ ] **Template ID copied**
- [ ] **Public Key copied**
- [ ] **Code updated with Template ID**
- [ ] **Code updated with Public Key**
- [ ] **Tested alert sending**
- [ ] **Received test email**

---

## 🚀 Quick Setup (5 minutes)

### 1. Create Email Template
- Go to: https://dashboard.emailjs.com/admin/templates
- Click "Create New Template"
- Copy the template content from above
- Save template
- **Copy Template ID**

### 2. Get Public Key
- Go to: https://dashboard.emailjs.com/admin/account
- Find "API Keys" section
- **Copy Public Key**

### 3. Update Dashboard.tsx
```typescript
// Around line 165
const EMAILJS_TEMPLATE_ID = 'template_YOUR_ID_HERE';
const EMAILJS_PUBLIC_KEY = 'YOUR_KEY_HERE';
```

### 4. Test It
- Trigger a gas alert
- Check console for success message
- Check your email inbox!

---

## 🔍 Troubleshooting

### If Email Doesn't Send:

#### Check Console for Errors:
```javascript
❌ Failed to send email: [error message]
```

#### Common Issues:

1. **Wrong Template ID**
   - Go to EmailJS dashboard
   - Verify Template ID is correct
   - Make sure template is saved

2. **Wrong Public Key**
   - Go to Account settings
   - Copy the correct Public Key
   - Must match exactly (no spaces)

3. **Service Not Connected**
   - Go to Email Services
   - Make sure Gmail/Outlook is connected
   - Verify it's active

4. **Email Quota Exceeded**
   - Free tier: 200 emails/month
   - Check usage in dashboard
   - Upgrade if needed

---

## 📊 Current Implementation

### File: `src/pages/Dashboard.tsx`

#### Imports (Line 1-12):
```typescript
import emailjs from '@emailjs/browser'; // ✅ Added
```

#### Email Function (Line 162-220):
```typescript
const sendEmailNotification = async (email: string, message: string) => {
  const EMAILJS_SERVICE_ID = 'service_t50h7hw'; // ✅ Set
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // ⚠️ Needs update
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';   // ⚠️ Needs update
  
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      { to_email, subject, message, ... },
      EMAILJS_PUBLIC_KEY
    );
    // Success handling
  } catch (error) {
    // Error handling
  }
};
```

---

## 🎯 Expected Results

### Success:
- ✅ Console: `✅ Email sent successfully via EmailJS!`
- ✅ Toast: "Email alert sent successfully!"
- ✅ Email received in inbox
- ✅ Alert saved to localStorage

### Failure:
- ❌ Console: `❌ Failed to send email: [error]`
- ❌ Toast: "Failed to send email alert"
- ❌ No email received
- ✅ Alert still saved to localStorage (backup)

---

## 💡 Next Steps

1. **Get Template ID** from EmailJS dashboard
2. **Get Public Key** from EmailJS account
3. **Update Dashboard.tsx** with both values
4. **Test by triggering alert** (CO2 > 1000 PPM)
5. **Check your email inbox!**

---

## 📞 Need Help?

Once you provide:
- ✅ Service ID: `service_t50h7hw` (already have this!)
- ⚠️ Template ID: `template_???????`
- ⚠️ Public Key: `????????????????`

I can:
1. Update the code for you
2. Verify everything is correct
3. Help troubleshoot any issues
4. Test the email system

---

**Status:** 80% Complete - Just need Template ID and Public Key!  
**Next:** Get credentials from EmailJS dashboard  
**Time:** 5 minutes to complete setup
