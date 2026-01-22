"use client";

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface MultipleImageUploadProps {
  onImagesUpload: (urls: string[]) => void;
  currentImages?: string[];
  label?: string;
  folder?: string;
  maxImages?: number;
}

export default function MultipleImageUpload({
  onImagesUpload,
  currentImages = [],
  label = 'Upload Images',
  folder = 'movies',
  maxImages = 5,
}: MultipleImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentImages);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate number of files
    if (previews.length + files.length > maxImages) {
      setError(`Chỉ được upload tối đa ${maxImages} ảnh`);
      return;
    }

    // Validate files
    for (const file of files) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        setError('Chỉ chấp nhận file JPG, PNG hoặc WEBP');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Kích thước mỗi file không được vượt quá 5MB');
        return;
      }
    }

    setError(null);
    setUploading(true);

    // Create previews
    const newPreviews: string[] = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    // Upload to server
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('folder', folder);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json() as { images: Array<{ url: string }> };
      const urls = data.images.map((img) => img.url);
      onImagesUpload([...previews, ...urls]);
    } catch {
      setError('Lỗi khi upload ảnh. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesUpload(newPreviews);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({previews.length}/{maxImages})
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative group">
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {previews.length < maxImages && (
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="w-full aspect-[2/3] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <>
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-sm">Thêm ảnh</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="mt-2 text-sm text-gray-500">
        JPG, PNG, WEBP (Max 5MB mỗi file, tối đa {maxImages} ảnh)
      </p>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
