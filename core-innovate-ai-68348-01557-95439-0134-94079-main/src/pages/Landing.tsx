import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Home, Brain, Shield, Waves } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const fullText = "Monitoring • Optimizing • Innovating";

  useEffect(() => {
    // Fade in content
    setTimeout(() => setShowContent(true), 300);

    // Typing effect
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    // Auto-transition after 10 seconds
    const autoTransition = setTimeout(() => {
      navigate("/dashboard");
    }, 10000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(autoTransition);
    };
  }, [navigate]);

  const handleExplore = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Zap className="absolute top-20 left-20 w-8 h-8 text-red-500/30 animate-bounce" style={{ animationDelay: "0s" }} />
        <Home className="absolute top-40 right-40 w-8 h-8 text-cyan-500/30 animate-bounce" style={{ animationDelay: "0.5s" }} />
        <Brain className="absolute bottom-40 left-40 w-8 h-8 text-purple-500/30 animate-bounce" style={{ animationDelay: "1s" }} />
        <Shield className="absolute bottom-20 right-20 w-8 h-8 text-green-500/30 animate-bounce" style={{ animationDelay: "1.5s" }} />
        <Waves className="absolute top-1/2 right-1/4 w-8 h-8 text-blue-500/30 animate-bounce" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main content */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* Logo placeholder - animated entrance */}
        <div className="mb-8 animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl flex items-center justify-center shadow-2xl border border-red-500/50">
              <Home className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        {/* Main headline */}
        <h1 className="text-6xl md:text-8xl font-bold text-center mb-4 bg-gradient-to-r from-white via-red-200 to-red-500 bg-clip-text text-transparent animate-fade-in">
          CORE Innovators OS
        </h1>

        {/* Subtitle */}
        <p className="text-2xl md:text-3xl text-gray-300 text-center mb-3 animate-fade-in" style={{ animationDelay: "0.3s" }}>
          The Future of Smart Living Begins Here
        </p>

        {/* Typing effect tagline */}
        <div className="h-8 mb-12">
          <p className="text-lg md:text-xl text-red-400 font-mono text-center">
            {typedText}
            <span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-center max-w-2xl mb-12 text-lg animate-fade-in" style={{ animationDelay: "0.6s" }}>
          Empowering every home with AI that senses, learns, and protects. 
          Experience intelligent automation that adapts to your lifestyle and keeps your family safe.
        </p>

        {/* Explore button */}
        <Button
          onClick={handleExplore}
          size="lg"
          className="relative group px-12 py-6 text-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-2 border-red-500/50 shadow-2xl shadow-red-500/50 transition-all duration-300 hover:scale-105 animate-fade-in"
          style={{ animationDelay: "0.9s" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all" />
          <span className="relative flex items-center gap-3">
            <Home className="w-6 h-6" />
            Explore My Smart Home
            <Zap className="w-6 h-6" />
          </span>
        </Button>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-20 max-w-6xl animate-fade-in" style={{ animationDelay: "1.2s" }}>
          {[
            { icon: Brain, title: "AI-Powered", desc: "Self-learning automation" },
            { icon: Shield, title: "Advanced Safety", desc: "24/7 threat monitoring" },
            { icon: Zap, title: "Real-Time", desc: "Instant sensor data" },
            { icon: Waves, title: "Seamless", desc: "Unified control" },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-red-500/50 transition-all duration-300 hover:cyan-shadow group"
            >
              <feature.icon className="w-10 h-10 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Auto-transition hint */}
        <p className="text-gray-500 text-sm mt-12 animate-fade-in" style={{ animationDelay: "1.5s" }}>
          Auto-continuing in a moment...
        </p>
      </div>
    </div>
  );
};

export default Landing;
