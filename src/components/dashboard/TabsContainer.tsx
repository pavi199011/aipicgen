
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface TabsContainerProps {
  createContent: ReactNode;
  galleryContent: ReactNode;
}

const TabsContainer = ({ createContent, galleryContent }: TabsContainerProps) => {
  const isMobile = useIsMobile();
  
  return (
    <motion.div 
      className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="create" className="space-y-4 md:space-y-6">
        <TabsList className="w-full grid grid-cols-2 sm:inline-flex">
          <TabsTrigger value="create" className="flex-1 sm:flex-none text-sm md:text-base">Create</TabsTrigger>
          <TabsTrigger value="gallery" className="flex-1 sm:flex-none text-sm md:text-base">Your Gallery</TabsTrigger>
        </TabsList>
        
        <TabsContent value="create" className="mt-4">
          {createContent}
        </TabsContent>
        
        <TabsContent value="gallery" className="mt-4">
          {galleryContent}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TabsContainer;
