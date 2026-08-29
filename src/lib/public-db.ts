import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Server-side publishable (anon) Supabase client.
 * Only call this inside server function / server route handlers.
 */
export function publicDb() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export function parseUserAgent(ua: string) {
  const s = ua.toLowerCase();
  const device = /ipad|tablet/.test(s)
    ? "Planshet"
    : /mobi|android|iphone/.test(s)
      ? "Mobil"
      : "Kompyuter";
  const browser = /edg\//.test(s)
    ? "Edge"
    : /opr\/|opera/.test(s)
      ? "Opera"
      : /chrome|crios/.test(s)
        ? "Chrome"
        : /firefox|fxios/.test(s)
          ? "Firefox"
          : /safari/.test(s)
            ? "Safari"
            : "Boshqa";
  const os = /windows/.test(s)
    ? "Windows"
    : /iphone|ipad|ios/.test(s)
      ? "iOS"
      : /mac os/.test(s)
        ? "macOS"
        : /android/.test(s)
          ? "Android"
          : /linux/.test(s)
            ? "Linux"
            : "Boshqa";
  return { device, browser, os };
}
