
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
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Your Generated Images</h2>
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
