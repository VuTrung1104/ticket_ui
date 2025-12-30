"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { bookingService } from "@/lib/bookingService";

interface BookingData {
  _id?: string;
  id?: string;
  ticketId?: string;
  bookingCode?: string;
  movie?: string;
  cinema?: string;
  room?: string;
  date?: string;
  time?: string;
  seats: string[];
  totalPrice: number;
  status?: string;
  showtimeId?: string | {
    movieId?: {
      title?: string;
    };
    theaterId?: {
      name?: string;
    };
    room?: string;
    startTime?: string;
  };
}

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const ticketId = searchParams.get("ticketId");
  const bookingId = searchParams.get("bookingId");
  const error = searchParams.get("error");
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Check if payment failed
    if (error) {
      setPaymentError(decodeURIComponent(error));
      setLoading(false);
      return;
    }

    // Handle payment return with bookingId
    if (bookingId) {
      fetchBookingData(bookingId);
      return;
    }

    // Legacy handling with ticketId
    if (!ticketId) {
      router.push("/");
      return;
    }

    const bookings = JSON.parse(localStorage.getItem(`user_bookings_${user.id}`) || "[]") as BookingData[];
    const foundBooking = bookings.find((b) => b.ticketId === ticketId);
    
    if (foundBooking) {
      setBooking(foundBooking);
      setLoading(false);
    } else {
      router.push("/");
    }
  }, [user, ticketId, bookingId, error, router]);

  const fetchBookingData = async (id: string) => {
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data);
    } catch (err) {
      console.error("Failed to fetch booking:", err);
      setPaymentError("Không thể tải thông tin vé. Vui lòng kiểm tra lại trong mục 'Vé của tôi'.");
    } finally {
      setLoading(false);
    }
  };

  // Payment Error State
  if (paymentError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-4">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Thanh Toán Thất Bại</h1>
            <p className="text-gray-400">{paymentError}</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10 text-center">
            <p className="text-gray-300 mb-6">
              Giao dịch của bạn đã bị hủy hoặc không thành công. Vé của bạn sẽ được tự động hủy sau 10 phút nếu không thanh toán.
            </p>
            
            <div className="space-y-4">
              <Link
                href="/movies"
                className="block w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
              >
                Về trang chủ
              </Link>
              <Link
                href="/profile"
                className="block w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-lg font-semibold transition-all"
              >
                Xem vé của tôi
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin vé...</p>
        </div>
      </div>
    );
  }

  const generateQRCode = (code: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TICKET-${code}`;
  };

  const ticketCode = booking.bookingCode || booking.ticketId || booking._id || booking.id || 'UNKNOWN';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-4 animate-bounce">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Đặt Vé Thành Công!</h1>
          <p className="text-gray-400">Vé của bạn đã được xác nhận và gửi về email</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-500 p-6 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span className="text-white/80 text-sm font-medium">VÉ ĐIỆN TỬ</span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {typeof booking.showtimeId === 'object' ? booking.showtimeId?.movieId?.title : booking.movie}
              </h2>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Left Column - Info */}
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Mã vé</p>
                  <p className="text-white font-mono font-bold text-lg">{booking.bookingCode || booking.ticketId}</p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Rạp chiếu</p>
                  <p className="text-white font-semibold">
                    {typeof booking.showtimeId === 'object' ? booking.showtimeId?.theaterId?.name : booking.cinema}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {typeof booking.showtimeId === 'object' ? booking.showtimeId?.room : booking.room}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Ngày chiếu</p>
                    <p className="text-white font-semibold">
                      {typeof booking.showtimeId === 'object' && booking.showtimeId?.startTime
                        ? new Date(booking.showtimeId.startTime).toLocaleDateString("vi-VN")
                        : booking.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Giờ chiếu</p>
                    <p className="text-white font-semibold">
                      {typeof booking.showtimeId === 'object' && booking.showtimeId?.startTime
                        ? new Date(booking.showtimeId.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                        : booking.time}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-1">Ghế ngồi</p>
                  <div className="flex flex-wrap gap-2">
                    {booking.seats.map((seat: string) => (
                      <span key={seat} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-lg font-bold border border-red-500/30">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-gray-400 text-sm mb-1">Tổng thanh toán</p>
                  <p className="text-2xl font-bold text-red-500">
                    {(booking.totalPrice || 0).toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>

              {/* Right Column - QR Code */}
              <div className="flex flex-col items-center justify-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <Image
                    src={generateQRCode(ticketCode)}
                    alt="QR Code"
                    width={200}
                    height={200}
                    className="rounded-lg"
                    unoptimized
                  />
                </div>
                <p className="text-center text-gray-400 text-sm">
                  Vui lòng xuất trình mã QR này<br />tại quầy để nhận vé
                </p>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h4 className="text-blue-400 font-semibold mb-1">Lưu ý quan trọng</h4>
                  <ul className="text-sm text-blue-300 space-y-1">
                    <li>• Vui lòng có mặt trước giờ chiếu 15 phút</li>
                    <li>• Xuất trình mã QR hoặc mã vé tại quầy</li>
                    <li>• Vé không thể hoàn trả sau khi đã thanh toán</li>
                    <li>• Không mang đồ ăn, thức uống từ bên ngoài vào rạp</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/profile"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-lg font-semibold text-center transition-all"
              >
                Xem vé của tôi
              </Link>
              <Link
                href="/movies"
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 px-6 rounded-lg font-semibold text-center transition-all"
              >
                Đặt vé tiếp
              </Link>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-2">Cần hỗ trợ?</p>
          <div className="flex items-center justify-center gap-4">
            <a href="tel:1900000000" className="text-red-500 hover:text-red-400 font-semibold">
              📞 1900 0000
            </a>
            <span className="text-gray-600">|</span>
            <a href="mailto:support@cinemahub.com" className="text-red-500 hover:text-red-400 font-semibold">
              ✉️ support@cinemahub.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-200">Đang tải thông tin vé...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}
