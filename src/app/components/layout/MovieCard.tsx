import { Heart, Info } from "lucide-react";
import Image from "next/image";
import PosterWithHover from "./PosterWithHover";
import { FaTicketAlt } from "react-icons/fa";

type MovieCardProps = {
  poster: string;
  title: string;
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
  rating,
  year,
  season,
  episode,
  ageRating,
  genres,
}: MovieCardProps) {
  return (
    <div className="w-full relative group">
      {/* Poster mặc định */}
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

          {/* Nội dung dưới ảnh */}
          <div className="p-4 space-y-3">
            {/* Tiêu đề */}
            <div>
              <h3 className="text-white text-base font-bold">{title}</h3>
            </div>

            {/* Nút hành động */}
            <div className="flex gap-2">
              <button
                className="flex-1 bg-red-400 hover:bg-red-600 text-white font-bold 
                                 py-2 px-3 rounded-lg flex items-center justify-center gap-2 
                                 transition-colors text-sm"
              >
                <FaTicketAlt size={16}/> Đặt vé
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
                <Heart size={16} />
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors">
                <Info size={16} />
              </button>
            </div>

            {/* Thông tin */}
            <div className="flex items-center gap-2 text-[65%] flex-wrap">
              <span className="bg-gray-700 text-white px-2 py-0.5 rounded font-semibold">
                {ageRating}
              </span>
              <span className="text-gray-300">{year}</span>
              <span className="text-gray-300">Phần {season}</span>
              <span className="text-gray-300">Tập {episode}</span>
            </div>

            {/* Thể loại */}
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

      {/* Title riêng dưới poster */}
      <div className="mt-3 text-center">
        <h4 className="text-lg font-semibold text-white line-clamp-2">
          {title}
        </h4>
      </div>
    </div>
  );
}
