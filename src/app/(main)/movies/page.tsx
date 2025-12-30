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
}

// Helper function to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-'); // Replace multiple - with single -
};

export default function MoviesPage() {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getMovies({
          page,
          limit: 12,
          search: searchQuery || undefined,
        });
        setMovies(response.data || []);
        setTotalPages(response.meta?.totalPages || 1);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page, searchQuery]);

  const filteredMovies = movies.filter((movie) => {
    const matchesFilter = filter === "all" || movie.genre?.includes(filter);
    return matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#181b24] pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Phim Đang Chiếu</h1>
          <p className="text-gray-400">Khám phá những bộ phim hot nhất hiện nay</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all" className="bg-gray-800 text-white">Tất cả thể loại</option>
            <option value="Hành động" className="bg-gray-800 text-white">Hành động</option>
            <option value="Khoa học viễn tưởng" className="bg-gray-800 text-white">Khoa học viễn tưởng</option>
            <option value="Tâm lý" className="bg-gray-800 text-white">Tâm lý</option>
            <option value="Kinh dị" className="bg-gray-800 text-white">Kinh dị</option>
            <option value="Chiến tranh" className="bg-gray-800 text-white">Chiến tranh</option>
          </select>
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
              <p className="text-gray-400 text-lg">Không tìm thấy phim phù hợp</p>
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
