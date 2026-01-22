"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // OAuth callback (Google, Facebook)
    const token = searchParams.get("token");
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const user = searchParams.get("user");

    if (token || accessToken) {
      localStorage.setItem("accessToken", token || accessToken || "");
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      if (user) {
        try {
          localStorage.setItem("user", decodeURIComponent(user));
        } catch {
          // Ignore invalid user data
        }
      }
      router.push("/");
    } else {
      // If no token provided, redirect to login
      router.push("/login");
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang xử lý đăng nhập...</div>}>
      <CallbackPageContent />
    </Suspense>
  );
}
