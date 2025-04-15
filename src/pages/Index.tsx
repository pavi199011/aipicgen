
import { Navbar } from "@/components/home/Navbar";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { HomeFooter } from "@/components/home/HomeFooter";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      
      <div className="container mx-auto px-4 py-6 text-center">
        <Link to="/admin/login">
          <Button variant="outline" size="sm" className="text-xs">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            Admin Portal
          </Button>
        </Link>
      </div>
      
      <HomeFooter />
    </div>
  );
};

export default Index;
