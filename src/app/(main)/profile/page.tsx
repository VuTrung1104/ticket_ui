"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingService, userService } from "@/lib";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

interface BookingData {
  _id?: string;
  id?: string;
  ticketId?: string;
  bookingCode?: string;
  status: string;
  totalPrice: number;
  seats: string[];
  createdAt?: string;
  movie?: string;
  cinema?: string;
  date?: string;
  time?: string;
  showtime?: {
    movie?: { title: string };
    theater?: { name: string };
    room?: { name: string };
    startTime: string;
  };
  showtimeId?: {
    _id: string;
    startTime: string;
    showDate?: string;
    showTime?: string;
    movieId?: {
      title: string;
      posterUrl?: string;
    };
    theaterId?: {
      name: string;
    };
    movie?: {
      title: string;
    };
    theater?: {
      name: string;
    };
    room?: {
      name: string;
    };
  } | string;
}

export default function ProfilePage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "tickets" | "history">("info");
  const [isEditing, setIsEditing] = useState(false);
  const [userBookings, setUserBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [editedData, setEditedData] = useState({
    fullName: "",
    phone: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      router.push("/login");
      return;
    }

    fetchUserData();
  }, [user, router, authLoading]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await bookingService.getMyBookings();
      setUserBookings(response.data);

      const profile = await userService.getProfile();
      if (profile.avatar) {
        setAvatarUrl(profile.avatar);
      }

      let formattedDate = "";
      if (profile.dateOfBirth) {
        const date = new Date(profile.dateOfBirth);
        formattedDate = date.toISOString().split('T')[0];
      }

      setEditedData({
        fullName: profile.fullName || "",
        phone: profile.phone || "",
        dateOfBirth: formattedDate,
      });
    } catch {
      // Ignore fetch errors
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Canvas to Blob failed'));
              }
            },
            'image/jpeg',
            0.8
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        toast.info("Đang xử lý ảnh...");

        const compressedFile = await compressImage(file);
        
        toast.info("Đang tải ảnh lên...");
        const response = await userService.uploadAvatar(compressedFile);
        setAvatarUrl(response.avatar);

        // Refresh user profile to get updated avatar
        await refreshUser();
        
        // Also reload page data
        await fetchUserData();
        
        toast.success("Cập nhật ảnh đại diện thành công!");
      } catch (error: unknown) {
        toast.error(
          error && typeof error === 'object' && 'response' in error && 
          error.response && typeof error.response === 'object' && 'data' in error.response &&
          error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
            ? String(error.response.data.message)
            : "Lỗi khi tải ảnh lên"
        );
      }
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Remove empty fields to avoid validation errors
      const dataToUpdate: Record<string, string> = {};
      if (editedData.fullName) dataToUpdate.fullName = editedData.fullName;
      if (editedData.phone) dataToUpdate.phone = editedData.phone;
      if (editedData.dateOfBirth) {
        const date = new Date(editedData.dateOfBirth);
        dataToUpdate.dateOfBirth = date.toISOString();
      }
      
      toast.info("Đang lưu thông tin...");
      await userService.updateProfile(dataToUpdate);
      
      toast.success("Cập nhật thông tin thành công!");
      setIsEditing(false);

      await fetchUserData();
    } catch (error: unknown) {
      toast.error(
        error && typeof error === 'object' && 'response' in error && 
        error.response && typeof error.response === 'object' && 'data' in error.response &&
        error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data
          ? String(error.response.data.message)
          : "Lỗi khi cập nhật thông tin"
      );
    }
  };

  if (authLoading || !user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header Profile */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload" className="cursor-pointer">
                {avatarUrl ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-2xl ring-4 ring-red-500/30 hover:ring-red-500/50 transition-all">
                    <Image 
                      src={avatarUrl} 
                      alt="Avatar" 
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl ring-4 ring-red-500/30 hover:ring-red-500/50 transition-all">
                    {getInitials(user.fullName || user.email)}
                  </div>
                )}
              </label>

              {(user.role === "admin" || user.email === "admin@gmail.com") && (
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  Admin
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{user.fullName || "User"}</h1>
              <p className="text-gray-400 mb-4">{user.email}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-gray-400 text-sm">Tổng vé:</span>
                  <span className="ml-2 font-bold text-red-500">{userBookings?.length || 0}</span>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-gray-400 text-sm">Điểm thưởng:</span>
                  <span className="ml-2 font-bold text-yellow-500">{(userBookings?.length || 0) * 10}</span>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <span className="text-gray-400 text-sm">Hạng:</span>
                  <span className="ml-2 font-bold text-blue-500">{(userBookings?.length || 0) >= 10 ? "Vàng" : (userBookings?.length || 0) >= 5 ? "Bạc" : "Đồng"}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-medium transition-all"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-white/10 mb-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "info" ? "text-red-500" : "text-gray-400 hover:text-white"
            }`}
          >
            Thông tin cá nhân
            {activeTab === "info" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "tickets" ? "text-red-500" : "text-gray-400 hover:text-white"
            }`}
          >
            Vé của tôi
            {activeTab === "tickets" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "history" ? "text-red-500" : "text-gray-400 hover:text-white"
            }`}
          >
            Lịch sử đặt vé
            {activeTab === "history" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === "info" && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={editedData.fullName}
                  onChange={(e) => setEditedData({ ...editedData, fullName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={editedData.phone}
                  onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Chưa cập nhật"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Ngày sinh</label>
                <input
                  type="date"
                  value={editedData.dateOfBirth}
                  onChange={(e) => setEditedData({ ...editedData, dateOfBirth: e.target.value })}
                  disabled={!isEditing}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>
            {isEditing && (
              <div className="mt-6 flex gap-3">
                <button 
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 rounded-xl font-semibold transition-all"
                >
                  Lưu thay đổi
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition-all"
                >
                  Hủy
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Vé của tôi</h2>
            {(userBookings?.length || 0) === 0 ? (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-12 border border-white/10 text-center">
                <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">Chưa có vé nào</h3>
                <p className="text-gray-400 mb-6">Đặt vé ngay để trải nghiệm những bộ phim tuyệt vời!</p>
                <Link href="/movies" className="inline-block bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all">
                  Đặt vé ngay
                </Link>
              </div>
            ) : (
              userBookings.map((ticket, index) => {
                const showtimeData = typeof ticket.showtimeId === 'string' ? null : ticket.showtimeId;
                const movieTitle = showtimeData?.movieId?.title || ticket.movie || 'N/A';
                const cinemaName = showtimeData?.theaterId?.name || ticket.cinema || 'N/A';
                const startTime = showtimeData?.startTime;
                const showDate = startTime
                  ? new Date(startTime).toLocaleDateString('vi-VN')
                  : ticket.date || 'N/A';
                const showTime = startTime
                  ? new Date(startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                  : ticket.time || 'N/A';
                const bookingId = ticket._id || ticket.id || `booking-${index}`;
                const totalPrice = ticket.totalPrice || 0;
                
                return (
                <div
                  key={bookingId}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-red-500/30 transition-all"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{movieTitle}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : ticket.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {ticket.status === "confirmed" ? "Đã xác nhận" : ticket.status === "pending" ? "Chờ xác nhận" : "Đã hủy"}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {cinemaName}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {showDate} - {showTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Mã vé: <span className="font-mono font-bold">{bookingId}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-between items-end">
                      <div className="text-2xl font-bold text-red-500">{totalPrice.toLocaleString("vi-VN")}đ</div>
                    </div>
                  </div>
                </div>
              )})
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Lịch sử đặt vé</h2>
            {(userBookings?.length || 0) === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <p className="text-gray-400">Chưa có lịch sử đặt vé</p>
              </div>
            ) : (
              userBookings.map((booking) => {
                // Extract showtime data safely
                const showtimeData = typeof booking.showtimeId === 'object' ? booking.showtimeId : null;
                const movieTitle = showtimeData?.movieId?.title || showtimeData?.movie?.title || booking.movie || 'N/A';
                const theaterName = showtimeData?.theaterId?.name || showtimeData?.theater?.name || booking.cinema || 'N/A';
                const startTime = showtimeData?.startTime || booking.showtime?.startTime;
                
                return (
                <div
                  key={booking._id}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{movieTitle}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-500/20 text-green-400"
                              : booking.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {booking.status === "confirmed" ? "Đã xác nhận" : booking.status === "pending" ? "Chờ xác nhận" : "Đã hủy"}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-gray-300">
                        <p>{theaterName}</p>
                        <p>
                          {startTime ? new Date(startTime).toLocaleDateString('vi-VN') : 'N/A'} - {startTime ? new Date(startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                        </p>
                        <p>Ghế: {booking.seats?.join(", ")}</p>
                        <p className="text-gray-400">Mã đặt vé: {booking.bookingCode}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-500">{booking.totalPrice?.toLocaleString('vi-VN')}đ</div>
                    </div>
                  </div>
                </div>
              )})
            )}
          </div>
        )}
      </div>
    </div>
  );
}
