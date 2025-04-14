
import { Users, ImageIcon, BarChart } from "lucide-react";
import { StatsCard } from "./dashboard/StatsCard";
import { GrowthChart } from "./dashboard/GrowthChart";
import { RecentActivity } from "./dashboard/RecentActivity";
import { SystemStatus } from "./dashboard/SystemStatus";

interface DashboardOverviewProps {
  userCount: number;
  totalImages: number;
  avgImagesPerUser: string;
  loading: boolean;
  loadingStats: boolean;
}

export const DashboardOverview = ({
  userCount,
  totalImages,
  avgImagesPerUser,
  loading,
  loadingStats
}: DashboardOverviewProps) => {
  // Calculate percentage changes (demo data)
  const userChange = 12.8; // percent
  const imageChange = 8.3; // percent
  const avgChange = -2.5; // percent
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total Users"
          value={userCount}
          icon={<Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
          change={userChange}
          loading={loading}
        />
        
        <StatsCard
          title="Total Images"
          value={totalImages}
          icon={<ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
          change={imageChange}
          loading={loadingStats}
        />
        
        <StatsCard
          title="Avg Images per User"
          value={avgImagesPerUser}
          icon={<BarChart className="h-5 w-5 text-green-600 dark:text-green-400" />}
          change={avgChange}
          loading={loadingStats}
        />
      </div>
      
      <GrowthChart />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivity />
        <SystemStatus />
      </div>
    </>
  );
};
