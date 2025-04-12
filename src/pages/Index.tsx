
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ChevronRight, Image, Sparkles, Zap, PaintBucket, Download } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { user } = useAuth();

  // Updated example images using the provided high-quality images
  const exampleImages = [
    {
      url: "/mountain-lake-sunset.jpg",
      prompt: "A peaceful mountain landscape with a lake at sunset",
    },
    {
      url: "/futuristic-cityscape.jpg",
      prompt: "A futuristic cityscape with flying vehicles",
    },
    {
      url: "/magical-forest.jpg",
      prompt: "A magical forest with glowing plants and floating lanterns",
    },
    {
      url: "/cyberpunk-street.jpg",
      prompt: "A cyberpunk street scene with neon lights and rain",
    },
  ];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildrenVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              PixelPalette
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">
              About
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-purple-600 transition-colors">
              How It Works
            </a>
            <a href="#gallery" className="text-gray-700 hover:text-purple-600 transition-colors">
              Gallery
            </a>
          </nav>
          <div className="flex gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:inline-block">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section 
        className="container mx-auto py-20 px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={staggerChildrenVariants}
      >
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500"
          variants={fadeInUpVariants}
        >
          Create Stunning AI Art
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700"
          variants={fadeInUpVariants}
        >
          Transform your ideas into beautiful images with our state-of-the-art AI
          image generation
        </motion.p>
        <motion.div variants={fadeInUpVariants}>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button size="lg" className="text-lg px-8 py-6 group">
              {user ? "Start Creating" : "Get Started"}
              <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </motion.section>

      {/* Example Images */}
      <section id="gallery" className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">
            Gallery of AI Creations
          </h2>
          <div className="max-w-5xl mx-auto">
            <Carousel>
              <CarouselContent>
                {exampleImages.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                    <div className="p-2">
                      <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-0 relative group">
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=Image+Loading+Error";
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                            <p className="text-white text-sm">{image.prompt}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-8 md:flex" />
              <CarouselNext className="-right-8 md:flex" />
            </Carousel>
          </div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto py-16 px-4 bg-white/50 backdrop-blur-sm rounded-lg my-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-8">About PixelPalette</h2>
          <p className="text-lg text-gray-700 mb-6">
            PixelPalette is a cutting-edge AI image generation platform that transforms simple text descriptions into stunning visual creations. 
            Our platform leverages the latest advancements in artificial intelligence to help you bring your creative visions to life with just a few clicks.
          </p>
          <p className="text-lg text-gray-700">
            Whether you're a professional designer looking for inspiration, a content creator needing unique visuals, or just curious about AI art - 
            PixelPalette gives you access to powerful tools previously available only to specialized professionals.
          </p>
        </motion.div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto py-16 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">1</div>
              <div className="text-center mb-4 mt-4">
                <Sparkles className="h-10 w-10 text-purple-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Describe Your Idea</h3>
              <p className="text-gray-600 text-center">
                Enter a detailed description of the image you want to create. The more specific you are, the better the results!
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">2</div>
              <div className="text-center mb-4 mt-4">
                <Zap className="h-10 w-10 text-purple-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">AI Generation</h3>
              <p className="text-gray-600 text-center">
                Our advanced AI models process your description and generate a unique image tailored to your specifications.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">3</div>
              <div className="text-center mb-4 mt-4">
                <Download className="h-10 w-10 text-purple-500 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Download & Share</h3>
              <p className="text-gray-600 text-center">
                Download your created images in high resolution for personal or commercial use, or share them directly to social media.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Start Generating CTA */}
      <section className="container mx-auto py-16 px-4 mb-12">
        <motion.div 
          className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-10 text-white text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Create Amazing Images?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using PixelPalette to bring their ideas to life.
          </p>
          <Link to={user ? "/dashboard" : "/auth"}>
            <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg">
              {user ? "Go to Dashboard" : "Start Creating Now"}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center md:text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">PixelPalette</h3>
              <p className="text-gray-600">
                Creating beautiful AI-generated art has never been easier.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-600 hover:text-purple-600 transition-colors">About</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-purple-600 transition-colors">How It Works</a></li>
                <li><a href="#gallery" className="text-gray-600 hover:text-purple-600 transition-colors">Gallery</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
            <p>© 2025 PixelPalette. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
