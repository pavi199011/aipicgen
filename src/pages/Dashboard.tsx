
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageGeneratorForm from "@/components/dashboard/ImageGeneratorForm";
import ImageGallery from "@/components/dashboard/ImageGallery";
import { useFetchImages } from "@/hooks/useFetchImages";
import { useImageGeneration } from "@/hooks/useImageGeneration";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  
  // If user is not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const { images, loading, error: fetchError, fetchImages } = useFetchImages(user.id);
  const { generateImage, generating, error: generationError } = useImageGeneration(user.id, fetchImages);
  
  // Combined error from both hooks for display
  const error = fetchError || generationError;

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Generator</h1>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <ImageGeneratorForm 
        onGenerate={generateImage} 
        generating={generating} 
      />
      
      <h2 className="text-2xl font-bold mb-4">Your Generated Images</h2>
      
      <ImageGallery images={images} loading={loading} />
    </div>
  );
};

export default Dashboard;
