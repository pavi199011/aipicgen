import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Download,
  ExternalLink,
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { deleteGeneratedImage } from "@/utils/supabase-helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface ImageCardProps {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  createdAt: string;
  onDelete?: () => void;
}

const ImageCard = ({ id, imageUrl, prompt, model, createdAt, onDelete }: ImageCardProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
      
      // Always use .jpg extension for downloads
      const filename = `ai-image-${new Date().toISOString().slice(0, 10)}.jpg`;
      
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      const success = await deleteGeneratedImage(id);
      
      if (!success) {
        throw new Error("Failed to delete image");
      }
      
      toast.success("Image deleted successfully!");
      
      // Call onDelete callback to refresh the parent component
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
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
          <Button
            size="icon"
            variant="destructive"
            className={`transition-opacity duration-200 ${
              isHovering ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            title="Delete image"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <div className="w-full flex justify-between items-center mb-2">
          <p className="text-sm font-medium">
            Model: {model.toUpperCase()}
          </p>
          <div className="flex gap-2">
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
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" 
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
              title="Delete image"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
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

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Image"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ImageCard;
