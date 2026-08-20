"use client";

import Link from "next/link";
import { Heart, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { useSettings } from "@/lib/settings-context";
import { useTranslation } from "@/lib/translation-context";

export const Footer = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();

  const ngoName = settings?.ngoName || "NGO";
  const logoUrl = settings?.logoUrl;
  const aboutText = settings?.aboutText;
  const address = settings?.address;
  const email = settings?.contactEmail;
  const phone = settings?.contactPhone;

  return (
    <footer className="text-[var(--secondary-fg)]" style={{ backgroundColor: "var(--secondary)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-xl object-contain flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
              )}
              <span className="font-bold text-lg text-white">{ngoName}</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-3">
              {/* Instagram */}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center hover:opacity-90 transition hover:scale-110 shadow-lg"
                  title="Instagram"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {/* Facebook */}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1877F2] flex items-center justify-center hover:bg-[#166FE5] transition hover:scale-110 shadow-lg"
                  title="Facebook"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {/* Twitter / X */}
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-black flex items-center justify-center hover:bg-gray-900 transition hover:scale-110 shadow-lg"
                  title="X (Twitter)"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {/* YouTube */}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#FF0000] flex items-center justify-center hover:bg-[#E60000] transition hover:scale-110 shadow-lg"
                  title="YouTube"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.547 12 3.547 12 3.547s-7.505 0-9.377.503a3.015 3.015 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.503 9.376.503 9.376.503s7.505 0 9.377-.503a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {/* WhatsApp */}
              {settings?.contactPhone && (
                <a
                  href={`https://wa.me/${settings.contactPhone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center hover:bg-[#1DA851] transition hover:scale-110 shadow-lg"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.13.552 4.143 1.543 5.918L0 24l6.23-1.614A11.967 11.967 0 0 0 12.031 24c6.646 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm6.491 17.202c-.26.732-1.517 1.4-2.102 1.472-.533.064-1.222.183-3.987-.962-3.351-1.385-5.526-4.806-5.69-5.025-.164-.22-1.357-1.803-1.357-3.439 0-1.637.848-2.443 1.15-2.756.3-.314.654-.393.873-.393.22 0 .438-.002.632.007.204.01.478-.078.747.57.27.649.92 2.247.999 2.405.08.157.133.342.025.557-.107.215-.164.351-.326.545-.163.193-.342.418-.49.57-.164.167-.336.353-.146.68.19.325.845 1.39 1.815 2.253 1.253 1.115 2.296 1.46 2.624 1.617.327.157.518.132.712-.088.194-.22 .836-.974 1.058-1.308.222-.335.443-.28.736-.17.294.11 1.854.873 2.17 1.031.316.157.527.235.603.366.077.131.077.76-.183 1.492z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg text-white mb-5">{t("footer.quickLinks")}</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li><Link href="/about" className="hover:text-white transition flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("nav.about")}</Link></li>
              <li><Link href="/partners" className="hover:text-white transition flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("nav.partners")}</Link></li>
              <li><Link href="/programs" className="hover:text-white transition flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("nav.programs")}</Link></li>
              <li><Link href="/blog" className="hover:text-white transition flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("nav.blog")}</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("nav.gallery")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("nav.contact")}</Link></li>
              <li><Link href="/donate" className="hover:text-white transition flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("common.donate")}</Link></li>
            </ul>
          </div>

          {/* Focus */}
          <div>
            <h3 className="font-bold text-lg text-white mb-5">Our Focus</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-2">🎓 Education &amp; Vedic Learning</li>
              <li className="flex items-center gap-2">🧵 Skill Development</li>
              <li className="flex items-center gap-2">👩 Rural Empowerment</li>
              <li className="flex items-center gap-2">🏗️ Livelihood Programs</li>
              <li className="flex items-center gap-2">🎨 Artisan Support</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg text-white mb-5">Contact Info</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{address || "Prayagraj, Uttar Pradesh"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{phone || "+91 8957519313"}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>{email || "info@spss.org"}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-white/60">
            <p>&copy; {new Date().getFullYear()} {ngoName}. {t("footer.rights")}</p>
            <p>Registered under Societies Registration Act, 1860</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
