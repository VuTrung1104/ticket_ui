"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User } from "@/types";
import { authService } from "@/lib";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (data: { email: string; password: string }) => Promise<boolean>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }) => Promise<boolean>;
  logout: () => void;
  loginWithGoogle: () => void;
  loginWithFacebook: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const accessToken = localStorage.getItem("accessToken");
    
    if (savedUser && accessToken) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);

        authService.getProfile()
          .then(profile => {
            setUser(profile);
            localStorage.setItem("user", JSON.stringify(profile));
          })
          .catch(err => {
            console.error("Error fetching profile:", err);
          });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const login = async (data: { email: string; password: string }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(data);
      setUser(response.user);
      toast.success("Đăng nhập thành công!");
      setLoading(false);
      return true;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error.response?.data?.message || "Sai email hoặc mật khẩu!";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", err);
      setLoading(false);
      return false;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
  }): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await authService.register({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
      });

      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      setLoading(false);
      router.push("/login");
      return true;
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const errorMessage = error?.response?.data?.message || "Lỗi kết nối server!";
      console.error("Register error details:", error?.response?.data);
      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
      return false;
    }
  };

  const loginWithGoogle = () => {
    authService.loginWithGoogle();
  };

  const loginWithFacebook = () => {
    authService.loginWithFacebook();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    
    setUser(null);
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