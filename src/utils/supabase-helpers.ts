
import { supabase } from "@/integrations/supabase/client";

/**
 * Refreshes the user_details_view materialized view
 * to ensure data consistency after profile updates
 */
export async function refreshUserDetailsView() {
  try {
    // Use the raw query method to call the function without type checking
    const { error } = await supabase
      .rpc('refresh_user_details_view', {}, { 
        // @ts-ignore - This function exists in the database but not in the TypeScript definitions
        count: 'exact' 
      });
    
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
