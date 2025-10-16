# 📧 Email Alert System - Sender Email Explanation

## ❓ Your Question: "By which person's mail ID is the email sent?"

## 🎯 Current Implementation (Important!)

### **IMPORTANT: Emails Are NOT Actually Being Sent Yet!**

Currently, the system **DOES NOT send real emails**. Here's what's happening:

### What the Current System Does:
1. ✅ **Detects** gas level alerts (high/low thresholds)
2. ✅ **Logs** email details to browser console
3. ✅ **Stores** alert history in localStorage
4. ✅ **Shows** toast notification on screen
5. ❌ **Does NOT** actually send emails to anyone

### Why No Emails Are Sent:
```typescript
// Current code in Dashboard.tsx
const sendEmailNotification = (email: string, message: string) => {
  // Using mailto as a simple solution
  // In production, you would use Supabase Edge Functions or a proper email service
  
  console.log('📧 Email Alert:', { to: email, subject, body });
  // ↑ This ONLY logs to console, doesn't send email
  
  const mailtoLink = `mailto:${email}?...`;
  // ↑ This creates a link but doesn't open it (commented out)
  
  // window.open(mailtoLink); // ← This is commented out!
}
```

---

## 📨 How Email WOULD Work (If Implemented)

When you set up actual email sending, there are different approaches:

### **Option 1: Using Your Own Email Account (Gmail, Outlook, etc.)**

#### How It Works:
- **Sender Email:** `your-system-email@gmail.com` (you create this)
- **Receiver Email:** User's email from Settings (e.g., `durai@innovators.com`)
- **From Field:** Shows your system email
- **Subject:** "CORE Innovators - Gas Level Alert"

#### Example:
```
From: core-alerts@gmail.com
To: durai@innovators.com
Subject: CORE Innovators - Gas Level Alert

Alert from CORE Innovators Smart Air Control System

⚠️ High CO2: 1350 PPM
⚠️ High Air Quality: 85 PPM

Timestamp: 10/16/2025, 3:45:12 PM
Devices remain OFF. Manual intervention required.
```

---

### **Option 2: Using Email Service Provider (Recommended)**

#### Popular Services:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Free tier: 62,000 emails/month)
- **EmailJS** (Free tier: 200 emails/month)

#### How It Works:
- **Sender Email:** `alerts@core-innovators.com` (your custom domain)
- **Sender Name:** "CORE Innovators Alert System"
- **Receiver Email:** User's email from Settings
- **Verified Sender:** Service provider verifies you own the domain

---

### **Option 3: Using Supabase Edge Functions (Best for Your Project)**

Since you're using Supabase, this is the best approach:

#### How It Works:
1. Create Supabase Edge Function
2. Configure email service (SendGrid, Resend, etc.)
3. Backend sends email with proper authentication
4. No frontend email credentials exposed

---

## 🔧 Implementation Options

### **Option A: Quick Setup with EmailJS (15 minutes)**

#### Step 1: Sign up for EmailJS
- Go to https://www.emailjs.com/
- Create free account (200 emails/month)
- Get Service ID, Template ID, Public Key

#### Step 2: Install EmailJS
```bash
npm install @emailjs/browser
```

#### Step 3: Update Dashboard.tsx
```typescript
import emailjs from '@emailjs/browser';

const sendEmailNotification = async (email: string, message: string) => {
  try {
    await emailjs.send(
      'YOUR_SERVICE_ID',      // From EmailJS dashboard
      'YOUR_TEMPLATE_ID',      // From EmailJS dashboard
      {
        to_email: email,
        subject: 'CORE Innovators - Gas Level Alert',
        message: message,
        timestamp: new Date().toLocaleString(),
      },
      'YOUR_PUBLIC_KEY'        // From EmailJS dashboard
    );
    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
};
```

#### Step 4: Configure EmailJS Template
In EmailJS dashboard, create a template:
```
Subject: {{subject}}

Alert from CORE Innovators Smart Air Control System

{{message}}

Timestamp: {{timestamp}}

Devices remain OFF. Manual intervention required.
```

#### Sender Email:
- **From:** Your Gmail/Outlook connected to EmailJS
- **Example:** `core-alerts@gmail.com` (you provide)
- **Reply-To:** Same or different email

---

### **Option B: Professional Setup with SendGrid (30 minutes)**

#### Step 1: Sign up for SendGrid
- Go to https://sendgrid.com/
- Create free account (100 emails/day)
- Verify sender email address

#### Step 2: Get API Key
- Dashboard → Settings → API Keys
- Create API key with "Mail Send" permission
- Copy the key (only shown once!)

#### Step 3: Create Supabase Edge Function
```bash
# In terminal
supabase functions new send-email
```

Create file: `supabase/functions/send-email/index.ts`
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');

serve(async (req) => {
  const { to, subject, body } = await req.json();

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: 'alerts@your-domain.com', name: 'CORE Innovators' },
      subject: subject,
      content: [{ type: 'text/plain', value: body }],
    }),
  });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

