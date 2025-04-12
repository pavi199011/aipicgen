
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart, 
  LogOut, 
  Users, 
  Image as ImageIcon, 
  Trash2, 
  LayoutDashboard, 
  Settings 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  email?: string;
  username?: string;
  created_at: string;
}

interface UserStats {
  id: string;
  email?: string;
  username?: string;
  imageCount: number;
}

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const { toast } = useToast();

  // Admin Check - this is a simple check for demonstration
  // In a real app, you'd use proper role-based access
  const isAdmin = user?.email?.includes("admin");

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
      fetchUserStats();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (error) throw error;
      
      // If we have auth data, add it to our user objects
      const enhancedUsers = data?.map(profile => {
        return {
          id: profile.id,
          username: profile.username,
          created_at: profile.created_at,
          email: profile.id === user?.id ? user.email : undefined
        };
      }) || [];
      
      setUsers(enhancedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Could not fetch users. You may not have admin privileges.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (profilesError) throw profilesError;
      
      // For each profile, fetch their image count
      const statsPromises = (profilesData || []).map(async (profile) => {
        const { count, error } = await supabase
          .from("generated_images")
          .select("id", { count: "exact" })
          .eq("user_id", profile.id);
          
        if (error) throw error;
        
        return {
          id: profile.id,
          username: profile.username,
          email: profile.id === user?.id ? user.email : undefined,
          imageCount: count || 0,
        };
      });
      
      const stats = await Promise.all(statsPromises);
      setUserStats(stats);
      
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      toast({
        title: "Error",
        description: "Could not fetch user statistics.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // First delete user's images
      await supabase
        .from("generated_images")
        .delete()
        .eq("user_id", userId);
        
      // Then delete the profile (cannot directly delete auth.users from client)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User data deleted successfully. Note: In this demo, the auth user remains.",
      });
      
      // Refresh user list
      fetchUsers();
      fetchUserStats();
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Could not delete user",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-5">
          <div className="mb-8">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Management Panel</p>
          </div>
          
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#users">
                <Users className="mr-2 h-4 w-4" />
                Users
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#statistics">
                <BarChart className="mr-2 h-4 w-4" />
                Statistics
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a href="#settings">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </a>
            </Button>
          </nav>
          
          <div className="absolute bottom-5 w-52">
            <Button variant="outline" onClick={signOut} className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 p-8">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <h2 className="text-2xl font-bold">Admin Dashboard</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-2" />
                      {loading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{users.length}</p>}
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
                        <p className="text-2xl font-bold">
                          {userStats.reduce((acc, user) => acc + user.imageCount, 0)}
                        </p>
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
                        <p className="text-2xl font-bold">
                          {userStats.length > 0 
                            ? (userStats.reduce((acc, user) => acc + user.imageCount, 0) / userStats.length).toFixed(1) 
                            : '0'}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="users">
              <h2 className="text-2xl font-bold mb-6">User Management</h2>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Created At</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>{user.username || 'No username'}</TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="statistics">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
