
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux");
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
  
  const generateImage = async () => {
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
      
      setPrompt("");
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
          setModel("flux");
          toast({
            title: "Retrying with Flux model",
            description: "The selected model is unavailable. Trying with a different model...",
          });
          
          setTimeout(() => {
            generateImage();
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
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Generate New Image</CardTitle>
          <CardDescription>
            Enter a prompt to create an AI-generated image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt</Label>
            <Input
              id="prompt"
              placeholder="A serene lake at sunset with mountains in the background"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={generating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel} disabled={generating}>
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flux">Flux (Fastest)</SelectItem>
                <SelectItem value="sdxl-turbo">SDXL Turbo (Fast)</SelectItem>
                <SelectItem value="sdxl">SDXL (High Quality)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={generateImage} 
            disabled={generating || !prompt.trim()}
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : "Generate Image"}
          </Button>
        </CardFooter>
      </Card>
      
      <h2 className="text-2xl font-bold mb-4">Your Generated Images</h2>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <Skeleton className="w-full h-64 rounded-t-lg" />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <Skeleton className="h-4 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          You haven't generated any images yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card key={image.id}>
              <CardContent className="p-0 relative">
                <img
                  src={image.image_url}
                  alt={image.prompt}
                  className="w-full h-64 object-cover rounded-t-lg"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/512x512?text=Image+Load+Error";
                  }}
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <p className="text-sm font-medium mb-1">
                  Model: {image.model.toUpperCase()}
                </p>
                <p className="text-sm line-clamp-2 text-gray-600">
                  {image.prompt}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
