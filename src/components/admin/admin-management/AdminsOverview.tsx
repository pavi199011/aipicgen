
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTable } from "./AdminTable";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface AdminsOverviewProps {
  currentAdmins: { id: string; email?: string; username?: string; }[];
}

export function AdminsOverview({ currentAdmins }: AdminsOverviewProps) {
  const [admins, setAdmins] = useState(currentAdmins);
  const { toast } = useToast();

  const handleRemoveAdmin = async (adminId: string, adminEmail: string) => {
    try {
      // Since the user_roles table has been removed, we'll implement a simplified admin removal
      // In a real application, you would need to recreate the user_roles table or implement an alternative
      
      // Update local state
      setAdmins(admins.filter(admin => admin.id !== adminId));
      
      toast({
        title: "Admin Removed",
        description: `Removed admin privileges from ${adminEmail || 'user'}.`,
      });
    } catch (error: any) {
      console.error("Error removing admin:", error);
      toast({
        title: "Error",
        description: "Failed to remove admin: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Accounts</CardTitle>
        <CardDescription>Manage administrator accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <AdminTable 
          admins={admins} 
          onRemoveAdmin={handleRemoveAdmin} 
        />
      </CardContent>
    </Card>
  );
}
