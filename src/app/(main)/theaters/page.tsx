"use client";

import { useState, useEffect } from "react";
import { theaterService } from "@/lib";
import Image from "next/image";

interface Theater {
  _id?: string;
  name: string;
  city?: string;
  address: string;
  facilities?: string[];
  phone?: string;
  openTime?: string;
  closeTime?: string;
  rating?: number;
  distance?: number;
  imageUrl?: string;
  image?: string;
}

export default function TheatersPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [cities, setCities] = useState<string[]>(["Tất cả"]);
  const [selectedCity, setSelectedCity] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const mapCityName = (city?: string) => {
    if (!city) return city;
    const normalized = city.toLowerCase().trim();
    if (normalized === "ho chi minh city" || normalized === "ho chi minh") return "TP. Hồ Chí Minh";
    if (normalized === "ha noi" || normalized === "hanoi") return "Hà Nội";
    if (normalized === "da nang" || normalized === "đà nẵng") return "Đà Nẵng";
    return city;
  };

  useEffect(() => {
    const fetchTheaters = async () => {
      setLoading(true);
      try {
        const response = await theaterService.getTheaters();
        const normalizedTheaters = response.map((t) => ({
          ...t,
          city: mapCityName(t.city),
          imageUrl: t.image || t.imageUrl,
        }));

        setTheaters(normalizedTheaters);

        const uniqueCities = [
          "Tất cả",
          ...new Set(normalizedTheaters.map((t) => t.city || "Khác")),
        ] as string[];
        setCities(uniqueCities);
      } catch {
        // Ignore fetch errors
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  const filteredTheaters = theaters.filter((theater) => {
    const matchesCity = selectedCity === "Tất cả" || mapCityName(theater.city) === selectedCity;
    const matchesSearch =
      theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      theater.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Hệ Thống Rạp</h1>
          <p className="text-gray-400 text-lg">Tìm rạp chiếu phim gần bạn nhất</p>
        </div>

        {/* Filters */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tìm kiếm rạp
              </label>
              <input
                type="text"
                placeholder="Nhập tên rạp hoặc địa chỉ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Khu vực
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {cities.map((city) => (
                  <option key={city} value={city} className="bg-gray-900">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6">
            <p className="text-gray-400">
              Tìm thấy <span className="font-semibold text-white">{filteredTheaters.length}</span> rạp
            </p>
          </div>
        )}

        {/* Theaters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTheaters.map((theater) => (
            <div
              key={theater._id}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Theater Image */}
                <div className="relative w-full sm:w-56 h-64 sm:h-auto bg-gradient-to-br from-gray-800 to-gray-900 flex-shrink-0">
                  {theater.imageUrl ? (
                    <Image
                      src={theater.imageUrl}
                      alt={theater.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        src="/assets/images/anh1.jpg"
                        alt={theater.name}
                        fill
                        className="object-cover opacity-60"
                      />
                    </div>
                  )}
                  
                  {/* Facilities Tags */}
                  {theater.facilities && theater.facilities.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {theater.facilities.slice(0, 3).map((facility) => (
                        <span
                          key={facility}
                          className="bg-black/70 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-md font-medium border border-white/20"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Theater Info */}
                <div className="flex-1 p-6">
                  {/* Title & Rating */}
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors pr-2">
                      {theater.name}
                    </h3>
                    {theater.rating && (
                      <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg flex-shrink-0">
                        <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-bold text-yellow-500">{theater.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 text-gray-300 mb-3">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-sm leading-relaxed">{theater.address}</p>
                  </div>

                  {/* Distance */}
                  {theater.distance && (
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-sm">{theater.distance} km từ vị trí của bạn</span>
                    </div>
                  )}

                  {/* Opening Hours */}
                  <div className="flex items-center gap-2 text-gray-400 mb-20">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">
                      Mở cửa: {theater.openTime || "08:30"} - {theater.closeTime || "23:30"}
                    </span>
                  </div>

                  {/* Phone */}
                  {theater.phone && (
                    <div className="flex items-center gap-2 text-gray-300 mb-4">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-semibold">{theater.phone}</span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3 mt-auto pt-4">
                    <button
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(theater.address)}`, '_blank')}
                      className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-4 rounded-lg transition-all font-medium text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      Xem Bản Đồ
                    </button>
                    <button
                      onClick={() => window.location.href = `/theaters/${theater._id}`}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 px-4 rounded-lg transition-all font-bold text-sm shadow-lg shadow-red-500/30"
                    >
                      Đặt vé tại đây
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTheaters.length === 0 && (
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-2xl font-bold text-white mb-2">
              Không tìm thấy rạp chiếu nào
            </h3>
            <p className="text-gray-400">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </div>
  );
}
