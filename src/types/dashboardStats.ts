
// Types for admin dashboard statistics

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
  activityData: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  type: "login" | "content" | "registration" | "settings" | "admin";
  status?: "success" | "warning" | "pending";
}
