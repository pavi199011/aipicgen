
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ImageIcon, BarChart } from "lucide-react";
import { UserStats } from "@/types/admin";

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
    <>
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-2" />
              {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{userCount}</p>}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ImageIcon className="h-5 w-5 text-gray-500 mr-2" />
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">{totalImages}</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg Images per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-gray-500 mr-2" />
              {loadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-2xl font-bold">{avgImagesPerUser}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
