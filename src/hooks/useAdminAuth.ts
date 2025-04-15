
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_CREDENTIALS } from "@/components/admin/AdminConstants";

export interface AdminCredentials {
  identifier: string; // Can be username or email
  password: string;
}

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const { toast } = useToast();

  // Check for existing admin authentication on mount
  useEffect(() => {
    console.log("Checking admin authentication...");
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // First try to get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Since user_roles table has been dropped, we'll use simplified admin check
          // In a real application, you would need to recreate the user_roles table or implement an alternative
          // For now, we'll check local storage as a fallback
          const savedAuth = localStorage.getItem('adminAuthenticated');
          if (savedAuth === 'true') {
            console.log("Found existing admin authentication in local storage");
            setAdminAuthenticated(true);
            return;
          }
        }
        
        // If no valid session, check local storage fallback
        const savedAuth = localStorage.getItem('adminAuthenticated');
        if (savedAuth === 'true') {
          console.log("Found existing admin authentication in local storage");
          setAdminAuthenticated(true);
        } else {
          console.log("No existing admin authentication found");
          setAdminAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking admin auth:", error);
        setAdminAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const adminLogin = async ({ identifier, password }: AdminCredentials) => {
    try {
      console.log("Admin login attempt:", identifier);
      setLoading(true);
      
      // Since admin_users table has been dropped, we'll use simplified admin authentication
      // In a real application, you would need to recreate the admin_users table
      // For now, we'll just check the hardcoded credentials
        
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
    adminAuthenticated,
    adminLogin,
    adminLogout
  };
}
