"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { useTranslation } from "@/lib/translation-context";

interface GalleryImage {
  id: string;
  title: string;
  titleHi?: string | null;
  imageUrl: string;
  category?: string | null;
  categoryHi?: string | null;
  description?: string | null;
  descriptionHi?: string | null;
}

export default function GalleryGrid({
  items,
  categories,
}: {
  items: GalleryImage[];
  categories: string[];
}) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const navigate = (dir: number) => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + dir + filtered.length) % filtered.length);
  };

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                    filter === cat
                      ? "text-white shadow-md border-transparent"
                      : "text-gray-700 border-green-200 bg-white hover:bg-green-50"
                  }`}
                  style={filter === cat ? { backgroundColor: "var(--primary)" } : {}}
                >
                  {cat === "All" ? t("gallery.categories.all") : cat}
                </button>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-green-200">
              <Camera className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-gray-700 text-lg">{t("gallery.empty")}</p>
              <p className="text-gray-500 text-sm mt-2">{t("gallery.addFromAdmin")}</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => openLightbox(i)}
                  className="relative group rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-lg transition-all break-inside-avoid w-full block"
                >
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full aspect-square bg-green-50 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-green-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-semibold text-sm text-left">{item.title}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={closeLightbox}>
          <button className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition" onClick={closeLightbox} aria-label="Close">
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute left-4 md:left-8 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
            onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            {filtered[lightboxIndex].imageUrl ? (
              <img src={filtered[lightboxIndex].imageUrl} alt={filtered[lightboxIndex].title} className="w-full max-h-[75vh] object-contain rounded-xl" />
            ) : (
              <div className="h-[50vh] bg-white/10 rounded-xl flex items-center justify-center">
                <Camera className="w-16 h-16 text-white/30" />
              </div>
            )}
            <div className="text-center mt-4">
              <p className="text-white text-lg font-semibold">{filtered[lightboxIndex].title}</p>
              {filtered[lightboxIndex].category && (
                <p className="text-white/60 text-sm mt-1">{filtered[lightboxIndex].category}</p>
              )}
            </div>
          </div>
          <button
            className="absolute right-4 md:right-8 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition"
            onClick={(e) => { e.stopPropagation(); navigate(1); }}
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
}