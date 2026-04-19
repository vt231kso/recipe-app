import Image from 'next/image';
import { RecipeWithDetails } from "@/types/recipe";

export default function CookingSteps({ steps }: { steps: RecipeWithDetails['steps'] }) {
  return (
    <section className="space-y-10 md:space-y-12">
      <div className="flex items-center gap-4 mb-12">
        <h2 className="text-5xl font-serif text-gray-900">Спосіб приготування</h2>
      </div>
      <div className="space-y-12 md:space-y-16">
        {steps?.map((step, index) => (
          <div key={step.id} className="group">
            <div className="inline-block bg-[#F3F1E9] px-4 md:px-6 py-2 rounded-t-2xl border-b-4 border-[#86E377] mb-0 ml-4 shadow-sm">
              <span className="text-sm font-black text-gray-700 uppercase tracking-tighter">
                {index + 1}/{steps.length}. {step.content.slice(0, 30)}...
              </span>
            </div>
            <div className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm space-y-8">
              <p className="text-lg md:text-2xl text-gray-800 leading-relaxed font-serif italic">{step.content}</p>
              {step.stepImageUrl && (
                <div className="relative h-56 md:h-[500px] w-full rounded-[24px] overflow-hidden shadow-inner">
                  <Image src={step.stepImageUrl} alt={`Крок ${step.order}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
