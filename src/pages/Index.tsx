import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ShowcaseSection from "@/components/home/ShowcaseSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import HomeFooter from "@/components/home/HomeFooter";

const Index = () => {
  // Sample data for AI generated images - Updated with working image URLs
  const aiGeneratedImages = [
    {
      url: "https://images.unsplash.com/photo-1686480185592-92c02a48c031?q=80&w=1000&auto=format&fit=crop",
      alt: "Abstract digital art with vibrant colors",
      style: "abstract"
    },
    {
      url: "https://images.unsplash.com/photo-1633532482769-3795306b0848?q=80&w=1000&auto=format&fit=crop",
      alt: "Futuristic cityscape at night",
      style: "futuristic"
    },
    {
      url: "https://images.unsplash.com/photo-1675071565849-42247262ab19?q=80&w=1000&auto=format&fit=crop",
      alt: "Nature-inspired AI artwork",
      style: "nature"
    },
    {
      url: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1000&auto=format&fit=crop",
      alt: "Portrait with artistic style",
      style: "portrait"
    }
  ];

  // Sample showcase images - Updated with working image URLs
  const showcaseImages = [
    {
      url: "https://images.unsplash.com/photo-1686505228577-9f42b639dfa6?q=80&w=1000&auto=format&fit=crop",
      alt: "Digital portrait of a woman with geometric elements",
      title: "Digital Portrait"
    },
    {
      url: "https://images.unsplash.com/photo-1679511932846-4c3d8774693a?q=80&w=1000&auto=format&fit=crop",
      alt: "Surreal landscape with floating islands and purple sky",
      title: "Fantasy Landscape"
    },
    {
      url: "https://images.unsplash.com/photo-1680991155475-3f3fabe33c31?q=80&w=1000&auto=format&fit=crop",
      alt: "Abstract composition with vibrant colors and fluid shapes",
      title: "Abstract Composition"
    },
    {
      url: "https://images.unsplash.com/photo-1680990459284-2c1752680d31?q=80&w=1000&auto=format&fit=crop",
      alt: "Futuristic city skyline with neon lights",
      title: "Cyberpunk City"
    }
  ];

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      role: "Graphic Designer",
      content: "This AI has revolutionized my creative process. I can quickly generate concept art and iterate on designs in a fraction of the time."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      role: "Marketing Director",
      content: "We've cut our content creation time in half! The quality and variety of images we can generate has improved our engagement across all platforms."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      role: "Social Media Influencer",
      content: "I love how I can create unique, eye-catching visuals for my posts with just a text description. It's like having a professional designer on call 24/7."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <HeroSection aiGeneratedImages={aiGeneratedImages} />
      <FeaturesSection />
      <ShowcaseSection showcaseImages={showcaseImages} />
      <HowItWorksSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
      <HomeFooter />
    </div>
  );
};

export default Index;
