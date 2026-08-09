import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage, pick } from "@/lib/language";
import { translations } from "@/lib/translations";
import { Users, ExternalLink, Leaf } from "lucide-react";

async function getPartners() {
  try {
    return await prisma.partner.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }], where: { isActive: true } });
  } catch (error) {
    console.error("Failed to fetch partners:", error);
    return [];
  }
}

const categoryLabels: Record<string, { en: string; hi: string }> = {
  government: { en: "Government", hi: "सरकार" },
  corporate: { en: "Corporate", hi: "कॉर्पोरेट" },
  ngo: { en: "NGO", hi: "एनजीओ" },
  academic: { en: "Academic", hi: "शैक्षणिक" },
  general: { en: "General", hi: "सामान्य" },
};

export default async function PartnersPage() {
  const lang = await getLanguage();
  const t = (key: string) => translations[key]?.[lang] || translations[key]?.en || key;
  const partners = await getPartners();

  const grouped = new Map<string, typeof partners>();
  for (const p of partners) {
    const cat = p.category || "general";
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(p);
  }

  return (
    <>
      <Navbar />
      <section className="py-20 lg:py-28" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-6"><Users className="w-8 h-8 text-white" /></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("partners.hero.title")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{t("partners.hero.subtitle")}</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {partners.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-green-200">
              <Users className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t("partners.comingSoon")}</p>
            </div>
          ) : (
            <div className="space-y-16">
              {Array.from(grouped.entries()).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="flex-1 h-px bg-green-100" />
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 px-4">{categoryLabels[category]?.[lang] || categoryLabels[category]?.en || category}</h2>
                    <div className="flex-1 h-px bg-green-100" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((partner) => (
                      <div key={partner.id} className="group bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 p-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mb-5 overflow-hidden group-hover:scale-105 transition-transform">
                          {partner.logoUrl ? (<img src={partner.logoUrl} alt={partner.name} className="w-full h-full object-contain p-2" />) : (<Leaf className="w-10 h-10 text-green-400" />)}
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{pick(lang, partner.name, partner.nameHi, partner.name)}</h3>
                        {partner.description && <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{pick(lang, partner.description, partner.descriptionHi, partner.description)}</p>}
                        {partner.websiteUrl && <a href={partner.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium mt-auto text-green-700 hover:text-green-800 transition">{t("partners.visitWebsite")} <ExternalLink className="w-3.5 h-3.5" /></a>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="py-16 bg-green-50 border-t border-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">{t("partners.cta.title")}</h2>
          <p className="text-gray-700 text-lg mb-8">{t("partners.cta.subtitle")}</p>
          <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all" style={{ backgroundColor: "var(--primary)" }}>{t("partners.cta.button")}</a>
        </div>
      </section>
      <Footer />
    </>
  );
}