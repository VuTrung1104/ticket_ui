"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { movieService } from "@/lib/movieService";
import ImageUpload from "@/components/upload/ImageUpload";
import { GenrePicker } from "../components/GenrePicker";

const BASE_GENRES = [
  { display: "Action", value: "action" },
  { display: "Comedy", value: "comedy" },
  { display: "Drama", value: "drama" },
  { display: "Horror", value: "horror" },
];

export default function EditMoviePage() {
  const router = useRouter();
  const params = useParams();
  const movieId = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [loading, setLoading] = useState(false);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genres: [] as string[],
    duration: "",
    releaseDate: "",
    director: "",
    cast: "",
    posterUrl: "",
    trailerUrl: "",
    rating: "",
    language: "Tiếng Việt",
    ageRating: "T13",
    status: "coming-soon" as "now-showing" | "coming-soon" | "ended",
  });

  const fetchMovieData = useCallback(async () => {
    if (!movieId) return;

    try {
      setLoadingMovie(true);
      const movie = await movieService.getMovieByObjectId(movieId);

      setFormData({
        title: movie.title || "",
        description: movie.description || "",
        genres: movie.genres || [],
        duration: movie.duration?.toString() || "",
        releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split("T")[0] : "",
        director: movie.director || "",
        cast: Array.isArray(movie.cast) ? movie.cast.join(", ") : "",
        posterUrl: movie.posterUrl || "",
        trailerUrl: movie.trailerUrl || "",
        rating: movie.rating?.toString() || "",
        language: movie.language || "Tiếng Việt",
        ageRating: movie.ageRating || "T13",
        status: movie.status || "coming-soon",
      });
    } catch (error) {
      console.error("Error fetching movie:", error);
      toast.error("Không thể tải thông tin phim");
      router.push("/admin/movies");
    } finally {
      setLoadingMovie(false);
    }
  }, [movieId, router]);

  useEffect(() => {
    if (movieId && /^[0-9a-fA-F]{24}$/.test(movieId)) {
      fetchMovieData();
    } else if (movieId) {
      toast.error("ID phim không hợp lệ");
      router.push("/admin/movies");
    }
  }, [movieId, router, fetchMovieData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || formData.genres.length === 0 || !formData.duration) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const movieData = {
        title: formData.title,
        description: formData.description,
        genres: formData.genres,
        duration: parseInt(formData.duration),
        releaseDate: formData.releaseDate ? new Date(formData.releaseDate).toISOString() : undefined,
        director: formData.director || undefined,
        cast: formData.cast ? formData.cast.split(",").map(c => c.trim()) : undefined,
        posterUrl: formData.posterUrl || undefined,
        trailerUrl: formData.trailerUrl || undefined,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        language: formData.language,
        ageRating: formData.ageRating,
        status: formData.status,
        isNowShowing: formData.status === "now-showing",
      };

      await movieService.updateMovie(movieId, movieData);
      toast.success("Đã cập nhật phim thành công!");
      router.push("/admin/movies");
    } catch (error: unknown) {
      console.error("Error updating movie:", error);
      const errorMessage = error instanceof AxiosError ?
        error.response?.data?.message || "Không thể cập nhật phim" : "Không thể cập nhật phim";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingMovie) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Chỉnh sửa phim</h1>
          <p className="text-gray-400">Cập nhật thông tin chi tiết về phim</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tên phim <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Avatar: The Way of Water"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mô tả <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả phim..."
                required
              />
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thể loại <span className="text-red-500">*</span>
              </label>
              <GenrePicker
                selected={formData.genres}
                onChange={(genres) => setFormData(prev => ({ ...prev, genres }))}
                baseGenres={BASE_GENRES}
              />
            </div>

            {/* Duration & Release Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Thời lượng (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="192"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ngày phát hành
                </label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Director & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Đạo diễn</label>
                <input
                  type="text"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="James Cameron"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Đánh giá (0-10)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8.5"
                  min="0"
                  max="10"
                />
              </div>
            </div>

            {/* Cast */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Diễn viên <span className="text-sm text-gray-500">(ngăn cách bởi dấu phẩy)</span>
              </label>
              <input
                type="text"
                value={formData.cast}
                onChange={(e) => setFormData({ ...formData, cast: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Sam Worthington, Zoe Saldana"
              />
            </div>

            {/* Poster Upload */}
            <ImageUpload
              onImageUpload={(url) => setFormData({ ...formData, posterUrl: url })}
              currentImage={formData.posterUrl}
              label="Poster phim"
              folder="movies"
            />

            {/* Trailer URL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">URL Trailer</label>
              <input
                type="url"
                value={formData.trailerUrl}
                onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            {/* Language & Age Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngôn ngữ</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tiếng Việt"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Độ tuổi</label>
                <select
                  value={formData.ageRating}
                  onChange={(e) => setFormData({ ...formData, ageRating: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="P" className="bg-gray-800">P - Mọi lứa tuổi</option>
                  <option value="T13" className="bg-gray-800">T13 - Từ 13 tuổi</option>
                  <option value="T16" className="bg-gray-800">T16 - Từ 16 tuổi</option>
                  <option value="T18" className="bg-gray-800">T18 - Từ 18 tuổi</option>
                  <option value="C" className="bg-gray-800">C - Cấm khán giả dưới 18</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Trạng thái</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "now-showing" | "coming-soon" | "ended" })}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="coming-soon" className="bg-gray-800">Sắp chiếu</option>
                <option value="now-showing" className="bg-gray-800">Đang chiếu</option>
                <option value="ended" className="bg-gray-800">Đã kết thúc</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật phim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
