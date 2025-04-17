
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.31.0"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the userId from the request
    const { userId } = await req.json()
    
    if (!userId) {
      throw new Error('User ID is required')
    }
    
    console.log(`Attempting to delete user with ID: ${userId}`)
    
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
    
    // Delete all generated images for the user
    console.log("Deleting user's generated images...")
    const { error: imagesError } = await supabaseAdmin
      .from('generated_images')
      .delete()
      .eq('user_id', userId)
      
    if (imagesError) {
      console.error("Error deleting user images:", imagesError)
      throw new Error(`Failed to delete user images: ${imagesError.message}`)
    }
    
    // Delete profile
    console.log("Deleting user's profile...")
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)
      
    if (profileError) {
      console.error("Error deleting user profile:", profileError)
      throw new Error(`Failed to delete user profile: ${profileError.message}`)
    }
    
    // Delete auth user using admin privileges
    console.log("Deleting auth user...")
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error("Error deleting auth user:", authError)
      throw new Error(`Failed to delete auth user: ${authError.message}`)
    }
    
    // Refresh materialized views if needed
    try {
      console.log("Refreshing user details view...")
      await supabaseAdmin.functions.invoke('refresh-user-details-view', {
        method: 'POST',
      })
    } catch (refreshError) {
      // Log but don't fail if view refresh fails
      console.error("Error refreshing views:", refreshError)
    }
    
    console.log("User deletion completed successfully")
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
    
  } catch (error) {
    console.error("Error in delete-user function:", error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unknown error occurred' 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})
