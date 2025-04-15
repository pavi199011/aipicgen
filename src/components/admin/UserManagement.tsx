
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";
import { UserDetailView } from "./UserDetailView";
import { UserTable } from "./user-management/UserTable";
import { UserFilter } from "./user-management/UserFilter";
import { UserPagination } from "./user-management/UserPagination";
import { UserSummary } from "./user-management/UserSummary";
import { useUserManagement } from "./user-management/useUserManagement";

interface UserManagementProps {
  users: User[];
  loading: boolean;
  onDeleteUser: (userId: string) => void;
  userStats?: UserStats[]; // Optional stats for detailed view
}

export const UserManagement = ({ 
  users, 
  loading, 
  onDeleteUser,
  userStats = []
}: UserManagementProps) => {
  const {
    sortState,
    filterState,
    selectedUser,
    detailViewOpen,
    currentPage,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    sortedUsers,
    filteredUsers,
    handleSort,
    handleFilterChange,
    openUserDetail,
    closeUserDetail,
    setCurrentPage,
    getSelectedUserStats
  } = useUserManagement(users, userStats);

  if (loading) {
    return <UserLoadingSkeleton />;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="space-y-4">
        <UserFilter 
          filterState={filterState} 
          onFilterChange={handleFilterChange} 
        />
        
        <UserTable 
          users={sortedUsers}
          currentPage={currentPage}
          itemsPerPage={10}
          sortState={sortState}
          onSort={handleSort}
          onUserSelect={openUserDetail}
          onDeleteUser={onDeleteUser}
        />
        
        <UserPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        
        <UserSummary 
          currentCount={Math.min(sortedUsers.length - indexOfFirstItem, 10)}
          filteredCount={sortedUsers.length}
          totalCount={users.length}
          startIndex={indexOfFirstItem}
          endIndex={Math.min(indexOfLastItem, sortedUsers.length)}
        />
      </div>

      <UserDetailView 
        user={selectedUser}
        userStats={getSelectedUserStats()}
        open={detailViewOpen}
        onClose={closeUserDetail}
        onDeleteUser={onDeleteUser}
      />
    </>
  );
};

// Loading skeleton component
const UserLoadingSkeleton = () => (
  <>
    <h2 className="text-2xl font-bold mb-6">User Management</h2>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  </>
);
