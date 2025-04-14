
import { UserAvatar } from "./UserAvatar";

interface UserInfoHeaderProps {
  username?: string;
  email?: string;
}

export const UserInfoHeader = ({ username, email }: UserInfoHeaderProps) => {
  return (
    <div className="flex items-center space-x-4">
      <UserAvatar username={username} />
      <div>
        <h3 className="text-xl font-semibold">{username || "No Username"}</h3>
        {email && (
          <p className="text-sm text-muted-foreground">{email}</p>
        )}
      </div>
    </div>
  );
};
