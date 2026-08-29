import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const articleSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Faqat kichik lotin harflari, raqamlar va tire"),
  title: z.string().trim().min(3).max(200),
  category: z.string().trim().min(1).max(60),
  excerpt: z.string().trim().max(500).default(""),
  body: z.string().trim().max(50000).default(""),
  image_url: z.string().trim().max(600).nullable().optional(),
  reading_time: z.string().trim().max(40).default("5 daqiqa"),
  published: z.boolean().default(true),
});

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Ruxsat yo‘q");
}

export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: Boolean(data), userId: context.userId };
  });

/** First signed-in account can claim admin while no admin exists yet. */
export const claimAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    if ((count ?? 0) > 0) throw new Error("Admin allaqachon mavjud");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAllArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("articles")
      .select("id, slug, title, category, excerpt, body, image_url, reading_time, published, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const saveArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => articleSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const payload = { ...data, image_url: data.image_url || null };
    const { error } = data.id
      ? await context.supabase.from("articles").update(payload).eq("id", data.id)
      : await context.supabase.from("articles").insert(payload);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase.from("articles").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listVisits = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { limit?: number } | undefined) => ({ limit: input?.limit ?? 200 }))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("visits")
      .select("id, path, ip, country, city, device, browser, os, referrer, created_at")
      .order("created_at", { ascending: false })
      .limit(Math.min(data.limit, 500));
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const getStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const dayAgo = new Date(Date.now() - 86400000).toISOString();
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    const [total, today, week, articles, subs, recent] = await Promise.all([
      context.supabase.from("visits").select("id", { count: "exact", head: true }),
      context.supabase.from("visits").select("id", { count: "exact", head: true }).gte("created_at", dayAgo),
      context.supabase.from("visits").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      context.supabase.from("articles").select("id", { count: "exact", head: true }),
      context.supabase.from("subscribers").select("id", { count: "exact", head: true }),
      context.supabase
        .from("visits")
        .select("created_at, device, ip")
        .gte("created_at", weekAgo)
        .order("created_at", { ascending: false })
        .limit(2000),
    ]);
    const rows = (recent.data ?? []) as { created_at: string; device: string | null; ip: string | null }[];
    const byDay: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    for (const r of rows) {
      const day = r.created_at.slice(0, 10);
      byDay[day] = (byDay[day] ?? 0) + 1;
      const d = r.device ?? "Boshqa";
      byDevice[d] = (byDevice[d] ?? 0) + 1;
    }
    return {
      totalVisits: total.count ?? 0,
      todayVisits: today.count ?? 0,
      weekVisits: week.count ?? 0,
      uniqueWeek: new Set(rows.map((r) => r.ip).filter(Boolean)).size,
      articleCount: articles.count ?? 0,
      subscriberCount: subs.count ?? 0,
      byDay: Object.entries(byDay).sort(([a], [b]) => a.localeCompare(b)),
      byDevice: Object.entries(byDevice).sort((a, b) => b[1] - a[1]),
    };
  });

export const listSubscribers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("subscribers")
      .select("id, email, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
