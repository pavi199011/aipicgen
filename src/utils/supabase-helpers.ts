
import { supabase } from "@/integrations/supabase/client";

/**
 * Refreshes the user_details_view materialized view
 * to ensure data consistency after profile updates
 */
export async function refreshUserDetailsView() {
  try {
    console.log("Attempting to refresh user_details_view...");
    
    // Use a direct RPC call to the refresh function in the database
    const { error } = await supabase.rpc('refresh_user_details_view');
    
    if (error) {
      console.error("Error refreshing user details view:", error);
      return false;
    }
    
    console.log("Successfully refreshed user_details_view");
    return true;
  } catch (error) {
    console.error("Exception refreshing user details view:", error);
    return false;
  }
}

/**
 * Deletes a user profile and all associated data
 * This includes: profile, generated images, and auth user
 */
export async function deleteUserProfile(userId: string) {
  try {
    console.log("Starting deletion process for user:", userId);
    
    // First, delete all generated images for the user
    const { error: imagesError } = await supabase
      .from('generated_images')
      .delete()
      .eq('user_id', userId);
    
    if (imagesError) {
      console.error("Error deleting user images:", imagesError);
      return false;
    }
    
    console.log("Successfully deleted user's images");
    
    // Delete the user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      console.error("Error deleting user profile:", profileError);
      return false;
    }
    
    console.log("Successfully deleted user's profile");
    
    // Delete the auth user (requires admin privileges)
    // Use service role for this operation
    const { error: authError } = await supabase.auth.admin.deleteUser(
      userId
    );
    
    if (authError) {
      console.error("Error deleting auth user:", authError);
      return false;
    }
    
    console.log("Successfully deleted auth user");
    
    // Refresh the materialized view to ensure data consistency
    await refreshUserDetailsView();
    
    return true;
  } catch (error) {
    console.error("Error in deleteUserProfile:", error);
    return false;
  }
}

/**
 * Deletes a generated image completely
 */
export async function deleteGeneratedImage(imageId: string) {
  try {
    console.log("Deleting generated image:", imageId);
    
    const { error } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', imageId);
    
    if (error) {
      console.error("Error deleting image:", error);
      return false;
    }
    
    console.log("Image deleted successfully");
    return true;
  } catch (error) {
    console.error("Error in deleteGeneratedImage:", error);
    return false;
  }
}
