
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

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
  const [progress, setProgress] = useState(0);

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
      inferenceSteps: 4 // Fixed value since we removed the slider
    });
    cleanupProgress();
    setProgress(100);
    setTimeout(() => setProgress(0), 2000);
  };

  return (
    <Card className="mb-8 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-purple-100 dark:border-purple-900/20">
      <CardHeader>
        <CardTitle className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Create New Image
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-300">
          Transform your ideas into stunning visuals with AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
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
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-purple-700 dark:text-purple-300">Prompt</Label>
            <Textarea
              id="prompt"
              placeholder="A serene lake at sunset with mountains in the background..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={generating}
              className="min-h-[100px] resize-none bg-white dark:bg-gray-900 border-purple-100 dark:border-purple-900/20 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          {generating && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              <div className="flex justify-between mb-1">
                <span className="text-sm text-purple-600 dark:text-purple-400">Generating image...</span>
                <span className="text-sm text-purple-600 dark:text-purple-400">{progress}%</span>
              </div>
              <Progress value={progress} className="bg-purple-100 dark:bg-purple-900/20 [&>div]:bg-purple-500" />
            </motion.div>
          )}
        </motion.div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerate} 
          disabled={generating || !prompt.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
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
