
import { useState } from "react";
import { Shield, Key, User, Plus } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface Admin {
  id: string;
  username?: string;
  email?: string;
}

interface AdminManagementProps {
  currentAdmins: Admin[];
  onAddAdmin?: (email: string, password: string) => Promise<void>;
}

const addAdminSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"]
});

export const AdminManagement = ({ currentAdmins, onAddAdmin }: AdminManagementProps) => {
  const addAdminForm = useForm<z.infer<typeof addAdminSchema>>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const changePasswordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }
  });

  const { toast } = useToast();

  const handleAddAdmin = async (values: z.infer<typeof addAdminSchema>) => {
    try {
      if (onAddAdmin) {
        await onAddAdmin(values.email, values.password);
      } else {
        toast({
          title: "Feature Coming Soon",
          description: "Adding new admins will be implemented in a future update.",
        });
      }
      addAdminForm.reset();
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleChangePassword = async (values: z.infer<typeof changePasswordSchema>) => {
    // This is just a placeholder - implement actual password change logic
    toast({
      title: "Feature Coming Soon",
      description: "Password changing will be implemented in a future update.",
    });
    changePasswordForm.reset();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Settings</h2>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Admins</CardTitle>
          <CardDescription>List of users with administrator privileges</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentAdmins.map(admin => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.username || "N/A"}</TableCell>
                  <TableCell>{admin.email || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Add New Admin
            </CardTitle>
            <CardDescription>Create a new administrator account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...addAdminForm}>
              <form onSubmit={addAdminForm.handleSubmit(handleAddAdmin)} className="space-y-4">
                <FormField
                  control={addAdminForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addAdminForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be at least 8 characters with uppercase, lowercase and numbers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addAdminForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Admin
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2 text-primary" />
              Change Admin Password
            </CardTitle>
            <CardDescription>Update your administrator password</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...changePasswordForm}>
              <form onSubmit={changePasswordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                <FormField
                  control={changePasswordForm.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={changePasswordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be at least 8 characters with uppercase, lowercase and numbers.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={changePasswordForm.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">
                  <Shield className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
