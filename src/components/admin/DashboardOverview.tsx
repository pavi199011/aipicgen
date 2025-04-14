
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, ImageIcon, BarChart, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DashboardOverviewProps {
  userCount: number;
  totalImages: number;
  avgImagesPerUser: string;
  loading: boolean;
  loadingStats: boolean;
}

// Generate sample data for the demo
const generateDemoData = () => {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: Math.floor(Math.random() * 5) + 10 + i,
      images: Math.floor(Math.random() * 20) + 50 + i * 2,
    });
  }
  return data;
};

export const DashboardOverview = ({
  userCount,
  totalImages,
  avgImagesPerUser,
  loading,
  loadingStats
}: DashboardOverviewProps) => {
  const [demoData, setDemoData] = useState<any[]>([]);
  
  useEffect(() => {
    setDemoData(generateDemoData());
  }, []);
  
  // Calculate percentage changes (demo data)
  const userChange = 12.8; // percent
  const imageChange = 8.3; // percent
  const avgChange = -2.5; // percent
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  {loading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{userCount}</p>
                  )}
                  <div className="flex items-center mt-1">
                    {userChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${userChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(userChange)}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 mr-3">
                  <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  {loadingStats ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{totalImages}</p>
                  )}
                  <div className="flex items-center mt-1">
                    {imageChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${imageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(imageChange)}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Images per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3">
                  <BarChart className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  {loadingStats ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-bold">{avgImagesPerUser}</p>
                  )}
                  <div className="flex items-center mt-1">
                    {avgChange > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={`text-xs ${avgChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {Math.abs(avgChange)}% from last month
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white dark:bg-gray-800 mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-medium">Growth Trends</CardTitle>
            <div className="flex items-center">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Users</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Images</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={demoData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="#3b82f650" />
                <Area type="monotone" dataKey="images" stroke="#8b5cf6" fill="#8b5cf650" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                  <div className={`p-2 rounded-full ${
                    i % 3 === 0 ? "bg-green-100" : i % 3 === 1 ? "bg-blue-100" : "bg-amber-100"
                  } mr-3`}>
                    <TrendingUp className={`h-4 w-4 ${
                      i % 3 === 0 ? "text-green-600" : i % 3 === 1 ? "text-blue-600" : "text-amber-600"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{
                      i % 3 === 0 ? "New user registered" : 
                      i % 3 === 1 ? "New image generated" : 
                      "System update completed"
                    }</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{i * 10} minutes ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-medium">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">CPU Usage</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: "28%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: "42%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Storage Usage</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: "78%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">API Response Time</span>
                  <span className="text-sm font-medium">156ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: "15%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
