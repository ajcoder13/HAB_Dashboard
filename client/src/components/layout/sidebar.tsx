"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Metrics", href: "/metrics" },
    { name: "Logs", href: "/logs" },
    { name: "API Status", href: "/api-status" },
  ];

  return (
    <aside className="w-64 surface-low p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-primary">HAB</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2 rounded-md text-sm transition
                ${
                  active
                    ? "surface-card text-primary"
                    : "text-on-surface-variant hover:surface-hover"
                }
              `}>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="text-xs text-on-surface-variant">v1.0.0</div>
    </aside>
  );
}
