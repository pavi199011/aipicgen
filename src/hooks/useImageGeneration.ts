
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenerationSettings {
  aspectRatio: string;
  numOutputs: number;
  inferenceSteps: number;
}

export function useImageGeneration(userId: string | undefined, onSuccess?: () => void) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [lastSettings, setLastSettings] = useState<GenerationSettings | null>(null);
  const { toast } = useToast();

  const retryLastGeneration = async () => {
    if (!lastPrompt || !lastSettings) {
      console.warn("No last prompt or settings to retry.");
      return;
    }
    await generateImage(lastPrompt, "sdxl", lastSettings);
  };

  const generateImage = async (prompt: string, model: string, settings: GenerationSettings) => {
    if (!userId) {
      console.error("User ID is required to generate images.");
      return;
    }

    setGenerating(true);
    setError(null);
    setLastPrompt(prompt);
    setLastSettings(settings);

    try {
      console.log("Sending request with settings:", settings);
      
      // Call the Supabase Edge Function directly using the client
      const { data: responseData, error: functionError } = await supabase.functions.invoke('generate-image', {
        body: {
          userId,
          prompt,
          settings,
        },
      });

      console.log("Response from edge function:", responseData);

      if (functionError) {
        throw new Error(functionError.message || "Failed to generate image");
      }

      if (!responseData?.images || !Array.isArray(responseData.images)) {
        throw new Error("Invalid response format: expected array of images");
      }

      // Store each generated image in Supabase
      const successfulUploads = [];
      
      for (const image of responseData.images) {
        if (!image.image_url) {
          console.warn("Image URL not found in response item, skipping");
          continue;
        }

        try {
          const { error: insertError } = await supabase
            .from('generated_images')
            .insert([
              {
                user_id: userId,
                prompt: prompt,
                image_url: image.image_url,
                model: model,
              }
            ]);

          if (insertError) {
            console.error("Error saving image to database:", insertError);
          } else {
            successfulUploads.push(image);
          }
        } catch (dbError) {
          console.error("Database error:", dbError);
        }
      }

      if (successfulUploads.length === 0) {
        throw new Error("Failed to save any generated images to the database");
      }

      toast({
        title: "Success",
        description: `Generated ${responseData.images.length} image${responseData.images.length > 1 ? 's' : ''} successfully!`,
        variant: "default",
      });

      if (onSuccess) {
        await onSuccess();
      }

    } catch (error: any) {
      console.error("Image generation error:", error);
      setError(error.message || "Failed to generate image");

      toast({
        title: "Error generating image",
        description: error.message || "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return {
    generateImage,
    generating,
    error,
    retryLastGeneration,
    hasLastPrompt: !!lastPrompt,
  };
}
