
import { GeneratedImage } from "@/hooks/useFetchImages";
import GeneratorSection from "./GeneratorSection";
import RecentImages from "./RecentImages";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      <div className="col-span-1">
        <GeneratorSection
          generating={generating}
          generationError={generationError}
          generateImage={generateImage}
          retryLastGeneration={retryLastGeneration}
          hasLastPrompt={hasLastPrompt}
        />
      </div>
      <div className="col-span-1 lg:col-span-2">
        <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 p-3 md:p-6 rounded-xl shadow-lg min-h-[420px] flex flex-col">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-6 dark:text-white">Recently Created</h2>
          <div className="flex-1">
            <RecentImages
              images={images}
              loading={imagesLoading}
              error={fetchError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTabContent;
