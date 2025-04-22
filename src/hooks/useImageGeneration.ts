
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
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          prompt,
          settings,
        }),
      });

      // Clone the response so we can try both JSON and text
      const responseClone = response.clone();

      let responseData: any = null;
      let errorMessage: string | null = null;

      // First try to parse as JSON
      try {
        responseData = await response.json();
      } catch (jsonErr) {
        console.warn("Failed to parse JSON response, attempting to read as text");
        try {
          const rawText = await responseClone.text();
          console.error("Raw response:", rawText);
          errorMessage = "Unexpected response format from image generation service";
        } catch (textErr) {
          console.error("Failed to read response as text:", textErr);
          errorMessage = "Failed to read server response";
        }
      }

      if (!response.ok) {
        throw new Error(responseData?.error || errorMessage || "Failed to generate image");
      }

      // Handle the new response format which includes an array of images
      if (!responseData?.images || !Array.isArray(responseData.images)) {
        throw new Error("Invalid response format: expected array of images");
      }

      // Store each generated image in Supabase
      for (const image of responseData.images) {
        if (!image.image_url) {
          console.warn("Image URL not found in response item, skipping");
          continue;
        }

        try {
          const { data, error: insertError } = await supabase
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
          }
        } catch (dbError) {
          console.error("Database error:", dbError);
        }
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
