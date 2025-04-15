
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === "username" ? "opacity-100" : "opacity-50"}`} />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("email")} className="p-0 text-left font-medium">
                  Email
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === "email" ? "opacity-100" : "opacity-50"}`} />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => onSort("created_at")} className="p-0 text-left font-medium">
                  Joined
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === "created_at" ? "opacity-100" : "opacity-50"}`} />
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" onClick={() => onSort("imageCount")} className="p-0 text-left font-medium">
                  Images
                  <ArrowUpDown className={`ml-2 h-4 w-4 ${sortState.field === "imageCount" ? "opacity-100" : "opacity-50"}`} />
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
                  <TableCell className="text-right">{user.imageCount}</TableCell>
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
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <UserDetailDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default UsersTable;
