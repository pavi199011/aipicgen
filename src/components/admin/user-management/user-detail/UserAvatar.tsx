
import { UserDetailData } from "@/types/admin";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: UserDetailData;
  size?: string;
}

const UserAvatar = ({ user, size }: UserAvatarProps) => {
  const getUserInitials = () => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  // Apply size class based on the size prop
  const sizeClass = size === "xl" ? "h-20 w-20" : "h-10 w-10";

  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={user.avatar_url || ""} alt={user.username || "User"} />
      <AvatarFallback className={size === "xl" ? "text-lg" : ""}>{getUserInitials()}</AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
