
import { useEffect } from "react";
import { UserDetailData } from "@/types/admin";
import UsersTable from "./user-management/UsersTable";
import UserFilters from "./user-management/UserFilters";
import { useToast } from "@/hooks/use-toast";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import UserPagination from "./user-management/UserPagination";

const UserManagement = () => {
  const { toast } = useToast();
  const {
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
  } = useUserManagement();

  // Handle errors from user management
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching users",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleUserUpdate = (updatedUser: UserDetailData) => {
    // After a user is updated, refresh the user list to reflect the changes
    refetch();
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
        onUserUpdate={handleUserUpdate}
      />
      
      <UserPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default UserManagement;
