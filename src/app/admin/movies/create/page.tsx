"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { movieService } from "@/lib/movieService";
import { AxiosError } from "axios";
import ImageUpload from "@/components/upload/ImageUpload";
import { GenrePicker } from "../components/GenrePicker";

const BASE_GENRES = [
  { display: "Action", value: "action" },
  { display: "Comedy", value: "comedy" },
  { display: "Drama", value: "drama" },
  { display: "Horror", value: "horror" },
  { display: "Romance", value: "romance" },
  { display: "Sci-Fi", value: "sci-fi" },
  { display: "Thriller", value: "thriller" },
  { display: "Animation", value: "animation" },
];

export default function CreateMoviePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
    status: "coming-soon" as "now-showing" | "coming-soon",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || formData.genres.length === 0 || !formData.duration || !formData.releaseDate) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const movieData = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        description: formData.description,
        genres: formData.genres,
        duration: parseInt(formData.duration),
        releaseDate: new Date(formData.releaseDate).toISOString(),
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

      await movieService.createMovie(movieData);
      toast.success("Đã thêm phim mới thành công!");
      router.push("/admin/movies");
    } catch (error: unknown) {
      const errorMessage = error instanceof AxiosError ? 
        error.response?.data?.message || "Không thể thêm phim mới" : "Không thể thêm phim mới";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
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
          <h1 className="text-4xl font-bold text-white mb-2">Thêm phim mới</h1>
          <p className="text-gray-400">Điền thông tin chi tiết về phim</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tên phim *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Avatar: The Way of Water"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mô tả phim..."
                required
              />
            </div>

            {/* Genres */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Thể loại *</label>
              <GenrePicker
                selected={formData.genres}
                onChange={(genres) => setFormData(prev => ({ ...prev, genres }))}
                baseGenres={BASE_GENRES}
              />
            </div>

            {/* Duration & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Thời lượng (phút) *</label>

                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngày phát hành *</label>
                <input
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData({...formData, releaseDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
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
                  onChange={(e) => setFormData({...formData, director: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, rating: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="8.5"
                  min="0"
                  max="10"
                />
              </div>
            </div>

            {/* Poster & Trailer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Poster phim</label>
                <ImageUpload
                  onImageUpload={(url) => setFormData({...formData, posterUrl: url})}
                  currentImage={formData.posterUrl}
                  folder="movies"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">URL Trailer</label>
                <input
                  type="url"
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData({...formData, trailerUrl: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                {formData.trailerUrl && (
                  <div className="mt-3">
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/50">
                      <iframe
                        src={formData.trailerUrl.replace('watch?v=', 'embed/')}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Language & Age Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ngôn ngữ</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({...formData, language: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Độ tuổi</label>
                <select
                  value={formData.ageRating}
                  onChange={(e) => setFormData({...formData, ageRating: e.target.value})}
                  className="w-full bg-gray-800 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="P">P - Mọi lứa tuổi</option>
                  <option value="T13">T13 - Từ 13 tuổi</option>
                  <option value="T16">T16 - Từ 16 tuổi</option>
                  <option value="T18">T18 - Từ 18 tuổi</option>
                  <option value="C">C - Cấm dưới 18</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl border border-white/10"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {loading ? "Đang thêm..." : "Thêm phim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}