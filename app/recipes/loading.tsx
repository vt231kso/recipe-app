export default function Loading() {
  const skeletonCards = Array(6).fill(0);

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


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-12">
          {skeletonCards.map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <div className="aspect-[4/3] w-full bg-gray-200 rounded-3xl animate-pulse" />
              <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
