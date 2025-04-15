
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ChangePasswordForm() {
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const { toast } = useToast();

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the admin password
    toast({
      title: "Password Updated",
      description: "Your admin password has been updated successfully.",
    });
    setNewAdminPassword("");
  };

  return (
    <form 
      className="space-y-4"
      onSubmit={handleChangePassword}
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
  );
}
