
import { useState } from "react";
import { Search, BarChart } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UserStat {
  id: string;
  username?: string;
  email?: string;
  imageCount: number;
}

interface UserStatisticsProps {
  userStats: UserStat[];
  loadingStats: boolean;
  onDeleteUser?: (userId: string) => void;
}

export const UserStatistics = ({ 
  userStats, 
  loadingStats,
  onDeleteUser
}: UserStatisticsProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users based on search term
  const filteredStats = userStats.filter(user => {
    const username = user.username?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return username.includes(search) || email.includes(search);
  });

  // Sort by image count (descending)
  const sortedStats = [...filteredStats].sort((a, b) => b.imageCount - a.imageCount);

  // Calculate total images
  const totalImages = userStats.reduce((sum, user) => sum + user.imageCount, 0);

  if (loadingStats) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">User Statistics</h2>
        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Statistics</h2>
      
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search users by username or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="mb-6">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 flex justify-between items-center">
            <div className="flex items-center">
              <BarChart className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="font-medium">Total Generated Images:</span>
            </div>
            <Badge className="text-lg py-1 px-3 bg-blue-600">{totalImages}</Badge>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Images Generated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No users found matching your search
                  </TableCell>
                </TableRow>
              ) : (
                sortedStats.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username || 'No username'}</TableCell>
                    <TableCell>{user.email || 'No email'}</TableCell>
                    <TableCell className="text-right font-medium">
                      {user.imageCount}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
