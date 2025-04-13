
import { useState } from "react";
import { User, UserStats } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User as UserIcon,
  Mail,
  Calendar,
  Image,
  Trash2,
  X
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserDetailViewProps {
  user: User | null;
  userStats: UserStats | null;
  open: boolean;
  onClose: () => void;
  onDeleteUser: (userId: string) => void;
}

export const UserDetailView = ({ 
  user, 
  userStats, 
  open, 
  onClose, 
  onDeleteUser 
}: UserDetailViewProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!user) return null;

  const handleDelete = () => {
    onDeleteUser(user.id);
    setDeleteConfirmOpen(false);
    onClose();
  };

  // Combine the user and userStats data
  const userData = {
    ...user,
    imageCount: userStats?.imageCount || 0
  };

  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <span>User Details</span>
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4" 
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={userData.username || "User"} />
                <AvatarFallback className="text-lg">
                  {getInitials(userData.username)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{userData.username || "No Username"}</h3>
                {userData.email && (
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                )}
              </div>
            </div>

            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">User ID:</span>
                  <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                    {userData.id}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(userData.created_at)}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Images Generated:</span>
                  <span className="text-sm text-muted-foreground">
                    {userData.imageCount}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button 
                variant="destructive"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
