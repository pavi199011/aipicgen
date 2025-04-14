
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

export const RecentActivity = () => {
  return (
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
  );
};
