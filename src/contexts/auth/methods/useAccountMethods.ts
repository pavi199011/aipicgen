
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAccountMethods() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signOut = async () => {
    try {
      console.log("Signing out user...");
      setLoading(true);
      await supabase.auth.signOut();
      
      console.log("Sign out successful");
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was an error signing out.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Check your email for the password reset link.",
      });
      
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: error.message || "There was an error sending the password reset email.",
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
    signOut,
    resetPassword
  };
}
