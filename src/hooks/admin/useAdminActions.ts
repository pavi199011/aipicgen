
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useNavigate } from "react-router-dom";

/**
 * Hook for admin actions like signout
 */
export function useAdminActions() {
  const { adminLogout } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = () => {
    adminLogout();
    toast({
      title: "Signed Out",
      description: "You have been signed out of the admin portal",
    });
    // Navigate to login page after logout
    navigate("/admin/login");
  };

  return {
    handleSignOut
  };
}
