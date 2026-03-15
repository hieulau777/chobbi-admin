"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Boxes, ShieldAlert, Database, BookOpen } from "lucide-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RequireAdminAuth } from "@/components/RequireAdminAuth";

type AdminLayoutProps = {
  children: ReactNode;
};

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/catalog",
    label: "Catalog",
    icon: Boxes,
  },
  {
    href: "/admin/blacklist",
    label: "Blacklist",
    icon: ShieldAlert,
  },
  {
    href: "/admin/catalog/seed",
    label: "Data Seeder",
    icon: Database,
  },
  {
    href: "/admin/usage-guide/seller",
    label: "Hướng dẫn seller",
    icon: BookOpen,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RequireAdminAuth />
      <div className="min-h-screen bg-slate-950 text-slate-50 flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur-md hidden md:flex flex-col">
          <div className="h-16 px-6 flex items-center border-b border-slate-800">
            <span className="text-lg font-semibold tracking-tight text-indigo-400">
              Chobbi Admin
            </span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              let isActive = pathname === item.href;

              if (!isActive && item.href !== "/admin") {
                // Catalog: active cho /admin/catalog và các route con,
                // nhưng KHÔNG active khi đang ở /admin/catalog/seed
                if (item.href === "/admin/catalog") {
                  isActive =
                    pathname === "/admin/catalog" ||
                    (pathname.startsWith("/admin/catalog/") &&
                      !pathname.startsWith("/admin/catalog/seed"));
                } else {
                  // Các mục khác: chỉ cần prefix match bình thường
                  isActive = pathname.startsWith(item.href);
                }
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-indigo-600 text-slate-50"
                      : "text-slate-300 hover:bg-slate-800 hover:text-slate-50",
                  ].join(" ")}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-500">
            Back-office Dashboard
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="h-16 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <span className="text-base font-semibold text-indigo-400">
                Chobbi Admin
              </span>
            </div>

            <div className="flex-1 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Back-office • Marketplace
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>Env: Dev</span>
              </div>
            </div>
          </header>

          {/* Page body */}
          <main className="flex-1 px-4 md:px-8 py-6 bg-slate-950 overflow-auto">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </QueryClientProvider>
  );
}

