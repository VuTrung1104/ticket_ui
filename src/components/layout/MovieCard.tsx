"use client";

import { Heart, Info } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import PosterWithHover from "./PosterWithHover";
import { FaTicketAlt } from "react-icons/fa";

type WishlistMovie = {
  id: string;
  title: string;
  slug: string;
  poster: string;
  rating: number;
  genre: string[];
  duration: number;
  releaseDate: string;
};

type MovieCardProps = {
  poster: string;
  title: string;
  slug?: string;
  rating?: number;
  year?: number;
  season?: number;
  episode?: number;
  ageRating?: string;
  genres?: string[];
};

export default function MovieCard({
  poster,
  title,
  slug,
  rating,
  year,
  season,
  episode,
  ageRating,
  genres,
}: MovieCardProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    // Check if in wishlist
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.id && slug) {
      const wishlist: WishlistMovie[] = JSON.parse(localStorage.getItem(`wishlist_${user.id}`) || "[]");
      setIsInWishlist(wishlist.some((m) => m.slug === slug));
    }
  }, [slug]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
      alert("Vui lòng đăng nhập để thêm vào yêu thích!");
      return;
    }

    if (!slug) return;

    const wishlistKey = `wishlist_${user.id}`;
    const wishlist: WishlistMovie[] = JSON.parse(localStorage.getItem(wishlistKey) || "[]");
    
    if (isInWishlist) {
      // Remove from wishlist
      const updated = wishlist.filter((m) => m.slug !== slug);
      localStorage.setItem(wishlistKey, JSON.stringify(updated));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      const movieData = {
        id: Date.now().toString(),
        title: title,
        slug: slug,
        poster: poster,
        rating: rating || 0,
        genre: genres || [],
        duration: 120,
        releaseDate: `${year}-01-01`,
      };
      wishlist.push(movieData);
      localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
      setIsInWishlist(true);
    }
  };

  return (
    <Link href={slug ? `/movies/${slug}` : "#"} className="w-full relative group block">
      {/* Poster */}
      <div className="relative">
        <PosterWithHover src={poster} alt={title} rating={rating} />
      </div>

      {/* Hover */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
             opacity-0 invisible group-hover:opacity-100 group-hover:visible 
             transition-all duration-500 z-50 pointer-events-none group-hover:pointer-events-auto"
      >
        <div
          className="bg-gray-900 rounded-2xl w-[320px] shadow-2xl transform scale-130
                        transition-transform duration-500 overflow-hidden"
        >
          {/* poster khi hover */}
          <div className="relative">
            <Image
              src={poster}
              alt={title}
              width={400}
              height={200}
              className="w-full h-40 object-cover rounded-t-2xl"
            />
          </div>

          <div className="p-4 space-y-3">
            {/* Title */}
            <div>
              <h3 className="text-white text-base font-bold">{title}</h3>
            </div>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // TODO: Navigate to booking
                  window.location.href = slug ? `/showtimes/${slug}` : "#";
                }}
                className="flex-1 bg-red-400 hover:bg-red-600 text-white font-bold 
                                 py-2 px-3 rounded-lg flex items-center justify-center gap-2 
                                 transition-colors text-sm"
              >
                <FaTicketAlt size={16}/> Đặt vé
              </button>
              <button 
                onClick={toggleWishlist}
                className={`p-2 rounded-lg transition-all ${
                  isInWishlist 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                <Heart size={16} fill={isInWishlist ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Keep default navigation to movie detail
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
              >
                <Info size={16} />
              </button>
            </div>

            {/* Info */}
            <div className="flex items-center gap-2 text-[65%] flex-wrap">
              <span className="bg-gray-700 text-white px-2 py-0.5 rounded font-semibold">
                {ageRating}
              </span>
              <span className="text-gray-300">{year}</span>
              <span className="text-gray-300">Phần {season}</span>
              <span className="text-gray-300">Tập {episode}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1">
              {genres?.map((genre, idx) => (
                <span key={idx} className="text-gray-300 text-[65%]">
                  {genre}
                  {idx < genres.length - 1 && " • "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Title poster */}
      <div className="mt-3 text-center">
        <h4 className="text-lg font-semibold text-white line-clamp-2">
          {title}
        </h4>
      </div>
    </Link>
  );
}
