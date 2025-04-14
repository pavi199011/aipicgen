
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
      
      // If user creation successful, assign admin role
      if (data?.user) {
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ 
            user_id: data.user.id, 
            role: 'admin' 
          });
          
        if (roleError) {
          console.error("Error assigning admin role:", roleError);
          // Don't throw here, as the user is already created
        }
        
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
