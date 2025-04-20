
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Download,
  ZoomIn,
  Trash2
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

  return (
    <div className="relative">
      <img
        src={imageUrl}
        alt={prompt}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
        onError={(e) => {
          console.error("Image failed to load:", imageUrl);
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <Button
          size="icon"
          variant="secondary"
          className={`transition-opacity duration-200 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsZoomOpen(true)}
          title="Zoom image"
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
          disabled={downloading}
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

      <ImageZoom
        imageUrl={imageUrl}
        alt={prompt}
        isOpen={isZoomOpen}
        onOpenChange={setIsZoomOpen}
      />
    </div>
  );
};

export default ImagePreview;
