// Test script to send sensor data to Supabase
// Run with: node test-sensor-data.js

import https from 'https';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES
const SUPABASE_URL = 'dkmjylfwcnlzdadniwen.supabase.co'; // Without https://
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbWp5bGZ3Y25semRhZG5pd2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODc2MzksImV4cCI6MjA3NTk2MzYzOX0.H0DApNWE6ZQSbyqwCiXhmWFEyPQymoeHqHBemTwDs4o';

// Generate realistic sensor data
function generateSensorData() {
  return {
    co2_ppm: Math.floor(Math.random() * 600) + 400,  // 400-1000 ppm
    co_ppm: Math.floor(Math.random() * 10) + 1,      // 1-10 ppm
    air_quality_ppm: Math.floor(Math.random() * 50) + 20, // 20-70 ppm
    smoke_ppm: Math.floor(Math.random() * 100) + 10,  // 10-110 ppm
    flame_detected: Math.random() > 0.9,              // 10% chance
    motion_detected: Math.random() > 0.5,             // 50% chance
    relay_on: false
  };
}

// Send data to Supabase
function sendData(data) {
  return new Promise((resolve, reject) => {
    const jsonData = JSON.stringify(data);

    const options = {
      hostname: SUPABASE_URL,
      port: 443,
      path: '/rest/v1/environment_data',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'return=minimal',
        'Content-Length': jsonData.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 201) {
          console.log(`✅ Data sent successfully!`);
          console.log(`   CO2: ${data.co2_ppm} ppm, CO: ${data.co_ppm} ppm, AQ: ${data.air_quality_ppm} ppm`);
          resolve(true);
        } else {
          console.error(`❌ Error ${res.statusCode}: ${responseData}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Request failed:', error.message);
      reject(error);
    });

    req.write(jsonData);
    req.end();
  });
}

// Main function
async function main() {
  console.log('🚀 Starting sensor data simulator...\n');
  console.log(`📡 Sending to: https://${SUPABASE_URL}`);
  console.log('⏰ Interval: 5 seconds\n');
  console.log('Press Ctrl+C to stop\n');

  // Check if credentials are set
  if (SUPABASE_URL === 'YOUR_PROJECT.supabase.co' || SUPABASE_KEY === 'YOUR_ANON_KEY') {
    console.error('❌ ERROR: Please update SUPABASE_URL and SUPABASE_KEY in the script!');
    console.error('   Find your credentials at: https://app.supabase.com/project/_/settings/api');
    process.exit(1);
  }

  let count = 1;

  // Send data every 5 seconds
  setInterval(async () => {
    try {
      console.log(`\n📊 Reading #${count++} at ${new Date().toLocaleTimeString()}`);
      const sensorData = generateSensorData();
      await sendData(sensorData);
    } catch (error) {
      console.error('❌ Error:', error.message);
    }
  }, 5000);
}

// Run the script
main();
