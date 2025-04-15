
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import UserManagement from "@/components/admin/UserManagement";

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Check if user exists and is an admin
  const isAdmin = user?.isAdmin === true;
  
  useEffect(() => {
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [user, isAdmin, navigate, toast]);

  // If no user is logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // If user is not an admin, show nothing (useEffect will redirect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and system settings</p>
        </div>
        
        <UserManagement />
      </main>
    </div>
  );
};

export default AdminDashboard;
