
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
 * Note: This deletes the profile AND all associated data for the user
 */
export async function deleteUserProfile(userId: string) {
  try {
    // First, delete all generated images for the user
    const { error: imagesError } = await supabase
      .from('generated_images')
      .delete()
      .eq('user_id', userId);
    
    if (imagesError) {
      console.error("Error deleting user images:", imagesError);
      return false;
    }
    
    // Delete the user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      console.error("Error deleting user profile:", profileError);
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
