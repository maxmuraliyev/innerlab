import { createFileRoute } from "@tanstack/react-router";
import { getStats } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: async () => {
    return await getStats();
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const stats = Route.useLoaderData();

  return (
    <div>
      <h1 className="mb-8 font-serif text-3xl font-bold">Dashboard</h1>
      
      <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">Umumiy tashriflar</p>
          <p className="mt-2 text-3xl font-bold">{stats.totalVisits}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">Bugun</p>
          <p className="mt-2 text-3xl font-bold">{stats.todayVisits}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">Shu hafta</p>
          <p className="mt-2 text-3xl font-bold">{stats.weekVisits}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-ink/60">Unikal (hafta)</p>
          <p className="mt-2 text-3xl font-bold">{stats.uniqueWeek}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-bold">Qurilmalar</h2>
          <div className="space-y-3">
            {stats.byDevice.map(([device, count]) => (
              <div key={device} className="flex justify-between border-b border-ink/5 pb-2 last:border-0">
                <span className="text-ink/80">{device}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-serif text-xl font-bold">So'nggi 7 kun</h2>
          <div className="space-y-3">
            {stats.byDay.map(([day, count]) => (
              <div key={day} className="flex justify-between border-b border-ink/5 pb-2 last:border-0">
                <span className="text-ink/80">{day}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
