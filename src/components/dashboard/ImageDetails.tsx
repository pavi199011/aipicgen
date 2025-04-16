
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Download,
  Trash2
} from "lucide-react";
import { formatDate, formatTime } from "@/utils/dateFormatters";

interface ImageDetailsProps {
  prompt: string;
  model: string;
  createdAt: string;
  downloading: boolean;
  isDeleting: boolean;
  onDownload: () => void;
  onDeleteClick: () => void;
}

const ImageDetails = ({ 
  prompt, 
  model, 
  createdAt, 
  downloading, 
  isDeleting, 
  onDownload, 
  onDeleteClick 
}: ImageDetailsProps) => {
  return (
    <div className="flex flex-col items-start w-full">
      <div className="w-full flex justify-between items-center mb-2">
        <p className="text-sm font-medium">
          Model: {model.toUpperCase()}
        </p>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7" 
            onClick={onDownload}
            disabled={downloading}
            title="Download image"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50" 
            onClick={onDeleteClick}
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
    </div>
  );
};

export default ImageDetails;
