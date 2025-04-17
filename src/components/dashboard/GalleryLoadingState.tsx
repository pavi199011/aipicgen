
import { Skeleton } from "@/components/ui/skeleton";

const GalleryLoadingState = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <Skeleton className="w-full h-64 rounded-t-lg" />
          <div className="p-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-4 w-full" />
            <div className="flex justify-between mt-3">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryLoadingState;
