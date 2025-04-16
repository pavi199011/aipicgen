
-- Add phone column to profiles table if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'profiles'
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone TEXT;
    END IF;
END
$$;

-- Enable Row Level Security for the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add a policy to allow anyone to read their own profile
CREATE POLICY IF NOT EXISTS "Users can read own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Add a policy to allow admins to access all profiles (using hardcoded admin email)
CREATE POLICY IF NOT EXISTS "Admins can access all profiles"
ON public.profiles
FOR ALL
USING (auth.jwt() ->> 'email' = 'admin@example.com');

-- Fix get_user_emails function with explicit column references
CREATE OR REPLACE FUNCTION public.get_user_emails(user_ids uuid[])
 RETURNS TABLE(id uuid, email text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  -- Check if the current user is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Only administrators can access user emails';
  END IF;

  -- Return emails for the provided user IDs with explicit table reference
  RETURN QUERY
  SELECT au.id AS id, au.email::TEXT AS email
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
END;
$function$;

-- Enable real-time for the profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Enable real-time for the generated_images table
ALTER PUBLICATION supabase_realtime ADD TABLE public.generated_images;

-- Make sure we have REPLICA IDENTITY FULL for real-time updates
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.generated_images REPLICA IDENTITY FULL;
