
import { UserDetailData } from "@/types/admin";
import { Button } from "@/components/ui/button";
import UserAvatar from "./UserAvatar";
import UserBasicInfo from "./UserBasicInfo";
import UserMetadata from "./UserMetadata";

interface UserDetailContentProps {
  user: UserDetailData;
  onClose: () => void;
}

const UserDetailContent = ({ user, onClose }: UserDetailContentProps) => {
  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
        <UserAvatar user={user} />
        <UserBasicInfo user={user} />
      </div>
      
      <UserMetadata user={user} />
      
      <div className="flex justify-end space-x-2">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserDetailContent;
