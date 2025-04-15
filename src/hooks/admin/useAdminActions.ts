
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

/**
 * Hook for admin actions like signout
 */
export function useAdminActions() {
  const { adminLogout } = useAdminAuth();
  const { toast } = useToast();

  const handleSignOut = () => {
    adminLogout();
    toast({
      title: "Signed Out",
      description: "You have been signed out of the admin portal",
    });
  };

  return {
    handleSignOut
  };
}
