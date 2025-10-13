"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const user = params.get("user");

    if (accessToken && refreshToken && user) {
      // Lưu token user vào localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("user", user);

      // Redirect về trang chủ
      router.push("/");
    }
  }, [params, router]);

  return <p>Đang xử lý đăng nhập...</p>;
}
