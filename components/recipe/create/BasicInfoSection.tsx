"use client";
import { ChefHat, Clock, Utensils, Globe } from "lucide-react";
import { useFormContext } from "react-hook-form";

interface BasicInfoProps {
  categories: { id: number; name: string }[];
  cuisines: { id: number; name: string }[];
}

export function BasicInfoSection({ categories, cuisines }: BasicInfoProps) {

  const { register, formState: { errors } } = useFormContext();

  const getInputStyles = (fieldName: string) => `
    w-full p-4 bg-gray-50 border-2 rounded-2xl transition-all outline-none text-gray-700 placeholder:text-gray-400
    ${errors[fieldName]
    ? "border-red-500 focus:border-red-600 bg-red-50/30"
    : "border-transparent focus:border-green-500/20 focus:bg-white"}
  `;

  const labelStyles = "flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1";
  const errorStyles = "text-red-500 text-xs mt-2 font-bold ml-1 flex items-center gap-1";

  return (
    <section className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-green-100 text-green-600 rounded-xl"><ChefHat size={24} /></div>
        <h2 className="text-2xl font-bold text-gray-900 font-serif">Основне</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className={labelStyles}>Назва</label>
          <input
            {...register("title")}
            placeholder="Наприклад: Гарбузовий крем-суп"
            className={`${getInputStyles("title")} text-xl font-medium`}
          />
          {errors.title && <p className={errorStyles}>{errors.title.message as string}</p>}
        </div>

        <div>
          <label className={labelStyles}>Опис</label>
          <textarea
            {...register("description")}
            placeholder="Коротка історія страви..."
            rows={3}
            className={`${getInputStyles("description")} resize-none`}
          />
          {errors.description && <p className={errorStyles}>{errors.description.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelStyles}><Clock size={16} /> Час (хв)</label>
            <input
              type="number"
              {...register("cookingTime")}
              className={getInputStyles("cookingTime")}
            />
            {errors.cookingTime && <p className={errorStyles}>{errors.cookingTime.message as string}</p>}
          </div>

          <div>
            <label className={labelStyles}><ChefHat size={16} /> Складність</label>
            <select {...register("difficulty")} className={getInputStyles("difficulty")}>
              <option value="Easy">Легко</option>
              <option value="Medium">Середньо</option>
              <option value="Hard">Складно</option>
            </select>
            {errors.difficulty && <p className={errorStyles}>{errors.difficulty.message as string}</p>}
          </div>

          <div>
            <label className={labelStyles}><Utensils size={16} /> Категорія</label>
            <select {...register("categoryId")} className={getInputStyles("categoryId")}>
              <option value={0}>Оберіть категорію</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.categoryId && <p className={errorStyles}>{errors.categoryId.message as string}</p>}
          </div>
          <div>
            <label className={labelStyles}><Globe size={16} /> Кухня</label>
            <select {...register("cuisineId")} className={getInputStyles("cuisineId")}>
              <option value={0}>Оберіть кухню</option>
              {cuisines.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.cuisineId && <p className={errorStyles}>{errors.cuisineId.message as string}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
