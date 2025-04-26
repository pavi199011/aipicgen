
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useFetchImages } from "@/hooks/useFetchImages";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import CreateTabContent from "@/components/dashboard/CreateTabContent";
import GalleryTabContent from "@/components/dashboard/GalleryTabContent";
import TabsContainer from "@/components/dashboard/TabsContainer";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const {
    images,
    loading: imagesLoading,
    error: fetchError,
    fetchImages
  } = useFetchImages(user.id);
  
  const {
    generateImage,
    generating,
    error: generationError,
    retryLastGeneration,
    hasLastPrompt
  } = useImageGeneration(user.id, fetchImages);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3 md:mb-4 gap-2">
          <div>
            <h1 className="text-lg md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
              {imagesLoading
                ? "Loading your image count..."
                : `You have generated ${images.length} image${images.length === 1 ? "" : "s"}.`}
            </p>
          </div>
        </div>

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
    </DashboardLayout>
  );
};

export default Dashboard;
