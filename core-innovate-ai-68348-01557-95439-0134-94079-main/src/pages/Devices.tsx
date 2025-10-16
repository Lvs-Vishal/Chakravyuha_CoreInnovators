import { Card } from "@/components/ui/card";
import { Cpu, Lightbulb, Fan, Zap, Power, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useDevices } from "@/contexts/DeviceContext";

const Devices = () => {
  const { devices, toggleDevice, toggleDevicesByType, toggleAllDevices } = useDevices();

  // Group devices by room
  const rooms = devices.reduce((acc, device) => {
    const room = acc.find(r => r.name === device.room);
    if (room) {
      room.devices.push(device);
    } else {
      acc.push({ name: device.room, devices: [device] });
    }
    return acc;
  }, [] as { name: string; devices: typeof devices }[]);

  const getTotalDevices = () => devices.length;
  const getActiveDevices = () => devices.filter(d => d.status === "on").length;
  const getLightsCount = () => devices.filter(d => d.type === "light").length;
  const getFansCount = () => devices.filter(d => d.type === "fan").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel-strong p-6 rounded-2xl border border-border/50">
        <div className="flex items-center gap-3 mb-2">
          <Cpu className="w-8 h-8 text-primary animate-pulse-glow" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Device Control
          </h1>
        </div>
        <p className="text-muted-foreground">Manage and control all connected devices</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel p-6 border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Devices</p>
              <p className="text-2xl font-bold">{getTotalDevices()}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-panel p-6 border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-500/10">
              <Power className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="text-2xl font-bold">{getActiveDevices()}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-panel p-6 border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10">
              <Lightbulb className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lights</p>
              <p className="text-2xl font-bold">{getLightsCount()}</p>
            </div>
          </div>
        </Card>

        <Card className="glass-panel p-6 border-border/50">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10">
              <Fan className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fans</p>
              <p className="text-2xl font-bold">{getFansCount()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Devices by Room */}
      <div className="space-y-6">
        {rooms.map((room, roomIndex) => (
          <Card key={roomIndex} className="glass-panel p-6 border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {room.name}
                <Badge variant="outline" className="ml-2">
                  {room.devices.length} devices
                </Badge>
              </h2>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage Room
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {room.devices.map((device) => {
                const Icon = device.icon;
                const isOn = device.status === "on";
                
                return (
                  <div key={device.id} className="p-4 glass-panel rounded-xl border border-border/30 hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isOn ? 'bg-primary/20' : 'bg-muted/20'}`}>
                          <Icon className={`w-5 h-5 ${isOn ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{device.type}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={isOn} 
                        onCheckedChange={() => toggleDevice(device.id)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <Badge variant={isOn ? "default" : "outline"} className="capitalize">
                        {device.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass-panel p-6 border-border/50">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            className="glass-panel"
            onClick={() => toggleAllDevices("off")}
          >
            <Power className="w-4 h-4 mr-2" />
            Turn All Off
          </Button>
          <Button 
            variant="outline" 
            className="glass-panel"
            onClick={() => toggleDevicesByType("light", "on")}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            All Lights On
          </Button>
          <Button 
            variant="outline" 
            className="glass-panel"
            onClick={() => toggleDevicesByType("fan", "off")}
          >
            <Fan className="w-4 h-4 mr-2" />
            All Fans Off
          </Button>
          <Button 
            variant="outline" 
            className="glass-panel"
            onClick={() => toggleAllDevices("off")}
          >
            <Zap className="w-4 h-4 mr-2" />
            Energy Saving Mode
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Devices;
