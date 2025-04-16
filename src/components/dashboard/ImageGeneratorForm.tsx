
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, Download, Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface ImageGeneratorFormProps {
  onGenerate: (prompt: string, model: string, settings: {
    aspectRatio: string;
    numOutputs: number;
    inferenceSteps: number;
  }) => Promise<void>;
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
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [numOutputs, setNumOutputs] = useState(1);
  const [inferenceSteps, setInferenceSteps] = useState(4);
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
    await onGenerate(prompt, model, {
      aspectRatio,
      numOutputs,
      inferenceSteps
    });
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
          Enter a prompt and customize settings to create your AI-generated image
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={setAspectRatio} disabled={generating}>
              <SelectTrigger>
                <SelectValue placeholder="Select aspect ratio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1:1">Square (1:1)</SelectItem>
                <SelectItem value="16:9">Landscape (16:9)</SelectItem>
                <SelectItem value="9:16">Portrait (9:16)</SelectItem>
                <SelectItem value="4:3">Standard (4:3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="inference-steps">Quality (Inference Steps: {inferenceSteps})</Label>
            <span className="text-xs text-muted-foreground">Higher = Better Quality, Slower</span>
          </div>
          <Slider 
            id="inference-steps"
            min={1} 
            max={20} 
            step={1} 
            value={[inferenceSteps]} 
            onValueChange={(value) => setInferenceSteps(value[0])}
            disabled={generating}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="num-outputs">Number of Images: {numOutputs}</Label>
          </div>
          <Slider 
            id="num-outputs"
            min={1} 
            max={4} 
            step={1} 
            value={[numOutputs]} 
            onValueChange={(value) => setNumOutputs(value[0])}
            disabled={generating}
          />
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
