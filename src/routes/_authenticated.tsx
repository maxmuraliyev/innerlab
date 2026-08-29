import { createFileRoute, Outlet, redirect, isRedirect, Link } from "@tanstack/react-router";
import { getMyAdminStatus, checkAndGenerateDailyStats, listNotifications, markNotificationAsRead } from "@/lib/admin.functions";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    if (typeof document === "undefined") return;
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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Generate daily stats if needed (runs once on mount)
    checkAndGenerateDailyStats().catch(console.error);

    // Fetch notifications
    const fetchNotifs = () => {
      listNotifications().then(setNotifications).catch(console.error);
    };
    
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleRead = async (id: string) => {
    try {
      await markNotificationAsRead({ data: { id }});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex min-h-screen bg-cream text-ink">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-ink/50 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-ink/10 bg-white p-6 transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-2xl font-bold">Inner Lab Admin</h2>
          <button className="md:hidden p-1" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            to="/admin"
            activeOptions={{ exact: true }}
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md px-3 py-2 text-sm hover:bg-cream [&.active]:bg-ink [&.active]:text-cream"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/articles"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md px-3 py-2 text-sm hover:bg-cream [&.active]:bg-ink [&.active]:text-cream"
          >
            Articles
          </Link>
          <Link
            to="/admin/subscribers"
            onClick={() => setIsSidebarOpen(false)}
            className="rounded-md px-3 py-2 text-sm hover:bg-cream [&.active]:bg-ink [&.active]:text-cream"
          >
            Subscribers
          </Link>
          <Link
            to="/"
            className="mt-8 rounded-md px-3 py-2 text-sm hover:bg-cream text-ink/60"
          >
            Back to main site
          </Link>
        </nav>
      </aside>

      <main className="flex-1 p-4 md:p-8 w-full max-w-full overflow-hidden">
        <div className="mb-6 flex items-center justify-between relative">
          <button className="md:hidden p-2 -ml-2 text-ink hover:text-green" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="ml-auto relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 rounded-full hover:bg-ink/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showDropdown && (
            <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-ink/10 bg-white shadow-lg overflow-hidden">
              <div className="border-b border-ink/10 bg-cream/30 px-4 py-3 font-semibold">
                Notifications
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-ink/50">No notifications yet</div>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id} 
                      className={`border-b border-ink/5 px-4 py-3 text-sm cursor-pointer transition-colors ${n.is_read ? 'opacity-60 bg-white' : 'bg-green/5 font-medium'}`}
                      onClick={() => !n.is_read && handleRead(n.id)}
                    >
                      <p className="font-semibold">{n.title}</p>
                      <p className="text-ink/80 mt-1 whitespace-pre-wrap">{n.message}</p>
                      <p className="text-ink/40 mt-2 text-[10px]">{new Date(n.created_at).toLocaleString('en-US')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
