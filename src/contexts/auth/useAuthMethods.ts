
import { useState } from 'react';
import { AuthUser } from "./types";
import { useSignInMethods } from './methods/useSignInMethods';
import { useSignUpMethods } from './methods/useSignUpMethods';
import { useAccountMethods } from './methods/useAccountMethods';

export function useAuthMethods() {
  const [user, setUser] = useState<AuthUser | null>(null);
  
  const { 
    loading: signInLoading, 
    setLoading: setSignInLoading,
    signIn, 
    adminSignIn 
  } = useSignInMethods();
  
  const { 
    loading: signUpLoading, 
    setLoading: setSignUpLoading,
    signUp 
  } = useSignUpMethods();
  
  const { 
    loading: accountLoading, 
    setLoading: setAccountLoading,
    signOut, 
    resetPassword 
  } = useAccountMethods();
  
  // Compute loading state based on all possible loading states
  const loading = signInLoading || signUpLoading || accountLoading;
  
  // Create a unified setLoading function that propagates to all sub-hooks
  const setLoading = (isLoading: boolean) => {
    setSignInLoading(isLoading);
    setSignUpLoading(isLoading);
    setAccountLoading(isLoading);
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
