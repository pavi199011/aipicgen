
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortDirection, SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";
import { ArrowUpDown, Trash2, Users } from "lucide-react";
import { UserDetailView } from "./UserDetailView";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) return null;
    return <ArrowUpDown className={`ml-1 h-4 w-4 ${sortState.direction === "asc" ? "rotate-0" : "rotate-180"}`} />;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (sortedUsers.length <= itemsPerPage) return null;
    
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            // Show pages around current page
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <PaginationItem key={pageNum}>
                <PaginationLink 
                  isActive={pageNum === currentPage}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
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
                  {currentUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center">
                          <Users className="h-8 w-8 text-gray-300 mb-2" />
                          {filteredUsers.length === 0 ? 
                            "No users match your filters" : 
                            "No users on this page"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentUsers.map((user) => (
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
          
          {renderPagination()}
          
          <div className="text-sm text-muted-foreground">
            Showing {currentUsers.length > 0 ? `${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, sortedUsers.length)}` : "0"} of {sortedUsers.length} users
            {users.length !== sortedUsers.length && ` (filtered from ${users.length})`}
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
