
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  userId: string;
  amount: number;
  description: string;
  adminId: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Get the request data
    const { userId, amount, description, adminId } = await req.json() as RequestBody;

    if (!userId || !amount || !description || !adminId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Verify admin status
    const { data: adminData, error: adminError } = await supabaseClient
      .from('profiles')
      .select('is_admin')
      .eq('id', adminId)
      .single();

    if (adminError || !adminData || !adminData.is_admin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Admin privileges required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Add credits to user
    const { data: userData, error: userError } = await supabaseClient
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (userError) {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Update user credits
    const newCredits = (userData.credits || 0) + amount;
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ credits: newCredits })
      .eq('id', userId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update credits' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Log transaction
    const { data: adminUser } = await supabaseClient
      .from('profiles')
      .select('username')
      .eq('id', adminId)
      .single();

    const adminUsername = adminUser?.username || 'admin';

    const { error: transactionError } = await supabaseClient
      .from('credit_transactions')
      .insert({
        user_id: userId,
        amount: amount,
        description: description,
        transaction_type: 'admin_add',
        admin_id: adminId,
        created_by: adminUsername
      });

    if (transactionError) {
      console.error('Failed to log transaction:', transactionError);
      // Continue anyway since credits were added successfully
    }

    return new Response(
      JSON.stringify({ success: true, credits: newCredits }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Error in add-user-credits function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
