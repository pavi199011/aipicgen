
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ImageGeneratorFormProps {
  onGenerate: (prompt: string, model: string) => Promise<void>;
  generating: boolean;
}

const ImageGeneratorForm = ({ onGenerate, generating }: ImageGeneratorFormProps) => {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("flux");

  const handleGenerate = async () => {
    await onGenerate(prompt, model);
    setPrompt("");
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
