import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen surface-base">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Top Bar */}
        <header className="h-16 px-6 flex items-center justify-between surface-low">
          <h1 className="section-title">Dashboard</h1>

          {/* Right side (status / profile placeholder) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span className="pulse"></span>
              Live
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 surface-base">{children}</main>
      </div>
    </div>
  );
}
