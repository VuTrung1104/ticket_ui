"use client";

import { useMemo, useState } from "react";

type Option = { value: string; label: string };

export default function QuickBookingBar() {
  const movies: Option[] = [
    { value: "dune-2", label: "Dune: Part Two" },
    { value: "inside-out-2", label: "Inside Out 2" },
    { value: "spider-man", label: "Spider-Man: No Way Home" },
  ];

  const cinemas: Option[] = [
    { value: "galaxy-ngu-hanh-son", label: "Galaxy Ngũ Hành Sơn" },
    { value: "galaxy-tan-an", label: "Galaxy Tân An" },
    { value: "galaxy-kinh-duong-vuong", label: "Galaxy KĐV" },
  ];

  const next7Days = useMemo(() => {
    const list: Option[] = [];
    const formatter = new Intl.DateTimeFormat("vi-VN", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
    for (let i = 0; i < 7; i += 1) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      list.push({ value: d.toISOString().slice(0, 10), label: formatter.format(d) });
    }
    return list;
  }, []);

  const showtimes: Option[] = [
    { value: "10:00", label: "10:00" },
    { value: "13:30", label: "13:30" },
    { value: "16:45", label: "16:45" },
    { value: "20:15", label: "20:15" },
  ];

  const [movie, setMovie] = useState<string>("");
  const [cinema, setCinema] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  const handleBuy = () => {
    alert(`Mua vé: phim=${movie}, rạp=${cinema}, ngày=${date}, suất=${time}`);
  };

  const itemClass =
    "flex items-center gap-2 rounded-md bg-white text-[#1b1d24] px-4 py-3 w-full max-w-[260px] shadow-sm";
  const labelClass = "hidden sm:inline text-xs text-[#7a7f8a]";

  return (
    <div className="relative z-[5] mx-auto -mt-8 w-full max-w-[1100px]">
      <div className="flex flex-col items-stretch justify-between gap-3 rounded-2xl bg-[#ecf2ff]/90 p-3 shadow-xl ring-1 ring-black/10 md:flex-row md:items-center">
        {/* Chọn Phim */}
        <div className={itemClass}>
          <span className={labelClass}>Chọn Phim</span>
          <select
            aria-label="Chọn Phim"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          >
            <option value="">-- Chọn phim --</option>
            {movies.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn Rạp */}
        <div className={itemClass}>
          <span className={labelClass}>Chọn Rạp</span>
          <select
            aria-label="Chọn Rạp"
            value={cinema}
            onChange={(e) => setCinema(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            disabled={!movie} // disabled nếu chưa chọn phim
          >
            <option value="">-- Chọn rạp --</option>
            {cinemas.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn Ngày */}
        <div className={itemClass}>
          <span className={labelClass}>Chọn Ngày</span>
          <select
            aria-label="Chọn Ngày"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            disabled={!cinema} // disabled nếu chưa chọn rạp
          >
            <option value="">-- Chọn ngày --</option>
            {next7Days.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        {/* Chọn Suất */}
        <div className={itemClass}>
          <span className={labelClass}>Chọn Suất</span>
          <select
            aria-label="Chọn Suất"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
            disabled={!date} // disabled nếu chưa chọn ngày
          >
            <option value="">-- Chọn suất --</option>
            {showtimes.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Nút Mua Vé Nhanh */}
        <div className="flex w-full justify-end md:w-auto">
          <button
            onClick={handleBuy}
            disabled={!movie || !cinema || !date || !time} // disable nếu chưa chọn đủ
            className="inline-flex items-center justify-center rounded-xl bg-red-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-600 disabled:opacity-100 md:min-w-[180px]"
          >
            Mua vé nhanh
          </button>
        </div>
      </div>
    </div>
  );
}
