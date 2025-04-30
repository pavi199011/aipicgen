
import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageZoom from "@/components/common/ImageZoom";
import { useImageOperations } from "@/hooks/useImageOperations";
import { GeneratedImage } from "@/hooks/useFetchImages";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecentImageCardProps {
  image: GeneratedImage;
}

const RecentImageCard = ({ image }: RecentImageCardProps) => {
  const [isSelected, setIsSelected] = useState(false);
  const { downloading, handleDownload } = useImageOperations(image.id, image.image_url);
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div 
      className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
    >
      <div className="relative h-48 group">
        <img
          src={image.image_url}
          alt={image.prompt}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            console.error("Image failed to load:", image.image_url);
            setImageError(true);
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Mobile-optimized buttons that are always visible on mobile */}
          <div className={`${isMobile ? 'opacity-100 flex' : 'absolute opacity-0 group-hover:opacity-100 flex'} bottom-4 left-4 right-4 gap-2`}>
            <Button
              variant="secondary"
              size={isMobile ? "default" : "sm"}
              className={`flex-1 ${isMobile ? 'py-3 text-base' : ''}`}
              onClick={() => setIsSelected(true)}
            >
              <Eye className={`${isMobile ? 'mr-3 h-5 w-5' : 'mr-2 h-4 w-4'}`} />
              Preview
            </Button>
            <Button
              variant="secondary"
              size={isMobile ? "default" : "sm"}
              className={`flex-1 ${isMobile ? 'py-3 text-base' : ''}`}
              onClick={() => handleDownload()}
              disabled={downloading || imageError}
            >
              <Download className={`${isMobile ? 'mr-3 h-5 w-5' : 'mr-2 h-4 w-4'}`} />
              {downloading ? "..." : "Download"}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
          {image.prompt}
        </p>
        <p className="text-xs text-gray-400">
          {new Date(image.created_at).toLocaleString()}
        </p>
      </div>

      {isSelected && (
        <ImageZoom
          imageUrl={image.image_url}
          alt={image.prompt}
          isOpen={isSelected}
          onOpenChange={() => setIsSelected(false)}
        />
      )}
    </div>
  );
};

export default RecentImageCard;
