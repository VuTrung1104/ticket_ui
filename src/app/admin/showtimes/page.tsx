"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { showtimeService } from "@/lib";

interface ShowtimeData {
  _id?: string;
  startTime: string;
  endTime: string;
  price?: number;
  movieId?: {
    _id?: string;
    title: string;
  } | string;
  theaterId?: {
    _id?: string;
    name: string;
  } | string;
  screenNumber?: number;
  format?: string;
  seats?: Array<{price?: number}>;
  bookedSeats?: unknown[];
}

export default function AdminShowtimesPage() {
  const [showtimes, setShowtimes] = useState<ShowtimeData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchShowtimes = useCallback(async () => {
    try {
      const response = await showtimeService.getShowtimes({
        date: filterDate || undefined,
      });
      setShowtimes(response);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
      toast.error("Lỗi khi tải danh sách suất chiếu");
    }
  }, [filterDate]);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  const filteredShowtimes = showtimes
    .filter(showtime => showtime.movieId && showtime.theaterId) 
    .filter(showtime => {
      const movieTitle = typeof showtime.movieId === 'object' ? showtime.movieId?.title : '';
      const theaterName = typeof showtime.theaterId === 'object' ? showtime.theaterId?.name : '';
      const matchesSearch = movieTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           theaterName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

  const totalPages = Math.max(1, Math.ceil(filteredShowtimes.length / limit));
  const paginatedShowtimes = filteredShowtimes.slice((page - 1) * limit, page * limit);
  const pageNumbers = Array.from({ length: totalPages || 1 }, (_, i) => i + 1);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterDate]);

  const handleDelete = async (id: string, movieTitle: string, time: string) => {
    if (confirm(`Bạn có chắc muốn xóa suất chiếu "${movieTitle}" lúc ${new Date(time).toLocaleString("vi-VN")}?`)) {
      try {
        await showtimeService.deleteShowtime(id);
        setShowtimes(showtimes.filter(s => s._id !== id));
        toast.success("Đã xóa suất chiếu thành công!");
      } catch {
        toast.error("Lỗi khi xóa suất chiếu");
      }
    }
  };

  const getOccupancyColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return "text-green-400 bg-green-500/20 border-green-500/30";
    if (percentage > 30) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30";
    return "text-red-400 bg-red-500/20 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quản lý suất chiếu</h1>
            <p className="text-gray-400">Quản lý lịch chiếu phim theo rạp và thời gian</p>
          </div>
          <Link
            href="/admin/showtimes/create"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tạo suất chiếu
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
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tên phim hoặc rạp..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ngày chiếu</label>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{filteredShowtimes.length}</p>
                <p className="text-sm text-gray-400">Tổng suất chiếu</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {new Set(filteredShowtimes.map(s => typeof s.theaterId === 'object' ? s.theaterId?._id : null).filter(Boolean)).size}
                </p>
                <p className="text-sm text-gray-400">Rạp chiếu</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-md border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {(() => {
                    const DEFAULT_TOTAL_SEATS = 80;
                    const totalAvailable = filteredShowtimes.reduce((sum, s) => {
                      const total = Array.isArray(s.seats) && s.seats.length > 0 
                        ? s.seats.length 
                        : DEFAULT_TOTAL_SEATS;
                      const booked = Array.isArray(s.bookedSeats) ? s.bookedSeats.length : 0;
                      return sum + (total - booked);
                    }, 0);
                    return totalAvailable;
                  })()}
                </p>
                <p className="text-sm text-gray-400">Ghế còn trống</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-md border border-orange-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {showtimes.length > 0 
                    ? (showtimes.reduce((sum, s) => sum + (s.price || 0), 0) / showtimes.length / 1000).toFixed(0)
                    : '0'
                  }K
                </p>
                <p className="text-sm text-gray-400">Giá TB/vé</p>
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phim</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rạp & Phòng</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Ngày chiếu</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Giờ chiếu</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Giá vé</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Ghế trống</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedShowtimes.map((showtime) => (
                  <tr key={showtime._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {typeof showtime.movieId === 'object' ? showtime.movieId?.title : 'N/A'}
                          </p>
                          <p className="text-xs text-gray-400">ID: {showtime._id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white font-medium">
                        {typeof showtime.theaterId === 'object' ? showtime.theaterId?.name : 'N/A'}
                      </p>
                      <p className="text-sm text-gray-400">Phòng {showtime.screenNumber || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-white">{new Date(showtime.startTime).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white font-semibold">{new Date(showtime.startTime).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-orange-400 font-semibold">
                      {(showtime.price || showtime.seats?.[0]?.price || 0).toLocaleString("vi-VN")}đ
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(() => {
                        const DEFAULT_TOTAL_SEATS = 80;
                        const total = Array.isArray(showtime.seats) && showtime.seats.length > 0
                          ? showtime.seats.length 
                          : DEFAULT_TOTAL_SEATS;
                        const booked = Array.isArray(showtime.bookedSeats) ? showtime.bookedSeats.length : 0;
                        const available = total - booked;
                        
                        return (
                          <span className={`px-3 py-1 text-sm rounded-full border ${getOccupancyColor(available, total)}`}>
                            {available}/{total}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/showtimes/${showtime._id}`}
                          className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => showtime._id && handleDelete(
                            showtime._id, 
                            (typeof showtime.movieId === 'object' ? showtime.movieId?.title : null) || 'N/A', 
                            showtime.startTime
                          )}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                          title="Xóa"
                          disabled={!showtime._id}
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
          
          {filteredShowtimes.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-400">Không tìm thấy suất chiếu nào</p>
            </div>
          )}
        </div>

        {filteredShowtimes.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Trang {page}/{totalPages} • {filteredShowtimes.length} suất chiếu
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
