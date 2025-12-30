"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function CreateShowtimePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
      setMovies(moviesRes.data as unknown as MovieData[] || []);
      setTheaters(theatersRes as unknown as TheaterData[] || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Không thể tải danh sách phim và rạp");
    }
  };


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

      await showtimeService.createShowtime(showtimeData);
      toast.success("Đã tạo suất chiếu mới thành công!");
      router.push("/admin/showtimes");
    } catch (error: unknown) {
      console.error("Error creating showtime:", error);
      const errorMessage = error instanceof AxiosError ? 
        error.response?.data?.message || "Không thể tạo suất chiếu mới" : "Không thể tạo suất chiếu mới";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-4xl font-bold text-white mb-2">Tạo suất chiếu mới</h1>
          <p className="text-gray-400">Điền thông tin chi tiết về suất chiếu</p>
        </div>

        <ShowtimeForm
          values={formData}
          onChange={(updates) => setFormData(prev => ({ ...prev, ...updates }))}
          onSubmit={handleSubmit}
          loading={loading}
          movies={movies}
          theaters={theaters}
          mode="create"
          minDate={new Date().toISOString().split('T')[0]}
        />
      </div>

    </div>
  );
}
