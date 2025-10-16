-- Create enum for device types
CREATE TYPE public.device_type AS ENUM ('light', 'fan', 'relay', 'sensor');

-- Create enum for device status
CREATE TYPE public.device_status AS ENUM ('on', 'off', 'unknown');

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create devices table
CREATE TABLE public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type public.device_type NOT NULL,
  status public.device_status DEFAULT 'off',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sensor_data table for storing sensor readings
CREATE TABLE public.sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  temperature NUMERIC,
  humidity NUMERIC,
  gas_level NUMERIC,
  air_quality TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;

-- Create policies (public read/write for now - can be restricted later)
CREATE POLICY "Allow public read on rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY "Allow public insert on rooms" ON public.rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on rooms" ON public.rooms FOR UPDATE USING (true);

CREATE POLICY "Allow public read on devices" ON public.devices FOR SELECT USING (true);
CREATE POLICY "Allow public insert on devices" ON public.devices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on devices" ON public.devices FOR UPDATE USING (true);

CREATE POLICY "Allow public read on sensor_data" ON public.sensor_data FOR SELECT USING (true);
CREATE POLICY "Allow public insert on sensor_data" ON public.sensor_data FOR INSERT WITH CHECK (true);

-- Insert default rooms
INSERT INTO public.rooms (name, icon) VALUES
  ('Living Room', '🛋️'),
  ('Bedroom', '🛏️'),
  ('Kitchen', '🍳'),
  ('Outdoor', '🌳');

-- Insert default devices
INSERT INTO public.devices (room_id, name, type, status) 
SELECT r.id, 'Main Light', 'light'::public.device_type, 'off'::public.device_status FROM public.rooms r WHERE r.name = 'Living Room'
UNION ALL
SELECT r.id, 'Ceiling Fan', 'fan'::public.device_type, 'off'::public.device_status FROM public.rooms r WHERE r.name = 'Living Room'
UNION ALL
SELECT r.id, 'Main Light', 'light'::public.device_type, 'off'::public.device_status FROM public.rooms r WHERE r.name = 'Bedroom'
UNION ALL
SELECT r.id, 'Table Fan', 'fan'::public.device_type, 'off'::public.device_status FROM public.rooms r WHERE r.name = 'Bedroom'
UNION ALL
SELECT r.id, 'Main Light', 'light'::public.device_type, 'off'::public.device_status FROM public.rooms r WHERE r.name = 'Kitchen'
UNION ALL
SELECT r.id, 'Exhaust Fan', 'fan'::public.device_type, 'off'::public.device_status FROM public.rooms r WHERE r.name = 'Kitchen'
UNION ALL
SELECT r.id, 'Garden Light', 'light'::public.device_type, 'off'::public.device_status FROM public.rooms r WHERE r.name = 'Outdoor';

-- Create function to update device status
CREATE OR REPLACE FUNCTION public.update_device_status(
  device_id UUID,
  new_status public.device_status
)
RETURNS public.devices
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_device public.devices;
BEGIN
  UPDATE public.devices
  SET status = new_status, updated_at = now()
  WHERE id = device_id
  RETURNING * INTO updated_device;
  
  RETURN updated_device;
END;
$$;

-- Create function to find device by name and room
CREATE OR REPLACE FUNCTION public.find_device_by_name(
  room_name TEXT,
  device_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  device_id UUID;
BEGIN
  SELECT d.id INTO device_id
  FROM public.devices d
  JOIN public.rooms r ON d.room_id = r.id
  WHERE LOWER(r.name) LIKE '%' || LOWER(room_name) || '%'
    AND LOWER(d.name) LIKE '%' || LOWER(device_name) || '%'
  LIMIT 1;
  
  RETURN device_id;
END;
$$;