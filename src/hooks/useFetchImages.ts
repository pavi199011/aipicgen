
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
  const [retryCount, setRetryCount] = useState(0);
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
      
      // Reset retry count on successful fetch
      setRetryCount(0);
    } catch (error: any) {
      console.error("Fetch images error:", error);
      
      // Increment retry count to track failed attempts
      setRetryCount(prev => prev + 1);
      
      // Customize error message based on error type
      let errorMessage = "Failed to load your images. Please try refreshing.";
      
      if (error.status === 401 || error.status === 403) {
        errorMessage = "You don't have permission to view these images. Please try signing in again.";
      } else if (error.status === 429) {
        errorMessage = "Too many requests. Please wait a moment before trying again.";
      } else if (error.status >= 500) {
        errorMessage = "Server error. Our team has been notified and is working on a fix.";
      } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      
      setError(errorMessage);
      
      toast({
        title: "Error fetching images",
        description: errorMessage,
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
