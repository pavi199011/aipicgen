
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download,
  ZoomIn,
  Trash2,
  ImageOff
} from "lucide-react";
import ImageZoom from "@/components/common/ImageZoom";

interface ImagePreviewProps {
  imageUrl: string;
  prompt: string;
  isHovering: boolean;
  downloading: boolean;
  isDeleting: boolean;
  onDownload: () => void;
  onDeleteClick: () => void;
}

const ImagePreview = ({ 
  imageUrl, 
  prompt, 
  isHovering, 
  downloading, 
  isDeleting, 
  onDownload, 
  onDeleteClick 
}: ImagePreviewProps) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Image failed to load:", imageUrl);
    setImageError(true);
  };

  return (
    <div className="relative">
      {imageError ? (
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center">
            <ImageOff className="h-12 w-12 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Image not available</p>
          </div>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={handleImageError}
        />
      )}
      
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className={`transition-opacity duration-200 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsZoomOpen(true)}
          title="Zoom image"
          disabled={imageError}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          className={`transition-opacity duration-200 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          onClick={onDownload}
          disabled={downloading || imageError}
          title="Download image"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="destructive"
          className={`transition-opacity duration-200 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          onClick={onDeleteClick}
          disabled={isDeleting}
          title="Delete image"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {!imageError && (
        <ImageZoom
          imageUrl={imageUrl}
          alt={prompt}
          isOpen={isZoomOpen}
          onOpenChange={setIsZoomOpen}
        />
      )}
    </div>
  );
};

export default ImagePreview;
