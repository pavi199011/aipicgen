
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

      let responseData: any = null;

      // Try reading valid JSON or parse error safely
      try {
        responseData = await response.json();
      } catch (jsonErr) {
        // Sometimes response is empty or not JSON. Try to read as text and print it.
        const rawText = await response.text();
        console.error("Generation API returned malformed JSON or empty body. Raw response:", rawText);
        throw new Error("Unexpected response from image generation API. Please try again.");
      }

      if (!response.ok) {
        throw new Error(responseData?.error || "Failed to generate image");
      }

      if (!responseData.image_url) {
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
          // If we fail to re-fetch or convert image, just proceed with original URL
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
