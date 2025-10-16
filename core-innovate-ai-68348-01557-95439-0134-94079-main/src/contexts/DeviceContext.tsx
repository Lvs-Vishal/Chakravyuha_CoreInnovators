import { createContext, useContext, useState, ReactNode } from "react";
import { Lightbulb, Fan, Zap } from "lucide-react";

export interface Device {
  id: string;
  name: string;
  type: "light" | "fan" | "relay" | "purifier";
  status: "on" | "off";
  icon: any;
  room: string;
  mode?: "auto" | "manual" | "power" | "sleep";
}

interface DeviceContextType {
  devices: Device[];
  toggleDevice: (deviceId: string) => void;
  toggleDevicesByType: (type: string, status: "on" | "off") => void;
  toggleDevicesByRoom: (room: string, status: "on" | "off") => void;
  toggleAllDevices: (status: "on" | "off") => void;
  getDeviceByName: (name: string) => Device | undefined;
  setDeviceMode: (deviceId: string, mode: "auto" | "manual" | "power" | "sleep") => void;
  setAllDevicesModeByType: (type: string, mode: "auto" | "manual" | "power" | "sleep") => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

const initialDevices: Device[] = [
  // Living Room
  { id: "lr-light", name: "Main Light", type: "light", status: "on", icon: Lightbulb, room: "Living Room" },
  { id: "lr-fan", name: "Ceiling Fan", type: "fan", status: "on", icon: Fan, room: "Living Room" },
  { id: "lr-plug", name: "Smart Plug", type: "relay", status: "on", icon: Zap, room: "Living Room" },
  { id: "lr-purifier", name: "Air Purifier", type: "purifier", status: "on", icon: Fan, room: "Living Room", mode: "auto" },
  
  // Bedroom
  { id: "br-lamp", name: "Bedside Lamp", type: "light", status: "off", icon: Lightbulb, room: "Bedroom" },
  { id: "br-fan", name: "Ceiling Fan", type: "fan", status: "off", icon: Fan, room: "Bedroom" },
  { id: "br-purifier", name: "Air Purifier", type: "purifier", status: "on", icon: Fan, room: "Bedroom", mode: "auto" },
  
  // Kitchen
  { id: "kt-light", name: "Kitchen Light", type: "light", status: "on", icon: Lightbulb, room: "Kitchen" },
  { id: "kt-fan", name: "Exhaust Fan", type: "fan", status: "off", icon: Fan, room: "Kitchen" },
];

export const DeviceProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  const toggleDevice = (deviceId: string) => {
    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId
          ? { ...device, status: device.status === "on" ? "off" : "on" }
          : device
      )
    );
  };

  const toggleDevicesByType = (type: string, status: "on" | "off") => {
    setDevices(prev =>
      prev.map(device =>
        device.type === type ? { ...device, status } : device
      )
    );
  };

  const toggleDevicesByRoom = (room: string, status: "on" | "off") => {
    setDevices(prev =>
      prev.map(device =>
        device.room.toLowerCase() === room.toLowerCase()
          ? { ...device, status }
          : device
      )
    );
  };

  const toggleAllDevices = (status: "on" | "off") => {
    setDevices(prev =>
      prev.map(device => ({ ...device, status }))
    );
  };

  const getDeviceByName = (name: string) => {
    const searchName = name.toLowerCase();
    return devices.find(device => 
      device.name.toLowerCase().includes(searchName) ||
      `${device.room} ${device.name}`.toLowerCase().includes(searchName)
    );
  };

  const setDeviceMode = (deviceId: string, mode: "auto" | "manual" | "power" | "sleep") => {
    setDevices(prev =>
      prev.map(device =>
        device.id === deviceId ? { ...device, mode } : device
      )
    );
  };

  const setAllDevicesModeByType = (type: string, mode: "auto" | "manual" | "power" | "sleep") => {
    setDevices(prev =>
      prev.map(device =>
        device.type === type ? { ...device, mode } : device
      )
    );
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        toggleDevice,
        toggleDevicesByType,
        toggleDevicesByRoom,
        toggleAllDevices,
        getDeviceByName,
        setDeviceMode,
        setAllDevicesModeByType,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDevices must be used within DeviceProvider");
  }
  return context;
};
