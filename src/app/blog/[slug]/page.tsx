import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage } from "@/lib/language";
import { translations } from "@/lib/translations";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Clock, Tag, ArrowLeft, Share2 } from "lucide-react";

async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.isPublished) return null;

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { views: { increment: 1 } },
  });

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      id: { not: post.id },
      ...(post.category ? { category: post.category } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  return { post, relatedPosts };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const lang = await getLanguage();
  const t = (key: string) => translations[key]?.[lang] || translations[key]?.en || key;
  const { slug } = await params;
  const data = await getPost(slug);

  if (!data) {
    notFound();
  }

  const { post, relatedPosts } = data;

  const readingTime = Math.ceil((post.content?.split(/\s+/).length || 0) / 200);

  return (
    <>
      <Navbar />

      {/* Article */}
      <article className="py-16 lg:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 transition mb-8">
            <ArrowLeft className="w-4 h-4" /> {t("blog.readMore")}
          </Link>

          {post.category && (
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-4" style={{ backgroundColor: "var(--primary-15)", color: "var(--primary)" }}>
              {lang === "hi" && post.categoryHi ? post.categoryHi : post.category}
            </span>
          )}

          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-6 leading-tight">{lang === "hi" && post.titleHi ? post.titleHi : post.title}</h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {t("blog.by")} {lang === "hi" && post.authorHi ? post.authorHi : (post.author || "Admin")}</span>
            {post.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{t("blog.on")} {new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>}
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{readingTime} {t("common.minRead")}</span>
            {post.tags && <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {post.tags.split(",").map((tag) => <span key={tag.trim()} className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 text-xs mr-1">{tag.trim()}</span>)}</span>}
          </div>

          {post.featuredImage && (
            <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
              <img src={post.featuredImage} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {post.content?.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-6">{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Share2 className="w-4 h-4" />
              <span>{t("common.share")}</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Share on Facebook">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Share on Twitter">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition" aria-label="Share on LinkedIn">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10">{t("common.relatedPosts")}</h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8">
              {relatedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="break-inside-avoid inline-block w-full mb-8 group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100">
                  <div className="overflow-hidden bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
                    {post.featuredImage ? (<img src={post.featuredImage} alt={post.title} className="w-full h-auto object-cover group-hover:scale-105 transition duration-500" />) : (<span className="text-4xl py-12">📄</span>)}
                  </div>
                  <div className="p-5">
                    {post.category && (
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full mb-2 inline-block" style={{ backgroundColor: "var(--primary-15)", color: "var(--primary)" }}>
                        {lang === "hi" && post.categoryHi ? post.categoryHi : post.category}
                      </span>
                    )}
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition">{lang === "hi" && post.titleHi ? post.titleHi : post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{lang === "hi" && post.excerptHi ? post.excerptHi : post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {lang === "hi" && post.authorHi ? post.authorHi : (post.author || "Admin")}</span>
                      {post.publishedAt && <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}