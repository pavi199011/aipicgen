
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortDirection, SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";
import { ArrowUpDown } from "lucide-react";
import { UserDetailView } from "./UserDetailView";

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

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) return null;
    return <ArrowUpDown className={`ml-1 h-4 w-4 ${sortState.direction === "asc" ? "rotate-0" : "rotate-180"}`} />;
  };

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
          <div className="flex items-center">
            <Input
              placeholder="Filter by username"
              value={filterState.username}
              onChange={(e) => handleFilterChange("username", e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("username")}
                    >
                      <div className="flex items-center">
                        Username
                        {getSortIcon("username")}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer"
                      onClick={() => handleSort("imageCount")}
                    >
                      <div className="flex items-center">
                        Images Generated
                        {getSortIcon("imageCount")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                        No users match your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <button 
                            onClick={() => openUserDetail(user)}
                            className="text-primary hover:underline focus:outline-none focus:underline"
                          >
                            {user.username || 'No username'}
                          </button>
                        </TableCell>
                        <TableCell>{user.imageCount}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="text-sm text-muted-foreground">
            Showing {sortedUsers.length} of {userStats.length} users
          </div>
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
