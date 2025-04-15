
import { supabase } from "@/integrations/supabase/client";
import type { ActivityItem } from "@/types/dashboardStats";

/**
 * Fetches and formats recent activity data
 */
export const useActivityData = async (): Promise<ActivityItem[]> => {
  try {
    // Fetch recent activity data
    const { data: activityData, error: activityError } = await supabase
      .from('generated_images')
      .select('id, created_at, prompt, model, user_id')
      .order('created_at', { ascending: false })
      .limit(10);

    if (activityError) throw activityError;

    if (!activityData || activityData.length === 0) {
      return [];
    }

    // Get usernames for activity data
    const userIds = activityData.map(item => item.user_id);
    const { data: usersData, error: usersDataError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url')
      .in('id', userIds);

    if (usersDataError) throw usersDataError;

    // Create a map of user IDs to usernames
    const userMap = new Map();
    usersData?.forEach(user => {
      userMap.set(user.id, {
        name: user.username || 'Anonymous User',
        avatarUrl: user.avatar_url
      });
    });

    // Format activity data
    return activityData.map(item => ({
      id: item.id,
      user: userMap.get(item.user_id) || { name: 'Anonymous User' },
      action: `Generated an image with prompt "${item.prompt.substring(0, 30)}${item.prompt.length > 30 ? '...' : ''}"`,
      target: item.model,
      timestamp: item.created_at,
      type: 'content',
      status: 'success'
    }));
  } catch (error) {
    console.error("Error fetching activity data:", error);
    return [];
  }
};
