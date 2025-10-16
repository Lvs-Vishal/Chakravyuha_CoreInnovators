import { useState, useEffect } from "react";
import { Wind, Fan, AlertTriangle, Edit2, MapPin, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import Devices from "./Devices";
import emailjs from '@emailjs/browser';

interface SmartDevice {
  id: string;
  name: string;
  location: string;
  status: "on" | "off";
  auto: boolean;
  icon: typeof Wind | typeof Fan;
}

interface SensorData {
  co2_ppm: number | null;
  co_ppm: number | null;
  air_quality_ppm: number | null;
  smoke_ppm: number | null;
  flame_detected: boolean | null;
  motion_detected: boolean | null;
}

const Dashboard = () => {
  const [devices, setDevices] = useState<SmartDevice[]>([
    { id: "1", name: "Air Purifier", location: "Living Room", status: "off", auto: true, icon: Wind },
    { id: "2", name: "Ventilation Fan", location: "Kitchen", status: "off", auto: true, icon: Fan },
  ]);
  
  const [sensorData, setSensorData] = useState<SensorData>({
    co2_ppm: null,
    co_ppm: null,
    air_quality_ppm: null,
    smoke_ppm: null,
    flame_detected: null,
    motion_detected: null,
  });

  const [editingDevice, setEditingDevice] = useState<SmartDevice | null>(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [showDevices, setShowDevices] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState<number>(0);

  // Email cooldown: 3 minutes (180000 ms) between alerts to prevent spam
  const EMAIL_COOLDOWN = 180000; // 3 minutes

  // Auto-refresh Dashboard page only every 3 minutes to reduce email frequency
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      console.log("🔄 Auto-refreshing Dashboard to fetch latest data...");
      window.location.reload();
    }, 180000); // 3 minutes (180 seconds)

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  // Subscribe to real-time sensor data
  useEffect(() => {
    // Fetch initial data from database
    const fetchInitialData = async () => {
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

    fetchInitialData();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('sensor-updates')
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

  // Monitor gas levels and send email alerts (devices stay OFF)
  useEffect(() => {
    // Skip if sensor data is not available yet
    if (sensorData.co2_ppm === null || sensorData.co_ppm === null || 
        sensorData.air_quality_ppm === null || sensorData.smoke_ppm === null) {
      return;
    }

    // Check if gas levels are high or critically low
    const isHighCO2 = sensorData.co2_ppm !== null && sensorData.co2_ppm > 1000;
    const isHighCO = sensorData.co_ppm !== null && sensorData.co_ppm > 9;
    const isHighAirQuality = sensorData.air_quality_ppm !== null && sensorData.air_quality_ppm > 75;
    const isHighSmoke = sensorData.smoke_ppm !== null && sensorData.smoke_ppm > 150;
    const isFlameDetected = sensorData.flame_detected === true;
    
    const isLowCO2 = sensorData.co2_ppm !== null && sensorData.co2_ppm < 300;
    const isLowCO = sensorData.co_ppm !== null && sensorData.co_ppm < 1;

    if (isHighCO2 || isHighCO || isHighAirQuality || isHighSmoke || isFlameDetected || isLowCO2 || isLowCO) {
      // Check cooldown to prevent email spam (max 1 email per 3 minutes)
      const currentTime = Date.now();
      const timeSinceLastAlert = currentTime - lastAlertTime;
      
      if (timeSinceLastAlert < EMAIL_COOLDOWN) {
        // Still in cooldown period - show toast but don't send email
        const remainingTime = Math.ceil((EMAIL_COOLDOWN - timeSinceLastAlert) / 1000 / 60);
        console.log(`⏳ Email cooldown active. Next email in ${remainingTime} minute(s)`);
        
        toast.warning(
          `Gas level alert detected!`,
          {
            icon: <AlertTriangle className="w-4 h-4" />,
            description: `Email cooldown active. Next alert in ${remainingTime} min`,
            duration: 5000,
          }
        );
        return; // Don't send email yet
      }
      
      // Get user email from localStorage
      const userEmail = localStorage.getItem('userEmail') || 'durai@innovators.com';
      
      // Build alert message
      let alertMessages: string[] = [];
      if (isHighCO2) alertMessages.push(`⚠️ High CO2: ${sensorData.co2_ppm} PPM`);
      if (isHighCO) alertMessages.push(`⚠️ High CO: ${sensorData.co_ppm} PPM`);
      if (isHighAirQuality) alertMessages.push(`⚠️ High Air Quality: ${sensorData.air_quality_ppm} PPM`);
      if (isHighSmoke) alertMessages.push(`⚠️ High Smoke: ${sensorData.smoke_ppm} PPM`);
      if (isFlameDetected) alertMessages.push(`🔥 FLAME DETECTED!`);
      if (isLowCO2) alertMessages.push(`⬇️ Low CO2: ${sensorData.co2_ppm} PPM`);
      if (isLowCO) alertMessages.push(`⬇️ Low CO: ${sensorData.co_ppm} PPM`);

      // Send email notification
      sendEmailNotification(userEmail, alertMessages.join('\n'));
      
      // Update last alert time
      setLastAlertTime(currentTime);
      
      // Show toast notification
      toast.error(
        `Gas level alert! Email sent to ${userEmail}`,
        {
          icon: <AlertTriangle className="w-4 h-4" />,
          description: alertMessages.join(' | '),
          duration: 8000,
        }
      );
    }
  }, [sensorData]);

  // Function to send email notification using EmailJS
  const sendEmailNotification = async (email: string, message: string) => {
    const subject = 'CORE Innovators - Gas Level Alert';
    const timestamp = new Date().toLocaleString();
    
    // EmailJS Configuration
    const EMAILJS_SERVICE_ID = 'service_t50h7hw';
    const EMAILJS_TEMPLATE_ID = 'template_gjzs6a5';
    const EMAILJS_PUBLIC_KEY = 'SoJkrURdQNwAgaeg4';
    
    // Store the alert in localStorage for later retrieval
    const alerts = JSON.parse(localStorage.getItem('gasAlerts') || '[]');
    alerts.push({
      timestamp: new Date().toISOString(),
      email,
      message,
      sensors: {
        co2: sensorData.co2_ppm,
        co: sensorData.co_ppm,
        airQuality: sensorData.air_quality_ppm,
        smoke: sensorData.smoke_ppm,
        flame: sensorData.flame_detected,
      }
    });
    localStorage.setItem('gasAlerts', JSON.stringify(alerts.slice(-50))); // Keep last 50 alerts
    
    try {
      // Send email using EmailJS
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          subject: subject,
          message: message,
          timestamp: timestamp,
          co2_level: sensorData.co2_ppm,
          co_level: sensorData.co_ppm,
          air_quality: sensorData.air_quality_ppm,
          smoke_level: sensorData.smoke_ppm,
          flame_status: sensorData.flame_detected ? 'DETECTED' : 'Not detected',
        },
        EMAILJS_PUBLIC_KEY
      );
      
      console.log('✅ Email sent successfully via EmailJS!', response);
      
      toast.success('Email alert sent successfully!', {
        description: `Alert sent to ${email}`,
        duration: 5000,
      });
      
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      
      toast.error('Failed to send email alert', {
        description: 'Email service error. Check console for details.',
        duration: 5000,
      });
    }
  };

  const toggleDevice = (id: string, forceStatus?: boolean) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: forceStatus !== undefined ? (forceStatus ? "on" : "off") : (d.status === "on" ? "off" : "on") }
          : d
      )
    );
  };

  const toggleAuto = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, auto: !d.auto } : d))
    );
    const device = devices.find((d) => d.id === id);
    toast.info(`${device?.name} auto-mode ${device?.auto ? "disabled" : "enabled"}`);
  };

  const openEditDialog = (device: SmartDevice) => {
    setEditingDevice(device);
    setEditName(device.name);
    setEditLocation(device.location);
  };

  const saveDeviceEdit = () => {
    if (!editingDevice) return;
    
    setDevices((prev) =>
      prev.map((d) =>
        d.id === editingDevice.id
          ? { ...d, name: editName, location: editLocation }
          : d
      )
    );
    toast.success("Device updated successfully");
    setEditingDevice(null);
  };

  const getSensorStatus = (value: number | null, thresholds: { warning: number; critical: number }) => {
    if (value === null) return { status: "no-data", color: "text-muted-foreground" };
    if (value > thresholds.critical) return { status: "critical", color: "text-destructive" };
    if (value > thresholds.warning) return { status: "warning", color: "text-warning" };
    return { status: "safe", color: "text-accent" };
  };

  const sensors = [
    { name: "CO₂", value: sensorData.co2_ppm, unit: "ppm", thresholds: { warning: 800, critical: 1000 } },
    { name: "CO", value: sensorData.co_ppm, unit: "ppm", thresholds: { warning: 9, critical: 35 } },
    { name: "Air Quality", value: sensorData.air_quality_ppm, unit: "ppm", thresholds: { warning: 35, critical: 75 } },
    { name: "Smoke", value: sensorData.smoke_ppm, unit: "ppm", thresholds: { warning: 300, critical: 800 } },
    { name: "Flame", value: sensorData.flame_detected === null ? null : (sensorData.flame_detected ? 1 : 0), unit: "", thresholds: { warning: 0.5, critical: 0.9 } },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Devices Button */}
      <div className="glass-panel-strong p-6 rounded-2xl border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              Smart Air Control
            </h1>
            <p className="text-muted-foreground">AI-powered environmental management</p>
          </div>
          <Dialog open={showDevices} onOpenChange={setShowDevices}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="glass-panel border-primary/50 hover:bg-primary/10">
                <Cpu className="w-4 h-4 mr-2" />
                Devices
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel-strong border-border/50 max-w-6xl max-h-[90vh] overflow-y-auto">
              <Devices />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sensors.map((sensor) => {
          const status = getSensorStatus(sensor.value, sensor.thresholds);
          return (
            <Card
              key={sensor.name}
              className={`glass-panel p-4 border-border/50 transition-all duration-500 hover:scale-105 ${
                status.status === "critical" ? "crimson-shadow" : 
                status.status === "warning" ? "animate-pulse-glow" : 
                status.status === "no-data" ? "opacity-60" :
                "emerald-shadow"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">{sensor.name}</p>
              <p className={`text-2xl font-bold ${status.color}`}>
                {sensor.value !== null ? (
                  <>
                    {sensor.value}
                    <span className="text-xs ml-1">{sensor.unit}</span>
                  </>
                ) : (
                  <span className="text-sm">No Data</span>
                )}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Smart Devices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => {
          const Icon = device.icon;
          return (
            <Card
              key={device.id}
              className={`glass-panel-strong p-6 border-border/50 transition-all duration-500 hover:cyan-shadow ${
                device.status === "on" ? "animate-shimmer" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      device.status === "on"
                        ? "bg-primary/20 animate-pulse-glow"
                        : "bg-muted/20"
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        device.status === "on" ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{device.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {device.location}
                    </p>
                  </div>
                </div>
                <Dialog open={editingDevice?.id === device.id} onOpenChange={(open) => !open && setEditingDevice(null)}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(device)}
                      className="hover:bg-primary/10"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass-panel-strong border-border/50">
                    <DialogHeader>
                      <DialogTitle>Edit Device</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="name">Device Name</Label>
                        <Input
                          id="name"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="glass-panel border-border/50 mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={editLocation}
                          onChange={(e) => setEditLocation(e.target.value)}
                          className="glass-panel border-border/50 mt-1"
                        />
                      </div>
                      <Button onClick={saveDeviceEdit} className="w-full">
                        Save Changes
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
                  <span className="font-medium">Power</span>
                  <Switch
                    checked={device.status === "on"}
                    onCheckedChange={() => toggleDevice(device.id)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 glass-panel rounded-xl">
                  <div>
                    <span className="font-medium">Auto Mode</span>
                    <p className="text-xs text-muted-foreground">Responds to air quality</p>
                  </div>
                  <Switch checked={device.auto} onCheckedChange={() => toggleAuto(device.id)} />
                </div>

                <div className="p-4 glass-panel rounded-xl border border-primary/30">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className={`font-bold ${device.status === "on" ? "text-primary" : "text-muted-foreground"}`}>
                    {device.status === "on" ? "● ACTIVE" : "○ STANDBY"}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
