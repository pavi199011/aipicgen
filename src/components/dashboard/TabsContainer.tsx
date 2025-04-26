
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
      className={`container mx-auto ${isMobile ? 'py-4 px-2' : 'py-8 px-4'} max-w-7xl`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="create" className="space-y-6 md:space-y-8">
        <div className="flex justify-between items-center mb-2">
          <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
            <TabsTrigger value="create" className="flex-1 sm:flex-none">Create</TabsTrigger>
            <TabsTrigger value="gallery" className="flex-1 sm:flex-none">Your Gallery</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="create">
          {createContent}
        </TabsContent>
        
        <TabsContent value="gallery">
          {galleryContent}
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default TabsContainer;
