
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { UserDetailData } from "@/types/admin";
import UserEmail from "./UserEmail";

interface UserTableRowsProps {
  users: UserDetailData[];
  isLoading: boolean;
  onShowDetails: (user: UserDetailData) => void;
}

const UserTableRows = ({ users, isLoading, onShowDetails }: UserTableRowsProps) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            Loading users...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (users.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={6} className="h-24 text-center">
            No users found.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {users.map((user) => (
        <TableRow key={user.id} className="cursor-pointer hover:bg-gray-50" onClick={() => onShowDetails(user)}>
          <TableCell className="font-medium">{user.username || "N/A"}</TableCell>
          <TableCell>
            <UserEmail email={user.email} />
          </TableCell>
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
              onShowDetails(user);
            }}>
              Details
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default UserTableRows;
