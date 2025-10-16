import { NavLink } from "react-router-dom";
import {
  Home,
  Thermometer,
  Settings,
  Bot,
  BarChart3,
  Zap,
  LogOut,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navItems = [
  { icon: Home, label: "Home", path: "/dashboard" },
  { icon: Bot, label: "AI Hub", path: "/assistant" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Zap, label: "Automation", path: "/automation" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const handleLogout = () => {
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  return (
    <aside className="w-64 glass-panel-strong border-r border-border/50 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              CORE
            </h2>
            <p className="text-xs text-muted-foreground">Innovators OS</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "glass-panel-strong crimson-shadow text-primary"
                    : "text-muted-foreground hover:glass-panel hover:text-foreground"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-border/50">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full glass-panel border-destructive/50 text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
