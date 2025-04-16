
import { UserDetailData } from "@/types/admin";
import { format } from "date-fns";

interface UserMetadataProps {
  user: UserDetailData;
}

const UserMetadata = ({ user }: UserMetadataProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">User ID</p>
        <p className="text-sm font-mono break-all">{user.id}</p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">Joined</p>
        <p className="text-sm">
          {user.created_at 
            ? format(new Date(user.created_at), "PPP 'at' p") 
            : "Unknown"}
        </p>
      </div>
      
      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-500">Images Generated</p>
        <p className="text-sm">{user.image_count}</p>
      </div>
    </div>
  );
};

export default UserMetadata;
