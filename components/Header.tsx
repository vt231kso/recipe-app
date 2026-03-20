import { Search, Facebook, Send, Instagram, Bell, User } from 'lucide-react'; // Встанови: npm install lucide-react

export default function HeaderTop() {
  return (
    <div className="border-b bg-red py-3">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Пошук */}
        <div className="relative w-1/3">
          <input
            type="text"
            placeholder="паста"
            className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm outline-none focus:border-[#F2E880]"
          />
          <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>

        {/* Соцмережі та Кабінет */}
        <div className="flex items-center gap-6">
          <div className="flex gap-3 text-gray-600 border-r pr-6">
            <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-600" />
            <Send className="w-5 h-5 cursor-pointer hover:text-blue-400" />
            <Instagram className="w-5 h-5 cursor-pointer hover:text-pink-600" />
          </div>
          <div className="flex items-center gap-4 text-gray-700 font-medium">
            <div className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-[#F2E880] text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">1</span>
            </div>
            <button className="flex items-center gap-2 border rounded-xl px-4 py-2 hover:bg-gray-50 transition-colors">
              <User className="w-5 h-5" />
              <span>Кабінет</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
