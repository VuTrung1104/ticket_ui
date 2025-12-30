import apiClient from "./apiClient";
import type { User } from "@/types";

export const authService = {
  async register(data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },

  async login(data: { email: string; password: string }) {
    const response = await apiClient.post<{ user: User; accessToken: string; refreshToken: string }>(
      "/auth/login",
      data
    );
    
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  },

  async getProfile() {
    const response = await apiClient.get<User>("/users/me");
    return response.data;
  },

  async updateProfile(data: Partial<User>) {
    const response = await apiClient.put<User>("/users/me", data);
    return response.data;
  },

  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await apiClient.post<{ avatarUrl: string }>("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // OAuth
  loginWithGoogle() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    window.location.href = `${apiUrl}/auth/google`;
  },

  loginWithFacebook() {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";
    window.location.href = `${apiUrl}/auth/facebook`;
  },

  // OTP
  async sendOTP(email: string) {
    const response = await apiClient.post("/auth/send-otp", { email });
    return response.data;
  },

  async verifyOTP(email: string, otp: string) {
    const response = await apiClient.post("/auth/verify-otp", { email, otp });
    return response.data;
  },

  // Password Reset
  async forgotPassword(email: string) {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    const response = await apiClient.post("/auth/reset-password", { email, otp, newPassword });
    return response.data;
  },
  
  // Refresh Token
  async refreshToken(refreshToken: string) {
    const response = await apiClient.post<{ accessToken: string }>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },
};
