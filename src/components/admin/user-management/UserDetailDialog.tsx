
import { UserDetailData } from "@/types/admin";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserDetailContent from "./user-detail/UserDetailContent";

interface UserDetailDialogProps {
  user: UserDetailData;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate?: (updatedUser: UserDetailData) => void;
  onUserDeleted?: () => void;
}

const UserDetailDialog = ({ 
  user, 
  isOpen, 
  onClose, 
  onUserUpdate,
  onUserDeleted
}: UserDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <UserDetailContent 
          user={user} 
          onClose={onClose} 
          onUserUpdate={onUserUpdate}
          onUserDeleted={onUserDeleted}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
