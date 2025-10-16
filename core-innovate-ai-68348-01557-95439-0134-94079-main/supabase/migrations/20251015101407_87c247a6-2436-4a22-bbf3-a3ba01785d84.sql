-- Fix search_path for security definer functions

-- Drop and recreate update_device_status function with proper search_path
DROP FUNCTION IF EXISTS public.update_device_status(UUID, public.device_status);

CREATE OR REPLACE FUNCTION public.update_device_status(
  device_id UUID,
  new_status public.device_status
)
RETURNS public.devices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Drop and recreate find_device_by_name function with proper search_path
DROP FUNCTION IF EXISTS public.find_device_by_name(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.find_device_by_name(
  room_name TEXT,
  device_name TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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