"use client";

import Link from "next/link";
import Image from "next/image";
import useScroll from "../../hooks/useScroll";
import { useState } from "react";
import GenreDropDown from "../../components/ui/GenreDropDown";
import { useAuth } from "../../hooks/useAuth";

interface HeaderProps {
  onLoginOpen: () => void;
}

export default function Header({ onLoginOpen }: HeaderProps) {
  const isScrolled = useScroll(0);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${
        isScrolled ? "bg-black/60 backdrop-blur-md" : "bg-transparent"
      } text-white pointer-events-auto`}
    >
      <div className="mx-auto max-w-7xl px-2 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={150}
            height={60}
            priority
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-base">
          <Link href="/phim" className="hover:text-red-400">
            Phim
          </Link>
          <Link href="/lich" className="hover:text-red-400">
            Lịch chiếu
          </Link>
          <GenreDropDown />
          <Link href="/cum-rap" className="hover:text-red-400">
            Rạp
          </Link>
          <Link href="/gioi-thieu" className="hover:text-red-400">
            Giới thiệu
          </Link>
          <Link href="/lien-he" className="hover:text-red-400">
            Liên hệ
          </Link>
        </nav>

        <div className="flex-1 max-w-xs mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-500 py-2 px-6 rounded-lg text-base text-white bg-transparent placeholder:text-white focus:border-white focus:outline-none transition-colors"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* đăng nhập */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">Xin chào, {user.name || user.email}</span>
            <button
              onClick={logout}
              className="rounded-md bg-gray-700 hover:bg-gray-600 px-3 py-1.5 text-base font-medium"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          /* chưa đăng nhập */
          <div className="flex items-center gap-3 -mr-10">
            <button
              onClick={onLoginOpen}
              className="rounded-md bg-red-500 hover:bg-red-600 px-3 py-1.5 text-base font-medium"
            >
              Đăng nhập
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
