
import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface ImageZoomProps {
  imageUrl: string;
  alt?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageZoom = ({ imageUrl, alt, isOpen, onOpenChange }: ImageZoomProps) => {
  const [scale, setScale] = useState(1);
  
  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };
  
  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleClose = () => {
    setScale(1);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          <img
            src={imageUrl}
            alt={alt}
            style={{
              transform: `scale(${scale})`,
              transition: 'transform 0.2s ease-in-out'
            }}
            className="w-full h-full object-contain"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomIn}
              disabled={scale >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoom;
