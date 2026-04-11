export default function Loading() {
  return (
    <main className="bg-[#FDFCF9] min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <div className="mb-10 text-center md:text-left">
          <div className="h-16 w-48 bg-gray-200 rounded-lg animate-pulse mx-auto md:mx-0" />
        </div>

        <div className="flex flex-wrap gap-4 py-8 border-b border-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 w-28 bg-gray-200 rounded-full animate-pulse" />
          ))}
        </div>

 </div>
    </main>
  );
}
