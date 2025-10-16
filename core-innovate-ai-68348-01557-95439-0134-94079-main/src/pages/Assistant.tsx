import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const Assistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Core Innovators AI Assistant. How can I help you control your smart home today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(input.toLowerCase());
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      
      // Speak response
      const utterance = new SpeechSynthesisUtterance(response);
      window.speechSynthesis.speak(utterance);
    }, 500);

    setInput("");
  };

  const generateResponse = (input: string): string => {
    if (input.includes("light") && input.includes("on")) {
      return "Turning on the lights in your home. Is there a specific room you'd like me to focus on?";
    } else if (input.includes("light") && input.includes("off")) {
      return "Turning off the lights. Your home is now set to nighttime mode.";
    } else if (input.includes("temperature")) {
      return "Current temperature across all rooms: Living Room 24°C, Bedroom 22°C, Kitchen 26°C. Would you like me to adjust the climate control?";
    } else if (input.includes("fan")) {
      return "I can control your fans. Which room would you like me to adjust - Living Room, Bedroom, or Kitchen?";
    } else if (input.includes("status") || input.includes("report")) {
      return "System Status Report: ✅ All devices online. 🌡️ Average temperature: 24°C. 💧 Humidity: 45%. 🌬️ Air quality: Good. No alerts detected.";
    } else if (input.includes("automation") || input.includes("rule")) {
      return "You currently have 3 active automation rules. Would you like me to create a new rule or modify an existing one?";
    } else if (input.includes("energy") || input.includes("power")) {
      return "Your home is currently using 2.3 kW. I can help you optimize energy usage by suggesting automated schedules. Interested?";
    } else if (input.includes("security")) {
      return "Security system is armed. All sensors are active. No intrusions detected. Motion sensors report normal activity.";
    } else {
      return `I understand you said: "${input}". I can help you control lights, fans, check temperatures, view security status, create automations, and more. What would you like to do?`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">AI Assistant Hub</h1>
        <p className="text-muted-foreground">Chat with your intelligent home assistant</p>
      </div>

      {/* Chat Interface */}
      <Card className="glass-panel-strong border-border/50 h-[600px] flex flex-col">
        <CardHeader className="border-b border-border/50">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary animate-pulse-glow" />
            Core AI Assistant
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
              )}
              
              <div
                className={`max-w-[70%] p-4 rounded-2xl ${
                  message.role === "user"
                    ? "crimson-glow text-white"
                    : "glass-panel border border-border/50"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>

              {message.role === "user" && (
                <div className="w-10 h-10 rounded-full glass-panel flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-secondary" />
                </div>
              )}
            </div>
          ))}
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              placeholder="Ask your home anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="glass-panel border-border/50"
            />
            <Button
              onClick={handleSend}
              className="crimson-glow hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "System Status", icon: "📊" },
          { label: "Turn Off Lights", icon: "💡" },
          { label: "Climate Report", icon: "🌡️" },
          { label: "Security Check", icon: "🔒" },
        ].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="glass-panel border-secondary/50 hover:cyan-shadow h-auto py-6"
            onClick={() => setInput(action.label)}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="text-sm">{action.label}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Assistant;
