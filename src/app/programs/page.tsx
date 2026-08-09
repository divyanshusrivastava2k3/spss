import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage, pick } from "@/lib/language";
import { GraduationCap, Leaf } from "lucide-react";
import Link from "next/link";

async function getPrograms() {
  try {
    return await prisma.program.findMany({ orderBy: { startDate: "asc" }, where: { isActive: true } });
  } catch (error) {
    console.error("Failed to fetch programs:", error);
    return [];
  }
}

export default async function ProgramsPage() {
  const lang = await getLanguage();
  const t = (en: string | null | undefined, hi: string | null | undefined, fb = "") => pick(lang, en, hi, fb);
  const programs = await getPrograms();

  return (
    <>
      <Navbar />
      <section className="py-20 lg:py-28" style={{ background: "linear-gradient(135deg, var(--primary), var(--secondary))" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur mb-6"><GraduationCap className="w-8 h-8 text-white" /></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{t("Training Programs", "हमारे कार्यक्रम")}</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{t("Skill development programs designed to create sustainable livelihoods for youth, women, and artisans.", "युवाओं, महिलाओं और कारीगरों के लिए स्थायी आजीविका बनाने के लिए कौशल विकास कार्यक्रम।")}</p>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {programs.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-green-200">
              <GraduationCap className="w-12 h-12 text-green-300 mx-auto mb-4" />
              <p className="text-gray-700 text-lg">{t("No programs scheduled yet.", "अभी तक कोई कार्यक्रम निर्धारित नहीं है।")}</p>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 gap-8">
              {programs.map((program) => (
                <Link href={`/programs/${program.id}`} key={program.id} className="break-inside-avoid inline-block w-full mb-8 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-green-100 group">
                  {program.imageUrl ? (
                    <img src={program.imageUrl} alt={program.title} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="h-56 flex items-center justify-center" style={{ background: "linear-gradient(135deg, var(--primary-10), var(--secondary-20))" }}>
                      <Leaf className="w-12 h-12 opacity-30 group-hover:scale-110 transition-transform duration-500" style={{ color: "var(--primary)" }} />
                    </div>
                  )}
                  <div className="p-8 flex gap-6 items-start">
                    <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: "var(--primary-15)" }}>
                      <GraduationCap className="w-7 h-7 group-hover:text-[var(--primary)] transition-colors" style={{ color: "var(--primary)" }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[var(--primary)] transition-colors">{t(program.title, program.titleHi)}</h3>
                      <p className="text-gray-700 leading-relaxed mb-4 line-clamp-3">{t(program.description, program.descriptionHi)}</p>
                      {program.startDate && (
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: "var(--primary-15)", color: "var(--primary)" }}>
                          {new Date(program.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      )}
                      <div className="mt-4 text-sm font-semibold text-[var(--primary)] flex items-center gap-2 group-hover:gap-3 transition-all">
                        Know more <span className="text-[var(--primary)]">&rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}