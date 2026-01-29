"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { movieService, theaterService, bookingService } from "@/lib";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from 'recharts';

interface BookingData {
  _id?: string;
  id?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  createdAt?: string;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface RevenueDataItem {
  date: string;
  revenue: number;
}

interface BookingsTrendItem {
  date: string;
  bookings: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheaters: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [chartData, setChartData] = useState<{
    bookingsByStatus: ChartDataItem[];
    revenueByPayment: RevenueDataItem[];
    bookingsTrend: BookingsTrendItem[];
  }>({
    bookingsByStatus: [],
    revenueByPayment: [],
    bookingsTrend: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.push("/login");
      return;
    }

    fetchStats();
  }, [user, router, isInitialized]);

  const fetchStats = async () => {
    try {
      const [moviesRes, theatersRes, bookingsRes] = await Promise.all([
        movieService.getMovies({ limit: 20 }),
        theaterService.getTheaters(),
        bookingService.getAllBookings({ limit: 50 }),
      ]);

      const bookings = (bookingsRes.data || []) as BookingData[];

      const totalRevenue = bookings
        .filter((b) => b.status === "confirmed")
        .reduce((sum: number, b) => sum + (b.totalPrice || 0), 0);
      
      setStats({
        totalMovies: moviesRes.meta?.total || moviesRes.data?.length || 0,
        totalTheaters: theatersRes?.length || 0,
        totalBookings: bookingsRes.meta?.total || bookings.length || 0,
        totalRevenue,
      });

      // Bookings by status (Pie Chart)
      const confirmed = bookings.filter((b) => b.status === "confirmed").length;
      const pending = bookings.filter((b) => b.status === "pending").length;
      const cancelled = bookings.filter((b) => b.status === "cancelled").length;
      
      // Revenue by day (Bar Chart) - last 7 days
      const last7DaysRevenue: Record<string, number> = {};
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        last7DaysRevenue[dateStr] = 0;
      }
      
      bookings
        .filter((b) => b.status === "confirmed" && b.createdAt)
        .forEach((b) => {
          const date = new Date(b.createdAt!);
          const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
          if (last7DaysRevenue.hasOwnProperty(dateStr)) {
            last7DaysRevenue[dateStr] += (b.totalPrice || 0);
          }
        });

      // Bookings trend by day (Line Chart) - last 7 days
      const last7DaysBookings: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        last7DaysBookings[dateStr] = 0;
      }
      
      bookings
        .filter((b) => b.createdAt)
        .forEach((b) => {
        const date = new Date(b.createdAt!);
        const dateStr = date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        if (last7DaysBookings.hasOwnProperty(dateStr)) {
          last7DaysBookings[dateStr]++;
        }
      });

      setChartData({
        bookingsByStatus: [
          { name: 'Đã xác nhận', value: confirmed, color: '#10b981' },
          { name: 'Chờ xử lý', value: pending, color: '#f59e0b' },
          { name: 'Đã hủy', value: cancelled, color: '#ef4444' },
        ],
        revenueByPayment: Object.entries(last7DaysRevenue).map(([date, revenue]) => ({
          date,
          revenue: revenue,
        })),
        bookingsTrend: Object.entries(last7DaysBookings).map(([date, count]) => ({
          date,
          bookings: count,
        })),
      });
    } catch {
      // Ignore stats fetch errors
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Quản lý hệ thống đặt vé xem phim</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Movie */}
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-blue-400">{stats.totalMovies}</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Tổng số phim</h3>
            <p className="text-gray-500 text-xs">Đang chiếu và sắp chiếu</p>
          </div>

          {/* Rạp */}
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-purple-400">{stats.totalTheaters}</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Hệ thống rạp</h3>
            <p className="text-gray-500 text-xs">Trên toàn quốc</p>
          </div>

          {/* Vé đã bán */}
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-green-400">{stats.totalBookings}</span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Vé đã bán</h3>
            <p className="text-gray-500 text-xs">Tổng số vé</p>
          </div>

          {/* Doanh thu */}
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-md border border-red-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-red-400">
                {(stats.totalRevenue / 1000000).toFixed(1)}M
              </span>
            </div>
            <h3 className="text-gray-400 text-sm mb-1">Doanh thu</h3>
            <p className="text-gray-500 text-xs">{stats.totalRevenue.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pie Chart - Bookings by Status */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Phân bổ đặt vé theo trạng thái</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.bookingsByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    const { name, percent } = props;
                    return `${name}: ${((percent || 0) * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.bookingsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart - Revenue by Day (Last 7 Days) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Doanh thu 7 ngày gần nhất</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.revenueByPayment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  formatter={(value: number | undefined) => [`${(value || 0).toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#ef4444" name="Doanh thu" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Line Chart - Bookings Trend */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold text-white mb-4">Số lượng vé 7 ngày gần nhất</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.bookingsTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} name="Số vé đặt" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/movies">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Phim</h3>
              </div>
              <p className="text-gray-400 text-sm">Quản lý phim</p>
            </div>
          </Link>

          <Link href="/admin/showtimes">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Lịch chiếu</h3>
              </div>
              <p className="text-gray-400 text-sm">Quản lý suất chiếu</p>
            </div>
          </Link>

          <Link href="/admin/bookings">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Đặt vé</h3>
              </div>
              <p className="text-gray-400 text-sm">Quản lý booking</p>
            </div>
          </Link>

          <Link href="/admin/users">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-yellow-500/50 hover:shadow-xl hover:shadow-yellow-500/20 transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">Người dùng</h3>
              </div>
              <p className="text-gray-400 text-sm">Quản lý tài khoản</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

