# 🔄 Auto-Refresh Feature

## ✅ What's Been Added

The entire website now **automatically refreshes every 30 seconds** to ensure you always see the most current sensor values and device states.

---

## 🎯 How It Works

### Auto-Refresh Mechanism:
- ⏱️ **Interval:** Every 30 seconds (30,000 milliseconds)
- 🔄 **Action:** Full page reload (`window.location.reload()`)
- 📊 **Purpose:** Fetches latest sensor data, device states, and all real-time values
- 🧹 **Cleanup:** Automatically stops when component unmounts

---

## 📝 Technical Implementation

### Location: `src/App.tsx`

```typescript
useEffect(() => {
  const refreshInterval = setInterval(() => {
    console.log("🔄 Auto-refreshing website to fetch latest data...");
    window.location.reload();
  }, 30000); // 30 seconds

  // Cleanup interval on unmount
  return () => clearInterval(refreshInterval);
}, []);
```

---

## 🎨 User Experience

### What You'll See:
1. **Normal browsing** - Use the app as usual
2. **After 30 seconds** - Page automatically refreshes
3. **Updated data** - All sensor values, charts, and states are current
4. **Continuous loop** - Repeats every 30 seconds

### Console Feedback:
You can see refresh activity in the browser console:
```
🔄 Auto-refreshing website to fetch latest data...
```

---

## ⚙️ Customization Options

### Change Refresh Interval:

**Current setting:** 30 seconds (30000 ms)

To change the interval, modify the value in `src/App.tsx`:

```typescript
// Refresh every 15 seconds
}, 15000);

// Refresh every 1 minute
}, 60000);

// Refresh every 2 minutes
}, 120000);
```

### Disable Auto-Refresh:

If you want to disable auto-refresh temporarily, comment out the useEffect:

```typescript
// useEffect(() => {
//   const refreshInterval = setInterval(() => {
//     console.log("🔄 Auto-refreshing website to fetch latest data...");
//     window.location.reload();
//   }, 30000);
//   return () => clearInterval(refreshInterval);
// }, []);
```

---

## 🚀 Benefits

### For Users:
- ✅ **Always current data** - No need to manually refresh
- ✅ **Set and forget** - Automatic updates in the background
- ✅ **Reliable** - Guaranteed fresh data every 30 seconds
- ✅ **Simple** - No complex state management needed

### For System:
- ✅ **Complete refresh** - Ensures all data is synchronized
- ✅ **Clean state** - Resets any stale connections or cached data
- ✅ **Predictable** - Consistent behavior across all pages
- ✅ **Easy maintenance** - Single point of control

---

## 📊 What Gets Refreshed

Every 30 seconds, the following data is updated:

### Dashboard Page:
- 🌬️ **CO2 levels** (PPM)
- ☁️ **CO levels** (PPM)
- 🍃 **Air Quality** (PPM)
- 💨 **Smoke levels** (PPM)
- 🔥 **Flame detection** status
- 💡 **Device states** (On/Off, Auto mode)

### Analytics Page:
- 📈 **Historical charts** (24-hour data)
- 📊 **Trend analysis**
- 🎯 **Statistics and averages**

### Automation Page:
- ⚡ **Rule states**
- 🎮 **Automation status**
- 📋 **Action logs**

### Assistant Page:
- 🤖 **AI conversation history**
- 📚 **Knowledge base updates**
- 🎤 **Voice assistant state**

### Settings Page:
- ⚙️ **Configuration values**
- 👤 **User preferences**
- 🔔 **Notification settings**

---

## 🔧 Alternative: Real-time Updates (Already Implemented)

**Note:** Your Dashboard already has real-time Supabase subscriptions that update sensor values instantly **without** page refresh. The auto-refresh feature provides an additional layer of reliability:

### Real-time Features (No refresh needed):
- ⚡ **Sensor data** - Updates via Supabase real-time subscriptions
- 🔄 **Live charts** - Stream new data points
- 📡 **WebSocket connection** - Instant updates

### Auto-refresh Adds:
- 🛡️ **Backup mechanism** - Ensures data stays fresh even if WebSocket drops
- 🔄 **Full state reset** - Clears any potential UI inconsistencies
- 🧹 **Memory management** - Prevents memory leaks from long sessions

---

## ⏰ Timeline Example

```
00:00 - User opens dashboard
00:30 - Auto-refresh (1st refresh)
01:00 - Auto-refresh (2nd refresh)
01:30 - Auto-refresh (3rd refresh)
02:00 - Auto-refresh (4th refresh)
...continues every 30 seconds
```

---

## 🎯 Best Practices

### Recommended Settings:
- **30 seconds** - Balance between freshness and performance (✅ **Current**)
- **15 seconds** - More frequent updates (higher server load)
- **60 seconds** - Less frequent (better for slower connections)

### Consider Increasing Interval If:
- ❌ You notice page flicker/flash
- ❌ Server load is high
- ❌ Sensor data changes slowly
- ❌ Using slow internet connection

### Consider Decreasing Interval If:
- ✅ Need faster updates (e.g., emergency monitoring)
- ✅ Sensor data changes rapidly
- ✅ Real-time subscriptions are unreliable
- ✅ Running on high-performance infrastructure

---

## 🧪 Testing

### Verify Auto-Refresh Works:

1. **Open the app** in your browser
2. **Open Developer Console** (F12)
3. **Wait 30 seconds** - You should see the console message
4. **Observe page reload** - Brief white flash as page refreshes
5. **Check sensor values** - Should show latest data

### Console Output:
```
🔄 Auto-refreshing website to fetch latest data...
```

---

## 🔍 Troubleshooting

### If auto-refresh isn't working:

1. **Check console** for JavaScript errors
2. **Verify code** in `src/App.tsx` is correct
3. **Clear cache** and hard reload (Ctrl+Shift+R)
4. **Test in incognito** mode to rule out extensions

### If refresh is too frequent:

Change the interval from `30000` to `60000` (1 minute):
```typescript
}, 60000); // 60 seconds
```

### If refresh is disruptive:

Consider using **only** real-time subscriptions (already implemented in Dashboard) and remove auto-refresh:
- Dashboard has `useEffect` with Supabase subscriptions
- Updates happen instantly without page reload
- More elegant user experience

---

## 📋 Files Modified

### `src/App.tsx`
- ✅ Added `useEffect` import from React
- ✅ Added auto-refresh `useEffect` with 30-second interval
- ✅ Converted `App` from arrow function expression to function component
- ✅ Added cleanup function to clear interval on unmount

---

## ✅ Status

- ✅ Auto-refresh implemented (30-second interval)
- ✅ Console logging added for visibility
- ✅ Cleanup function prevents memory leaks
- ✅ No TypeScript errors
- ✅ Works across all pages
- ✅ Compatible with existing real-time subscriptions

---

## 🌟 Future Enhancements

### Potential Improvements:
- [ ] **User-configurable interval** - Add setting in Settings page
- [ ] **Smart refresh** - Only refresh if data is stale
- [ ] **Page visibility API** - Pause refresh when tab is hidden
- [ ] **Network-aware** - Adjust interval based on connection speed
- [ ] **Manual refresh button** - Allow users to refresh on demand
- [ ] **Refresh indicator** - Show countdown timer to next refresh
- [ ] **Selective refresh** - Only reload data, not entire page

---

**Updated:** October 16, 2025  
**Feature:** Auto-Refresh Every 30 Seconds  
**Status:** ✅ Complete and Active  
**Refresh Interval:** 30 seconds (customizable)
