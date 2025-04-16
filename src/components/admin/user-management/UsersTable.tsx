
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserDetailData, UserSortState } from "@/types/admin";
import { ArrowUpDown, RefreshCcw, Ban, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserDetailDialog from "./UserDetailDialog";
import { Badge } from "@/components/ui/badge";

interface UsersTableProps {
  users: UserDetailData[];
  isLoading: boolean;
  sortState: UserSortState;
  onSort: (field: UserSortState["field"]) => void;
  onRefresh: () => void;
}

const UsersTable = ({ users, isLoading, sortState, onSort, onRefresh }: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<UserDetailData | null>(null);

  const handleShowDetails = (user: UserDetailData) => {
    setSelectedUser(user);
  };

  const getSortIcon = (field: UserSortState["field"]) => {
    if (sortState.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-100" />;
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button variant="ghost" onClick={() => onSort("username")} className="p-0 text-left font-medium">
                  Username
                  {getSortIcon("username")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("email")} className="p-0 text-left font-medium">
                  Email
                  {getSortIcon("email")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("created_at")} className="p-0 text-left font-medium">
                  Joined
                  {getSortIcon("created_at")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => onSort("image_count")} className="p-0 text-left font-medium">
                  Images
                  {getSortIcon("image_count")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleShowDetails(user)}>
                  <TableCell className="font-medium">{user.username || "N/A"}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
                  <TableCell>
                    {user.created_at 
                      ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) 
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">{user.image_count}</TableCell>
                  <TableCell className="text-right">
                    {user.is_suspended ? (
                      <Badge variant="destructive" className="ml-auto">Suspended</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-auto">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8" onClick={(e) => {
                      e.stopPropagation();
                      handleShowDetails(user);
                    }}>
                      Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserDetailDialog
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </div>
  );
};

export default UsersTable;
