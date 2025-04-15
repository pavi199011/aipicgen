
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-10 transition-colors duration-300 ${
      isScrolled ? "bg-white shadow-sm border-b border-gray-200" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            PixelPalette
          </h1>
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
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
