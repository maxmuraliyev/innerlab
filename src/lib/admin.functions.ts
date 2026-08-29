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
    const { id, ...rest } = data;
    const payload = { ...rest, image_url: data.image_url || null };
    const { error } = id
      ? await context.supabase.from("articles").update(payload).eq("id", id)
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
    const [totalIPs, articles, subs, allVisitsRaw] = await Promise.all([
      context.supabase.from("visits").select("ip").limit(5000).order("created_at", { ascending: false }),
      context.supabase.from("articles").select("id", { count: "exact", head: true }),
      context.supabase.from("subscribers").select("id", { count: "exact", head: true }),
      context.supabase
        .from("visits")
        .select("created_at, device, ip, browser, os, city, country")
        .gte("created_at", weekAgo)
        .order("created_at", { ascending: false })
        .limit(3000),
    ]);

    const rows = (allVisitsRaw.data ?? []) as any[];

    // Calculate unique IPs
    const totalUnique = new Set((totalIPs.data || []).map(r => r.ip).filter(Boolean)).size;
    const todayUnique = new Set(rows.filter(r => r.created_at >= dayAgo).map(r => r.ip).filter(Boolean)).size;
    const weekUnique = new Set(rows.map(r => r.ip).filter(Boolean)).size;

    // Group visits by IP
    const usersMap = new Map<string, any>();
    for (const r of rows) {
      if (!r.ip) continue;
      if (!usersMap.has(r.ip)) {
        usersMap.set(r.ip, {
          ip: r.ip,
          first_visit: r.created_at, // will be updated as we go back in time
          last_visit: r.created_at, // The first row we encounter for this IP is the most recent (last visit)
          device: r.device || "Noma'lum",
          browser: r.browser || "Noma'lum",
          os: r.os || "Noma'lum",
          city: r.city,
          country: r.country,
          count: 0,
        });
      }
      const u = usersMap.get(r.ip);
      u.count++;
      // Since it's ordered by descending created_at, the last row we see for an IP is their first visit
      u.first_visit = r.created_at;
    }

    const uniqueUsers = Array.from(usersMap.values());

    return {
      totalVisits: totalUnique,
      todayVisits: todayUnique,
      weekVisits: weekUnique,
      uniqueWeek: uniqueUsers.length,
      articleCount: articles.count ?? 0,
      subscriberCount: subs.count ?? 0,
      recentUsers: uniqueUsers.slice(0, 50), // Send top 50 recent unique users
    };
  });

export const checkAndGenerateDailyStats = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    
    // Check if we already generated stats for yesterday
    const yesterdayDateStr = new Date(Date.now() - 86400000).toISOString().split('T')[0]; // YYYY-MM-DD
    const title = `Kunlik hisobot: ${yesterdayDateStr}`;
    
    const { data: existing } = await context.supabase
      .from("notifications")
      .select("id")
      .eq("type", "daily_stats")
      .eq("title", title)
      .maybeSingle();
      
    if (existing) return { ok: true, generated: false };
    
    // Generate it
    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);
    
    const endOfYesterday = new Date();
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);
    
    const startIso = startOfYesterday.toISOString();
    const endIso = endOfYesterday.toISOString();
    
    const [visitsData, subsData] = await Promise.all([
      context.supabase.from("visits").select("ip").gte("created_at", startIso).lte("created_at", endIso),
      context.supabase.from("subscribers").select("id", { count: "exact", head: true }).gte("created_at", startIso).lte("created_at", endIso)
    ]);
    
    const uniqueVisits = new Set((visitsData.data || []).map(r => r.ip).filter(Boolean)).size;
    const newSubs = subsData.count || 0;
    
    const message = `📊 <b>Kunlik hisobot</b>\n📅 Sana: ${yesterdayDateStr}\n👀 Unikal tashriflar: ${uniqueVisits}\n👥 Yangi obunachilar: ${newSubs}`;
    
    // Insert notification
    await context.supabase.from("notifications").insert({
      title,
      message: `Kecha saytga ${uniqueVisits} ta unikal odam kirdi va ${newSubs} ta yangi obunachi qo'shildi.`,
      type: "daily_stats"
    });
    
    // Send Telegram
    try {
      const { sendTelegramMessage } = await import("./telegram");
      await sendTelegramMessage(message);
    } catch (e) {
      console.error(e);
    }
    
    return { ok: true, generated: true };
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

export const deleteSubscriber = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("subscribers")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const sendBulkEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { subject: string; html: string }) => 
    z.object({ subject: z.string().min(1), html: z.string().min(1) }).parse(input)
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    
    // Fetch all subscribers
    const { data: subscribers, error } = await context.supabase
      .from("subscribers")
      .select("email");
      
    if (error) throw new Error(error.message);
    if (!subscribers || subscribers.length === 0) return { ok: true, sent: 0 };

    const emails = subscribers.map((s) => s.email);
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send emails (using bcc to send bulk in one API call if possible, or mapping over them)
    // Note: Resend supports sending up to 50 emails per request using Audience/Contacts or Batch.
    // We'll use the batch API.
    const batch = emails.map(email => ({
      from: "Inner Lab <noreply@yourdomain.com>", // User should verify a domain in Resend later
      to: [email],
      subject: data.subject,
      html: data.html,
    }));

    // Chunk into 50s (Resend batch limit)
    let sentCount = 0;
    for (let i = 0; i < batch.length; i += 50) {
      const chunk = batch.slice(i, i + 50);
      const { error: sendError } = await resend.batch.send(chunk);
      if (sendError) throw new Error(sendError.message);
      sentCount += chunk.length;
    }

    return { ok: true, sent: sentCount };
  });

export const listNotifications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const markNotificationAsRead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ is_read: true })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
