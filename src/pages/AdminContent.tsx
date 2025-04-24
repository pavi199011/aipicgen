
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import BulkImageDelete from "@/components/admin/BulkImageDelete";

const AdminContent = () => {
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
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Content Management</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Manage images and other content across the platform
              </p>
            </div>
            
            <div className="space-y-8">
              <BulkImageDelete />
            </div>
          </motion.div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminContent;
