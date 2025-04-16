
import { useEffect } from "react";
import { User, UserDetailData } from "@/types/admin";
import UsersTable from "./user-management/UsersTable";
import UserFilters from "./user-management/UserFilters";
import { useToast } from "@/hooks/use-toast";
import { useUserEmails } from "@/hooks/admin/useUserEmails";
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

  // Extract user IDs for email fetching
  const userIds = users?.map(user => user.id) || [];
  
  // Fetch emails for the current users
  const { emails, loading: emailsLoading } = useUserEmails(userIds);

  // Handle errors from user management only (not email fetching)
  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching users",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Combine user data with emails
  const usersWithEmails = users?.map(user => ({
    ...user,
    email: emails[user.id] || "N/A"
  })) || [];

  // Overall loading state includes both user data and email fetching
  const isDataLoading = isLoading || emailsLoading;

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
        users={usersWithEmails} 
        isLoading={isDataLoading}
        sortState={sortState}
        onSort={handleSort}
        onRefresh={refetch}
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
