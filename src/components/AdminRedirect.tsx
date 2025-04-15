
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const AdminRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    toast({
      title: "Admin Dashboard Removed",
      description: "The admin dashboard is no longer available. Redirecting to home page.",
      variant: "default",
    });
    
    // Redirect to home page
    navigate('/', { replace: true });
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="inline-block animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Redirecting to home page...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
