
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm, LoginFormValues } from "@/components/auth/LoginForm";
import { RegisterForm, RegisterFormValues } from "@/components/auth/RegisterForm";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (values: LoginFormValues) => {
    try {
      setLoading(true);
      await signIn(values.email, values.password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
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
      await signUp(values.email, values.password);
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account.",
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
            {isSignUp ? "Create an account" : "Sign in"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => window.location.href = "/"}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to home</span>
          </Button>
        </div>
        <CardDescription>
          {isSignUp
            ? "Enter your details to create a new account"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSignUp ? (
          <RegisterForm onSubmit={handleRegister} loading={loading} />
        ) : (
          <LoginForm onSubmit={handleLogin} loading={loading} />
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="w-full"
          onClick={() => setIsSignUp(!isSignUp)}
        >
          {isSignUp ? (
            <span className="flex items-center">
              <LogIn className="mr-2 h-4 w-4" />
              Already have an account? Sign in
            </span>
          ) : (
            <span className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Don't have an account? Sign up
            </span>
          )}
        </Button>
      </CardFooter>
    </AuthCard>
  );
};

export default Auth;
