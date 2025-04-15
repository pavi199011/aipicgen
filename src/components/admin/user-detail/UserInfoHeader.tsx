
import { UserAvatar } from "./UserAvatar";

interface UserInfoHeaderProps {
  username?: string;
  email?: string;
  full_name?: string;
}

export const UserInfoHeader = ({ username, email, full_name }: UserInfoHeaderProps) => {
  return (
    <div className="flex items-center space-x-4">
      <UserAvatar username={username} />
      <div>
        <h3 className="text-xl font-semibold">{full_name || username || "No Username"}</h3>
        {username && full_name && username !== full_name && (
          <p className="text-sm font-medium">@{username}</p>
        )}
        {email && (
          <p className="text-sm text-muted-foreground">{email}</p>
        )}
      </div>
    </div>
  );
};
