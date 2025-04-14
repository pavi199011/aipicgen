
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Sparkles } from "lucide-react";

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
    <header className="bg-gradient-to-br from-violet-800 via-purple-700 to-indigo-800 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center justify-between relative">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-purple-300 filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-blue-300 filter blur-3xl"></div>
        </motion.div>
        
        <div className="z-10 space-y-8 md:w-1/2 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-300" />
              <span className="text-sm font-medium">AI-Powered Image Generation</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Transform Your Ideas Into 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-cyan-300"> Visual Masterpieces</span>
            </h1>
            
            <p className="text-lg md:text-xl text-purple-100 mt-6 max-w-xl">
              Create stunning, unique artwork in seconds with our cutting-edge AI. No design skills needed - just describe what you want and watch it come to life!
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            {user ? (
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/dashboard"}
                className="text-md bg-white text-purple-800 hover:bg-purple-50 group"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => window.location.href = "/auth"}
                className="text-md bg-white text-purple-800 hover:bg-purple-50 group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            
            
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-12 md:mt-0 md:w-1/2 grid grid-cols-2 gap-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {aiGeneratedImages.map((image, index) => (
            <motion.div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-lg group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index + 0.4 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <span className="text-white text-sm p-3">{image.alt}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;
