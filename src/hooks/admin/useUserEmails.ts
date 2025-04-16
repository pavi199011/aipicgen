
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EmailData {
  id: string;
  email: string;
}

export function useUserEmails(userIds: string[]) {
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      if (!userIds.length) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase.functions.invoke('get-user-emails', {
          body: { user_ids: userIds }
        });

        if (error) {
          throw error;
        }

        // Create a map of user ids to emails
        const emailMap: Record<string, string> = {};
        if (data && Array.isArray(data.data)) {
          data.data.forEach((item: EmailData) => {
            emailMap[item.id] = item.email;
          });
        }

        setEmails(emailMap);
      } catch (error: any) {
        console.error("Error fetching user emails:", error);
        setError(error);
        // We no longer show the toast for this error
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [userIds]);

  return { emails, loading, error };
}
