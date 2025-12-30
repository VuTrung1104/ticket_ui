"use client";

import { useMemo } from "react";
import { FormatPicker } from "./FormatPicker";

const BASE_FORMATS = ["2D", "3D", "IMAX", "4DX"];

type MovieData = {
  _id: string;
  title: string;
  duration?: number;
};

type TheaterData = {
  _id: string;
  name: string;
  city?: string;
};

type ShowtimeFormValues = {
  movieId: string;
  theaterId: string;
  startDate: string;
  startTime: string;
  price: string;
  screenNumber: string;
  format: string;
  language: string;
  subtitles: string;
};

interface ShowtimeFormProps {
  values: ShowtimeFormValues;
  onChange: (updates: Partial<ShowtimeFormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  movies: MovieData[];
  theaters: TheaterData[];
  mode: "create" | "edit";
  minDate?: string;
}

export function ShowtimeForm({
  values,
  onChange,
  onSubmit,
  loading,
  movies,
  theaters,
  mode,
  minDate,
}: ShowtimeFormProps) {
  const movieMap = useMemo(() => new Map(movies.map(m => [m._id, m])), [movies]);
  const theaterMap = useMemo(() => new Map(theaters.map(t => [t._id, t])), [theaters]);

  return (
    <form onSubmit={onSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
      <div className="space-y-6">
        {/* Movie Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phim <span className="text-red-500">*</span>
          </label>
          <select
            value={values.movieId}
            onChange={(e) => onChange({ movieId: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="" className="bg-gray-800">-- Chọn phim --</option>
            {movies.map(movie => (
              <option key={movie._id} value={movie._id} className="bg-gray-800">
                {movie.title} {movie.duration ? `(${movie.duration} phút)` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Theater Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rạp chiếu <span className="text-red-500">*</span>
          </label>
          <select
            value={values.theaterId}
            onChange={(e) => onChange({ theaterId: e.target.value })}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          >
            <option value="" className="bg-gray-800">-- Chọn rạp --</option>
            {theaters.map(theater => (
              <option key={theater._id} value={theater._id} className="bg-gray-800">
                {theater.name} {theater.city ? `- ${theater.city}` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ngày chiếu <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={values.startDate}
              onChange={(e) => onChange({ startDate: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
              min={minDate}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Giờ chiếu <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={values.startTime}
              onChange={(e) => onChange({ startTime: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        {/* Price and Screen Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Giá vé (VNĐ) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={values.price}
              onChange={(e) => onChange({ price: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="75000"
              required
              min="0"
              step="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Số phòng</label>
            <input
              type="number"
              value={values.screenNumber}
              onChange={(e) => onChange({ screenNumber: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="1"
              min="1"
            />
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Định dạng</label>
          <FormatPicker
            value={values.format}
            onChange={(format) => onChange({ format })}
            baseFormats={BASE_FORMATS}
            initialCustomFormats={!BASE_FORMATS.includes(values.format) ? [values.format] : []}
          />
        </div>

        {/* Language and Subtitles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ngôn ngữ</label>
            <select
              value={values.language}
              onChange={(e) => onChange({ language: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Tiếng Việt" className="bg-gray-800">Tiếng Việt</option>
              <option value="English" className="bg-gray-800">English</option>
              <option value="Tiếng Trung" className="bg-gray-800">Tiếng Trung</option>
              <option value="Tiếng Hàn" className="bg-gray-800">Tiếng Hàn</option>
              <option value="Tiếng Nhật" className="bg-gray-800">Tiếng Nhật</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phụ đề</label>
            <select
              value={values.subtitles}
              onChange={(e) => onChange({ subtitles: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Phụ đề Việt" className="bg-gray-800">Phụ đề Việt</option>
              <option value="Phụ đề Anh" className="bg-gray-800">Phụ đề Anh</option>
              <option value="Không phụ đề" className="bg-gray-800">Không phụ đề</option>
            </select>
          </div>
        </div>

        {/* Info Box */}
        {values.movieId && values.startDate && values.startTime && (
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <h3 className="text-purple-400 font-semibold mb-2">Thông tin suất chiếu</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>Phim: <span className="text-white">{movieMap.get(values.movieId)?.title}</span></p>
              <p>Rạp: <span className="text-white">{theaterMap.get(values.theaterId)?.name}</span></p>
              <p>Thời gian: <span className="text-white">{new Date(`${values.startDate}T${values.startTime}`).toLocaleString("vi-VN")}</span></p>
              <p>Thời lượng: <span className="text-white">{movieMap.get(values.movieId)?.duration || "N/A"} phút</span></p>
              <p>Giá vé: <span className="text-white">{values.price ? parseInt(values.price).toLocaleString("vi-VN") + "đ" : "Chưa nhập"}</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
          disabled={loading}
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (mode === "create" ? "Đang tạo..." : "Đang cập nhật...") : (mode === "create" ? "Tạo suất chiếu" : "Cập nhật suất chiếu")}
        </button>
      </div>
    </form>
  );
}
