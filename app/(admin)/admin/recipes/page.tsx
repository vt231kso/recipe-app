import { adminService } from "@/lib/services/admin.service";
import { Eye, Edit, Plus } from "lucide-react";
import Link from "next/link";
import { DeleteRecipeButton } from "@/components/admin/DeleteRecipeButton";

export default async function AdminRecipesPage() {
  const recipes = await adminService.getAllRecipes();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold font-serif">Всі рецепти</h2>
        {/* Кнопка створення нового рецепту саме через адмінку */}
        <Link
          href="/admin/recipes/create"
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-2xl font-bold hover:bg-green-700 transition-all shadow-sm"
        >
          <Plus size={20} />
          Додати рецепт
        </Link>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px] tracking-widest">
          <tr>
            <th className="p-6">Назва</th>
            <th className="p-6">Автор</th>
            <th className="p-6">Категорія</th>
            <th className="p-6 text-right">Дії</th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-600">
          {recipes.map((recipe) => (
            <tr key={recipe.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="p-6 font-semibold text-gray-900">{recipe.title}</td>
              <td className="p-6">{recipe.author.email}</td>
              <td className="p-6">
                  <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full font-bold text-[10px]">
                    {recipe.category.name}
                  </span>
              </td>
              <td className="p-6">
                <div className="flex justify-end gap-3">
                  {/* Перегляд на сайті */}
                  <Link
                    href={`/recipes/${recipe.id}`}
                    className="p-2 hover:bg-blue-50 text-blue-500 rounded-xl transition-all"
                    title="Переглянути на сайті"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    href={`/admin/recipes/edit/${recipe.id}`}
                    className="p-2 hover:bg-amber-50 text-amber-500 rounded-xl transition-all"
                    title="Редагувати"
                  >
                    <Edit size={18} />
                  </Link>

                  <DeleteRecipeButton id={recipe.id} />
                </div>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
