
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const CTASection = () => {
  const { user } = useAuth();
  
  return (
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
  );
};

export default CTASection;
