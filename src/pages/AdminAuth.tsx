
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogIn, Shield, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthCard } from "@/components/admin/AdminAuthCard";
import { AdminLoginForm, AdminLoginFormValues } from "@/components/admin/AdminLoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Import the ADMIN_ROUTE constant
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";

const AdminAuth = () => {
  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

  // Admin credentials - displayed for user convenience
  const adminUsername = "admin";
  const adminPassword = "admin123@#";

  // Check if the current user is an admin
  const checkIfAdmin = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) throw error;
      
      setIsAdmin(!!data);
      return !!data;
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
          <Button variant="secondary" onClick={() => window.location.href = "/"}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>;
  }

  const handleLogin = async (values: AdminLoginFormValues) => {
    try {
      setLoading(true);
      
      // Check if we're logging in with the fixed admin credentials
      if ((values.identifier === adminUsername || values.identifier === "admin@example.com") 
          && values.password === adminPassword) {
        // Sign in with the actual admin account stored in Supabase
        await signIn("admin@example.com", adminPassword);
        
        toast({
          title: "Admin login successful",
          description: "Accessing admin dashboard...",
        });
      } else {
        // If not using the demo credentials, try regular login
        try {
          // Check if identifier is an email
          const isEmail = values.identifier.includes('@');
          
          if (isEmail) {
            // Try to sign in with email
            await signIn(values.identifier, values.password);
          } else {
            // For username login, we need to handle it differently
            // For now, just show an error since we're using the hard-coded admin account
            throw new Error("Invalid admin credentials");
          }
        } catch (error: any) {
          throw new Error("Invalid admin credentials");
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
              Admin Sign In
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to home</span>
          </Button>
        </div>
        <CardDescription>
          Enter your admin credentials to access the admin panel
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Alert className="mb-4 bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700">
            <strong>Admin Credentials:</strong><br />
            Username: <code className="bg-blue-100 px-1 py-0.5 rounded">{adminUsername}</code><br />
            Password: <code className="bg-blue-100 px-1 py-0.5 rounded">{adminPassword}</code>
          </AlertDescription>
        </Alert>
        <AdminLoginForm onSubmit={handleLogin} loading={loading} />
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-center text-gray-500 w-full">
          <LogIn className="inline mr-1 h-3 w-3" />
          Use the credentials shown above to access the admin dashboard
        </p>
      </CardFooter>
    </AdminAuthCard>
  );
};

export default AdminAuth;
