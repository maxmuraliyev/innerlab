import { createFileRoute, Outlet, redirect, isRedirect } from "@tanstack/react-router";
import { getMyAdminStatus } from "@/lib/admin.functions";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    try {
      const { isAdmin } = await getMyAdminStatus();
      if (!isAdmin) {
        throw redirect({
          to: "/auth",
        });
      }
    } catch (error) {
      if (isRedirect(error)) {
        throw error;
      }
      throw redirect({
        to: "/auth",
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-screen bg-cream text-ink">
      <aside className="w-64 border-r border-ink/10 bg-white p-6">
        <h2 className="mb-8 font-serif text-2xl font-bold">Inner Lab Admin</h2>
        <nav className="flex flex-col gap-2">
          <Link
            to="/admin"
            className="rounded-md px-3 py-2 text-sm hover:bg-cream [&.active]:bg-ink [&.active]:text-cream"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/articles"
            className="rounded-md px-3 py-2 text-sm hover:bg-cream [&.active]:bg-ink [&.active]:text-cream"
          >
            Maqolalar
          </Link>
          <Link
            to="/admin/subscribers"
            className="rounded-md px-3 py-2 text-sm hover:bg-cream [&.active]:bg-ink [&.active]:text-cream"
          >
            Obunachilar
          </Link>
          <Link
            to="/"
            className="mt-8 rounded-md px-3 py-2 text-sm hover:bg-cream text-ink/60"
          >
            Asosiy saytga qaytish
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
