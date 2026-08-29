import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { publicDb, parseUserAgent } from "./public-db";

const LIST_COLUMNS =
  "id, slug, title, category, excerpt, body, image_url, reading_time, published, created_at";

export const listArticles = createServerFn({ method: "GET" })
  .inputValidator((input: { category?: string } | undefined) => input ?? {})
  .handler(async ({ data }) => {
    let query = publicDb()
      .from("articles")
      .select(LIST_COLUMNS)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (data.category) query = query.eq("category", data.category);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().max(200) }).parse(input))
  .handler(async ({ data }) => {
    const { data: row } = await publicDb()
      .from("articles")
      .select(LIST_COLUMNS)
      .eq("slug", data.slug)
      .eq("published", true)
      .maybeSingle();
    return row ?? null;
  });

export const subscribeEmail = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("subscribers")
      .upsert({ email: data.email.toLowerCase() }, { onConflict: "email" });
    if (error) throw new Error("Obunani saqlab bo‘lmadi");
    return { ok: true };
  });

export const trackVisit = createServerFn({ method: "POST" })
  .inputValidator((input: { path: string; referrer?: string }) =>
    z
      .object({ path: z.string().max(500), referrer: z.string().max(500).optional() })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const request = getRequest();
    const h = request.headers;
    const ip =
      h.get("cf-connecting-ip") ??
      h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      h.get("x-real-ip") ??
      null;
    const ua = h.get("user-agent") ?? "";
    const { device, browser, os } = parseUserAgent(ua);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("visits").insert({
      path: data.path,
      ip,
      country: h.get("cf-ipcountry"),
      city: h.get("cf-ipcity"),
      device,
      browser,
      os,
      user_agent: ua.slice(0, 500),
      referrer: data.referrer ?? null,
    });
    return { ok: true };
  });
