import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getStats().then(setStats).catch(console.error);
    const interval = setInterval(() => {
      getStats().then(setStats).catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!stats) return <div className="p-8 text-ink/50">Loading...</div>;

  const isOnline = (dateStr: string) => {
    return Date.now() - new Date(dateStr).getTime() < 5 * 60 * 1000;
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activeNow = stats.recentUsers?.filter((u: any) => isOnline(u.last_visit)).length || 0;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-green">
          Live connection (updates every 10s)
        </div>
      </div>

      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">Total visits</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalVisits}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">Today</p>
          <p className="mt-2 text-3xl font-bold">{stats.todayVisits}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">This week</p>
          <p className="mt-2 text-3xl font-bold">{stats.weekVisits}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">Unique (week)</p>
          <p className="mt-2 text-3xl font-bold">{stats.uniqueWeek}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-green/20">
          <p className="text-sm font-medium text-ink/60 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green"></span>
            </span>
            Active now
          </p>
          <p className="mt-2 text-3xl font-bold text-green">{activeNow}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm overflow-x-auto">
        <h2 className="mb-6 font-serif text-xl font-bold">Users (Last 7 days)</h2>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-ink/60">
            <tr>
              <th className="pb-3 font-medium">Status / IP</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Device / OS</th>
              <th className="pb-3 font-medium">First visit</th>
              <th className="pb-3 font-medium">Last visit</th>
              <th className="pb-3 font-medium text-right">Page views</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {stats.recentUsers?.map((u: any) => (
              <tr key={u.ip} className="group transition-colors hover:bg-cream/50">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {isOnline(u.last_visit) ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-green" title="Online"></span>
                    ) : (
                      <span className="h-2.5 w-2.5 rounded-full bg-ink/20" title="Offline"></span>
                    )}
                    <span className="font-mono">{u.ip}</span>
                  </div>
                </td>
                <td className="py-4 text-ink/80">
                  {u.city || u.country ? `${u.city || "?"}, ${u.country || "?"}` : "Unknown"}
                </td>
                <td className="py-4 text-ink/80">
                  {u.device} <span className="text-ink/40">·</span> {u.os}
                </td>
                <td className="py-4 text-ink/80">{formatTime(u.first_visit)}</td>
                <td className="py-4 text-ink/80">{formatTime(u.last_visit)}</td>
                <td className="py-4 text-right font-medium">{u.count}</td>
              </tr>
            ))}
            {(!stats.recentUsers || stats.recentUsers.length === 0) && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-ink/50">
                  No data yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
