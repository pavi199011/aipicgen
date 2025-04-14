
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  username?: string;
  size?: "sm" | "md" | "lg";
}

export const UserAvatar = ({ username, size = "md" }: UserAvatarProps) => {
  // Get initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };
  
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-20 w-20"
  };
  
  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src="" alt={username || "User"} />
      <AvatarFallback className="text-lg">
        {getInitials(username)}
      </AvatarFallback>
    </Avatar>
  );
};
