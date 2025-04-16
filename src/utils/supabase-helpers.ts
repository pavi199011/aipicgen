
import { supabase } from "@/integrations/supabase/client";

/**
 * Refreshes the user_details_view materialized view
 * to ensure data consistency after profile updates
 */
export async function refreshUserDetailsView() {
  try {
    // Use a type assertion to tell TypeScript to trust us that this function exists
    const { error } = await supabase.rpc(
      'refresh_user_details_view' as unknown as 'get_user_emails', 
      {}, 
      { count: 'exact' }
    );
    
    if (error) {
      console.error("Error refreshing user details view:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error refreshing user details view:", error);
    return false;
  }
}
