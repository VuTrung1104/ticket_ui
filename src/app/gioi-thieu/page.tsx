"use client";

export default function AboutPage() {
  return (
    <div className="bg-[#181b24] text-gray-300 px-6 py-12 pt-24">
      <div className="mx-auto max-w-5xl flex flex-col gap-10 leading-relaxed">
        <section>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            88Ticket — Nền tảng đặt vé xem phim
          </h1>
          <p className="text-gray-400 max-w-3xl">
            88Ticket là nền tảng bán vé xem phim trực tuyến hiện đại, mang đến
            sự tiện lợi và nhanh chóng cho hàng triệu khán giả yêu điện ảnh. Với
            tiêu chí nhanh - tiện - an toàn, 88Ticket trở thành lựa chọn hàng
            đầu cho những ai muốn đặt vé mọi lúc, mọi nơi chỉ với vài thao tác
            đơn giản.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Cách hoạt động
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-400">
            <li>Chọn phim → chọn rạp → chọn suất chiếu.</li>
            <li>Hệ thống hiển thị sơ đồ ghế → chọn ghế còn trống.</li>
            <li>
              Xác nhận, thanh toán và nhận vé điện tử (QR code) qua email/SMS.
            </li>
            <li>Xuất vé QR tại rạp để check-in nhanh chóng.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Tính năng nổi bật
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>Đặt vé theo thời gian thực, tránh đặt trùng.</li>
            <li>Sơ đồ ghế trực quan, chọn ghế theo hàng/loại vé.</li>
            <li>Thanh toán nhanh chóng & nhận vé điện tử.</li>
            <li>Thông báo thay đổi lịch chiếu, ưu đãi và mã giảm giá.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Bảo mật & Dữ liệu
          </h2>
          <p className="text-gray-400">
            Chúng tôi mã hóa dữ liệu thanh toán và thông tin cá nhân, tuân thủ
            các tiêu chuẩn bảo mật phổ biến để bảo vệ người dùng. Mọi giao dịch
            đều được xử lý qua cổng thanh toán an toàn và lưu trữ theo chính
            sách bảo mật nghiêm ngặt.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            Lộ trình & Cam kết
          </h2>
          <p className="text-gray-400">
            88Ticket cam kết đem lại trải nghiệm đặt vé nhanh, an toàn và
            đáng tin cậy cho người dùng.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">Liên hệ</h2>
          <p className="text-gray-400">
            Thắc mắc hoặc góp ý? Vui lòng liên hệ với chúng tôi qua email:
            <span className="font-semibold text-white ml-2">
              support@trungcinema.com
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}
