
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  model: string;
  created_at: string;
  user_id: string;
}

export function useFetchImages(userId: string | undefined) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchImages = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("generated_images")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      setError("Failed to load your images. Please try refreshing the page.");
      toast({
        title: "Error fetching images",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchImages();
    }
  }, [userId]);

  return { images, loading, error, fetchImages };
}
