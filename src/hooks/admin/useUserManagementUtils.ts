
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserSortState, UserFilterState, UserDetailData } from "@/types/admin";

/**
 * Hook for managing pagination state and calculations
 */
export function usePagination(initialPage = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

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
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setTotalPages,
    getPageNumbers
  };
}

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

/**
 * Hook for the user data query with React Query
 */
export function useUserDataQuery({
  sortState,
  filterState,
  currentPage,
  fetchTotalUserCount,
  fetchUserData,
  fetchUserEmails,
  setTotalPages,
  setCurrentPage
}: {
  sortState: UserSortState;
  filterState: UserFilterState;
  currentPage: number;
  fetchTotalUserCount: (filters: UserFilterState) => Promise<number>;
  fetchUserData: (filters: UserFilterState, sort: UserSortState, page: number, limit: number) => Promise<any[]>;
  fetchUserEmails: (userData: any[]) => Promise<UserDetailData[]>;
  setTotalPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
}) {
  const pageSize = 10;

  return useQuery({
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
        console.error("Error in useUserDataQuery:", error);
        throw error;
      }
    },
  });
}
