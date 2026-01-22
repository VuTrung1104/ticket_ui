"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { theaterService, showtimeService, movieService } from "@/lib";
import { toast } from "sonner";
import Image from "next/image";

interface Theater {
  _id: string;
  name: string;
  city: string;
  address: string;
  facilities: string[];
}

interface Movie {
  _id: string;
  title: string;
  slug: string;
  posterUrl: string;
  duration: number;
  rating: number;
  genres: string[];
}

interface ShowtimeWithDetails {
  _id: string;
  movieId: {
    _id: string;
    title: string;
    slug: string;
    posterUrl: string;
    duration: number;
    rating: number;
    genres: string[];
  } | string;
  theaterId: string;
  startTime: string;
  endTime: string;
  price: number;
}

export default function TheaterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const theaterId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';

  const [theater, setTheater] = useState<Theater | null>(null);
  const [showtimes, setShowtimes] = useState<ShowtimeWithDetails[]>([]);
  const [movies, setMovies] = useState<Map<string, Movie>>(new Map());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  const fetchTheaterData = useCallback(async () => {
    if (!theaterId || !/^[0-9a-fA-F]{24}$/.test(theaterId)) {
      toast.error("ID rạp không hợp lệ");
      router.push("/theaters");
      return;
    }
    try {
      const theaterData = (await theaterService.getTheaterById(theaterId)) as unknown as Theater;
      setTheater(theaterData);
    } catch {
      toast.error("Lỗi khi tải thông tin rạp");
    }
  }, [theaterId, router]);

  const fetchShowtimes = useCallback(async () => {
    if (!theaterId) return;
    setLoading(true);
    try {
      // Fetch all showtimes for this theater
      const response = await showtimeService.getShowtimes({
        theaterId,
      }) as unknown as ShowtimeWithDetails[];

      // Filter by selected date
      const filtered = response.filter((showtime) => {
        const showtimeDate = new Date(showtime.startTime);
        return (
          showtimeDate.getDate() === selectedDate.getDate() &&
          showtimeDate.getMonth() === selectedDate.getMonth() &&
          showtimeDate.getFullYear() === selectedDate.getFullYear()
        );
      });

      setShowtimes(filtered);

      // Fetch movie details for all showtimes
      const movieIds = new Set(
        filtered.map((st: ShowtimeWithDetails) =>
          typeof st.movieId === "string" ? st.movieId : st.movieId._id
        )
      );

      const moviePromises = Array.from(movieIds).map((id) =>
        movieService.getMovieByObjectId(id as string)
      );
      const movieData = (await Promise.all(moviePromises)) as unknown as Movie[];

      const movieMap = new Map();
      movieData.forEach((movie: Movie) => {
        movieMap.set(movie._id, movie);
      });
      setMovies(movieMap);
    } catch {
      // Ignore fetch errors
    } finally {
      setLoading(false);
    }
  }, [theaterId, selectedDate]);

  useEffect(() => {
    fetchTheaterData();
  }, [fetchTheaterData]);

  useEffect(() => {
    fetchShowtimes();
  }, [fetchShowtimes]);

  const formatDate = (date: Date) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: date.getMonth() + 1,
    };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Group showtimes by movie
  const showtimesByMovie = showtimes.reduce((acc, showtime) => {
    const movieId =
      typeof showtime.movieId === "string"
        ? showtime.movieId
        : showtime.movieId._id;
    if (!acc[movieId]) {
      acc[movieId] = [];
    }
    acc[movieId].push(showtime);
    return acc;
  }, {} as Record<string, ShowtimeWithDetails[]>);

  if (!theater) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Theater Header */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Theater Image */}
            <div className="relative w-full md:w-64 h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/assets/images/anh1.jpg"
                  alt={theater.name}
                  fill
                  className="object-cover opacity-60"
                />
              </div>
            </div>

            {/* Theater Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {theater.name}
                </h1>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2 text-gray-300">
                  <svg
                    className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm">{theater.address}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {theater.facilities.map((facility) => (
                    <span
                      key={facility}
                      className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-md font-medium"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Selector */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Chọn ngày</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {dates.map((date, index) => {
              const { day, date: dayNum, month } = formatDate(date);
              const isSelected =
                date.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center w-20 h-24 rounded-lg transition-all ${
                    isSelected
                      ? "bg-gradient-to-br from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/50"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20"
                  }`}
                >
                  <span className="text-xs font-medium mb-1">{day}</span>
                  <span className="text-2xl font-bold">{dayNum}</span>
                  <span className="text-xs mt-1">Th{month}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Movies & Showtimes */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Phim đang chiếu
          </h2>
          <p className="text-gray-400">
            {formatDate(selectedDate).day}, {formatDate(selectedDate).date}/
            {formatDate(selectedDate).month}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && Object.keys(showtimesByMovie).length === 0 && (
          <div className="text-center py-16 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
            <svg
              className="w-20 h-20 text-gray-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">
              Không có lịch chiếu
            </h3>
            <p className="text-gray-400">
              Chưa có phim nào chiếu vào ngày này
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          {Object.entries(showtimesByMovie).map(([movieId, movieShowtimes]) => {
            const movie = movies.get(movieId);
            if (!movie) return null;

            return (
              <div
                key={movieId}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-red-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Movie Poster */}
                  <div
                    className="relative w-full md:w-48 h-72 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group"
                    onClick={() => router.push(`/movies/${movie.slug}`)}
                  >
                    <Image
                      src={movie.posterUrl}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Movie Info & Showtimes */}
                  <div className="flex-1">
                    <h3
                      className="text-2xl font-bold text-white mb-2 cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => router.push(`/movies/${movie.slug}`)}
                    >
                      {movie.title}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                      {movie.duration && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{movie.duration} phút</span>
                        </div>
                      )}
                      {movie.rating && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-4 h-4 text-yellow-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-yellow-500 font-semibold">
                            {movie.rating}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                          />
                        </svg>
                        <span>{movie.genres.join(", ")}</span>
                      </div>
                    </div>

                    {/* Showtimes */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-3">
                        Suất chiếu:
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {movieShowtimes
                          .sort(
                            (a, b) =>
                              new Date(a.startTime).getTime() -
                              new Date(b.startTime).getTime()
                          )
                          .map((showtime) => (
                            <button
                            key={showtime._id}
                            onClick={() =>
                              router.push(`/showtimes/${showtime._id}`)
                              }
                              className="bg-white/10 hover:bg-gradient-to-r hover:from-red-600 hover:to-pink-600 border border-white/20 hover:border-transparent text-white px-6 py-3 rounded-lg transition-all font-semibold text-sm shadow-lg hover:shadow-red-500/30 hover:scale-105"
                            >
                              {formatTime(showtime.startTime)}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
