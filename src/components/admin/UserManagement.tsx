import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortDirection, SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";
import { ArrowUpDown, Trash2 } from "lucide-react";
import { UserDetailView } from "./UserDetailView";

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

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) return null;
    return <ArrowUpDown className={`ml-1 h-4 w-4 ${sortState.direction === "asc" ? "rotate-0" : "rotate-180"}`} />;
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      {loading ? (
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
                      onClick={() => handleSort("created_at")}
                    >
                      <div className="flex items-center">
                        Created At
                        {getSortIcon("created_at")}
                      </div>
                    </TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
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
                        <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => onDeleteUser(user.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <div className="text-sm text-muted-foreground">
            Showing {sortedUsers.length} of {users.length} users
          </div>
        </div>
      )}

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
