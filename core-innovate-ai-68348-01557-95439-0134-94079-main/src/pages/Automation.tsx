import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface AutomationRule {
  id: string;
  condition: string;
  conditionValue: string;
  action: string;
  enabled: boolean;
}

const Automation = () => {
  const [rules, setRules] = useState<AutomationRule[]>([
    { id: "1", condition: "gas", conditionValue: "> 70", action: "turn_fan_on", enabled: true },
    { id: "2", condition: "temperature", conditionValue: "> 28", action: "turn_ac_on", enabled: true },
    { id: "3", condition: "motion", conditionValue: "detected", action: "turn_light_on", enabled: true },
  ]);

  const [newRule, setNewRule] = useState({
    condition: "",
    conditionValue: "",
    action: "",
  });

  const addRule = () => {
    if (!newRule.condition || !newRule.conditionValue || !newRule.action) {
      toast.error("Please fill all fields");
      return;
    }

    const rule: AutomationRule = {
      id: Date.now().toString(),
      condition: newRule.condition,
      conditionValue: newRule.conditionValue,
      action: newRule.action,
      enabled: true,
    };

    setRules([...rules, rule]);
    setNewRule({ condition: "", conditionValue: "", action: "" });
    toast.success("Automation rule added!");
  };

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id));
    toast.success("Rule deleted");
  };

  const getConditionLabel = (condition: string) => {
    const labels: { [key: string]: string } = {
      gas: "Gas Level",
      temperature: "Temperature",
      humidity: "Humidity",
      motion: "Motion",
      flame: "Flame Sensor",
    };
    return labels[condition] || condition;
  };

  const getActionLabel = (action: string) => {
    const labels: { [key: string]: string } = {
      turn_fan_on: "Turn Fan ON",
      turn_fan_off: "Turn Fan OFF",
      turn_light_on: "Turn Light ON",
      turn_light_off: "Turn Light OFF",
      turn_ac_on: "Turn AC ON",
      trigger_alarm: "Trigger Alarm",
      send_notification: "Send Notification",
    };
    return labels[action] || action;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Automation Builder</h1>
        <p className="text-muted-foreground">Create custom IF-THEN rules for your smart home</p>
      </div>

      {/* Add New Rule Card */}
      <Card className="glass-panel-strong border-border/50 crimson-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-6 h-6 text-primary" />
            Create New Rule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>IF Condition</Label>
              <Select
                value={newRule.condition}
                onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
              >
                <SelectTrigger className="glass-panel">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent className="glass-panel-strong">
                  <SelectItem value="gas">Gas Level</SelectItem>
                  <SelectItem value="temperature">Temperature</SelectItem>
                  <SelectItem value="humidity">Humidity</SelectItem>
                  <SelectItem value="motion">Motion</SelectItem>
                  <SelectItem value="flame">Flame Sensor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Value</Label>
              <Input
                placeholder="e.g., > 70, detected"
                value={newRule.conditionValue}
                onChange={(e) => setNewRule({ ...newRule, conditionValue: e.target.value })}
                className="glass-panel border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label>THEN Action</Label>
              <Select
                value={newRule.action}
                onValueChange={(value) => setNewRule({ ...newRule, action: value })}
              >
                <SelectTrigger className="glass-panel">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="glass-panel-strong">
                  <SelectItem value="turn_fan_on">Turn Fan ON</SelectItem>
                  <SelectItem value="turn_fan_off">Turn Fan OFF</SelectItem>
                  <SelectItem value="turn_light_on">Turn Light ON</SelectItem>
                  <SelectItem value="turn_light_off">Turn Light OFF</SelectItem>
                  <SelectItem value="turn_ac_on">Turn AC ON</SelectItem>
                  <SelectItem value="trigger_alarm">Trigger Alarm</SelectItem>
                  <SelectItem value="send_notification">Send Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={addRule}
            className="w-full crimson-glow hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </CardContent>
      </Card>

      {/* Existing Rules */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Active Rules</h2>
        {rules.map((rule) => (
          <Card key={rule.id} className="glass-panel-strong border-border/50 hover:emerald-shadow transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1 glass-panel rounded-lg">
                      <span className="text-sm font-medium text-secondary">IF</span>
                    </div>
                    <span className="font-medium">{getConditionLabel(rule.condition)}</span>
                    <span className="text-muted-foreground">{rule.conditionValue}</span>
                    <div className="px-3 py-1 glass-panel rounded-lg">
                      <span className="text-sm font-medium text-primary">THEN</span>
                    </div>
                    <span className="font-medium">{getActionLabel(rule.action)}</span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteRule(rule.id)}
                  className="glass-panel border-destructive/50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Suggestions */}
      <Card className="glass-panel-strong border-secondary/50 cyan-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Suggested Rules
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 glass-panel rounded-lg">
            <p className="text-sm">
              <span className="text-secondary font-medium">Smart Suggestion:</span> Based on your usage patterns, 
              consider adding: <span className="font-medium">IF time {'>'} 10 PM AND motion detected THEN turn lights ON</span>
            </p>
          </div>
          <div className="p-4 glass-panel rounded-lg">
            <p className="text-sm">
              <span className="text-secondary font-medium">Energy Saving:</span> Add rule: 
              <span className="font-medium"> IF no motion for 30 min THEN turn all lights OFF</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Automation;
