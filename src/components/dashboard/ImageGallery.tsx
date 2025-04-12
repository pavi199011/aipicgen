
import { Skeleton } from "@/components/ui/skeleton";
import ImageCard from "./ImageCard";
import { GeneratedImage } from "@/hooks/useFetchImages";
import { AlertCircle, Image } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ImageGalleryProps {
  images: GeneratedImage[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

const ImageGallery = ({ images, loading, error, onRetry }: ImageGalleryProps) => {
  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex flex-col">
          <span>{error}</span>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2 self-start"
            onClick={onRetry}
          >
            Retry loading images
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg overflow-hidden">
            <Skeleton className="w-full h-64 rounded-t-lg" />
            <div className="p-4">
              <Skeleton className="h-4 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 border rounded-lg flex flex-col items-center">
        <Image className="h-16 w-16 text-gray-300 mb-4" />
        <p>You haven't generated any images yet</p>
        <p className="text-sm text-gray-400 mt-2">
          Use the form above to create your first AI-generated image
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          imageUrl={image.image_url}
          prompt={image.prompt}
          model={image.model}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
