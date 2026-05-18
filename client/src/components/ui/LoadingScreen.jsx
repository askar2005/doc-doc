import Skeleton from './Skeleton';

export default function LoadingScreen() {
  return (
    <div className="min-h-dvh px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5">
        <Skeleton className="h-24 w-full skeleton-shimmer sm:h-28" />
        <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-32 skeleton-shimmer sm:h-36" />
          <Skeleton className="h-32 skeleton-shimmer sm:h-36" />
          <Skeleton className="h-32 skeleton-shimmer sm:h-36" />
          <Skeleton className="h-32 skeleton-shimmer sm:h-36" />
        </div>
        <div className="grid gap-3 sm:gap-4 xl:grid-cols-2">
          <Skeleton className="h-80 skeleton-shimmer sm:h-96" />
          <Skeleton className="h-80 skeleton-shimmer sm:h-96" />
        </div>
      </div>
    </div>
  );
}
