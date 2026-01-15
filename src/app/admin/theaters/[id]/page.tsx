"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { theaterService } from "@/lib";
import { uploadService } from "@/lib/uploadService";

type Theater = {
  _id: string;
  name: string;
  address: string;
  city?: string;
  phone?: string;
  image?: string;
  totalSeats: number;
  rows: number[];
  isActive: boolean;
};

export default function EditTheaterPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    totalSeats: 0,
    rows: [] as number[],
    image: "",
  });

  useEffect(() => {
    if (id) {
      fetchTheater();
    }
  }, [id]);

  const fetchTheater = async () => {
    try {
      setFetchLoading(true);
      const data = await theaterService.getTheaterById(id);
      setFormData({
        name: data.name || "",
        address: data.address || "",
        city: data.city || "",
        phone: data.phone || "",
        totalSeats: data.totalSeats || 0,
        rows: data.rows || [],
        image: data.image || "",
      });
      if (data.image) {
        setImagePreview(data.image);
      }
    } catch (error) {
      toast.error("Lỗi khi tải thông tin rạp");
      router.push("/admin/theaters");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRowsChange = (value: string) => {
    const rows = value.split(",").map((r) => parseInt(r.trim())).filter((r) => !isNaN(r));
    setFormData({ ...formData, rows });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = formData.image;
      if (imageFile) {
        const uploadResult = await uploadService.uploadImage(imageFile);
        imageUrl = uploadResult.url;
      }

      await theaterService.updateTheater(id, {
        ...formData,
        image: imageUrl || undefined,
      });

      toast.success("Cập nhật rạp thành công!");
      router.push("/admin/theaters");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật rạp");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-gray-400 text-lg">Đang tải thông tin rạp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 pt-8 pb-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Chỉnh sửa rạp</h1>
          <p className="text-gray-400">Cập nhật thông tin rạp chiếu</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hình ảnh rạp</label>
            <div className="flex items-start gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
                <p className="text-sm text-gray-400 mt-2">JPG, PNG hoặc WEBP (Tối đa 5MB)</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tên rạp *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: CGV Vincom"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Địa chỉ *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Tầng 5, TTTM Vincom"
              required
            />
          </div>

          {/* City & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Thành phố</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Hồ Chí Minh"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Số điện thoại</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: 0123456789"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật rạp"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
