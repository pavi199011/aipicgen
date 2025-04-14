
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AdminCredentials {
  identifier: string; // Can be username or email
  password: string;
}

export function useAdminAuth() {
  const [loading, setLoading] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const { toast } = useToast();

  const adminLogin = async ({ identifier, password }: AdminCredentials) => {
    try {
      setLoading(true);
      
      // For development purposes, we're using simplified admin authentication
      // In production, you would verify against the admin_users table and use proper password hashing
      
      // Check if the identifier is an email or username
      const isEmail = identifier.includes('@');
      
      // Query the admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .or(
          isEmail 
            ? `email.eq.${identifier}` 
            : `username.eq.${identifier}`
        )
        .single();
        
      if (error || !data) {
        // For development, check if using our hardcoded admin credentials
        const isAdminUser = (
          identifier === 'admin_user' || 
          identifier === 'admin@example.com'
        ) && password === 'SecureAdminPass2025!';
        
        if (isAdminUser) {
          setAdminAuthenticated(true);
          toast({
            title: "Success",
            description: "Admin login successful using development credentials",
          });
          return { success: true };
        }
        
        throw new Error('Invalid admin credentials');
      }
      
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
      
      return { success: true };
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
    setAdminAuthenticated(false);
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
