"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { PublicationImage } from "../publication/PublicationImage";

interface UploadImageProps {
  imageAmount?: number;
  className?: string;
  onChange?: (files: File[]) => void;
}

export const UploadImage: React.FC<UploadImageProps> = ({ imageAmount = 10, className, onChange }) => {
  const t = useTranslations("Components.Upload");

  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<File[]>([]);

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages = [...images, ...files].slice(0, imageAmount);
    setImages(newImages);
    onChange?.(newImages);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onChange?.(newImages);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 p-4 rounded-2xl bg-background dark:bg-input/30 border border-input",
        className
      )}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((file, i) => (
          <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
            <PublicationImage src={URL.createObjectURL(file)} alt={`upload-${i}`} className="object-cover" />
            <button
              type="button"
              className="absolute top-2 left-2 bg-black/50 backdrop-blur-3xl p-1 rounded-full text-white hover:bg-black cursor-pointer magic-transition"
              onClick={() => removeImage(i)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
        {images.length < imageAmount && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-input rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-input/30 magic-transition cursor-pointer"
          >
            <Upload size={24} />
            <span className="text-xs mt-1">{t("title")}</span>
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={handleFiles} />
    </div>
  );
};
