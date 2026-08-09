"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { useTranslation } from "@/lib/translation-context";
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Users,
  Calendar,
  LogOut,
  ExternalLink,
  PenTool,
  MessageSquare,
  Shield,
  BookOpen,
  Leaf,
} from "lucide-react";
import { signOut } from "next-auth/react";

const routes = [
  {
    labelKey: "admin.sidebar.dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    labelKey: "admin.sidebar.home",
    icon: Leaf,
    href: "/admin/dashboard/home",
    gradient: "from-green-600 to-lime-600",
  },
  {
    labelKey: "admin.sidebar.about",
    icon: BookOpen,
    href: "/admin/dashboard/about",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    labelKey: "admin.sidebar.partners",
    icon: Users,
    href: "/admin/dashboard/partners",
    gradient: "from-green-500 to-teal-600",
  },
  {
    labelKey: "admin.sidebar.programs",
    icon: Calendar,
    href: "/admin/dashboard/programs",
    gradient: "from-emerald-500 to-green-600",
  },
  {
    labelKey: "admin.sidebar.blog",
    icon: BookOpen,
    href: "/admin/dashboard/blog",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    labelKey: "admin.sidebar.team",
    icon: Users,
    href: "/admin/dashboard/team",
    gradient: "from-lime-500 to-green-600",
  },
  {
    labelKey: "admin.sidebar.director",
    icon: MessageSquare,
    href: "/admin/dashboard/director",
    gradient: "from-green-600 to-emerald-700",
  },
  {
    labelKey: "admin.sidebar.gallery",
    icon: ImageIcon,
    href: "/admin/dashboard/gallery",
    gradient: "from-amber-500 to-lime-600",
  },
  {
    labelKey: "admin.sidebar.settings",
    icon: Settings,
    href: "/admin/dashboard/settings",
    gradient: "from-green-700 to-teal-700",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { settings } = useSettings();
  const { t } = useTranslation();
  const ngoName = settings?.ngoName || "NGO Admin";
  const logoUrl = settings?.logoUrl;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-green-950 via-green-900 to-green-950 text-white">
      {/* Logo */}
      <div className="p-6 pb-2 border-b border-green-800">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-contain" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-green-500/25">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{ngoName}</h1>
            <p className="text-[11px] text-green-300">{t("admin.sidebar.controlPanel") || "Control Panel"}</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400 px-3 mb-3">
          {t("admin.sidebar.navigation") || "Navigation"}
        </p>
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-white shadow-lg shadow-green-500/20"
                  : "text-green-300 hover:text-white hover:bg-green-800/30"
              )}
              style={isActive ? {
                background: "linear-gradient(135deg, rgba(22, 101, 52, 0.4), rgba(21, 128, 61, 0.4))",
                backdropFilter: "blur(10px)",
              } : {}}
            >
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                isActive ? `bg-gradient-to-br ${route.gradient} shadow-md` : "bg-green-800/30"
              )}>
                <route.icon className="w-4 h-4" />
              </div>
              <span>{t(route.labelKey)}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shadow-sm shadow-green-400/50" />}
            </Link>
          );
        })}
      </div>

      {/* Visit Website */}
      <div className="px-4 mb-3">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-green-300 hover:text-white hover:bg-green-800/30 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          {t("admin.sidebar.viewSite") || "View Website"}
        </a>
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-green-800">
        <button
          onClick={() => signOut()}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          {t("admin.sidebar.logout") || "Logout"}
        </button>
      </div>
    </div>
  );
};