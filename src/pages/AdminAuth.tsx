
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogIn, Shield, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthCard } from "@/components/admin/AdminAuthCard";
import { AdminLoginForm, AdminLoginFormValues } from "@/components/admin/AdminLoginForm";
import { AdminRegisterForm, AdminRegisterFormValues } from "@/components/admin/AdminRegisterForm";
import { ADMIN_REGISTRATION_KEY, ADMIN_ROUTE } from "@/components/admin/AdminConstants";

const AdminAuth = () => {
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { toast } = useToast();

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
      await signIn(values.email, values.password);
      
      // After sign in, we'll check if the user is an admin
      // This will be handled by the conditional above when the user state updates
      toast({
        title: "Checking admin credentials",
        description: "Verifying your admin access...",
      });
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

  const handleRegister = async (values: AdminRegisterFormValues) => {
    try {
      // Check if the admin registration key is correct
      if (values.adminKey !== ADMIN_REGISTRATION_KEY) {
        throw new Error("Invalid admin registration key");
      }

      setLoading(true);
      // Sign up the user
      const { error: signUpError } = await signUp(values.email, values.password);
      
      if (signUpError) throw signUpError;

      // This part will only run if signup is successful
      toast({
        title: "Admin account created!",
        description: "Please check your email to confirm your account.",
      });
      
      // Reset form and switch to login
      setIsSignUp(false);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Admin registration failed",
        description: error.message || "There was a problem creating your admin account.",
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
              {isSignUp ? "Create Admin Account" : "Admin Sign In"}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to home</span>
          </Button>
        </div>
        <CardDescription>
          {isSignUp
            ? "Enter details to create a new administrator account"
            : "Enter your credentials to access the admin panel"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isSignUp ? (
          <AdminRegisterForm onSubmit={handleRegister} loading={loading} />
        ) : (
          <AdminLoginForm onSubmit={handleLogin} loading={loading} />
        )}
      </CardContent>
      
      <CardFooter>
        <Button
          variant="link"
          className="w-full"
          onClick={() => {
            setIsSignUp(!isSignUp);
          }}
        >
          {isSignUp ? (
            <span className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Already have an admin account? Sign in
            </span>
          ) : (
            <span className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Need an admin account? Sign up
            </span>
          )}
        </Button>
      </CardFooter>
    </AdminAuthCard>
  );
};

export default AdminAuth;
