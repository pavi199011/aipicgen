
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ImagePreview from "./ImagePreview";
import ImageDetails from "./ImageDetails";
import DeleteImageDialog from "./DeleteImageDialog";
import { useImageOperations } from "@/hooks/useImageOperations";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const {
    downloading,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleDownload,
    handleDelete
  } = useImageOperations(id, imageUrl, onDelete);

  return (
    <Card 
      className="group overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={() => isMobile && setIsHovering(!isHovering)}
    >
      <CardContent className="p-0 relative">
        <ImagePreview
          imageUrl={imageUrl}
          prompt={prompt}
          isHovering={isHovering || isMobile}
          downloading={downloading}
          isDeleting={isDeleting}
          onDownload={handleDownload}
          onDeleteClick={() => setShowDeleteConfirm(true)}
        />
      </CardContent>
      
      <CardFooter className="flex flex-col items-start p-3 md:p-4">
        <ImageDetails
          prompt={prompt}
          model={model}
          createdAt={createdAt}
          downloading={downloading}
          isDeleting={isDeleting}
          onDownload={handleDownload}
          onDeleteClick={() => setShowDeleteConfirm(true)}
          compact={isMobile}
        />
      </CardFooter>

      <DeleteImageDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </Card>
  );
};

export default ImageCard;
