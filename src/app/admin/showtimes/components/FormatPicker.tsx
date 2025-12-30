"use client";

import { useEffect, useMemo, useState } from "react";

interface FormatPickerProps {
  value: string;
  onChange: (format: string) => void;
  baseFormats?: string[];
  initialCustomFormats?: string[];
}

const DEFAULT_BASE_FORMATS = ["2D", "3D", "IMAX", "4DX"];

export function FormatPicker({
  value,
  onChange,
  baseFormats,
  initialCustomFormats = [],
}: FormatPickerProps) {
  const baseList = useMemo(() => baseFormats ?? DEFAULT_BASE_FORMATS, [baseFormats]);
  const [customFormats, setCustomFormats] = useState<string[]>(initialCustomFormats);
  const [showModal, setShowModal] = useState(false);
  const [newFormatInput, setNewFormatInput] = useState("");

  useEffect(() => {
    const incoming = (initialCustomFormats ?? []).filter(Boolean);
    if (incoming.length === 0) return;

    setCustomFormats(prev => {
      const merged = [...prev];
      incoming.forEach(fmt => {
        const lower = fmt.toLowerCase();
        const exists = merged.some(f => f.toLowerCase() === lower) || baseList.some(f => f.toLowerCase() === lower);
        if (!exists) merged.push(fmt);
      });
      return merged;
    });
  }, [initialCustomFormats, baseList]);

  const allFormats = useMemo(() => [...baseList, ...customFormats], [baseList, customFormats]);

  const handleAdd = () => {
    const normalized = newFormatInput.trim();
    if (!normalized) return;

    const lower = normalized.toLowerCase();
    if (allFormats.some(f => f.toLowerCase() === lower)) return;

    setCustomFormats(prev => [...prev, normalized]);
    onChange(normalized);
    setNewFormatInput("");
    setShowModal(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {allFormats.map(format => (
          <button
            key={format}
            type="button"
            onClick={() => onChange(format)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              value === format ? "bg-purple-600 text-white" : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {format}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-gray-300 border border-dashed border-white/20 hover:bg-white/10 transition-all"
        >
          + Thêm định dạng
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-gray-900/95 border border-white/10 shadow-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Thêm định dạng mới</h3>
                <p className="text-sm text-gray-400">Ví dụ: ScreenX, 4DX Screen, 2D Atmos...</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Tên định dạng</label>
              <input
                value={newFormatInput}
                onChange={(e) => setNewFormatInput(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nhập định dạng"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={() => { setShowModal(false); setNewFormatInput(""); }}
                className="px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 transition"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
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
