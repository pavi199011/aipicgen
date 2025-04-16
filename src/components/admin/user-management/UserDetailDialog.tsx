
import { UserDetailData } from "@/types/admin";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UserDetailContent from "./user-detail/UserDetailContent";

interface UserDetailDialogProps {
  user: UserDetailData;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate?: (updatedUser: UserDetailData) => void;
}

const UserDetailDialog = ({ user, isOpen, onClose, onUserUpdate }: UserDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <UserDetailContent 
          user={user} 
          onClose={onClose} 
          onUserUpdate={onUserUpdate}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailDialog;
