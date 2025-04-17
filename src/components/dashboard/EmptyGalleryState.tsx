
import { Image } from "lucide-react";

const EmptyGalleryState = () => {
  return (
    <div className="text-center py-10 text-gray-500 border rounded-lg flex flex-col items-center">
      <Image className="h-16 w-16 text-gray-300 mb-4" />
      <p>You haven't generated any images yet</p>
      <p className="text-sm text-gray-400 mt-2">
        Use the form above to create your first AI-generated image
      </p>
    </div>
  );
};

export default EmptyGalleryState;
