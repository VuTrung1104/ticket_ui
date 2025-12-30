"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Showtime } from "@/types";
import { showtimeService } from "@/lib";
import { toast } from "sonner";
import useSWR from "swr";
import dynamic from "next/dynamic";

interface SeatData {
  seats?: Array<{
    seatNumber: string;
    isBooked: boolean;
    price: number;
  }>;
  bookedSeats?: string[];
  lockedSeats?: string[];
  totalSeats?: number;
  availableSeats?: number;
}

const AdditionalInfo = dynamic(() => import("./AdditionalInfo"), {
  loading: () => (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-blue-200">
      Đang tải lưu ý...
    </div>
  ),
});

function useDebouncedValue<T>(value: T, delay = 150) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function ShowtimePage() {
  const params = useParams();
  const router = useRouter();
  const showtimeId = params.id as string;
  const [validatedId, setValidatedId] = useState<string | null>(null);

  useEffect(() => {
    if (!showtimeId) return;
    if (!/^[0-9a-fA-F]{24}$/.test(showtimeId)) {
      toast.error("ID suất chiếu không hợp lệ");
      router.push("/movies");
      return;
    }
    setValidatedId(showtimeId);
  }, [router, showtimeId]);

  const debouncedId = useDebouncedValue(validatedId, 120);

  const showtimeFetcher = useMemo(
    () => (id: string) => showtimeService.getShowtimeById(id),
    []
  );

  const seatsFetcher = useMemo(
    () => (id: string) => showtimeService.getAvailableSeats(id),
    []
  );

  const {
    data: showtime,
    error: showtimeError,
    isLoading: showtimeLoading,
  } = useSWR<Showtime | null>(
    debouncedId ? ["showtime", debouncedId] as const : null,
    ([, id]: [string, string]) => showtimeFetcher(id),
    {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  }
  );

  const showtimeIdForSeats = showtime?._id || showtimeId;

  const {
    data: seatData,
    isLoading: seatsLoading,
  } = useSWR<SeatData | null>(
    showtimeIdForSeats ? ["seats", showtimeIdForSeats] as const : null,
    ([, id]: [string, string]) => seatsFetcher(id),
    {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
  });

  useEffect(() => {
    if (showtimeError) {
      toast.error("Lỗi khi tải thông tin suất chiếu");
    }
  }, [showtimeError]);

  const loading = showtimeLoading || (!showtime && !showtimeError);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin suất chiếu...</p>
        </div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy suất chiếu</h2>
          <p className="text-gray-400 mb-6">Suất chiếu này không tồn tại hoặc đã bị hủy</p>
          <button
            onClick={() => router.push("/movies")}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Về trang phim
          </button>
        </div>
      </div>
    );
  }

  const startDate = new Date(showtime.startTime);
  const endDate = new Date(showtime.endTime);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", { 
      weekday: "long", 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const totalSeats = seatData?.totalSeats ?? showtime?.availableSeats ?? 80;
  const availableSeats = seatData?.availableSeats ?? showtime?.availableSeats ?? totalSeats;
  const seatsLoaded = seatData !== null && !seatsLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white flex items-center gap-2 mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-white">Thông tin suất chiếu</h1>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Showtime Details */}
          <div className="w-full">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6">Chi tiết suất chiếu</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Time Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-400">Ngày chiếu</p>
                      <p className="font-semibold text-white">{formatDate(startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-400">Giờ chiếu</p>
                      <p className="font-semibold text-white">
                        {formatTime(startDate)} - {formatTime(endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-400">Phòng chiếu</p>
                      <p className="font-semibold text-white">
                        {typeof showtime.theaterId === 'object' && showtime.theaterId?.name ? showtime.theaterId.name : 'Rạp không xác định'}
                      </p>
                      {showtime.room && (
                        <p className="text-sm text-gray-400 mt-1">
                          Phòng {showtime.room || showtime.screenNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price and Seats Info */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-400">Giá vé</p>
                      <p className="font-bold text-2xl text-red-500">
                        {showtime.price 
                          ? showtime.price.toLocaleString("vi-VN") + "đ" 
                          : "100.000đ"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-red-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-400">Ghế trống</p>
                      <p className="font-semibold text-white">
                        {seatsLoaded ? `${availableSeats}/${totalSeats} ghế` : "Đang tải..."}
                      </p>
                      {seatsLoaded && (
                        <div className="mt-2 bg-white/10 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-green-500 h-full rounded-full transition-all"
                            style={{ width: `${totalSeats > 0 ? (availableSeats / totalSeats) * 100 : 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Warning if low seats */}
              {seatsLoaded && availableSeats < 10 && availableSeats > 0 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-yellow-800">Chỉ còn {availableSeats} ghế!</p>
                    <p className="text-sm text-yellow-700">Đặt vé ngay để không bỏ lỡ suất chiếu này.</p>
                  </div>
                </div>
              )}

              {seatsLoaded && availableSeats === 0 && (
                <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold text-red-800">Suất chiếu đã hết vé</p>
                    <p className="text-sm text-red-700">Vui lòng chọn suất chiếu khác.</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                <button
                  disabled={!seatsLoaded || availableSeats === 0}
                  onClick={() => router.push(`/checkout?showtimeId=${showtimeId}`)}
                  className={`flex-1 py-4 rounded-lg font-semibold text-lg transition-all ${
                    !seatsLoaded || availableSeats === 0
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:shadow-red-500/50"
                  }`}
                >
                  {!seatsLoaded
                    ? "Đang tải ghế..."
                    : availableSeats === 0
                      ? "Hết vé"
                      : "Đặt vé ngay"}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <AdditionalInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
