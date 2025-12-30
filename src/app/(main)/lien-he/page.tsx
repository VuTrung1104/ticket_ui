"use client";

import {
  FaTelegramPlane,
  FaDiscord,
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

export default function Contact() {
  return (
    <div className="bg-[#181b24] text-gray-300 px-6 py-12 pt-24">
      <div className="mx-auto max-w-5xl flex flex-col gap-10">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Liên hệ</h1>
          <p className="text-gray-400 max-w-3xl mx-auto">
            Chào mừng bạn đến với trang <b>Liên Hệ</b> của 88Ticket! Chúng
            tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn để mang lại trải nghiệm
            tốt nhất khi sử dụng dịch vụ. Nếu có bất kỳ câu hỏi, góp ý, hoặc yêu
            cầu hỗ trợ nào, hãy liên hệ với chúng tôi qua các thông tin dưới
            đây.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            1. Thông Tin Liên Hệ Chính
          </h2>
          <p>
            Email hỗ trợ khách hàng:{" "}
            <span className="font-semibold text-white">
              lienhe@88ticket.com
            </span>
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <b>Vấn đề tài khoản:</b> Quên mật khẩu, không thể truy cập, và các
              vấn đề liên quan đến tài khoản.
            </li>
            <li>
              <b>Hỗ trợ kỹ thuật:</b> Sự cố khi đặt vé, thanh toán hoặc các lỗi
              khác khi sử dụng trang web.
            </li>
            <li>
              <b>Đóng góp ý kiến:</b> Chúng tôi trân trọng mọi ý kiến đóng góp
              từ bạn để nâng cao chất lượng dịch vụ.
            </li>
          </ul>
          <p>
            Email liên hệ về Chính Sách Riêng Tư:{" "}
            <span className="font-semibold text-white">
              privacy@88ticket.com
            </span>
          </p>
          <p className="text-sm text-gray-400">
            Mọi thắc mắc liên quan đến bảo mật thông tin và chính sách riêng tư
            của 88Ticket.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-white">
            2. Liên Hệ Qua Mạng Xã Hội
          </h2>
          <p>
            Ngoài email, bạn cũng có thể liên hệ và cập nhật thông tin mới nhất
            từ 88Ticket qua các kênh mạng xã hội của chúng tôi:
          </p>

          <div className="flex flex-col gap-3 text-base">
            <a
              href="https://t.me/npm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-fit"
            >
              <FaTelegramPlane className="text-xl" /> Telegram: https://t.me/88ticket
            </a>
            <a
              href="https://discord.gg/hkaVYd2E"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-fit"
            >
              <FaDiscord className="text-xl" /> Discord:
              https://discord.gg/88ticket
            </a>
            <a
              href="https://www.facebook.com/Wall.Riin.T/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-fit"
            >
              <FaFacebook className="text-xl" /> Facebook:
              facebook.com/Wall.Riin.T
            </a>
            <a
              href="https://www.instagram.com/vutrung_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-fit"
            >
              <FaInstagram className="text-xl" /> Instagram:
              instagram.com/88ticket
            </a>
            <a
              href="https://www.tiktok.com/@q_v326/video/7548797393932782868"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-fit"
            >
              <FaTiktok className="text-xl" /> Tiktok: tiktok.com/@88ticket
            </a>
            <a
              href="https://www.youtube.com/watch?v=vS0JYFduHMA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg w-fit"
            >
              <FaYoutube className="text-xl" /> Youtube:
              youtube.com/@88Ticket
            </a>
          </div>
        </section>
        <p className="text-gray-400 mt-4">
          Chúng tôi rất vui khi được hỗ trợ bạn và mong muốn mang đến trải
          nghiệm xem phim trực tuyến tốt nhất!<br/>
          <b>
            88Ticket - Cùng bạn khám phá thế giới giải trí đa dạng, an toàn và miễn phí!
          </b>
        </p>
      </div>
    </div>
  );
}
