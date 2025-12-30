"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // OAuth callback (Google, Facebook)
    const code = searchParams.get("code");
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      router.push("/");
    } else if (code) {
      // TODO: Implement OAuth flow
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
