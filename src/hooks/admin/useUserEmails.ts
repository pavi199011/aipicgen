
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface EmailData {
  id: string;
  email: string;
}

// Cache to store emails across component renders
const emailCache: Record<string, string> = {};

export function useUserEmails(userIds: string[]) {
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const previousUserIdsRef = useRef<string[]>([]);
  
  // Change type from number to NodeJS.Timeout | null to match setTimeout's return type
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip if userIds is the same as the previous one to prevent unnecessary re-fetching
    if (arraysEqual(userIds, previousUserIdsRef.current)) {
      return;
    }
    
    previousUserIdsRef.current = [...userIds];
    
    // Return immediately if no userIds
    if (!userIds.length) return;
    
    // Check if we have all emails in cache
    const missingUserIds = userIds.filter(id => !emailCache[id]);
    if (missingUserIds.length === 0) {
      // All emails are already in cache
      const cachedEmails: Record<string, string> = {};
      userIds.forEach(id => {
        if (emailCache[id]) {
          cachedEmails[id] = emailCache[id];
        }
      });
      setEmails(cachedEmails);
      return;
    }
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set loading state immediately
    setLoading(true);
    
    // Debounce the API call to prevent rapid requests
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // First set the cached emails we already have
        const initialEmails: Record<string, string> = {};
        userIds.forEach(id => {
          if (emailCache[id]) {
            initialEmails[id] = emailCache[id];
          }
        });
        
        if (Object.keys(initialEmails).length > 0) {
          setEmails(initialEmails);
        }
        
        // Only fetch the emails we don't have in cache
        const { data, error } = await supabase.functions.invoke('get-user-emails', {
          body: { user_ids: missingUserIds }
        });

        if (error) {
          throw error;
        }

        // Create a map of user ids to emails
        const newEmailMap: Record<string, string> = {};
        if (data && Array.isArray(data.data)) {
          data.data.forEach((item: EmailData) => {
            newEmailMap[item.id] = item.email;
            // Update cache
            emailCache[item.id] = item.email;
          });
        }

        // Merge with existing emails
        setEmails(prev => ({...prev, ...newEmailMap}));
        setError(null);
      } catch (error: any) {
        console.error("Error fetching user emails:", error);
        setError(error);
        // We don't show a toast for this error
      } finally {
        setLoading(false);
        debounceTimerRef.current = null;
      }
    }, 300); // 300ms debounce
    
    return () => {
      // Clean up the timer when the component unmounts
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [userIds]);

  // Helper function to compare arrays
  function arraysEqual(a: string[], b: string[]) {
    if (a.length !== b.length) return false;
    return a.every((val, index) => val === b[index]);
  }

  return { emails, loading, error };
}
