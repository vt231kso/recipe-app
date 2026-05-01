import { adminService } from "@/lib/services/admin.service";
import { Users, BookOpen, MessageSquare, TrendingUp, Clock, Calendar } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await adminService.getStats();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">Загальна статистика</h2>
          <p className="text-gray-500 text-sm md:text-base">Огляд активності вашої платформи</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Сьогодні</p>
          <p className="text-base md:text-lg font-bold text-gray-700">
            {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {/* Користувачі */}
        <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-md group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Користувачі</p>
            <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <Users size={18} />
            </div>
          </div>
          <p className="text-4xl md:text-5xl font-black text-gray-900">{stats.users}</p>
          <p className="mt-2 text-xs md:text-sm text-gray-400">Всього зареєстровано</p>
        </div>

        {/* Рецепти */}
        <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-md group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Рецепти</p>
            <div className="p-2.5 bg-green-50 text-green-500 rounded-xl group-hover:bg-green-500 group-hover:text-white transition-colors">
              <BookOpen size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <p className="text-4xl md:text-5xl font-black text-gray-900">{stats.recipes}</p>
            {stats.newRecipesWeek > 0 && (
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                +{stats.newRecipesWeek}
              </span>
            )}
          </div>
          <p className="mt-2 text-xs md:text-sm text-gray-400">Нових за останні 7 днів</p>
        </div>

        {/* Коментарі */}
        <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-100 transition-all hover:shadow-md group sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Коментарі</p>
            <div className="p-2.5 bg-purple-50 text-purple-500 rounded-xl group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <MessageSquare size={18} />
            </div>
          </div>
          <p className="text-4xl md:text-5xl font-black text-gray-900">{stats.comments}</p>
          <p className="mt-2 text-xs md:text-sm text-gray-400">Відгуки користувачів</p>
        </div>
      </div>

      {/* Додаткова статистика - 1 колонка на мобайл, 2 на десктоп */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="bg-orange-50/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-orange-100 flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl text-orange-500 shadow-sm shrink-0">
            <TrendingUp size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-orange-900/60 font-bold uppercase text-[10px] tracking-widest mb-1">Топ категорія</p>
            <p className="text-xl md:text-2xl font-black text-orange-900 leading-tight">{stats.popularCategory}</p>
          </div>
        </div>

        <div className="bg-teal-50/50 p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-teal-100 flex items-center gap-4 md:gap-6">
          <div className="p-3 md:p-4 bg-white rounded-xl md:rounded-2xl text-teal-500 shadow-sm shrink-0">
            <Clock size={24} className="md:w-8 md:h-8" />
          </div>
          <div>
            <p className="text-teal-900/60 font-bold uppercase text-[10px] tracking-widest mb-1">Середній час</p>
            <p className="text-xl md:text-2xl font-black text-teal-900 leading-tight">~ {stats.avgTime} хв</p>
          </div>
        </div>
      </div>

      {/* Швидка порада */}
      <div className="bg-gray-900 rounded-[24px] md:rounded-[40px] p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-2">
            <Calendar className="text-yellow-400" size={20} /> Статус контенту
          </h3>
          <p className="text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
            За останній тиждень додано <span className="text-white font-bold">{stats.newRecipesWeek} нових рецептів</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
