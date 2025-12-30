"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-red-600 to-red-700",
      activeCheck: (path: string) => path === "/admin/dashboard"
    },
    {
      href: "/admin/movies",
      label: "Quản lý phim",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      color: "from-blue-600 to-blue-700",
      activeCheck: (path: string) => path?.startsWith("/admin/movies")
    },
    {
      href: "/admin/showtimes",
      label: "Suất chiếu",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-purple-600 to-purple-700",
      activeCheck: (path: string) => path?.startsWith("/admin/showtimes")
    },
    {
      href: "/admin/users",
      label: "Người dùng",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "from-green-600 to-green-700",
      activeCheck: (path: string) => path?.startsWith("/admin/users")
    },
    {
      href: "/admin/bookings",
      label: "Đặt vé",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      ),
      color: "from-yellow-600 to-orange-700",
      activeCheck: (path: string) => path?.startsWith("/admin/bookings")
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 via-black to-gray-900 border-r border-white/10 shadow-2xl z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div className="overflow-hidden">
                <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-500 bg-clip-text text-transparent whitespace-nowrap">
                  Admin Panel
                </h1>
                <p className="text-xs text-gray-500 whitespace-nowrap">Quản trị hệ thống</p>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = item.activeCheck(pathname || "");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-xl shadow-lg`}></div>
                    )}
                    <span className="relative flex-shrink-0">{item.icon}</span>
                    <span className="relative font-medium whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-white/10 p-3">
            {/* User Menu */}
            <div className="space-y-2">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="font-medium">Về trang chủ</span>
              </Link>
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>

            {/* User Info */}
            <div className="mt-3 flex items-center gap-3 px-3 py-3 bg-white/5 rounded-xl border border-white/10">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-red-600 to-orange-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
                  <span className="text-white font-bold text-sm">
                    {user?.fullName?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">{user?.fullName || "Admin"}</p>
                <p className="text-xs text-gray-400 truncate">Quản trị viên</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
