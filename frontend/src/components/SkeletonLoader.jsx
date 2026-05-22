export function SkeletonLoader({ count = 1, type = 'card' }) {
  if (type === 'card') {
    return (
      <>
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="h-48 w-full bg-skeleton" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-skeleton rounded w-1/3" />
              <div className="h-6 bg-skeleton rounded w-5/6" />
              <div className="h-6 bg-skeleton rounded w-4/5" />
              <div className="flex gap-2 pt-2">
                <div className="h-8 bg-skeleton rounded-full w-8" />
                <div className="h-4 bg-skeleton rounded flex-1" />
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-3">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="h-4 bg-skeleton rounded w-full" />
        ))}
      </div>
    );
  }

  return null;
}

export function PageSkeleton() {
  return (
    <div className="container py-12 space-y-8">
      <div className="h-12 bg-skeleton rounded w-1/3 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader count={6} type="card" />
      </div>
    </div>
  );
}
