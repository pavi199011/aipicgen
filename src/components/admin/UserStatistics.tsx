
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SortDirection, SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";
import { UserDetailView } from "./UserDetailView";
import { UserStatsFilter } from "./user-statistics/UserStatsFilter";
import { UserStatsTable } from "./user-statistics/UserStatsTable";
import { UserStatsPagination } from "./user-statistics/UserStatsPagination";
import { UserSummary } from "./user-management/UserSummary";

interface UserStatisticsProps {
  userStats: UserStats[];
  loadingStats: boolean;
  onDeleteUser?: (userId: string) => void;
}

export const UserStatistics = ({ 
  userStats, 
  loadingStats,
  onDeleteUser = () => {} 
}: UserStatisticsProps) => {
  const [sortState, setSortState] = useState<UserSortState>({
    field: "imageCount",
    direction: "desc"
  });
  
  const [filterState, setFilterState] = useState<UserFilterState>({
    username: ""
  });

  const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    setSortState({
      field,
      direction: sortState.field === field && sortState.direction === "asc" ? "desc" : "asc"
    });
  };

  const handleFilterChange = (field: keyof UserFilterState, value: string) => {
    setFilterState({
      ...filterState,
      [field]: value
    });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const openUserDetail = (user: UserStats) => {
    setSelectedUser(user);
    setDetailViewOpen(true);
  };

  const closeUserDetail = () => {
    setDetailViewOpen(false);
    // Clear the selection after animation completes
    setTimeout(() => setSelectedUser(null), 300);
  };

  // Convert UserStats to User for the detail view
  const selectedUserAsUser = selectedUser ? {
    id: selectedUser.id,
    email: selectedUser.email,
    username: selectedUser.username,
    created_at: new Date().toISOString() // We don't have this in stats, using current date as fallback
  } : null;

  // Filter users based on the filter state
  const filteredUsers = userStats.filter(user => {
    const username = user.username?.toLowerCase() || '';
    return username.includes(filterState.username.toLowerCase());
  });

  // Sort users based on the sort state
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const direction = sortState.direction === "asc" ? 1 : -1;
    
    switch (sortState.field) {
      case "username":
        const usernameA = a.username?.toLowerCase() || '';
        const usernameB = b.username?.toLowerCase() || '';
        return usernameA.localeCompare(usernameB) * direction;
      case "imageCount":
        return (a.imageCount - b.imageCount) * direction;
      default:
        return 0;
    }
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredUsers.length);

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">User Statistics</h2>
      
      {loadingStats ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <UserStatsFilter 
            filterState={filterState}
            onFilterChange={handleFilterChange}
          />
          
          <UserStatsTable 
            paginatedUsers={paginatedUsers}
            sortState={sortState}
            onSort={handleSort}
            onUserSelect={openUserDetail}
            filteredUsers={filteredUsers}
          />
          
          <UserStatsPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          
          <UserSummary 
            currentCount={paginatedUsers.length}
            filteredCount={filteredUsers.length}
            totalCount={userStats.length}
            startIndex={startIndex}
            endIndex={endIndex}
          />
        </div>
      )}

      {/* User Detail View */}
      <UserDetailView 
        user={selectedUserAsUser}
        userStats={selectedUser}
        open={detailViewOpen}
        onClose={closeUserDetail}
        onDeleteUser={onDeleteUser}
      />
    </>
  );
};
