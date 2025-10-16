// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dkmjylfwcnlzdadniwen.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbWp5bGZ3Y25semRhZG5pd2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzODc2MzksImV4cCI6MjA3NTk2MzYzOX0.H0DApNWE6ZQSbyqwCiXhmWFEyPQymoeHqHBemTwDs4o";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  console.log('🔗 Testing Supabase connection...\n');
  
  try {
    // Test 1: Check if environment_data table exists
    console.log('1️⃣ Checking environment_data table...');
    const { data: envData, error: envError } = await supabase
      .from('environment_data')
      .select('*')
      .limit(5);
    
    if (envError) {
      console.log('❌ environment_data table error:', envError.message);
    } else {
      console.log('✅ environment_data table exists!');
      console.log('📊 Sample data:', JSON.stringify(envData, null, 2));
    }
    
    // Test 2: Check rooms table
    console.log('\n2️⃣ Checking rooms table...');
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('*');
    
    if (roomsError) {
      console.log('❌ rooms table error:', roomsError.message);
    } else {
      console.log('✅ rooms table exists!');
      console.log('🏠 Rooms:', rooms.map(r => r.name).join(', '));
    }
    
    // Test 3: Check devices table
    console.log('\n3️⃣ Checking devices table...');
    const { data: devices, error: devicesError } = await supabase
      .from('devices')
      .select('*');
    
    if (devicesError) {
      console.log('❌ devices table error:', devicesError.message);
    } else {
      console.log('✅ devices table exists!');
      console.log('💡 Total devices:', devices.length);
    }
    
    console.log('\n✨ Connection test complete!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
