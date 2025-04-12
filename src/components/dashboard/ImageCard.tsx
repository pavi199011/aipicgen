
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface ImageCardProps {
  imageUrl: string;
  prompt: string;
  model: string;
}

const ImageCard = ({ imageUrl, prompt, model }: ImageCardProps) => {
  return (
    <Card>
      <CardContent className="p-0 relative">
        <img
          src={imageUrl}
          alt={prompt}
          className="w-full h-64 object-cover rounded-t-lg"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/512x512?text=Image+Load+Error";
          }}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start p-4">
        <p className="text-sm font-medium mb-1">
          Model: {model.toUpperCase()}
        </p>
        <p className="text-sm line-clamp-2 text-gray-600">
          {prompt}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ImageCard;
