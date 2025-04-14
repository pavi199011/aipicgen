
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// Rate limiting for admin login attempts
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes in milliseconds
};

export const useAdminLockout = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number>(0);
  const { toast } = useToast();

  // Load rate limiting data from localStorage
  useEffect(() => {
    const storedAttempts = localStorage.getItem('adminLoginAttempts');
    const storedLockout = localStorage.getItem('adminLockoutUntil');
    
    if (storedAttempts) {
      setLoginAttempts(parseInt(storedAttempts));
    }
    
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout);
      if (lockoutTime > Date.now()) {
        setLockoutUntil(lockoutTime);
      } else {
        // Lockout period expired, reset
        localStorage.removeItem('adminLockoutUntil');
        localStorage.removeItem('adminLoginAttempts');
        setLoginAttempts(0);
      }
    }
  }, []);

  // Update countdown timer during lockout
  useEffect(() => {
    if (!lockoutUntil) return;
    
    const interval = setInterval(() => {
      const remaining = Math.max(0, lockoutUntil - Date.now());
      setLockoutTimeRemaining(remaining);
      
      if (remaining === 0) {
        clearInterval(interval);
        setLockoutUntil(null);
        setLoginAttempts(0);
        localStorage.removeItem('adminLockoutUntil');
        localStorage.removeItem('adminLoginAttempts');
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Format the remaining lockout time
  const formatLockoutTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const incrementLoginAttempt = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);
    localStorage.setItem('adminLoginAttempts', newAttempts.toString());
    
    // Check if we should lock the account
    if (newAttempts >= RATE_LIMIT.MAX_ATTEMPTS) {
      const lockoutTime = Date.now() + RATE_LIMIT.LOCKOUT_TIME;
      setLockoutUntil(lockoutTime);
      localStorage.setItem('adminLockoutUntil', lockoutTime.toString());
      
      toast({
        title: "Account temporarily locked",
        description: `Too many failed attempts. Please try again in ${formatLockoutTime(RATE_LIMIT.LOCKOUT_TIME)}`,
        variant: "destructive",
      });
    }
  };

  const resetLoginAttempts = () => {
    localStorage.removeItem('adminLoginAttempts');
    localStorage.removeItem('adminLockoutUntil');
    setLoginAttempts(0);
    setLockoutUntil(null);
  };

  const isLockedOut = lockoutUntil !== null && lockoutUntil > Date.now();

  return {
    loginAttempts,
    lockoutUntil,
    lockoutTimeRemaining,
    isLockedOut,
    formatLockoutTime,
    incrementLoginAttempt,
    resetLoginAttempts
  };
};
