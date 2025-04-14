
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { AdminAuthCard } from "@/components/admin/AdminAuthCard";
import { AdminLoginForm, AdminLoginFormValues } from "@/components/admin/AdminLoginForm";
import { AdminLockoutAlert } from "@/components/admin/AdminLockoutAlert";
import { AdminTestCredentials } from "@/components/admin/AdminTestCredentials";
import { AdminRedirectLoader } from "@/components/admin/AdminRedirectLoader";
import { useToast } from "@/hooks/use-toast";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminLockout } from "@/hooks/useAdminLockout";

const AdminAuth = () => {
  const { loading, adminAuthenticated, adminLogin } = useAdminAuth();
  const { 
    isLockedOut, 
    lockoutTimeRemaining, 
    formatLockoutTime,
    incrementLoginAttempt,
    resetLoginAttempts
  } = useAdminLockout();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log("AdminAuth component rendering, authenticated:", adminAuthenticated, "loading:", loading);

  // Redirect if admin is already authenticated
  useEffect(() => {
    if (adminAuthenticated && !isRedirecting) {
      console.log("User is authenticated, redirecting to admin portal");
      setIsRedirecting(true);
      
      // Small delay before redirect to avoid white flash
      const redirectTimer = setTimeout(() => {
        navigate(`/${ADMIN_ROUTE}`);
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [adminAuthenticated, navigate, isRedirecting]);

  const handleLogin = async (values: AdminLoginFormValues) => {
    console.log("Login attempt with:", values);
    
    // Ensure values has all required fields for AdminCredentials
    const credentials = {
      identifier: values.identifier || "",
      password: values.password || ""
    };
    
    // Check if account is locked out
    if (isLockedOut) {
      toast({
        title: "Account temporarily locked",
        description: `Too many failed attempts. Please try again in ${formatLockoutTime(lockoutTimeRemaining)}`,
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await adminLogin(credentials);
      console.log("Login result:", result);
      
      if (result.success) {
        // Reset login attempts on successful login
        resetLoginAttempts();
        
        // Show success message before navigation
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        
        // Set redirecting state to prevent multiple redirects
        setIsRedirecting(true);
        
        // Small delay before redirect to avoid white flash
        setTimeout(() => {
          navigate(`/${ADMIN_ROUTE}`);
        }, 100);
      } else {
        // Increment failed login attempts
        incrementLoginAttempt();
      }
    } catch (error: any) {
      console.error("Login error:", error);
    }
  };

  // Show a loading state during redirection to avoid white flash
  if (isRedirecting || (adminAuthenticated && !loading)) {
    return <AdminRedirectLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
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
            {isLockedOut && (
              <AdminLockoutAlert 
                lockoutTimeRemaining={lockoutTimeRemaining}
                formatLockoutTime={formatLockoutTime}
              />
            )}
            
            <AdminLoginForm 
              onSubmit={handleLogin} 
              loading={loading || isLockedOut} 
            />
            
            <AdminTestCredentials />
          </div>
        </AdminAuthCard>
      </div>
    </div>
  );
};

export default AdminAuth;
