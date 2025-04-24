
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
 * Deletes a generated image completely from both the database and storage
 */
export async function deleteGeneratedImage(imageId: string) {
  try {
    console.log("Deleting generated image:", imageId);
    
    // First get the image URL to delete from storage
    const { data: imageData, error: fetchError } = await supabase
      .from('generated_images')
      .select('image_url')
      .eq('id', imageId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching image data:", fetchError);
      return false;
    }
    
    // Delete from database
    const { error: deleteError } = await supabase
      .from('generated_images')
      .delete()
      .eq('id', imageId);
    
    if (deleteError) {
      console.error("Error deleting image from database:", deleteError);
      return false;
    }

    // Attempt to delete the corresponding file from storage if it exists
    // This is best-effort since the image might be stored externally
    if (imageData?.image_url && imageData.image_url.includes('storage')) {
      try {
        // Extract the path from a URL like "https://.../storage/v1/object/public/bucket/path"
        const urlParts = imageData.image_url.split('/storage/');
        if (urlParts.length > 1) {
          const pathParts = urlParts[1].split('/');
          // Remove "v1/object/public" from the path
          const storagePath = pathParts.slice(3).join('/');
          const bucketName = pathParts[3]; // Usually the bucket name follows "public"
          
          // Attempt to delete from storage
          const { error: storageError } = await supabase.storage
            .from(bucketName)
            .remove([storagePath]);
            
          if (storageError) {
            console.warn("Non-critical: Could not delete image from storage:", storageError);
            // Don't return false here, as the database deletion was successful
          }
        }
      } catch (storageError) {
        console.warn("Non-critical: Error parsing or deleting storage file:", storageError);
        // Don't return false for storage errors, as they are non-critical
      }
    }
    
    console.log("Image deleted successfully from database");
    return true;
  } catch (error) {
    console.error("Error in deleteGeneratedImage:", error);
    return false;
  }
}

/**
 * Bulk deletes multiple generated images
 */
export async function bulkDeleteGeneratedImages(imageIds: string[]) {
  try {
    console.log("Bulk deleting generated images:", imageIds);
    
    // We'll use Promise.all to handle multiple deletions
    const results = await Promise.all(
      imageIds.map(id => deleteGeneratedImage(id))
    );
    
    // Check if all deletions were successful
    const allSuccessful = results.every(result => result === true);
    
    if (!allSuccessful) {
      console.warn("Some images could not be deleted");
    }
    
    return {
      success: allSuccessful,
      deletedCount: results.filter(result => result === true).length,
      totalCount: imageIds.length
    };
  } catch (error) {
    console.error("Error in bulkDeleteGeneratedImages:", error);
    return {
      success: false,
      deletedCount: 0,
      totalCount: imageIds.length
    };
  }
}
