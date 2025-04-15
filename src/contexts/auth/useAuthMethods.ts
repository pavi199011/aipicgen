
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthUser } from "./types";
import { AdminCredentials } from "@/types/admin";

export function useAuthMethods() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
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
  
  const adminSignIn = async (credentials: AdminCredentials) => {
    try {
      setLoading(true);
      console.log("Starting admin sign in process");
      
      // First, attempt to sign in with credentials
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ 
        email: credentials.identifier, 
        password: credentials.password 
      });
      
      if (signInError) throw signInError;
      
      console.log("Sign in successful, checking admin status");
      
      // If login succeeds, check admin status using the user ID from the session
      const userId = signInData.user?.id;
      if (!userId) throw new Error("User ID not found after login");
      
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single();
      
      if (profileError) {
        // Important: Sign out if we can't verify admin status
        await supabase.auth.signOut();
        throw profileError;
      }
      
      console.log("Admin check result:", profile);
      
      // If the user is not an admin, sign them out
      if (!profile?.is_admin) {
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
      toast({
        title: "Admin sign in failed",
        description: error.message || "There was an error signing in as administrator.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

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

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "There was an error signing out.",
        variant: "destructive",
      });
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
    user,
    setUser,
    loading,
    setLoading,
    signIn,
    adminSignIn,
    signUp,
    signOut,
    resetPassword,
  };
}
