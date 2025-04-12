
import { Skeleton } from "@/components/ui/skeleton";
import ImageCard from "./ImageCard";

interface Image {
  id: string;
  prompt: string;
  image_url: string;
  model: string;
}

interface ImageGalleryProps {
  images: Image[];
  loading: boolean;
}

const ImageGallery = ({ images, loading }: ImageGalleryProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="w-full h-64 rounded-t-lg" />
            <div className="mt-4">
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
      <div className="text-center py-10 text-gray-500">
        You haven't generated any images yet
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
