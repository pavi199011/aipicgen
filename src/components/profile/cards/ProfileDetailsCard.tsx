import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthUser } from "@/contexts/auth";

interface ProfileDetailsCardProps {
  user: AuthUser;
}

const ProfileDetailsCard = ({ user }: ProfileDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>
          Your personal information associated with your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm text-gray-500">{user.email || "No email provided"}</p>
        </div>
        {user.username && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Username</p>
            <p className="text-sm text-gray-500">{user.username}</p>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-sm font-medium">User ID</p>
          <p className="text-sm text-gray-500 break-all">{user.id}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetailsCard;
