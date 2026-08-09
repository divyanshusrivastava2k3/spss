"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Calendar, Image as ImageIcon, Settings, ArrowRight, Leaf, BookOpen, MessageSquare, Shield } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/translation-context";

interface Stats {
  partners: number;
  programs: number;
  blogPosts: number;
  gallery: number;
  teamMembers: number;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [stats, setStats] = useState<Stats>({
    partners: 0,
    programs: 0,
    blogPosts: 0,
    gallery: 0,
    teamMembers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [partners, programs, blogPosts, gallery, teamMembers] = await Promise.all([
          axios.get("/api/partners").catch(() => ({ data: [] })),
          axios.get("/api/programs").catch(() => ({ data: [] })),
          axios.get("/api/blog").catch(() => ({ data: [] })),
          axios.get("/api/gallery").catch(() => ({ data: [] })),
          axios.get("/api/team").catch(() => ({ data: [] })),
        ]);
        setStats({
          partners: partners.data?.length || 0,
          programs: programs.data?.length || 0,
          blogPosts: blogPosts.data?.length || 0,
          gallery: gallery.data?.length || 0,
          teamMembers: teamMembers.data?.length || 0,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      titleKey: "admin.dashboard.stats.partners",
      value: stats.partners,
      icon: Users,
      gradient: "from-green-500 to-emerald-600",
      href: "/admin/dashboard/partners",
    },
    {
      titleKey: "admin.dashboard.stats.programs",
      value: stats.programs,
      icon: Calendar,
      gradient: "from-emerald-500 to-green-600",
      href: "/admin/dashboard/programs",
    },
    {
      titleKey: "admin.dashboard.stats.blogPosts",
      value: stats.blogPosts,
      icon: BookOpen,
      gradient: "from-teal-500 to-cyan-600",
      href: "/admin/dashboard/blog",
    },
    {
      titleKey: "admin.dashboard.stats.gallery",
      value: stats.gallery,
      icon: ImageIcon,
      gradient: "from-amber-500 to-lime-600",
      href: "/admin/dashboard/gallery",
    },
    {
      titleKey: "admin.dashboard.stats.teamMembers",
      value: stats.teamMembers,
      icon: Shield,
      gradient: "from-lime-500 to-green-600",
      href: "/admin/dashboard/team",
    },
  ];

  const quickActions = [
    { titleKey: "admin.dashboard.actions.addPartner", href: "/admin/dashboard/partners", icon: Users, color: "bg-green-500" },
    { titleKey: "admin.dashboard.actions.addProgram", href: "/admin/dashboard/programs", icon: Calendar, color: "bg-emerald-500" },
    { titleKey: "admin.dashboard.actions.addBlogPost", href: "/admin/dashboard/blog", icon: BookOpen, color: "bg-teal-500" },
    { titleKey: "admin.dashboard.actions.addTeamMember", href: "/admin/dashboard/team", icon: Shield, color: "bg-lime-500" },
    { titleKey: "admin.dashboard.actions.uploadGallery", href: "/admin/dashboard/gallery", icon: ImageIcon, color: "bg-amber-500" },
    { titleKey: "admin.dashboard.actions.directorMessage", href: "/admin/dashboard/director", icon: MessageSquare, color: "bg-green-600" },
    { titleKey: "admin.dashboard.actions.settings", href: "/admin/dashboard/settings", icon: Settings, color: "bg-green-700" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl p-8 text-white" style={{ background: "linear-gradient(135deg, #166534 0%, #15803d 50%, #16a34a 100%)" }}>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -right-5 -bottom-5 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <Leaf className="absolute top-10 right-10 w-20 h-20 opacity-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-5 h-5 text-green-200" />
            <span className="text-sm text-white/80">{t("admin.dashboard.welcome")}</span>
          </div>
          <h2 className="text-3xl font-extrabold mb-2">{t("admin.dashboard.title")}</h2>
          <p className="text-white/70 max-w-lg">{t("admin.dashboard.subtitle")}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {cards.map((card) => (
          <Link
            key={card.titleKey}
            href={card.href}
            className="group bg-white rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-200 group-hover:text-green-400 transition">
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">
              {loading ? "..." : card.value}
            </p>
            <p className="text-sm text-gray-500">{t(card.titleKey)}</p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-green-600" />
          {t("admin.dashboard.quickActions")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.titleKey}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-200 hover:shadow-md hover:bg-green-50 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center shadow-sm`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 group-hover:text-green-600 transition">{t(action.titleKey)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}