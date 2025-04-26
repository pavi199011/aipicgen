
import ImageCard from "./ImageCard";
import { GeneratedImage } from "@/hooks/useFetchImages";

interface ImageGridProps {
  images: GeneratedImage[];
  onDelete: () => Promise<void>;
}

const ImageGrid = ({ images, onDelete }: ImageGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 sm:px-0">
      {images.map((image) => (
        <ImageCard
          key={image.id}
          id={image.id}
          imageUrl={image.image_url}
          prompt={image.prompt}
          model={image.model}
          createdAt={image.created_at}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ImageGrid;
