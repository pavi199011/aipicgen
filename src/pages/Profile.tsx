
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProfileContent from "@/components/profile/ProfileContent";

const Profile = () => {
  const { user, signOut } = useAuth();
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} signOut={signOut} />
      <ProfileContent user={user} />
    </div>
  );
};

export default Profile;
