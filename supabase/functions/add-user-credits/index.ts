
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AddCreditsRequest {
  userId: string;
  amount: number;
  description: string;
  adminId: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase environment variables");
    }
    
    // Create a Supabase client with the service role key for admin-level operations
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Get user authorization from the request headers
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }
    
    // Verify the JWT token first
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid authorization");
    }
    
    // Parse the request body
    const body: AddCreditsRequest = await req.json();
    const { userId, amount, description, adminId } = body;
    
    if (!userId || !amount || !description || !adminId) {
      throw new Error("Missing required parameters");
    }
    
    // Check if the admin exists and has admin rights
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", adminId)
      .single();
    
    if (adminError || !adminData || adminData.is_admin !== true) {
      throw new Error("Not authorized to perform admin actions");
    }
    
    // Call the add_user_credits function
    const { data, error } = await supabaseAdmin.rpc(
      "add_user_credits",
      {
        user_id_param: userId,
        amount_param: amount,
        description_param: description,
        admin_id_param: adminId
      }
    );
    
    if (error) {
      throw error;
    }
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data
      }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
});
