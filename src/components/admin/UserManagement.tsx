
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User, UserDetailData, UserSortState, UserFilterState } from "@/types/admin";
import UsersTable from "./user-management/UsersTable";
import UserFilters from "./user-management/UserFilters";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const { toast } = useToast();
  const [sortState, setSortState] = useState<UserSortState>({ 
    field: "created_at", 
    direction: "desc" 
  });
  const [filterState, setFilterState] = useState<UserFilterState>({ 
    username: "" 
  });

  // Fetch user statistics from our view
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users", sortState, filterState],
    queryFn: async () => {
      let query = supabase
        .from("user_statistics")
        .select("*");

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
    </div>
  );
};

export default UserManagement;
