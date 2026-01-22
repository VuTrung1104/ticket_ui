"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { theaterService } from "@/lib";
import Link from "next/link";
import Image from "next/image";
import type { Theater } from "@/types";

export default function AdminTheatersPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const limit = 10;
  const [page, setPage] = useState(1);  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    theater: { id: string; name: string } | null;
  }>({ isOpen: false, theater: null });

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const data = await theaterService.getTheaters();
      setTheaters(data);
    } catch {
      toast.error("Lỗi khi tải danh sách rạp");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const filteredTheaters = theaters;

  // Pagination
  const totalPages = Math.ceil(filteredTheaters.length / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedTheaters = filteredTheaters.slice(startIndex, endIndex);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handleDelete = async () => {
    if (!deleteModal.theater) return;
    try {
      await theaterService.deleteTheater(deleteModal.theater.id);
      setTheaters(theaters.filter((t) => t._id !== deleteModal.theater?.id));
      toast.success("Đã xóa rạp thành công!");
      setDeleteModal({ isOpen: false, theater: null });
    } catch {
      toast.error("Lỗi khi xóa rạp");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Quản lý rạp chiếu</h1>
            <p className="text-gray-400">Quản lý thông tin rạp và phòng chiếu</p>
          </div>
          <Link
            href="/admin/theaters/create"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Thêm rạp mới
          </Link>
        </div>



        {/* Theaters Table */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Hình ảnh</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tên rạp</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Địa chỉ</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Thành phố</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                        <p className="text-gray-400 text-lg">Đang tải danh sách rạp...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTheaters.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <p className="text-gray-400 text-lg">Không tìm thấy rạp chiếu</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTheaters.map((theater) => (
                    <tr key={theater._id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-20 h-20 relative rounded-lg overflow-hidden">
                          {theater.image ? (
                            <Image
                              src={theater.image}
                              alt={theater.name}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-white font-medium">{theater.name}</div>
                        {theater.phone && <div className="text-sm text-gray-400">{theater.phone}</div>}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm max-w-xs">{theater.address}</td>
                      <td className="px-6 py-4 text-gray-300">{theater.city || "-"}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/theaters/${theater._id}`}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                            title="Sửa"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button
                            onClick={() => theater._id && setDeleteModal({ isOpen: true, theater: { id: theater._id, name: theater.name } })}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                            title="Xóa"
                            disabled={!theater._id}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        {filteredTheaters.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Trang {page}/{totalPages} • {filteredTheaters.length} rạp
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

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Xác nhận xóa rạp</h3>
                <p className="text-gray-400 text-sm">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">
              Bạn có chắc chắn muốn xóa rạp <span className="font-semibold text-white">&quot;{deleteModal.theater?.name}&quot;</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ isOpen: false, theater: null })}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors"
              >
                Xóa rạp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
