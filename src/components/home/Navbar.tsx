
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            PixelPalette
          </h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Features</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500 to-indigo-700 p-6 no-underline outline-none focus:shadow-md"
                          href="#features"
                        >
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            AI Image Generator
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Create stunning visuals with our powerful AI models
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        to="#features"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <div className="text-sm font-medium leading-none">
                          Creative Freedom
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                          Describe any image you can imagine
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#features"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <div className="text-sm font-medium leading-none">
                          Lightning Fast
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                          Generate images in seconds
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="#features"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100"
                      >
                        <div className="text-sm font-medium leading-none">
                          Commercial Use
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-gray-500">
                          All images are royalty-free
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="#testimonials" className={navigationMenuTriggerStyle()}>
                  Testimonials
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="#how-it-works" className={navigationMenuTriggerStyle()}>
                  How It Works
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
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
                className="bg-gradient-to-r from-purple-600 to-blue-500 text-white"
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
