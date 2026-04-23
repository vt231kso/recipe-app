"use client";

import { Plus, AlertCircle } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { RecipeFormValues } from "@/lib/validations/recipe";

export function StepsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const stepsErrors = errors.steps;
  const isArrayError = Array.isArray(stepsErrors);

  const inputStyles = (hasError: boolean) => `
    w-full p-4 bg-gray-50 border-2 rounded-2xl transition-all outline-none text-gray-700 placeholder:text-gray-400 resize-none
    ${
    hasError
      ? "border-red-500 bg-red-50/30"
      : "border-transparent focus:border-green-500/20 focus:bg-white"
  }
  `;

  return (
    <section
      className={`bg-white p-6 md:p-8 rounded-[32px] shadow-sm border transition-all space-y-6 ${
        errors.steps && !isArrayError
          ? "border-red-500"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">
          Приготування
        </h2>

        {errors.steps && !isArrayError && (
          <div className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <AlertCircle size={14} />
            <span>Додайте хоча б один крок</span>
          </div>
        )}
      </div>

      <div className="space-y-10">
        {fields.map((field, index) => {
          const rowError = isArrayError
            ? stepsErrors?.[index]
            : undefined;

          const stepError = rowError?.content;

          return (
            <div
              key={field.id}
              className="relative pl-14 group animate-in slide-in-from-top-2"
            >
              <div
                className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-md transition-colors ${
                  stepError
                    ? "bg-red-500 text-white"
                    : "bg-black text-white"
                }`}
              >
                {index + 1}
              </div>

              {index !== fields.length - 1 && (
                <div className="absolute left-5 top-10 w-[2px] h-full bg-gray-100" />
              )}

              <div className="space-y-2">
                <textarea
                  {...register(`steps.${index}.content`)}
                  placeholder="Опишіть, що потрібно зробити на цьому етапі..."
                  rows={3}
                  className={inputStyles(!!stepError)}
                />

                {stepError && (
                  <p className="text-red-500 text-xs font-bold ml-1">
                    {stepError.message as string}
                  </p>
                )}

                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs font-bold text-red-400 uppercase hover:text-red-600 transition-colors"
                  >
                    Видалити крок
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => append({ content: "" })}
        className={`font-bold flex items-center gap-2 hover:scale-105 transition-transform ml-14 ${
          errors.steps && fields.length === 0
            ? "text-red-500"
            : "text-[#65B756]"
        }`}
      >
        <Plus size={20} /> Наступний крок
      </button>
    </section>
  );
}
