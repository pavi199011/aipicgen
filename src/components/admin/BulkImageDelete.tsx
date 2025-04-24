import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { bulkDeleteGeneratedImages } from "@/utils/supabase-helpers";
import { SearchFilters } from "./bulk-image-delete/SearchFilters";
import { SelectionControls } from "./bulk-image-delete/SelectionControls";
import { ImageGrid, ImageItem } from "./bulk-image-delete/ImageGrid";
import { DeleteConfirmDialog } from "./bulk-image-delete/DeleteConfirmDialog";

interface User {
  id: string;
  username?: string;
}

const BulkImageDelete = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { data: images, isLoading: imagesLoading, refetch: refetchImages } = useQuery({
    queryKey: ["admin-images", searchTerm, selectedUser],
    queryFn: async () => {
      let query = supabase
        .from("generated_images")
        .select(`
          id, 
          image_url, 
          prompt, 
          model, 
          created_at, 
          user_id,
          profiles(username)
        `)
        .order("created_at", { ascending: false });
        
      if (selectedUser !== "all") {
        query = query.eq("user_id", selectedUser);
      }
      
      if (searchTerm) {
        query = query.ilike("prompt", `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      const formattedData = data.map(item => ({
        id: item.id,
        image_url: item.image_url,
        prompt: item.prompt,
        model: item.model,
        created_at: item.created_at,
        user_id: item.user_id,
        // Fix: Add null check for profiles and properly access username with optional chaining
        profiles: typeof item.profiles === 'object' ? item.profiles : null,
        username: typeof item.profiles === 'object' ? item.profiles?.username ?? null : null
      }));
      
      return formattedData as ImageItem[];
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
      <Card>
        <CardHeader>
          <CardTitle>Bulk Image Management</CardTitle>
          <CardDescription>
            Delete multiple images from the system
          </CardDescription>
        </CardHeader>
        <CardContent>
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
