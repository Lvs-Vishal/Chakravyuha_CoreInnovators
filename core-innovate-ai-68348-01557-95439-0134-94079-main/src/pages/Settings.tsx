import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Wifi, Bell, Palette, Mic, Shield, User, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail') || 'durai@innovators.com';
    const savedName = localStorage.getItem('userName') || 'Durai';
    const savedPhone = localStorage.getItem('userPhone') || '+91 98765 43210';
    
    setUserEmail(savedEmail);
    setUserName(savedName);
    setUserPhone(savedPhone);
  }, []);

  const handleUpdateProfile = () => {
    // Save to localStorage
    localStorage.setItem('userEmail', userEmail);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userPhone', userPhone);
    
    toast.success("Profile updated successfully", {
      description: `Gas alerts will be sent to ${userEmail}`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure your smart home system</p>
      </div>

      {/* User Profile Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Profile Info */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)}
                className="glass-panel border-border/50" 
              />
            </div>
            <div className="space-y-2">
              <Label>Email (for gas alerts)</Label>
              <Input 
                type="email"
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)}
                className="glass-panel border-border/50" 
                placeholder="your.email@example.com"
              />
              <p className="text-xs text-muted-foreground">
                📧 Alerts will be sent to this email when gas levels are abnormal
              </p>
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input 
                value={userPhone} 
                onChange={(e) => setUserPhone(e.target.value)}
                className="glass-panel border-border/50" 
              />
            </div>
            <Button
              className="w-full cyan-glow hover:scale-105 transition-transform"
              onClick={handleUpdateProfile}
            >
              Update Profile
            </Button>
          </CardContent>
        </Card>

        {/* Location & Preferences */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-secondary" />
              Location & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Home Address</Label>
              <Input defaultValue="Chennai, Tamil Nadu" className="glass-panel border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Time Zone</Label>
              <Input defaultValue="IST (GMT+5:30)" className="glass-panel border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Input defaultValue="English" className="glass-panel border-border/50" />
            </div>
            <Button
              variant="outline"
              className="w-full glass-panel border-secondary/50 hover:bg-secondary/10"
              onClick={() => toast.info("Preferences saved")}
            >
              Save Preferences
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Pairing */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-secondary" />
              Device Pairing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wi-Fi Network</Label>
              <Input placeholder="Network Name" className="glass-panel border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" className="glass-panel border-border/50" />
            </div>
            <Button
              className="w-full cyan-glow hover:scale-105 transition-transform"
              onClick={() => toast.success("Device pairing wizard would open here")}
            >
              Pair New Device
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-warning/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Device Status Changes", checked: true },
              { label: "Security Alerts", checked: true },
              { label: "Temperature Warnings", checked: true },
              { label: "Energy Reports", checked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <Label>{item.label}</Label>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Voice Settings */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Voice Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Wake Word</Label>
              <Input defaultValue="Hey Core" className="glass-panel border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Input defaultValue="English (US)" className="glass-panel border-border/50" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Voice Feedback</Label>
              <Switch defaultChecked />
            </div>
            <Button
              variant="outline"
              className="w-full glass-panel border-secondary/50 hover:bg-secondary/10"
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance("Voice settings configured successfully!");
                window.speechSynthesis.speak(utterance);
                toast.success("Testing voice output");
              }}
            >
              Test Voice
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-accent/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Two-Factor Authentication", checked: true },
              { label: "Biometric Lock", checked: false },
              { label: "Auto Lock on Exit", checked: true },
              { label: "Guest Access", checked: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <Label>{item.label}</Label>
                <Switch defaultChecked={item.checked} />
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full glass-panel border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={() => toast.success("Security test alarm triggered")}
            >
              Test Alarm System
            </Button>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="glass-panel border-primary/50 h-20"
                onClick={() => toast.info("Crimson theme active")}
              >
                <div className="w-8 h-8 rounded-full crimson-glow" />
              </Button>
              <Button
                variant="outline"
                className="glass-panel border-secondary/50 h-20"
                onClick={() => toast.info("Cyan theme would apply")}
              >
                <div className="w-8 h-8 rounded-full cyan-glow" />
              </Button>
              <Button
                variant="outline"
                className="glass-panel border-accent/50 h-20"
                onClick={() => toast.info("Emerald theme would apply")}
              >
                <div className="w-8 h-8 rounded-full bg-accent" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <Label>Adaptive Theme</Label>
              <Switch defaultChecked />
            </div>
            <p className="text-xs text-muted-foreground">
              Automatically adjusts theme based on time of day and ambient lighting
            </p>
          </CardContent>
        </Card>

        {/* Sensor Calibration */}
        <Card className="glass-panel-strong border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_40px_-10px] hover:shadow-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🎯 Sensor Calibration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Temperature Offset</Label>
              <Input defaultValue="0.0" className="glass-panel border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Gas Alert Threshold</Label>
              <Input defaultValue="70" className="glass-panel border-border/50" />
            </div>
            <div className="space-y-2">
              <Label>Motion Sensitivity</Label>
              <Input defaultValue="Medium" className="glass-panel border-border/50" />
            </div>
            <Button
              className="w-full crimson-glow hover:scale-105 transition-transform"
              onClick={() => toast.success("Sensors recalibrated")}
            >
              Recalibrate All Sensors
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
