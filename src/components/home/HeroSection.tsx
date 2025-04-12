
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

interface HeroImageProps {
  url: string;
  alt: string;
  style: string;
}

interface HeroSectionProps {
  aiGeneratedImages: HeroImageProps[];
}

const HeroSection = ({ aiGeneratedImages }: HeroSectionProps) => {
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white pt-20">
      <div className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-8 md:w-1/2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
            Create stunning images with AI
          </h1>
          <p className="text-lg md:text-xl text-purple-100">
            Transform your ideas into beautiful artwork in seconds using the power of artificial intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/dashboard"}
                className="text-md bg-white text-purple-800 hover:bg-purple-100"
              >
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/auth"}
                className="text-md bg-white text-purple-800 hover:bg-purple-100"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
        
        <motion.div 
          className="mt-8 md:mt-0 md:w-1/2 grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {aiGeneratedImages.map((image, index) => (
            <motion.div
              key={index}
              className="rounded-lg overflow-hidden shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-40 object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;
