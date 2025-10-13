"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<boolean>;
  logout: () => void;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Toggle này để chuyển đổi giữa fake data và API thật
const USE_FAKE_AUTH = true; // Đổi thành false khi muốn dùng API thật

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // fake login
  const fakeUsers = [
    { id: "1", email: "admin@gmail.com", password: "admin", name: "Admin" },
    { id: "2", email: "test@gmail.com", password: "123456", name: "Test User" },
  ];

  // Load user từ localStorage khi mount component
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    
    if (savedUser && accessToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const login = async (data: { email: string; password: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // FAKE LOGIN
    if (USE_FAKE_AUTH) {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const foundUser = fakeUsers.find(
        (u) => u.email === data.email && u.password === data.password
      );

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("user", JSON.stringify(foundUser));
        localStorage.setItem("accessToken", "fake-token-" + foundUser.id);
        setLoading(false);
        return true;
      } else {
        setError("Sai email hoặc mật khẩu!");
        setLoading(false);
        return false;
      }
    }

    // API THẬT
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("user", JSON.stringify(result.user));
        setUser(result.user);
        setLoading(false);
        return true;
      } else {
        setError(result.message || "Sai email hoặc mật khẩu!");
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError("Lỗi kết nối server!");
      console.error("Login error:", err);
      setLoading(false);
      return false;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    // FAKE REGISTER
    if (USE_FAKE_AUTH) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const exists = fakeUsers.some((u) => u.email === data.email);
      if (exists) {
        setError("Email đã được sử dụng!");
        toast.error("Email đã tồn tại");
        setLoading(false);
        return false;
      }

      // Chỉ lưu thông tin đăng ký vào localStorage để fake database
      // KHÔNG set user state và KHÔNG lưu token
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      registeredUsers.push({
        id: Date.now().toString(),
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
      });
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setLoading(false);
      router.push("/");
      return true;
    }

    // API THẬT
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // KHÔNG tự động đăng nhập
        // Chỉ thông báo thành công và chuyển về trang login
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        setLoading(false);
        router.push("/");
        return true;
      } else {
        setError(result.message || "Email đã được sử dụng!");
        toast.error(result.message || "Đăng ký thất bại");
        setLoading(false);
        return false;
      }
    } catch (err) {
      setError("Lỗi kết nối server!");
      toast.error("Lỗi kết nối server!");
      console.error("Register error:", err);
      setLoading(false);
      return false;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const loginWithFacebook = () => {
    window.location.href = `${API_URL}/auth/facebook`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    toast.success("Đã đăng xuất");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        loginWithGoogle,
        loginWithFacebook,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};