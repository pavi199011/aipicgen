
import { useState } from "react";
import { UserDetailData } from "@/types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserDetailDialog from "../UserDetailDialog";

interface UserDetailsDialogProps {
  selectedUser: UserDetailData | null;
  onClose: () => void;
  onUserUpdated: () => void;
}

export const UserDetailsDialog = ({ 
  selectedUser, 
  onClose, 
  onUserUpdated 
}: UserDetailsDialogProps) => {
  if (!selectedUser) return null;

  return (
    <Dialog open={!!selectedUser} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <UserDetailDialog 
          user={selectedUser} 
          onClose={onClose} 
          onUserUpdated={onUserUpdated}
        />
      </DialogContent>
    </Dialog>
  );
};

export const useUserDetails = () => {
  const [selectedUser, setSelectedUser] = useState<UserDetailData | null>(null);

  const handleShowDetails = (user: UserDetailData) => {
    setSelectedUser(user);
  };

  const handleCloseDetails = () => {
    setSelectedUser(null);
  };

  return {
    selectedUser,
    handleShowDetails,
    handleCloseDetails
  };
};
