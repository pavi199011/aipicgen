
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserStats } from "@/types/admin";

interface UserStatisticsProps {
  userStats: UserStats[];
  loadingStats: boolean;
}

export const UserStatistics = ({ userStats, loadingStats }: UserStatisticsProps) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">User Statistics</h2>
      
      {loadingStats ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Images Generated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userStats.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username || 'No username'}</TableCell>
                    <TableCell>{user.imageCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </>
  );
};
