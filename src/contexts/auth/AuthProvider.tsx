
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState, AuthUser } from "./types";
import { useAuthMethods } from "./useAuthMethods";

export const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    user, 
    setUser, 
    loading, 
    setLoading, 
    signIn, 
    signUp, 
    signOut, 
    resetPassword,
    adminSignIn 
  } = useAuthMethods();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user session...");
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Session found, fetching profile...");
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url, is_admin")
            .eq("id", session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || session.user.email?.split('@')[0],
            avatarUrl: profile?.avatar_url || null,
            isAdmin: profile?.is_admin || false
          });
          console.log("User profile loaded, isAdmin:", profile?.is_admin);
        } else {
          console.log("No session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        // Always set loading to false when done, regardless of success or failure
        setLoading(false);
        console.log("Auth loading state set to false after session check");
      }
    };

    // Set initial loading state
    setLoading(true);
    console.log("Initial auth loading state set to true");
    
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth state changed: ${event} for session:`, session);
      
      if (session) {
        try {
          setLoading(true); // Set loading to true while fetching profile
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url, is_admin")
            .eq("id", session.user.id)
            .single();

          setUser({
            id: session.user.id,
            email: session.user.email,
            username: profile?.username || session.user.email?.split('@')[0],
            avatarUrl: profile?.avatar_url || null,
            isAdmin: profile?.is_admin || false
          });
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setUser(null);
        } finally {
          setLoading(false);
          console.log("Auth loading state set to false after auth state change");
        }
      } else {
        setUser(null);
        setLoading(false);
        console.log("Auth loading state set to false, no session in auth state change");
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    adminSignIn
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
