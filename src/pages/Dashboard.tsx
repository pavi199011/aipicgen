
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useFetchImages } from "@/hooks/useFetchImages";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import GalleryTabContent from "@/components/dashboard/GalleryTabContent";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const { images, loading: imagesLoading, error: fetchError, fetchImages } = useFetchImages(user.id);
  const { 
    generateImage,
    generating,
    error: generationError,
    retryLastGeneration,
    hasLastPrompt
  } = useImageGeneration(user.id, fetchImages);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <GalleryTabContent 
          images={images}
          loading={imagesLoading}
          error={fetchError}
          onRetry={fetchImages}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
