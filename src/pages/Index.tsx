
import { useState } from "react";
import { motion } from "framer-motion";

import Navbar from "@/components/home/Navbar";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import HomeFooter from "@/components/home/HomeFooter";

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
  // Testimonials data
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
      <Navbar />
      <HeroSection aiGeneratedImages={aiGeneratedImages} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
      <HomeFooter />
    </div>
  );
};

export default Index;
