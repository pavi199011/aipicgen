
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart, LineChart, PieChart } from "recharts";
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
  Calendar,
  Activity
} from "lucide-react";
import { UserStats } from "./dashboard/UserStats";
import { ContentStats } from "./dashboard/ContentStats";
import { ActivityLog } from "./dashboard/ActivityLog";
import { usersData, contentData, activityData } from "./dashboard/mockData";

export function AdminOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  
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
              <div className="text-2xl font-bold">{usersData.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+{usersData.growthRate}%</span> from last {selectedPeriod}
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
              <div className="text-2xl font-bold">{contentData.totalImages}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+{contentData.growthRate}%</span> from last {selectedPeriod}
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
              <div className="text-2xl font-bold">{contentData.conversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+{contentData.conversionGrowth}%</span> from last {selectedPeriod}
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
              <div className="text-2xl font-bold">{usersData.activeUsers}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500 font-medium">+{usersData.activeGrowthRate}%</span> from last {selectedPeriod}
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
              <UserStats data={usersData} period={selectedPeriod} />
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
              <ContentStats data={contentData} />
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
