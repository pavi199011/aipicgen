
import { useAuth } from "@/contexts/auth";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const ProfileHeader = () => {
  const { user, signOut } = useAuth();
  
  if (!user) return null;
  
  return <DashboardHeader user={user} signOut={signOut} />;
};

export default ProfileHeader;
