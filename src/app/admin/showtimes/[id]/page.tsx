"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { showtimeService } from "@/lib";
import { movieService, theaterService } from "@/lib/movieService";
import { AxiosError } from "axios";
import { ShowtimeForm } from "../components/ShowtimeForm";

interface MovieData {
  _id: string;
  title: string;
  status: string;
  duration?: number;
}

interface TheaterData {
  _id: string;
  name: string;
  location: string;
  city?: string;
}

export default function EditShowtimePage() {
  const router = useRouter();
  const params = useParams();
  const showtimeId = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  
  const [loading, setLoading] = useState(false);
  const [loadingShowtime, setLoadingShowtime] = useState(true);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [theaters, setTheaters] = useState<TheaterData[]>([]);
  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    startDate: "",
    startTime: "",
    price: "",
    screenNumber: "",
    format: "2D",
    language: "Tiếng Việt",
    subtitles: "Phụ đề Việt",
  });

  useEffect(() => {
    fetchMoviesAndTheaters();
  }, []);

  const fetchMoviesAndTheaters = async () => {
    try {
      const [moviesRes, theatersRes] = await Promise.all([
        movieService.getMovies({ limit: 100 }),
        theaterService.getTheaters(),
      ]);
      setMovies((moviesRes.data || []).filter(m => m._id) as MovieData[]);
      setTheaters((theatersRes || []).map(t => ({
        _id: t._id || '',
        name: t.name || '',
        location: t.address || '',
        city: t.city || ''
      })));
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải danh sách phim và rạp");
    }
  };

  const fetchShowtimeData = useCallback(async () => {
    try {
      setLoadingShowtime(true);
      const showtime = await showtimeService.getShowtimeById(showtimeId);
      
      const startDateTime = new Date(showtime.startTime);
      const dateStr = startDateTime.toISOString().split('T')[0];
      const timeStr = startDateTime.toTimeString().slice(0, 5);

      setFormData({
        movieId: typeof showtime.movieId === 'string' ? showtime.movieId : showtime.movieId?._id || "",
        theaterId: typeof showtime.theaterId === 'string' ? showtime.theaterId : showtime.theaterId?._id || "",
        startDate: dateStr,
        startTime: timeStr,
        price: showtime.price?.toString() || "",
        screenNumber: showtime.screenNumber?.toString() || "",
        format: showtime.format || "2D",
        language: showtime.language || "Tiếng Việt",
        subtitles: showtime.subtitles || "Phụ đề Việt",
      });
    } catch (error) {
      console.error("Error fetching showtime:", error);
      toast.error("Không thể tải thông tin suất chiếu");
      router.push("/admin/showtimes");
    } finally {
      setLoadingShowtime(false);
    }
  }, [router, showtimeId]);

  useEffect(() => {
    if (showtimeId && /^[0-9a-fA-F]{24}$/.test(showtimeId) && movies.length > 0 && theaters.length > 0) {
      fetchShowtimeData();
    } else if (showtimeId && movies.length > 0 && theaters.length > 0 && !/^[0-9a-fA-F]{24}$/.test(showtimeId)) {
      toast.error("ID suất chiếu không hợp lệ");
      router.push("/admin/showtimes");
    }
  }, [fetchShowtimeData, movies.length, router, showtimeId, theaters.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.movieId || !formData.theaterId || !formData.startDate || !formData.startTime || !formData.price) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setLoading(true);
    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      
      const selectedMovie = movies.find(m => m._id === formData.movieId);
      const duration = selectedMovie?.duration || 120;
      const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

      const showtimeData = {
        movieId: formData.movieId,
        theaterId: formData.theaterId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        price: parseFloat(formData.price),
        screenNumber: formData.screenNumber ? parseInt(formData.screenNumber) : undefined,
        format: formData.format || undefined,
        language: formData.language || undefined,
        subtitles: formData.subtitles || undefined,
      };

      await showtimeService.updateShowtime(showtimeId, showtimeData);
      toast.success("Đã cập nhật suất chiếu thành công!");
      router.push("/admin/showtimes");
    } catch (error: unknown) {
      console.error("Error updating showtime:", error);
      const errorMessage = error instanceof AxiosError ? 
        error.response?.data?.message || "Không thể cập nhật suất chiếu" : "Không thể cập nhật suất chiếu";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingShowtime) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Đang tải thông tin suất chiếu...</p>
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
          <h1 className="text-4xl font-bold text-white mb-2">Chỉnh sửa suất chiếu</h1>
          <p className="text-gray-400">Cập nhật thông tin chi tiết về suất chiếu</p>
        </div>

        <ShowtimeForm
          values={formData}
          onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
          onSubmit={handleSubmit}
          loading={loading}
          movies={movies}
          theaters={theaters}
          mode="edit"
        />
      </div>

    </div>
  );
}
