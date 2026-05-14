import { createClient } from "@supabase/supabase-js/dist/index.cjs";
export const supabaseUrl = "https://vgfuiciippwawexfozcg.supabase.co";
export const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnZnVpY2lpcHB3YXdleGZvemNnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY4NzkwNywiZXhwIjoyMDk0MjYzOTA3fQ.0MQxbZcdhS54rGNxyeUMKkMS79Mb6vGyZQjX62bVfY0";
export const supabase = createClient(supabaseUrl, supabaseKey);
