
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AdminCredentials } from "@/types/admin";
import { ADMIN_CREDENTIALS } from "@/components/admin/AdminConstants";

/**
 * Hook that provides admin authentication methods
 * @param setAdminAuthenticated Function to update admin authentication state
 */
export function useAdminAuthMethods(setAdminAuthenticated: (value: boolean) => void) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Authenticates an admin user
   * @param credentials Admin credentials (identifier and password)
   * @returns Object with success status and error if applicable
   */
  const adminLogin = async ({ identifier, password }: AdminCredentials) => {
    try {
      console.log("Admin login attempt:", identifier);
      setLoading(true);
      
      // Since admin_users table has been dropped, we'll use simplified admin authentication
      // Check if using our hardcoded admin credentials
      const isAdminUser = (
        identifier === ADMIN_CREDENTIALS.username || 
        identifier === ADMIN_CREDENTIALS.email
      ) && password === ADMIN_CREDENTIALS.password;
      
      if (isAdminUser) {
        setAdminAuthenticated(true);
        // Persist authentication state
        localStorage.setItem('adminAuthenticated', 'true');
        console.log("Admin authenticated via hardcoded credentials");
        return { success: true };
      }
        
      throw new Error('Invalid admin credentials');
      
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Logs out an admin user
   */
  const adminLogout = () => {
    console.log("Admin logout");
    setAdminAuthenticated(false);
    // Clear persisted authentication state
    localStorage.removeItem('adminAuthenticated');
    toast({
      title: "Logged Out",
      description: "You have been logged out of the admin portal",
    });
  };

  return {
    loading,
    adminLogin,
    adminLogout
  };
}
