"use client";

import { useAuth } from "../hooks/useAuth";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return <div className="p-6 text-center">Bạn chưa đăng nhập</div>;
  }

  return (
    <div className="p-6 space-y-4 text-center">
      <h1 className="text-2xl font-bold">Xin chào, {user.name}</h1>
      <p>Email: {user.email}</p>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-md"
      >
        Đăng xuất
      </button>
    </div>
  );
}
