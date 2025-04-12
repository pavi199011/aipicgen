
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabsContainerProps {
  createContent: ReactNode;
  galleryContent: ReactNode;
}

const TabsContainer = ({ createContent, galleryContent }: TabsContainerProps) => {
  return (
    <motion.div 
      className="container mx-auto py-8 px-4 max-w-7xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs defaultValue="create" className="space-y-8">
        <div className="flex justify-between items-center mb-2">
          <TabsList>
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="gallery">Your Gallery</TabsTrigger>
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
