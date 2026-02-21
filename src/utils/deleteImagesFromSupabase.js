import { supabase } from "../services/supabase";

export const deleteImagesFromSupabase = async (imageUrls) => {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    console.log("⚠️ No images to delete");
    return { success: true, deleted: 0, skipped: 0, filePaths: [] };
  }

  const marker = "/storage/v1/object/public/Products/";

  // Split into valid Supabase URLs and skipped (non-supabase / invalid) URLs
  const filePaths = [];
  const skippedUrls = [];

  for (const url of imageUrls) {
    try {
      const u = new URL(url);
      const idx = u.pathname.indexOf(marker);

      if (idx === -1) {
        skippedUrls.push(url);
        continue;
      }

      const path = decodeURIComponent(
        u.pathname.slice(idx + marker.length),
      ).replace(/^\/+/, "");

      if (!path) {
        skippedUrls.push(url);
        continue;
      }

      filePaths.push(path);
    } catch {
      // Not a valid URL string
      skippedUrls.push(url);
    }
  }

  if (filePaths.length === 0) {
    console.log("⚠️ No Supabase image paths found. Skipping storage delete.");
    return {
      success: false,
      deleted: 0,
      skipped: skippedUrls.length,
      noSupabaseUrl: true,
      filePaths: [],
    };
  }

  console.log("📂 File paths to delete:", filePaths);

  const { data, error } = await supabase.storage
    .from("Products")
    .remove(filePaths);

  if (error) {
    console.error("❌ Error deleting images:", error);
    throw error;
  }

  console.log("✅ Successfully deleted images:", data);

  return {
    success: true,
    deleted: data?.length ?? 0,
    skipped: skippedUrls.length,
    skippedUrls,
    filePaths,
    data,
  };
};
