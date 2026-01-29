"use client";

import MovieCard from "./MovieCard";
import Link from "next/link";
import useSWR from "swr";
import { movieService } from "@/lib/movieService";

type MovieData = {
  _id: string;
  title: string;
  slug?: string;
  posterUrl?: string;
  rating?: number;
  ageRating?: string;
  releaseDate: string;
  genre?: string[];
  status?: string;
};

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') 
    .trim()
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-'); 
};

export default function MovieGrid() {
  const { data, error, isLoading } = useSWR<MovieData[]>(
    "movies-home",
    async () => {
      const response = await movieService.getMovies({ limit: 8 });
      return (response.data || []) as unknown as MovieData[];
    },
    {
      dedupingInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryInterval: 2000,
      errorRetryCount: 2,
    }
  );

  const nowPlaying = (data || []).filter((m) => m.status === "now-showing");
  const comingSoon = (data || []).filter((m) => m.status === "coming-soon");

  if (isLoading) {
    return (
      <section id="phim" className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div key={idx} className="h-64 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="phim" className="mx-auto max-w-7xl px-4 py-10">
        <div className="text-center text-red-400 py-12">
          Không tải được danh sách phim. Vui lòng thử lại.
        </div>
      </section>
    );
  }

  return (
    <section id="phim" className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-white text-xl md:text-2xl font-semibold">
          Phim đang chiếu
        </h2>
        <Link href="/movies" className="text-lg text-white hover:text-red-400">
          Xem tất cả
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {nowPlaying.map((m) => (
          <MovieCard
            key={m._id}
            title={m.title}
            slug={m.slug || generateSlug(m.title)}
            poster={m.posterUrl || "/assets/images/anh1.jpg"}
            rating={m.rating || 0}
            ageRating={m.ageRating || "P"}
            year={new Date(m.releaseDate).getFullYear() || 2024}
            season={1}
            episode={1}
            genres={m.genre || []}
          />
        ))}
      </div>
      <div className="mt-12 mb-6 flex items-center justify-between">
        <h3 className="text-white text-xl md:text-2xl font-semibold">
          Phim sắp chiếu
        </h3>
        <Link href="/movies" className="text-lg text-white hover:text-red-400">
          Xem tất cả
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {comingSoon.map((m) => (
          <MovieCard
            key={m._id}
            title={m.title}
            slug={m.slug || generateSlug(m.title)}
            poster={m.posterUrl || "/assets/images/anh1.jpg"}
            rating={m.rating || 0}
            ageRating={m.ageRating || "P"}
            year={new Date(m.releaseDate).getFullYear() || 2024}
            season={1}
            episode={1}
            genres={m.genre || []}
          />
        ))}
      </div>
    </section>
  );
}
