
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

  // Show image count and recently generated images summary at top
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {imagesLoading
                ? "Loading your image count..."
                : `You have generated ${
                    images.length
                  } image${images.length === 1 ? "" : "s"}.`}
            </p>
          </div>
          {/* Recently generated images thumbnails */}
          <div className="flex items-center gap-2">
            {images.slice(0, 3).map((img) => (
              <img
                key={img.id}
                src={img.image_url}
                alt={img.prompt}
                className="w-14 h-14 object-cover rounded-md border border-gray-200 dark:border-gray-700 shadow-sm"
              />
            ))}
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

