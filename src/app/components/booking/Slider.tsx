"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images: string[] = [
  "/assets/posters/poster1.jpg",
  "/assets/posters/poster2.jpeg",
  "/assets/posters/poster3.jpeg",
  "/assets/posters/poster4.jpeg",
  "/assets/posters/poster5.jpg",
];

export default function Slider() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const nextSlide = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      zIndex: 0,
    }),
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={activeIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image
            src={images[activeIndex]}
            alt={`slide-${activeIndex + 1}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next button */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between p-4 z-10">
        <button
          aria-label="Previous slide"
          onClick={prevSlide}
          className="pointer-events-auto rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
        >
          ‹
        </button>
        <button
          aria-label="Next slide"
          onClick={nextSlide}
          className="pointer-events-auto rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
        >
          ›
        </button>
      </div>
    </section>
  );
}
