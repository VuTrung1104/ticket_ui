"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { bookingService } from "@/lib";
import type { Booking } from "@/types";

type BookingStatus = "all" | "confirmed" | "pending" | "cancelled";

type BookingData = Booking & {
  bookingDate?: string;
  userName?: string;
  userEmail?: string;
  movie?: string;
  theater?: string;
  showtime?: string;
  user?: {
    _id: string;
    email: string;
    name?: string;
    fullName?: string;
  };
  userId?: {
    _id: string;
    email: string;
    name?: string;
  } | string;
  showtimeId?: {
    _id: string;
    startTime: string;
    movieId?: {
      title: string;
    };
    theaterId?: {
      name: string;
    };
  } | string;
  paymentId?: {
    _id: string;
    method?: string;
    status?: string;
  };
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<BookingStatus>("all");
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
    const timer = setTimeout(fetchBookings, 250);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus, searchTerm]);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getAllBookings({
        page,
        limit,
        status: filterStatus === "all" ? undefined : filterStatus,
        search: searchTerm || undefined,
      });
      const list = response?.data ?? [];
      const pagination = response?.meta;
      setBookings(list as BookingData[]);
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
    } catch {
      toast.error("Lỗi khi tải danh sách đặt vé");
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (confirm(`Bạn có chắc muốn hủy đặt vé?`)) {
      try {
        await bookingService.cancelBooking(id);
        await fetchBookings();
        toast.success("Đã hủy đặt vé thành công!");
      } catch (error) {
        console.error("Cancel booking error:", error);
        toast.error("Lỗi khi hủy đặt vé");
      }
    }
  };

  const handleConfirmBooking = async (id: string) => {
    try {
      await bookingService.confirmBooking(id);
      setBookings(bookings.map(b => b._id === id ? { ...b, status: "confirmed" } : b));
      toast.success("Đã xác nhận đặt vé thành công!");
    } catch {
      toast.error("Lỗi khi xác nhận đặt vé");
    }
  };

  const totalRevenue = bookings
    .filter(b => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const pageNumbers = Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quản lý đặt vé</h1>
            <p className="text-gray-400">Theo dõi và quản lý các giao dịch đặt vé</p>
          </div>
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
                  placeholder="Mã đặt vé, tên người dùng, email, phim..."
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
                onChange={(e) => { setFilterStatus(e.target.value as BookingStatus); setPage(1); }}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-gray-800 text-white">Tất cả</option>
                <option value="confirmed" className="bg-gray-800 text-white">Đã xác nhận</option>
                <option value="pending" className="bg-gray-800 text-white">Chờ xử lý</option>
                <option value="cancelled" className="bg-gray-800 text-white">Đã hủy</option>
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{bookings.length}</p>
                <p className="text-sm text-gray-400">Tổng đặt vé</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-md border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{bookings.filter(b => b.status === "confirmed").length}</p>
                <p className="text-sm text-gray-400">Đã xác nhận</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-600/20 to-orange-700/20 backdrop-blur-md border border-yellow-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{bookings.filter(b => b.status === "pending").length}</p>
                <p className="text-sm text-gray-400">Chờ xử lý</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{totalRevenue.toLocaleString('vi-VN')}đ</p>
                <p className="text-sm text-gray-400">Tổng doanh thu</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Mã đặt vé</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Khách hàng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phim</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Rạp & Suất chiếu</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ghế</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tổng tiền</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Phương thức</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Trạng thái</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-400 text-lg">Không tìm thấy đặt vé nào</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-white font-semibold">{booking.bookingCode || booking._id}</p>
                        <p className="text-xs text-gray-400">{booking.bookingDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{booking.userName}</p>
                        <p className="text-sm text-gray-400">{booking.userEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-medium">{booking.movie}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{booking.theater}</p>
                        <p className="text-gray-400 text-xs">{booking.showtime}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {booking.seats.map(seat => (
                            <span key={seat} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                              {seat}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white font-semibold">{booking.totalPrice.toLocaleString('vi-VN')}đ</p>
                      </td>
                      <td className="px-6 py-4">
                        {booking.paymentId && booking.paymentId.method ? (
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            booking.paymentId.method?.toLowerCase() === 'momo' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' :
                            booking.paymentId.method?.toLowerCase() === 'vnpay' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            booking.paymentId.method?.toLowerCase() === 'zalopay' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {booking.paymentId.method?.toLowerCase() === 'momo' ? 'MoMo' :
                             booking.paymentId.method?.toLowerCase() === 'vnpay' ? 'VNPay' :
                             booking.paymentId.method?.toLowerCase() === 'zalopay' ? 'ZaloPay' :
                             booking.paymentId.method}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">Chưa thanh toán</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            booking.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : booking.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {booking.status === "confirmed" ? "Đã xác nhận" : booking.status === "pending" ? "Chờ xử lý" : "Đã hủy"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {booking.status === "pending" && booking._id && (
                            <button
                              onClick={() => handleConfirmBooking(booking._id!)}
                              className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-all"
                              title="Xác nhận"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          )}
                          {booking.status !== "cancelled" && booking._id && (
                            <button
                              onClick={() => handleCancelBooking(booking._id!)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                              title="Hủy đặt vé"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {bookings.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Trang {meta.page}/{meta.totalPages} • {meta.total} đặt vé
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
