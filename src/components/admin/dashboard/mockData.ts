
// Type definitions for dashboard data
interface RegistrationData {
  name: string;
  value: number;
}

interface UsersData {
  totalUsers: number;
  growthRate: number;
  activeUsers: number;
  activeGrowthRate: number;
  dailyRegistrations: RegistrationData[];
  weeklyRegistrations: RegistrationData[];
  monthlyRegistrations: RegistrationData[];
  yearlyRegistrations: RegistrationData[];
}

interface ContentTypeData {
  name: string;
  value: number;
}

interface ContentData {
  totalImages: number;
  growthRate: number;
  conversionRate: number;
  conversionGrowth: number;
  contentTypes: ContentTypeData[];
}

interface ActivityUser {
  name: string;
  avatarUrl: string;
}

interface ActivityItem {
  id: string;
  user: ActivityUser;
  action: string;
  target?: string;
  timestamp: string;
  type: "login" | "content" | "registration" | "settings" | "admin";
  status?: "success" | "warning" | "pending";
}

// Actual data with type annotations
export const usersData: UsersData = {
  totalUsers: 1458,
  growthRate: 12.4,
  activeUsers: 973,
  activeGrowthRate: 8.2,
  dailyRegistrations: [
    { name: "12 AM", value: 5 },
    { name: "4 AM", value: 3 },
    { name: "8 AM", value: 8 },
    { name: "12 PM", value: 15 },
    { name: "4 PM", value: 12 },
    { name: "8 PM", value: 10 },
  ],
  weeklyRegistrations: [
    { name: "Mon", value: 25 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 45 },
    { name: "Thu", value: 38 },
    { name: "Fri", value: 52 },
    { name: "Sat", value: 65 },
    { name: "Sun", value: 48 },
  ],
  monthlyRegistrations: [
    { name: "Week 1", value: 180 },
    { name: "Week 2", value: 210 },
    { name: "Week 3", value: 270 },
    { name: "Week 4", value: 320 },
  ],
  yearlyRegistrations: [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 450 },
    { name: "Mar", value: 520 },
    { name: "Apr", value: 590 },
    { name: "May", value: 650 },
    { name: "Jun", value: 720 },
    { name: "Jul", value: 850 },
    { name: "Aug", value: 920 },
    { name: "Sep", value: 1050 },
    { name: "Oct", value: 1180 },
    { name: "Nov", value: 1320 },
    { name: "Dec", value: 1458 },
  ],
};

export const contentData: ContentData = {
  totalImages: 4285,
  growthRate: 18.7,
  conversionRate: 24.8,
  conversionGrowth: 3.6,
  contentTypes: [
    { name: "Portraits", value: 1850 },
    { name: "Landscapes", value: 1200 },
    { name: "Abstract", value: 650 },
    { name: "Other", value: 585 },
  ],
};

export const activityData: ActivityItem[] = [
  {
    id: "1",
    user: {
      name: "Admin",
      avatarUrl: "",
    },
    action: "Logged in to the admin dashboard",
    timestamp: "2025-04-15T16:45:00",
    type: "login",
    status: "success",
  },
  {
    id: "2",
    user: {
      name: "John Doe",
      avatarUrl: "",
    },
    action: "Generated a new image",
    target: "Sunset landscape",
    timestamp: "2025-04-15T16:32:00",
    type: "content",
    status: "success",
  },
  {
    id: "3",
    user: {
      name: "Sarah Parker",
      avatarUrl: "",
    },
    action: "Created a new account",
    timestamp: "2025-04-15T16:15:00",
    type: "registration",
    status: "success",
  },
  {
    id: "4",
    user: {
      name: "Mike Johnson",
      avatarUrl: "",
    },
    action: "Updated profile settings",
    timestamp: "2025-04-15T15:55:00",
    type: "settings",
  },
  {
    id: "5",
    user: {
      name: "Emma Wilson",
      avatarUrl: "",
    },
    action: "Failed to generate image",
    target: "Urban cityscape",
    timestamp: "2025-04-15T15:30:00",
    type: "content",
    status: "warning",
  },
  {
    id: "6",
    user: {
      name: "Admin",
      avatarUrl: "",
    },
    action: "Updated system settings",
    timestamp: "2025-04-15T15:10:00",
    type: "admin",
  },
  {
    id: "7",
    user: {
      name: "Alex Turner",
      avatarUrl: "",
    },
    action: "Uploaded custom image",
    timestamp: "2025-04-15T14:45:00",
    type: "content",
    status: "success",
  },
  {
    id: "8",
    user: {
      name: "Lisa Stewart",
      avatarUrl: "",
    },
    action: "Processing image request",
    target: "Pet portrait",
    timestamp: "2025-04-15T14:30:00",
    type: "content",
    status: "pending",
  },
];
