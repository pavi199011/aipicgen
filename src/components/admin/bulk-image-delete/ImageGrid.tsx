
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface ImageItem {
  id: string;
  image_url: string;
  prompt: string;
  model: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string | null;
  } | null;
  username?: string | null;
}

interface ImageGridProps {
  images?: ImageItem[];
  isLoading: boolean;
  selectedImages: string[];
  onImageSelect: (id: string) => void;
}

export const ImageGrid = ({
  images,
  isLoading,
  selectedImages,
  onImageSelect
}: ImageGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div key={i} className="border rounded-md p-2 h-[160px] animate-pulse bg-gray-100 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="py-10 text-center text-gray-500">
        <p>No images found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
      {images.map((image) => (
        <div 
          key={image.id} 
          className={`border rounded-md overflow-hidden relative group transition-all ${
            selectedImages.includes(image.id) ? 'ring-2 ring-purple-500' : ''
          }`}
        >
          <div className="absolute top-2 left-2 z-10">
            <Checkbox 
              checked={selectedImages.includes(image.id)}
              onCheckedChange={() => onImageSelect(image.id)}
              className="bg-white/70 dark:bg-gray-800/70"
            />
          </div>
          
          <div className="h-28 relative">
            <img 
              src={image.image_url} 
              alt={image.prompt}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
          </div>
          
          <div className="p-2 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">
                  {image.username ? image.username.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-gray-500 truncate">
                {image.username || image.user_id.substring(0, 6)}
              </p>
            </div>
            <p className="text-xs truncate mt-1" title={image.prompt}>
              {image.prompt}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
