
import ImageGallery from "@/components/dashboard/ImageGallery";
import { GeneratedImage } from "@/hooks/useFetchImages";

interface GalleryTabContentProps {
  images: GeneratedImage[];
  loading: boolean;
  error: string | null;
  onRetry: () => Promise<void>;
}

const GalleryTabContent = ({ images, loading, error, onRetry }: GalleryTabContentProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6">Your Generated Images</h2>
      <ImageGallery 
        images={images} 
        loading={loading} 
        error={error}
        onRetry={onRetry}
      />
    </div>
  );
};

export default GalleryTabContent;
