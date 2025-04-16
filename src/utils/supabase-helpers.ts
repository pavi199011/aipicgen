
import { supabase } from "@/integrations/supabase/client";

/**
 * Refreshes the user_details_view materialized view
 * to ensure data consistency after profile updates
 */
export async function refreshUserDetailsView() {
  try {
    // Use a direct query with @ts-ignore to bypass type checking for this RPC call
    // @ts-ignore - This function exists in the database but doesn't match any TypeScript definitions
    const { error } = await supabase.rpc('refresh_user_details_view');
    
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

/**
 * Deletes a user profile
 * Note: This only deletes the profile, not the auth user
 */
export async function deleteUserProfile(userId: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (error) {
      console.error("Error deleting user profile:", error);
      return false;
    }
    
    // Refresh the materialized view to ensure data consistency
    await refreshUserDetailsView();
    
    return true;
  } catch (error) {
    console.error("Error deleting user profile:", error);
    return false;
  }
}
