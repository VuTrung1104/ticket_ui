"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

type WishlistMovie = {
  id: string;
  title: string;
  slug: string;
  posterUrl: string;
  rating: number;
  genre: string[];
  duration: number;
  releaseDate: string;
};

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistMovie[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const saved = localStorage.getItem(`wishlist_${user.id}`);
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading wishlist:", error);
      }
    }
  }, [user, router]);

  const removeFromWishlist = (movieId: string) => {
    const updated = wishlist.filter((m) => m.id !== movieId);
    setWishlist(updated);
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black text-white pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Danh Sách Yêu Thích</h1>
              <p className="text-gray-400">
                {wishlist.length} phim trong danh sách của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-300 mb-3">
              Danh sách trống
            </h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Bạn chưa có phim nào trong danh sách yêu thích. Hãy khám phá và thêm những bộ phim yêu thích của bạn!
            </p>
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-8 py-3.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Khám Phá Phim
            </Link>
          </div>
        )}

        {/* Wishlist Grid */}
        {wishlist.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {wishlist.map((movie) => (
              <div key={movie.id} className="group relative">
                <Link href={`/movies/${movie.slug}`}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                    <Image
                      src={movie.posterUrl || '/assets/images/anh1.jpg'}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Rating Badge */}
                    <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded-md font-bold text-sm flex items-center gap-1">
                      ⭐ {movie.rating}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        removeFromWishlist(movie.id);
                      }}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                      title="Xóa khỏi yêu thích"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Info on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <span>{movie.genre[0]}</span>
                        <span>•</span>
                        <span>{movie.duration} phút</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Title below poster */}
                <div className="mt-3">
                  <h4 className="text-sm font-semibold text-white line-clamp-2">
                    {movie.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(movie.releaseDate).getFullYear()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {wishlist.length > 0 && (
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-red-500 mb-1">
                {wishlist.length}
              </div>
              <div className="text-sm text-gray-400">Tổng số phim</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-yellow-500 mb-1">
                {(wishlist.reduce((sum, m) => sum + m.rating, 0) / wishlist.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-400">Điểm TB</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-blue-500 mb-1">
                {Math.round(wishlist.reduce((sum, m) => sum + m.duration, 0) / 60)}h
              </div>
              <div className="text-sm text-gray-400">Thời lượng</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="text-3xl font-bold text-green-500 mb-1">
                {new Set(wishlist.flatMap(m => m.genre)).size}
              </div>
              <div className="text-sm text-gray-400">Thể loại</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
