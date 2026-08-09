import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import prisma from "@/lib/prisma";
import { getLanguage, pick } from "@/lib/language";
import { GraduationCap, Leaf, ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProgramDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const lang = await getLanguage();
  const t = (en: string | null | undefined, hi: string | null | undefined, fb = "") => pick(lang, en, hi, fb);
  
  let program = null;
  try {
    program = await prisma.program.findUnique({
      where: { id: resolvedParams.id }
    });
  } catch (error) {
    console.error("Failed to fetch program:", error);
  }

  if (!program || !program.isActive) {
    notFound();
  }

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${program.imageUrl || 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=2000'}')` }} />
        <div className="absolute inset-0 bg-[var(--primary)] mix-blend-multiply opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-90" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link href="/programs" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 font-semibold">
            <ArrowLeft className="w-5 h-5" /> Back to Programs
          </Link>
          
          <div className="flex flex-wrap gap-4 mb-6">
            {program.category && (
              <span className="inline-flex items-center gap-1.5 bg-[var(--primary)] text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                <Tag className="w-4 h-4" /> {t(program.category, program.categoryHi)}
              </span>
            )}
            {program.startDate && (
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                <Calendar className="w-4 h-4" /> {new Date(program.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight max-w-4xl">
            {t(program.title, program.titleHi)}
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 md:p-12 -mt-32 relative z-20 border border-gray-100">
            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[var(--primary)]">
              <h2 className="text-3xl font-extrabold mb-6">About the Program</h2>
              <div className="text-lg leading-relaxed whitespace-pre-wrap">
                {t(program.description, program.descriptionHi)}
              </div>
            </div>
            
            <div className="mt-12 pt-12 border-t border-gray-100 flex justify-center">
              <Link href="/contact" className="inline-flex justify-center items-center gap-2 bg-[var(--primary)] text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-green-800 hover:-translate-y-1 transition-all duration-300">
                Get Involved
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
