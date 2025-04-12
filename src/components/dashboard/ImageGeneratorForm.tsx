
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface ImageGeneratorFormProps {
  onGenerate: (prompt: string, model: string) => Promise<void>;
  generating: boolean;
  error: string | null;
  retryGeneration: () => Promise<void>;
  hasLastPrompt: boolean;
}

const ImageGeneratorForm = ({ 
  onGenerate, 
  generating, 
  error, 
  retryGeneration,
  hasLastPrompt
}: ImageGeneratorFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux");
  const [progress, setProgress] = useState(0);

  // Simulated progress for better UX
  const startProgressSimulation = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };

  const handleGenerate = async () => {
    const cleanupProgress = startProgressSimulation();
    await onGenerate(prompt, model);
    cleanupProgress();
    setProgress(100);
    // Reset progress after a delay
    setTimeout(() => setProgress(0), 2000);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Generate New Image</CardTitle>
        <CardDescription>
          Enter a prompt to create an AI-generated image
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
            {hasLastPrompt && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={retryGeneration}
                disabled={generating}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            )}
          </Alert>
        )}
        
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
        
        {generating && (
          <div className="space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-muted-foreground">Generating image...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
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
  );
};

export default ImageGeneratorForm;
