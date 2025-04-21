
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
  hasLastPrompt,
}: CreateTabContentProps) => {
  // We will display "recent" images, or an empty state
  const recentImages = images.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="col-span-1">
        <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 mb-4">
            Generate New Image
          </h2>
          <ImageGeneratorForm 
            onGenerate={generateImage} 
            generating={generating} 
            error={generationError}
            retryGeneration={retryLastGeneration}
            hasLastPrompt={hasLastPrompt}
          />
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg min-h-[420px] flex flex-col">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Recently Created</h2>
          <div className="flex-1">
            {imagesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array(4).fill(null).map((_, i) => (
                  <div key={i} className="border rounded-xl overflow-hidden animate-pulse bg-white dark:bg-gray-800 shadow-sm">
                    <div className="bg-gray-200 dark:bg-gray-700 w-full h-48 rounded-t-xl" />
                    <div className="p-4">
                      <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 mb-2 rounded"></div>
                      <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="flex justify-between mt-3">
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : fetchError ? (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{fetchError}</AlertDescription>
              </Alert>
            ) : recentImages.length === 0 ? (
              <div className="col-span-2 text-center py-10 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-gray-500 dark:text-gray-400">
                  No images generated yet. Create your first image!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentImages.map((image) => (
                  <div
                    key={image.id}
                    className="border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800"
                  >
                    <div className="relative h-48 group">
                      <img
                        src={image.image_url}
                        alt={image.prompt}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-4 left-4 right-4">
                          <p className="text-white text-sm line-clamp-2">
                            {image.prompt}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(image.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTabContent;

