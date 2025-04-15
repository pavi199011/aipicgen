
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the admin key (this has RLS bypass abilities)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Check if the admin user already exists
    const { data: existingUser, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', 'admin')
      .single();
    
    if (searchError && searchError.code !== 'PGRST116') {
      throw new Error(`Error checking for existing admin: ${searchError.message}`);
    }
    
    // If admin user exists, just make sure is_admin is set to true
    if (existingUser) {
      if (!existingUser.is_admin) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ is_admin: true })
          .eq('id', existingUser.id);
          
        if (updateError) {
          throw new Error(`Error updating admin status: ${updateError.message}`);
        }
      }
      
      return new Response(
        JSON.stringify({ message: 'Admin user already exists and is properly configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a new admin user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@example.com',
      password: 'Admin2025@#',
      options: {
        data: {
          username: 'admin',
        },
      },
    });
    
    if (signUpError) {
      throw new Error(`Error creating admin user: ${signUpError.message}`);
    }
    
    // Set the is_admin flag to true
    const userId = signUpData.user?.id;
    if (!userId) {
      throw new Error('Failed to get user ID from sign up');
    }
    
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_admin: true })
      .eq('id', userId);
      
    if (updateError) {
      throw new Error(`Error setting admin flag: ${updateError.message}`);
    }
    
    return new Response(
      JSON.stringify({ message: 'Admin user created successfully', userId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})
