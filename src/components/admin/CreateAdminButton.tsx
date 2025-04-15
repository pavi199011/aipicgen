
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export const CreateAdminButton = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    try {
      setIsCreating(true);
      
      const { data, error } = await supabase.functions.invoke('create-admin', {
        method: 'POST',
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: data?.message || "Admin user created successfully.",
      });
      
    } catch (error) {
      console.error("Error creating admin user:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create admin user.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Button 
      onClick={createAdminUser} 
      disabled={isCreating}
      variant="outline"
      className="mt-4 w-full"
    >
      {isCreating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Admin User...
        </>
      ) : (
        "Create Admin User"
      )}
    </Button>
  );
};
