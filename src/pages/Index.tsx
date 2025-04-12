import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Shield, Image as ImageIcon } from "lucide-react";

const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1655635949212-1d8f4f103ea1",
    alt: "AI-generated fantasy landscape",
    style: "fantasy"
  },
  {
    url: "https://images.unsplash.com/photo-1675426513302-9be2a9adb746",
    alt: "AI-generated portrait",
    style: "portrait"
  },
  {
    url: "https://images.unsplash.com/photo-1675426513229-2d95e7c67abb",
    alt: "AI-generated abstract art",
    style: "abstract"
  },
  {
    url: "https://images.unsplash.com/photo-1675426513212-a0e1a7f5a97f",
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
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
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
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => {
                  const element = document.getElementById('features');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>
            <div className="flex justify-start text-sm">
              <a href="/admin-auth" className="text-purple-200 hover:text-white transition-colors">Admin Login</a>
            </div>
          </div>
          
          <motion.div 
            className="mt-8 md:mt-0 md:w-1/2 grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {exampleImages.map((image, index) => (
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
      <section className="py-20 bg-gray-50">
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
      <section className="py-20 bg-white">
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
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
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
