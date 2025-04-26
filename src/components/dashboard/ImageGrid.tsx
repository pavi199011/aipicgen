
import { useState } from "react";
import ImageCard from "./ImageCard";
import { GeneratedImage } from "@/hooks/useFetchImages";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

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

  // Go to the previous page if not on first page
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
    }
  };

  // Go to the next page if not on last page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(p => p + 1);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

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
                  onClick={goToPrevPage}
                  className={cn(isFirstPage && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationNext 
                  onClick={goToNextPage}
                  className={cn(isLastPage && "pointer-events-none opacity-50")}
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
