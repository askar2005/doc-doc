import Skeleton from './Skeleton';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <Skeleton className="h-28 w-full skeleton-shimmer" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-36 skeleton-shimmer" />
          <Skeleton className="h-36 skeleton-shimmer" />
          <Skeleton className="h-36 skeleton-shimmer" />
          <Skeleton className="h-36 skeleton-shimmer" />
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          <Skeleton className="h-96 skeleton-shimmer" />
          <Skeleton className="h-96 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}