#### Step 4: Update Dashboard.tsx
```typescript
const sendEmailNotification = async (email: string, message: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: email,
        subject: 'CORE Innovators - Gas Level Alert',
        body: `Alert from CORE Innovators\n\n${message}\n\nTimestamp: ${new Date().toLocaleString()}`,
      },
    });
    
    if (error) throw error;
    console.log('✅ Email sent via SendGrid!');
  } catch (error) {
    console.error('❌ Email failed:', error);
  }
};
```

#### Sender Email:
- **From:** `alerts@your-domain.com` (must verify in SendGrid)
- **Name:** "CORE Innovators Alert System"
- **Reply-To:** `support@your-domain.com` (optional)

---

### **Option C: Using Resend (Modern & Simple)**

#### Step 1: Sign up for Resend
- Go to https://resend.com/
- Free tier: 100 emails/day
- Very developer-friendly

#### Step 2: Get API Key
- Dashboard → API Keys → Create

#### Step 3: Create Supabase Edge Function
```typescript
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'CORE Innovators <alerts@your-domain.com>',
    to: [email],
    subject: 'Gas Level Alert',
    text: message,
  }),
});
```

#### Sender Email:
- **From:** `alerts@your-domain.com` (or use Resend's onboarding@resend.dev for testing)
- **Display Name:** "CORE Innovators"

---

## 🎯 Recommended Solution for You

### **Best Choice: EmailJS (Easiest & Fastest)**

#### Why EmailJS:
- ✅ **Free tier:** 200 emails/month (enough for testing)
- ✅ **Quick setup:** 15 minutes
- ✅ **No backend needed:** Works directly from browser
- ✅ **Use your Gmail:** Connect your existing email
- ✅ **Template editor:** Easy to customize
- ✅ **No credit card:** Required for free tier

#### Sender Email:
You would use **your own email** (Gmail, Outlook, etc.):
- Example: `your-name@gmail.com`
- Or create: `core-alerts@gmail.com` specifically for this

#### Setup Steps:
1. Create EmailJS account
2. Connect your Gmail
3. Create email template
4. Copy Service ID, Template ID, Public Key
5. Install `@emailjs/browser` package
6. Update `sendEmailNotification()` function
7. Test with your email

---

## 📊 Comparison Table

| Service | Sender Email | Free Tier | Setup Time | Best For |
|---------|-------------|-----------|------------|----------|
| **EmailJS** | Your Gmail/Outlook | 200/month | 15 min | Quick testing |
| **SendGrid** | Custom domain | 100/day | 30 min | Production |
| **Resend** | Custom domain | 100/day | 20 min | Modern apps |
| **AWS SES** | Custom domain | 62,000/month | 45 min | Large scale |
| **Mailgun** | Custom domain | 5,000/month | 25 min | Developers |

---

## 🔍 Current System Summary

### What Happens Now (Without Real Email):

1. **User sets email in Settings:** `durai@innovators.com`
2. **Gas level exceeds threshold:** CO2 > 1000 PPM
3. **System detects alert:** Dashboard useEffect triggers
4. **Console log:** `📧 Email Alert: { to: "durai@innovators.com", ... }`
5. **Toast notification:** "Gas level alert! Email sent to durai@innovators.com"
6. **Alert stored:** localStorage `gasAlerts` array
7. **NO ACTUAL EMAIL SENT** ❌

### What User Sees:
- 🔔 Toast notification on screen
- 📝 Console log in browser DevTools (F12)
- 💾 Alert saved in browser localStorage
- ❌ **NO email in inbox**

---

## 🚀 Next Steps to Enable Real Emails

### Choose your approach:

#### **For Quick Testing:**
1. Use EmailJS
2. Connect your Gmail
3. 15-minute setup
4. Start receiving real emails

#### **For Production:**
1. Use SendGrid or Resend
2. Set up custom domain
3. Create Supabase Edge Function
4. Professional email system

---

## 📝 Example: Full EmailJS Integration

Would you like me to implement the full EmailJS integration? I can:

1. ✅ Add EmailJS package
2. ✅ Update `sendEmailNotification()` function
3. ✅ Create email template configuration
4. ✅ Add error handling
5. ✅ Show you where to put your EmailJS keys

Just let me know your EmailJS credentials (Service ID, Template ID, Public Key) and I'll implement it!

---

## ❓ FAQ

### Q: What email address will users see as the sender?
**A:** Depends on service:
- **EmailJS:** Your personal email (Gmail/Outlook)
- **SendGrid/Resend:** Your custom domain email (`alerts@your-domain.com`)
- **Current (none):** No email sent, just console log

### Q: Can I use my company email?
**A:** Yes! Connect it through EmailJS or configure SMTP settings in SendGrid.

### Q: How much does it cost?
**A:** Free tiers available:
- EmailJS: 200 emails/month (free)
- SendGrid: 100 emails/day (free)
- Resend: 100 emails/day (free)

### Q: Is the current system secure?
**A:** Currently safe because NO emails are sent. When implementing, use environment variables for API keys (never hardcode).

---

**Current Status:** Email alerts are logged but NOT sent  
**To Enable:** Choose EmailJS, SendGrid, or Resend  
**Recommended:** EmailJS for quick testing (15 min setup)
