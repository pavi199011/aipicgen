
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
      .from("user_statistics")
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
    
    let query = supabase
      .from("user_statistics")
      .select("id, username, full_name, created_at, image_count, avatar_url, is_admin")
      .range(start, end);

    // Apply filters if provided
    if (filters.username) {
      query = query.ilike("username", `%${filters.username}%`);
    }

    // Apply sorting
    query = query.order(sort.field, { 
      ascending: sort.direction === "asc" 
    });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      throw error;
    }

    console.log("Fetched user data:", data);
    return data || [];
  };

  return {
    fetchTotalUserCount,
    fetchUserData
  };
}
