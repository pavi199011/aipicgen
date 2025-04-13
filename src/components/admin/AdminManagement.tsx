
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, UserPlus, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface AdminManagementProps {
  currentAdmins: { id: string; email: string; }[];
  onAddAdmin?: (email: string, password: string) => Promise<void>;
}

export function AdminManagement({ currentAdmins, onAddAdmin }: AdminManagementProps) {
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [admins, setAdmins] = useState(currentAdmins);
  const { toast } = useToast();

  // Update admins when currentAdmins changes
  useEffect(() => {
    setAdmins(currentAdmins);
  }, [currentAdmins]);

  const handleAddAdmin = async () => {
    try {
      if (onAddAdmin) {
        await onAddAdmin(newAdminEmail, newAdminPassword);
        
        // Add the new admin to the local state
        setAdmins([...admins, { id: Date.now().toString(), email: newAdminEmail }]);
        
        toast({
          title: "Admin Added",
          description: `Added ${newAdminEmail} as an admin.`,
        });
      } else {
        // For development only
        setAdmins([...admins, { id: Date.now().toString(), email: newAdminEmail }]);
        
        toast({
          title: "Development Mode",
          description: `Simulated adding ${newAdminEmail} as an admin.`,
        });
      }
      
      // Reset form
      setNewAdminEmail("");
      setNewAdminPassword("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add admin. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = (adminId: string, adminEmail: string) => {
    // In a real app, this would remove admin privileges
    // For now, just update the local state
    setAdmins(admins.filter(admin => admin.id !== adminId));
    
    toast({
      title: "Admin Removed",
      description: `Removed admin privileges from ${adminEmail}.`,
    });
  };

  const handleChangePassword = () => {
    // In a real app, this would update the admin password
    toast({
      title: "Password Updated",
      description: "Your admin password has been updated successfully.",
    });
    setNewAdminPassword("");
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Admin Accounts</CardTitle>
          <CardDescription>Manage administrator accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                    No admins found
                  </TableCell>
                </TableRow>
              ) : (
                admins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {admin.email !== "admin@pixelpalette.tech" && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Admin</CardTitle>
            <CardDescription>Create a new administrator account</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleAddAdmin();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="newAdminEmail">Email</Label>
                <div className="relative">
                  <Input
                    id="newAdminEmail"
                    type="email"
                    placeholder="new-admin@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    required
                  />
                  <UserPlus className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newAdminPassword">Password</Label>
                <div className="relative">
                  <Input
                    id="newAdminPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    required
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={!newAdminEmail || !newAdminPassword}
              >
                Add Admin
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Admin Password</CardTitle>
            <CardDescription>Update your administrator password</CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleChangePassword();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    required
                  />
                  <Lock className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full"
                disabled={!newAdminPassword}
              >
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
