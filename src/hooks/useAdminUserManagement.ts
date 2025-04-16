
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, UserDetailData, UserSortState, UserFilterState } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { useUserEmails } from "./admin/useUserEmails";
import { 
  usePagination, 
  useUserDataFetching,
  useUserDataQuery
} from "./admin/useUserManagementUtils";

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

  // Pagination hooks
  const { 
    currentPage, 
    totalPages, 
    setCurrentPage, 
    setTotalPages,
    getPageNumbers
  } = usePagination();

  // User data fetching utilities
  const { 
    fetchTotalUserCount,
    fetchUserData
  } = useUserDataFetching();

  // Handle data fetching with react-query
  const { 
    data: users, 
    isLoading, 
    error, 
    refetch 
  } = useUserDataQuery({
    sortState,
    filterState,
    currentPage,
    fetchTotalUserCount,
    fetchUserData,
    fetchUserEmails,
    setTotalPages,
    setCurrentPage
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
