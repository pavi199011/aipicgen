
import { supabase } from "@/integrations/supabase/client";
import { UserDetailData } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

export function useUserEmails() {
  const { toast } = useToast();

  /**
   * Fetch email addresses for a list of users
   */
  const fetchUserEmails = async (
    userData: any[],
    userIdField: string = "id"
  ): Promise<UserDetailData[]> => {
    try {
      // Extract user IDs from the data
      const userIds = userData.map(user => user[userIdField] as string);
      
      console.log("Fetching emails for user IDs:", userIds);
      
      if (userIds.length === 0) {
        console.log("No user IDs provided for email lookup");
        return userData as UserDetailData[];
      }
      
      // Call the RPC function to get user emails
      const { data: emailsData, error: emailsError } = await supabase
        .rpc('get_user_emails', { user_ids: userIds });
      
      if (emailsError) {
        console.error("Error fetching emails:", emailsError);
        console.error("Error details:", emailsError.message, emailsError.details);
        
        // Show a toast notification for the error
        toast({
          title: "Error fetching user emails",
          description: emailsError.message,
          variant: "destructive",
        });
        
        return userData as UserDetailData[];
      }
      
      console.log("Fetched email data:", emailsData);
      
      // Create a mapping of user IDs to email addresses
      const emailMap = (emailsData || []).reduce((map, item) => {
        if (item.id) {
          map[item.id] = item.email;
        }
        return map;
      }, {} as Record<string, string | null>);
      
      console.log("Email mapping:", emailMap);
      
      // Merge the email data with the user data
      const usersWithEmail = userData.map(user => {
        const userId = user[userIdField] || '';
        const userEmail = emailMap[userId] || null;
        console.log(`User ${user.username || userId} email:`, userEmail);
        
        return {
          ...user,
          email: userEmail
        };
      });
      
      console.log("Users with emails merged:", usersWithEmail.length);
      return usersWithEmail as UserDetailData[];
    } catch (error) {
      console.error("Error processing emails:", error);
      return userData as UserDetailData[]; // Return original data if there's an error
    }
  };

  return { fetchUserEmails };
}
