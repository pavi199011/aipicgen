
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, UserDetailData, UserSortState, UserFilterState } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { useUserEmails } from "./admin/useUserEmails";

export function useAdminUserManagement() {
  const { toast } = useToast();
  const { fetchUserEmails } = useUserEmails();
  
  // State management
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

  // Fetch user data with react-query
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users", sortState, filterState, currentPage],
    queryFn: async () => {
      try {
        // Get total count for pagination
        const totalCount = await fetchTotalUserCount(filterState);
        
        // Calculate total pages
        const calculatedTotalPages = Math.max(1, Math.ceil(totalCount / pageSize));
        setTotalPages(calculatedTotalPages);
        
        // Adjust current page if it's beyond the total pages
        if (currentPage > calculatedTotalPages) {
          setCurrentPage(calculatedTotalPages);
        }
        
        // Fetch the user data for the current page
        const userData = await fetchUserData(filterState, sortState, currentPage, pageSize);
        
        // If we have user data, fetch the email addresses
        if (userData && userData.length > 0) {
          return await fetchUserEmails(userData);
        }
        
        return userData as UserDetailData[];
      } catch (error) {
        console.error("Error in useAdminUserManagement query:", error);
        throw error;
      }
    },
  });

  // Handle sort state changes
  const handleSort = (field: UserSortState["field"]) => {
    setSortState(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  // Handle filter state changes
  const handleFilter = (filters: UserFilterState) => {
    setFilterState(filters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  /**
   * Generate page numbers for pagination display
   */
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageItems = 5;
    
    if (totalPages <= maxPageItems) {
      // Show all pages if there are few pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at start or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push("ellipsis1");
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("ellipsis2");
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return {
    users,
    isLoading,
    sortState,
    filterState,
    currentPage,
    totalPages,
    handleSort,
    handleFilter,
    handlePageChange,
    refetch,
    getPageNumbers
  };
}
