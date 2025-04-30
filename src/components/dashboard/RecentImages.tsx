
import { GeneratedImage } from "@/hooks/useFetchImages";
import RecentImageCard from "./RecentImageCard";
import RecentImagesLoading from "./RecentImagesLoading";
import RecentImagesError from "./RecentImagesError";
import RecentImagesEmpty from "./RecentImagesEmpty";

interface RecentImagesProps {
  images: GeneratedImage[];
  loading: boolean;
  error: string | null;
}

const RecentImages = ({ images, loading, error }: RecentImagesProps) => {
  const recentImages = images.slice(0, 4);
  
  if (loading) {
    return <RecentImagesLoading />;
  }

  if (error) {
    return <RecentImagesError error={error} />;
  }

  if (recentImages.length === 0) {
    return <RecentImagesEmpty />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {recentImages.map((image) => (
        <RecentImageCard
          key={image.id}
          image={image}
        />
      ))}
    </div>
  );
};

export default RecentImages;
