
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, UserDetailData, UserSortState, UserFilterState } from "@/types/admin";
import UsersTable from "./user-management/UsersTable";
import UserFilters from "./user-management/UserFilters";
import { useToast } from "@/hooks/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const UserManagement = () => {
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

  // Fetch user statistics from our view with pagination
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users", sortState, filterState, currentPage],
    queryFn: async () => {
      console.log("Fetching user data with filters:", filterState);
      
      // First get total count for pagination
      let countQuery = supabase
        .from("user_statistics")
        .select("id", { count: "exact", head: true });

      // Apply filters if provided
      if (filterState.username) {
        countQuery = countQuery.ilike("username", `%${filterState.username}%`);
      }

      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error("Error fetching count:", countError);
        throw countError;
      }
      
      console.log("Total user count:", count);
      
      // Calculate total pages
      const calculatedTotalPages = Math.max(1, Math.ceil((count || 0) / pageSize));
      setTotalPages(calculatedTotalPages);
      
      // Adjust current page if it's beyond the total pages
      if (currentPage > calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages);
      }

      // Now fetch the actual data with pagination
      // Only select columns that are actually in user_statistics view
      let query = supabase
        .from("user_statistics")
        .select("id, username, full_name, created_at, image_count, avatar_url, is_admin")
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
        console.error("Error fetching users:", error);
        throw error;
      }

      console.log("Fetched user data:", data);
      
      // After getting the stats, fetch email data from auth.users table
      // We need to get emails from profiles since they're not in user_statistics
      if (data && data.length > 0) {
        try {
          // Get emails from profiles table through a separate query for the same users
          const userIds = data.map(user => user.id);
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email')
            .in('id', userIds);
            
          if (profilesError) {
            console.error("Error fetching emails:", profilesError);
          } else if (profilesData) {
            // Create a mapping of user IDs to emails
            const emailMap = profilesData.reduce((map, profile) => {
              if (profile.id) {
                map[profile.id] = profile.email || null;
              }
              return map;
            }, {} as Record<string, string | null>);
            
            // Merge the email data with the user data
            const usersWithEmail = data.map(user => ({
              ...user,
              email: emailMap[user.id || ''] || null
            }));
            
            return usersWithEmail as UserDetailData[];
          }
        } catch (emailError) {
          console.error("Error processing emails:", emailError);
        }
      }
      
      // Return the data without emails if we couldn't fetch them
      return data as UserDetailData[];
    },
  });

  // Handle errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching users",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

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

  // Generate page numbers for pagination
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-500">View and manage all registered users</p>
        </div>
        
        <UserFilters onFilter={handleFilter} />
      </div>
      
      <UsersTable 
        users={users || []} 
        isLoading={isLoading}
        sortState={sortState}
        onSort={handleSort}
        onRefresh={refetch}
      />
      
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((page, index) => (
                typeof page === "number" ? (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => handlePageChange(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
