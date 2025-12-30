"use client";

export default function AdditionalInfo() {
  return (
    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
      <h4 className="font-semibold text-blue-400 mb-3 flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Lưu ý
      </h4>
      <ul className="space-y-2 text-sm text-blue-300">
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Vui lòng có mặt trước giờ chiếu 15 phút để làm thủ tục vào phòng</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Vé đã mua không thể đổi hoặc hoàn trả</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Không mang thức ăn và đồ uống từ bên ngoài vào rạp</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 mt-1">•</span>
          <span>Vui lòng tắt điện thoại hoặc để chế độ im lặng trong suất chiếu</span>
        </li>
      </ul>
    </div>
  );
}
