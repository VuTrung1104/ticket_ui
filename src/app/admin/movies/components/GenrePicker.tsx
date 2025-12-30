"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

interface GenreOption {
  display: string;
  value: string;
}

interface GenrePickerProps {
  selected: string[];
  onChange: (genres: string[]) => void;
  baseGenres?: GenreOption[];
}

const DEFAULT_BASE_GENRES: GenreOption[] = [
  { display: "Action", value: "action" },
  { display: "Comedy", value: "comedy" },
  { display: "Drama", value: "drama" },
  { display: "Horror", value: "horror" },
];

export function GenrePicker({ selected, onChange, baseGenres }: GenrePickerProps) {
  const baseList = useMemo(() => baseGenres ?? DEFAULT_BASE_GENRES, [baseGenres]);
  const initialCustom = useMemo(
    () => selected.filter(g => !baseList.some(bg => bg.value === g)),
    [selected, baseList]
  );

  const [customGenres, setCustomGenres] = useState<string[]>(initialCustom);
  const [showModal, setShowModal] = useState(false);
  const [newGenreInput, setNewGenreInput] = useState("");

  const allValues = useMemo(
    () => [...baseList.map(g => g.value), ...customGenres],
    [baseList, customGenres]
  );

  const toggleGenre = (genreValue: string) => {
    if (selected.includes(genreValue)) {
      onChange(selected.filter(g => g !== genreValue));
    } else {
      onChange([...selected, genreValue]);
    }
  };

  const handleAdd = () => {
    const normalized = newGenreInput.trim();
    if (!normalized) {
      toast.error("Vui lòng nhập tên thể loại");
      return;
    }

    const value = normalized.replace(/\s+/g, "-");
    const valueLower = value.toLowerCase();

    if (allValues.some(g => g.toLowerCase() === valueLower)) {
      toast.info("Thể loại đã tồn tại trong danh sách");
      return;
    }

    setCustomGenres(prev => [...prev, value]);
    onChange([...selected, value]);
    setNewGenreInput("");
    setShowModal(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allValues.map(value => {
          const isSelected = selected.includes(value);
          const label = baseList.find(g => g.value === value)?.display || value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => toggleGenre(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isSelected ? "bg-blue-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-300 border border-dashed border-white/20 hover:bg-white/10 transition-all"
        >
          + Thêm thể loại
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-gray-900/95 border border-white/10 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Thêm thể loại mới</h3>
                <p className="text-sm text-gray-400">Ví dụ: Mystery, Musical, Documentary...</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Tên thể loại</label>
              <input
                value={newGenreInput}
                onChange={(e) => setNewGenreInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tên thể loại"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => { setShowModal(false); setNewGenreInput(""); }}
                className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
