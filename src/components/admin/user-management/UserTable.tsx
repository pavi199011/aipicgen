
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortField, User, UserSortState } from "@/types/admin";
import { ArrowUpDown, Ban, Eye, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserTableProps {
  users: User[];
  sortState: UserSortState;
  onSort: (field: SortField) => void;
  onUserSelect: (user: User) => void;
  onConfirmDelete: (userId: string) => void;
  onConfirmSuspend: (userId: string) => void;
}

export const UserTable = ({
  users,
  sortState,
  onSort,
  onUserSelect,
  onConfirmDelete,
  onConfirmSuspend
}: UserTableProps) => {
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
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-gray-300 mb-2" />
                    No users match your filters
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
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
                    {user.is_suspended ? (
                      <Badge variant="destructive">Suspended</Badge>
                    ) : (
                      <Badge variant="success" className="bg-green-500">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onUserSelect(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant={user.is_suspended ? "default" : "secondary"} 
                        size="sm"
                        onClick={() => onConfirmSuspend(user.id)}
                        title={user.is_suspended ? "Unsuspend user" : "Suspend user"}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => onConfirmDelete(user.id)}
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
