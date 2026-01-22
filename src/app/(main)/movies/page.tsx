"use client";

import { useState, useEffect } from "react";
import MovieCard from "@/components/layout/MovieCard";
import { movieService } from "@/lib/movieService";

interface MovieData {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  posterUrl?: string;
  poster?: string;
  rating?: number;
  releaseDate: string;
  year?: number;
  season?: number;
  episode?: number;
  ageRating?: string;
  genre?: string[];
  genres?: string[];
  status?: string;
}

// Helper function to generate slug from title
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

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<"now-showing" | "coming-soon">("now-showing");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovies({
          page,
          limit: 15,
          status: activeTab,
        });
        setMovies(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
      } catch {
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, activeTab]);

  const filteredMovies = movies;

  return (
    <div className="min-h-screen bg-[#181b24] pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-700">
          <div className="flex gap-8">
            <button
              onClick={() => {
                setActiveTab("now-showing");
                setPage(1);
              }}
              className={`pb-4 text-lg font-semibold transition-colors relative ${
                activeTab === "now-showing"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Phim Đang Chiếu
              {activeTab === "now-showing" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("coming-soon");
                setPage(1);
              }}
              className={`pb-4 text-lg font-semibold transition-colors relative ${
                activeTab === "coming-soon"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Phim Sắp Chiếu
              {activeTab === "coming-soon" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></div>
              )}
            </button>
          </div>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">Đang tải phim...</p>
            </div>
          ) : filteredMovies.length > 0 ? (
            filteredMovies.map((movie) => (
              <MovieCard
                key={movie._id || movie.id}
                poster={movie.posterUrl || "/assets/images/anh1.jpg"}
                title={movie.title}
                slug={movie.slug || generateSlug(movie.title)}
                rating={movie.rating}
                year={new Date(movie.releaseDate).getFullYear() || movie.year}
                season={movie.season || 1}
                episode={movie.episode || 1}
                ageRating={movie.ageRating || "T13"}
                genres={movie.genre || movie.genres || []}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                {activeTab === "now-showing" 
                  ? "Không có phim đang chiếu" 
                  : "Không có phim sắp chiếu"}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
            >
              Trước
            </button>
            <span className="px-4 py-2 text-white">
              Trang {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white/10 text-white rounded-lg disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
