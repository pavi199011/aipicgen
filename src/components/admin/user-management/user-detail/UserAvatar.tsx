
import { UserDetailData } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: UserDetailData;
}

const UserAvatar = ({ user }: UserAvatarProps) => {
  const getUserInitials = () => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <Avatar className="h-20 w-20">
      <AvatarImage src={user.avatarUrl || user.avatar_url || ""} alt={user.username || "User"} />
      <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
