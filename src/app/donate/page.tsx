import { Navbar } from @/components/layout/Navbar;
import { Footer } from @/components/layout/Footer;
import prisma from @/lib/prisma;
import { getLanguage } from @/lib/language;
import { translations } from @/lib/translations;
import { Heart, Building2, Smartphone, CreditCard } from "lucide-react";

async function getSettings() {
  try {
    return await prisma.settings.findFirst() || null;
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return null;
  }
}

export default async function DonatePage() {
  const settings = await getSettings();
  const lang = await getLanguage();
  const t = (key: string) => translations[key as keyof typeof translations]?.[lang as "en" | "hi"] || translations[key as keyof typeof translations]?.en || key;
  const { pick } = await import("@/lib/language");
  const tText = (en: string | null | undefined, hi: string | null | undefined, fb = " ") => pick(lang, en, hi, fb);

  const title = settings ? tText(settings.donationTitle, settings.donationTitleHi, "Support Our Cause") : t("donate.title");
  const description = settings ? tText(settings.donationDescription, settings.donationDescriptionHi, "Your contribution helps us create a lasting impact in rural communities.") : t("donate.subtitle");

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-28 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <div className="absolute inset-0 bg-black/10 z-0"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur shadow-lg mb-8">
            <Heart className="w-10 h-10 text-white fill-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed">
            {description}
          </p>
        </div>
      </section>

      {/* Donation Details Section */}
      <section className="py-16 -mt-10 relative z-20 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* QR Code Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full transform transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg"><Smartphone className="w-6 h-6 text-green-700" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">{t("donate.scan")}</h2>
                </div>
              </div>
              <div className="p-10 flex flex-col items-center justify-center flex-1 bg-white">
                {settings?.donationQrCodeUrl ? (
                  <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100">
                    <img src={settings.donationQrCodeUrl} alt="Donation QR Code" className="w-64 h-64 object-contain rounded-xl" />
                  </div>
                ) : (
                  <div className="w-64 h-64 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400">
                    <CreditCard className="w-12 h-12 mb-3 opacity-50" />
                    <p className="text-sm font-medium">QR Code Not Available</p>
                  </div>
                )}
                {settings?.upiId && (
                  <div className="mt-8 text-center w-full">
                    <p className="text-sm text-gray-500 mb-1 uppercase tracking-wider font-semibold">{t("donate.upi")}</p>
                    <div className="bg-gray-50 py-3 px-6 rounded-xl border border-gray-200 text-lg font-bold text-gray-800 break-all">
                      {settings.upiId}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details Section */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col h-full transform transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg"><Building2 className="w-6 h-6 text-blue-700" /></div>
                  <h2 className="text-2xl font-bold text-gray-900">{t("donate.bankDetails")}</h2>
                </div>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center flex-1 space-y-6">
                <DetailRow label={t("donate.accountName")} value={settings?.bankAccountName} />
                <DetailRow label={t("donate.accountNumber")} value={settings?.bankAccountNumber} />
                <DetailRow label={t("donate.ifsc")} value={settings?.bankIfscCode} />
                <DetailRow label={t("donate.bankName")} value={settings?.bankName} />
                
                {(!settings?.bankAccountName && !settings?.bankAccountNumber) && (
                  <div className="text-center py-10 text-gray-400">
                    <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Bank details are currently unavailable.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
      <p className="text-sm text-gray-500 font-semibold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900 break-words">{value}</p>
    </div>
  );
}
