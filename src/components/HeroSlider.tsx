"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroSliderProps {
  images: string[];
  title: string;
  subtitle: string;
  ctaText: string;
  partnersLabel: string;
  tagline: string;
}

export default function HeroSlider({ images, title, subtitle, ctaText, partnersLabel, tagline }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const hasImages = images.length > 0;

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!hasImages) return;
    const timer = setInterval(next, 6000); // Slower, more elegant transitions
    return () => clearInterval(timer);
  }, [next, hasImages]);

  const bg = `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`;

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center" style={{ background: bg }}>
      <AnimatePresence initial={false}>
        {hasImages && (
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img src={images[current]} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-3xl"
        >
          <span className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-bold tracking-wider uppercase mb-8 border border-white/20 shadow-lg">
            {tagline}
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-8 drop-shadow-2xl">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-2xl font-medium drop-shadow-md">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-5">
            <Link
              href="/programs"
              className="inline-flex items-center gap-3 bg-[var(--primary)] text-white px-10 py-5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg border border-white/20"
            >
              {ctaText} <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/partners"
              className="inline-flex items-center gap-3 bg-white text-[var(--primary)] px-10 py-5 rounded-full font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all text-lg"
            >
              {partnersLabel}
            </Link>
          </div>
        </motion.div>

        {/* Custom Navigation Controls */}
        {hasImages && images.length > 1 && (
          <>
            <div className="absolute right-8 bottom-12 flex items-center gap-4 hidden md:flex">
              <button 
                onClick={prev} 
                className="w-14 h-14 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 border border-white/10 transition group"
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={next} 
                className="w-14 h-14 flex items-center justify-center bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 border border-white/10 transition group"
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Progress indicators */}
            <div className="absolute left-4 sm:left-8 bottom-8 flex gap-3 z-20">
              {images.map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrent(i)} 
                  className="group py-4 px-1"
                >
                  <div className={`h-1.5 rounded-full transition-all duration-500 ease-in-out ${
                    current === i ? "w-16 bg-white" : "w-8 bg-white/40 group-hover:bg-white/70"
                  }`} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}