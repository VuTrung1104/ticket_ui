import apiClient from "./apiClient";

export const uploadService = {
  async uploadImage(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{ url: string; publicId: string }>(
      "/upload/image",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};
