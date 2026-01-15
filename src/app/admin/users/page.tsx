"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { userService } from "@/lib";
import type { User } from "@/types";

type UserRole = "all" | "user" | "admin";
type UserStatus = "all" | "active" | "blocked";

type UserData = User & {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  role?: User["role"] | string;
  status?: string;
  isLocked?: boolean;
  totalBookings?: number;
  createdAt?: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<UserRole>("all");
  const [filterStatus, setFilterStatus] = useState<UserStatus>("all");
  const limit = 10;
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers({
        page,
        limit,
        role: filterRole === "all" ? undefined : filterRole,
        search: searchTerm || undefined,
      });
      
      // Handle both array response and object with data property
      const list = Array.isArray(response) ? response : (response?.data ?? []);
      const pagination = Array.isArray(response) ? null : response?.meta;
      
      setUsers(list as UserData[]);
      if (pagination) {
        setMeta({
          total: pagination.total ?? list.length,
          page: pagination.page ?? page,
          limit: pagination.limit ?? limit,
          totalPages: pagination.totalPages ?? 1,
          hasNextPage: pagination.hasNextPage ?? false,
          hasPrevPage: pagination.hasPrevPage ?? false,
        });
      } else {
        const total = list.length;
        setMeta({
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit)),
          hasNextPage: false,
          hasPrevPage: page > 1,
        });
      }
    } catch (error) {
      toast.error("Lỗi khi tải danh sách người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [filterRole, limit, page, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 250);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => {
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && !user.isLocked) ||
      (filterStatus === "blocked" && user.isLocked);
    return matchesStatus;
  });

  const pageNumbers = Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1);

  const handleBlockUser = async (id?: string, name?: string, isLocked?: boolean) => {
    if (!id) return;
    const displayName = name || "Người dùng";
    const action = isLocked ? "mở khóa" : "khóa";
    
    if (confirm(`Bạn có chắc muốn ${action} tài khoản "${displayName}"?`)) {
      try {
        if (isLocked) {
          // Call unlock endpoint
          await userService.unlockUser(id);
          setUsers(users.map(u => u._id === id ? { ...u, isLocked: false, lockUntil: undefined, lockReason: undefined } : u));
        } else {
          // Call lock endpoint
          await userService.lockUser(id, { reason: "Khóa bởi admin" });
          setUsers(users.map(u => u._id === id ? { ...u, isLocked: true } : u));
        }
        toast.success(`Đã ${action} tài khoản thành công!`);
      } catch {
        toast.error(`Lỗi khi ${action} tài khoản`);
      }
    }
  };

  const handleDeleteUser = async (id?: string, name?: string) => {
    if (!id) return;
    const displayName = name || "Người dùng";
    if (confirm(`Bạn có chắc muốn xóa người dùng "${displayName}"?`)) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
        toast.success("Đã xóa người dùng thành công!");
      } catch {
        toast.error("Lỗi khi xóa người dùng");
      }
    }
  };

  const handleChangeRole = async (id?: string, currentRole?: string) => {
    if (!id) return;
    const safeRole = currentRole === "admin" ? "admin" : "user";
    const newRole = safeRole === "user" ? "admin" : "user";
    try {
      await userService.updateUser(id, { role: newRole });
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
      toast.success(
        `Đã thay đổi quyền thành ${newRole === "admin" ? "Admin" : "User"}! ` +
        `${newRole === "admin" ? "Người dùng cần đăng xuất và đăng nhập lại để áp dụng quyền mới." : ""}`
      );
    } catch (error) {
      toast.error("Lỗi khi thay đổi quyền");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quản lý người dùng</h1>
            <p className="text-gray-400">Quản lý tài khoản và phân quyền người dùng</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-md border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{meta.total || users.length}</p>
                <p className="text-sm text-gray-400">Tổng người dùng</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-md border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => !u.isLocked).length}</p>
                <p className="text-sm text-gray-400">Đang hoạt động</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 backdrop-blur-md border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.isLocked).length}</p>
                <p className="text-sm text-gray-400">Đã khóa</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-md border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === "admin").length}</p>
                <p className="text-sm text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Người dùng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Liên hệ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Vai trò</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Ngày tham gia</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Số vé đã đặt</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-lg">Đang tải danh sách người dùng...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-gray-400 text-lg">Không tìm thấy người dùng nào</p>
                        <p className="text-gray-500 text-sm">Có thể chưa có người dùng nào đăng ký hoặc bộ lọc không khớp</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {user.fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.fullName || user.email}</p>
                            <p className="text-sm text-gray-400">ID: {user._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{user.email}</p>
                        <p className="text-gray-400 text-sm">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleChangeRole(user._id, user.role)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          } hover:bg-opacity-80 transition-all`}
                        >
                          {user.role === "admin" ? "Admin" : "User"}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            !user.isLocked
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {!user.isLocked ? "Hoạt động" : "Đã khóa"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm text-center">
                        {user.totalBookings || 0} vé
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleBlockUser(user._id, user.fullName || user.email, user.isLocked || false)}
                            className={`p-2 rounded-lg transition-all ${
                              !user.isLocked
                                ? "bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                : "bg-green-500/10 hover:bg-green-500/20 text-green-400"
                            }`}
                            title={!user.isLocked ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {!user.isLocked ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id, user.fullName || user.email)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                            title="Xóa người dùng"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Trang {meta.page}/{meta.totalPages} • {meta.total} người dùng
            </p>
            <div className="flex items-center gap-2">
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    num === page
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
