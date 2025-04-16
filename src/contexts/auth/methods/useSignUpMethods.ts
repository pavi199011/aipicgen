
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSignUpMethods() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });
      
      if (error) throw error;
      
      // Ensure the user is active by default
      // The profile table should have a trigger that sets is_active to true by default
      // but we'll set it explicitly here just to be sure
      const { data: userData } = await supabase.auth.getSession();
      if (userData.session?.user) {
        await supabase
          .from('profiles')
          .update({ is_active: true })
          .eq('id', userData.session.user.id);
      }
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });
      
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    signUp
  };
}
