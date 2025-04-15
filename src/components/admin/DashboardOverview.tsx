
import { Users, ImageIcon, BarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={userCount}
          icon={<Users className="h-8 w-8 text-blue-600" />}
          loading={loading}
        />
        
        <StatCard
          title="Total Images Generated"
          value={totalImages}
          icon={<ImageIcon className="h-8 w-8 text-purple-600" />}
          loading={loadingStats}
        />
        
        <StatCard
          title="Average Images per User"
          value={avgImagesPerUser}
          icon={<BarChart className="h-8 w-8 text-green-600" />}
          loading={loadingStats}
        />
      </div>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-sm text-yellow-800 dark:text-yellow-200">
        <p>The dashboard overview shows key metrics for your AI Image Generation Platform. More analytics features will be added in future updates.</p>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  loading: boolean;
}

const StatCard = ({ title, value, icon, loading }: StatCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{value}</p>
            )}
          </div>
          <div className="p-2 bg-primary/10 rounded-full">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
