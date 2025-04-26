
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { bulkDeleteGeneratedImages } from "@/utils/supabase-helpers";
import { SearchFilters } from "./bulk-image-delete/SearchFilters";
import { SelectionControls } from "./bulk-image-delete/SelectionControls";
import { ImageGrid } from "./bulk-image-delete/ImageGrid";
import { DeleteConfirmDialog } from "./bulk-image-delete/DeleteConfirmDialog";
import { ImageItem, User } from "./bulk-image-delete/types";
import { useIsMobile } from "@/hooks/use-mobile";

const BulkImageDelete = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { data: images, isLoading: imagesLoading, refetch: refetchImages } = useQuery({
    queryKey: ["admin-images", searchTerm, selectedUser],
    queryFn: async () => {
      try {
        // First fetch images
        let imagesQuery = supabase
          .from("generated_images")
          .select(`
            id, 
            image_url, 
            prompt, 
            model, 
            created_at, 
            user_id
          `)
          .order("created_at", { ascending: false });
          
        if (selectedUser !== "all") {
          imagesQuery = imagesQuery.eq("user_id", selectedUser);
        }
        
        if (searchTerm) {
          imagesQuery = imagesQuery.ilike("prompt", `%${searchTerm}%`);
        }
        
        const { data: imagesData, error: imagesError } = await imagesQuery;
        
        if (imagesError) {
          console.error("Error fetching images:", imagesError);
          throw imagesError;
        }
        
        // If there's no images data, return an empty array
        if (!imagesData || imagesData.length === 0) {
          return [];
        }
        
        // Fetch usernames separately for the user IDs we have
        const userIds = [...new Set(imagesData.map(img => img.user_id))];
        
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username")
          .in("id", userIds);
          
        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          // Don't throw error here, we'll just use null for username
        }
        
        // Create a map of user IDs to usernames
        const usernameMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            usernameMap.set(profile.id, profile.username);
          });
        }
        
        // Map the images data with usernames from our map
        return imagesData.map(item => ({
          id: item.id,
          image_url: item.image_url,
          prompt: item.prompt,
          model: item.model,
          created_at: item.created_at,
          user_id: item.user_id,
          username: usernameMap.get(item.user_id) || null
        })) as ImageItem[];
      } catch (error) {
        console.error("Error in query execution:", error);
        throw error;
      }
    }
  });
  
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (error) {
        throw error;
      }
      
      return data as User[];
    }
  });
  
  const toggleSelectAll = () => {
    if (images) {
      if (selectedImages.length === images.length) {
        setSelectedImages([]);
      } else {
        setSelectedImages(images.map(img => img.id));
      }
    }
  };
  
  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imgId => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };
  
  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select at least one image to delete.",
        variant: "destructive"
      });
      return;
    }
    
    setIsDeleting(true);
    try {
      const result = await bulkDeleteGeneratedImages(selectedImages);
      
      if (result.success) {
        toast({
          title: "Images deleted",
          description: `Successfully deleted ${result.deletedCount} images.`,
        });
      } else {
        toast({
          title: "Partial success",
          description: `Deleted ${result.deletedCount} out of ${result.totalCount} images.`,
          variant: "destructive"
        });
      }
      
      setSelectedImages([]);
      refetchImages();
    } catch (error) {
      console.error("Error deleting images:", error);
      toast({
        title: "Error",
        description: "Failed to delete images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className={isMobile ? "px-3 py-4" : ""}>
          <CardTitle>Bulk Image Management</CardTitle>
          <CardDescription>
            Delete multiple images from the system
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "px-3 py-3" : ""}>
          <div className="flex flex-col space-y-4">
            <SearchFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedUser={selectedUser}
              onUserChange={setSelectedUser}
              users={users}
              usersLoading={usersLoading}
              onRefresh={() => refetchImages()}
              isLoading={imagesLoading}
            />
            
            <SelectionControls 
              selectedCount={selectedImages.length}
              totalCount={images?.length || 0}
              onToggleAll={toggleSelectAll}
              onDelete={() => setShowConfirmDialog(true)}
              isDeleting={isDeleting}
            />
            
            <Separator className="my-4" />
            
            <ImageGrid 
              images={images}
              isLoading={imagesLoading}
              selectedImages={selectedImages}
              onImageSelect={toggleImageSelection}
            />
          </div>
        </CardContent>
      </Card>
      
      <DeleteConfirmDialog 
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={handleBulkDelete}
        selectedCount={selectedImages.length}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default BulkImageDelete;
