import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage } from "@/lib/language";
import { translations } from "@/lib/translations";
import GalleryGrid from "./GalleryGrid";

async function getGallery() {
  try {
    return await prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" }, where: { isActive: true } });
  } catch (error) {
    console.error("Failed to fetch gallery images:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const lang = await getLanguage();
  const t = (key: string) => translations[key]?.[lang] || translations[key]?.en || key;
  const items = await getGallery();
  const categories = ["All", ...new Set(items.map((i) => i.category).filter(Boolean))];

  return (
    <>
      <Navbar />
      <section className="py-20 lg:py-28" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("gallery.hero.title")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{t("gallery.hero.subtitle")}</p>
        </div>
      </section>
      <GalleryGrid items={items} categories={categories as string[]} />
      <Footer />
    </>
  );
}