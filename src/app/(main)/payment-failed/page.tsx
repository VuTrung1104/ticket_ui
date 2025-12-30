'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  const bookingId = searchParams.get('bookingId');
  const orderId = searchParams.get('orderId');
  const error = searchParams.get('error');

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push('/');
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6 animate-bounce">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Thanh toán thất bại
          </h1>
          <p className="text-lg text-gray-300">
            {error || 'Giao dịch không thành công. Vui lòng thử lại.'}
          </p>
        </div>

        {/* Transaction Info */}
        {(bookingId || orderId) && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl animate-slideUp">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              Thông tin giao dịch
            </h2>
            <div className="space-y-3">
              {bookingId && (
                <div className="flex justify-between items-center py-2 border-b border-gray-700">
                  <span className="text-gray-400">Mã đặt vé:</span>
                  <p className="text-white font-mono font-semibold">{bookingId}</p>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Mã giao dịch:</span>
                  <p className="text-white font-mono font-semibold">{orderId}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error Reasons */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 mb-8 border border-gray-700 shadow-xl animate-slideUp" style={{animationDelay: '0.1s'}}>
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            Nguyên nhân có thể
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-red-400 mt-1">•</span>
              <span>Người dùng hủy thanh toán</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-red-400 mt-1">•</span>
              <span>Tài khoản không đủ số dư</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-red-400 mt-1">•</span>
              <span>Thông tin thẻ không chính xác</span>
            </li>
            <li className="flex items-start gap-3 text-gray-300">
              <span className="text-red-400 mt-1">•</span>
              <span>Kết nối bị gián đoạn</span>
            </li>
          </ul>
        </div>

        {/* Countdown */}
        <div className="text-center mb-8 animate-slideUp" style={{animationDelay: '0.2s'}}>
          <div className="inline-flex items-center gap-2 bg-gray-800 px-6 py-3 rounded-full border border-gray-700">
            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            <span className="text-gray-300">
              Tự động về trang chủ trong <span className="text-white font-bold">{countdown}</span> giây
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid gap-4 animate-slideUp" style={{animationDelay: '0.3s'}}>
          <Link
            href="/"
            className="group relative overflow-hidden bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Link>
          <Link
            href="/lien-he"
            className="bg-transparent border-2 border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Liên hệ hỗ trợ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <PaymentFailedContent />
    </Suspense>
  );
}
