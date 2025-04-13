
import { AtSign, Lock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Modified schema to accept both email and username formats
const loginSchema = z.object({
  identifier: z.string().min(1, "Please enter your username or email"),
  password: z.string().min(1, "Password is required"),
});

export type AdminLoginFormValues = z.infer<typeof loginSchema>;

interface AdminLoginFormProps {
  onSubmit: (values: AdminLoginFormValues) => Promise<void>;
  loading: boolean;
}

export const AdminLoginForm = ({ onSubmit, loading }: AdminLoginFormProps) => {
  const form = useForm<AdminLoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "admin",
      password: "admin123@#",
    }
  });

  return (
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
                    placeholder="admin or admin@example.com" 
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In to Admin"}
        </Button>
      </form>
    </Form>
  );
};
