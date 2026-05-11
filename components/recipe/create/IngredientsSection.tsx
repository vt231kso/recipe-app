"use client";

import { Plus, Trash2, AlertCircle } from "lucide-react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { RecipeFormValues } from "@/lib/validations/recipe";

export function IngredientsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RecipeFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const getInputStyles = (hasError: boolean) => `
    w-full p-4 bg-gray-50 border-2 rounded-2xl transition-all outline-none text-gray-700
    ${
    hasError
      ? "border-red-500 bg-red-50/30"
      : "border-transparent focus:border-green-500/20 focus:bg-white"
  }
  `;

  const ingredientsErrors = errors.ingredients;
  const isArrayError = Array.isArray(ingredientsErrors);

  return (
    <section
      className={`bg-white p-6 md:p-8 rounded-[32px] shadow-sm border transition-all space-y-6 ${
        errors.ingredients && !isArrayError
          ? "border-red-500"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 font-serif">
          Інгредієнти
        </h2>

        {errors.ingredients && !isArrayError && (
          <div className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100">
            <AlertCircle size={14} />
            <span>Додайте хоча б один інгредієнт</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => {
          const rowError = isArrayError
            ? ingredientsErrors?.[index]
            : undefined;

          return (
            <div key={field.id} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-3 animate-in slide-in-from-top-2">
                <div className="flex-[3]">
                  <label htmlFor={`ingredient-name-${index}`} className="sr-only">
                    Назва інгредієнта
                  </label>
                  <input
                    id={`ingredient-name-${index}`}
                    {...register(`ingredients.${index}.name`)}
                    placeholder="Назва (напр. Борошно)"
                    className={getInputStyles(!!rowError?.name)}
                  />
                </div>

                <div className="flex flex-row gap-2 flex-1">
                  <label htmlFor={`ingredient-amount-${index}`} className="sr-only">
                    Кількість
                  </label>
                  <input
                    id={`ingredient-amount-${index}`}
                    {...register(`ingredients.${index}.amount`)}
                    placeholder="К-сть"
                    className={getInputStyles(!!rowError?.amount)}
                  />
                  <label htmlFor={`ingredient-unit-${index}`} className="sr-only">
                    Одиниця вимірювання
                  </label>
                  <input
                    id={`ingredient-unit-${index}`}
                    {...register(`ingredients.${index}.unit`)}
                    placeholder="Од."
                    className={`${getInputStyles(
                      !!rowError?.unit
                    )} w-24`}
                  />
                </div>

                <button
                  type="button"
                  aria-label={`Видалити інгредієнт ${index + 1}`}
                  onClick={() => remove(index)}
                  className="p-4 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {(rowError?.name || rowError?.amount || rowError?.unit) && (
                <p className="text-red-500 text-xs font-bold ml-1">
                  Заповніть всі поля інгредієнта
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          append({ name: "", amount: "", unit: "" })
        }
        className={`w-full py-4 border-2 border-dashed rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
          errors.ingredients && fields.length === 0
            ? "border-red-300 text-red-500 bg-red-50"
            : "border-gray-200 text-gray-400 hover:border-green-200 hover:text-green-600"
        }`}
      >
        <Plus size={20} /> Додати інгредієнт
      </button>
    </section>
  );
}
