export const dynamic = 'force-dynamic';

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage, pick } from "@/lib/language";
import Link from "next/link";
import { ArrowRight, Users, GraduationCap, Heart, HandHeart, CheckCircle2 } from "lucide-react";
import HeroSlider from "@/components/HeroSlider";
import { FadeIn } from "@/components/ui/FadeIn";
import { PdfFlipbook } from "@/components/ui/PdfFlipbook";
import "./globals.css";

async function getData() {
  try {
    const [settings, partners, programs, posts, homeContent] = await Promise.all([
      prisma.settings.findFirst(),
      prisma.partner.findMany({ take: 8, orderBy: { order: "asc" }, where: { isActive: true } }),
      prisma.program.findMany({ take: 3, orderBy: { startDate: "asc" }, where: { isActive: true } }),
      prisma.blogPost.findMany({ take: 3, orderBy: { publishedAt: "desc" }, where: { isPublished: true } }),
      prisma.homePageContent.findFirst(),
    ]);
    return { settings, partners, programs, posts, homeContent };
  } catch (error) {
    console.error("Failed to fetch home page data:", error);
    return { settings: null, partners: [], programs: [], posts: [], homeContent: null };
  }
}

export default async function Home() {
  const lang = await getLanguage();
  const t = (en: string | null | undefined, hi: string | null | undefined, fb = "") => pick(lang, en, hi, fb);
  const { settings, partners, programs, posts, homeContent } = await getData();

  const lightGrad = `linear-gradient(135deg, var(--primary-10) 0%, var(--secondary-15) 100%)`;
  const heroGrad = `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`;
  
  // Removed demo images
  const defaultHeroImages: string[] = [];
  
  let heroImages = [homeContent?.heroImage1, homeContent?.heroImage2, homeContent?.heroImage3].filter(Boolean) as string[];
  if (heroImages.length === 0) heroImages = defaultHeroImages;

  // HERO - t(english, hindi, fallback)
  const heroTitle = t(
    homeContent?.heroTitle || "Building a Better Tomorrow for Everyone", 
    homeContent?.heroTitleHi || "सभी के लिए एक बेहतर कल का निर्माण"
  );
  const heroSubtitle = t(
    homeContent?.heroSubtitle || "Dedicated to holistic development through education, skill development, and rural empowerment.", 
    homeContent?.heroSubtitleHi || "शिक्षा, कौशल विकास और ग्रामीण सशक्तिकरण के माध्यम से समग्र विकास के लिए समर्पित।"
  );
  const heroCtaText = t(
    homeContent?.heroCtaText || "Our Programs", 
    homeContent?.heroCtaTextHi || "हमारे कार्यक्रम"
  );
  const partnersLabel = t("Our Partners", "सभी साझेदार देखें") || "Our Partners";
  const tagline = t("Since 1988 • Empowering Communities", "1988 से • समुदायों को सशक्त बनाना") || "Since 1988 • Empowering Communities";

  // STATS
  const stats = [
    { icon: Users, label: t("People Helped", homeContent?.statsLabel1Hi), value: homeContent?.statsValue1 || "15,000+" },
    { icon: GraduationCap, label: t("Trainings Conducted", homeContent?.statsLabel2Hi), value: homeContent?.statsValue2 || "500+" },
    { icon: Heart, label: t("Years of Service", homeContent?.statsLabel3Hi), value: homeContent?.statsValue3 || "35+" },
    { icon: HandHeart, label: t("Volunteers", homeContent?.statsLabel4Hi), value: homeContent?.statsValue4 || "250+" },
  ];

  const ctaCardLink = homeContent?.ctaCardLink || "/contact";
  
  // Removed demo images
  const defaultAboutImage = "";
  const defaultProgramImages: string[] = [];
  const defaultBlogImages: string[] = [];

  return (
    <>
      <Navbar />
      <HeroSlider images={heroImages} title={heroTitle} subtitle={heroSubtitle} ctaText={heroCtaText} partnersLabel={partnersLabel} tagline={tagline} />

      {/* STATS */}
      <section className="py-16 bg-white relative -mt-10 z-10 mx-4 sm:mx-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-gray-100">
            {stats.map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1} className="text-center px-4">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center bg-[var(--primary-10)] transition-transform hover:scale-110 duration-300">
                  <stat.icon className="w-7 h-7" style={{ color: "var(--primary)" }} />
                </div>
                <p className="text-4xl font-extrabold mb-1 bg-clip-text text-transparent" style={{ backgroundImage: heroGrad }}>
                  {stat.value}
                </p>
                <p className="text-gray-600 text-sm font-semibold tracking-wide uppercase">{stat.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <FadeIn className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary-10)] text-[var(--primary)] text-sm font-bold uppercase tracking-wider mb-6">
                <Heart className="w-4 h-4" />
                {t("About Us", "हमारे बारे में")}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                {t("Empowering Society Through Education & Skill", "शिक्षा और कौशल के माध्यम से समाज को सशक्त बनाना")}
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {t(homeContent?.aboutSnippet || settings?.aboutText?.split("\n")[0] || "We are a registered social organization actively working in education, skill development, and rural empowerment to build a brighter and more equitable future.", homeContent?.aboutSnippetHi || settings?.aboutTextHi?.split("\n")[0] || "हम शिक्षा, कौशल विकास और ग्रामीण सशक्तिकरण में सक्रिय रूप से काम करने वाला एक पंजीकृत सामाजिक संगठन हैं।")}
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  t("Access to Quality Education", "गुणवत्तापूर्ण शिक्षा तक पहुंच"),
                  t("Skill Development Programs", "कौशल विकास कार्यक्रम"),
                  t("Rural Empowerment", "ग्रामीण सशक्तिकरण")
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/about" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300" style={{ backgroundImage: heroGrad }}>
                {t("Discover Our Journey", "हमारी यात्रा खोजें")} <ArrowRight className="w-5 h-5" />
              </Link>
            </FadeIn>
            
            <FadeIn delay={0.2} className="relative w-full lg:col-span-7">
              <div className="relative group bg-transparent w-full">
                {homeContent?.flipbookPdfUrl && (
                  <div className="w-full h-auto min-h-[400px]">
                    <PdfFlipbook pdfUrl={homeContent.flipbookPdfUrl} />
                  </div>
                )}
              </div>
              <div className="absolute -top-8 -left-4 md:-top-10 md:-left-12 bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100 flex items-center gap-4 md:gap-6 z-30 animate-bounce-slow">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-[var(--primary-10)]">
                  <CheckCircle2 className="w-8 h-8 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-4xl font-extrabold text-gray-900">80G</p>
                  <p className="text-gray-500 font-medium">{t("Tax Exempted", "कर-मुक्त")}</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full bg-[var(--primary-10)] text-[var(--primary)] text-sm font-bold uppercase tracking-wider mb-4">
              {t("Training & Development", "प्रशिक्षण और विकास")}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">{t("Our Impactful Programs", "हमारे कार्यक्रम")}</h2>
            <p className="text-gray-600 text-lg">We believe in taking actionable steps towards a sustainable future through our carefully curated programs designed to uplift communities.</p>
          </FadeIn>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {(programs.length > 0 ? programs : [
              { id: '1', title: 'Digital Literacy for Rural Youth', description: 'Empowering the next generation with essential computer skills and internet literacy.', imageUrl: defaultProgramImages[0], startDate: new Date() },
              { id: '2', title: 'Women Skill Development', description: 'Vocational training programs focusing on tailoring, handicrafts, and entrepreneurship.', imageUrl: defaultProgramImages[1], startDate: new Date() },
              { id: '3', title: 'Sustainable Agriculture', description: 'Training farmers in organic farming techniques to increase yield and protect the environment.', imageUrl: defaultProgramImages[2], startDate: new Date() }
            ]).map((program, i) => (
              <FadeIn key={program.id} delay={i * 0.1}>
                <Link href="/programs" className="break-inside-avoid inline-block w-full mb-8 bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group">
                  <div className="relative overflow-hidden">
                    {(program.imageUrl || defaultProgramImages[i % 3]) ? (
                      <img src={program.imageUrl || defaultProgramImages[i % 3]} alt={program.title} className="w-full h-auto object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition duration-300" />
                    {program.startDate && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                        {new Date(program.startDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[var(--primary)] transition-colors">{t(program.title, (program as any).titleHi, program.title)}</h3>
                    <p className="text-gray-600 leading-relaxed line-clamp-3 mb-6">{t(program.description, (program as any).descriptionHi, program.description)}</p>
                    <div className="inline-flex items-center gap-2 text-[var(--primary)] font-semibold group-hover:gap-4 transition-all">
                      Read More <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <FadeIn delay={0.4} className="text-center mt-12">
            <Link href="/programs" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all">
              {t("Explore All Programs", "सभी कार्यक्रम देखें")} <ArrowRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* PARTNERS */}
      {partners.length > 0 && (
        <section className="py-20 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <FadeIn className="text-center">
              <span className="text-sm font-bold uppercase tracking-wider text-gray-500">{t("Our Partners", "साझेदार")}</span>
              <h2 className="text-3xl font-extrabold mt-2 text-gray-900">{t("Trusted Collaborations", "विश्वसनीय सहयोग")}</h2>
            </FadeIn>
          </div>
          <div className="relative">
            <div className="flex gap-12 overflow-x-auto px-8 pb-8 no-scrollbar scroll-smooth snap-x">
              {partners.map((partner) => (
                <div key={partner.id} className="snap-center flex-shrink-0 w-48 flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow grayscale hover:grayscale-0">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="h-16 w-auto object-contain mb-4" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border-2 border-gray-100 flex items-center justify-center mb-4">
                      <span className="font-bold text-gray-400 text-xl">{partner.name?.charAt(0)}</span>
                    </div>
                  )}
                  <p className="text-sm font-semibold text-gray-600 text-center line-clamp-2">{t(partner.name, partner.nameHi, partner.name)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${(homeContent as any)?.ctaBackgroundImage || 'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&q=80&w=2000'}')` }} />
        <div className="absolute inset-0 bg-[var(--primary)] mix-blend-multiply opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{t(homeContent?.ctaTitle, homeContent?.ctaTitleHi)}</h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium">{t(homeContent?.ctaSubtitle, homeContent?.ctaSubtitleHi)}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link href="/contact" className="inline-flex justify-center items-center gap-2 bg-white text-[var(--primary)] px-8 py-4 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 transition-all duration-300">
              {t(homeContent?.ctaPrimaryText, homeContent?.ctaPrimaryTextHi)}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/programs" className="inline-flex justify-center items-center gap-2 bg-[var(--secondary)] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-green-800 hover:scale-105 transition-all duration-300">
              {t(homeContent?.ctaSecondaryText, homeContent?.ctaSecondaryTextHi)}
            </Link>
          </div>
        </div>
      </section>

      {/* JOIN THE MOVEMENT CARDS */}
      <section className="py-16 bg-white relative -mt-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: homeContent?.ctaCard1Title || "Support Our Work",
                titleHi: homeContent?.ctaCard1TitleHi || "हमारे काम का समर्थन करें",
                desc: homeContent?.ctaCard1Desc || "Your donation empowers lives.",
                descHi: homeContent?.ctaCard1DescHi || "आपका दान जीवन को सशक्त बनाता है।",
                image: homeContent?.ctaCard1Image || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: homeContent?.ctaCard2Title || "Volunteer With Us",
                titleHi: homeContent?.ctaCard2TitleHi || "हमारे साथ स्वयंसेवा करें",
                desc: homeContent?.ctaCard2Desc || "Contribute your time and skills.",
                descHi: homeContent?.ctaCard2DescHi || "अपना समय और कौशल दें।",
                image: homeContent?.ctaCard2Image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800"
              },
              {
                title: homeContent?.ctaCard3Title || "Become a Partner",
                titleHi: homeContent?.ctaCard3TitleHi || "साझेदार बनें",
                desc: homeContent?.ctaCard3Desc || "Collaborate for rural development.",
                descHi: homeContent?.ctaCard3DescHi || "ग्रामीण विकास के लिए सहयोग करें",
                image: homeContent?.ctaCard3Image || "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800"
              }
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Link href={ctaCardLink} className="block group relative rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-64">
                  <img src={card.image} alt={card.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-in-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[var(--primary)] transition-colors">{t(card.title, card.titleHi)}</h3>
                    <p className="text-gray-200 text-sm">{t(card.desc, card.descHi)}</p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Blog/News Snippet */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-bold uppercase tracking-wider text-[var(--primary)]">{t("Our Impact", "हमारा प्रभाव")}</span>
            <h2 className="text-3xl md:text-5xl font-extrabold mt-3 text-gray-900">{t("Latest Updates & Stories", "नवीनतम अपडेट और कहानियाँ")}</h2>
          </div>
          
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
            {(posts.length > 0 ? posts : ([
              { id: '1', slug: 'empowering-women', title: 'Empowering Women Through Skill Development', excerpt: 'Discover how our recent workshop helped 50 women start their own small businesses.', featuredImage: defaultBlogImages[0], author: 'Admin', publishedAt: new Date() },
              { id: '2', slug: 'annual-report', title: 'Impact Report 2025: A Year of Growth', excerpt: 'Read about our achievements and the communities we reached this past year.', featuredImage: defaultBlogImages[1], author: 'Admin', publishedAt: new Date() },
              { id: '3', slug: 'youth-leadership', title: 'Youth Leadership Camp Highlights', excerpt: 'Our 3-day camp focused on building leadership qualities in rural youth.', featuredImage: defaultBlogImages[2], author: 'Admin', publishedAt: new Date() }
            ] as any[])).map((post, i) => (
              <FadeIn key={post.id} delay={i * 0.1}>
                <Link href={`/blog/${post.slug}`} className="break-inside-avoid inline-block w-full mb-8 bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                  <div className="overflow-hidden relative">
                    {(post.featuredImage || defaultBlogImages[i % 3]) ? (
                      <img src={post.featuredImage || defaultBlogImages[i % 3]} alt={post.title} className="w-full h-auto object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200" />
                    )}
                  </div>
                  <div className="p-8">
                    {post.category && <span className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block bg-[var(--primary-10)] text-[var(--primary)] tracking-wide uppercase">{t(post.category, (post as any).categoryHi)}</span>}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition">{t(post.title, (post as any).titleHi)}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">{t(post.excerpt, (post as any).excerptHi)}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-sm text-gray-500 font-medium">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                          {post.author?.charAt(0) || "A"}
                        </div>
                        {t(post.author || "Admin", (post as any).authorHi)}
                      </div>
                      {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>}
                    </div>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link href="/blog" className="inline-flex items-center gap-2 font-semibold text-[var(--primary)]">
              View All News <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}