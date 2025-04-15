
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { AdminCredentials } from "@/types/admin";
import { AuthCard } from "@/components/auth/AuthCard";
import { CardHeader, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AtSign, Lock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const adminLoginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

const AdminLogin = () => {
  const { user, adminSignIn, loading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Redirect if already logged in and is admin
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  
  const form = useForm<AdminCredentials>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  });

  const onSubmit = async (values: AdminCredentials) => {
    try {
      setIsSubmitting(true);
      await adminSignIn(values);
      
      // Note: We don't need to navigate here as the AuthProvider will update the user
      // and the condition at the top will redirect to the admin dashboard if they're an admin
    } catch (error) {
      // Error is already handled in adminSignIn
      toast({
        title: "Access Denied",
        description: "Invalid admin credentials or you don't have admin privileges.",
        variant: "destructive",
      });
      console.error("Admin login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard>
      <CardHeader className="space-y-1 text-center pb-2">
        <div className="flex justify-center mb-2">
          <Shield className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-sm text-muted-foreground">
          Enter your admin credentials to access the dashboard
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username or Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="admin" 
                        className="pl-10" 
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        className="pl-10" 
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
              {isSubmitting ? "Signing in..." : "Access Admin Panel"}
            </Button>
            
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-sm"
                onClick={() => navigate("/auth")}
              >
                Regular User Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </AuthCard>
  );
};

export default AdminLogin;
