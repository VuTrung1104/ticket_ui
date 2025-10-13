"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function GenreDropDown() {
  const [open, setOpen] = useState(false);

  const genres = [
    "Chính Kịch", "Lãng Mạn", "Gia Đình", "Hành Động", 
    "Kịch Tính", "Lịch Sử", "Hoạt Hình", "Trinh Thám",
    "Bí Ẩn", "Chiến Tranh", "Tình Cảm", "Kinh Dị", 
    "Giả Tưởng", "Thanh Xuân", "Hài", "Tâm Linh", 
    "Phiêu Lưu", "Viễn Tưởng", "Tội Phạm", "Hình Sự", 
    "Hồi Hộp", "Khoa Học Viễn Tưởng", "Thần Thoại", "Âm Nhạc",
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        className="flex items-center gap-1 hover:text-red-400 transition-colors"
      >
        Thể Loại
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-[750px] rounded-xl bg-black/70 backdrop-blur-md border border-white/10 shadow-lg p-5 grid grid-cols-4 gap-x-8 gap-y-4 text-sm text-white z-50">
          {genres.map((genre) => (
            <Link
              key={genre}
              href={`/the-loai/${encodeURIComponent(genre.toLowerCase())}`}
              className="hover:text-red-400 transition-colors"
            >
              {genre}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
