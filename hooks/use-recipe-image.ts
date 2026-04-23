"use client";

import { useState } from "react";
import { UseFormSetValue, FieldValues, Path, PathValue } from "react-hook-form";

export function useRecipeImage<T extends FieldValues>(
  setValue: UseFormSetValue<T>
) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Файл занадто великий (макс. 5MB)");
        return;
      }
      setValue("image" as Path<T>, file as PathValue<T, Path<T>>, {
        shouldValidate: true,
      });

      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setValue("image" as Path<T>, undefined as PathValue<T, Path<T>>, {
      shouldValidate: true,
    });
  };

  return { imagePreview, imageError, handleImageChange, clearImage };
}
