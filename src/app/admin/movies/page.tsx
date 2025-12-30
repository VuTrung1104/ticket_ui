"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { movieService } from "@/lib/movieService";
import type { Movie } from "@/types";

export default function AdminMoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "now-showing" | "coming-soon" | "ended">("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await movieService.getMovies({
          search: searchTerm || undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
          limit,
          page,
        });
        const list = response?.data ?? [];
        const pagination = response?.meta;
        setMovies(list);
        if (pagination) {
          setMeta({
            total: pagination.total ?? list.length,
            page: pagination.page ?? page,
            limit: pagination.limit ?? limit,
            totalPages: pagination.totalPages ?? 1,
            hasNextPage: pagination.hasNextPage ?? false,
            hasPrevPage: pagination.hasPrevPage ?? false,
          });
        } else {
          const total = list.length;
          setMeta({
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            hasNextPage: false,
            hasPrevPage: page > 1,
          });
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
        toast.error("Không thể tải danh sách phim");
        setMovies([]);
      }
    };

    const timer = setTimeout(fetchMovies, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, page, limit]);

  const filteredMovies = movies.filter(movie => {
    const matchesStatus = filterStatus === "all" || movie.status === filterStatus;
    return matchesStatus;
  });

  const pageNumbers = Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc muốn xóa phim "${title}"?`)) {
      try {
        await movieService.deleteMovie(id);
        setMovies(movies.filter(m => m._id !== id));
        toast.success("Đã xóa phim thành công!");
      } catch {
        toast.error("Không thể xóa phim");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quản lý phim</h1>
            <p className="text-gray-400">Quản lý danh sách phim đang chiếu và sắp chiếu</p>
          </div>
          <Link
            href="/admin/movies/create"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm phim mới
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tìm kiếm</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
                  placeholder="Nhập tên phim..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => { setFilterStatus(e.target.value as "all" | "now-showing" | "coming-soon" | "ended"); setPage(1); }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800 text-white">Tất cả</option>
                <option value="now-showing" className="bg-gray-800 text-white">Đang chiếu</option>
                <option value="coming-soon" className="bg-gray-800 text-white">Sắp chiếu</option>
                <option value="ended" className="bg-gray-800 text-white">Đã kết thúc</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{movies.length}</p>
                <p className="text-sm text-gray-400">Tổng số phim</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-md border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{movies.filter(m => m.status === "now-showing").length}</p>
                <p className="text-sm text-gray-400">Đang chiếu</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{movies.filter(m => m.status === "coming-soon").length}</p>
                <p className="text-sm text-gray-400">Sắp chiếu</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-600/20 to-gray-800/20 backdrop-blur-md border border-gray-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{movies.filter(m => m.status === "ended").length}</p>
                <p className="text-sm text-gray-400">Đã kết thúc</p>
              </div>
            </div>
          </div>
        </div>

        {/* Movies Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phim</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Thể loại</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Đánh giá</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Thời lượng</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredMovies.map((movie) => (
                  <tr key={movie._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{movie.title}</p>
                          <p className="text-sm text-gray-400">ID: {movie._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {movie.genres?.map((genre, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md">
                            {genre}
                          </span>
                        )) || <span className="text-gray-500">-</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-semibold">{movie.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">{movie.duration} phút</td>
                    <td className="px-6 py-4 text-center">
                      {movie.status === "now-showing" ? (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                          Đang chiếu
                        </span>
                      ) : movie.status === "coming-soon" ? (
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full border border-purple-500/30">
                          Sắp chiếu
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-gray-500/20 text-gray-400 text-sm rounded-full border border-gray-500/30">
                          Đã kết thúc
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/movies/${movie._id}`}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => movie._id && handleDelete(movie._id, movie.title)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Xóa"
                          disabled={!movie._id}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredMovies.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-400">Không tìm thấy phim nào</p>
            </div>
          )}
        </div>

        {movies.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Trang {meta.page}/{meta.totalPages} • {meta.total} phim
            </p>
            <div className="flex items-center gap-2">
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    num === page
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
