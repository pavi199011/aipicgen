
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Search, RefreshCw, Download } from "lucide-react";
import { bulkDeleteGeneratedImages } from "@/utils/supabase-helpers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ImageItem {
  id: string;
  image_url: string;
  prompt: string;
  model: string;
  created_at: string;
  user_id: string;
  // Make profiles optional since it might not be properly joined
  profiles?: {
    username: string | null;
  } | null;
  // Explicitly add username as an optional property
  username?: string | null;
}

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
  
  // Fetch images
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
      
      // Handle the case where the profiles relation might be an error
      // Safeguard the transformation with proper type checking
      const formattedData = data.map(item => {
        // Create a new object with the right shape
        const imageItem: ImageItem = {
          id: item.id,
          image_url: item.image_url,
          prompt: item.prompt,
          model: item.model,
          created_at: item.created_at,
          user_id: item.user_id,
          // Only add profiles if it's not an error object
          profiles: typeof item.profiles === 'object' && item.profiles !== null 
            ? item.profiles 
            : null,
          // Extract username safely or set to null
          username: typeof item.profiles === 'object' && item.profiles !== null 
            ? item.profiles.username 
            : null
        };
        return imageItem;
      });
      
      return formattedData;
    }
  });
  
  // Fetch users
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
  
  // Toggle all images selection
  const toggleSelectAll = () => {
    if (images) {
      if (selectedImages.length === images.length) {
        setSelectedImages([]);
      } else {
        setSelectedImages(images.map(img => img.id));
      }
    }
  };
  
  // Toggle single image selection
  const toggleImageSelection = (id: string) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(imgId => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };
  
  // Handle bulk delete
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
      
      // Clear selection and refresh data
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
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by prompt..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* User Filter */}
              <div className="w-full sm:w-64">
                <Select
                  value={selectedUser}
                  onValueChange={setSelectedUser}
                  disabled={usersLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by user..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    {users?.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.username || user.id.substring(0, 8)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Refresh button */}
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => refetchImages()} 
                disabled={imagesLoading}
                className="h-10 w-10 shrink-0"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="selectAll"
                  checked={images && images.length > 0 && selectedImages.length === images.length}
                  onCheckedChange={toggleSelectAll}
                  disabled={!images || images.length === 0}
                />
                <label htmlFor="selectAll" className="text-sm font-medium">
                  {selectedImages.length > 0 
                    ? `Selected ${selectedImages.length} images` 
                    : "Select All"}
                </label>
              </div>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowConfirmDialog(true)}
                disabled={selectedImages.length === 0 || isDeleting}
                className="flex gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
            </div>
            
            <Separator className="my-4" />
            
            {/* Images Grid */}
            {imagesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((_, i) => (
                  <div key={i} className="border rounded-md p-2 h-[160px] animate-pulse bg-gray-100 dark:bg-gray-800" />
                ))}
              </div>
            ) : !images || images.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                <p>No images found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                {images.map((image) => (
                  <div 
                    key={image.id} 
                    className={`border rounded-md overflow-hidden relative group transition-all ${
                      selectedImages.includes(image.id) ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox 
                        checked={selectedImages.includes(image.id)}
                        onCheckedChange={() => toggleImageSelection(image.id)}
                        className="bg-white/70 dark:bg-gray-800/70"
                      />
                    </div>
                    
                    <div className="h-28 relative">
                      <img 
                        src={image.image_url} 
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all" />
                    </div>
                    
                    <div className="p-2 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {image.username ? image.username.substring(0, 2).toUpperCase() : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs text-gray-500 truncate">
                          {image.username || image.user_id.substring(0, 6)}
                        </p>
                      </div>
                      <p className="text-xs truncate mt-1" title={image.prompt}>
                        {image.prompt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Bulk Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedImages.length} selected images? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleBulkDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete Images"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkImageDelete;
