import { adminService } from "@/lib/services/admin.service";
import { Users, BookOpen, MessageSquare, TrendingUp, Clock, Calendar } from "lucide-react";

export default async function AdminDashboard() {
  const stats = await adminService.getStats();

  return (
    <div className="space-y-6 sm:space-y-10 px-1 sm:px-0">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6 sm:pb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 font-serif">
            Панель управління
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mt-1">Огляд активності вашої платформи</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100 w-full sm:w-auto">
          <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Сьогодні</p>
            <p className="text-sm font-bold text-gray-700">
              {new Date().toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
      </div>

      {/* Основні показники */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {/* Користувачі */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md group">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Користувачі</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">{stats.users}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-blue-100">
              <Users size={24} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-medium">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Всього зареєстровано
          </div>
        </div>

        {/* Рецепти */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md group">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Рецепти</p>
              <div className="flex items-center gap-3">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">{stats.recipes}</p>
                {stats.newRecipesWeek > 0 && (
                  <span className="text-[10px] sm:text-xs font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                    +{stats.newRecipesWeek}
                  </span>
                )}
              </div>
            </div>
            <div className="p-3 bg-green-50 text-green-500 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-green-100">
              <BookOpen size={24} />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">Нових за останні 7 днів</p>
        </div>

        {/* Коментарі */}
        <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-gray-100 transition-all hover:shadow-md group sm:col-span-2 lg:col-span-1">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Коментарі</p>
              <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900">{stats.comments}</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-purple-100">
              <MessageSquare size={24} />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-medium">Активність обговорень</p>
        </div>
      </div>

      {/* Другорядна статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        <div className="bg-orange-50/40 p-6 sm:p-8 rounded-[2rem] border border-orange-100/50 flex items-center gap-5 sm:gap-6 group transition-all hover:bg-orange-50">
          <div className="p-4 bg-white rounded-2xl text-orange-500 shadow-sm border border-orange-100 shrink-0 group-hover:scale-110 transition-transform">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-orange-900/50 font-bold uppercase text-[10px] tracking-[0.15em] mb-1">Топ категорія</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-orange-950 leading-none">{stats.popularCategory}</p>
          </div>
        </div>

        <div className="bg-teal-50/40 p-6 sm:p-8 rounded-[2rem] border border-teal-100/50 flex items-center gap-5 sm:gap-6 group transition-all hover:bg-teal-50">
          <div className="p-4 bg-white rounded-2xl text-teal-500 shadow-sm border border-teal-100 shrink-0 group-hover:scale-110 transition-transform">
            <Clock size={32} />
          </div>
          <div>
            <p className="text-teal-900/50 font-bold uppercase text-[10px] tracking-[0.15em] mb-1">Середній час</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-teal-950 leading-none">{stats.avgTime} <span className="text-sm sm:text-base font-bold text-teal-900/40 ml-1 uppercase">хв</span></p>
          </div>
        </div>
      </div>

      {/* Нижня панель */}
      <div className="bg-gray-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        {/* Декоративний фон */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full -mr-20 -mt-20" />

        <div className="space-y-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-lg text-yellow-400">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-bold font-serif">Статус контенту</h3>
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">
            За останній тиждень база поповнилася на <span className="text-yellow-400 font-black underline underline-offset-4">{stats.newRecipesWeek} нових рецептів</span>. Це чудовий показник зростання!
          </p>
        </div>

        <button className="relative z-10 w-full lg:w-auto px-8 py-4 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors duration-300">
          Детальний звіт
        </button>
      </div>
    </div>
  );
}
