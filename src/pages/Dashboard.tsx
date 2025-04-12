
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ImageGeneratorForm from "@/components/dashboard/ImageGeneratorForm";
import ImageGallery from "@/components/dashboard/ImageGallery";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      fetchImages();
    }
  }, [user]);
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      setError("Failed to load your images. Please try refreshing the page.");
      toast({
        title: "Error fetching images",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateImage = async (prompt: string, model: string) => {
    if (!prompt.trim()) {
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
      
      toast({
        title: "Generating image",
        description: "Your image is being generated. This may take a minute...",
      });
      
      // Call the Supabase Edge Function to generate an image
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt, model },
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
          user_id: user.id,
        });
        
      if (insertError) throw insertError;
      
      await fetchImages();
      
      toast({
        title: "Success",
        description: "Image generated successfully!",
      });
    } catch (error: any) {
      console.error("Generation error:", error);
      setError(error.message || "Failed to generate image");
      
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
            generateImage(prompt, "flux");
          }, 1000);
          return;
        }
      } else if (error.message?.includes("rate limit") || error.status === 429) {
        errorMessage = "We've hit the rate limit. Please wait a minute and try again.";
      }
      
      toast({
        title: "Error generating image",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Image Generator</h1>
        <Button onClick={signOut} variant="outline">
          Sign Out
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <ImageGeneratorForm 
        onGenerate={generateImage} 
        generating={generating} 
      />
      
      <h2 className="text-2xl font-bold mb-4">Your Generated Images</h2>
      
      <ImageGallery images={images} loading={loading} />
    </div>
  );
};

export default Dashboard;
