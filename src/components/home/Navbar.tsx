
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navContent = (
    <>
      {user ? (
        <Button 
          onClick={() => window.location.href = "/dashboard"}
          variant="outline"
          className="whitespace-nowrap"
        >
          Dashboard
        </Button>
      ) : (
        <>
          <Button 
            onClick={() => window.location.href = "/auth"}
            variant="outline"
            className="whitespace-nowrap"
          >
            Sign In
          </Button>
          <Button 
            onClick={() => window.location.href = "/auth"}
            className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white whitespace-nowrap"
          >
            Get Started
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className={`fixed w-full z-10 transition-colors duration-300 ${
      isScrolled ? "bg-white shadow-sm border-b border-gray-200 dark:bg-slate-900 dark:border-gray-800" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            PixelPalette
          </h1>
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col gap-4 mt-8">
                {navContent}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center space-x-4">
            {navContent}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
