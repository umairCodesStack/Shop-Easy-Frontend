import { supabase } from "../services/supabase";

export const deleteImagesFromSupabase = async (imageUrls) => {
  if (!imageUrls || imageUrls.length === 0) {
    console.log("⚠️ No images to delete");
    return { success: true, deleted: 0 };
  }

  console.log("🔵 Deleting images from Supabase:", imageUrls);

  try {
    // Extract file paths from URLs
    const filePaths = imageUrls.map((url) => {
      const urlParts = url.split("/");
      // Take last 2 parts: folder/filename
      return urlParts.slice(-2).join("/");
    });

    console.log("📂 File paths to delete:", filePaths);

    // Delete files (Supabase will skip non-existent files)
    const { data, error } = await supabase.storage
      .from("Products")
      .remove(filePaths);

    if (error) {
      console.error("❌ Error deleting images:", error);
      throw new Error(error.message);
    }

    console.log("✅ Successfully deleted images:", data);

    return {
      success: true,
      deleted: data ? data.length : filePaths.length,
      filePaths,
    };
  } catch (error) {
    console.error("❌ Fatal error in deleteImagesFromSupabase:", error);
    throw error;
  }
};
