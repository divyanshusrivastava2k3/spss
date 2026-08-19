import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/manage/Sidebar";
import { MobileSidebar } from "@/components/manage/MobileSidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Leaf } from "lucide-react";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/manage/login");
  }

  return (
    <div className="h-full relative bg-green-50">
      {/* Sidebar */}
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="md:pl-72 min-h-screen flex flex-col">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-green-100 px-4 sm:px-6 py-4 shadow-sm">
          <div className="max-w-full mx-auto flex items-center justify-between">
            <div className="flex items-center min-w-0">
              <MobileSidebar />
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-green-600 uppercase tracking-wider font-medium truncate">
                  {session?.user?.name ? `Welcome, ${session.user.name}` : "Admin Dashboard"}
                </p>
                <h1 className="text-base sm:text-xl font-extrabold text-gray-900 mt-0.5 sm:mt-1 truncate">SPSS - RuralGro</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-all border border-green-100"
              >
                <Leaf className="w-4 h-4" />
                View Website
              </a>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {session?.user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
