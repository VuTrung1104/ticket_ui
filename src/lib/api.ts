const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = localStorage.getItem("accessToken");
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    };

    let response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { accessToken } = await refreshResponse.json();
            localStorage.setItem("accessToken", accessToken);

            response = await fetch(`${API_URL}${endpoint}`, {
              ...options,
              headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
              },
            });
          } else {
            localStorage.clear();
            window.location.href = "/login";
            throw new Error("Session expired. Please login again.");
          }
        } catch (error) {
          localStorage.clear();
          window.location.href = "/login";
          throw error;
        }
      } else {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error("Authentication required");
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API request failed with status ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      headers: data instanceof FormData ? {} : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiService();
