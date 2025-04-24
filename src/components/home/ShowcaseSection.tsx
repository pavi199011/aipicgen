
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

interface ShowcaseImage {
  title: string;
  description: string;
  style: string;
}

interface ShowcaseSectionProps {
  showcaseImages: ShowcaseImage[];
}

const ShowcaseSection = ({ showcaseImages }: ShowcaseSectionProps) => {
  const isMobile = useIsMobile();
  
  // Sample showcase images with text instead of URLs
  const sampleShowcaseImages: ShowcaseImage[] = [
    {
      title: "Architectural Abstract",
      description: "Minimalist architectural detail",
      style: "abstract"
    },
    {
      title: "Contemporary Design",
      description: "Modern building against blue sky",
      style: "modern"
    },
    {
      title: "Urban Perspective",
      description: "Bottom view of glass building",
      style: "urban"
    },
    {
      title: "Geometric Patterns",
      description: "Striking architectural lines",
      style: "geometric"
    }
  ];

  // Use the sample data instead of props
  const displayImages = sampleShowcaseImages;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 backdrop-blur-sm mb-4">
            <Sparkles className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Stunning AI Artwork</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Showcase Gallery</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore some of the incredible artwork created by our AI. From abstract compositions to photorealistic scenes, 
            our technology can generate any style you can imagine.
          </p>
        </div>

        {/* Desktop Layout - Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {displayImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border-none shadow-md">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    {/* Replace image with styled text placeholder */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                      <div className="text-center p-4">
                        <p className="text-lg font-medium text-purple-800 dark:text-purple-300">{image.style}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Sample Image</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium">{image.title}</h3>
                      <p className="text-white/80 text-sm">{image.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Mobile Layout - Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {displayImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden shadow-md border-none">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/3]">
                        {/* Replace image with styled text placeholder */}
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                          <div className="text-center p-4">
                            <p className="text-lg font-medium text-purple-800 dark:text-purple-300">{image.style}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Sample Image</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-white font-medium">{image.title}</h3>
                          <p className="text-white/80 text-sm">{image.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4" />
            <CarouselNext className="absolute -right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
