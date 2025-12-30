"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSeatRealtime } from "@/hooks/useSeatRealtime";
import Image from "next/image";
import { toast } from "sonner";
import { showtimeService, bookingService, paymentService } from "@/lib";

interface ShowtimeData {
  _id?: string;
  id?: string;
  startTime: string;
  price?: number;
  seats?: Array<{ price?: number }>;
  movieId?: string | {
    title: string;
    posterUrl?: string;
    poster?: string;
  };
  theaterId?: string | {
    name: string;
  };
  room?: string;
  format?: string;
}

interface MovieData {
  title: string;
  posterUrl?: string;
  poster?: string;
}

function CheckoutPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const showtimeId = searchParams.get("showtimeId");
  
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("momo");
  const [showtime, setShowtime] = useState<ShowtimeData | null>(null);
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);

  // Use realtime seat updates
  const { seatData, connected, selectSeats, notifyBookingCreated } = useSeatRealtime(showtimeId);

  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 10;

  const loadShowtimeData = useCallback(async () => {
    if (!showtimeId) {
      toast.error("Thiếu thông tin suất chiếu");
      router.push("/movies");
      return;
    }
    
    if (!/^[0-9a-fA-F]{24}$/.test(showtimeId)) {
      toast.error("ID suất chiếu không hợp lệ");
      router.push("/movies");
      return;
    }
    
    try {
      setLoading(true);
      const showtimeData = await showtimeService.getShowtimeById(showtimeId);
      
      setShowtime(showtimeData as ShowtimeData);

      if (showtimeData.movieId) {
        if (typeof showtimeData.movieId === 'object') {
          setMovie(showtimeData.movieId);
        }
      }
    } catch (error) {
      console.error("Error loading showtime:", error);
      toast.error("Lỗi khi tải thông tin suất chiếu");
      router.push("/movies");
    } finally {
      setLoading(false);
    }
  }, [showtimeId, router]);

  useEffect(() => {
    if (!showtimeId) {
      toast.error("Không tìm thấy thông tin suất chiếu");
      router.push("/movies");
      return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(showtimeId)) {
      toast.error("ID suất chiếu không hợp lệ");
      router.push("/movies");
      return;
    }

    loadShowtimeData();
  }, [showtimeId, router, loadShowtimeData]);

  const bookedSeats = seatData?.bookedSeats || [];
  const lockedSeats = seatData?.lockedSeats || [];

  const toggleSeat = (seat: string) => {
    if (bookedSeats.includes(seat) || lockedSeats.includes(seat)) return;
    
    const newSelectedSeats = selectedSeats.includes(seat) 
      ? selectedSeats.filter((s) => s !== seat) 
      : [...selectedSeats, seat];
    
    setSelectedSeats(newSelectedSeats);
    
    // Notify other users via WebSocket
    if (user) {
      selectSeats(newSelectedSeats, user._id || user.id || '');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để đặt vé!");
      router.push("/login");
      return;
    }

    if (paymentMethod !== "momo") {
      toast.info("MoMo đang là phương thức chính. Các cổng khác đang được phát triển, vui lòng chọn MoMo!");
      setPaymentMethod("momo");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }

    if (!showtimeId) {
      toast.error("Thông tin suất chiếu không hợp lệ");
      return;
    }

    // Validate totalPrice
    if (!totalPrice || isNaN(totalPrice) || totalPrice <= 0) {
      toast.error("Lỗi tính giá vé. Vui lòng thử lại!");
      return;
    }

    const loadingToast = toast.loading("Đang xử lý đặt vé...");
    
    try {
      const bookingData = await bookingService.createBooking({
        showtimeId: showtimeId,
        seats: selectedSeats,
      });

      notifyBookingCreated();

      toast.dismiss(loadingToast);

      if (paymentMethod === "momo") {
        const paymentData = await paymentService.createMoMoPayment({
          bookingId: bookingData._id,
          amount: totalPrice,
        });
        
        toast.success("Đang chuyển đến cổng thanh toán MoMo...");
        window.location.href = paymentData.paymentUrl;
      }
    } catch (error: unknown) {
      toast.dismiss(loadingToast);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(errorMessage || "Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const getSeatPrice = () => {
    if (showtime?.price && !isNaN(showtime.price)) {
      return Number(showtime.price);
    }
    if (showtime?.seats?.[0]?.price && !isNaN(showtime.seats[0].price)) {
      return Number(showtime.seats[0].price);
    }
    return 100000;
  };

  const seatPrice = getSeatPrice();
  const totalPrice = selectedSeats.length * seatPrice;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center pt-24 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin suất chiếu...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center pt-24 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Vui lòng đăng nhập</h1>
          <p className="text-gray-400 mb-6">Bạn cần đăng nhập để đặt vé xem phim</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  if (!showtime || !movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center pt-24 px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Không tìm thấy suất chiếu</h1>
          <p className="text-gray-400 mb-6">Suất chiếu này không tồn tại hoặc đã hết hạn</p>
          <button
            onClick={() => router.push("/movies")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Về trang phim
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold text-white mb-8">Đặt Vé Xem Phim</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Movie Info */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
              <div className="flex gap-4">
                <div className="relative w-24 h-36 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={movie.posterUrl || "/assets/images/anh1.jpg"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-2">{movie.title}</h2>
                  <div className="space-y-1 text-sm text-gray-300">
                    <p>{typeof showtime.theaterId === 'object' ? showtime.theaterId?.name : "Rạp phim"}</p>
                    <p>{new Date(showtime.startTime).toLocaleDateString("vi-VN")} - {new Date(showtime.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                    <p>{showtime.room} - {showtime.format || "2D Phụ đề"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
              {/* Realtime status */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-400">
                    {connected ? 'Realtime cập nhật' : 'Đang kết nối...'}
                  </span>
                </div>
                {seatData && (
                  <span className="text-xs text-gray-400">
                    Còn trống: {seatData.availableSeats}/{seatData.totalSeats} ghế
                  </span>
                )}
              </div>

              <div className="mb-8">
                <div className="relative">
                  <div className="h-2 bg-gradient-to-r from-transparent via-gray-400 to-transparent rounded-full mb-2" />
                  <p className="text-center text-gray-400 text-sm">Màn hình</p>
                </div>
              </div>

              {/* Seats */}
              <div className="space-y-3">
                {rows.map((row) => (
                  <div key={row} className="flex items-center justify-center gap-2">
                    <span className="text-gray-400 w-6 text-center font-medium">{row}</span>
                    <div className="flex gap-2">
                      {Array.from({ length: seatsPerRow }, (_, i) => {
                        const seatNumber = i + 1;
                        const seatId = `${row}${seatNumber}`;
                        const isBooked = bookedSeats.includes(seatId);
                        const isLocked = lockedSeats.includes(seatId) && !selectedSeats.includes(seatId);
                        const isSelected = selectedSeats.includes(seatId);

                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeat(seatId)}
                            disabled={isBooked || isLocked}
                            title={isLocked ? 'Ghế đang được chọn bởi người khác' : isBooked ? 'Ghế đã được đặt' : ''}
                            className={`w-8 h-8 rounded-t-lg text-xs font-semibold transition-all ${
                              isBooked
                                ? "bg-blue-600 cursor-not-allowed opacity-100"
                                : isLocked
                                ? "bg-green-500 cursor-not-allowed opacity-80 animate-pulse"
                                : isSelected
                                ? "bg-red-600 text-white scale-110"
                                : "bg-white/20 hover:bg-white/30 text-white"
                            }`}
                          >
                            {seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="flex justify-center gap-4 mt-8 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-t-lg" />
                  <span className="text-gray-300">Trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-600 rounded-t-lg" />
                  <span className="text-gray-300">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-500 rounded-t-lg animate-pulse" />
                  <span className="text-gray-300">Đang giữ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-t-lg" />
                  <span className="text-gray-300">Đã đặt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-4">Thông tin đặt vé</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Ghế đã chọn:</span>
                  <span className="text-white font-semibold">
                    {selectedSeats.length > 0 ? selectedSeats.join(", ") : "Chưa chọn"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Số lượng:</span>
                  <span className="text-white font-semibold">{selectedSeats.length} vé</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Giá vé:</span>
                  <span className="text-white">{seatPrice.toLocaleString()}đ/vé</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-white">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-red-500">
                    {totalPrice.toLocaleString()}đ
                  </span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-3">Phương thức thanh toán</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setPaymentMethod("momo")}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      paymentMethod === "momo"
                        ? "bg-red-600/20 border-red-600"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image src="/assets/icons/momo-icon.png" alt="MoMo" fill className="object-contain" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-white font-medium block">MoMo</span>
                    </div>
                    {paymentMethod === "momo" && (
                      <span className="ml-auto text-red-500">✓</span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      toast.info("VNPay đang được phát triển. Vui lòng chọn MoMo!");
                      setPaymentMethod("momo");
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border transition-all bg-white/5 border-white/10 opacity-70 cursor-not-allowed"
                  >
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image src="/assets/icons/vnpay-icon.jpg" alt="VNPay" fill className="object-contain" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-white font-medium block">VNPay</span>
                      <span className="text-xs text-gray-300">Đang phát triển</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      toast.info("ZaloPay đang được phát triển. Vui lòng chọn MoMo!");
                      setPaymentMethod("momo");
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border transition-all bg-white/5 border-white/10 opacity-70 cursor-not-allowed"
                  >
                    <div className="relative w-8 h-8 flex-shrink-0">
                      <Image src="/assets/icons/zlp-icon.png" alt="ZaloPay" fill className="object-contain" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-white font-medium block">ZaloPay</span>
                      <span className="text-xs text-gray-300">Đang phát triển</span>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={selectedSeats.length === 0}
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-105 disabled:transform-none"
              >
                {selectedSeats.length === 0 ? "Chọn ghế để tiếp tục" : "Thanh toán"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-3">
                Vé đã mua không thể hoàn trả. Vui lòng kiểm tra kỹ thông tin trước khi thanh toán.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-black to-gray-900 text-gray-200">Đang tải trang thanh toán...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}
