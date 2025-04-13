
import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogIn, Shield, AlertCircle, Info } from "lucide-react";
import { AdminAuthCard } from "@/components/admin/AdminAuthCard";
import { AdminLoginForm, AdminLoginFormValues } from "@/components/admin/AdminLoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ADMIN_ROUTE, ADMIN_CREDENTIALS } from "@/components/admin/AdminConstants";

// Rate limiting for admin login attempts
const RATE_LIMIT = {
  MAX_ATTEMPTS: 5,
  LOCKOUT_TIME: 15 * 60 * 1000, // 15 minutes in milliseconds
};

const AdminAuth = () => {
  const { user, signIn, checkAdminStatus } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
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

  // Check if the current user is an admin
  const checkIfAdmin = async (userId: string) => {
    try {
      const isUserAdmin = await checkAdminStatus();
      console.log("Admin status check result:", isUserAdmin);
      setIsAdmin(isUserAdmin);
      return isUserAdmin;
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
      return false;
    }
  };

  // Redirect if user is already logged in and is an admin
  if (user && isAdmin) {
    return <Navigate to={`/${ADMIN_ROUTE}`} replace />;
  }

  // If user is logged in but we don't know admin status yet
  if (user && isAdmin === null) {
    checkIfAdmin(user.id);
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  // If user is logged in but not an admin
  if (user && isAdmin === false) {
    return <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
          <CardDescription>You do not have admin privileges.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>;
  }

  // Format the remaining lockout time
  const formatLockoutTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (values: AdminLoginFormValues) => {
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
      setLoading(true);
      console.log("Login attempt with:", { 
        identifier: values.identifier, 
        password: values.password === ADMIN_CREDENTIALS.password ? "correct-admin-password" : "incorrect-password"
      });
      
      // Prepare login email - convert username to email if needed
      const loginEmail = values.identifier.includes('@') 
        ? values.identifier 
        : (values.identifier === ADMIN_CREDENTIALS.username 
            ? ADMIN_CREDENTIALS.email 
            : `${values.identifier}@pixelpalette.tech`);
      
      try {
        console.log("Attempting login with email:", loginEmail);
        const result = await signIn(loginEmail, values.password);
        console.log("Sign in result:", result);
        
        // Check admin status immediately after login
        const adminCheck = await checkAdminStatus();
        console.log("Admin status check:", adminCheck);
        
        if (adminCheck) {
          // Reset login attempts on successful login
          localStorage.removeItem('adminLoginAttempts');
          localStorage.removeItem('adminLockoutUntil');
          setLoginAttempts(0);
          
          toast({
            title: "Admin login successful",
            description: "Accessing admin portal...",
          });
        } else {
          // User authenticated but not an admin
          throw new Error("User authenticated but not an admin");
        }
      } catch (error: any) {
        console.error("Admin authentication error:", error);
        
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
        } else {
          throw new Error("Admin authentication failed. Please check your credentials.");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Admin login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuthCard>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-primary mr-2" />
            <CardTitle className="text-2xl font-bold">
              Admin Portal
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to home</span>
          </Button>
        </div>
        <CardDescription>
          Secure access to administration tools
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {lockoutUntil && lockoutUntil > Date.now() ? (
          <Alert className="mb-4 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Account temporarily locked</strong><br />
              Too many failed login attempts. Please try again in {formatLockoutTime(lockoutTimeRemaining)}.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Admin Credentials:</strong><br />
              Username: <code className="bg-blue-100 px-1 py-0.5 rounded">{ADMIN_CREDENTIALS.username}</code><br />
              Email: <code className="bg-blue-100 px-1 py-0.5 rounded">{ADMIN_CREDENTIALS.email}</code><br />
              Password: <code className="bg-blue-100 px-1 py-0.5 rounded">{ADMIN_CREDENTIALS.password}</code>
            </AlertDescription>
          </Alert>
        )}
        
        <AdminLoginForm 
          onSubmit={handleLogin} 
          loading={loading || (lockoutUntil !== null && lockoutUntil > Date.now())} 
        />
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-center text-gray-500 w-full">
          <LogIn className="inline mr-1 h-3 w-3" />
          Use the credentials shown above to access the admin portal
        </p>
      </CardFooter>
    </AdminAuthCard>
  );
};

export default AdminAuth;
