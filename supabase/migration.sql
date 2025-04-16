
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

-- Make sure is_active is set to true by default for all profiles
ALTER TABLE public.profiles 
ALTER COLUMN is_active SET DEFAULT true;

-- Update any existing profile records where is_active is null to be true
UPDATE public.profiles 
SET is_active = true 
WHERE is_active IS NULL;

-- Set the admin account to active explicitly
UPDATE public.profiles 
SET is_active = true 
WHERE username = 'admin';

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

-- Enable real-time for the profiles table
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Enable real-time for the generated_images table
ALTER PUBLICATION supabase_realtime ADD TABLE public.generated_images;

-- Make sure we have REPLICA IDENTITY FULL for real-time updates
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.generated_images REPLICA IDENTITY FULL;
