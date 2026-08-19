import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage, pick } from "@/lib/language";
import { Target, Eye, Heart, Shield, Users, Award, Quote } from "lucide-react";

async function getData() {
  try {
    const [settings, aboutContent, directorMsg, team] = await Promise.all([
      prisma.settings.findFirst(),
      prisma.aboutPageContent.findFirst(),
      prisma.directorMessage.findFirst({ where: { isActive: true } }),
      prisma.teamMember.findMany({ orderBy: { order: "asc" }, where: { isActive: true } }),
    ]);
    return { settings, aboutContent, directorMsg, team };
  } catch (error) {
    console.error("Failed to fetch about page data:", error);
    return { settings: null, aboutContent: null, directorMsg: null, team: [] };
  }
}

export default async function AboutPage() {
  const lang = await getLanguage();
  const t = (en: string | null | undefined, hi: string | null | undefined, fb = "") => pick(lang, en, hi, fb);
  const { settings, aboutContent, directorMsg, team } = await getData();

  const values = [
    { icon: Heart, titleEn: "Compassion", titleHi: "करुणा", descEn: "We serve with empathy and genuine care for every individual.", descHi: "हम हर व्यक्ति के प्रति सहानुभूति और सच्ची देखभाल के साथ सेवा करते हैं।" },
    { icon: Shield, titleEn: "Integrity", titleHi: "ईमानदारी", descEn: "We operate with transparency and accountability in everything we do.", descHi: "हम जो कुछ भी करते हैं, उसमें पारदर्शिता और जवाबदेही के साथ काम करते हैं।" },
    { icon: Users, titleEn: "Community", titleHi: "समुदाय", descEn: "We believe in the power of collective effort and grassroots action.", descHi: "हम सामूहिक प्रयास और जमीनी कार्रवाई की शक्ति में विश्वास करते हैं।" },
    { icon: Award, titleEn: "Excellence", titleHi: "उत्कृष्टता", descEn: "We strive for the highest quality in our programs and services.", descHi: "हम अपने कार्यक्रमों और सेवाओं में उच्चतम गुणवत्ता के लिए प्रयास करते हैं।" },
  ];

  const registrations = [
    { value: "1988", label: t("Founded", "स्थापित") },
    { value: "12A", label: t("Recognized", "मान्यता") },
    { value: "80G", label: t("Tax Exempted", "कर-मुक्त") },
    { value: "CSR-1", label: t("Registered", "पंजीकृत") },
  ];

  return (
    <>
      <Navbar />
      <section className="py-20 lg:py-28" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("About Us", "हमारे बारे में")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{t("Learn about our journey, mission, and the impact we create.", "हमारी यात्रा, मिशन और प्रभाव के बारे में जानें।")}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>{t("Our Story", "हमारी कहानी")}</span>
              <h2 className="text-3xl font-extrabold mt-3 mb-6 text-gray-900">{t("A Legacy of Service Since 1988", "1988 से सेवा की विरासत")}</h2>
              <div className="space-y-4 text-gray-800 leading-relaxed">
                <p>{t(aboutContent?.historyContent || `${settings?.ngoName || "Sardar Patel Shikshan Sansthan"} was founded with a vision to provide quality education and empower rural communities.`, aboutContent?.historyContentHi)}</p>
                <p>{t("Located in Prayagraj, Uttar Pradesh, we are a registered social organization actively working in education, social welfare, skill development, and rural empowerment.", "प्रयागराज, उत्तर प्रदेश में स्थित, हम शिक्षा, सामाजिक कल्याण, कौशल विकास और ग्रामीण सशक्तिकरण में सक्रिय रूप से काम करने वाला एक पंजीकृत सामाजिक संगठन हैं।")}</p>
                <p>{t("Our respected Chairperson laid the foundation with a commitment to serving society through education, and we continue to carry forward this vision of inclusive growth and sustainable development.", "हमारे माननीय अध्यक्ष ने शिक्षा के माध्यम से समाज की सेवा के प्रति प्रतिबद्धता के साथ इस नींव को रखा था, और हम समावेशी विकास और सतत विकास की इस दृष्टि को आगे ले जा रहे हैं।")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {registrations.map((item) => (
                <div key={item.value} className="rounded-2xl p-6 text-center shadow-sm border border-green-100 bg-white">
                  <p className="text-4xl font-extrabold" style={{ color: "var(--primary)" }}>{item.value}</p>
                  <p className="text-gray-800 text-sm font-medium mt-2">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-green-100">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--primary-15)" }}>
                <Target className="w-7 h-7" style={{ color: "var(--primary)" }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(aboutContent?.missionTitle || "Our Mission", aboutContent?.missionTitleHi)}</h3>
              <p className="text-gray-800 leading-relaxed">{t(aboutContent?.missionContent || "To create an educated, skilled, self-reliant, and socially responsible society.", aboutContent?.missionContentHi)}</p>
            </div>
            <div className="bg-white rounded-2xl p-10 shadow-sm border border-green-100">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ backgroundColor: "var(--primary-15)" }}>
                <Eye className="w-7 h-7" style={{ color: "var(--primary)" }} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t(aboutContent?.visionTitle || "Our Vision", aboutContent?.visionTitleHi)}</h3>
              <p className="text-gray-800 leading-relaxed">{t(aboutContent?.visionContent || "To build a society where science, technology, and traditional knowledge work together.", aboutContent?.visionContentHi)}</p>
            </div>
          </div>
        </div>
      </section>

      {directorMsg && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>{t("Leadership", "नेतृत्व")}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">{t(aboutContent?.directorMessageTitle || "Message from Director", aboutContent?.directorMessageTitleHi)}</h2>
            </div>
            <div className="bg-green-50/50 rounded-3xl border border-green-100 overflow-hidden shadow-sm">
              <div className="grid lg:grid-cols-5 gap-8 lg:gap-0 bg-white">
                {/* Message Section - Left side */}
                <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center order-2 lg:order-1">
                  <div>
                    <Quote className="w-12 h-12 text-green-200 mb-6" />
                    <p className="text-gray-800 text-xl lg:text-2xl leading-relaxed italic font-medium">&ldquo;{t(directorMsg.message, directorMsg.messageHi)}&rdquo;</p>
                    <div className="mt-8 border-t border-gray-100 pt-6">
                      <h3 className="text-2xl font-extrabold text-gray-900">{t(directorMsg.directorName, directorMsg.directorNameHi)}</h3>
                      <p className="text-lg font-semibold text-green-700 mt-1">{t(directorMsg.directorTitle, directorMsg.directorTitleHi)}</p>
                    </div>
                  </div>
                </div>
                
                {/* Photo Section - Right side */}
                <div className="lg:col-span-2 flex items-center justify-center p-8 lg:p-12 order-1 lg:order-2 bg-gray-50/50">
                  <div className="w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl relative group">
                    <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition duration-500 z-10" />
                    {directorMsg.photoUrl ? (
                      <img src={directorMsg.photoUrl} alt={directorMsg.directorName} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-50">
                        <span className="text-8xl font-bold text-green-700">{directorMsg.directorName?.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>{t("The People Behind Us", "हमारे पीछे के लोग")}</span>
              <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">{t(aboutContent?.teamTitle || "Our Team", aboutContent?.teamTitleHi)}</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member) => (
                <div key={member.id} className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group p-8 text-center">
                  <div className="w-32 h-32 rounded-full mx-auto overflow-hidden bg-gradient-to-br from-green-50 to-green-100 border-4 border-green-50 flex items-center justify-center mb-6">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <span className="text-5xl font-extrabold text-green-700">{member.name?.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{t(member.name, member.nameHi)}</h4>
                    <p className="text-sm font-medium text-green-700 mt-2">{t(member.designation, member.designationHi)}</p>
                    {member.bio && <p className="text-gray-600 text-sm leading-relaxed mt-4 line-clamp-3">{t(member.bio, member.bioHi)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--primary)" }}>{t("What Drives Us", "हमारी प्रेरणा")}</span>
            <h2 className="text-3xl font-extrabold mt-3 text-gray-900">{t("Our Core Values", "हमारे मूल मूल्य")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((val, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center shadow-sm group-hover:shadow-md transition" style={{ backgroundColor: "var(--primary-15)" }}>
                  <val.icon className="w-8 h-8" style={{ color: "var(--primary)" }} />
                </div>
                <h4 className="font-bold text-gray-900 mb-2 text-lg">{t(val.titleEn, val.titleHi)}</h4>
                <p className="text-gray-700 leading-relaxed">{t(val.descEn, val.descHi)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}