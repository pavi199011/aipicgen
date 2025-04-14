
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, LogIn, Shield, AlertCircle } from "lucide-react";
import { AdminAuthCard } from "@/components/admin/AdminAuthCard";
import { AdminLoginForm, AdminLoginFormValues } from "@/components/admin/AdminLoginForm";
import { useToast } from "@/hooks/use-toast";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";
import { useAdminAuth } from "@/hooks/useAdminAuth";

// Rate limiting for admin login attempts
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes in milliseconds
};

const AdminAuth = () => {
  const { loading, adminAuthenticated, adminLogin } = useAdminAuth();
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState<number>(0);
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // Redirect if admin is already authenticated
  useEffect(() => {
    if (adminAuthenticated) {
      navigate(`/${ADMIN_ROUTE}`);
    }
  }, [adminAuthenticated, navigate]);

  // Format the remaining lockout time
  const formatLockoutTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (values: AdminLoginFormValues) => {
    // Ensure values has all required fields for AdminCredentials
    const credentials = {
      identifier: values.identifier || "",  // Provide default values to ensure required fields
      password: values.password || ""       // are always present
    };
    
    // Check if account is locked out
    if (lockoutUntil && lockoutUntil > Date.now()) {
      toast({
        title: "Account temporarily locked",
        description: `Too many failed attempts. Please try again in ${formatLockoutTime(lockoutTimeRemaining)}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await adminLogin(credentials);
      
      if (result.success) {
        // Reset login attempts on successful login
        localStorage.removeItem('adminLoginAttempts');
        localStorage.removeItem('adminLockoutUntil');
        setLoginAttempts(0);
        
        // Navigate to admin portal
        navigate(`/${ADMIN_ROUTE}`);
      } else {
        // Increment failed login attempts
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
      }
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  // If authenticated, redirect to admin portal
  if (adminAuthenticated) {
    return <Navigate to={`/${ADMIN_ROUTE}`} replace />;
  }

  return (
    <AdminAuthCard>
      <div className="space-y-1 p-6 pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-2xl font-bold">
              Admin Portal
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to home</span>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Secure access to administration tools
        </p>
      </div>
      
      <div className="p-6 pt-2">
        {lockoutUntil && lockoutUntil > Date.now() ? (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Account temporarily locked</strong><br />
              Too many failed login attempts. Please try again in {formatLockoutTime(lockoutTimeRemaining)}.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <AdminLoginForm 
          onSubmit={handleLogin} 
          loading={loading || (lockoutUntil !== null && lockoutUntil > Date.now())} 
        />
        
        <p className="text-sm text-center text-gray-500 w-full mt-6">
          <LogIn className="inline mr-1 h-3 w-3" />
          Secure admin access only
        </p>
      </div>
    </AdminAuthCard>
  );
};

export default AdminAuth;
