import apiClient from "./apiClient";
import type { Movie, Theater, Showtime } from "@/types";

export const movieService = {
  async getMovies(params?: { 
    page?: number; 
    limit?: number; 
    search?: string;
    status?: "now-showing" | "coming-soon" | "ended";
    genre?: string;
    sortBy?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.genre) queryParams.append("genre", params.genre);
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    
    const query = queryParams.toString();
    const response = await apiClient.get<{
      data: Movie[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(`/movies${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getMovieById(slug: string) {
    const response = await apiClient.get<Movie>(`/movies/slug/${slug}`);
    return response.data;
  },

  async getMovieByObjectId(id: string) {
    const response = await apiClient.get<Movie>(`/movies/${id}`);
    return response.data;
  },

  async createMovie(data: Omit<Movie, "_id">) {
    const response = await apiClient.post<Movie>("/movies", data);
    return response.data;
  },

  async updateMovie(id: string, data: Partial<Movie>) {
    const response = await apiClient.patch<Movie>(`/movies/${id}`, data);
    return response.data;
  },

  async deleteMovie(id: string) {
    const response = await apiClient.delete(`/movies/${id}`);
    return response.data;
  },
};

export const theaterService = {
  async getTheaters(city?: string) {
    const query = city ? `?city=${city}` : "";
    const response = await apiClient.get<Theater[]>(`/theaters${query}`);
    return response.data;
  },

  async getTheaterById(id: string) {
    const response = await apiClient.get<Theater>(`/theaters/${id}`);
    return response.data;
  },

  async createTheater(data: Omit<Theater, "_id">) {
    const response = await apiClient.post<Theater>("/theaters", data);
    return response.data;
  },

  async updateTheater(id: string, data: Partial<Theater>) {
    const response = await apiClient.patch<Theater>(`/theaters/${id}`, data);
    return response.data;
  },

  async deleteTheater(id: string) {
    const response = await apiClient.delete(`/theaters/${id}`);
    return response.data;
  },
};

export const showtimeService = {
  async getShowtimes(params?: { movieId?: string; theaterId?: string; date?: string }) {
    const queryParams = new URLSearchParams();
    if (params?.movieId) queryParams.append("movieId", params.movieId);
    if (params?.theaterId) queryParams.append("theaterId", params.theaterId);
    if (params?.date) queryParams.append("date", params.date);
    
    const query = queryParams.toString();
    const response = await apiClient.get<Showtime[]>(`/showtimes${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getShowtimeById(id: string) {
    const response = await apiClient.get<Showtime>(`/showtimes/${id}`);
    return response.data;
  },

  async getAvailableSeats(showtimeId: string) {
    const response = await apiClient.get<{
      totalSeats: number;
      availableSeats: number;
      bookedSeats: string[];
      lockedSeats: string[];
    }>(`/showtimes/${showtimeId}/seats`);
    return response.data;
  },

  async createShowtime(data: Omit<Showtime, "_id">) {
    const response = await apiClient.post<Showtime>("/showtimes", data);
    return response.data;
  },

  async updateShowtime(id: string, data: Partial<Showtime>) {
    const response = await apiClient.patch<Showtime>(`/showtimes/${id}`, data);
    return response.data;
  },

  async deleteShowtime(id: string) {
    const response = await apiClient.delete(`/showtimes/${id}`);
    return response.data;
  },
};
