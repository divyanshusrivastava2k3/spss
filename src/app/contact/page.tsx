import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage, pick } from "@/lib/language";
import { translations } from "@/lib/translations";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import ContactForm from "./ContactForm";

async function getData() {
  try {
    return await prisma.settings.findFirst();
  } catch (error) {
    console.error("Failed to fetch contact page settings:", error);
    return null;
  }
}

export default async function ContactPage() {
  const lang = await getLanguage();
  const t = (key: string) => translations[key]?.[lang] || translations[key]?.en || key;
  const settings = await getData();

  const contactInfo = [
    { icon: MapPin, titleKey: "contact.info.address", details: [pick(lang, settings?.address || "Prayagraj, Uttar Pradesh", settings?.addressHi)] },
    { icon: Phone, titleKey: "contact.info.phone", details: [settings?.contactPhone || "+91 8957519313"] },
    { icon: Mail, titleKey: "contact.info.email", details: [settings?.contactEmail || "info@spss.org"] },
    { icon: Clock, titleKey: "contact.info.hours", details: [t("contact.info.monFri"), t("contact.info.sun")] },
  ];

  return (
    <>
      <Navbar />
      <section className="py-20 lg:py-28" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-6"><MessageCircle className="w-8 h-8 text-white" /></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("contact.hero.title")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{t("contact.hero.subtitle")}</p>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              {contactInfo.map((info, i) => (
                <div key={i} className="flex items-start gap-5 p-6 bg-white rounded-2xl shadow-sm border border-green-100 hover:shadow-md hover:border-green-200 transition">
                  <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--primary-15)" }}>
                    <info.icon className="w-5 h-5" style={{ color: "var(--primary)" }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{t(info.titleKey)}</h3>
                    {info.details.map((d, j) => <p key={j} className="text-gray-700">{d}</p>)}
                  </div>
                </div>
              ))}
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
                <p className="text-gray-800 font-semibold mb-2">🌱 {t("contact.info.title")}</p>
                <p className="text-gray-700 text-sm leading-relaxed">{t("footer.tagline")}</p>
              </div>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}