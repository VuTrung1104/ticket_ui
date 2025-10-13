import MovieCard from "./MovieCard";

const Now_Playing = [
  {
    id: 1,
    title: "Tử Chiến Trên Không",
    Subtitles: "Khánh Toàn",
    poster: "/assets/images/anh1.jpg",
    rating: 9.6,
    ageRating: "T16",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hành Động • Kịch Tính • Lịch Sử"],
  },
  {
    id: 2,
    title: "Dư Ảnh Của Độc Nhãn",
    poster: "/assets/images/anh2.jpg",
    rating: 9.3,
    ageRating: "T16",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hoạt Hình • Trinh Thám • Bí Ẩn"],
  },
  {
    id: 3,
    title: "Mưa Đỏ",
    poster: "/assets/images/anh3.jpg",
    rating: 9.8,
    ageRating: "T18",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Chiến Tranh • Lịch Sử • Hành Động • Chính Kịch"],
  },
  {
    id: 4,
    title: "Tàu Ngầm Sắt Màu Đen",
    poster: "/assets/images/anh4.jpg",
    rating: 9.0,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Chính Kịch • Tình Cảm • Gia Đình"],
  },
  {
    id: 5,
    title: "Đồi Hành Xác",
    poster: "/assets/images/anh5.jpg",
    rating: 8.4,
    ageRating: "T18",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Kinh Dị • Giả Tưởng • Bí Ẩn"],
  },
  {
    id: 6,
    title: "Thanh Gươm Diệt Quỷ",
    poster: "/assets/images/anh6.jpg",
    rating: 8.7,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hoạt Hình • Giả Tưởng • Hành Động"],
  },
  {
    id: 7,
    title: "Mắt Biếc",
    poster: "/assets/images/anh7.jpg",
    rating: 8.2,
    ageRating: "P",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Chính Kịch • Lãng Mạn • Gia Đình"],
  },
  {
    id: 8,
    title: "Mưa Trên Cánh Bướm",
    poster: "/assets/images/anh8.jpg",
    rating: 8.5,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Chính Kịch • Lãng Mạn • Thanh Xuân"],
  },
  {
    id: 9,
    title: "Quỷ Nhập Tràng",
    poster: "/assets/images/anh9.jpg",
    rating: 8.2,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Kinh Dị"],
  },
  {
    id: 10,
    title: "Yêu Nhầm Bạn Thân",
    poster: "/assets/images/anh10.jpg",
    rating: 9.2,
    ageRating: "T18",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hài • Tình Cảm • Lãng Mạn"],
  },
];

const Coming_Soon = [
  {
    id: 1,
    title: "Phá Đám Sinh Nhật Mẹ",
    poster: "/assets/images/anh11.jpg",
    rating: 8.1,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hài • Gia Đình • Chính Kịch"],
  },
  {
    id: 2,
    title: "Đèn Âm Hồn",
    poster: "/assets/images/anh12.jpg",
    rating: 7.9,
    ageRating: "T18",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Kinh Dị • Tâm Linh"],
  },
  {
    id: 3,
    title: "One Piece: Live Action 2",
    poster: "/assets/images/anh13.jpg",
    rating: 9.8,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hành Động • Phiêu Lưu • Giả Tưởng"],
  },
  {
    id: 4,
    title: "Dragon Ball Super: Broly",
    poster: "/assets/images/anh14.jpg",
    rating: 9.9,
    ageRating: "P",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hoạt Hình • Hành Động • Viễn Tưởng • Phiêu Lưu"],
  },
  {
    id: 5,
    title: "Chị Ngã Em Nâng",
    poster: "/assets/images/anh15.jpg",
    rating: 8.5,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Tình Cảm • Chính Kịch • Gia Đình"],
  },
  {
    id: 6,
    title: "Nhân Diện",
    poster: "/assets/images/anh16.jpg",
    rating: 7.0,
    ageRating: "T18",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Tội Phạm • Hình Sự • Chính Kịch • Hồi Hộp"],
  },
  {
    id: 7,
    title: "Dòng chảy của nước",
    poster: "/assets/images/anh17.jpg",
    rating: 8.5,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Khoa Học Viễn Tưởng • Phiêu Lưu • Hành Động"],
  },
  {
    id: 8,
    title: "Quỷ Ăn Tạng",
    poster: "/assets/images/anh18.jpg",
    rating: 7.7,
    ageRating: "T18",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Kinh Dị • Bí Ẩn • Tâm Linh"],
  },
  {
    id: 9,
    title: "Tay Anh Giữ Một Vì Sao",
    poster: "/assets/images/anh19.jpeg",
    rating: 8.3,
    ageRating: "T13",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Tình Cảm • Lãng Mạn • Chính Kịch • Thanh Xuân"],
  },
  {
    id: 10,
    title: "Dragon Ball Super",
    poster: "/assets/images/anh20.jpg",
    rating: 9.9,
    ageRating: "P",
    year: 2025,
    season: 1,
    episode: 36,
    genres: ["Hoạt Hình • Hành Động • Viễn Tưởng • Phiêu Lưu"],
  },
];

export default function MovieGrid() {
  return (
    <section id="phim" className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-white text-xl md:text-2xl font-semibold">
          Phim đang chiếu
        </h2>
        <a href="#" className="text-lg text-white hover:text-red-400">
          Xem tất cả
        </a>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Now_Playing.map((m) => (
          <MovieCard
            key={m.id}
            title={m.title}
            poster={m.poster}
            rating={m.rating}
            ageRating={m.ageRating}
            year={m.year}
            season={m.season}
            episode={m.episode}
            genres={m.genres}
          />
        ))}
      </div>
      <div className="mt-12 mb-6 flex items-center justify-between">
        <h3 className="text-white text-xl md:text-2xl font-semibold">
          Phim sắp chiếu
        </h3>
        <a href="#" className="text-lg text-white hover:text-red-400">
          Xem tất cả
        </a>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {Coming_Soon.map((m) => (
          <MovieCard
            key={m.id}
            title={m.title}
            poster={m.poster}
            rating={m.rating}
            ageRating={m.ageRating}
            year={m.year}
            season={m.season}
            episode={m.episode}
            genres={m.genres}
          />
        ))}
      </div>
    </section>
  );
}
