
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
  // Sample data for AI generated images - Updated with reliable Unsplash images
  const aiGeneratedImages = [
    {
      url: "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151",
      alt: "Vibrant abstract desert landscape",
      style: "abstract"
    },
    {
      url: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
      alt: "Modern architecture in grayscale",
      style: "futuristic"
    },
    {
      url: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      alt: "Nature wildlife scene with deer",
      style: "nature"
    },
    {
      url: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
      alt: "Portrait of a cat in soft lighting",
      style: "portrait"
    }
  ];

  // Sample showcase images - Updated with reliable architecture/design images
  const showcaseImages = [
    {
      url: "https://images.unsplash.com/photo-1486718448742-163732cd1544",
      alt: "Minimalist architectural detail",
      title: "Architectural Abstract"
    },
    {
      url: "https://images.unsplash.com/photo-1551038247-3d9af20df552",
      alt: "Modern building against blue sky",
      title: "Contemporary Design"
    },
    {
      url: "https://images.unsplash.com/photo-1496307653780-42ee777d4833",
      alt: "Bottom view of glass building",
      title: "Urban Perspective"
    },
    {
      url: "https://images.unsplash.com/photo-1460574283810-2aab119d8511",
      alt: "Striking architectural lines",
      title: "Geometric Patterns"
    }
  ];

  // Sample testimonials data - Updated with reliable portrait images
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      role: "Graphic Designer",
      content: "This AI has revolutionized my creative process. I can quickly generate concept art and iterate on designs in a fraction of the time."
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      role: "Marketing Director",
      content: "We've cut our content creation time in half! The quality and variety of images we can generate has improved our engagement across all platforms."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
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
