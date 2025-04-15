
import { useState } from 'react';
import { AuthUser } from "./types";
import { useSignInMethods } from './methods/useSignInMethods';
import { useSignUpMethods } from './methods/useSignUpMethods';
import { useAccountMethods } from './methods/useAccountMethods';
import { AdminCredentials } from "@/types/admin";

export function useAuthMethods() {
  const [user, setUser] = useState<AuthUser | null>(null);
  
  const { 
    loading: signInLoading, 
    signIn, 
    adminSignIn 
  } = useSignInMethods();
  
  const { 
    loading: signUpLoading, 
    signUp 
  } = useSignUpMethods();
  
  const { 
    loading: accountLoading, 
    signOut, 
    resetPassword 
  } = useAccountMethods();
  
  // Compute loading state based on all possible loading states
  const loading = signInLoading || signUpLoading || accountLoading;
  
  // Create a unified setLoading function to pass down
  const setLoading = () => {
    // This is intentionally empty as each sub-hook manages its own loading state
    // We include it to maintain the same interface as before
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
