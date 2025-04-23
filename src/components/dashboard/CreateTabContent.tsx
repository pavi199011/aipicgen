
import { GeneratedImage } from "@/hooks/useFetchImages";
import GeneratorSection from "./GeneratorSection";
import RecentImages from "./RecentImages";

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
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="col-span-1">
        <GeneratorSection
          generating={generating}
          generationError={generationError}
          generateImage={generateImage}
          retryLastGeneration={retryLastGeneration}
          hasLastPrompt={hasLastPrompt}
        />
      </div>
      <div className="col-span-2">
        <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg min-h-[420px] flex flex-col">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Recently Created</h2>
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
