
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Download,
  ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: string;
}

const ImageCard = ({ imageUrl, prompt, model, createdAt }: ImageCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy");
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "h:mm a");
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to download image");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      
      // Extract filename from the URL or create one based on date
      let filename = `ai-image-${new Date().toISOString().slice(0, 10)}.png`;
      if (imageUrl.includes("/")) {
        const urlParts = imageUrl.split("/");
        const potentialFilename = urlParts[urlParts.length - 1];
        if (potentialFilename.includes(".")) {
          filename = potentialFilename;
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleViewFullSize = () => {
    window.open(imageUrl, "_blank");
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CardContent className="p-0 relative">
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/512x512?text=Image+Load+Error";
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            className={`transition-opacity duration-200 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleViewFullSize}
            title="View full size"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className={`transition-opacity duration-200 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleDownload}
            disabled={downloading}
            title="Download image"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <div className="w-full flex justify-between items-center mb-2">
          <p className="text-sm font-medium">
            Model: {model.toUpperCase()}
          </p>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={handleDownload}
            disabled={downloading}
            title="Download image"
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm line-clamp-2 text-gray-600 mb-2">
          {prompt}
        </p>
        <div className="w-full flex items-center justify-between mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTime(createdAt)}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;
