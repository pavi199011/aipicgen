
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddAdminFormProps {
  onAddAdmin?: (email: string, password: string) => Promise<void>;
}

export function AddAdminForm({ onAddAdmin }: AddAdminFormProps) {
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const { toast } = useToast();

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newAdminEmail || !newAdminPassword) {
        toast({
          title: "Validation Error",
          description: "Email and password are required.",
          variant: "destructive",
        });
        return;
      }

      if (onAddAdmin) {
        await onAddAdmin(newAdminEmail, newAdminPassword);
        
        // Reset form
        setNewAdminEmail("");
        setNewAdminPassword("");
      } else {
        // For development only
        toast({
          title: "Development Mode",
          description: `Simulated adding ${newAdminEmail} as an admin.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add admin: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form 
      className="space-y-4"
      onSubmit={handleAddAdmin}
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
  );
}
