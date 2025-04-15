
import { User, UserStats } from "@/types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UserInfoHeader } from "./user-detail/UserInfoHeader";
import { UserInfoCard } from "./user-detail/UserInfoCard";
import { DeleteUserButton } from "./user-detail/DeleteUserButton";

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
  if (!user) return null;

  const handleDelete = () => {
    onDeleteUser(user.id);
    onClose();
  };

  // Combine the user and userStats data
  const userData = {
    ...user,
    imageCount: userStats?.imageCount || 0
  };

  return (
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
          <UserInfoHeader 
            username={userData.username} 
            email={userData.email}
            full_name={userData.full_name} 
          />

          <UserInfoCard 
            id={userData.id}
            created_at={userData.created_at}
            imageCount={userData.imageCount}
            email={userData.email}
            full_name={userData.full_name}
          />

          <div className="flex justify-between">
            <DeleteUserButton onDelete={handleDelete} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
