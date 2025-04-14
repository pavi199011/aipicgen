
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortDirection, SortField, User, UserSortState } from "@/types/admin";
import { ArrowUpDown, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserTableProps {
  users: User[];
  currentPage: number;
  itemsPerPage: number;
  sortState: UserSortState;
  onSort: (field: SortField) => void;
  onUserSelect: (user: User) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserTable = ({
  users,
  currentPage,
  itemsPerPage,
  sortState,
  onSort,
  onUserSelect,
  onDeleteUser
}: UserTableProps) => {
  // Calculate pagination slices
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
  const indexOfLastItem = currentPage * itemsPerPage;
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);

  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) return null;
    return <ArrowUpDown className={`ml-1 h-4 w-4 ${sortState.direction === "asc" ? "rotate-0" : "rotate-180"}`} />;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("username")}
              >
                <div className="flex items-center">
                  Username
                  {getSortIcon("username")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => onSort("created_at")}
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
                    {users.length === 0 ? 
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
                      onClick={() => onUserSelect(user)}
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
  );
};
