
-- Fix the get_user_emails function to resolve ambiguous column reference
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

  -- Return emails for the provided user IDs
  -- Explicitly select from auth.users and alias the fields to avoid ambiguity
  RETURN QUERY
  SELECT au.id, au.email::TEXT
  FROM auth.users au
  WHERE au.id = ANY(user_ids);
END;
$function$;

