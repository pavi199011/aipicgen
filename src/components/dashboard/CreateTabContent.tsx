
import GeneratorSection from "@/components/dashboard/GeneratorSection";
import RecentImages from "@/components/dashboard/RecentImages";

interface CreateTabContentProps {
  images: any[];
  imagesLoading: boolean;
  fetchError: any;
  generateImage: (prompt: string, model: string, settings: {
    aspectRatio: string;
    numOutputs: number;
    inferenceSteps: number;
  }) => Promise<void>;
  generating: boolean;
  generationError: any;
  retryLastGeneration: () => Promise<void>;
  hasLastPrompt: boolean;
  creditsPerImage?: number;
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
  creditsPerImage = 1
}: CreateTabContentProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Each image generation costs <span className="font-medium">{creditsPerImage}</span> credit{creditsPerImage !== 1 ? 's' : ''}.
        </p>
      </div>
      
      <GeneratorSection
        generating={generating}
        generateImage={generateImage}
        generationError={generationError}
        retryLastGeneration={retryLastGeneration}
        hasLastPrompt={hasLastPrompt}
      />
      
      <RecentImages
        images={images}
        loading={imagesLoading}
        error={fetchError}
      />
    </div>
  );
};

export default CreateTabContent;
