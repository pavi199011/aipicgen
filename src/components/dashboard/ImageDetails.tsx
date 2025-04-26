
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface ImageDetailsProps {
  prompt: string;
  model: string;
  createdAt: string;
  downloading: boolean;
  isDeleting: boolean;
  onDownload: () => void;
  onDeleteClick: () => void;
  compact?: boolean;
}

const ImageDetails = ({
  prompt,
  model,
  createdAt,
  downloading,
  isDeleting,
  onDownload,
  onDeleteClick,
  compact = false
}: ImageDetailsProps) => {
  const isMobile = useIsMobile();
  
  const truncatePrompt = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
  
  const promptMaxLength = compact ? 40 : 100;
  const displayPrompt = truncatePrompt(prompt, promptMaxLength);
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  return (
    <div className="w-full">
      <p className="font-medium text-sm mb-1 line-clamp-2" title={prompt}>
        {displayPrompt}
      </p>
      <div className="flex justify-between items-center w-full">
        <div className="text-xs text-muted-foreground">
          <span className="mr-2">{model}</span>
          <span>•</span>
          <span className="ml-2">{formattedDate}</span>
        </div>
        
        <div className="flex gap-2">
          {!isMobile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={compact ? "sm" : "icon"}
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload();
                    }}
                    disabled={downloading}
                    className="h-7 w-7"
                  >
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Download</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download Image</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size={compact ? "sm" : "icon"}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteClick();
                  }}
                  disabled={isDeleting}
                  className="h-7 w-7 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default ImageDetails;
