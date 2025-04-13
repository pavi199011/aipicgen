
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, Edit } from "lucide-react";

interface ProfileDetailsCardProps {
  user: User;
}

const ProfileDetailsCard = ({ user }: ProfileDetailsCardProps) => {
  const { toast } = useToast();
  
  // Profile states
  const [username, setUsername] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  
  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  
  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoadingProfile(true);
        
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, phone")
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error fetching profile",
            description: error.message,
            variant: "destructive",
          });
          return;
        }
        
        if (data) {
          setUsername(data.username || "");
          setPhone(data.phone || "");
          setAvatarUrl(data.avatar_url || null);
        }
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchProfile();
  }, [user.id, toast]);
  
  // Handle profile update
  const handleUpdateProfile = async () => {
    try {
      setSavingProfile(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setEditMode(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSavingProfile(false);
    }
  };
  
  // Get user initials for avatar
  const getUserInitials = () => {
    if (username) {
      return username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>
          Manage your personal information
        </CardDescription>
        {!editMode && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-6 top-6"
            onClick={() => setEditMode(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-8">
        {loadingProfile ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatarUrl || ""} alt={username} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 flex-1">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={user.email || ""} 
                  disabled 
                  className="bg-muted"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!editMode}
                  className={!editMode ? "bg-muted" : ""}
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      {editMode && (
        <CardFooter className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => setEditMode(false)}
            disabled={savingProfile}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateProfile}
            disabled={savingProfile}
          >
            {savingProfile ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ProfileDetailsCard;
