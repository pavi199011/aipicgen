
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchImages } from "@/hooks/useFetchImages";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TabsContainer from "@/components/dashboard/TabsContainer";
import CreateTabContent from "@/components/dashboard/CreateTabContent";
import GalleryTabContent from "@/components/dashboard/GalleryTabContent";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  
  // If user is not authenticated, redirect to auth page
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
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} signOut={signOut} />
      
      <TabsContainer 
        createContent={
          <CreateTabContent 
            images={images}
            imagesLoading={imagesLoading}
            fetchError={fetchError}
            generateImage={generateImage}
            generating={generating}
            generationError={generationError}
            retryLastGeneration={retryLastGeneration}
            hasLastPrompt={hasLastPrompt}
          />
        }
        galleryContent={
          <GalleryTabContent 
            images={images}
            loading={imagesLoading}
            error={fetchError}
            onRetry={fetchImages}
          />
        }
      />
    </div>
  );
};

export default Dashboard;
