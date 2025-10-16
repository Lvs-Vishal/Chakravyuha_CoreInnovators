import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface EnvironmentData {
  created_at: string;
  co2_ppm: number;
  co_ppm: number;
  air_quality_ppm: number;
  smoke_ppm: number;
  flame_detected: boolean;
  motion_detected: boolean;
}

const Analytics = () => {
  const [co2Data, setCo2Data] = useState<Array<{ time: string; value: number }>>([]);
  const [coData, setCoData] = useState<Array<{ time: string; value: number }>>([]);
  const [airQualityData, setAirQualityData] = useState<Array<{ time: string; value: number }>>([]);
  const [smokeData, setSmokeData] = useState<Array<{ time: string; value: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnvironmentData();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('analytics-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'environment_data' },
        () => {
          fetchEnvironmentData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEnvironmentData = async () => {
    try {
      const { data, error } = await supabase
        .from('environment_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching environment data:', error);
        toast.error('Failed to load analytics data');
        return;
      }

      if (data && data.length > 0) {
        // Process data for charts (reverse to show oldest to newest)
        const reversedData = [...data].reverse();
        
        setCo2Data(
          reversedData.map((item) => ({
            time: new Date(item.created_at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: item.co2_ppm || 0,
          }))
        );

        setCoData(
          reversedData.map((item) => ({
            time: new Date(item.created_at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: item.co_ppm || 0,
          }))
        );

        setAirQualityData(
          reversedData.map((item) => ({
            time: new Date(item.created_at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: item.air_quality_ppm || 0,
          }))
        );

        setSmokeData(
          reversedData.map((item) => ({
            time: new Date(item.created_at).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            value: item.smoke_ppm || 0,
          }))
        );
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
        <p className="text-muted-foreground">Track your home's environmental data over time (Last 50 readings)</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 gap-6">
            {/* CO2 Chart */}
            <Card className="glass-panel-strong border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  �️ CO₂ Levels Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={co2Data}>
                    <defs>
                      <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--warning))" fillOpacity={1} fill="url(#colorCO2)" />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4">
                  💡 AI Insight: {co2Data.length > 0 ? 
                    `Monitoring ${co2Data.length} data points. Keep CO₂ below 1000 ppm for optimal air quality.` : 
                    'No CO₂ data available yet.'}
                </p>
              </CardContent>
            </Card>

            {/* Carbon Monoxide Chart */}
            <Card className="glass-panel-strong border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  ⚠️ Carbon Monoxide (CO) Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={coData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4">
                  💡 AI Insight: {coData.length > 0 ? 
                    'Monitoring CO levels. Alert threshold is 9 ppm. Stay safe!' : 
                    'No CO data available yet.'}
                </p>
              </CardContent>
            </Card>

            {/* Air Quality Chart */}
            <Card className="glass-panel-strong border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌫️ Air Quality Index
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={airQualityData}>
                    <defs>
                      <linearGradient id="colorAQ" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Area type="monotone" dataKey="value" stroke="hsl(var(--secondary))" fillOpacity={1} fill="url(#colorAQ)" />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4">
                  💡 AI Insight: {airQualityData.length > 0 ? 
                    'Good air quality maintained. Ventilation system working optimally.' : 
                    'No air quality data available yet.'}
                </p>
              </CardContent>
            </Card>

            {/* Smoke Levels Chart */}
            <Card className="glass-panel-strong border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💨 Smoke Detection Levels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={smokeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                    <YAxis stroke="rgba(255,255,255,0.5)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-sm text-muted-foreground mt-4">
                  💡 AI Insight: {smokeData.length > 0 ? 
                    'Smoke sensors active. Alert threshold at 300 ppm. No immediate concerns.' : 
                    'No smoke data available yet.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
