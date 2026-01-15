import apiClient from "./apiClient";
import type { User } from "@/types";

export const userService = {
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
    const response = await apiClient.post<{ message: string; avatar: string }>("/users/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }) {
    const response = await apiClient.post("/users/change-password", data);
    return response.data;
  },

  async getAllUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("role", params.role);
    
    const query = queryParams.toString();
    const response = await apiClient.get<{
      data: User[];
      meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage?: boolean;
        hasPrevPage?: boolean;
      };
    }>(`/users${query ? `?${query}` : ""}`);
    return response.data;
  },

  async getUserById(id: string) {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  async updateUser(id: string, data: Partial<User>) {
    const response = await apiClient.patch<User>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },

  async lockUser(id: string, data: { reason: string; lockUntil?: string }) {
    const response = await apiClient.patch(`/users/${id}/lock`, data);
    return response.data;
  },

  async unlockUser(id: string) {
    const response = await apiClient.patch(`/users/${id}/unlock`);
    return response.data;
  },
};
