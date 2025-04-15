
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { UserDetailData } from "@/types/admin";
import UserEmail from "./UserEmail";
import { UserX, UserCheck, Trash2 } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface UserTableRowsProps {
  users: UserDetailData[];
  isLoading: boolean;
  onShowDetails: (user: UserDetailData) => void;
  onSuspendUser?: (userId: string) => void;
  onUnsuspendUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

const UserTableRows = ({ 
  users, 
  isLoading, 
  onShowDetails,
  onSuspendUser,
  onUnsuspendUser,
  onDeleteUser
}: UserTableRowsProps) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={7} className="h-24 text-center">
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
          <TableCell colSpan={7} className="h-24 text-center">
            No users found.
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {users.map((user) => (
        <TableRow key={user.id} className="hover:bg-gray-50">
          <TableCell className="font-medium">
            <div 
              className="cursor-pointer hover:underline"
              onClick={() => onShowDetails(user)}
            >
              {user.username || "N/A"}
            </div>
          </TableCell>
          <TableCell><UserEmail email={user.email} /></TableCell>
          <TableCell>
            {user.created_at 
              ? formatDistanceToNow(new Date(user.created_at), { addSuffix: true }) 
              : "N/A"}
          </TableCell>
          <TableCell className="text-right">{user.image_count}</TableCell>
          <TableCell>
            {user.is_suspended ? (
              <Badge variant="destructive" className="ml-auto">Suspended</Badge>
            ) : (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 ml-auto">Active</Badge>
            )}
          </TableCell>
          <TableCell className="text-right">
            <div className="flex items-center justify-end space-x-1">
              <TooltipProvider>
                {!user.is_suspended ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onSuspendUser?.(user.id)}
                      >
                        <UserX className="h-4 w-4 text-red-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Suspend user</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => onUnsuspendUser?.(user.id)}
                      >
                        <UserCheck className="h-4 w-4 text-green-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unsuspend user</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onDeleteUser?.(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete user</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => onShowDetails(user)}
                    >
                      <span className="text-xs font-medium">Details</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View user details</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default UserTableRows;
