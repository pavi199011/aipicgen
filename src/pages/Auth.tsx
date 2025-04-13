
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { RegisterForm, RegisterFormValues } from "@/components/auth/RegisterForm";
import { AuthCard } from "@/components/auth/AuthCard";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      
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
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      setLoading(true);
      const result = await signUp(values.email, values.password);
      
      if (!result.error) {
        setActiveTab("login");
      }
    } catch (error) {
      console.error("Registration error:", error);
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
