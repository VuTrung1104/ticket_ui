import apiClient from "./apiClient";
import type { Showtime } from "@/types";

export const showtimeService = {
  async getShowtimes(params?: {
    movieId?: string;
    theaterId?: string;
    date?: string; 
  }) {
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

  async getAvailableSeats(id: string) {
    const response = await apiClient.get<{
      showtimeId: string;
      bookedSeats: string[];
      lockedSeats?: string[];
      availableSeats: number;
    }>(`/showtimes/${id}/seats`);
    return response.data;
  },

  async createShowtime(data: {
    movieId: string;
    theaterId: string;
    startTime: string;
    endTime: string;
    price: number;
    screenNumber?: number;
    format?: string;
    language?: string;
    subtitles?: string;
  }) {
    const response = await apiClient.post<Showtime>("/showtimes", data);
    return response.data;
  },

  async updateShowtime(id: string, data: Partial<{
    movieId: string;
    theaterId: string;
    startTime: string;
    endTime: string;
    price: number;
    screenNumber?: number;
    format?: string;
    language?: string;
    subtitles?: string;
  }>) {
    const response = await apiClient.patch<Showtime>(`/showtimes/${id}`, data);
    return response.data;
  },

  async deleteShowtime(id: string) {
    const response = await apiClient.delete(`/showtimes/${id}`);
    return response.data;
  },
};
