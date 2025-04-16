
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

    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error("Error fetching count:", countError);
      throw countError;
    }
    
    console.log("Total user count:", count);
    return count || 0;
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
    
    // Query the profiles table directly for user information
    let query = supabase
      .from("profiles")
      .select(`
        id, 
        username, 
        full_name, 
        created_at, 
        avatar_url, 
        is_admin, 
        is_active
      `)
      .range(start, end);

    // Apply filters if provided
    if (filters.username) {
      query = query.ilike("username", `%${filters.username}%`);
    }

    // Apply sorting (with fallback to created_at if the sort field doesn't exist in profiles)
    if (sort.field === 'image_count') {
      // For image_count, we need special handling since it's not in profiles
      // This can be enhanced later by joining with a count from generated_images
      query = query.order('created_at', { 
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

    // Post-process the data to add image_count
    // In a real app, you'd want to do this properly via a join or subquery
    const usersWithImageCount = data?.map(user => ({
      ...user,
      image_count: 0 // Default value, ideally we'd fetch this from another query
    })) || [];

    console.log("Fetched user data:", usersWithImageCount);
    return usersWithImageCount;
  };

  return {
    fetchTotalUserCount,
    fetchUserData
  };
}
