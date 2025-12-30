import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-black flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Animation */}
        <div className="relative mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-red-600/30 animate-ping"></div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Oops! Trang không tồn tại
          </h2>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Có vẻ như bạn đã đi lạc. Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
        </div>

        {/* Suggestions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-md mx-auto mb-8">
          <h3 className="text-white font-semibold mb-4">Bạn có thể:</h3>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Kiểm tra lại URL bạn đã nhập</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Quay lại trang chủ và tìm phim yêu thích</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>Liên hệ hỗ trợ nếu bạn nghĩ đây là lỗi</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-red-600/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về Trang Chủ
          </Link>
          <Link
            href="/movies"
            className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3.5 rounded-xl font-semibold text-white transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            Xem Phim
          </Link>
        </div>
      </div>
    </div>
  );
}
