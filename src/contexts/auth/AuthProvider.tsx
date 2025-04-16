
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
    let isMounted = true;
    
    const fetchUser = async () => {
      try {
        console.log("Fetching user session...");
        // Only set loading if component is still mounted
        if (isMounted) setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && isMounted) {
          console.log("Session found, fetching profile...");
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url, is_admin, is_active")
            .eq("id", session.user.id)
            .single();

          // If user account is inactive, sign them out
          if (profile?.is_active === false) {
            console.log("User account is inactive, signing out");
            await supabase.auth.signOut();
            if (isMounted) {
              setUser(null);
              setLoading(false);
            }
            return;
          }

          if (isMounted) {
            setUser({
              id: session.user.id,
              email: session.user.email,
              username: profile?.username || session.user.email?.split('@')[0],
              avatarUrl: profile?.avatar_url || null,
              isAdmin: profile?.is_admin || false,
              isActive: profile?.is_active !== false // Defaults to true if not set
            });
          }
          console.log("User profile loaded, isAdmin:", profile?.is_admin, "isActive:", profile?.is_active);
        } else if (isMounted) {
          console.log("No session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (isMounted) setUser(null);
      } finally {
        // Always set loading to false when done, but only if component is mounted
        if (isMounted) {
          setLoading(false);
          console.log("Auth loading state set to false after session check");
        }
      }
    };

    // Set initial loading state
    setLoading(true);
    console.log("Initial auth loading state set to true");
    
    fetchUser();

    // Use a more controlled approach for auth state change
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`Auth state changed: ${event} for session:`, session?.user?.email || "no user");
      
      // For sign out, immediately update the state
      if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setLoading(false);
          console.log("User signed out, auth state updated");
        }
        return;
      }
      
      // For sign in, schedule profile fetch
      if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
        // Use setTimeout to prevent blocking the auth state change event
        setTimeout(async () => {
          if (!isMounted) return;
          
          try {
            console.log("Fetching user profile after auth state change");
            setLoading(true);
            
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, avatar_url, is_admin, is_active")
              .eq("id", session.user.id)
              .single();

            // If user account is inactive, sign them out
            if (profile?.is_active === false) {
              console.log("User account is inactive, signing out");
              await supabase.auth.signOut();
              if (isMounted) {
                setUser(null);
                setLoading(false);
              }
              return;
            }

            if (isMounted) {
              setUser({
                id: session.user.id,
                email: session.user.email,
                username: profile?.username || session.user.email?.split('@')[0],
                avatarUrl: profile?.avatar_url || null,
                isAdmin: profile?.is_admin || false,
                isActive: profile?.is_active !== false // Defaults to true if not set
              });
              console.log("User authenticated, isAdmin:", profile?.is_admin, "isActive:", profile?.is_active);
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
            if (isMounted) setUser(null);
          } finally {
            if (isMounted) {
              setLoading(false);
              console.log("Auth loading state set to false after profile fetch");
            }
          }
        }, 0);
      }
    });

    return () => {
      isMounted = false;
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
