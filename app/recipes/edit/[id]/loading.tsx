export default function LoadingRecipe() {
  return (
    <main className="bg-[#FDFCF9] min-h-screen pb-24 animate-pulse overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="h-6 w-32 bg-gray-200 rounded-lg mx-auto mb-8" />
        <div className="h-12 md:h-16 bg-gray-200 rounded-2xl w-3/4 mx-auto mb-8" />
        <div className="h-10 bg-gray-100 rounded-xl w-64 mx-auto" />
      </div>
      <div className="max-w-6xl mx-auto px-6 mb-20">
        <div className="h-[300px] sm:h-[450px] md:h-[650px] w-full bg-gray-200 rounded-[48px]" />
      </div>

      <div className="max-w-3xl mx-auto px-6 space-y-24">
        <div className="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm">
          <div className="h-10 w-48 bg-gray-200 rounded-xl mb-10" />
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-6 w-1/2 bg-gray-100 rounded-md" />
                <div className="h-6 w-20 bg-gray-100 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="h-12 w-64 bg-gray-200 rounded-xl mb-12" />
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-8 w-40 bg-gray-100 rounded-t-xl ml-4" />
              <div className="bg-white p-10 rounded-[32px] border border-gray-100">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-4 bg-gray-100 rounded w-5/6" />
                  <div className="h-4 bg-gray-100 rounded w-4/6" />
                </div>
                <div className="mt-8 h-64 bg-gray-200 rounded-2xl w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
