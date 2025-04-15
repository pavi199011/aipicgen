
import { AuthUser } from "@/contexts/auth";
import ProfileTabs from "./ProfileTabs";

interface ProfileContentProps {
  user: AuthUser;
}

const ProfileContent = ({ user }: ProfileContentProps) => {
  return (
    <main className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <ProfileTabs user={user} />
    </main>
  );
};

export default ProfileContent;
