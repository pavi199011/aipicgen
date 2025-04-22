
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

  const generateImage = async (prompt: string, model: string, settings: {
    aspectRatio: string;
    numOutputs: number;
    inferenceSteps: number;
  }) => {
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
          model,
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
          // If JSON fails, try to read as text from the cloned response
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

      if (!responseData?.image_url) {
        throw new Error("Image URL not found in response");
      }

      toast({
        title: "Image generation started!",
        description: "Your image is being generated. This may take a moment.",
      });

      // Convert image to JPG if it's not already
      const imageUrl = responseData.image_url;
      if (imageUrl && !imageUrl.toLowerCase().endsWith('.jpg')) {
        try {
          const imgResponse = await fetch(imageUrl);
          const blob = await imgResponse.blob();
          const jpgBlob = new Blob([blob], { type: 'image/jpeg' });
          const jpgUrl = URL.createObjectURL(jpgBlob);
          responseData.image_url = jpgUrl;
        } catch (e) {
          console.warn("Failed to convert image to JPG:", e);
          // Continue with original URL if conversion fails
        }
      }

      if (onSuccess) {
        await onSuccess();
      }

      toast({
        title: "Success",
        description: "Image generated successfully!",
        variant: "default",
      });
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
