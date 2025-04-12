
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

const Index = () => {
  const { user } = useAuth();

  // Example images for the carousel
  const exampleImages = [
    {
      url: "https://replicate.delivery/pbxt/4kw2JSufHBuAURSxhRbDDp1l7mT83ogTHyLS9JJZ3uDp6OSE/out-0.png",
      prompt: "A peaceful mountain landscape with a lake at sunset",
    },
    {
      url: "https://replicate.delivery/pbxt/I9PH8ygvNqUYLI6JMOZyLEGSIvZ7o0pJ2fkgLNGtFrYw9WVgA/out-0.png",
      prompt: "A futuristic cityscape with flying vehicles",
    },
    {
      url: "https://replicate.delivery/pbxt/JZv4RvjaHJBTChnhMEbQfcpXGzKZzGqpWXnOevbHWRKh8OSE/out-0.png",
      prompt: "A magical forest with glowing plants and floating lanterns",
    },
  ];

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
          <div className="flex gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Create Stunning AI Art
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-700">
          Transform your ideas into beautiful images with our state-of-the-art AI
          image generation
        </p>
        <Link to={user ? "/dashboard" : "/auth"}>
          <Button size="lg" className="text-lg px-8 py-6">
            {user ? "Start Creating" : "Get Started"}
          </Button>
        </Link>
      </section>

      {/* Example Images */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Examples of What You Can Create
        </h2>
        <div className="max-w-4xl mx-auto">
          <Carousel>
            <CarouselContent>
              {exampleImages.map((image, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="p-0 relative">
                      <img
                        src={image.url}
                        alt={image.prompt}
                        className="w-full h-[400px] object-cover rounded-lg"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-4 rounded-b-lg">
                        <p className="text-white text-sm">{image.prompt}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose PixelPalette
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Cutting-Edge Models</h3>
            <p className="text-gray-600">
              Access to the latest AI image generation models like SDXL, Turbo, and Flux
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">User-Friendly Interface</h3>
            <p className="text-gray-600">
              Simple, intuitive design makes creating AI art easy for everyone
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Save Your Creations</h3>
            <p className="text-gray-600">
              All your generated images are automatically saved to your account
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2025 PixelPalette. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
