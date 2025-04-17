
import { GeneratedImage } from "@/hooks/useFetchImages";
import GalleryErrorState from "./GalleryErrorState";
import GalleryLoadingState from "./GalleryLoadingState";
import EmptyGalleryState from "./EmptyGalleryState";
import ImageGrid from "./ImageGrid";

interface ImageGalleryProps {
  images: GeneratedImage[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

const ImageGallery = ({ images, loading, error, onRetry }: ImageGalleryProps) => {
  if (error) {
    return <GalleryErrorState error={error} onRetry={onRetry} />;
  }

  if (loading) {
    return <GalleryLoadingState />;
  }

  if (images.length === 0) {
    return <EmptyGalleryState />;
  }

  return <ImageGrid images={images} onDelete={onRetry} />;
};

export default ImageGallery;
