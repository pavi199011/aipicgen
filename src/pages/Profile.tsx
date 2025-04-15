
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileContent from "@/components/profile/ProfileContent";

const Profile = () => {
  const { user } = useAuth();
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />
      {/* Pass user directly without type conversion, ProfileContent should handle the correct type */}
      <ProfileContent user={user} />
    </div>
  );
};

export default Profile;
