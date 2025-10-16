import { Wind, Flame, AlertTriangle, Cloud } from "lucide-react";
import { SensorTile } from "./SensorTile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SensorPanelProps {
  roomId: string;
  roomName: string;
}

interface SensorData {
  air_quality_ppm: number | null;
  co_ppm: number | null;
  co2_ppm: number | null;
  smoke_ppm: number | null;
  flame_detected: boolean | null;
  motion_detected: boolean | null;
}

export const SensorPanel = ({ roomId, roomName }: SensorPanelProps) => {
  const [sensorData, setSensorData] = useState<SensorData>({
    air_quality_ppm: null,
    co_ppm: null,
    co2_ppm: null,
    smoke_ppm: null,
    flame_detected: null,
    motion_detected: null,
  });

  const [alertShown, setAlertShown] = useState<Set<string>>(new Set());

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
          air_quality_ppm: data.air_quality_ppm,
          co_ppm: data.co_ppm,
          co2_ppm: data.co2_ppm,
          smoke_ppm: data.smoke_ppm,
          flame_detected: data.flame_detected,
          motion_detected: data.motion_detected,
        });
      }
    };

    fetchInitialData();

    // Subscribe to real-time sensor updates
    const channel = supabase
      .channel(`sensor-updates-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "environment_data",
        },
        (payload: any) => {
          console.log("Sensor update:", payload);
          if (payload.new) {
            // Update sensor data from database
            const newData = payload.new;
            setSensorData({
              air_quality_ppm: newData.air_quality_ppm,
              co_ppm: newData.co_ppm,
              co2_ppm: newData.co2_ppm,
              smoke_ppm: newData.smoke_ppm,
              flame_detected: newData.flame_detected,
              motion_detected: newData.motion_detected,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  // Alert logic
  useEffect(() => {
    // Skip alerts if sensor data is not available yet
    if (sensorData.air_quality_ppm === null || sensorData.co_ppm === null || 
        sensorData.co2_ppm === null || sensorData.smoke_ppm === null) {
      return;
    }

    const checkThresholds = () => {
      const alerts: Array<{ sensor: string; level: string; message: string }> = [];

      if (sensorData.air_quality_ppm !== null && sensorData.air_quality_ppm > 75) {
        alerts.push({
          sensor: "Air Quality",
          level: "critical",
          message: `🚨 CRITICAL: Air quality hazardous in ${roomName} — ${sensorData.air_quality_ppm.toFixed(
            1
          )} PPM. Ventilate immediately.`,
        });
      } else if (sensorData.air_quality_ppm !== null && sensorData.air_quality_ppm > 35) {
        alerts.push({
          sensor: "Air Quality",
          level: "warning",
          message: `⚠️ Air quality elevated in ${roomName} — ${sensorData.air_quality_ppm.toFixed(
            1
          )} PPM. Ventilate or let AI optimize.`,
        });
      }

      if (sensorData.co_ppm !== null && sensorData.co_ppm > 35) {
        alerts.push({
          sensor: "CO",
          level: "critical",
          message: `🚨 CRITICAL: Carbon Monoxide detected in ${roomName} — ${sensorData.co_ppm.toFixed(
            1
          )} PPM. Evacuate, open windows, call emergency services.`,
        });
      } else if (sensorData.co_ppm !== null && sensorData.co_ppm > 9) {
        alerts.push({
          sensor: "CO",
          level: "warning",
          message: `⚠️ CO levels elevated in ${roomName} — ${sensorData.co_ppm.toFixed(1)} PPM. Check ventilation.`,
        });
      }

      if (sensorData.co2_ppm !== null && sensorData.co2_ppm > 1000) {
        alerts.push({
          sensor: "CO₂",
          level: "critical",
          message: `🚨 CRITICAL: CO₂ levels dangerous in ${roomName} — ${sensorData.co2_ppm.toFixed(0)} PPM.`,
        });
      } else if (sensorData.co2_ppm !== null && sensorData.co2_ppm > 800) {
        alerts.push({
          sensor: "CO₂",
          level: "warning",
          message: `⚠️ CO₂ elevated in ${roomName} — ${sensorData.co2_ppm.toFixed(0)} PPM. Increase ventilation.`,
        });
      }

      if (sensorData.smoke_ppm !== null && sensorData.smoke_ppm > 800) {
        alerts.push({
          sensor: "Smoke",
          level: "critical",
          message: `🚨 CRITICAL: Smoke detected in ${roomName}. Check for fire immediately.`,
        });
      } else if (sensorData.smoke_ppm !== null && sensorData.smoke_ppm > 300) {
        alerts.push({
          sensor: "Smoke",
          level: "warning",
          message: `⚠️ Smoke levels elevated in ${roomName}. Investigate source.`,
        });
      }

      if (sensorData.flame_detected === true) {
        alerts.push({
          sensor: "Flame",
          level: "critical",
          message: `🚨 CRITICAL: Flame detected in ${roomName}! Call emergency services immediately.`,
        });
      }

      // Show alerts (with debounce to avoid spam)
      alerts.forEach((alert) => {
        const alertKey = `${roomId}-${alert.sensor}-${alert.level}`;
        if (!alertShown.has(alertKey)) {
          if (alert.level === "critical") {
            toast.error(alert.message, {
              duration: 10000,
              action: {
                label: "Auto-Optimize",
                onClick: () => handleOptimize(),
              },
            });
          } else {
            toast.warning(alert.message, {
              duration: 5000,
            });
          }
          setAlertShown((prev) => new Set([...prev, alertKey]));

          // Clear alert key after 5 minutes to allow re-triggering
          setTimeout(() => {
            setAlertShown((prev) => {
              const newSet = new Set(prev);
              newSet.delete(alertKey);
              return newSet;
            });
          }, 300000);
        }
      });
    };

    const timeoutId = setTimeout(checkThresholds, 10000); // 10s debounce
    return () => clearTimeout(timeoutId);
  }, [sensorData, roomId, roomName, alertShown]);

  const handleOptimize = async () => {
    try {
      toast.info(`AI optimizing ${roomName} air quality...`);
      // Call AI optimization endpoint (to be implemented)
      // await supabase.functions.invoke('ai-optimize', {
      //   body: { roomId, sensors: sensorData }
      // });
    } catch (error) {
      console.error("Optimization error:", error);
    }
  };

  const getAQI = (airQualityPpm: number) => {
    if (airQualityPpm <= 12) return { value: Math.round((50 / 12) * airQualityPpm), label: "Good" };
    if (airQualityPpm <= 35.4) return { value: Math.round(50 + ((100 - 50) / (35.4 - 12)) * (airQualityPpm - 12)), label: "Moderate" };
    if (airQualityPpm <= 55.4) return { value: Math.round(100 + ((150 - 100) / (55.4 - 35.4)) * (airQualityPpm - 35.4)), label: "Unhealthy" };
    return { value: 150, label: "Hazardous" };
  };

  const aqi = getAQI(sensorData.air_quality_ppm);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Wind className="w-4 h-4" />
        <p className="text-sm font-medium text-muted-foreground">Air & Gas Monitoring</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <SensorTile
          name="Air Quality"
          value={sensorData.air_quality_ppm}
          unit="PPM"
          icon={Cloud}
          warningThreshold={36}
          criticalThreshold={75}
          maxRange={100}
          link="/environment#airquality"
          badge={`AQI ${aqi.value}`}
        />
        <SensorTile
          name="Smoke"
          value={sensorData.smoke_ppm}
          unit="PPM"
          icon={Flame}
          warningThreshold={300}
          criticalThreshold={800}
          maxRange={1000}
          link="/devices#smoke"
        />
        <SensorTile
          name="CO₂"
          value={sensorData.co2_ppm}
          unit="PPM"
          icon={Wind}
          warningThreshold={800}
          criticalThreshold={1000}
          maxRange={2000}
          link="/environment#co2"
        />
        <SensorTile
          name="CO"
          value={sensorData.co_ppm}
          unit="PPM"
          icon={AlertTriangle}
          warningThreshold={9}
          criticalThreshold={35}
          maxRange={50}
          link="/environment#co"
        />
      </div>
      {sensorData.flame_detected && (
        <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg">
          <div className="flex items-center gap-2 text-red-500">
            <Flame className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold">🔥 FLAME DETECTED!</span>
          </div>
        </div>
      )}
      {sensorData.motion_detected && (
        <div className="p-2 bg-blue-500/10 border border-blue-500 rounded-lg">
          <div className="flex items-center gap-2 text-blue-500">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs">Motion detected in {roomName}</span>
          </div>
        </div>
      )}
    </div>
  );
};
