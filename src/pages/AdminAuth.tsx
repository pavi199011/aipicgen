
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AdminTestCredentials } from "@/components/admin/AdminTestCredentials";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const AdminAuth = () => {
  const { loading, adminAuthenticated, adminLogin } = useAdminAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if admin is already authenticated
  useEffect(() => {
    if (adminAuthenticated && !isRedirecting) {
      setIsRedirecting(true);
      
      // Small delay before redirect for better UX
      const redirectTimer = setTimeout(() => {
        navigate("/admin");
      }, 100);
      
      return () => clearTimeout(redirectTimer);
    }
  }, [adminAuthenticated, navigate, isRedirecting]);

  const handleLogin = async (values) => {
    try {
      const result = await adminLogin(values);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Logged in to admin portal successfully",
        });
        
        setIsRedirecting(true);
        setTimeout(() => {
          navigate("/admin");
        }, 100);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Show a loading state during redirection
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 p-4">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
          <p className="mt-4 text-white font-medium">Redirecting to admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
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
          
          <CardContent className="p-6 pt-2">
            <AdminLoginForm 
              onSubmit={handleLogin} 
              loading={loading} 
            />
            
            <AdminTestCredentials />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
