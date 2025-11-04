// Loading Skeletons untuk Landing Page
// Digunakan saat dynamic components sedang loading

export function FeaturesSectionSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950" aria-busy="true">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto"></div>
        </div>

        {/* Features Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-6 h-64">
                <div className="w-16 h-16 bg-gray-200 dark:bg-slate-800 rounded-xl mb-4"></div>
                <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingSectionSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950" aria-busy="true">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-2/3 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto"></div>
        </div>

        {/* Pricing Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-8 h-[500px]">
                <div className="h-8 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2 mb-4"></div>
                <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mb-6"></div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((j) => (
                    <div key={j} className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-full"></div>
                  ))}
                </div>
                <div className="mt-8 h-12 bg-gray-200 dark:bg-slate-800 rounded-xl w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HowItWorksSectionSkeleton() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-900" aria-busy="true">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-2/3 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto"></div>
        </div>

        {/* Steps Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse text-center">
              <div className="w-20 h-20 bg-gray-200 dark:bg-slate-800 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mx-auto mb-3"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-5/6 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSectionSkeleton() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-900" aria-busy="true">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-2/3 mx-auto"></div>
        </div>

        {/* FAQ Items Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white dark:bg-slate-950 rounded-xl p-6">
                <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function TestimonialsSectionSkeleton() {
  return (
    <section className="py-20 bg-white dark:bg-slate-950" aria-busy="true">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-16 animate-pulse">
          <div className="h-12 bg-gray-200 dark:bg-slate-800 rounded-lg w-2/3 mx-auto mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2 mx-auto"></div>
        </div>

        {/* Testimonials Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 dark:bg-slate-900 rounded-2xl p-6 h-64">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-slate-800 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 dark:bg-slate-800 rounded-lg w-2/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-slate-800 rounded-lg w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function CTASectionSkeleton() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600" aria-busy="true">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="animate-pulse">
          <div className="h-12 bg-white/20 rounded-lg w-3/4 mx-auto mb-6"></div>
          <div className="h-6 bg-white/20 rounded-lg w-2/3 mx-auto mb-8"></div>
          <div className="h-14 bg-white/20 rounded-xl w-64 mx-auto"></div>
        </div>
      </div>
    </section>
  )
}
