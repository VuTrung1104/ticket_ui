"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useScroll from "@/hooks/useScroll";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Header() {
  const isScrolled = useScroll(0);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  // debounce search input for prefetch or future API search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (debouncedQuery) {
      router.prefetch(`/movies?search=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSearchSubmit = () => {
    const query = searchQuery.trim();
    if (!query) return;
    router.push(`/movies?search=${encodeURIComponent(query)}`);
    setIsMobileOpen(false);
  };

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
            style={{ width: 'auto', height: 'auto' }}
            className="object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-10 text-lg">
          <Link href="/movies" className="hover:text-red-400">
            Phim
          </Link>
          <Link href="/theaters" className="hover:text-red-400">
            Rạp chiếu
          </Link>
          <Link href="/showtimes" className="hover:text-red-400">
            Lịch chiếu
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
              className="w-full flex items-center justify-center gap-3 border-2 border-gray-500 py-2 px-6 rounded-lg text-base text-white bg-transparent placeholder:text-white focus:border-white focus:outline-none transition-colors"
            />
            <button
              aria-label="Tìm kiếm phim"
              onClick={handleSearchSubmit}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
            >
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

        {/* Mobile menu toggle */}
        <button
          aria-label="Mở menu"
          className="md:hidden text-white ml-2 p-2 rounded-md hover:bg-white/10"
          onClick={() => setIsMobileOpen((v) => !v)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Login */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {getInitials(user.fullName || user.email)}
              </div>
              <svg 
                className={`w-4 h-4 text-white transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-white">{user.fullName || "User"}</p>
                    {user.role === "admin" && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="py-1">
                  {/* Admin Dashboard */}
                  {user.role === "admin" && (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-yellow-400 hover:bg-white/10 transition-colors font-medium"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Quản trị hệ thống
                      </Link>
                      <div className="border-t border-white/10 my-1"></div>
                    </>
                  )}

                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Tài khoản
                  </Link>
                  
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Yêu thích
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Vé của tôi
                  </Link>
                  
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Lịch sử đặt vé
                  </Link>
                </div>

                <div className="border-t border-white/10">
                  <button
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* chưa đăng nhập */
          <div className="flex items-center gap-3 -mr-10">
            <Link
              href="/login"
              className="rounded-md bg-red-500 hover:bg-red-600 px-3 py-1.5 text-base font-medium"
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-lg border-t border-white/10 px-4 pb-4 pt-2">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm phim"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearchSubmit();
                }}
                className="w-full border border-gray-600 py-2 px-3 rounded-lg text-sm bg-transparent text-white placeholder:text-gray-300 focus:border-white"
              />
              <button
                aria-label="Tìm kiếm phim"
                onClick={handleSearchSubmit}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href="/movies" className="py-2 px-3 rounded bg-white/5 hover:bg-white/10" onClick={() => setIsMobileOpen(false)}>
                Phim
              </Link>
              <Link href="/theaters" className="py-2 px-3 rounded bg-white/5 hover:bg-white/10" onClick={() => setIsMobileOpen(false)}>
                Rạp chiếu
              </Link>
              <Link href="/showtimes" className="py-2 px-3 rounded bg-white/5 hover:bg-white/10" onClick={() => setIsMobileOpen(false)}>
                Lịch chiếu
              </Link>
              <Link href="/gioi-thieu" className="py-2 px-3 rounded bg-white/5 hover:bg-white/10" onClick={() => setIsMobileOpen(false)}>
                Giới thiệu
              </Link>
              <Link href="/lien-he" className="py-2 px-3 rounded bg-white/5 hover:bg-white/10" onClick={() => setIsMobileOpen(false)}>
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
