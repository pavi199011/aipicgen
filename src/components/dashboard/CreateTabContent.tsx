
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageGeneratorForm from "@/components/dashboard/ImageGeneratorForm";
import { GeneratedImage } from "@/hooks/useFetchImages";

interface CreateTabContentProps {
  images: GeneratedImage[];
  imagesLoading: boolean;
  fetchError: string | null;
  generateImage: (prompt: string, model: string, settings: {
    aspectRatio: string;
    numOutputs: number;
    inferenceSteps: number;
  }) => Promise<void>;
  generating: boolean;
  generationError: string | null;
  retryLastGeneration: () => Promise<void>;
  hasLastPrompt: boolean;
}

const CreateTabContent = ({
  images,
  imagesLoading,
  fetchError,
  generateImage,
  generating,
  generationError,
  retryLastGeneration,
  hasLastPrompt
}: CreateTabContentProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="col-span-1 lg:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Generate New Image</h2>
          <ImageGeneratorForm 
            onGenerate={generateImage} 
            generating={generating} 
            error={generationError}
            retryGeneration={retryLastGeneration}
            hasLastPrompt={hasLastPrompt}
          />
        </div>
      </div>
      
      <div className="col-span-1 lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Recently Created</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {imagesLoading ? (
              // Show loading skeletons
              [1, 2].map((i) => (
                <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
                  <div className="bg-gray-200 w-full h-64 rounded-t-lg" />
                  <div className="p-4">
                    <div className="h-4 w-1/3 bg-gray-200 mb-2 rounded"></div>
                    <div className="h-4 w-full bg-gray-200 rounded"></div>
                    <div className="flex justify-between mt-3">
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : images.length > 0 ? (
              // Show the most recent 2 images
              images.slice(0, 2).map((image) => (
                <div key={image.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-64">
                    <img 
                      src={image.image_url} 
                      alt={image.prompt} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-500">
                      {new Date(image.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm line-clamp-2 mt-1">{image.prompt}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 text-center py-10 text-gray-500">
                <p>No images generated yet. Create your first image!</p>
              </div>
            )}
          </div>
          
          {fetchError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{fetchError}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTabContent;
