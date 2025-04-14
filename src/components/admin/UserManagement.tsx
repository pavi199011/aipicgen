
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";
import { UserDetailView } from "./UserDetailView";
import { UserTable } from "./user-management/UserTable";
import { UserFilter } from "./user-management/UserFilter";
import { UserPagination } from "./user-management/UserPagination";
import { UserSummary } from "./user-management/UserSummary";

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
  const [sortState, setSortState] = useState<UserSortState>({
    field: "created_at",
    direction: "desc"
  });
  
  const [filterState, setFilterState] = useState<UserFilterState>({
    username: ""
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log("UserManagement rendering with users:", users);

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

  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setDetailViewOpen(true);
  };

  const closeUserDetail = () => {
    setDetailViewOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  const getSelectedUserStats = (): UserStats | null => {
    if (!selectedUser) return null;
    return userStats.find(stat => stat.id === selectedUser.id) || null;
  };

  const filteredUsers = users.filter(user => {
    const username = user.username?.toLowerCase() || '';
    return username.includes(filterState.username.toLowerCase());
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const direction = sortState.direction === "asc" ? 1 : -1;
    
    switch (sortState.field) {
      case "username":
        const usernameA = a.username?.toLowerCase() || '';
        const usernameB = b.username?.toLowerCase() || '';
        return usernameA.localeCompare(usernameB) * direction;
      case "created_at":
        return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * direction;
      default:
        return 0;
    }
  });

  // Get pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  if (loading) {
    return (
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
          itemsPerPage={itemsPerPage}
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
          currentCount={Math.min(sortedUsers.length - indexOfFirstItem, itemsPerPage)}
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
