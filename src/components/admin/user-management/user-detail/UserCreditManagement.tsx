
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserCreditManagementProps {
  userId: string;
  currentCredits: number;
  onCreditUpdate: (newCredits: number) => void;
}

export const UserCreditManagement: React.FC<UserCreditManagementProps> = ({ 
  userId, 
  currentCredits, 
  onCreditUpdate 
}) => {
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const { toast } = useToast();

  const handleAddCredits = async () => {
    if (creditAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive credit amount.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('add_user_credits', {
        user_id_param: userId,
        amount_param: creditAmount,
        description_param: 'Admin credit adjustment',
        admin_id_param: supabase.auth.user()?.id
      });

      if (error) throw error;

      toast({
        title: "Credits Added",
        description: `${creditAmount} credits added successfully.`,
        variant: "default"
      });

      onCreditUpdate(currentCredits + creditAmount);
      setCreditAmount(0);
    } catch (error) {
      toast({
        title: "Error Adding Credits",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Current Credits:</span>
        <span className="text-lg font-bold">{currentCredits}</span>
      </div>
      <div className="flex space-x-2">
        <Input 
          type="number" 
          placeholder="Enter credit amount" 
          value={creditAmount}
          onChange={(e) => setCreditAmount(Number(e.target.value))}
          className="flex-grow"
        />
        <Button onClick={handleAddCredits}>Add Credits</Button>
      </div>
    </div>
  );
};
