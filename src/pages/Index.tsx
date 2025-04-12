
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Image as ImageIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const aiGeneratedImages = [
  {
    url: "https://replicate.delivery/pbxt/9ooLFeQ4QJvJ5AhWMTj0XHUCkRzbF0bvF5eEF3qvuVFdPqHiA/out-0.png",
    alt: "AI-generated fantasy landscape",
    style: "fantasy"
  },
  {
    url: "https://replicate.delivery/pbxt/k4PMmMtKSGsZBTOzKMXmdGTcTLyzGRJGNMOyALuHJfLnipJCB/out-0.png",
    alt: "AI-generated portrait",
    style: "portrait"
  },
  {
    url: "https://replicate.delivery/pbxt/JMqSvg0vXYVci7cQkQtgRNvJHb1zLvFbSVD9kbA18AoXfPdFC/out-0.png",
    alt: "AI-generated abstract art",
    style: "abstract"
  },
  {
    url: "https://replicate.delivery/pbxt/OU9fBF2aCiQMCEoWfk9VVMqLGHXWTHeu3NV4pgnJJwk5nqHiA/out-0.png",
    alt: "AI-generated sci-fi scene",
    style: "sci-fi"
  }
];

const Index = () => {
  const { user } = useAuth();

  // Parallax scrolling effect
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Digital Artist",
      content: "This AI image generator has completely transformed my creative process. I can now bring my ideas to life in seconds!",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      name: "Michael Chen",
      role: "Game Developer",
      content: "I use this tool daily for concept art. The quality and speed are unmatched by anything else I've tried.",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Director",
      content: "Our marketing campaigns have seen a 40% increase in engagement since we started using AI-generated visuals.",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              PixelPalette
            </h1>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                            href="#features"
                          >
                            <div className="mt-4 mb-2 text-lg font-medium text-white">
                              AI Image Generator
                            </div>
                            <p className="text-sm leading-tight text-white/90">
                              Create stunning visuals with our powerful AI models
                            </p>
                          </a>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <Link
                          to="#features"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Creative Freedom
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                            Describe any image you can imagine
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#features"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Lightning Fast
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                            Generate images in seconds
                          </p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#features"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                        >
                          <div className="text-sm font-medium leading-none">
                            Commercial Use
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                            All images are royalty-free
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="#testimonials" className={navigationMenuTriggerStyle()}>
                    Testimonials
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="#how-it-works" className={navigationMenuTriggerStyle()}>
                    How It Works
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button 
                onClick={() => window.location.href = "/dashboard"}
                variant="outline"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => window.location.href = "/auth"}
                  variant="outline"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => window.location.href = "/auth"}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section - adjusted for nav bar */}
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

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful AI Image Generation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge AI technology makes creating professional-quality images simple and accessible to everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Creative Freedom</h3>
              <p className="text-gray-600">
                Describe any image you can imagine, and our AI will bring it to life with stunning detail and accuracy.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-7 w-7 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600">
                Generate high-quality images in seconds, not hours. Perfect for when you need creative assets quickly.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-indigo-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Commercial Use</h3>
              <p className="text-gray-600">
                All generated images are royalty-free and can be used for personal or commercial projects without attribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Creating stunning AI-generated images is as easy as 1-2-3
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-3">Describe Your Vision</h3>
              <p className="text-gray-600">
                Enter a detailed description of the image you want to create using natural language.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-3">AI Generation</h3>
              <p className="text-gray-600">
                Our advanced AI models process your description and generate multiple image options.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-3">Download & Use</h3>
              <p className="text-gray-600">
                Download your favorite result in high resolution, ready for any project or application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied creators who use our AI image generator daily
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to create amazing images?
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-8">
            Join thousands of creators, marketers, and developers who are using AI to transform their visual content.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = user ? "/dashboard" : "/auth"}
            className="text-md bg-white text-purple-800 hover:bg-purple-100"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center">
                <ImageIcon className="mr-2 h-5 w-5" />
                AI Image Generator
              </h3>
              <p className="mb-4">
                Creating stunning visuals with the power of artificial intelligence.
              </p>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integration</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} AI Image Generator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
