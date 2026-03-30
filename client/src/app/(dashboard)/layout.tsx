import { Navbar } from "@/components/layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen surface-base">
      {/* Navbar — replaces sidebar */}
      <Navbar />

      {/* Page content — no left padding needed anymore */}
      <main className="flex-1 surface-base">{children}</main>
    </div>
  );
}
