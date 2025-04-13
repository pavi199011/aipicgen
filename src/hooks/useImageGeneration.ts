
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GenerationSettings {
  aspectRatio: string;
  numOutputs: number;
  inferenceSteps: number;
}

export function useImageGeneration(userId: string | undefined, onSuccess: () => Promise<void>) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [lastPrompt, setLastPrompt] = useState<string | null>(null);
  const [lastModel, setLastModel] = useState<string | null>(null);
  const [lastSettings, setLastSettings] = useState<GenerationSettings | null>(null);
  const { toast } = useToast();

  const generateImage = async (
    prompt: string, 
    model: string, 
    settings: GenerationSettings = {
      aspectRatio: "1:1",
      numOutputs: 1,
      inferenceSteps: 4
    }
  ) => {
    if (!userId || !prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setGenerating(true);
      setError(null);
      setRetryCount(0);
      // Save the prompt and model for potential retry
      setLastPrompt(prompt);
      setLastModel(model);
      setLastSettings(settings);
      
      toast({
        title: "Generating image",
        description: "Your image is being generated. This may take a minute...",
      });
      
      // Call the Supabase Edge Function to generate an image
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt, 
          model,
          aspectRatio: settings.aspectRatio,
          numOutputs: settings.numOutputs,
          inferenceSteps: settings.inferenceSteps
        },
      });
      
      if (error) throw error;
      
      if (!data.output || (Array.isArray(data.output) && data.output.length === 0)) {
        throw new Error("No image was generated. Please try again or choose a different model.");
      }
      
      // If we received a note about using a fallback model, inform the user
      if (data.note && data.note.includes("fallback")) {
        toast({
          title: "Used fallback model",
          description: "The selected model had issues, so we used the Flux model instead.",
        });
      }
      
      // The output can be either a string or an array of strings depending on the model
      const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
      
      // Save the generated image to Supabase
      const { error: insertError } = await supabase
        .from("generated_images")
        .insert({
          prompt,
          image_url: imageUrl,
          model: data.note?.includes("fallback") ? "flux" : model, // Record the actual model used
          user_id: userId,
        });
        
      if (insertError) throw insertError;
      
      await onSuccess();
      
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      
      // Check for specific errors and provide helpful messages
      let errorMessage = error.message || "Failed to generate image. Please try again.";
      
      if (error.message?.includes("Invalid model version") || error.message?.includes("not permitted") || error.status === 422) {
        errorMessage = "The selected model is currently unavailable. Please try a different model.";
        
        // Auto-retry with a different model if this is the first retry
        if (retryCount === 0 && model !== "flux") {
          setRetryCount(prev => prev + 1);
          
          toast({
            title: "Retrying with Flux model",
            description: "The selected model is unavailable. Trying with a different model...",
          });
          
          setTimeout(() => {
            generateImage(prompt, "flux", settings);
          }, 1000);
          return;
        }
      } else if (error.message?.includes("rate limit") || error.status === 429) {
        errorMessage = "We've hit the rate limit. Please wait a minute and try again.";
      } else if (error.status === 500 || error.status === 503) {
        errorMessage = "The image generation service is currently experiencing issues. Please try again in a few minutes.";
      } else if (error.message?.includes("timeout") || error.message?.includes("deadline")) {
        errorMessage = "The request timed out. The image generation service might be overloaded. Please try again later.";
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error generating image",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  // Function to retry the last generation with the same parameters
  const retryLastGeneration = async () => {
    if (lastPrompt && lastModel) {
      await generateImage(lastPrompt, lastModel, lastSettings || undefined);
    } else {
      toast({
        title: "Cannot retry",
        description: "No previous generation attempt found.",
        variant: "destructive",
      });
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
