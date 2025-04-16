
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface EmailData {
  id: string;
  email: string;
}

export function useUserEmails(userIds: string[]) {
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEmails = async () => {
      if (!userIds.length) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc(
          'get_user_emails',
          { user_ids: userIds }
        );

        if (error) {
          throw error;
        }

        // Create a map of user ids to emails
        const emailMap: Record<string, string> = {};
        (data as EmailData[]).forEach((item) => {
          emailMap[item.id] = item.email;
        });

        setEmails(emailMap);
      } catch (error: any) {
        console.error("Error fetching user emails:", error);
        toast({
          title: "Error fetching emails",
          description: error.message || "Could not retrieve user emails",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [userIds, toast]);

  return { emails, loading };
}
