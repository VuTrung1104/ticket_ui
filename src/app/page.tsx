"use client";

import dynamic from "next/dynamic";
import MovieGrid from "@/components/layout/MovieGrid";

const Poster = dynamic(() => import("@/components/booking/Slider"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[60vh] md:h-[70vh] bg-black/40 animate-pulse" />
  ),
});

export default function Home() {

  return (
    <main className="min-h-screen bg-[#181b24]">
      <Poster />
      <MovieGrid />
    </main>
  );
}