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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate image");
      }

      const data = await response.json();

      if (!data.image_url) {
        throw new Error("Image URL not found in response");
      }

      // Optimistically update the UI
      toast({
        title: "Image generation started!",
        description: "Your image is being generated. This may take a moment.",
      });

      // Convert image to JPG if it's not already
      const imageUrl = response.data?.image_url;
      if (imageUrl && !imageUrl.toLowerCase().endsWith('.jpg')) {
        const imgResponse = await fetch(imageUrl);
        const blob = await imgResponse.blob();
        const jpgBlob = new Blob([blob], { type: 'image/jpeg' });
        const jpgUrl = URL.createObjectURL(jpgBlob);
        response.data.image_url = jpgUrl;
      }

      // After successful generation, trigger onSuccess to refresh images
      if (onSuccess) {
        await onSuccess();
      }
      
      toast.success("Image generated successfully!");
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
    hasLastPrompt: !!lastPrompt 
  };
}
