import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DashboardStats {
  users: {
    totalUsers: number;
    growthRate: number;
    activeUsers: number;
    activeGrowthRate: number;
    dailyRegistrations: { name: string; value: number }[];
    weeklyRegistrations: { name: string; value: number }[];
    monthlyRegistrations: { name: string; value: number }[];
    yearlyRegistrations: { name: string; value: number }[];
  };
  content: {
    totalImages: number;
    growthRate: number;
    conversionRate: number;
    conversionGrowth: number;
    contentTypes: { name: string; value: number }[];
  };
  activityData: any[]; // Using any for now, replace with proper type when implemented
}

export function useAdminDashboardStats(period: string = 'week') {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch total users count
        const { count: totalUsers, error: usersError } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Fetch total images count
        const { count: totalImages, error: imagesError } = await supabase
          .from('generated_images')
          .select('id', { count: 'exact', head: true });

        if (imagesError) throw imagesError;

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

        // Instead of using group, we'll fetch all images and manually count by model
        const { data: modelData, error: contentTypesError } = await supabase
          .from('generated_images')
          .select('model')
          .limit(1000);

        if (contentTypesError) throw contentTypesError;
        
        // Process the model data to count occurrences of each model
        const modelCounts: Record<string, number> = {};
        modelData?.forEach(item => {
          if (item.model) {
            modelCounts[item.model] = (modelCounts[item.model] || 0) + 1;
          }
        });
        
        // Convert to the required format
        const contentTypes = Object.entries(modelCounts).map(([name, value]) => ({
          name,
          value
        }));

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

        // For conversion rate, we'll use the ratio of images to users as a simple metric
        const conversionRate = totalUsers ? Math.round((totalImages / totalUsers) * 100) : 0;

        // Mock growth rates for now (in a real app, these would be calculated by comparing with previous periods)
        const userGrowthRate = calculateGrowthRate(registrationData, 'week');
        const activeGrowthRate = 5.8; // Mock value
        const contentGrowthRate = 12.3; // Mock value
        const conversionGrowth = 2.1; // Mock value

        setStats({
          users: {
            totalUsers: totalUsers || 0,
            growthRate: parseFloat(userGrowthRate.toFixed(1)),
            activeUsers,
            activeGrowthRate,
            dailyRegistrations,
            weeklyRegistrations,
            monthlyRegistrations,
            yearlyRegistrations
          },
          content: {
            totalImages: totalImages || 0,
            growthRate: contentGrowthRate,
            conversionRate,
            conversionGrowth,
            contentTypes: contentTypes.length > 0 ? contentTypes : [{ name: 'No Data', value: 0 }]
          },
          activityData: [] // We'll implement real activity data in a future enhancement
        });
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  // Helper function to process registration data for different time periods
  const processRegistrationData = (data: any[], period: string) => {
    if (!data) return [];

    const now = new Date();
    const result: { name: string; value: number }[] = [];

    switch (period) {
      case 'day':
        // Last 24 hours in 4-hour intervals
        for (let i = 0; i < 6; i++) {
          const hourLabel = i * 4;
          const intervalStart = new Date(now);
          intervalStart.setHours(now.getHours() - 24 + hourLabel);
          intervalStart.setMinutes(0);
          intervalStart.setSeconds(0);
          
          const intervalEnd = new Date(intervalStart);
          intervalEnd.setHours(intervalEnd.getHours() + 4);
          
          const count = data.filter(item => {
            const date = new Date(item.created_at);
            return date >= intervalStart && date < intervalEnd;
          }).length;
          
          result.push({ name: `${hourLabel}h`, value: count });
        }
        break;
      case 'week':
        // Days of the current week
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const today = now.getDay();
        
        for (let i = 0; i < 7; i++) {
          const dayIndex = (today - 6 + i + 7) % 7; // Calculate day index starting from a week ago
          const dayName = dayNames[dayIndex];
          
          const dayStart = new Date(now);
          dayStart.setDate(now.getDate() - 6 + i);
          dayStart.setHours(0, 0, 0, 0);
          
          const dayEnd = new Date(dayStart);
          dayEnd.setHours(23, 59, 59, 999);
          
          const count = data.filter(item => {
            const date = new Date(item.created_at);
            return date >= dayStart && date < dayEnd;
          }).length;
          
          result.push({ name: dayName, value: count });
        }
        break;
      case 'month':
        // Weeks of the current month
        for (let i = 0; i < 4; i++) {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - 28 + (i * 7));
          weekStart.setHours(0, 0, 0, 0);
          
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);
          weekEnd.setHours(23, 59, 59, 999);
          
          const count = data.filter(item => {
            const date = new Date(item.created_at);
            return date >= weekStart && date < weekEnd;
          }).length;
          
          result.push({ name: `Week ${i + 1}`, value: count });
        }
        break;
      case 'year':
        // Months of the current year
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        for (let i = 0; i < 12; i++) {
          const monthStart = new Date(now.getFullYear(), i, 1);
          const monthEnd = new Date(now.getFullYear(), i + 1, 0, 23, 59, 59, 999);
          
          const count = data.filter(item => {
            const date = new Date(item.created_at);
            return date >= monthStart && date <= monthEnd;
          }).length;
          
          result.push({ name: monthNames[i], value: count });
        }
        break;
      default:
        // Default to weekly if period is not recognized
        return processRegistrationData(data, 'week');
    }

    return result;
  };

  // Helper function to calculate growth rate
  const calculateGrowthRate = (data: any[], period: string) => {
    if (!data || data.length === 0) return 0;
    
    const now = new Date();
    let currentPeriodStart: Date;
    let previousPeriodStart: Date;
    
    switch (period) {
      case 'day':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setHours(0, 0, 0, 0);
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 1);
        break;
      case 'week':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setDate(now.getDate() - 7);
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setDate(previousPeriodStart.getDate() - 7);
        break;
      case 'month':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setMonth(now.getMonth() - 1);
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setMonth(previousPeriodStart.getMonth() - 1);
        break;
      case 'year':
        currentPeriodStart = new Date(now);
        currentPeriodStart.setFullYear(now.getFullYear() - 1);
        previousPeriodStart = new Date(currentPeriodStart);
        previousPeriodStart.setFullYear(previousPeriodStart.getFullYear() - 1);
        break;
      default:
        return 0;
    }
    
    const currentCount = data.filter(item => new Date(item.created_at) >= currentPeriodStart).length;
    const previousCount = data.filter(item => {
      const date = new Date(item.created_at);
      return date >= previousPeriodStart && date < currentPeriodStart;
    }).length;
    
    // Avoid division by zero
    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    
    return ((currentCount - previousCount) / previousCount) * 100;
  };

  return { stats, loading, error };
}
