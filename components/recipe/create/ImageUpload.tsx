"use client";
import { useRef } from "react";
import { ImagePlus, X } from "lucide-react";


interface ImageUploadProps {
  preview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function ImageUpload({ preview, onImageChange, onClear }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labelStyles = "flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1";

  return (
    <section className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100">
      <label className={labelStyles}>Головне фото страви</label>
      <div className="relative aspect-video w-full">
        {preview ? (
          <div className="relative h-full w-full rounded-[32px] overflow-hidden group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={onClear}
              className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center w-full h-full border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50 hover:bg-green-50/50 hover:border-green-200 transition-all group"
          >
            <div className="p-4 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
              <ImagePlus className="text-green-600" size={32} />
            </div>
            <span className="font-bold text-gray-500">Додати обкладинку</span>
            <input type="file" className="hidden" ref={fileInputRef} onChange={onImageChange} accept="image/*" />
          </button>
        )}
      </div>
    </section>
  );
}
