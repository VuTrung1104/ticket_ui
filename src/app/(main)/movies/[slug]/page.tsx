"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { movieService } from "@/lib";
import { showtimeService } from "@/lib/showtimeService";
import { toast } from "sonner";

interface MovieData {
  _id?: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  genre?: string[];
  duration: number;
  releaseDate: string;
  director: string;
  cast?: string[];
  posterUrl?: string;
  poster?: string;
  backdrop?: string;
  trailerUrl?: string;
  trailer?: string;
  rating?: number;
  voteCount?: number;
  ageRating?: string;
}

interface ShowtimeData {
  _id?: string;
  id?: string;
  startTime: string;
  endTime: string;
  price?: number;
  format?: string;
  screenNumber?: number;
  bookedSeats?: string[];
  seats?: Array<{
    row: string;
    number: number;
    isAvailable: boolean;
    price: number;
  }>;
  totalSeats?: number;
  movieId?: string | {
    _id: string;
    title: string;
  };
  theaterId?: {
    _id: string;
    name: string;
  };
}

interface WishlistMovie {
  _id: string;
  title: string;
  slug: string;
  poster?: string;
  rating?: number;
  genre?: string[];
  duration: number;
  releaseDate: string;
}

export default function MovieDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  const formatDateInVN = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d); // yyyy-mm-dd in VN timezone
  };
  const formatLocalDate = (date: Date) => formatDateInVN(date);
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [showtimes, setShowtimes] = useState<ShowtimeData[]>([]);
  const [selectedDate, setSelectedDate] = useState(formatLocalDate(new Date()));
  const [activeTab, setActiveTab] = useState<"showtimes" | "reviews">("showtimes");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showtimesLoading, setShowtimesLoading] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!slug || slug === '[object Object]') {
        toast.error("Slug phim không hợp lệ");
        return;
      }
      
      try {
        setLoading(true);
        const movieData = await movieService.getMovieById(slug);
        setMovie(movieData as MovieData);
      } catch {
        toast.error("Không thể tải thông tin phim");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMovie();
    }
  }, [slug]);

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!movie?._id) {
        return;
      }
      
      try {
        setShowtimesLoading(true);
        const movieId = movie._id || movie.id;
        if (!movieId) {
          return;
        }
        const data = await showtimeService.getShowtimes({ movieId, date: selectedDate });
        setShowtimes(Array.isArray(data) ? (data as unknown as ShowtimeData[]) : []);
      } catch {
        setShowtimes([]);
      } finally {
        setShowtimesLoading(false);
      }
    };

    fetchShowtimes();
  }, [movie, selectedDate]);

  // Check if movie is in wishlist
  useEffect(() => {
    if (!movie || !movie._id) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user._id;
    if (userId) {
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`) || "[]") as WishlistMovie[];
      setIsInWishlist(wishlist.some((m) => m._id === movie._id));
    }
  }, [movie]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy phim</h2>
          <p className="text-gray-400">Phim này không tồn tại</p>
        </div>
      </div>
    );
  }

  const toggleWishlist = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = user.id || user._id;
    if (!userId) {
      toast.error("Vui lòng đăng nhập để thêm vào yêu thích!");
      return;
    }

    const wishlistKey = `wishlist_${userId}`;
    const wishlist = JSON.parse(localStorage.getItem(wishlistKey) || "[]") as WishlistMovie[];
    
    if (isInWishlist) {
      // Remove from wishlist
      const updated = wishlist.filter((m) => m._id !== movie._id);
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
      setIsInWishlist(false);
      toast.success("Đã xóa khỏi danh sách yêu thích!");
    } else {
      // Add to wishlist
      if (!movie._id) return;
      
      const movieData: WishlistMovie = {
        _id: movie._id,
        title: movie.title,
        slug: slug,
        poster: movie.posterUrl || '/assets/images/anh1.jpg',
        rating: movie.rating,
        genre: movie.genre,
        duration: movie.duration,
        releaseDate: movie.releaseDate,
      };
      wishlist.push(movieData);
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      setIsInWishlist(true);
      toast.success("Đã thêm vào danh sách yêu thích!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white">
      {/* Backdrop  */}
      {(movie.backdrop || movie.posterUrl) && (
        <div className="relative h-[70vh] w-full overflow-hidden">
          <Image
            src={movie.backdrop || movie.posterUrl || '/assets/images/anh1.jpg'}
            alt={movie.title}
            fill
            className="object-cover opacity-30"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/50" />
        </div>
      )}

      {/* Content */}
      <div className="relative -mt-64 z-10 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 lg:w-80">
            <div className="relative w-full max-w-sm mx-auto lg:mx-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10 hover:ring-red-500/50 transition-all duration-300 hover:scale-105">
              {movie.posterUrl && (
                <Image
                  src={movie.posterUrl || '/assets/images/anh1.jpg'}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 320px"
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 space-y-3">
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/30"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Xem Trailer
              </button>
              
              <button 
                onClick={toggleWishlist}
                className={`flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl font-medium transition-all duration-300 border ${
                  isInWishlist
                    ? "bg-red-600 hover:bg-red-700 border-red-600 text-white"
                    : "bg-white/10 hover:bg-white/20 border-white/20"
                }`}
              >
                <svg className="w-5 h-5" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isInWishlist ? "Đã yêu thích" : "Yêu thích"}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-6 pb-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {movie.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-4">
                <div className="flex items-center gap-2 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.rating || 0}/10
                </div>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg">{movie.duration} phút</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg">{movie.ageRating || 'N/A'}</span>
                <span className="bg-white/10 px-3 py-1.5 rounded-lg">{new Date(movie.releaseDate).getFullYear()}</span>
              </div>

              {movie.voteCount && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{movie.voteCount.toLocaleString()} lượt đánh giá</span>
                </div>
              )}
            </div>

            {movie.genre && movie.genre.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genre.map((g: string) => (
                  <span key={g} className="px-4 py-2 bg-gradient-to-r from-red-600/20 to-red-600/10 border border-red-600/30 rounded-lg text-sm font-medium hover:border-red-600 transition-colors">
                    {g}
                  </span>
                ))}
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Nội dung phim
              </h3>
              <p className="text-gray-300 leading-relaxed">{movie.description}</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm text-gray-400 mb-1">Đạo diễn</h3>
                <p className="font-semibold">{movie.director}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm text-gray-400 mb-1">Thời lượng</h3>
                <p className="font-semibold">{movie.duration} phút</p>
              </div>
            </div>

            {movie.cast && movie.cast.length > 0 && (
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <h3 className="text-sm text-gray-400 mb-2">Diễn viên</h3>
                <p className="text-gray-300">{movie.cast.join(" • ")}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 mb-8">
          <div className="flex gap-4 border-b border-white/10">
            <button
              onClick={() => setActiveTab("showtimes")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "showtimes"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Lịch Chiếu
              {activeTab === "showtimes" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === "reviews"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Đánh giá
              {activeTab === "reviews" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
              )}
            </button>
          </div>
        </div>

        {/* Showtimes Section */}
        {activeTab === "showtimes" && (
          <div className="mb-16">
            {/* Date Picker */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
              {Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() + i);
                const dateStr = formatLocalDate(date);
                const isSelected = selectedDate === dateStr;
                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                    }}
                    className={`flex-shrink-0 px-6 py-4 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-600/30 scale-105"
                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      {date.toLocaleDateString("vi-VN", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold">
                      {date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Showtime List */}
            <div className="space-y-6">
              {showtimesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-400">Đang tải lịch chiếu...</p>
                </div>
              ) : (
                (() => {
                  // Show message if no showtimes at all
                  if (showtimes.length === 0) {
                    return (
                      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-12 text-center">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Chưa có lịch chiếu</h3>
                        <p className="text-gray-400">Phim này hiện chưa có lịch chiếu cho ngày này. Vui lòng chọn ngày khác!</p>
                      </div>
                    );
                  }

                  const groupedByTheater = showtimes.reduce((acc: Record<string, ShowtimeData[]>, st) => {
                    const theaterName = st.theaterId?.name || 'Rạp không xác định';
                    if (!acc[theaterName]) {
                      acc[theaterName] = [];
                    }
                    acc[theaterName].push(st);
                    return acc;
                  }, {} as Record<string, ShowtimeData[]>);

                  return Object.entries(groupedByTheater).map(([theaterName, theaterShowtimes]) => (
                    <div key={theaterName} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {theaterName}
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                        {theaterShowtimes
                          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                          .map((st) => {
                            const startTime = new Date(st.startTime);

                            let availableSeats = 80; 
                            if (st.seats && st.seats.length > 0) {
                              availableSeats = st.seats.filter((s) => s.isAvailable).length;
                            } else {
                              const totalSeats = st.totalSeats || 80;
                              const bookedCount = st.bookedSeats?.length || 0;
                              availableSeats = totalSeats - bookedCount;
                            }
                            
                            const isFull = availableSeats <= 0;
                            
                            return (
                              <button
                                key={st._id}
                                onClick={() => {
                                  if (!st._id) {
                                    alert('Showtime ID không tồn tại!');
                                    return;
                                  }
                                  router.push(`/showtimes/${st._id}`);
                                }}
                                disabled={isFull}
                                className={`p-3 rounded-lg border transition-all ${
                                  isFull
                                    ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-white/5 border-white/10 hover:bg-red-600 hover:border-red-500 text-white hover:scale-105'
                                }`}
                              >
                                <div className="text-lg font-bold">
                                  {startTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                {st.format && (
                                  <div className="text-xs opacity-75 mt-1">{st.format}</div>
                                )}
                                <div className="text-xs opacity-75 mt-1">
                                  {availableSeats} ghế
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
            
            <div className="text-center mt-8">
              <Link
                href="/showtimes"
                className="inline-block px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-red-600/30 hover:scale-105"
              >
                Xem tất cả lịch chiếu
              </Link>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {activeTab === "reviews" && (
          <div className="mb-16">
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Tính năng đánh giá sẽ được cập nhật sớm</p>
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setShowTrailer(false)}
        >
          <div 
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {movie.trailerUrl || movie.trailer ? (
              <iframe
                className="w-full h-full rounded-xl"
                src={(movie.trailerUrl || movie.trailer || '').replace("watch?v=", "embed/") + "?autoplay=1"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gray-800 flex items-center justify-center">
                <p className="text-white text-xl">Trailer chưa có sẵn</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}