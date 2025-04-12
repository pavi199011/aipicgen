
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageGeneratorForm from "@/components/dashboard/ImageGeneratorForm";
import ImageGallery from "@/components/dashboard/ImageGallery";
import { useFetchImages } from "@/hooks/useFetchImages";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <header className="bg-white border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              PixelPalette
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <span className="text-sm text-gray-600 mr-2">
                Signed in as <span className="font-medium">{user.email}</span>
              </span>
            </div>
            <Button onClick={signOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <motion.div 
        className="container mx-auto py-8 px-4 max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Tabs defaultValue="create" className="space-y-8">
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="create">Create</TabsTrigger>
              <TabsTrigger value="gallery">Your Gallery</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="create">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="col-span-1 lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Generate New Image</h2>
                  <ImageGeneratorForm 
                    onGenerate={generateImage} 
                    generating={generating} 
                    error={generationError}
                    retryGeneration={retryLastGeneration}
                    hasLastPrompt={hasLastPrompt}
                  />
                </div>
              </div>
              
              <div className="col-span-1 lg:col-span-2">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-4">Recently Created</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {imagesLoading ? (
                      // Show loading skeletons
                      [1, 2].map((i) => (
                        <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
                          <div className="bg-gray-200 w-full h-64 rounded-t-lg" />
                          <div className="p-4">
                            <div className="h-4 w-1/3 bg-gray-200 mb-2 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))
                    ) : images.length > 0 ? (
                      // Show the most recent 2 images
                      images.slice(0, 2).map((image) => (
                        <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative h-64">
                            <img 
                              src={image.image_url} 
                              alt={image.prompt} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-sm text-gray-500">
                              {new Date(image.created_at).toLocaleString()}
                            </p>
                            <p className="text-sm line-clamp-2 mt-1">{image.prompt}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-500">
                        <p>No images generated yet. Create your first image!</p>
                      </div>
                    )}
                  </div>
                  
                  {fetchError && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{fetchError}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-6">Your Generated Images</h2>
              <ImageGallery 
                images={images} 
                loading={imagesLoading} 
                error={fetchError}
                onRetry={fetchImages}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Dashboard;
