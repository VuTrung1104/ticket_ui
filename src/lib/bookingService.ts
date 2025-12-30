import apiClient from "./apiClient";
import type { Booking } from "@/types";

export const bookingService = {
  async createBooking(data: { 
    showtimeId: string; 
    seats: string[];
    totalPrice?: number;
  }) {
    const response = await apiClient.post<{
      _id: string;
      bookingCode: string;
      status: string;
      showtimeId: string;
      seats: string[];
      totalPrice: number;
      expiresAt: string;
    }>("/bookings", data);
    return response.data;
  },

  async getMyBookings(params?: { 
    page?: number; 
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    
    const query = queryParams.toString();
    const response = await apiClient.get<{
      data: Booking[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
      };
    }>(`/bookings${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getBookingById(id: string) {
    const response = await apiClient.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  async getBookingByCode(code: string) {
    const response = await apiClient.get<Booking>(`/bookings/code/${code}`);
    return response.data;
  },

  async confirmBooking(id: string, paymentData?: { 
    paymentMethod: string;
    transactionId?: string;
  }) {
    const response = await apiClient.patch<Booking>(`/bookings/${id}/confirm`, paymentData);
    return response.data;
  },

  async cancelBooking(id: string, reason?: string) {
    const response = await apiClient.patch<Booking>(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  async verifyQRCode(qrData: string) {
    const response = await apiClient.post<{
      valid: boolean;
      booking: Booking;
      message: string;
    }>("/bookings/verify-qr", { qrData });
    return response.data;
  },

  async getAllBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);
    
    const query = queryParams.toString();
    const response = await apiClient.get<{
      data: Booking[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
      };
    }>(`/bookings${query ? `?${query}` : ""}`);
    return response.data;
  },
};
