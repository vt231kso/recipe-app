export default function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mt-12">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex flex-col bg-white rounded-3xl overflow-hidden border border-gray-100 animate-pulse shadow-sm"
        >
          <div className="relative h-[280px] w-full bg-gray-200" />

          <div className="p-6 space-y-5 flex-grow">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-gray-100 rounded-md" />
                <div className="h-6 w-24 bg-gray-100 rounded-md" />
              </div>

              <div className="h-8 bg-gray-200 rounded-xl w-5/6" />
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
              <div className="h-7 w-24 bg-gray-100 rounded-md" />
              <div className="h-4 w-1/2 bg-gray-50 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
