
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches and processes content-related statistics
 */
export const useContentStats = async () => {
  try {
    // Fetch total images count
    const { count: totalImages, error: imagesError } = await supabase
      .from('generated_images')
      .select('id', { count: 'exact', head: true });

    if (imagesError) throw imagesError;

    // Instead of using group, we'll fetch all images and manually count by model
    const { data: modelData, error: contentTypesError } = await supabase
      .from('generated_images')
      .select('model')
      .limit(1000);

    if (contentTypesError) throw contentTypesError;
    
    // Process the model data to count occurrences of each model
    const modelCounts: Record<string, number> = {};
    modelData?.forEach(item => {
      if (item.model) {
        modelCounts[item.model] = (modelCounts[item.model] || 0) + 1;
      }
    });
    
    // Convert to the required format
    const contentTypes = Object.entries(modelCounts).map(([name, value]) => ({
      name,
      value
    }));

    // Mock growth rates for now (in a real app, these would be calculated by comparing with previous periods)
    const contentGrowthRate = 12.3; // Mock value
    const conversionGrowth = 2.1; // Mock value

    // For conversion rate, we'll need user count
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    // Calculate conversion rate as the ratio of images to users
    const conversionRate = totalUsers ? Math.round((totalImages / totalUsers) * 100) : 0;

    return {
      totalImages: totalImages || 0,
      growthRate: contentGrowthRate,
      conversionRate,
      conversionGrowth,
      contentTypes: contentTypes.length > 0 ? contentTypes : [{ name: 'No Data', value: 0 }]
    };
  } catch (error) {
    console.error("Error fetching content stats:", error);
    throw error;
  }
};
