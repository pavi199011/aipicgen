
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
    console.log("Current page:", page, "limit:", limit);
    
    // Calculate the range for pagination
    const start = (page - 1) * limit;
    const end = page * limit - 1;
    
    // Log the range for debugging
    console.log("Fetching range:", start, "to", end);
    
    // Use the admin method to fetch all profiles regardless of RLS
    let query = supabase
      .from("profiles")
      .select("id, username, full_name, created_at, avatar_url, is_admin, is_active");
      
    // Apply range for pagination
    query = query.range(start, end);

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

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    // Log fetched data
    console.log("Fetched user data from profiles:", data);
    console.log("Number of users fetched:", data?.length || 0);

    // If we have data, fetch image counts for each user
    if (data && data.length > 0) {
      // Get user IDs for fetching image counts
      const userIds = data.map(user => user.id);
      
      // Initialize image counts with default 0 for each user
      const imageCountMap = new Map(userIds.map(id => [id, 0]));
      
      try {
        // Fetch image counts for each user individually to avoid groupby
        for (const userId of userIds) {
          const { count } = await supabase
            .from("generated_images")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);
            
          // Store the count in our map
          imageCountMap.set(userId, count ?? 0);
        }
        
        console.log("Image counts fetched successfully:", Object.fromEntries(imageCountMap));
      } catch (countError) {
        console.error("Error fetching individual image counts:", countError);
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
