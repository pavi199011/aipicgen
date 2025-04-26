
import { useState } from "react";
import ImageCard from "./ImageCard";
import { GeneratedImage } from "@/hooks/useFetchImages";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface ImageGridProps {
  images: GeneratedImage[];
  onDelete: () => Promise<void>;
}

const ImageGrid = ({ images, onDelete }: ImageGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 12; // 3 rows x 4 columns on desktop

  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-2 sm:px-0">
        {currentImages.map((image) => (
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

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
