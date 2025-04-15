
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Image, 
  TrendingUp, 
  Activity
} from "lucide-react";
import { UserStats } from "./dashboard/UserStats";
import { ContentStats } from "./dashboard/ContentStats";
import { ActivityLog } from "./dashboard/ActivityLog";
import { activityData } from "./dashboard/mockData";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function AdminOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const { stats, loading, error } = useAdminDashboardStats(selectedPeriod);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Loading dashboard data...
            </p>
          </div>
          
          <Tabs 
            value={selectedPeriod} 
            onValueChange={setSelectedPeriod}
            className="mt-4 md:mt-0"
          >
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>
        
        <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading dashboard</AlertTitle>
          <AlertDescription>
            {error}. Please try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Render dashboard with real data
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back! Here's what's happening with your platform today.
          </p>
        </div>
        
        <Tabs 
          value={selectedPeriod} 
          onValueChange={setSelectedPeriod}
          className="mt-4 md:mt-0"
        >
          <TabsList>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`font-medium ${stats?.users.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.users.growthRate >= 0 ? '+' : ''}{stats?.users.growthRate || 0}%
                </span> from last {selectedPeriod}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Images</CardTitle>
              <Image className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.content.totalImages || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`font-medium ${stats?.content.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.content.growthRate >= 0 ? '+' : ''}{stats?.content.growthRate || 0}%
                </span> from last {selectedPeriod}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.content.conversionRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                <span className={`font-medium ${stats?.content.conversionGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.content.conversionGrowth >= 0 ? '+' : ''}{stats?.content.conversionGrowth || 0}%
                </span> from last {selectedPeriod}
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users.activeUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`font-medium ${stats?.users.activeGrowthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats?.users.activeGrowthRate >= 0 ? '+' : ''}{stats?.users.activeGrowthRate || 0}%
                </span> from last {selectedPeriod}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
      >
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>User registration trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              {stats && <UserStats data={stats.users} period={selectedPeriod} />}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card className="hover:shadow-md transition-shadow h-full">
            <CardHeader>
              <CardTitle>Content Distribution</CardTitle>
              <CardDescription>Types of content being created</CardDescription>
            </CardHeader>
            <CardContent>
              {stats && <ContentStats data={stats.content} />}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityLog data={activityData} />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
