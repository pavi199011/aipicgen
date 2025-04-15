
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { AdminCredentials } from "@/types/admin";
import { AuthCard } from "@/components/auth/AuthCard";
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AtSign, Lock, Shield, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CreateAdminButton } from "@/components/admin/CreateAdminButton";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const adminLoginSchema = z.object({
  identifier: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

const AdminLogin = () => {
  const { user, adminSignIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<AdminCredentials>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  });

  const onSubmit = async (values: AdminCredentials) => {
    try {
      setError(null);
      setIsSubmitting(true);
      await adminSignIn(values);
      
      // If adminSignIn succeeds, the AuthProvider will update the user
      // The condition at the top will redirect to the admin dashboard
    } catch (error: any) {
      console.error("Admin login error:", error);
      setError(error.message || "Invalid admin credentials or you don't have admin privileges.");
      form.reset({ identifier: values.identifier, password: "" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Move the redirect logic after all hooks have been initialized
  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
                        disabled={isSubmitting}
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
                        disabled={isSubmitting}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Access Admin Panel"
              )}
            </Button>
            
            <div className="text-center mt-4">
              <Button 
                variant="link" 
                className="text-sm"
                onClick={() => navigate("/auth")}
                disabled={isSubmitting}
              >
                Regular User Login
              </Button>
            </div>
          </form>
        </Form>
        
        <Separator className="my-6" />
        
        <div className="space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            First time setup? Create the admin user with default credentials:
          </p>
          <p className="text-xs text-center text-muted-foreground">
            (Username: admin, Email: admin@example.com, Password: Admin2025@#)
          </p>
          <CreateAdminButton />
        </div>
      </CardContent>
    </AuthCard>
  );
};

export default AdminLogin;
