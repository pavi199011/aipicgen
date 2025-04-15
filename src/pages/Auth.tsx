
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { RegisterForm, RegisterFormValues } from "@/components/auth/RegisterForm";
import { AuthCard } from "@/components/auth/AuthCard";
import { useToast } from "@/hooks/use-toast";
import { addNewUserToMockData } from "@/hooks/admin/useAdminUserData";
import { addNewUserToMockStats } from "@/hooks/admin/useAdminUserStats";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      console.log("Login attempt with:", { identifier: values.identifier });
      
      // Check if the identifier is an email
      const isEmail = values.identifier.includes('@');
      
      if (isEmail) {
        // If it's an email, use it directly for login
        await signIn(values.identifier, values.password);
      } else {
        // If it's a username, we append a dummy domain to make it work with Supabase
        // Note: This is a simplified approach. In a real app, you'd query for the user's email first
        await signIn(`${values.identifier}@example.com`, values.password);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      // Fixed: Passing the username as the third argument to signUp
      await signUp(values.email, values.password, values.username);
      
      // Add the newly registered user to the admin mock data
      const newUserId = `user-${Date.now()}`;
      const newUser = {
        id: newUserId,
        email: values.email,
        username: values.username,
        created_at: new Date().toISOString(),
        is_suspended: false
      };
      
      // Add user to mock data for admin dashboard
      addNewUserToMockData(newUser);
      
      // Add user stats to mock stats for admin dashboard
      addNewUserToMockStats({
        id: newUserId,
        username: values.username,
        email: values.email
      });
      
      // Simplified success flow - no need to check for error property
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
      setActiveTab("login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <CardHeader className="space-y-1">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">
            {activeTab === "login" ? "Sign In" : "Create an Account"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to home</span>
          </Button>
        </div>
        <CardDescription>
          {activeTab === "login" 
            ? "Enter your credentials to access your account" 
            : "Fill in the details below to create your account"}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="login" value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSubmit={handleLogin} loading={loading} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm onSubmit={handleRegister} loading={loading} />
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter>
        <p className="text-sm text-center text-gray-500 w-full">
          {activeTab === "login" ? (
            <>
              <LogIn className="inline mr-1 h-3 w-3" />
              Don't have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("register")}>Register</Button>
            </>
          ) : (
            <>
              <UserPlus className="inline mr-1 h-3 w-3" />
              Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => setActiveTab("login")}>Sign In</Button>
            </>
          )}
        </p>
      </CardFooter>
    </AuthCard>
  );
};

export default Auth;
