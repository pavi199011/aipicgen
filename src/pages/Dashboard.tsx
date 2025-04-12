
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

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux");
  const [generating, setGenerating] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
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
        throw new Error("No image was generated. Please try again.");
      }
      
      // The output can be either a string or an array of strings depending on the model
      const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;
      
      // Save the generated image to Supabase
      const { error: insertError } = await supabase
        .from("generated_images")
        .insert({
          prompt,
          image_url: imageUrl,
          model,
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
      toast({
        title: "Error generating image",
        description: error.message || "Failed to generate image. Please try again.",
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
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
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
            {generating ? "Generating..." : "Generate Image"}
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
