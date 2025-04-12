
import { Sparkles, Zap, Shield } from "lucide-react";

const FeaturesSection = () => {
  return (
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
  );
};

export default FeaturesSection;
