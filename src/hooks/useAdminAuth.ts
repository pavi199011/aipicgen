
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
        const savedAuth = localStorage.getItem('adminAuthenticated');
        if (savedAuth === 'true') {
          console.log("Found existing admin authentication");
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
      
      // For development purposes, we're using simplified admin authentication
      // In production, you would verify against the admin_users table and use proper password hashing
      
      // Check if the identifier is an email or username
      const isEmail = identifier.includes('@');
      
      // Try to query the admin_users table first
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .or(
            isEmail 
              ? `email.eq.${identifier}` 
              : `username.eq.${identifier}`
          )
          .single();
          
        if (!error && data) {
          // In production, you would verify the password hash here
          if (data.password_hash !== password) {
            throw new Error('Invalid password');
          }
          
          // Update last login timestamp
          await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.id);
          
          setAdminAuthenticated(true);
          // Persist authentication state
          localStorage.setItem('adminAuthenticated', 'true');
          console.log("Admin authenticated via database lookup");
          return { success: true };
        }
      } catch (e) {
        console.log("No admin user found in database, checking hardcoded credentials");
      }
        
      // For development, check if using our hardcoded admin credentials
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
