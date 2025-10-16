export interface KnowledgeItem {
  patterns: string[];
  response: string;
  emotion?: 'calm' | 'happy' | 'caring';
  action?: string;
  category: string;
}

export const knowledgeBase: KnowledgeItem[] = [
  // Greetings & Activation
  {
    category: "greetings",
    patterns: ["hey core", "hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
    response: "Hello, Durai! I'm CORE AI. How can I help you?",
    emotion: "happy"
  },
  {
    category: "greetings",
    patterns: ["good night", "goodnight", "bye", "goodbye"],
    response: "Good night. Sleep well. I'll keep watch.",
    emotion: "caring"
  },
  {
    category: "greetings",
    patterns: ["thank you", "thanks", "thank"],
    response: "You're welcome! Always here for you.",
    emotion: "caring"
  },

  // Device Control - Lights
  {
    category: "device_control",
    patterns: ["turn on all lights", "switch on all lights", "lights on"],
    response: "All lights turned on, Durai.",
    emotion: "calm",
    action: "toggleDevicesByType:light:on"
  },
  {
    category: "device_control",
    patterns: ["turn off all lights", "switch off all lights", "lights off"],
    response: "All lights turned off, Durai.",
    emotion: "calm",
    action: "toggleDevicesByType:light:off"
  },
  {
    category: "device_control",
    patterns: ["turn on living room light", "living room light on"],
    response: "Living room light on, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Living Room:light:on"
  },
  {
    category: "device_control",
    patterns: ["turn off living room light", "living room light off"],
    response: "Living room light off, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Living Room:light:off"
  },
  {
    category: "device_control",
    patterns: ["turn on bedroom light", "bedroom light on", "bedroom lamp on"],
    response: "Bedroom light on, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Bedroom:light:on"
  },
  {
    category: "device_control",
    patterns: ["turn off bedroom light", "bedroom light off", "bedroom lamp off"],
    response: "Bedroom light off, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Bedroom:light:off"
  },
  {
    category: "device_control",
    patterns: ["turn on kitchen light", "kitchen light on"],
    response: "Kitchen light on, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Kitchen:light:on"
  },
  {
    category: "device_control",
    patterns: ["turn off kitchen light", "kitchen light off"],
    response: "Kitchen light off, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Kitchen:light:off"
  },

  // Device Control - Fans
  {
    category: "device_control",
    patterns: ["turn on all fans", "switch on all fans", "fans on", "start all fans"],
    response: "All fans turned on, Durai.",
    emotion: "calm",
    action: "toggleDevicesByType:fan:on"
  },
  {
    category: "device_control",
    patterns: ["turn off all fans", "switch off all fans", "fans off", "stop all fans"],
    response: "All fans turned off, Durai.",
    emotion: "calm",
    action: "toggleDevicesByType:fan:off"
  },
  {
    category: "device_control",
    patterns: ["turn on living room fan", "living room fan on"],
    response: "Living room fan on, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Living Room:fan:on"
  },
  {
    category: "device_control",
    patterns: ["turn off living room fan", "living room fan off"],
    response: "Living room fan off, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Living Room:fan:off"
  },
  {
    category: "device_control",
    patterns: ["turn on bedroom fan", "bedroom fan on"],
    response: "Bedroom fan on, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Bedroom:fan:on"
  },
  {
    category: "device_control",
    patterns: ["turn off bedroom fan", "bedroom fan off"],
    response: "Bedroom fan off, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Bedroom:fan:off"
  },
  {
    category: "device_control",
    patterns: ["turn on kitchen fan", "kitchen fan on", "kitchen exhaust on"],
    response: "Kitchen fan on, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Kitchen:fan:on"
  },
  {
    category: "device_control",
    patterns: ["turn off kitchen fan", "kitchen fan off", "kitchen exhaust off"],
    response: "Kitchen fan off, Durai.",
    emotion: "calm",
    action: "toggleRoomDevice:Kitchen:fan:off"
  },

  // Device Control - All Devices
  {
    category: "device_control",
    patterns: ["turn on all devices", "switch on everything", "turn everything on"],
    response: "All devices turned on, Durai.",
    emotion: "calm",
    action: "toggleAllDevices:on"
  },
  {
    category: "device_control",
    patterns: ["turn off all devices", "switch off everything", "turn everything off"],
    response: "All devices turned off, Durai.",
    emotion: "calm",
    action: "toggleAllDevices:off"
  },
  {
    category: "device_control",
    patterns: ["turn on living room", "living room on"],
    response: "Living room devices on, Durai.",
    emotion: "calm",
    action: "toggleDevicesByRoom:Living Room:on"
  },
  {
    category: "device_control",
    patterns: ["turn off living room", "living room off"],
    response: "Living room devices off, Durai.",
    emotion: "calm",
    action: "toggleDevicesByRoom:Living Room:off"
  },
  {
    category: "device_control",
    patterns: ["turn on bedroom", "bedroom on"],
    response: "Bedroom devices on, Durai.",
    emotion: "calm",
    action: "toggleDevicesByRoom:Bedroom:on"
  },
  {
    category: "device_control",
    patterns: ["turn off bedroom", "bedroom off"],
    response: "Bedroom devices off, Durai.",
    emotion: "calm",
    action: "toggleDevicesByRoom:Bedroom:off"
  },
  {
    category: "device_control",
    patterns: ["turn on kitchen", "kitchen on"],
    response: "Kitchen devices on, Durai.",
    emotion: "calm",
    action: "toggleDevicesByRoom:Kitchen:on"
  },
  {
    category: "device_control",
    patterns: ["turn off kitchen", "kitchen off"],
    response: "Kitchen devices off, Durai.",
    emotion: "calm",
    action: "toggleDevicesByRoom:Kitchen:off"
  },

  // Air Purifier Modes
  {
    category: "purifier_control",
    patterns: ["change air purifier to auto mode", "purifier auto mode", "set purifier to auto", "air purifier auto"],
    response: "All air purifiers switched to Auto mode, Durai.",
    emotion: "calm",
    action: "setAllDevicesModeByType:purifier:auto"
  },
  {
    category: "purifier_control",
    patterns: ["change air purifier to power mode", "purifier power mode", "set purifier to power", "air purifier power"],
    response: "All air purifiers switched to Power mode, Durai.",
    emotion: "calm",
    action: "setAllDevicesModeByType:purifier:power"
  },
  {
    category: "purifier_control",
    patterns: ["change air purifier to manual mode", "purifier manual mode", "set purifier to manual", "air purifier manual"],
    response: "All air purifiers switched to Manual mode, Durai.",
    emotion: "calm",
    action: "setAllDevicesModeByType:purifier:manual"
  },
  {
    category: "purifier_control",
    patterns: ["change air purifier to sleep mode", "purifier sleep mode", "set purifier to sleep", "air purifier sleep"],
    response: "All air purifiers switched to Sleep mode, Durai.",
    emotion: "calm",
    action: "setAllDevicesModeByType:purifier:sleep"
  },

  // Environment & Sensors
  {
    category: "environment",
    patterns: ["air quality", "check air quality", "how is the air", "air status"],
    response: "Air looks clean today. CO₂ is 420 ppm, PM2.5 is 35 micrograms per cubic meter. All normal.",
    emotion: "calm"
  },
  {
    category: "environment",
    patterns: ["temperature", "what is the temperature", "how hot is it", "current temperature"],
    response: "Average temperature is 24 degrees Celsius across all rooms.",
    emotion: "calm"
  },
  {
    category: "environment",
    patterns: ["living room temperature", "temperature in living room"],
    response: "It's 23.5 degrees Celsius in the living room, quite comfortable.",
    emotion: "calm"
  },
  {
    category: "environment",
    patterns: ["bedroom temperature", "temperature in bedroom"],
    response: "It's 22 degrees Celsius in the bedroom, quite comfortable.",
    emotion: "calm"
  },
  {
    category: "environment",
    patterns: ["kitchen temperature", "temperature in kitchen"],
    response: "It's 26 degrees Celsius in the kitchen, quite comfortable.",
    emotion: "calm"
  },
  {
    category: "environment",
    patterns: ["humidity", "what is the humidity", "humidity level"],
    response: "Humidity is at 45 percent. Comfortable level.",
    emotion: "calm"
  },
  {
    category: "environment",
    patterns: ["co2", "carbon dioxide", "co2 level"],
    response: "CO₂ is 420 ppm. Normal levels.",
    emotion: "calm"
  },
  {
    category: "environment",
    patterns: ["pm2.5", "particulate matter", "air particles"],
    response: "PM2.5 is 35 micrograms per cubic meter. Good air quality.",
    emotion: "calm"
  },

  // Safety & Security
  {
    category: "safety",
    patterns: ["is everything safe", "safety status", "security check", "am i safe"],
    response: "Yes. All safety systems are normal and active. No smoke, no gas leaks, all sensors online.",
    emotion: "caring"
  },
  {
    category: "safety",
    patterns: ["smoke", "fire", "smoke detector"],
    response: "No smoke detected. All clear.",
    emotion: "calm"
  },
  {
    category: "safety",
    patterns: ["gas", "gas leak", "check gas"],
    response: "No gas leaks detected. Everything is safe.",
    emotion: "calm"
  },
  {
    category: "safety",
    patterns: ["lock the doors", "lock doors", "secure doors"],
    response: "Doors locked. You're secure.",
    emotion: "calm"
  },
  {
    category: "safety",
    patterns: ["unlock the doors", "unlock doors", "open doors"],
    response: "Doors unlocked.",
    emotion: "calm"
  },
  {
    category: "safety",
    patterns: ["arm security", "activate security", "turn on security"],
    response: "Security armed.",
    emotion: "calm"
  },
  {
    category: "safety",
    patterns: ["disarm security", "deactivate security", "turn off security"],
    response: "Security disarmed.",
    emotion: "calm"
  },

  // Energy & Power
  {
    category: "energy",
    patterns: ["energy usage", "power consumption", "how much power", "electricity usage"],
    response: "Current power usage is 2.3 kilowatts. Running efficiently.",
    emotion: "calm"
  },
  {
    category: "energy",
    patterns: ["energy cost", "electricity bill", "power cost"],
    response: "Current consumption would cost approximately 12 rupees per hour.",
    emotion: "calm"
  },

  // Status & Reports
  {
    category: "status",
    patterns: ["system status", "full report", "everything ok", "check everything", "status report"],
    response: "All systems normal and active. Temperature 24 degrees, humidity 45 percent, air quality good. No safety alerts. Energy consumption optimal.",
    emotion: "calm"
  },
  {
    category: "status",
    patterns: ["device status", "what devices are on", "active devices"],
    response: "Let me check all your devices for you.",
    emotion: "calm"
  },

  // Help & Commands
  {
    category: "help",
    patterns: ["help", "what can you do", "commands", "capabilities", "features"],
    response: "I can control all your devices, check air quality, temperature, humidity, manage security, locks, energy usage, and keep you safe. Just ask me anything about your home.",
    emotion: "calm"
  },
  {
    category: "help",
    patterns: ["how do i", "how to", "teach me"],
    response: "Just speak naturally. Try 'turn on lights' or 'what's the temperature' or 'is everything safe'.",
    emotion: "calm"
  },

  // Time & Date
  {
    category: "time",
    patterns: ["what time is it", "current time", "time"],
    response: `It's ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`,
    emotion: "calm"
  },
  {
    category: "time",
    patterns: ["what date is it", "today's date", "date"],
    response: `Today is ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`,
    emotion: "calm"
  },

  // Scenes & Routines
  {
    category: "scenes",
    patterns: ["movie mode", "cinema mode", "watching movie"],
    response: "Movie mode activated. Dimming lights, optimal temperature set.",
    emotion: "calm"
  },
  {
    category: "scenes",
    patterns: ["sleep mode", "bedtime", "going to sleep"],
    response: "Sleep mode activated. Turning off lights, adjusting temperature. Sleep well.",
    emotion: "caring"
  },
  {
    category: "scenes",
    patterns: ["wake up mode", "morning mode", "waking up"],
    response: "Good morning! Lights on, optimal morning temperature set.",
    emotion: "happy"
  },
  {
    category: "scenes",
    patterns: ["away mode", "leaving home", "going out"],
    response: "Away mode activated. All devices off, security armed.",
    emotion: "calm"
  },
  {
    category: "scenes",
    patterns: ["home mode", "i'm home", "arrived home"],
    response: "Welcome home! Normal mode activated.",
    emotion: "happy"
  },
];

export const categoryIndex = new Map<string, KnowledgeItem[]>();

// Build category index for faster lookup
knowledgeBase.forEach(item => {
  if (!categoryIndex.has(item.category)) {
    categoryIndex.set(item.category, []);
  }
  categoryIndex.get(item.category)!.push(item);
});

export function findMatchingKnowledge(query: string): KnowledgeItem | null {
  const lowerQuery = query.toLowerCase().trim();
  
  // First, try exact matches
  for (const item of knowledgeBase) {
    for (const pattern of item.patterns) {
      if (lowerQuery === pattern.toLowerCase()) {
        return item;
      }
    }
  }
  
  // Then try partial matches
  for (const item of knowledgeBase) {
    for (const pattern of item.patterns) {
      if (lowerQuery.includes(pattern.toLowerCase()) || pattern.toLowerCase().includes(lowerQuery)) {
        return item;
      }
    }
  }
  
  return null;
}
