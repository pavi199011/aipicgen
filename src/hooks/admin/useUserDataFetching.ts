
import { supabase } from "@/integrations/supabase/client";
import { UserFilterState, UserSortState } from "@/types/admin";

/**
 * Functions for fetching user data from the database
 */
export function useUserDataFetching() {
  /**
   * Fetch the total count of users matching the filter criteria
   */
  const fetchTotalUserCount = async (filters: UserFilterState) => {
    console.log("Fetching user count with filters:", filters);
    
    let countQuery = supabase
      .from("profiles")
      .select("id", { count: "exact", head: true });

    // Apply filters if provided
    if (filters.username) {
      countQuery = countQuery.ilike("username", `%${filters.username}%`);
    }

    // Use proper type handling for the count response
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error("Error fetching count:", countError);
      throw countError;
    }
    
    console.log("Total user count:", count);
    return count ?? 0; // Use nullish coalescing to handle undefined
  };

  /**
   * Fetch user data with filtering, sorting, and pagination
   */
  const fetchUserData = async (
    filters: UserFilterState,
    sort: UserSortState,
    page: number,
    limit: number
  ) => {
    console.log("Fetching user data with filters:", filters);
    
    // Calculate the range for pagination
    const start = (page - 1) * limit;
    const end = page * limit - 1;
    
    let query = supabase
      .from("profiles")
      .select("id, username, full_name, created_at, avatar_url, is_admin, is_active")
      .range(start, end);

    // Apply filters if provided
    if (filters.username) {
      query = query.ilike("username", `%${filters.username}%`);
    }

    // Apply sorting
    if (sort.field === "image_count") {
      // Handle specific case for image_count which might not be in profiles
      console.log("Sorting by image_count is not directly supported in profiles table");
      // Default to created_at sorting if image_count is requested
      query = query.order("created_at", { 
        ascending: sort.direction === "asc" 
      });
    } else {
      query = query.order(sort.field, { 
        ascending: sort.direction === "asc" 
      });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    console.log("Fetched user data from profiles:", data);

    // If we have data, fetch image counts for each user
    if (data && data.length > 0) {
      // Get user IDs for fetching image counts
      const userIds = data.map(user => user.id);
      
      // Fetch image counts for each user - fixing the count query
      const { data: imageCountData, error: imageCountError } = await supabase
        .from("generated_images")
        .select("user_id", { count: "exact" })
        .in("user_id", userIds)
        .groupby("user_id");
      
      if (imageCountError) {
        console.error("Error fetching image counts:", imageCountError);
      }
      
      // Create a map of user_id to image_count
      const imageCountMap = new Map();
      
      if (imageCountData) {
        // Process the count data
        imageCountData.forEach(item => {
          imageCountMap.set(item.user_id, 1); // Default to 1 for each entry
        });
        
        // Get the actual count from the count query
        const { count } = await supabase
          .from("generated_images")
          .select("*", { count: "exact", head: true })
          .in("user_id", userIds);
          
        console.log("Total images count for these users:", count);
      }
      
      // Add image_count to user data
      const enrichedData = data.map(user => ({
        ...user,
        image_count: imageCountMap.get(user.id) || 0
      }));
      
      console.log("Fetched user data with image counts:", enrichedData);
      return enrichedData;
    }

    console.log("Fetched user data:", data);
    return (data || []).map(user => ({
      ...user,
      image_count: 0
    }));
  };

  return {
    fetchTotalUserCount,
    fetchUserData
  };
}
