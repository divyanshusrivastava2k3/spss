"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { useTranslation } from "@/lib/translation-context";
import { LanguageToggle } from "./LanguageToggle";

// "Contact" is a CTA button (right), not a link in the list.
const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/partners", labelKey: "nav.partners" },
  { href: "/programs", labelKey: "nav.programs" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/gallery", labelKey: "nav.gallery" },
];

export const Navbar = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const ngoName = settings?.ngoName || "NGO";
  const logoUrl = settings?.logoUrl;

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-green-100">
      {/* Top strip */}
      <div className="text-white text-xs" style={{ background: "var(--primary)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between">
          <span className="text-white/90 font-medium">{t("nav.topStrip")}</span>
          <a href="/contact" className="text-white/90 hover:text-white underline underline-offset-2">
            {t("nav.contact")} →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-18 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group min-w-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl object-contain group-hover:scale-105 transition-transform flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0" style={{ backgroundColor: "var(--primary)" }}>
                <Heart className="w-6 h-6" />
              </div>
            )}
            <span className="font-bold text-sm sm:text-base lg:text-lg leading-tight truncate max-w-[150px] sm:max-w-none" style={{ color: "var(--primary)" }}>
              {ngoName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-[var(--primary-fg)] shadow-md"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                  }`}
                  style={isActive ? { backgroundColor: "var(--primary)" } : {}}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageToggle />
            <Link
              href="/donate"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-[var(--primary-fg)] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: "var(--accent, #e11d48)" }}
            >
              <Heart className="w-4 h-4" /> {t("common.donate")}
            </Link>
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-[var(--primary-fg)] shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {t("nav.contact")}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="xl:hidden p-2 rounded-lg hover:bg-green-50 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-green-100 bg-white shadow-lg absolute w-full left-0">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive ? "text-[var(--primary-fg)]" : "text-gray-600 hover:bg-green-50"
                  }`}
                  style={isActive ? { backgroundColor: "var(--primary)" } : {}}
                >
                  {t(link.labelKey)}
                </Link>
              );
            })}
            <Link
              href="/donate"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 mt-4 rounded-full text-sm font-semibold text-white text-center flex items-center justify-center gap-2 shadow-md"
              style={{ backgroundColor: "var(--accent, #e11d48)" }}
            >
              <Heart className="w-4 h-4" /> {t("common.donate")}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 mt-2 rounded-full text-sm font-semibold text-white text-center shadow-md"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};