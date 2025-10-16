#!/usr/bin/env python3
"""
Test script to send sensor data to Supabase
Run with: python test-sensor-data.py
"""

import requests
import time
import random
from datetime import datetime

# ⚠️ REPLACE THESE WITH YOUR ACTUAL VALUES
SUPABASE_URL = "https://dkmjylfwcnlzdadniwen.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbWp5bGZ3Y25semRhZG5pd2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODc2MzksImV4cCI6MjA3NTk2MzYzOX0.H0DApNWE6ZQSbyqwCiXhmWFEyPQymoeHqHBemTwDs4o"

def generate_sensor_data():
    """Generate realistic sensor data"""
    return {
        "co2_ppm": random.randint(400, 1000),      # 400-1000 ppm
        "co_ppm": random.randint(1, 10),           # 1-10 ppm
        "air_quality_ppm": random.randint(20, 70), # 20-70 ppm
        "smoke_ppm": random.randint(10, 110),      # 10-110 ppm
        "flame_detected": random.random() > 0.9,   # 10% chance
        "motion_detected": random.random() > 0.5,  # 50% chance
        "relay_on": False
    }

def send_data(data):
    """Send sensor data to Supabase"""
    headers = {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Prefer": "return=minimal"
    }
    
    endpoint = f"{SUPABASE_URL}/rest/v1/environment_data"
    
    try:
        response = requests.post(endpoint, headers=headers, json=data, timeout=10)
        
        if response.status_code == 201:
            print(f"✅ Data sent successfully!")
            print(f"   CO2: {data['co2_ppm']} ppm, CO: {data['co_ppm']} ppm, AQ: {data['air_quality_ppm']} ppm")
            return True
        else:
            print(f"❌ Error {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def main():
    """Main loop"""
    print("🚀 Starting sensor data simulator...\n")
    print(f"📡 Sending to: {SUPABASE_URL}")
    print("⏰ Interval: 5 seconds\n")
    print("Press Ctrl+C to stop\n")
    
    # Check if credentials are set
    if "YOUR_PROJECT" in SUPABASE_URL or SUPABASE_KEY == "YOUR_ANON_KEY":
        print("❌ ERROR: Please update SUPABASE_URL and SUPABASE_KEY in the script!")
        print("   Find your credentials at: https://app.supabase.com/project/_/settings/api")
        return
    
    count = 1
    
    try:
        while True:
            print(f"\n📊 Reading #{count} at {datetime.now().strftime('%H:%M:%S')}")
            
            # Generate and send data
            sensor_data = generate_sensor_data()
            send_data(sensor_data)
            
            count += 1
            time.sleep(5)  # Wait 5 seconds
            
    except KeyboardInterrupt:
        print("\n\n🛑 Stopped by user")

if __name__ == "__main__":
    main()
