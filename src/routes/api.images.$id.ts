import { createAPIFileRoute } from "@tanstack/react-start/api";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const APIRoute = createAPIFileRoute("/api/images/$id")({
  GET: async ({ request, params }) => {
    const { id } = params;
    
    // We fetch the file directly from Supabase Storage using the admin client
    // because the bucket is private.
    const { data, error } = await supabaseAdmin.storage
      .from("article-images")
      .download(id);

    if (error || !data) {
      return new Response("Not found", { status: 404 });
    }

    // Determine content type based on extension
    let contentType = "image/jpeg";
    if (id.endsWith(".png")) contentType = "image/png";
    else if (id.endsWith(".gif")) contentType = "image/gif";
    else if (id.endsWith(".webp")) contentType = "image/webp";
    else if (id.endsWith(".svg")) contentType = "image/svg+xml";

    return new Response(data, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  },
});
