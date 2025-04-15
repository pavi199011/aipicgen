
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook that manages admin authentication state
 * Checks for existing authentication on mount
 */
export function useAdminAuthState() {
  const [loading, setLoading] = useState(true);
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean | undefined>(undefined);

  // Check for existing admin authentication on mount
  useEffect(() => {
    console.log("Checking admin authentication...");
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Check local storage first as it's faster
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

  return {
    loading,
    adminAuthenticated,
    setAdminAuthenticated
  };
}
