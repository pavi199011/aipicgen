import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminOverview } from "@/components/admin/AdminOverview";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50 dark:bg-slate-900">
        <AdminSidebar />
        
        <div className="flex-1 overflow-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 md:p-8"
          >
            <AdminOverview />
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;
