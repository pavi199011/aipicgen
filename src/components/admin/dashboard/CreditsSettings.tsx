
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CreditsSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newValue, setNewValue] = useState("");

  const { data: currentSetting, isLoading } = useQuery({
    queryKey: ["creditsPerImage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("global_settings")
        .select("setting_value")
        .eq("setting_name", "credits_per_image")
        .single();

      if (error) throw error;
      return data.setting_value;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async (value: string) => {
      const { error } = await supabase
        .from("global_settings")
        .update({ setting_value: value })
        .eq("setting_name", "credits_per_image");

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creditsPerImage"] });
      toast({
        title: "Settings updated",
        description: "Credits per image has been updated successfully.",
      });
      setNewValue("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating settings:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue || isNaN(Number(newValue)) || Number(newValue) < 1) {
      toast({
        title: "Invalid value",
        description: "Please enter a valid number greater than 0.",
        variant: "destructive",
      });
      return;
    }
    updateSetting.mutate(newValue);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Credit Settings
        </CardTitle>
        <CardDescription>
          Configure how many credits are required to generate one image
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Current setting: {isLoading ? "Loading..." : `${currentSetting} credits per image`}
            </p>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="Enter new value"
                className="max-w-[200px]"
              />
              <Button type="submit" disabled={updateSetting.isPending}>
                {updateSetting.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
