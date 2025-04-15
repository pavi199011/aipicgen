
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

const AdminRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // If user is logged in and is an admin, redirect to admin dashboard
    if (user?.isAdmin) {
      navigate('/admin', { replace: true });
      return;
    }
    
    // If user is logged in but not an admin, notify and redirect to home
    if (user && !user.isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate('/', { replace: true });
      return;
    }
    
    // If no user is logged in, redirect to admin login
    navigate('/admin/login', { replace: true });
  }, [navigate, toast, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
