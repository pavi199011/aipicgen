
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserDetailData, UserFilterState, UserSortState } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

export function useUserManagement() {
  const { toast } = useToast();
  const [sortState, setSortState] = useState<UserSortState>({ 
    field: "created_at", 
    direction: "desc" 
  });
  const [filterState, setFilterState] = useState<UserFilterState>({ 
    username: "" 
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users", sortState, filterState, currentPage],
    queryFn: async () => {
      // First get total count for pagination
      let countQuery = supabase
        .from("user_details_view")
        .select("id", { count: "exact", head: true });

      // Apply filters if provided
      if (filterState.username) {
        countQuery = countQuery.ilike("username", `%${filterState.username}%`);
      }

      const { count, error: countError } = await countQuery;
      
      if (countError) {
        throw countError;
      }
      
      // Calculate total pages
      const calculatedTotalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
      setTotalPages(calculatedTotalPages);
      
      // Adjust current page if it's beyond the total pages
      if (currentPage > calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages);
      }

      // Now fetch the actual data with pagination
      let query = supabase
        .from("user_details_view")
        .select("*")
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

      // Apply filters if provided
      if (filterState.username) {
        query = query.ilike("username", `%${filterState.username}%`);
      }

      // Apply sorting
      query = query.order(sortState.field, { 
        ascending: sortState.direction === "asc" 
      });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      console.log("Fetched users data:", data);
      
      // Transform the data to conform to UserDetailData interface
      // We need to handle the credits field since it might not be in the view yet
      // Get the profiles data for credits
      const userIds = data.map(user => user.id);
      
      let credits = {};
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, credits")
          .in("id", userIds);
        
        if (!profilesError && profilesData) {
          // Create a lookup map for credits by user id
          credits = profilesData.reduce((acc, profile) => {
            acc[profile.id] = profile.credits || 0;
            return acc;
          }, {});
        }
      }
      
      // Transform the data to include credits
      const transformedData: UserDetailData[] = data.map(user => ({
        id: user.id || "",
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        created_at: user.created_at || "",
        image_count: user.image_count || 0,
        is_active: user.is_active,
        is_admin: user.is_admin,
        avatar_url: user.avatar_url,
        credits: credits[user.id] || 0
      }));
      
      return transformedData;
    },
    // Set a very short stale time to ensure immediate refreshes after user status updates
    staleTime: 0,
  });

  const handleSort = (field: UserSortState["field"]) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const handleFilter = (filters: UserFilterState) => {
    setFilterState(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return {
    users,
    isLoading,
    error,
    refetch,
    sortState,
    filterState,
    currentPage,
    totalPages,
    handleSort,
    handleFilter,
    handlePageChange,
  };
}
