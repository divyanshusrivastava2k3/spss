import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage } from "@/lib/language";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { BookOpen, Calendar, User, ArrowRight, ArrowLeft } from "lucide-react";

async function getPosts() {
  return await prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" } });
}

export default async function BlogPage() {
  const lang = await getLanguage();
  const t = (key: string) => translations[key]?.[lang] || translations[key]?.en || key;
  const { pick } = await import("@/lib/language");
  const tText = (en: string | null | undefined, hi: string | null | undefined, fb = "") => pick(lang, en, hi, fb);
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <>
      <Navbar />
      <section className="py-20 lg:py-28" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-6"><BookOpen className="w-8 h-8 text-white" /></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("blog.hero.title")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{t("blog.hero.subtitle")}</p>
        </div>
      </section>
      {featured && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-8 bg-white rounded-3xl border border-green-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                {featured.featuredImage ? (<img src={featured.featuredImage} alt={featured.title} className="w-full h-auto object-cover group-hover:scale-105 transition duration-500" />) : (<span className="text-7xl py-20">📖</span>)}
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide" style={{ backgroundColor: "var(--primary-15)", color: "var(--primary)" }}>{t("blog.featured")}</span>
                  {featured.category && <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">{tText(featured.category, featured.categoryHi, featured.category)}</span>}
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mb-4 group-hover:text-green-600 transition line-clamp-3">{tText(featured.title, featured.titleHi, featured.title)}</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 line-clamp-3">{tText(featured.excerpt, featured.excerptHi, featured.excerpt)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {t("blog.by")} {tText(featured.author || "Admin", featured.authorHi)}</span>
                    {featured.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{t("blog.on")} {new Date(featured.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>}
                  </div>
                  <span className="inline-flex items-center gap-2 font-semibold text-[var(--primary-fg)] px-5 py-2.5 rounded-full shadow-md group-hover:shadow-lg transition" style={{ backgroundColor: "var(--primary)" }}>{t("blog.readMore")} <ArrowRight className="w-4 h-4" /></span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {rest.length > 0 ? (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
              {rest.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="break-inside-avoid inline-block w-full mb-8 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
                  <div className="overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    {post.featuredImage ? (<img src={post.featuredImage} alt={post.title} className="w-full h-auto object-cover group-hover:scale-105 transition duration-500" />) : (<span className="text-5xl py-12">📄</span>)}
                  </div>
                  <div className="p-6">
                    {post.category && <span className="text-xs font-medium px-3 py-1 rounded-full mb-3 inline-block" style={{ backgroundColor: "var(--primary-15)", color: "var(--primary)" }}>{tText(post.category, post.categoryHi, post.category)}</span>}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">{tText(post.title, post.titleHi, post.title)}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{tText(post.excerpt, post.excerptHi, post.excerpt)}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {t("blog.by")} {tText(post.author || "Admin", post.authorHi)}</span>
                      {post.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{t("blog.on")} {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-green-200">
              <BookOpen className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">{t("blog.none")}</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}