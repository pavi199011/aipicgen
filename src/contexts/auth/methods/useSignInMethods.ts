
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthUser } from "../types";

export function useSignInMethods() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast({
        title: "Sign in failed",
        description: error.message || "There was an error signing in.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminSignIn = async (credentials: { identifier: string; password: string }): Promise<{ success: boolean }> => {
    try {
      console.log("Starting admin sign in process");
      setLoading(true);
      
      // First, attempt to sign in with credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email: credentials.identifier, 
        password: credentials.password 
      });
      
      if (signInError) {
        console.error("Admin login authentication error:", signInError);
        throw signInError;
      }
      
      console.log("Sign in successful, checking admin status");
      
      // If login succeeds, check admin status using the user ID from the session
      const userId = signInData.user?.id;
      if (!userId) {
        console.error("User ID not found after login");
        throw new Error("User ID not found after login");
      }
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile for admin check:", profileError);
        // Important: Sign out if we can't verify admin status
        await supabase.auth.signOut();
        throw profileError;
      }
      
      console.log("Admin check result:", profile);
      
      // If the user is not an admin, sign them out
      if (!profile?.is_admin) {
        console.log("User is not an admin, signing out");
        await supabase.auth.signOut();
        throw new Error("You don't have administrator privileges");
      }
      
      toast({
        title: "Admin login successful",
        description: "You have successfully signed in as an administrator.",
      });
      
      // Return the successful sign-in result
      return { success: true };
      
    } catch (error: any) {
      console.error("Error signing in as admin:", error);
      // Make sure the loading state is reset
      setLoading(false);
      
      toast({
        title: "Admin sign in failed",
        description: error.message || "There was an error signing in as administrator.",
        variant: "destructive",
      });
      throw error;
    } finally {
      // This ensures loading state is reset no matter what happens
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    signIn,
    adminSignIn
  };
}
