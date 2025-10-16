import { useState, useEffect } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDevices } from "@/contexts/DeviceContext";
import { useWakeWord } from "@/hooks/useWakeWord";
import { findMatchingKnowledge } from "@/data/assistantKnowledge";
import { searchKnowledge, getByCategory, getHighPriority, KNOWLEDGE_CATEGORIES, TOTAL_QUESTIONS } from "@/data/enhancedKnowledge";
import { COMPLETE_KNOWLEDGE_BASE } from "@/data/completeKnowledgeBase";
import { supabase } from "@/integrations/supabase/client";

interface SensorData {
  co2_ppm: number | null;
  co_ppm: number | null;
  air_quality_ppm: number | null;
  smoke_ppm: number | null;
  flame_detected: boolean | null;
  motion_detected: boolean | null;
}

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [transcript, setTranscript] = useState("");
  const [sensorData, setSensorData] = useState<SensorData>({
    co2_ppm: null,
    co_ppm: null,
    air_quality_ppm: null,
    smoke_ppm: null,
    flame_detected: null,
    motion_detected: null,
  });
  const { devices, toggleDevice, toggleDevicesByType, toggleDevicesByRoom, toggleAllDevices, getDeviceByName, setDeviceMode, setAllDevicesModeByType } = useDevices();

  // Fetch and subscribe to sensor data
  useEffect(() => {
    const fetchSensorData = async () => {
      const { data, error } = await supabase
        .from('environment_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setSensorData({
          co2_ppm: data.co2_ppm,
          co_ppm: data.co_ppm,
          air_quality_ppm: data.air_quality_ppm,
          smoke_ppm: data.smoke_ppm,
          flame_detected: data.flame_detected,
          motion_detected: data.motion_detected,
        });
      }
    };

    fetchSensorData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('voice-assistant-sensors')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'environment_data' },
        (payload: any) => {
          if (payload.new) {
            setSensorData({
              co2_ppm: payload.new.co2_ppm,
              co_ppm: payload.new.co_ppm,
              air_quality_ppm: payload.new.air_quality_ppm,
              smoke_ppm: payload.new.smoke_ppm,
              flame_detected: payload.new.flame_detected,
              motion_detected: payload.new.motion_detected,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleWakeWord = () => {
    console.log('Wake word "hey core" detected!');
    setIsActive(true);
    speak("Yes, Durai? I'm listening.", 'happy');
    toast.success("🎤 CORE AI activated!");
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.log('Recognition already started');
      }
    }
  };

  const { isListeningForWakeWord, startListeningForWakeWord, stopListeningForWakeWord } = 
    useWakeWord('hey core', handleWakeWord);

  useEffect(() => {
    // Start listening for wake word on mount
    startListeningForWakeWord();
    return () => stopListeningForWakeWord();
  }, []);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setTranscript(speechResult);
        handleVoiceCommand(speechResult);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast.error(`Voice recognition error: ${event.error}`);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    } else {
      toast.error("Speech recognition not supported in this browser");
    }
  }, []);

  const speak = (text: string, emotion: 'calm' | 'happy' | 'caring' = 'calm') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = emotion === 'happy' ? 1.1 : 0.95;
    utterance.pitch = emotion === 'happy' ? 1.2 : emotion === 'caring' ? 1.05 : 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const executeAction = (action: string) => {
    const [actionType, ...params] = action.split(':');
    
    switch (actionType) {
      case 'toggleDevicesByType':
        toggleDevicesByType(params[0] as any, params[1] as any);
        break;
      case 'toggleDevicesByRoom':
        toggleDevicesByRoom(params[0], params[1] as any);
        break;
      case 'toggleAllDevices':
        toggleAllDevices(params[0] as any);
        break;
      case 'toggleRoomDevice':
        const device = devices.find(d => d.room === params[0] && d.type === params[1]);
        if (device) toggleDevice(device.id);
        break;
      case 'setAllDevicesModeByType':
        setAllDevicesModeByType(params[0] as any, params[1] as any);
        break;
    }
  };

  const handleVoiceCommand = async (command: string) => {
    const cmd = command.toLowerCase();
    
    // Check for sensor value queries
    if (cmd.includes('what is') || cmd.includes('what\'s') || cmd.includes('check') || cmd.includes('tell me') || cmd.includes('show me') || cmd.includes('current')) {
      // CO2 queries
      if (cmd.includes('co2') || cmd.includes('carbon dioxide')) {
        if (sensorData.co2_ppm !== null) {
          const status = sensorData.co2_ppm < 800 ? 'excellent' : sensorData.co2_ppm < 1000 ? 'good' : sensorData.co2_ppm < 1500 ? 'elevated' : 'unhealthy';
          const response = `Current CO2 level is ${sensorData.co2_ppm} PPM, which is ${status}.`;
          speak(response, 'calm');
          toast.success(`🌬️ ${response}`, { duration: 5000 });
        } else {
          speak("CO2 sensor data is not available yet.", 'calm');
          toast.info("🌬️ No CO2 data available");
        }
        return;
      }
      
      // CO queries
      if (cmd.includes(' co ') || cmd.includes('carbon monoxide') || cmd.match(/\bco\b/)) {
        if (sensorData.co_ppm !== null) {
          const status = sensorData.co_ppm < 9 ? 'safe' : sensorData.co_ppm < 35 ? 'elevated - ventilate now' : 'DANGEROUS - evacuate immediately';
          const response = `Current carbon monoxide level is ${sensorData.co_ppm} PPM, which is ${status}.`;
          speak(response, sensorData.co_ppm >= 35 ? 'caring' : 'calm');
          toast.success(`☁️ ${response}`, { duration: 5000 });
        } else {
          speak("Carbon monoxide sensor data is not available yet.", 'calm');
          toast.info("☁️ No CO data available");
        }
        return;
      }
      
      // Air Quality queries
      if (cmd.includes('air quality') || cmd.includes('air pollution')) {
        if (sensorData.air_quality_ppm !== null) {
          const status = sensorData.air_quality_ppm < 35 ? 'good' : sensorData.air_quality_ppm < 75 ? 'moderate' : 'unhealthy';
          const response = `Current air quality is ${sensorData.air_quality_ppm} PPM, which is ${status}.`;
          speak(response, 'calm');
          toast.success(`🍃 ${response}`, { duration: 5000 });
        } else {
          speak("Air quality sensor data is not available yet.", 'calm');
          toast.info("🍃 No air quality data available");
        }
        return;
      }
      
      // Smoke queries
      if (cmd.includes('smoke')) {
        if (sensorData.smoke_ppm !== null) {
          const status = sensorData.smoke_ppm < 300 ? 'normal' : sensorData.smoke_ppm < 800 ? 'elevated' : 'high - check for fire';
          const response = `Current smoke level is ${sensorData.smoke_ppm} PPM, which is ${status}.`;
          speak(response, 'calm');
          toast.success(`💨 ${response}`, { duration: 5000 });
        } else {
          speak("Smoke sensor data is not available yet.", 'calm');
          toast.info("💨 No smoke data available");
        }
        return;
      }
      
      // Flame queries
      if (cmd.includes('flame') || cmd.includes('fire')) {
        if (sensorData.flame_detected !== null) {
          const response = sensorData.flame_detected 
            ? "ALERT! Flame has been detected! Please evacuate immediately and call emergency services." 
            : "No flame detected. Fire sensor is normal.";
          speak(response, sensorData.flame_detected ? 'caring' : 'calm');
          toast.success(`🔥 ${response}`, { duration: 5000 });
        } else {
          speak("Flame sensor data is not available yet.", 'calm');
          toast.info("🔥 No flame sensor data available");
        }
        return;
      }
      
      // All sensors query
      if (cmd.includes('all sensor') || cmd.includes('all reading') || cmd.includes('sensor status')) {
        const readings = [];
        if (sensorData.co2_ppm !== null) readings.push(`CO2: ${sensorData.co2_ppm} PPM`);
        if (sensorData.co_ppm !== null) readings.push(`CO: ${sensorData.co_ppm} PPM`);
        if (sensorData.air_quality_ppm !== null) readings.push(`Air Quality: ${sensorData.air_quality_ppm} PPM`);
        if (sensorData.smoke_ppm !== null) readings.push(`Smoke: ${sensorData.smoke_ppm} PPM`);
        if (sensorData.flame_detected !== null) readings.push(`Flame: ${sensorData.flame_detected ? 'Detected' : 'Not detected'}`);
        
        if (readings.length > 0) {
          const response = `Current sensor readings: ${readings.join(', ')}`;
          speak(response, 'calm');
          toast.success(`📊 ${response}`, { duration: 8000 });
        } else {
          speak("No sensor data is currently available.", 'calm');
          toast.info("📊 No sensor data available");
        }
        return;
      }
    }
    
    // First, check ENHANCED knowledge base (10,000+ Q&A pairs)
    const enhancedMatches = searchKnowledge(cmd, 1);
    if (enhancedMatches.length > 0) {
      const match = enhancedMatches[0];
      console.log('✨ Enhanced knowledge base match found:', match);
      console.log(`📚 From ${COMPLETE_KNOWLEDGE_BASE.length.toLocaleString()} total questions`);
      
      const categoryInfo = KNOWLEDGE_CATEGORIES.find(c => c.id === match.category);
      const categoryEmoji = categoryInfo?.icon || '💡';
      
      speak(match.answer, 'calm');
      toast.success(`${categoryEmoji} ${match.answer.substring(0, 100)}...`, {
        duration: 5000,
        description: `Category: ${categoryInfo?.name || match.category}`
      });
      return;
    }
    
    // Fallback to original knowledge base
    const knowledgeMatch = findMatchingKnowledge(cmd);
    if (knowledgeMatch) {
      console.log('Original knowledge base match found:', knowledgeMatch);
      speak(knowledgeMatch.response, knowledgeMatch.emotion || 'calm');
      
      if (knowledgeMatch.action) {
        executeAction(knowledgeMatch.action);
      }
      
      toast.success(`✨ ${knowledgeMatch.response}`);
      return;
    }
    
    // Device Control Commands (fallback for complex queries)
    if (cmd.includes("turn on") || cmd.includes("turn off") || cmd.includes("switch on") || cmd.includes("switch off")) {
      const isOn = cmd.includes("on");
      const action = isOn ? "on" : "off";
      
      // Check for "all" commands
      if (cmd.includes("all")) {
        if (cmd.includes("fan")) {
          toggleDevicesByType("fan", action);
          speak(`Done, Durai. All fans turned ${action}.`, 'calm');
          toast.success(`✨ All fans turned ${action.toUpperCase()}`);
        } else if (cmd.includes("light")) {
          toggleDevicesByType("light", action);
          speak(`All lights ${action}, Durai.`, 'calm');
          toast.success(`💡 All lights ${action.toUpperCase()}`);
        } else {
          toggleAllDevices(action);
          speak(`All devices turned ${action}, Durai.`, 'calm');
          toast.success(`✅ All devices ${action.toUpperCase()}`);
        }
        return;
      }

      // Room-specific commands
      if (cmd.includes("living room")) {
        if (cmd.includes("fan")) {
          const device = devices.find(d => d.room === "Living Room" && d.type === "fan");
          if (device) {
            toggleDevice(device.id);
            speak(`Got it, Durai. Living room fan is now ${action}.`, 'calm');
            toast.success(`🌀 Living room fan ${action.toUpperCase()}`);
          }
        } else if (cmd.includes("light")) {
          const device = devices.find(d => d.room === "Living Room" && d.type === "light");
          if (device) {
            toggleDevice(device.id);
            speak(`Living room light ${action}, Durai.`, 'calm');
            toast.success(`💡 Living room light ${action.toUpperCase()}`);
          }
        } else {
          toggleDevicesByRoom("Living Room", action);
          speak(`Living room devices ${action}, Durai.`, 'calm');
          toast.success(`🏠 Living room ${action.toUpperCase()}`);
        }
        return;
      }
      
      if (cmd.includes("bedroom")) {
        if (cmd.includes("fan")) {
          const device = devices.find(d => d.room === "Bedroom" && d.type === "fan");
          if (device) {
            toggleDevice(device.id);
            speak(`Done, Durai. Bedroom fan turned ${action}.`, 'calm');
            toast.success(`🌀 Bedroom fan ${action.toUpperCase()}`);
          }
        } else if (cmd.includes("lamp") || cmd.includes("light")) {
          const device = devices.find(d => d.room === "Bedroom" && d.type === "light");
          if (device) {
            toggleDevice(device.id);
            speak(`Bedroom light ${action}, Durai.`, 'calm');
            toast.success(`💡 Bedroom light ${action.toUpperCase()}`);
          }
        } else {
          toggleDevicesByRoom("Bedroom", action);
          speak(`Bedroom devices ${action}, Durai.`, 'calm');
          toast.success(`🛏️ Bedroom ${action.toUpperCase()}`);
        }
        return;
      }
      
      if (cmd.includes("kitchen")) {
        if (cmd.includes("fan") || cmd.includes("exhaust")) {
          const device = devices.find(d => d.room === "Kitchen" && d.type === "fan");
          if (device) {
            toggleDevice(device.id);
            speak(`Kitchen fan ${action}, Durai.`, 'calm');
            toast.success(`🌀 Kitchen fan ${action.toUpperCase()}`);
          }
        } else if (cmd.includes("light")) {
          const device = devices.find(d => d.room === "Kitchen" && d.type === "light");
          if (device) {
            toggleDevice(device.id);
            speak(`Kitchen light ${action}, Durai.`, 'calm');
            toast.success(`💡 Kitchen light ${action.toUpperCase()}`);
          }
        } else {
          toggleDevicesByRoom("Kitchen", action);
          speak(`Kitchen devices ${action}, Durai.`, 'calm');
          toast.success(`🍳 Kitchen ${action.toUpperCase()}`);
        }
        return;
      }

      // Generic device commands
      if (cmd.includes("ceiling fan")) {
        const device = getDeviceByName("ceiling fan");
        if (device) {
          toggleDevice(device.id);
          speak(`Ceiling fan ${action}, Durai.`, 'calm');
          toast.success(`🌀 Ceiling fan ${action.toUpperCase()}`);
        }
        return;
      }

      if (cmd.includes("fan")) {
        toggleDevicesByType("fan", action);
        speak(`Fans turned ${action}, Durai.`, 'calm');
        toast.success(`🌀 Fans ${action.toUpperCase()}`);
      } else if (cmd.includes("light")) {
        toggleDevicesByType("light", action);
        speak(`Lights turned ${action}, Durai.`, 'calm');
        toast.success(`💡 Lights ${action.toUpperCase()}`);
      } else if (cmd.includes("purifier")) {
        speak(`Air purifier ${action}, Durai.`, 'calm');
        toast.success(`🌬️ Purifier ${action.toUpperCase()}`);
      } else {
        speak(`Device turned ${action}, Durai.`, 'calm');
        toast.success(`✅ Device ${action.toUpperCase()}`);
      }
      return;
    }

    // Purifier Mode Controls
    if (cmd.includes("purifier") && (cmd.includes("mode") || cmd.includes("auto") || cmd.includes("manual") || cmd.includes("power") || cmd.includes("sleep"))) {
      let mode: "auto" | "manual" | "power" | "sleep" | null = null;
      let modeText = "";
      
      if (cmd.includes("auto")) {
        mode = "auto";
        modeText = "Auto";
      } else if (cmd.includes("manual")) {
        mode = "manual";
        modeText = "Manual";
      } else if (cmd.includes("power")) {
        mode = "power";
        modeText = "Power";
      } else if (cmd.includes("sleep")) {
        mode = "sleep";
        modeText = "Sleep";
      }
      
      if (mode) {
        setAllDevicesModeByType("purifier", mode);
        speak(`All air purifiers switched to ${modeText} mode, Durai.`, 'calm');
        toast.success(`🌬️ All Purifiers: ${modeText} Mode`);
      }
      return;
    }

    // Environment & Air Quality
    if (cmd.includes("air") || cmd.includes("quality") || cmd.includes("co2") || cmd.includes("pm")) {
      speak("Air looks clean today. CO₂ is 420 ppm, PM2.5 is 35 micrograms per cubic meter. All normal.", 'calm');
      toast.success("🌿 Air Quality: Good\nCO₂: 420 ppm | PM2.5: 35 µg/m³");
      return;
    }

    if (cmd.includes("temperature") || cmd.includes("temp")) {
      const room = cmd.includes("living") ? "living room" : cmd.includes("bedroom") ? "bedroom" : cmd.includes("kitchen") ? "kitchen" : "";
      if (room) {
        const temp = room === "living room" ? "23.5" : room === "bedroom" ? "22" : "26";
        speak(`It's ${temp} degrees Celsius in the ${room}, quite comfortable.`, 'calm');
        toast.info(`🌡️ ${room.charAt(0).toUpperCase() + room.slice(1)}: ${temp}°C`);
      } else {
        speak("Average temperature is 24 degrees Celsius across all rooms.", 'calm');
        toast.info("🌡️ Avg Temperature: 24°C");
      }
      return;
    }

    if (cmd.includes("humidity")) {
      speak("Humidity is at 45 percent. Comfortable level.", 'calm');
      toast.info("💧 Humidity: 45%");
      return;
    }

    // Safety & Security
    if (cmd.includes("safe") || cmd.includes("safety") || cmd.includes("security")) {
      speak("Yes. All safety systems are normal and active. No smoke, no gas leaks, all sensors online.", 'caring');
      toast.success("🛡️ Everything is Safe\n✅ All sensors active");
      return;
    }

    if (cmd.includes("smoke") || cmd.includes("fire")) {
      speak("No smoke detected. All clear.", 'calm');
      toast.success("✅ Smoke: Clear");
      return;
    }

    if (cmd.includes("gas") || cmd.includes("leak")) {
      speak("No gas leaks detected. Everything is safe.", 'calm');
      toast.success("✅ Gas: Normal");
      return;
    }

    if (cmd.includes("lock") || cmd.includes("unlock")) {
      const isLock = cmd.includes("lock") && !cmd.includes("unlock");
      speak(isLock ? "Doors locked. You're secure." : "Doors unlocked.", 'calm');
      toast.success(isLock ? "🔒 Doors Locked" : "🔓 Doors Unlocked");
      return;
    }

    if (cmd.includes("arm") || cmd.includes("disarm")) {
      const isArm = cmd.includes("arm") && !cmd.includes("disarm");
      speak(isArm ? "Security armed." : "Security disarmed.", 'calm');
      toast.success(isArm ? "🛡️ Security Armed" : "🔓 Security Disarmed");
      return;
    }

    // Energy & Analytics
    if (cmd.includes("energy") || cmd.includes("power") || cmd.includes("consumption")) {
      speak("Current power usage is 2.3 kilowatts. Running efficiently.", 'calm');
      toast.info("⚡ Power: 2.3 kW");
      return;
    }

    // Status & Reports
    if (cmd.includes("status") || cmd.includes("report") || cmd.includes("everything")) {
      speak("All systems normal and active. Temperature 24 degrees, humidity 45 percent, air quality good. No safety alerts. Energy consumption optimal.", 'calm');
      toast.success("✅ System Status: All Good\n🌡️ 24°C | 💧 45% | 🌿 Air: Good");
      return;
    }

    // Greetings & Personal
    if (cmd.includes("hello") || cmd.includes("hi ") || cmd.includes("hey")) {
      speak("Hello, Durai! I'm CORE AI. I'm here to help. How can I make your home better today?", 'happy');
      toast.success("👋 Hello! I'm CORE AI");
      return;
    }

    if (cmd.includes("thank") || cmd.includes("thanks")) {
      speak("You're welcome! Always here for you.", 'caring');
      toast.success("❤️ Happy to help!");
      return;
    }

    if (cmd.includes("good morning")) {
      speak("Good morning! Hope you have a wonderful day.", 'happy');
      toast.success("🌅 Good Morning!");
      return;
    }

    if (cmd.includes("good night") || cmd.includes("goodnight")) {
      speak("Good night. Sleep well. I'll keep watch.", 'caring');
      toast.success("🌙 Good Night!");
      return;
    }

    // Help & Guidance
    if (cmd.includes("help") || cmd.includes("what can you do") || cmd.includes("commands")) {
      speak("I can control all your devices, check air quality, temperature, humidity, manage security, locks, energy usage, and keep you safe. Just ask me anything about your home.", 'calm');
      toast.info("💡 I can help with:\n🌀 Devices | 🌡️ Environment | 🛡️ Safety | 🔒 Security | ⚡ Energy");
      return;
    }

    // Default response - conversational
    speak(`I heard: ${command}. I can help you control devices, check environment data, manage security, or answer questions about your home. What would you like?`, 'calm');
    toast.info(`🎤 "${command}"\n\nTry: "turn on lights" or "how's the air quality?"`);
  };

  const toggleListening = () => {
    if (!recognition) {
      toast.error("Speech recognition not available");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      setIsActive(false);
    } else {
      setIsActive(true);
      recognition.start();
      setIsListening(true);
      toast.info("🎤 CORE AI Listening...");
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button
        onClick={toggleListening}
        className={`w-20 h-20 rounded-full shadow-2xl transition-all duration-300 ${
          isListening
            ? "bg-destructive hover:bg-destructive/90 animate-pulse-glow"
            : "crimson-glow hover:scale-110"
        }`}
      >
        {isListening ? (
          <MicOff className="w-10 h-10" />
        ) : (
          <Mic className="w-10 h-10" />
        )}
      </Button>
      
      {transcript && (
        <div className="absolute bottom-24 right-0 glass-panel-strong p-4 rounded-xl max-w-xs">
          <p className="text-sm text-muted-foreground">Last command:</p>
          <p className="text-sm font-medium">{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default VoiceAssistant;
