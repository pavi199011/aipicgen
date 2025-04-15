
import { useAdminUserManagement } from "@/hooks/useAdminUserManagement";
import UsersTable from "./user-management/UsersTable";
import UserFilters from "./user-management/UserFilters";
import UserPagination from "./user-management/UserPagination";

const UserManagement = () => {
  const {
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
  } = useAdminUserManagement();

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
      
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        getPageNumbers={getPageNumbers}
      />
    </div>
  );
};

export default UserManagement;
