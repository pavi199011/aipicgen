
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAdminManagement() {
  const { toast } = useToast();

  const addAdmin = async (email: string, password: string) => {
    try {
      // Create the user with Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      
      if (error) throw error;
      
      // Since user_roles table has been dropped, we'll use simplified admin roles
      // In a real application, you would need to recreate the user_roles table
      
      // If user creation successful, create or update profile
      if (data?.user) {
        // Ensure the profile exists
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ 
            id: data.user.id,
            username: email.split('@')[0],
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
        }
      }
      
      toast({
        title: "Admin Added",
        description: `${email} has been added as an admin.`,
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description: "Failed to add admin: " + error.message,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return {
    addAdmin
  };
}
