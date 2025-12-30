"use client";

import { useState, useEffect } from "react";
import { showtimeService } from "@/lib/showtimeService";
import Link from "next/link";
import Image from "next/image";

interface MovieData {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  duration: number;
  rating: number;
  status?: string;
}

interface ShowtimeWithDetails {
  _id: string;
  startTime: string;
  endTime: string;
  price?: number;
  screenNumber?: number;
  format?: string;
  language?: string;
  subtitles?: string;
  movieId: {
    _id: string;
    title: string;
    slug: string;
    posterUrl: string;
    duration: number;
    rating: number;
  };
  theaterId: {
    _id: string;
    name: string;
    location: string;
  };
  seats?: Array<{
    seatNumber: string;
    isBooked: boolean;
    price: number;
  }>;
  bookedSeats?: string[];
}

export default function ShowtimesPage() {
  const formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [showtimes, setShowtimes] = useState<ShowtimeWithDetails[]>([]);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>(
    formatLocalDate(new Date())
  );
  const [loading, setLoading] = useState(true);


  // Fetch showtimes
  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        setLoading(true);
        const data = await showtimeService.getShowtimes({
          movieId: selectedMovie || undefined,
          date: selectedDate,
        });
        const showtimeList = (data as unknown as ShowtimeWithDetails[]) || [];
        setShowtimes(showtimeList);

        const movieMap = new Map<string, MovieData>();
        showtimeList.forEach((st) => {
          if (st.movieId?._id) {
            movieMap.set(st.movieId._id, {
              ...st.movieId,
            } as MovieData);
          }
        });
        const availableMovies = Array.from(movieMap.values());
        setMovies(availableMovies);

        if (selectedMovie && !availableMovies.find((m) => m._id === selectedMovie)) {
          setSelectedMovie("");
        }
      } catch (error) {
        console.error("Error fetching showtimes:", error);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimes();
  }, [selectedMovie, selectedDate]);

  // Generate next 7 days
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(formatLocalDate(date));
    }
    return days;
  };

  const groupedShowtimes = showtimes
    .filter(
      (showtime) =>
        showtime.movieId && showtime.movieId._id && showtime.theaterId
    )
    .reduce((acc, showtime) => {
      const movieId = showtime.movieId._id;
      if (!acc[movieId]) {
        acc[movieId] = {
          movie: showtime.movieId,
          showtimes: [],
        };
      }
      acc[movieId].showtimes.push(showtime);
      return acc;
    }, {} as Record<string, { movie: MovieData; showtimes: ShowtimeWithDetails[] }>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white pt-24">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Lịch Chiếu Phim
          </h1>
          <p className="text-gray-400">Chọn phim và ngày để xem lịch chiếu</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Movie Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chọn phim
              </label>
              <select
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500 [&>option]:bg-gray-900 [&>option]:text-white"
              >
                <option value="" className="bg-gray-900 text-white">
                  Tất cả phim
                </option>
                {movies.map((movie) => (
                  <option
                    key={movie._id}
                    value={movie._id}
                    className="bg-gray-900 text-white"
                  >
                    {movie.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Chọn ngày
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {getNext7Days().map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 px-4 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                        isSelected
                          ? "bg-gradient-to-r from-red-600 to-red-500 text-white scale-105"
                          : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <div className="text-xs opacity-75">
                        {dateObj.toLocaleDateString("vi-VN", {
                          weekday: "short",
                        })}
                      </div>
                      <div className="text-sm font-bold">
                        {dateObj.toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Showtimes List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-400">Đang tải lịch chiếu...</p>
          </div>
        ) : Object.keys(groupedShowtimes).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              Không có lịch chiếu nào cho ngày này
            </div>
            <p className="text-gray-500 text-sm">
              Vui lòng chọn ngày khác hoặc phim khác
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.values(groupedShowtimes).map(({ movie, showtimes }) => (
              <div
                key={movie._id}
                className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Movie Poster */}
                  <Link
                    href={`/movies/${movie.slug}`}
                    className="flex-shrink-0 w-full md:w-32"
                  >
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden hover:scale-105 transition-transform">
                      {movie.posterUrl && (
                        <Image
                          src={movie.posterUrl}
                          alt={movie.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 128px"
                        />
                      )}
                    </div>
                  </Link>

                  {/* Movie Info & Showtimes */}
                  <div className="flex-1">
                    <Link href={`/movies/${movie.slug}`}>
                      <h3 className="text-2xl font-bold text-white hover:text-red-500 transition-colors mb-2">
                        {movie.title}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                        </svg>
                        {movie.duration} phút
                      </span>
                      {movie.rating && (
                        <span className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {movie.rating}/10
                        </span>
                      )}
                    </div>

                    {/* Showtimes - Grouped by Theater */}
                    <div className="space-y-4">
                      {(() => {
                        // Group showtimes by theater
                        const byTheater = showtimes.reduce((acc: Record<string, ShowtimeWithDetails[]>, st) => {
                          const theaterName =
                            st.theaterId?.name || "Rạp không xác định";
                          if (!acc[theaterName]) acc[theaterName] = [];
                          acc[theaterName].push(st);
                          return acc;
                        }, {});

                        return Object.entries(byTheater).map(
                          ([theaterName, theaterShowtimes]: [string, ShowtimeWithDetails[]]) => (
                            <div key={theaterName}>
                              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                  />
                                </svg>
                                {theaterName}
                              </h4>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {theaterShowtimes.map((showtime: ShowtimeWithDetails) => {
                                  const startTime = new Date(
                                    showtime.startTime
                                  );
                                  const bookedCount =
                                    showtime.bookedSeats?.length ||
                                    showtime.seats?.filter(
                                      (s) => s.isBooked
                                    ).length ||
                                    0;
                                  const totalSeats =
                                    showtime.seats?.length || 100;
                                  const availableSeats =
                                    totalSeats - bookedCount;
                                  const isFull = availableSeats <= 0;
                                  const displayPrice =
                                    showtime.price ||
                                    showtime.seats?.[0]?.price ||
                                    0;

                                  return (
                                    <Link
                                      key={showtime._id}
                                      href={`/showtimes/${showtime._id}`}
                                      className={`group relative px-4 py-3 rounded-lg border transition-all ${
                                        isFull
                                          ? "bg-gray-800 border-gray-700 opacity-50 cursor-not-allowed"
                                          : "bg-white/5 border-white/20 hover:bg-red-600 hover:border-red-600 hover:scale-105"
                                      }`}
                                    >
                                      <div className="text-center">
                                        <div className="font-bold text-lg">
                                          {startTime.toLocaleTimeString(
                                            "vi-VN",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          )}
                                        </div>
                                        {showtime.format && (
                                          <div className="text-xs text-gray-400 mt-1">
                                            {showtime.format}
                                          </div>
                                        )}
                                        <div className="text-xs text-gray-400 mt-1">
                                          {isFull
                                            ? "Hết chỗ"
                                            : `${availableSeats} ghế`}
                                        </div>
                                        {displayPrice > 0 && (
                                          <div className="text-xs text-red-400 font-semibold mt-1">
                                            {displayPrice.toLocaleString(
                                              "vi-VN"
                                            )}
                                            đ
                                          </div>
                                        )}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          )
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
