"use client";

import Image from "next/image";
import { FaFacebook, FaTelegramPlane, FaDiscord, FaTiktok, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#0f1117] text-gray-300 px-6 py-10">
      <div className="mx-auto max-w-7xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center md:justify-start gap-6">
          <div className="flex items-center gap-12">
            <div>
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={100}
                priority
                className="object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
              <p className="text-gray-400 text-base">Đặt vé xem phim online</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-gray-600"></div>
          </div>

          <div className="flex gap-4 text-2xl">
            <a href="https://t.me/npm" target="_blank" rel="noopener noreferrer">
              <FaTelegramPlane className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://discord.gg/hkaVYd2E" target="_blank" rel="noopener noreferrer">
              <FaDiscord className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://www.tiktok.com/@q_v326/video/7548797393932782868" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://www.youtube.com/watch?v=vS0JYFduHMA" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://www.instagram.com/vutrung_/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="cursor-pointer hover:text-white" />
            </a>
            <a href="https://www.facebook.com/Wall.Riin.T/" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="cursor-pointer hover:text-white" />
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap justify-start gap-6 text-sm font-medium">
          <a href="#" className="hover:text-white">Hỏi - Đáp</a>
          <a href="#" className="hover:text-white">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white">Điều khoản sử dụng</a>
          <a href="#" className="hover:text-white">Giới thiệu</a>
          <a href="#" className="hover:text-white">Liên hệ</a>
        </nav>

        <div className="text-start text-sm opacity-80 leading-6">
          88Ticket - Trang đặt vé xem phim trực tuyến tiện lợi, giúp bạn dễ dàng tra cứu lịch chiếu,chọn rạp,<br/>
          chọn ghế và thanh toán online chỉ trong vài bước. Mang đến trải nghiệm đặt vé nhanh chóng,an toàn.<br/>
          Không cần xếp hàng, bạn có thể nhận vé qua email và tận hưởng những bộ phim mới nhất cùng người thân.<br/>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          © {new Date().getFullYear()} 88Ticket
        </p>
      </div>
    </footer>
  );
}