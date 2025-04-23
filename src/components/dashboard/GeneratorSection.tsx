
import ImageGeneratorForm from "@/components/dashboard/ImageGeneratorForm";

interface GeneratorSectionProps {
  generating: boolean;
  generationError: string | null;
  generateImage: (prompt: string, model: string, settings: {
    aspectRatio: string;
    numOutputs: number;
    inferenceSteps: number;
  }) => Promise<void>;
  retryLastGeneration: () => Promise<void>;
  hasLastPrompt: boolean;
}

const GeneratorSection = ({
  generating,
  generationError,
  generateImage,
  retryLastGeneration,
  hasLastPrompt,
}: GeneratorSectionProps) => {
  return (
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
  );
};

export default GeneratorSection;
