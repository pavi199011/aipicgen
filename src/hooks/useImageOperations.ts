
import { useState } from "react";
import { toast } from "sonner";
import { deleteGeneratedImage } from "@/utils/supabase-helpers";

export const useImageOperations = (id: string, imageUrl: string, onDelete?: () => void) => {
  const [downloading, setDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
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
      
      // Use PNG extension for downloaded files
      const filename = `ai-image-${new Date().toISOString().slice(0, 10)}.png`;
      
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Call the improved deleteGeneratedImage function that handles complete removal
      const success = await deleteGeneratedImage(id);
      
      if (!success) {
        throw new Error("Failed to delete image");
      }
      
      toast.success("Image deleted successfully!");
      
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

  return {
    downloading,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDownload,
    handleDelete
  };
};
