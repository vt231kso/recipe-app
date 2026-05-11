"use client";
import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

interface ImageUploadProps {
  preview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function ImageUpload({ preview, onImageChange, onClear }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelStyles = "flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1";

  return (
    <section className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
      <label htmlFor="recipe-image-upload" className={labelStyles}>
        Головне фото страви
      </label>

      <div className="relative aspect-video w-full">
        {preview ? (
          <div className="relative h-full w-full rounded-[32px] overflow-hidden group">
            <Image
              src={preview}
              alt="Попередній перегляд фото страви"
              fill
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <button
              type="button"
              onClick={onClear}
              aria-label="Видалити фото"
              className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Завантажити фото страви"
            className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50 hover:bg-green-50/50 hover:border-green-200 transition-all group"
          >
            <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <ImagePlus className="text-green-600" size={32} aria-hidden="true" />
            </div>
            <span className="font-bold text-gray-500">Додати обкладинку</span>
          </button>
        )}

        <input
          id="recipe-image-upload"
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={onImageChange}
          accept="image/*"
          aria-label="Завантажити фото страви"
        />
      </div>
    </section>
  );
}
