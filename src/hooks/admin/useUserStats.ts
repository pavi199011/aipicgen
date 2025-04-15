
import { supabase } from "@/integrations/supabase/client";
import { processRegistrationData, calculateGrowthRate } from "@/utils/admin/statsProcessing";

/**
 * Fetches and processes user-related statistics
 */
export const useUserStats = async (period: string) => {
  try {
    // Fetch total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    if (usersError) throw usersError;

    // Calculate active users (users who generated images in the last week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { data: activeUsersData, error: activeUsersError } = await supabase
      .from('generated_images')
      .select('user_id')
      .gte('created_at', oneWeekAgo.toISOString())
      .limit(1000);

    if (activeUsersError) throw activeUsersError;

    // Get unique active users
    const activeUsers = new Set(activeUsersData?.map(item => item.user_id)).size;

    // Calculate user registration trends
    const { data: registrationData, error: registrationError } = await supabase
      .from('profiles')
      .select('created_at')
      .order('created_at', { ascending: true });

    if (registrationError) throw registrationError;

    // Process registration data for different periods
    const dailyRegistrations = processRegistrationData(registrationData, 'day');
    const weeklyRegistrations = processRegistrationData(registrationData, 'week');
    const monthlyRegistrations = processRegistrationData(registrationData, 'month');
    const yearlyRegistrations = processRegistrationData(registrationData, 'year');

    // Calculate growth rates
    const userGrowthRate = calculateGrowthRate(registrationData, period);
    const activeGrowthRate = 5.8; // Mock value, would need proper calculation in production

    return {
      totalUsers: totalUsers || 0,
      growthRate: parseFloat(userGrowthRate.toFixed(1)),
      activeUsers,
      activeGrowthRate,
      dailyRegistrations,
      weeklyRegistrations,
      monthlyRegistrations,
      yearlyRegistrations
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};
