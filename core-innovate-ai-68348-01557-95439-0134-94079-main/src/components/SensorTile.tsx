import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SensorTileProps {
  name: string;
  value: number | null;
  unit: string;
  icon: LucideIcon;
  warningThreshold: number;
  criticalThreshold: number;
  maxRange: number;
  link: string;
  badge?: string;
}

export const SensorTile = ({
  name,
  value,
  unit,
  icon: Icon,
  warningThreshold,
  criticalThreshold,
  maxRange,
  link,
  badge,
}: SensorTileProps) => {
  const getStatus = () => {
    if (value === null) return "no-data";
    if (value >= criticalThreshold) return "critical";
    if (value >= warningThreshold) return "warn";
    return "safe";
  };

  const status = getStatus();

  const getStatusColor = () => {
    switch (status) {
      case "no-data":
        return "border-muted/50 bg-muted/5 opacity-60";
      case "critical":
        return "crimson-shadow border-red-500/50";
      case "warn":
        return "border-yellow-500/50 bg-yellow-500/5";
      case "safe":
        return "emerald-shadow border-green-500/30";
    }
  };

  const percentage = value !== null ? Math.min((value / maxRange) * 100, 100) : 0;

  return (
    <div className={`p-4 glass-panel rounded-xl border ${getStatusColor()} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium">{name}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
              {badge}
            </span>
          )}
        </div>
        <div
          className={`w-2 h-2 rounded-full ${
            status === "no-data"
              ? "bg-muted"
              : status === "critical"
              ? "bg-red-500 animate-pulse"
              : status === "warn"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
        />
      </div>

      <div className="mb-3">
        <div className="text-2xl font-bold">
          {value !== null ? (
            <>
              {value.toFixed(1)}
              <span className="text-sm text-muted-foreground ml-1">{unit}</span>
            </>
          ) : (
            <span className="text-sm text-muted-foreground">No Data</span>
          )}
        </div>
      </div>

      {/* Range bar */}
      <div className="mb-3 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            status === "critical"
              ? "bg-red-500"
              : status === "warn"
              ? "bg-yellow-500"
              : "bg-green-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full text-xs"
        onClick={() => (window.location.hash = link)}
      >
        View Live Data
      </Button>
    </div>
  );
};
