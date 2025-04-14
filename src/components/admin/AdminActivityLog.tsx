
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, User, Clock, AlarmClockCheck, Cog } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const AdminActivityLog = () => {
  // Sample activity data
  const activities = [
    { id: 1, action: "User Login", user: "admin@pixelpalette.tech", timestamp: "2025-04-14T09:15:00Z", details: "Login from 192.168.1.1" },
    { id: 2, action: "Image Generated", user: "demo_user", timestamp: "2025-04-14T08:45:00Z", details: "Model: Realistic 3D" },
    { id: 3, action: "User Created", user: "system", timestamp: "2025-04-13T14:22:00Z", details: "New account: john_doe" },
    { id: 4, action: "Settings Updated", user: "admin@pixelpalette.tech", timestamp: "2025-04-13T11:30:00Z", details: "Changed API limits" },
    { id: 5, action: "Image Deleted", user: "demo_user", timestamp: "2025-04-12T16:05:00Z", details: "ID: img_12345" }
  ];

  const getActionIcon = (action: string) => {
    switch (true) {
      case action.includes("Login") || action.includes("Logout"):
        return <User className="h-4 w-4 text-blue-500" />;
      case action.includes("Image"):
        return <Activity className="h-4 w-4 text-purple-500" />;
      case action.includes("User"):
        return <User className="h-4 w-4 text-green-500" />;
      case action.includes("Settings"):
        return <Cog className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (true) {
      case action.includes("Login") || action.includes("Logout"):
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Auth</Badge>;
      case action.includes("Image"):
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Content</Badge>;
      case action.includes("User Created") || action.includes("User Deleted"):
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">User</Badge>;
      case action.includes("Settings"):
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">System</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };
  
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">Activity Log</h2>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getActionIcon(activity.action)}
                      <span className="ml-2">{activity.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>{activity.user}</TableCell>
                  <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                  <TableCell>{activity.details}</TableCell>
                  <TableCell>{getActionBadge(activity.action)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p className="flex items-center">
          <AlarmClockCheck className="h-4 w-4 mr-2" />
          Activity log is simulated in development mode
        </p>
      </div>
    </>
  );
};
