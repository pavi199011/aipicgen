
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
  // Sample data for AI generated images - Updated with text placeholders and added url and alt props
  const aiGeneratedImages = [
    {
      description: "Vibrant abstract desert landscape",
      style: "abstract",
      url: "/placeholder.svg",
      alt: "Abstract desert landscape"
    },
    {
      description: "Modern architecture in grayscale",
      style: "futuristic",
      url: "/placeholder.svg",
      alt: "Futuristic architecture"
    },
    {
      description: "Nature wildlife scene with deer",
      style: "nature",
      url: "/placeholder.svg",
      alt: "Wildlife nature scene"
    },
    {
      description: "Portrait of a cat in soft lighting",
      style: "portrait",
      url: "/placeholder.svg",
      alt: "Cat portrait"
    }
  ];

  // Sample showcase images - Updated with text descriptions
  const showcaseImages = [
    {
      description: "Minimalist architectural detail",
      title: "Architectural Abstract",
      style: "abstract"
    },
    {
      description: "Modern building against blue sky",
      title: "Contemporary Design",
      style: "modern"
    },
    {
      description: "Bottom view of glass building",
      title: "Urban Perspective",
      style: "urban"
    },
    {
      description: "Striking architectural lines",
      title: "Geometric Patterns",
      style: "geometric"
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
