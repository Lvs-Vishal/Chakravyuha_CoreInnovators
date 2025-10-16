// Test script to verify environment_data table setup
import { supabase } from './src/integrations/supabase/client';

async function testEnvironmentData() {
  console.log('🧪 Testing environment_data table...\n');

  // Test 1: Read from environment_data
  console.log('1️⃣ Testing READ operation...');
  const { data: readData, error: readError } = await supabase
    .from('environment_data')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (readError) {
    console.error('❌ Read error:', readError.message);
  } else {
    console.log('✅ Read successful! Found', readData.length, 'records');
    console.log('Latest record:', readData[0]);
  }

  // Test 2: Insert new data
  console.log('\n2️⃣ Testing INSERT operation...');
  const { data: insertData, error: insertError } = await supabase
    .from('environment_data')
    .insert({
      co2_ppm: 450,
      air_quality_ppm: 32,
      co_ppm: 2.5,
      smoke_ppm: 25,
      flame_detected: false,
      motion_detected: true,
      relay_on: false
    })
    .select();

  if (insertError) {
    console.error('❌ Insert error:', insertError.message);
  } else {
    console.log('✅ Insert successful!');
    console.log('New record ID:', insertData[0]?.id);
  }

  // Test 3: Real-time subscription
  console.log('\n3️⃣ Testing REAL-TIME subscription...');
  const channel = supabase
    .channel('test-environment-updates')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'environment_data' },
      (payload) => {
        console.log('✅ Real-time update received:', payload.eventType);
        console.log('Data:', payload.new);
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Real-time subscription active!');
      }
    });

  // Keep the script running for a few seconds to test real-time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  await supabase.removeChannel(channel);
  console.log('\n✅ All tests completed!');
}

testEnvironmentData().catch(console.error);
