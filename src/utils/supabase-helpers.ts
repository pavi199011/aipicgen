
import { supabase } from "@/integrations/supabase/client";

/**
 * Refreshes the user_details_view materialized view
 * to ensure data consistency after profile updates
 */
export async function refreshUserDetailsView() {
  try {
    console.log("Attempting to refresh user_details_view...");
    
    // Use the fetch API directly to bypass TypeScript's type checking for RPC
    const { data, error } = await supabase.functions.invoke('refresh-user-details-view', {
      method: 'POST',
    });
    
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
    
    // Call the admin edge function to delete the user
    const { data, error } = await supabase.functions.invoke('delete-user', {
      method: 'POST',
      body: { userId }
    });
    
    if (error) {
      console.error("Error calling delete-user function:", error);
      return false;
    }
    
    // Check the response from the function
    if (!data?.success) {
      console.error("User deletion failed:", data?.error || "Unknown error");
      return false;
    }
    
    console.log("User deletion completed successfully");
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
