import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RecentImages from "@/components/dashboard/RecentImages";
import { useIsMobile } from "@/hooks/use-mobile";

const formSchema = z.object({
  prompt: z.string().min(2, {
    message: "Prompt must be at least 2 characters.",
  }),
  aspectRatio: z.string().default("1:1"),
  numOutputs: z.string().default("1"),
});

interface GeneratorSectionProps {
  generating: boolean;
  generateImage: (prompt: string) => Promise<void>;
  error: any;
  retryGeneration: () => Promise<void>;
  hasLastPrompt: boolean;
}

const GeneratorSection = ({
  generating,
  generateImage,
  error,
  retryGeneration,
  hasLastPrompt,
}: GeneratorSectionProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      aspectRatio: "1:1",
      numOutputs: "1",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await generateImage(
        `${values.prompt} --aspect ${values.aspectRatio} --n ${values.numOutputs}`
      );
    } catch (error: any) {
      toast({
        title: "Something went wrong!",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Describe your vision</FormLabel>
              <FormControl>
                <Input
                  placeholder="A cat wearing sunglasses"
                  {...field}
                  disabled={generating}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col md:flex-row gap-4">
          <FormField
            control={form.control}
            name="aspectRatio"
            render={({ field }) => (
              <FormItem className="w-full md:max-w-[150px]">
                <FormLabel>Aspect Ratio</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ratio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1:1">1:1</SelectItem>
                    <SelectItem value="3:2">3:2</SelectItem>
                    <SelectItem value="16:9">16:9</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numOutputs"
            render={({ field }) => (
              <FormItem className="w-full md:max-w-[150px]">
                <FormLabel>Number of Images</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={generating} className="w-full">
          {generating ? (
            <>
              <ImageIcon className="mr-2 h-4 w-4 animate-spin" />
              Generating ...
            </>
          ) : (
            "Generate"
          )}
        </Button>
        {error && (
          <p className="text-sm text-red-500">
            {isMobile ? "Mobile error" : error.message}
          </p>
        )}
        {hasLastPrompt && (
          <Button
            type="button"
            variant="secondary"
            onClick={retryGeneration}
            disabled={generating}
            className="w-full"
          >
            Retry Last Generation
          </Button>
        )}
      </form>
    </Form>
  );
};

interface CreateTabContentProps {
  images: any[];
  imagesLoading: boolean;
  fetchError: any;
  generateImage: (prompt: string) => Promise<void>;
  generating: boolean;
  generationError: any;
  retryLastGeneration: () => Promise<void>;
  hasLastPrompt: boolean;
  creditsPerImage?: number;
}

const CreateTabContent = ({
  images,
  imagesLoading,
  fetchError,
  generateImage,
  generating,
  generationError,
  retryLastGeneration,
  hasLastPrompt,
  creditsPerImage = 1
}: CreateTabContentProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-sm text-muted-foreground">
          Each image generation costs <span className="font-medium">{creditsPerImage}</span> credit{creditsPerImage !== 1 ? 's' : ''}.
        </p>
      </div>
      
      <GeneratorSection
        generating={generating}
        generateImage={generateImage}
        error={generationError}
        retryGeneration={retryLastGeneration}
        hasLastPrompt={hasLastPrompt}
      />
      
      <RecentImages
        images={images}
        loading={imagesLoading}
        error={fetchError}
      />
    </div>
  );
};

export default CreateTabContent;
